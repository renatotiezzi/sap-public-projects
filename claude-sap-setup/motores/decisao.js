#!/usr/bin/env node
'use strict';
/**
 * A DECISÃO VIRA .md (18/10/2026; SU-WI-081 #305, sob SU-F35 #303 "a conversa vira .md").
 *
 * O usuário: "excesso de contexto em mensagem é sinônimo de arquitetura ruim; numa arquitetura ideal a gente vai
 * trabalhando as mensagens, mas elas se transformam em .md". A decisão tomada na conversa vira um arquivo, na hora, pelo
 * caminho único:
 *
 *   node Sap-Speed-Up/tools/decisao.js nova "<pasta do projeto>" --titulo "<a decisão, em uma frase>"
 *        --decisao "<o que fica decidido>" --porque "<o motivo>" [--contexto "<o que levou a ela>"]
 *        [--quem "o usuário"] [--liga "#303"] [--frase "<as palavras de quem decidiu>"]
 *   node Sap-Speed-Up/tools/decisao.js lista "<pasta do projeto>"
 *
 * Grava `<pasta>/docs/decisoes/AAAA-MM-DD-<assunto>.md` (uma decisão por arquivo), põe a linha no índice
 * `docs/decisoes/README.md` (a mais nova em cima) e, uma vez, o link do índice no "Comece aqui" do README da pasta.
 * A decisão que muda outra não apaga a antiga: a nova diz qual substitui (`--substitui <arquivo>`), e a antiga ganha a
 * linha "Substituída por". O hook do espaço de trabalho (`.claude/hooks/projeto-em-dia.js`, regra 6) lembra de gravar
 * quando o pedido do usuário traz uma decisão e a resposta não gravou nenhuma.
 */
const fs = require('node:fs');
const { join, resolve, basename } = require('node:path');

const PASTA = join('docs', 'decisoes');
const CABECALHO_DO_INDICE = '# Decisões\n\nUma decisão por arquivo: o contexto, a decisão, o porquê, quem decidiu e quando. A mais nova em cima. A decisão que muda outra diz qual substitui; a antiga fica, com o link da nova (o histórico mora aqui e no git).\n\n';
const LINHA_DO_README = '- [Decisões](docs/decisoes/README.md): uma decisão por arquivo, com o contexto, o porquê, quem decidiu e quando.';

/** O assunto no nome do arquivo: minúsculas, sem acento, só letras, números e hífen (até 60). */
function assunto(titulo) {
  return String(titulo || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60).replace(/-+$/, '') || 'decisao';
}

const doisDigitos = (n) => String(n).padStart(2, '0');
const dataIso = (d) => `${d.getFullYear()}-${doisDigitos(d.getMonth() + 1)}-${doisDigitos(d.getDate())}`;
const dataBr = (d) => `${doisDigitos(d.getDate())}/${doisDigitos(d.getMonth() + 1)}/${d.getFullYear()}`;

/** O texto da decisão (o modelo fixo). */
function textoDaDecisao({ titulo, quando, quem = 'o usuário', liga = null, contexto = null, decisao, porque, frase = null, substitui = null }) {
  const linhas = [`# ${titulo}`, '', `Data: ${dataBr(quando)} · Quem decidiu: ${quem}${liga ? ` · Liga-se a: ${liga}` : ''}${substitui ? ` · Substitui: [${substitui}](${substitui})` : ''}`, ''];
  if (contexto) linhas.push('## Contexto', '', contexto, '');
  linhas.push('## Decisão', '', decisao, '');
  if (frase) linhas.push(`> ${frase.replace(/\n/g, '\n> ')}`, '');
  linhas.push('## Por quê', '', porque, '');
  return linhas.join('\n');
}

/**
 * Grava a decisão na pasta do projeto. `ler`/`escrever`/`existe`/`listar` vêm de fora nos testes. Devolve o arquivo
 * (relativo à pasta), o índice e se o README ganhou o link.
 */
function gravarDecisao(pasta, campos, { agora = () => new Date(), io = fs } = {}) {
  for (const c of ['titulo', 'decisao', 'porque']) {
    if (!String(campos[c] || '').trim()) throw new Error(`Falta --${c === 'decisao' ? 'decisao' : c}: a decisão precisa do título, do que fica decidido e do porquê.`);
  }
  if (!io.existsSync(pasta)) throw new Error(`A pasta do projeto não existe: ${pasta}`);
  const quando = agora();
  const dir = join(pasta, PASTA);
  io.mkdirSync(dir, { recursive: true });
  const base = `${dataIso(quando)}-${assunto(campos.titulo)}`;
  let nome = `${base}.md`;
  for (let i = 2; io.existsSync(join(dir, nome)); i += 1) nome = `${base}-${i}.md`;
  const substitui = campos.substitui ? basename(String(campos.substitui)) : null;
  if (substitui && !io.existsSync(join(dir, substitui))) throw new Error(`A decisão que esta substitui não existe em ${PASTA}: ${substitui}`);
  io.writeFileSync(join(dir, nome), textoDaDecisao({ ...campos, quando, substitui }), 'utf8');
  if (substitui) {
    const antiga = io.readFileSync(join(dir, substitui), 'utf8');
    if (!/^Substituída por:/m.test(antiga)) {
      io.writeFileSync(join(dir, substitui), antiga.replace(/^(# .+\n)/, `$1\nSubstituída por: [${nome}](${nome}) em ${dataBr(quando)}.\n`), 'utf8');
    }
  }
  // O índice: a mais nova em cima, logo depois do cabeçalho.
  const indice = join(dir, 'README.md');
  const atual = io.existsSync(indice) ? io.readFileSync(indice, 'utf8') : CABECALHO_DO_INDICE;
  const linha = `- ${dataBr(quando)} · [${String(campos.titulo).trim()}](${nome})${campos.liga ? ` · ${campos.liga}` : ''}${substitui ? ` · substitui ${substitui}` : ''}`;
  const corte = atual.indexOf('\n- ');
  io.writeFileSync(indice, corte >= 0 ? `${atual.slice(0, corte + 1)}${linha}\n${atual.slice(corte + 1)}` : `${atual.replace(/\n*$/, '\n\n')}${linha}\n`, 'utf8');
  // O link do índice no "Comece aqui" do README da pasta (uma vez).
  let readmeGanhou = false;
  const readme = join(pasta, 'README.md');
  if (io.existsSync(readme)) {
    const r = io.readFileSync(readme, 'utf8');
    if (!r.includes('docs/decisoes/README.md')) {
      const eol = r.includes('\r\n') ? '\r\n' : '\n';
      const linhas = r.split(/\r?\n/);
      const comece = linhas.findIndex((l) => /^##\s+Comece aqui/i.test(l));
      if (comece >= 0) {
        let fim = comece + 1;
        while (fim < linhas.length && !/^##\s/.test(linhas[fim])) fim += 1;
        let ultimo = fim - 1;
        while (ultimo > comece && !/^\s*-\s/.test(linhas[ultimo])) ultimo -= 1;
        linhas.splice(ultimo > comece ? ultimo + 1 : comece + 2, 0, LINHA_DO_README);
        io.writeFileSync(readme, linhas.join(eol), 'utf8');
        readmeGanhou = true;
      }
    }
  }
  return { arquivo: `${PASTA.replace(/\\/g, '/')}/${nome}`, indice: `${PASTA.replace(/\\/g, '/')}/README.md`, readmeGanhou };
}

/** As decisões da pasta (do índice): data, título e arquivo. */
function listarDecisoes(pasta, { io = fs } = {}) {
  const indice = join(pasta, PASTA, 'README.md');
  if (!io.existsSync(indice)) return [];
  return io.readFileSync(indice, 'utf8').split(/\r?\n/).map((l) => /^- (\d\d\/\d\d\/\d{4}) · \[(.+?)\]\((.+?)\)/.exec(l)).filter(Boolean)
    .map((m) => ({ data: m[1], titulo: m[2], arquivo: m[3] }));
}

/**
 * As frases do pedido do usuário que trazem uma decisão (o hook usa). Frases de regra, não de licença: "pode seguir" e
 * "aprovado" são o dia a dia (seguir, enviar), não uma decisão que vale depois da conversa.
 */
const SINAIS_DE_DECISAO = [
  /\b(?:decid[io]|decidimos|fica decidido|est[aá] decidido)\b/i,
  /\bfica assim\b/i,
  /\bisso (?:est[aá]|esta|ta|tá) fechado\b/i,
  /\b(?:de agora em diante|a partir de agora|daqui pra frente|daqui para frente)\b/i,
  /\bvamos (?:com|de|pelo|pela)\b/i,
  /(?:^|[^\p{L}])(?:a regra (?:é|eh|e)|sempre que|nunca mais)(?![\p{L}])/iu,
];

/** O trecho do pedido que traz a decisão (para o aviso), ou `null`. */
function trechoDeDecisao(texto) {
  const t = String(texto || '');
  for (const r of SINAIS_DE_DECISAO) {
    const m = r.exec(t);
    if (m) return t.slice(Math.max(0, m.index - 60), Math.min(t.length, m.index + m[0].length + 80)).replace(/\s+/g, ' ').trim();
  }
  return null;
}

module.exports = { assunto, textoDaDecisao, gravarDecisao, listarDecisoes, trechoDeDecisao, SINAIS_DE_DECISAO, LINHA_DO_README };

if (require.main === module) {
  const [comando, pasta, ...resto] = process.argv.slice(2);
  const flag = (nome) => { const i = resto.indexOf(nome); return i >= 0 ? resto[i + 1] : undefined; };
  try {
    if (comando === 'nova' && pasta) {
      const r = gravarDecisao(resolve(pasta), {
        titulo: flag('--titulo'), decisao: flag('--decisao'), porque: flag('--porque'), contexto: flag('--contexto'),
        quem: flag('--quem') || 'o usuário', liga: flag('--liga') || null, frase: flag('--frase') || null, substitui: flag('--substitui') || null,
      });
      console.log(`Decisão gravada: ${r.arquivo} (no índice ${r.indice}${r.readmeGanhou ? '; o README ganhou o link do índice' : ''}). Faça o commit no mesmo pedido.`);
    } else if (comando === 'lista' && pasta) {
      const ds = listarDecisoes(resolve(pasta));
      if (!ds.length) console.log('Nenhuma decisão gravada nesta pasta.');
      for (const d of ds) console.log(`${d.data}  ${d.titulo}  (docs/decisoes/${d.arquivo})`);
    } else {
      console.log('Uso:\n  node tools/decisao.js nova "<pasta do projeto>" --titulo "..." --decisao "..." --porque "..." [--contexto "..."] [--quem "o usuário"] [--liga "#303"] [--frase "..."] [--substitui <arquivo>]\n  node tools/decisao.js lista "<pasta do projeto>"');
      process.exitCode = 2;
    }
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  }
}
