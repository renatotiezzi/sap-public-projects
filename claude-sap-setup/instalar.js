#!/usr/bin/env node
'use strict';
/**
 * O instalador do modo de trabalho (a parte que só precisa do Node). O instalar.ps1 chama este, depois dos pré-requisitos.
 *
 *   node instalar.js --destino "<pasta do espaço>" [--mcp] [--claude-home <dir>] [--claude-json <arquivo>] [--forcar]
 *
 * 1. O espaço de trabalho: CLAUDE.md, AGENTS.md, .claude (settings, hooks, projetos.json), .vscode, sap-tech-lab (o template
 *    de GAP) e Sap-Speed-Up/tools (os motores). Arquivo que já existe e é diferente não é sobrescrito sem --forcar
 *    (com --forcar, a versão antiga fica ao lado, .antes-do-setup).
 * 2. O Claude Code do usuário (~/.claude): CLAUDE.md + COMO-TRABALHAMOS.md, as skills, o mod "passos" e o settings.json
 *    (junta o marketplace e os plugins, não apaga nada).
 * 3. --mcp: junta ao ~/.claude.json as entradas de mcp/claude.mcp.template.json dos apps que estão instalados.
 * 4. Confere: cada motor responde, o hook carrega, o git do espaço existe.
 */
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');

const AQUI = __dirname;
const args = process.argv.slice(2);
const opcao = (nome, padrao = null) => { const i = args.indexOf(nome); return i >= 0 ? args[i + 1] : padrao; };
const destino = path.resolve(opcao('--destino', path.join(os.homedir(), 'Trabalho')));
const claudeHome = path.resolve(opcao('--claude-home', path.join(os.homedir(), '.claude')));
const claudeJson = path.resolve(opcao('--claude-json', path.join(os.homedir(), '.claude.json')));
const forcar = args.includes('--forcar');
const comMcp = args.includes('--mcp');
const carimbo = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');

const relatorio = { copiados: 0, iguais: 0, mantidos: [], trocados: [] };
const log = (t) => console.log(t);

function copiarArquivo(de, para) {
  fs.mkdirSync(path.dirname(para), { recursive: true });
  if (fs.existsSync(para)) {
    if (Buffer.compare(fs.readFileSync(de), fs.readFileSync(para)) === 0) { relatorio.iguais++; return; }
    if (!forcar) { relatorio.mantidos.push(para); return; }
    fs.copyFileSync(para, `${para}.antes-do-setup-${carimbo}`);
    relatorio.trocados.push(para);
  }
  fs.copyFileSync(de, para);
  relatorio.copiados++;
}

function copiarPasta(de, para) {
  for (const e of fs.readdirSync(de, { withFileTypes: true })) {
    const a = path.join(de, e.name);
    const b = path.join(para, e.name);
    if (e.isDirectory()) copiarPasta(a, b);
    else copiarArquivo(a, b);
  }
}

function lerJson(arquivo, padrao) {
  try { return JSON.parse(fs.readFileSync(arquivo, 'utf8')); } catch { return padrao; }
}

function gravarJsonComCopia(arquivo, dados) {
  if (fs.existsSync(arquivo)) fs.copyFileSync(arquivo, `${arquivo}.antes-do-setup-${carimbo}`);
  fs.mkdirSync(path.dirname(arquivo), { recursive: true });
  fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2) + '\n');
}

// 1. o espaço de trabalho
log(`\n1. O espaço de trabalho em ${destino}`);
copiarPasta(path.join(AQUI, 'workspace'), destino);
const tools = path.join(destino, 'Sap-Speed-Up', 'tools');
for (const f of fs.readdirSync(path.join(AQUI, 'motores'))) {
  if (f.endsWith('.js')) copiarArquivo(path.join(AQUI, 'motores', f), path.join(tools, f));
}
copiarPasta(path.join(AQUI, 'motores', 'core'), path.join(destino, 'Sap-Speed-Up', 'packages', 'core', 'dist', 'project'));

// 2. o Claude Code do usuário
log(`2. O Claude Code do usuário em ${claudeHome}`);
copiarArquivo(path.join(AQUI, 'usuario', 'CLAUDE.md'), path.join(claudeHome, 'CLAUDE.md'));
copiarArquivo(path.join(AQUI, 'usuario', 'COMO-TRABALHAMOS.md'), path.join(claudeHome, 'COMO-TRABALHAMOS.md'));
copiarPasta(path.join(AQUI, 'usuario', 'skills'), path.join(claudeHome, 'skills'));
const modsDir = path.join(claudeHome, 'mods-setup');
copiarPasta(path.join(AQUI, 'usuario', 'mods'), modsDir);

const settingsArq = path.join(claudeHome, 'settings.json');
const settings = lerJson(settingsArq, {});
const antes = JSON.stringify(settings);
settings.extraKnownMarketplaces = settings.extraKnownMarketplaces || {};
settings.extraKnownMarketplaces['claude-plugins-official'] = settings.extraKnownMarketplaces['claude-plugins-official']
  || { source: { source: 'git', url: 'https://github.com/anthropics/claude-plugins-official.git' } };
settings.extraKnownMarketplaces.setup = { source: { source: 'directory', path: modsDir } };
settings.enabledPlugins = settings.enabledPlugins || {};
for (const p of ['passos@setup', 'commit-commands@claude-plugins-official', 'typescript-lsp@claude-plugins-official']) {
  if (!(p in settings.enabledPlugins)) settings.enabledPlugins[p] = true;
}
if (!settings.effortLevel) settings.effortLevel = 'medium';
if (JSON.stringify(settings) !== antes) gravarJsonComCopia(settingsArq, settings);

// 3. os MCPs
let nomeSps = null;
if (comMcp) {
  log(`3. Os MCPs em ${claudeJson}`);
  const modelo = lerJson(path.join(AQUI, 'mcp', 'claude.mcp.template.json'), { mcpServers: {} }).mcpServers;
  const cfg = lerJson(claudeJson, {});
  cfg.mcpServers = cfg.mcpServers || {};
  let mudou = false;
  for (const [nome, entrada] of Object.entries(modelo)) {
    if (cfg.mcpServers[nome]) { log(`   ${nome}: já existe, mantido`); continue; }
    if (entrada.command && !fs.existsSync(entrada.command)) { log(`   ${nome}: o app não está instalado (${entrada.command}), fica de fora`); continue; }
    cfg.mcpServers[nome] = entrada; mudou = true; log(`   ${nome}: ligado`);
  }
  // o Sps v1: a entrada que o próprio app gravou no Claude Desktop (o runtime e o app dentro de "resources")
  const ehSps = (e) => e && /resources[\\/]+runtime[\\/]+node\.exe$/i.test(e.command || '') && /resources[\\/]+app[\\/]+index\.js$/i.test((e.args || [])[0] || '');
  const desktop = lerJson(path.join(process.env.APPDATA || '', 'Claude', 'claude_desktop_config.json'), {}).mcpServers || {};
  const noCode = Object.keys(cfg.mcpServers).find((k) => ehSps(cfg.mcpServers[k]));
  const noDesktop = Object.keys(desktop).find((k) => ehSps(desktop[k]));
  if (noCode) log(`   Sps v1 (${noCode}): já existe, mantido`);
  else if (noDesktop) { cfg.mcpServers[noDesktop] = desktop[noDesktop]; mudou = true; log(`   Sps v1 (${noDesktop}): copiado do Claude Desktop`); }
  else log('   Sps v1: não achei a entrada no Claude Desktop; instale o app, ligue-o ao Claude Desktop e rode de novo');
  nomeSps = noCode || noDesktop || null;
  if (!cfg.mcpServers.speedup) log('   speedup: instale o app Speed Up e use "Conectar IA → Claude Code" (ver mcp/README.md)');
  if (mudou) gravarJsonComCopia(claudeJson, cfg);
}
// as permissões e o hook usam "spsv1": trocam pelo nome que o app usa
if (nomeSps && nomeSps !== 'spsv1') {
  for (const f of [path.join(destino, '.claude', 'settings.json'), path.join(tools, 'hook-protecao-de-dados.js')]) {
    const s = fs.readFileSync(f, 'utf8');
    if (s.includes('mcp__spsv1__')) { fs.writeFileSync(f, s.split('mcp__spsv1__').join(`mcp__${nomeSps}__`)); log(`   permissões do Sps v1 com o nome "${nomeSps}": ${path.basename(f)}`); }
  }
}

// 4. a conferência
log('\n4. Conferência');
let falhas = 0;
for (const f of ['board', 'decisao', 'manual-novo', 'conferir-manual', 'conferir-fonte-unica', 'conferir-ef', 'cenario-novo', 'projeto-novo', 'projeto-migrar']) {
  const r = spawnSync(process.execPath, ['--disable-warning=ExperimentalWarning', path.join(tools, `${f}.js`)], { encoding: 'utf8', timeout: 30000, windowsHide: true });
  const ok = /Uso:/.test(`${r.stdout}${r.stderr}`);
  if (!ok) falhas++;
  log(`   ${ok ? 'ok ' : 'ERRO'} motor ${f}`);
}
const hook = spawnSync(process.execPath, ['-e', `require(${JSON.stringify(path.join(destino, '.claude', 'hooks', 'projeto-em-dia.js'))})`], { input: '{}', encoding: 'utf8', timeout: 30000, windowsHide: true });
log(`   ${hook.status === 0 ? 'ok ' : 'ERRO'} hook projeto-em-dia`);
if (hook.status !== 0) { falhas++; log(hook.stderr.split('\n').slice(0, 4).join('\n')); }
if (!fs.existsSync(path.join(destino, '.git'))) {
  const g = spawnSync('git', ['init', '-q', destino], { encoding: 'utf8', windowsHide: true });
  log(`   ${g.status === 0 ? 'ok ' : 'ERRO'} git init do espaço`);
}

log(`\nArquivos: ${relatorio.copiados} copiados, ${relatorio.iguais} já iguais, ${relatorio.trocados.length} trocados (a versão antiga ficou ao lado).`);
if (relatorio.mantidos.length) {
  log(`${relatorio.mantidos.length} já existiam diferentes e foram MANTIDOS (rode com --forcar para trocar):`);
  for (const m of relatorio.mantidos.slice(0, 15)) log(`   ${m}`);
}
process.exit(falhas ? 1 : 0);
