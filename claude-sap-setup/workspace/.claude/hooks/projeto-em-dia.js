#!/usr/bin/env node
// Hook "Stop" do Claude Code (SETUP: os projetos em .claude/projetos.json) (13/10/2026): o projeto em dia a cada pedido.
//
// O usuário trabalha por prompts; a regra (CLAUDE.md, skill processo-atualizar-projeto do Speed Up) é fechar cada pedido
// com o commit citando a issue e a issue em dia no board. Este hook confere o que ESTA resposta fez (lido do transcript,
// a partir do último pedido do usuário) e segura o fim da resposta quando:
//   1. um `git commit` que toca um projeto com board (os com "board" em .claude/projetos.json) não cita a issue;
//   2. um arquivo de projeto editado nesta resposta (Edit/Write) ficou sem commit;
//   3. (13/10/2026, fonte única) o HTML de um manual foi editado sem o .md, que é a fonte;
//   4. (13/10/2026, fonte única) um arquivo novo de projeto tem nome de cópia ("(1)", "- Cópia", "_old", ".bak");
//   5. (16/10/2026, SU-WI-049 #238, o status coerente) uma issue citada num commit de projeto desta resposta segue no
//      radar (Pendente, Pronto para iniciar, Backlog), ou a conferência do board acha nela trabalho sem status, todos os
//      passos feitos com ela aberta, título com estado ou trabalho depois de fechada. Usa a rede (`gh`, por
//      `Sap-Speed-Up/tools/board.js auditar --issues`); sem rede, ou com erro, a regra 5 fica de fora.
//   6. (18/10/2026, SU-WI-081 #305, a conversa vira .md) o pedido do usuário traz uma decisão (uma frase de regra:
//      "decidi", "isso está fechado", "a regra é", "de agora em diante", "nunca mais"…) e a resposta não gravou nenhuma
//      em `docs/decisoes/` (`Sap-Speed-Up/tools/decisao.js nova`). Se não é decisão nova, a IA segue (segura uma vez).
// As regras 1 e 5 valem só para os projetos com "board"; nos com o status no docs/STATUS.md valem as regras 2, 3, 4 e 6.
// As regras 3 e 4 moram no Core do Speed Up (skill processo-fonte-unica); sem o build dele, ficam de fora. A regra 6
// usa os sinais de `Sap-Speed-Up/tools/decisao.js`; sem ele, fica de fora.
// Segura UMA vez: com `stop_hook_active`, a resposta termina (a IA já foi avisada e decide; nunca entra em laço).
// Qualquer erro aqui deixa a resposta terminar (o hook nunca trava o trabalho).
const { openSync, readSync, closeSync, fstatSync, readFileSync } = require('node:fs');
const { dirname, basename, join } = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

// SETUP: os projetos do espaço moram em .claude/projetos.json:
//   { "projetos": [{ "nome": "Meu projeto", "pasta": "MEU-PROJETO", "board": 2, "motor": false }] }
// "board": o número do GitHub Project (regras 1 e 5) ou null (status no docs/STATUS.md); "motor": o status passa pelo motor de testes (regras 7 e 8).
const escapar = (t) => String(t).split(/[\\/]+/).map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[\\\\/]+');
const CONFIG = (() => { try { return JSON.parse(readFileSync(join(__dirname, '..', 'projetos.json'), 'utf8')).projetos || []; } catch { return []; } })();
const PROJETOS = [...CONFIG.map((p) => new RegExp(escapar(p.pasta), 'i')), /Sap-Speed-Up/i];
// O `Refs` vale também logo depois de um `\n` escrito no comando (`-m "x\n\nRefs #1"`, um teste em `node -e`), onde o
// `\b` não vê a fronteira (16/10/2026).
const ANTES_DO_REFS = String.raw`(?:(?<![A-Za-z0-9_])|(?<=\\n))`;
const CITA_ISSUE = new RegExp(String.raw`${ANTES_DO_REFS}(?:refs?|close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s+#\d+`, 'i');
const ehDeProjeto = (texto) => PROJETOS.some((p) => p.test(texto));
/** Os projetos com a gestão no board do GitHub (as regras 1 e 5). Os outros têm o status no docs/STATUS.md. */
const PROJETOS_COM_BOARD = CONFIG.filter((p) => p.board).map((p) => new RegExp(escapar(p.pasta), 'i'));
const usaBoard = (texto) => PROJETOS_COM_BOARD.some((p) => p.test(texto));

/**
 * O texto de um `git commit`: o comando e, quando a mensagem vem de arquivo (`-F <arquivo>`, `--file=<arquivo>`), o
 * arquivo (16/10/2026: a mensagem escrita num arquivo, para não passar pelo heredoc, não citava a issue para o hook).
 * As variáveis definidas no próprio comando (`S="/c/..."`) são resolvidas, e o caminho do Git Bash (`/c/…`) vira `C:/…`.
 */
function textoDoCommit(cmd) {
  const vars = {};
  for (const m of cmd.matchAll(/(?:^|[\s;&|(])([A-Za-z_]\w*)=(?:"([^"]*)"|'([^']*)'|([^\s;&|]+))/g)) vars[m[1]] = m[2] ?? m[3] ?? m[4] ?? '';
  let texto = cmd;
  for (const m of cmd.matchAll(/\s(?:-F\s*|--file[=\s])(?:"([^"]+)"|'([^']+)'|([^\s;&|]+))/g)) {
    let caminho = m[1] ?? m[2] ?? m[3];
    if (!caminho || caminho === '-') continue;
    caminho = caminho.replace(/\$\{?([A-Za-z_]\w*)\}?/g, (_, v) => vars[v] ?? process.env[v] ?? '');
    caminho = caminho.replace(/^\/([a-z])\//i, (_, d) => `${d.toUpperCase()}:/`);
    try { texto += `\n${readFileSync(caminho, 'utf8')}`; } catch { /* sem o arquivo: vale o comando */ }
  }
  return texto;
}

let regrasDecisoes = null;
// 23/10/2026: as regras das decisões ("Ignorar na validação") e o que é documento de status (Core do Speed Up).
try { regrasDecisoes = require(join(__dirname, '..', '..', 'Sap-Speed-Up', 'packages', 'core', 'dist', 'project', 'regras-das-decisoes.js')); } catch { /* sem o build do Core */ }
let fonteUnica = null;
try { fonteUnica = require(join(__dirname, '..', '..', 'Sap-Speed-Up', 'packages', 'core', 'dist', 'project', 'fonte-unica.js')); } catch { /* sem o build do Core */ }
let decisoes = null;
try { decisoes = require(join(__dirname, '..', '..', 'Sap-Speed-Up', 'tools', 'decisao.js')); } catch { /* sem a ferramenta */ }

/**
 * O texto que o USUÁRIO escreveu no pedido: sem os lembretes do sistema, o conteúdo colado de outra fonte e os
 * comandos (só as palavras dele contam como decisão).
 */
function textoDoPedido(o) {
  const c = o && o.message && o.message.content;
  const bruto = typeof c === 'string' ? c : Array.isArray(c) ? c.filter((x) => x && x.type === 'text').map((x) => x.text || '').join('\n') : '';
  return bruto
    .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, ' ')
    .replace(/<pasted_content\b[\s\S]*?<\/pasted_content[^>]*>/g, ' ')
    .replace(/<(command-[a-z-]+|local-command-[a-z-]+)>[\s\S]*?<\/\1>/g, ' ');
}

/**
 * #388 (SU-WI-128): a resposta passou a gravação da decisão a outra sessão ou a um subagente, dizendo isso no pedido dela.
 * Abrir uma sessão qualquer não conta: o pedido precisa citar a ferramenta ou a pasta das decisões.
 */
function delegouADecisao(usos) {
  return usos.some((u) => /(?:^|__)(?:start_session|hand_off_to_session)$|^(?:Agent|Task)$/.test(String(u.name || ''))
    && /decisao\.js|docs[\\/]+decisoes/i.test(JSON.stringify(u.input || {})));
}

/** Regra 6: a decisão do pedido gravada em docs/decisoes/. Devolve a linha do problema, ou `null`. */
function conferirDecisao(pedido, usos, dec = decisoes) {
  if (!dec || !pedido) return null;
  const trecho = dec.trechoDeDecisao(textoDoPedido(pedido));
  if (!trecho) return null;
  const gravou = usos.some((u) => {
    const i = u.input || {};
    const caminho = String(i.file_path || '');
    return /[\\/]docs[\\/]decisoes[\\/]/i.test(caminho) || /decisao\.js["']?\s+nova\b/.test(String(i.command || ''));
  });
  if (gravou || delegouADecisao(usos)) return null;
  return `- o pedido traz uma decisão ("${trecho.slice(0, 140)}"): grave-a em docs/decisoes/ do projeto pelo caminho único (node Sap-Speed-Up/tools/decisao.js nova "<pasta do projeto>" --titulo "..." --decisao "..." --porque "..." --frase "<as palavras do usuário>" --liga "#N") e faça o commit; se não é decisão nova (já está no guia ou numa decisão gravada), siga`;
}

/** As linhas do transcript desde o último pedido do usuário (lê do fim, em blocos, sem carregar o arquivo inteiro). */
function linhasDaResposta(caminho) {
  const fd = openSync(caminho, 'r');
  try {
    const tamanho = fstatSync(fd).size;
    const BLOCO = 8 * 1024 * 1024;
    let fim = tamanho;
    let resto = '';
    const coletadas = [];
    while (fim > 0) {
      const inicio = Math.max(0, fim - BLOCO);
      const buf = Buffer.alloc(fim - inicio);
      readSync(fd, buf, 0, buf.length, inicio);
      const texto = buf.toString('utf8') + resto;
      const partes = texto.split('\n');
      resto = inicio > 0 ? partes.shift() : '';
      for (let i = partes.length - 1; i >= 0; i -= 1) {
        const l = partes[i];
        if (!l.trim()) continue;
        let o;
        try { o = JSON.parse(l); } catch { continue; }
        if (ehPedidoDoUsuario(o)) {
          const resposta = coletadas.reverse();
          resposta.pedido = o;
          return resposta;
        }
        coletadas.push(o);
      }
      fim = inicio;
    }
    return coletadas.reverse();
  } finally { closeSync(fd); }
}

function ehPedidoDoUsuario(o) {
  if (!o || o.type !== 'user' || o.isMeta || o.isSidechain) return false;
  const c = o.message && o.message.content;
  if (typeof c === 'string') return !/^<(?:command-|local-command|system-reminder)/.test(c.trim());
  return Array.isArray(c) && c.length > 0 && !c.some((x) => x && x.type === 'tool_result');
}

function ferramentas(linhas) {
  const usos = [];
  for (const o of linhas) {
    if (!o || o.type !== 'assistant' || o.isSidechain) continue;
    for (const x of (o.message && o.message.content) || []) if (x && x.type === 'tool_use') usos.push(x);
  }
  return usos;
}

function semCommit(arquivo) {
  try {
    const saida = execFileSync('git', ['-C', dirname(arquivo), 'status', '--porcelain', '--', basename(arquivo)], { encoding: 'utf8', timeout: 15000, windowsHide: true });
    return saida.trim() !== '';
  } catch { return false; }
}

/** Os boards dos projetos que fazem a gestão neles (a tabela do CLAUDE.md) (lidos do .claude/projetos.json). */
const BOARDS = [...new Set(CONFIG.filter((p) => p.board).map((p) => p.board))];

/** O board por onde começar: pela pasta que o comando do commit cita (a mensagem pode citar o outro projeto). */
function boardDoComando(cmd) {
  const p = CONFIG.find((x) => x.board && new RegExp(escapar(x.pasta), 'i').test(cmd));
  return p ? p.board : null;
}

/**
 * Regra 5: as issues citadas nos commits de projeto desta resposta, conferidas no board. Devolve as linhas do problema.
 * `rodar` vem de fora nos testes (o padrão chama `node Sap-Speed-Up/tools/board.js auditar <board> --issues … --json`).
 */
function conferirStatusDoTrabalho(usos, raiz, rodar = rodarAuditoria) {
  const citadas = new Set();
  const primeiro = [];
  for (const u of usos) {
    const cmd = u.input && typeof u.input.command === 'string' ? u.input.command : '';
    if (!/\bgit\b[^\n]*\bcommit\b/.test(cmd) || !usaBoard(cmd)) continue;
    const board = boardDoComando(cmd);
    if (board && !primeiro.includes(board)) primeiro.push(board);
    for (const m of textoDoCommit(cmd).matchAll(new RegExp(String.raw`${ANTES_DO_REFS}(?:refs?|close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s+((?:#\d+[\s,e]*)+)`, 'gi'))) {
      for (const n of m[1].matchAll(/#(\d+)/g)) citadas.add(Number(n[1]));
    }
  }
  const linhas = [];
  // Os dois boards ficam no mesmo repositório: a issue que não está no board da pasta é procurada no outro.
  let faltam = [...citadas];
  for (const board of [...primeiro, ...BOARDS.filter((b) => !primeiro.includes(b))]) {
    if (!faltam.length) break;
    const r = rodar(raiz, board, faltam);
    if (!r) continue;
    const achadas = new Set((r.situacao || []).map((s) => s.numero));
    faltam = faltam.filter((n) => !achadas.has(n));
    for (const s of r.situacao || []) {
      if (s.categoria !== 'radar') continue;
      linhas.push(`- a #${s.numero}${s.chave ? ` (${s.chave})` : ''} foi citada num commit desta resposta e o Status segue "${s.status || 'sem status'}": se o trabalho foi dela, node Sap-Speed-Up/tools/board.js status ${board} ${s.numero} "Em andamento" --evidencia "<o que foi feito>"; se foi só menção, cite só a issue da entrega`);
    }
    for (const a of r.achados || []) {
      if (!['trabalho-sem-status', 'passos-sem-status', 'passos-todos-feitos', 'titulo-com-estado', 'trabalho-em-fechada'].includes(a.motivo)) continue;
      if (a.motivo === 'trabalho-sem-status' && (r.situacao || []).some((s) => s.numero === a.numero && s.categoria === 'radar')) continue;
      linhas.push(`- #${a.numero}${a.chave ? ` (${a.chave})` : ''}: ${a.detalhe} Fazer: ${String(a.acao).replace(/<projeto>/g, String(board))}`);
    }
  }
  return linhas;
}

function rodarAuditoria(raiz, board, issues) {
  const ferramenta = join(raiz, 'Sap-Speed-Up', 'tools', 'board.js');
  const r = spawnSync(process.execPath, [ferramenta, 'auditar', String(board), '--issues', issues.join(','), '--dias', '14', '--json'], {
    encoding: 'utf8', timeout: 40000, windowsHide: true, cwd: raiz,
  });
  if (r.error || (r.status !== 0 && r.status !== 1)) return null;
  try { return JSON.parse(r.stdout); } catch { return null; }
}

/**
 * REGRAS 7 E 8 (23/10/2026; a decisão "toda conversa sobre status passa pelo motor do Speed Up"; o usuário: "vc tem que
 * GARANTIR que essa e qualquer outra conversa sobre status passe pelo seu motor… status sempre real").
 *   7. O documento de status (o STATUS, os mapas, as tabelas de validação) mudado ou comitado nesta resposta não pode
 *      contar o que uma decisão do projeto manda ignorar (a linha "Ignorar na validação" da decisão).
 *   8. Se esta resposta mudou o STATUS ou um mapa de um projeto com o motor, o motor tem que ter sido chamado nela
 *      (projeto_cenarios ou projeto_testes, ou tools/testes.js): status escrito sem o motor diverge.
 * O que foi comitado conta, não só o editado pelo editor: a conversa que grava por script também é vista.
 */
const PROJETOS_COM_MOTOR = CONFIG.filter((p) => p.motor).map((p) => ({ re: new RegExp(escapar(p.pasta), 'i'), pasta: p.pasta }));

function textosDosResultados(linhas) {
  const out = [];
  for (const o of linhas) {
    const c = o && o.type === 'user' && o.message && o.message.content;
    if (!Array.isArray(c)) continue;
    for (const x of c) {
      if (!x || x.type !== 'tool_result') continue;
      if (typeof x.content === 'string') out.push(x.content);
      else if (Array.isArray(x.content)) for (const y of x.content) if (y && typeof y.text === 'string') out.push(y.text);
    }
  }
  return out;
}

/** Os arquivos dos commits feitos nesta resposta (o hash que o git imprimiu), relativos à raiz do repositório. */
function arquivosComitados(linhas, raiz) {
  const hashes = new Set();
  for (const t of textosDosResultados(linhas)) {
    for (const m of t.matchAll(/\[[\w./-]+ ([0-9a-f]{7,40})\]/g)) hashes.add(m[1]);
    for (const m of t.matchAll(/^([0-9a-f]{7,12}) \S/gm)) hashes.add(m[1]);
  }
  const arquivos = [];
  for (const h of hashes) {
    try { arquivos.push(...execFileSync('git', ['-C', raiz, 'show', '--name-only', '--format=', h], { encoding: 'utf8', timeout: 15000, windowsHide: true }).split(/\r?\n/).filter(Boolean)); } catch { /* hash de outro repositório */ }
  }
  return arquivos;
}

function conferirStatusPeloMotor(linhas, usos, raiz) {
  if (!regrasDecisoes) return [];
  const problemas = [];
  const norm = (x) => String(x || '').replace(/\\/g, '/');
  const editados = usos.filter((u) => ['Edit', 'Write', 'NotebookEdit'].includes(u.name)).map((u) => norm(u.input && (u.input.file_path || u.input.notebook_path)));
  const comitados = arquivosComitados(linhas, raiz).map(norm);
  const usouMotor = usos.some((u) => /projeto_cenarios|projeto_testes/.test(u.name || '')
    || /projeto_cenarios|projeto_testes|tools\/testes\.js/.test(norm(u.input && (u.input.command || '')) + JSON.stringify((u.input && u.input.prompt) || '')));
  for (const pj of PROJETOS_COM_MOTOR) {
    const doProjeto = (c) => pj.re.test(c);
    const relativo = (c) => { const n = norm(c); const p = norm(pj.pasta).toLowerCase() + '/'; const i = n.toLowerCase().indexOf(p); return i >= 0 ? n.slice(i + p.length) : n; };
    const tocados = [...new Set([...editados, ...comitados].filter(doProjeto).map(relativo))].filter((c) => regrasDecisoes.ehDocumentoDeStatus(c));
    if (!tocados.length) continue;
    // Regra 8: o status mudou sem o motor.
    if (!usouMotor) problemas.push(`- status de ${pj.pasta} mudado sem o motor (${tocados.slice(0, 3).join(', ')}): o status só se afirma pelo motor do Speed Up — chame projeto_cenarios (o mapa; e validar o que mudou) e escreva só o que ele devolveu, citando a execução`);
    // Regra 7: o documento de status contraria uma decisão.
    const base = join(raiz, ...pj.pasta.split('/'));
    const dirDec = join(base, 'docs', 'decisoes');
    let decisoes = [];
    try { decisoes = require('node:fs').readdirSync(dirDec).filter((n) => /\.md$/i.test(n) && n !== 'README.md').map((n) => ({ caminho: `docs/decisoes/${n}`, texto: readFileSync(join(dirDec, n), 'utf8') })); } catch { /* sem decisões */ }
    const regras = regrasDecisoes.regrasDasDecisoes(decisoes);
    const docs = [];
    for (const c of tocados) { try { docs.push({ caminho: c, texto: readFileSync(join(base, ...c.split('/')), 'utf8') }); } catch { /* apagado */ } }
    for (const a of regrasDecisoes.conferirContraDecisoes(docs, regras).slice(0, 5)) {
      problemas.push(`- ${pj.pasta}/${a.caminho}:${a.linha} conta o que a decisão manda ignorar (${a.descricao}; ${a.decisao}): "${a.trecho}" — tire o achado (pode dizer que é esperado)`);
    }
  }
  return problemas;
}

function main(entrada) {
  if (entrada.stop_hook_active) return null;
  if (!entrada.transcript_path) return null;
  const resposta = linhasDaResposta(entrada.transcript_path);
  const usos = ferramentas(resposta);
  const problemas = [];
  for (const u of usos) {
    const cmd = u.input && typeof u.input.command === 'string' ? u.input.command : '';
    if (!/\bgit\b[^\n]*\bcommit\b/.test(cmd) || /--amend\b/.test(cmd)) continue;
    if (!usaBoard(cmd) || CITA_ISSUE.test(textoDoCommit(cmd))) continue;
    const msg = (/-m\s+"([^"\n]{1,120})/.exec(cmd) || /-m\s+'([^'\n]{1,120})/.exec(cmd) || [])[1] || cmd.slice(0, 120);
    problemas.push(`- commit sem citar a issue: "${msg}"`);
  }
  const editados = [...new Set(usos.filter((u) => ['Edit', 'Write', 'NotebookEdit'].includes(u.name))
    .map((u) => (u.input && (u.input.file_path || u.input.notebook_path)) || '')
    .filter((p) => p && ehDeProjeto(p)))];
  const pendentes = editados.filter(semCommit);
  for (const p of pendentes.slice(0, 8)) problemas.push(`- editado e sem commit: ${p}`);
  if (pendentes.length > 8) problemas.push(`- e mais ${pendentes.length - 8} arquivo(s) de projeto sem commit`);
  if (fonteUnica) {
    const norm = (p) => p.replace(/\\/g, '/').toLowerCase();
    const tocados = new Set(editados.map(norm));
    for (const p of editados) {
      if (fonteUnica.ehManualHtml(p) && !tocados.has(norm(p).replace(/\.html?$/, '.md'))) {
        problemas.push(`- o HTML do manual foi editado sem o .md (o .md é a fonte: mude ali e gere o HTML dele): ${p}`);
      }
    }
    const criados = [...new Set(usos.filter((u) => u.name === 'Write').map((u) => (u.input && u.input.file_path) || '').filter((p) => p && ehDeProjeto(p)))];
    for (const p of criados) {
      if (fonteUnica.ehNomeDeCopia(basename(p))) problemas.push(`- arquivo novo com nome de cópia (atualize o original; o histórico fica no git): ${p}`);
    }
  }
  // Regra 5 (16/10/2026): o status do trabalho desta resposta. A raiz do Git_HUB é a pasta acima de .claude.
  try {
    problemas.push(...conferirStatusDoTrabalho(usos, join(__dirname, '..', '..')));
  } catch { /* sem rede ou sem o build: a regra 5 fica de fora */ }
  // Regras 7 e 8 (23/10/2026): o status passa pelo motor e respeita as decisões do projeto.
  try {
    problemas.push(...conferirStatusPeloMotor(resposta, usos, join(__dirname, '..', '..')));
  } catch { /* sem o build ou sem o git: as regras 7 e 8 ficam de fora */ }
  // Regra 6 (18/10/2026, SU-WI-081 #305): a decisão do pedido vira .md.
  try {
    const d = conferirDecisao(resposta.pedido, usos);
    if (d) problemas.push(d);
  } catch { /* sem a ferramenta: a regra 6 fica de fora */ }
  if (!problemas.length) return null;
  return {
    decision: 'block',
    reason: [
      'Antes de encerrar, o projeto em dia (CLAUDE.md, regra de cada pedido; skills processo-atualizar-projeto e processo-fonte-unica):',
      ...problemas,
      'Faça o commit. No Speed Up, cite a issue (Refs #N, ou Closes #N quando a entrega termina com evidência), deixe-a em dia no board pelo caminho único (node Sap-Speed-Up/tools/board.js status <board> <issue> "<Status>" --evidencia "...") e abra a issue do que entrou no radar. Nos projetos sem board, o status mora no docs/STATUS.md: atualize-o quando o status mudar (o board é só histórico). Fonte única: nada de cópia, e o que é gerado sai da fonte. Se o trabalho ficou pela metade de propósito, diga isso ao usuário em vez de commitar.',
    ].join('\n'),
  };
}

if (require.main !== module) {
  module.exports = { conferirStatusPeloMotor, arquivosComitados, conferirStatusDoTrabalho, boardDoComando, textoDoCommit, CITA_ISSUE, conferirDecisao, textoDoPedido, usaBoard, main };
  return;
}

let dados = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (d) => { dados += d; });
process.stdin.on('end', () => {
  try {
    const r = main(JSON.parse(dados || '{}'));
    if (r) process.stdout.write(JSON.stringify(r));
  } catch { /* o hook nunca trava o trabalho */ }
  process.exit(0);
});
