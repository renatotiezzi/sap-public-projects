#!/usr/bin/env node
'use strict';
/**
 * AS REGRAS NO CLAUDE da proteção de dados (SU-F48 #575): um hook PreToolUse do Claude Code.
 *
 * O túnel cuida do que passa pelo Speed Up; este hook fecha os outros caminhos do Claude até o dado:
 *  - em qualquer conversa, com algum cliente protegido: nada lê a área protegida (o de-para e o arquivo final) nem o banco do perfil;
 *  - dentro da pasta de um projeto protegido: ficam barrados o Sps v1, o controle da tela, os navegadores, o REA e os MCPs da SAP,
 *    o SAP GUI e o RFC por script. O SAP só se lê pelo sap_execute, que passa pelo túnel.
 *
 * Sem cliente protegido, o hook não faz nada. Ele nunca lê valores, só a lista de clientes.
 */
const { existsSync, readFileSync } = require('node:fs');
const { join, resolve, sep } = require('node:path');

function perfil(env = process.env) {
  if (env.SPEEDUP_DATA_ROOT) return env.SPEEDUP_DATA_ROOT;
  return join(env.LOCALAPPDATA || join(env.USERPROFILE || '', 'AppData', 'Local'), 'SpeedUp');
}

function clientesLigados(raiz) {
  const arquivo = join(raiz, 'protecao-de-dados', 'clientes.json');
  if (!existsSync(arquivo)) return [];
  try {
    return Object.values(JSON.parse(readFileSync(arquivo, 'utf8'))).filter((c) => c && c.ligada);
  } catch {
    return [{ ligada: true, pastas: [], ilegivel: true }];
  }
}

const FORA_DO_TUNEL = /^(?:mcp__spsv1__|mcp__computer-use__|mcp__claude-in-chrome__|mcp__Claude_Browser__|mcp__speedup__(?:rea_executar|mcp_sap_executar|sap_gui_))/;
const SAP_POR_FORA = /\b(?:saplogon|sapshcut|sapgui|pyrfc|sapnwrfc|sapjco|node-rfc)\b/i;
/** A pasta do perfil, a versão visual e os documentos exportados, que trazem o valor real; não qualquer arquivo com esse nome: o código e os testes da proteção, no repositório, seguem abertos. */
const AREA_PROTEGIDA = /speedup[\\/]+protecao-de-dados|protecao-de-dados[\\/]+(?:arquivos|de-para|clientes\.json)|speedup[\\/]+data[\\/]+project[\\/]|downloads[\\/]+speed up/i;
/** A sessão da janela e a rota de ligar e desligar: a IA não muda a proteção pelo serviço local. */
const SESSAO_DA_JANELA = /session\/desktop|project\/protecao-de-dados/i;
const BANCO_DO_PERFIL = /speedup[\\/][^\s"']*\.(?:db|sqlite3?)(?:-wal|-shm)?\b/i;

function dentroDe(cwd, pasta) {
  const c = `${resolve(cwd).toLowerCase()}${sep}`;
  const p = `${resolve(pasta).toLowerCase()}${sep}`;
  return c.startsWith(p);
}

/** A decisão, separada da entrada para o teste chamar direto. Devolve o motivo da recusa, ou null. */
function decidir({ tool_name: ferramenta = '', tool_input: entrada = {}, cwd = process.cwd() }, ligados) {
  if (!ligados.length) return null;
  // Só o caminho ou o comando: o conteúdo de um arquivo que se escreve não é um acesso à área protegida.
  const texto = JSON.stringify(entrada);
  const alvo = /^(?:Bash|PowerShell)$/.test(ferramenta) ? String(entrada.command ?? '') : [entrada.file_path, entrada.path, entrada.notebook_path, entrada.pattern, entrada.glob].filter(Boolean).join(' ');
  if (/^(?:Read|Edit|Write|Grep|Glob|Bash|PowerShell|NotebookEdit)$/.test(ferramenta) && (AREA_PROTEGIDA.test(alvo) || BANCO_DO_PERFIL.test(alvo))) {
    return 'A área protegida do Speed Up (o de-para, o arquivo final e o banco do perfil) tem o dado real: a IA não lê. O arquivo final é para o consultor abrir.';
  }
  if (/^(?:Bash|PowerShell)$/.test(ferramenta) && SESSAO_DA_JANELA.test(alvo)) {
    return 'Com um cliente protegido, a sessão da janela e a rota da proteção ficam com a pessoa: a IA não muda a proteção. Use a tela do cliente, em Conexões.';
  }
  const naPasta = ligados.some((c) => c.ilegivel || (c.pastas || []).some((p) => dentroDe(cwd, p)));
  if (!naPasta) return null;
  if (FORA_DO_TUNEL.test(ferramenta)) return `Este projeto tem proteção de dados: ${ferramenta} fica fora do túnel. Leia o SAP pelo sap_execute do Speed Up.`;
  if (/^(?:Bash|PowerShell)$/.test(ferramenta) && SAP_POR_FORA.test(texto)) return 'Este projeto tem proteção de dados: o SAP não se lê por script. Use o sap_execute do Speed Up.';
  return null;
}

function principal() {
  let bruto = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (d) => { bruto += d; });
  process.stdin.on('end', () => {
    let pedido = {};
    try { pedido = JSON.parse(bruto || '{}'); } catch { /* sem pedido legível, nada a decidir */ }
    const motivo = decidir(pedido, clientesLigados(perfil()));
    if (motivo) {
      process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: motivo } }));
    }
    process.exit(0);
  });
}

if (require.main === module) principal();
module.exports = { decidir, clientesLigados, perfil };
