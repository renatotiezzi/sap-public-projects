"use strict";
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// packages/core/dist/project/manual.js
var require_manual = __commonJS({
  "packages/core/dist/project/manual.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.versaoDoTexto = versaoDoTexto;
    exports2.lerManual = lerManual;
    exports2.marcarPasso = marcarPasso;
    var CAIXA = /^(\s*)([-*+])\s+\[( |x|X)\]\s+(.*?)\s*$/;
    var VERSAO = /Vers[aã]o\s+(\d+(?:\.\d+)+)\s*[·•|,–—-]\s*(\d{2}\/\d{2}\/\d{4})/i;
    var TITULO = /^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/;
    var FEITO = /\s+—\s+feito em\s.*$/i;
    var LINHA_DO_ENTREGAVEL = /^\s*(?:[-*]\s*)?\**\s*(?:entreg[aá]ve(?:l|is)|frentes?)\s*\**\s*:\s*(.+)$/i;
    var ID_DO_BOARD = /\b[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+\b/g;
    var DATA_DO_FEITO = /feito em\s+(\d{2})\/(\d{2})\/(\d{4})/i;
    var LINHA_DA_ENTREGA = /^\s*(?:[-*]\s*)?\**\s*entregas?\s*\**\s*:\s*(.*#\d+.*)$/i;
    var linhasDe = (md) => String(md ?? "").split(/\r?\n/);
    function versaoDoTexto(texto) {
      const v = VERSAO.exec(String(texto ?? ""));
      return v ? { versao: v[1], data: v[2] } : null;
    }
    var semMarcacao = (s) => s.replace(/[*_`]/g, "").trim();
    function lerManual(md) {
      const linhas = linhasDe(md ?? "");
      let titulo = null;
      let secao = null;
      let versao = null;
      let data = null;
      const passos = [];
      const historico = [];
      const entregaveis = [];
      let entregasPorNivel = [];
      let nivelAtual = 0;
      let emHistorico = false;
      let emCodigo = false;
      linhas.forEach((l, i) => {
        if (/^\s*(```|~~~)/.test(l)) {
          emCodigo = !emCodigo;
          return;
        }
        if (emCodigo)
          return;
        const e = LINHA_DO_ENTREGAVEL.exec(l);
        if (e) {
          for (const id of e[1].match(ID_DO_BOARD) ?? [])
            if (/\d/.test(id) && !entregaveis.includes(id))
              entregaveis.push(id);
        }
        const en = LINHA_DA_ENTREGA.exec(l);
        if (en) {
          const issues = [...en[1].matchAll(/#(\d+)/g)].map((m) => Number(m[1]));
          entregasPorNivel = entregasPorNivel.filter((x) => x.nivel < nivelAtual);
          entregasPorNivel.push({ nivel: nivelAtual, issues });
          return;
        }
        const t = TITULO.exec(l);
        if (t) {
          const texto = semMarcacao(t[2]);
          if (t[1] === "#" && titulo === null)
            titulo = texto;
          else if (t[1].length <= 3)
            secao = texto;
          if (t[1].length > 1) {
            nivelAtual = t[1].length;
            entregasPorNivel = entregasPorNivel.filter((x) => x.nivel < nivelAtual);
          }
          emHistorico = /^hist[oó]rico de vers/i.test(texto);
          return;
        }
        if (versao === null) {
          const v = versaoDoTexto(l);
          if (v) {
            versao = v.versao;
            data = v.data;
          }
        }
        if (emHistorico && /^\s*\|/.test(l) && !/^\s*\|?\s*:?-{3,}/.test(l)) {
          const c2 = l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((x) => semMarcacao(x));
          if (c2.length >= 3 && /^\d+(?:\.\d+)+$/.test(c2[0]))
            historico.push({ versao: c2[0], data: c2[1], oQueMudou: c2[2] });
          return;
        }
        const c = CAIXA.exec(l);
        if (c)
          passos.push({ linha: i + 1, feito: c[3] !== " ", texto: c[4], secao, entregas: [...new Set(entregasPorNivel.flatMap((x) => x.issues))] });
      });
      const feitos = passos.filter((p) => p.feito).length;
      let ultimoFeito = null;
      let chaveDoUltimo = "";
      for (const p of passos) {
        const d = p.feito ? DATA_DO_FEITO.exec(p.texto) : null;
        if (!d)
          continue;
        const chave = `${d[3]}${d[2]}${d[1]}`;
        if (chave >= chaveDoUltimo) {
          chaveDoUltimo = chave;
          const texto = semMarcacao(p.texto.replace(/\s*[—–.-]?\s*feito em\s.*$/i, ""));
          ultimoFeito = { texto: texto.length > 110 ? `${texto.slice(0, 109).trimEnd()}\u2026` : texto, data: `${d[1]}/${d[2]}/${d[3]}`, secao: p.secao };
        }
      }
      return { titulo, versao, data, passos, feitos, total: passos.length, historico, entregaveis, ultimoFeito };
    }
    function marcarPasso(md, linha, feito, opts) {
      const nl = md.includes("\r\n") ? "\r\n" : "\n";
      const linhas = md.split(/\r?\n/);
      const i = linha - 1;
      if (!Number.isInteger(linha) || i < 0 || i >= linhas.length)
        throw new Error(`A linha ${linha} n\xE3o existe no manual.`);
      const c = CAIXA.exec(linhas[i]);
      if (!c)
        throw new Error(`A linha ${linha} do manual n\xE3o \xE9 uma caixa de marcar (- [ ]).`);
      const limpa = (s) => String(s ?? "").replace(/[\r\n]+/g, " ").trim();
      let texto = c[4].replace(FEITO, "");
      if (feito) {
        const quem = limpa(opts.quem);
        const prova = limpa(opts.prova);
        texto += ` \u2014 feito em ${limpa(opts.quando)}${quem ? ` por ${quem}` : ""}${prova ? `; prova: ${prova}` : ""}.`;
      }
      linhas[i] = `${c[1]}${c[2]} [${feito ? "x" : " "}] ${texto}`;
      return linhas.join(nl);
    }
  }
});

// packages/core/dist/project/cenario.js
var require_cenario = __commonJS({
  "packages/core/dist/project/cenario.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ehCenario = exports2.REFERENCIA = exports2.PASTA_DOS_RESULTADOS = exports2.PASTA_DOS_CENARIOS = exports2.PASTA_DOS_TESTES = exports2.PREDICADOS_DO_ASSERT = exports2.SECOES_DO_CENARIO = exports2.CAMPOS_DO_CENARIO = void 0;
    exports2.slugDoCenario = slugDoCenario;
    exports2.lerAssert = lerAssert;
    exports2.lerCenario = lerCenario;
    exports2.caminhoDoCenario = caminhoDoCenario;
    exports2.conferirCenarios = conferirCenarios;
    exports2.modeloDeCenario = modeloDeCenario;
    exports2.CAMPOS_DO_CENARIO = Object.freeze(["id", "titulo", "grupo", "frente", "sistema", "issue"]);
    exports2.SECOES_DO_CENARIO = Object.freeze(["Objetivo", "Pr\xE9-condi\xE7\xF5es", "Passos", "Esperado", "Evid\xEAncia"]);
    exports2.PREDICADOS_DO_ASSERT = Object.freeze(["==", "!=", ">=", "<=", ">", "<", "contains", "matches", "exists"]);
    exports2.PASTA_DOS_TESTES = "testes";
    exports2.PASTA_DOS_CENARIOS = "testes/cenarios";
    exports2.PASTA_DOS_RESULTADOS = "testes/resultados";
    var ID_DO_CENARIO = /^[A-Z][A-Z0-9]{1,9}-\d{3}$/;
    var CAMINHO_DO_CENARIO = /^testes\/cenarios\/([^/]+)\/([^/]+)\.md$/i;
    var MARCA_DO_MODELO = /<(?:[a-zà-ú][^<>\n]*\s[^<>\n]*|sap\.[^<>\s]+)>/;
    function slugDoCenario(texto) {
      return String(texto ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/(?<=[a-z0-9])\/(?=[a-z0-9])/gi, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
    }
    function valorSimples(bruto) {
      const v = bruto.trim();
      if (/^".*"$|^'.*'$/.test(v))
        return v.slice(1, -1);
      if (/^-?\d+(?:\.\d+)?$/.test(v))
        return Number(v);
      if (v === "true" || v === "false")
        return v === "true";
      if (v === "null" || v === "")
        return null;
      return v;
    }
    function lerAssert(texto) {
      const t = String(texto ?? "").trim();
      const m = /^(status|jsonpath)(?:\s+"([^"]+)")?(\s+count)?(\s+not)?\s+(==|!=|>=|<=|>|<|contains|matches|exists)(?:\s+(.+))?$/.exec(t);
      if (!m)
        return null;
      const consulta = m[1];
      const caminho = m[2] ?? null;
      if (consulta === "jsonpath" && !caminho)
        return null;
      if (consulta === "status" && (caminho || m[3]))
        return null;
      const predicado = m[5];
      const valor = m[6] === void 0 ? null : valorSimples(m[6]);
      if (predicado === "exists" ? m[6] !== void 0 : m[6] === void 0)
        return null;
      if (m[3] && typeof valor !== "number" && !(typeof valor === "string" && exports2.REFERENCIA.test(valor)))
        return null;
      return { consulta, caminho, contar: Boolean(m[3]), negado: Boolean(m[4]), predicado, valor, texto: t };
    }
    exports2.REFERENCIA = /^\{\{([A-Za-z_][\w]*(?:[+-]\d+)?)\}\}$/;
    function lerFrontMatter(linhas, erros) {
      const campos = {};
      if (linhas[0]?.trim() !== "---") {
        erros.push("falta o front matter (--- no topo, com os campos e --- no fim)");
        return { campos, fim: 0 };
      }
      const fim = linhas.findIndex((l, i) => i > 0 && l.trim() === "---");
      if (fim < 0) {
        erros.push("o front matter n\xE3o fecha (falta o segundo ---)");
        return { campos, fim: 0 };
      }
      for (let i = 1; i < fim; i++) {
        const l = linhas[i];
        if (!l.trim() || l.trim().startsWith("#"))
          continue;
        const m = /^([a-z_]+):\s*(.*)$/.exec(l.trim());
        if (!m) {
          erros.push(`linha ${i + 1} do front matter fora do formato "campo: valor"`);
          continue;
        }
        const v = m[2].trim();
        campos[m[1]] = /^\[.*\]$/.test(v) ? v.slice(1, -1).split(",").map((x) => String(valorSimples(x) ?? "")).filter(Boolean) : String(valorSimples(v) ?? "");
      }
      return { campos, fim: fim + 1 };
    }
    function lerBloco(linhas, inicio, erros) {
      const passos = [];
      let atual = null;
      for (let i = inicio; i < linhas.length; i++) {
        const l = linhas[i].trim();
        if (/^(?:```|~~~)/.test(l))
          break;
        if (!l || l.startsWith("#"))
          continue;
        const chave = l.split(/\s+/)[0];
        const valor = l.slice(chave.length).trim();
        if (chave === "passo") {
          if (!valor)
            erros.push(`linha ${i + 1}: o passo sem nome`);
          atual = { nome: valor, linha: i + 1, capacidade: null, conexao: null, args: {}, asserts: [] };
          passos.push(atual);
          continue;
        }
        if (!atual) {
          erros.push(`linha ${i + 1}: "${chave}" antes do primeiro "passo"`);
          continue;
        }
        if (chave === "capacidade")
          atual.capacidade = valor || null;
        else if (chave === "conexao")
          atual.conexao = valor || null;
        else if (chave === "args") {
          try {
            const a = JSON.parse(valor || "{}");
            if (!a || typeof a !== "object" || Array.isArray(a))
              throw new Error("n\xE3o \xE9 objeto");
            atual.args = a;
          } catch {
            erros.push(`linha ${i + 1}: args n\xE3o \xE9 um objeto JSON numa linha`);
          }
        } else if (chave === "assert") {
          const a = lerAssert(valor);
          if (a)
            atual.asserts.push(a);
          else
            erros.push(`linha ${i + 1}: assert fora da gram\xE1tica ("${valor}")`);
        } else if (chave === "guardar") {
          const g = /^([A-Za-z_]\w*)\s+jsonpath\s+"([^"]+)"(\s+count)?$/.exec(valor);
          if (g)
            (atual.guardar ??= []).push({ nome: g[1], caminho: g[2], contar: Boolean(g[3]) });
          else
            erros.push(`linha ${i + 1}: guardar fora da gram\xE1tica (guardar <nome> jsonpath "<caminho>" [count])`);
        } else if (chave === "motivo") {
          const m = /^(\S+)(?:\s+(\{.*\}))?$/.exec(valor);
          try {
            if (!m)
              throw new Error("sem capacidade");
            const a = JSON.parse(m[2] ?? "{}");
            if (!a || typeof a !== "object" || Array.isArray(a))
              throw new Error("n\xE3o \xE9 objeto");
            atual.motivo = { capacidade: m[1], args: a };
          } catch {
            erros.push(`linha ${i + 1}: motivo fora da gram\xE1tica (motivo <capacidade> <args em JSON>)`);
          }
        } else
          erros.push(`linha ${i + 1}: "${chave}" n\xE3o \xE9 passo, capacidade, conexao, args, assert, guardar nem motivo`);
      }
      return passos;
    }
    function lerCenario(texto) {
      const erros = [];
      const linhas = String(texto ?? "").replace(/^﻿/, "").split(/\r?\n/);
      const { campos, fim } = lerFrontMatter(linhas, erros);
      for (const c of exports2.CAMPOS_DO_CENARIO)
        if (!String(campos[c] ?? "").trim())
          erros.push(`falta o campo "${c}"`);
      const id = String(campos.id ?? "");
      if (id && !ID_DO_CENARIO.test(id))
        erros.push(`o id "${id}" n\xE3o segue PREFIXO-000 (ex.: FIN-003)`);
      if (campos.issue && !/^#?\d+$/.test(String(campos.issue)))
        erros.push(`a issue "${campos.issue}" n\xE3o \xE9 um n\xFAmero`);
      const secoes = [];
      const textoEsperado = [];
      let passos = [];
      let blocos = 0;
      let emCodigo = false;
      for (let i = fim; i < linhas.length; i++) {
        const l = linhas[i];
        if (/^\s*(?:```|~~~)/.test(l)) {
          if (!emCodigo && /^\s*(?:```|~~~)\s*cenario\s*$/.test(l)) {
            blocos++;
            passos = passos.concat(lerBloco(linhas, i + 1, erros));
            const fecha = linhas.findIndex((x, k) => k > i && /^\s*(?:```|~~~)/.test(x));
            i = fecha < 0 ? linhas.length : fecha;
            continue;
          }
          emCodigo = !emCodigo;
          continue;
        }
        if (emCodigo)
          continue;
        const m = /^##\s+(.+?)\s*$/.exec(l);
        if (m) {
          secoes.push(m[1]);
          continue;
        }
        if (secoes[secoes.length - 1] === "Esperado" && l.trim())
          textoEsperado.push(l.trim());
      }
      let bloco = "fora";
      const porPreencher = linhas.slice(fim).filter((l) => {
        if (/^\s*(?:```|~~~)/.test(l)) {
          bloco = bloco !== "fora" ? "fora" : /cenario\s*$/.test(l) ? "cenario" : "comum";
          return false;
        }
        return bloco !== "comum" && MARCA_DO_MODELO.test(l);
      }).length;
      if (porPreencher)
        erros.push(`falta preencher ${porPreencher} linha(s) do modelo (os <\u2026>)`);
      const faltam = exports2.SECOES_DO_CENARIO.filter((s) => !secoes.includes(s));
      if (faltam.length)
        erros.push(`falta a se\xE7\xE3o ${faltam.map((s) => `"## ${s}"`).join(", ")}`);
      else {
        const ordem = exports2.SECOES_DO_CENARIO.map((s) => secoes.indexOf(s));
        if (ordem.some((p, k) => k > 0 && p < ordem[k - 1]))
          erros.push(`as se\xE7\xF5es fora da ordem (${exports2.SECOES_DO_CENARIO.join(", ")})`);
      }
      if (!blocos)
        erros.push("falta o bloco ```cenario com os passos execut\xE1veis");
      else if (blocos > 1)
        erros.push("mais de um bloco ```cenario (os passos v\xE3o num bloco s\xF3)");
      if (blocos && !passos.length)
        erros.push('o bloco ```cenario n\xE3o tem nenhum "passo"');
      const capacidadeDoTopo = String(campos.capacidade ?? "").trim();
      for (const p of passos) {
        if (!p.capacidade && !capacidadeDoTopo)
          erros.push(`o passo "${p.nome}" sem capacidade (no passo ou no front matter)`);
        if (!p.asserts.length)
          erros.push(`o passo "${p.nome}" sem assert (o que prova que deu certo)`);
      }
      return { campos, secoes, esperado: textoEsperado.join(" "), passos, erros };
    }
    function caminhoDoCenario(c) {
      return `${exports2.PASTA_DOS_CENARIOS}/${slugDoCenario(c.grupo)}/${c.id}-${slugDoCenario(c.titulo)}.md`;
    }
    var ehCenario = (caminho) => CAMINHO_DO_CENARIO.test(String(caminho ?? "").replace(/\\/g, "/")) && !/\/readme\.md$/i.test(String(caminho));
    exports2.ehCenario = ehCenario;
    function conferirCenarios(e) {
      const achados = [];
      const doTeste = e.caminhos.filter((c) => /^testes\/cenarios\//i.test(c) && /\.md$/i.test(c) && !/\/readme\.md$/i.test(c));
      if (!doTeste.length)
        return achados;
      const indice = e.ler(`${exports2.PASTA_DOS_TESTES}/README.md`);
      const porId = /* @__PURE__ */ new Map();
      for (const caminho of doTeste) {
        const m = CAMINHO_DO_CENARIO.exec(caminho);
        if (!m) {
          achados.push({ tipo: "cenario-fora-do-lugar", caminho, detalhe: "o cen\xE1rio mora em testes/cenarios/<grupo>/<ID>-<assunto>.md, um n\xEDvel abaixo da pasta do grupo" });
          continue;
        }
        const c = lerCenario(e.ler(caminho));
        const aLigar = String(c.campos.situacao ?? "").trim().toLowerCase() === "a-ligar";
        if (aLigar)
          achados.push({ tipo: "cenario-a-ligar", caminho, detalhe: `rascunho importado${c.campos.origem ? ` (${String(c.campos.origem)})` : ""}: falta ligar o bloco execut\xE1vel (a capacidade, a conex\xE3o e os asserts), pelo testes/PROMPT-LIGAR.md` });
        else if (c.erros.length)
          achados.push({ tipo: "cenario-fora-do-padrao", caminho, detalhe: c.erros.join("; ") });
        const id = String(c.campos.id ?? "");
        const grupo = String(c.campos.grupo ?? "");
        if (id) {
          porId.set(id, [...porId.get(id) ?? [], caminho]);
          if (!m[2].startsWith(`${id}-`))
            achados.push({ tipo: "cenario-fora-do-lugar", caminho, detalhe: `o nome do arquivo come\xE7a pelo id (${id}-<assunto>.md)` });
        }
        if (grupo && slugDoCenario(grupo) !== m[1].toLowerCase())
          achados.push({ tipo: "cenario-fora-do-lugar", caminho, detalhe: `o grupo "${grupo}" mora na pasta testes/cenarios/${slugDoCenario(grupo)}/` });
        const relativo = caminho.slice(`${exports2.PASTA_DOS_TESTES}/`.length);
        const citado = indice !== null && [caminho, relativo, encodeURI(relativo), relativo.replace(/ /g, "%20")].some((x) => indice.includes(x));
        if (!citado)
          achados.push({ tipo: "cenario-fora-do-indice", caminho, detalhe: indice === null ? "falta testes/README.md com o \xEDndice dos cen\xE1rios" : "n\xE3o est\xE1 no \xEDndice testes/README.md" });
      }
      for (const [id, lista] of porId) {
        if (lista.length > 1)
          achados.push({ tipo: "cenario-repetido", caminho: [...lista].sort()[0], detalhe: `o id ${id} tamb\xE9m em ${[...lista].sort().slice(1).join(", ")}` });
      }
      return achados;
    }
    function modeloDeCenario(c) {
      const linhas = [
        "---",
        `id: ${c.id}`,
        `titulo: ${c.titulo}`,
        `grupo: ${c.grupo}`,
        `frente: ${c.frente}`,
        `sistema: ${c.sistema}`,
        ...c.conexao ? [`conexao: ${c.conexao}`] : [],
        ...c.capacidade ? [`capacidade: ${c.capacidade}`] : [],
        `tags: [${(c.tags ?? []).join(", ")}]`,
        `issue: ${c.issue}`,
        `prioridade: ${c.prioridade ?? "media"}`,
        "---",
        `# ${c.id} \u2014 ${c.titulo}`,
        "",
        "## Objetivo",
        "",
        "<o que este cen\xE1rio prova, em uma ou duas frases>",
        "",
        "## Pr\xE9-condi\xE7\xF5es",
        "",
        "- <o que precisa estar pronto: o artefato implantado e a vers\xE3o, a massa de dados, a conex\xE3o>",
        "",
        "## Passos",
        "",
        "1. <o que o motor faz, na ordem, em palavras de gente>",
        "",
        "## Esperado",
        "",
        '<o resultado que diz "est\xE1 certo">',
        "",
        "## Evid\xEAncia",
        "",
        "<o que o motor guarda em testes/resultados/ como prova>",
        "",
        "```cenario",
        "passo <nome do passo>",
        `  capacidade ${c.capacidade ?? "<sap.cpi.messages.list>"}`,
        "  args {}",
        "  assert status == ok",
        "```",
        ""
      ];
      return linhas.join("\n");
    }
  }
});

// packages/core/dist/project/fonte-unica.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.ehNomeDeCopia = exports.ehManualHtml = exports.ehManualMd = exports.TETO_DO_ESTADO = exports.ROTULO_DO_ACHADO = void 0;
exports.marcasAEsclarecer = marcasAEsclarecer;
exports.textoDoHtml = textoDoHtml;
exports.conferirFonteUnica = conferirFonteUnica;
var manual_js_1 = require_manual();
var cenario_js_1 = require_cenario();
exports.ROTULO_DO_ACHADO = Object.freeze({
  "manual-sem-md": "Manual em HTML sem o .md ao lado (o HTML sai do .md)",
  "versao-diferente": "Manual com vers\xE3o diferente no HTML e no .md (gere o HTML de novo)",
  "manual-sem-versao": 'Manual .md sem "Vers\xE3o X.Y \xB7 data" no topo',
  "manual-sem-caixas": "Manual .md sem caixas de marcar (o estado dos passos est\xE1 em outro lugar)",
  "fora-do-indice": "Documento fora do \xEDndice do README da pasta",
  "mesmo-conteudo": "O mesmo conte\xFAdo em mais de um arquivo",
  "nome-de-copia": "Nome de c\xF3pia (a vers\xE3o mora no arquivo e o hist\xF3rico no git)",
  "arquivo-de-status": "Arquivo de status na pasta (a gest\xE3o mora no board)",
  "a-esclarecer": "Marca [A ESCLARECER] (o que falta decidir: decida, grave em docs/decisoes/ e tire a marca)",
  "estado-grande": "O ESTADO.md cresceu (ele diz s\xF3 onde estamos e o pr\xF3ximo passo; o hist\xF3rico mora no guia, nas decis\xF5es e no git)",
  "cenario-fora-do-padrao": "Cen\xE1rio de teste fora do formato (o front matter, as cinco se\xE7\xF5es e o bloco ```cenario com assert)",
  "cenario-fora-do-lugar": "Cen\xE1rio de teste fora do lugar (testes/cenarios/<grupo>/<ID>-<assunto>.md)",
  "cenario-repetido": "O mesmo id em dois cen\xE1rios de teste",
  "cenario-fora-do-indice": "Cen\xE1rio de teste fora do \xEDndice testes/README.md",
  "cenario-a-ligar": "Cen\xE1rio importado (o plano de testes da Glasslake) com o bloco execut\xE1vel a ligar (testes/PROMPT-LIGAR.md)"
});
exports.TETO_DO_ESTADO = Object.freeze({ linhas: 80, caracteres: 8e3 });
var SECAO_QUE_NAO_E_DO_ESTADO = /^##\s+(hist[oó]rico|o que j[aá] fizemos|decis[oõ]es|o que cadastramos|changelog)\b.*$/gim;
var CAMINHOS_DO_ESTADO = ["ESTADO.md", "docs/ESTADO.md"];
var TAMANHO_MAXIMO_PARA_A_MARCA = 2 * 1024 * 1024;
function marcasAEsclarecer(texto) {
  const achadas = [];
  let emBloco = false;
  String(texto ?? "").split(/\r?\n/).forEach((l, i) => {
    if (/^\s*(?:```|~~~)/.test(l)) {
      emBloco = !emBloco;
      return;
    }
    if (emBloco)
      return;
    for (const m of l.replace(/`[^`]*`/g, "").matchAll(/\[A ESCLARECER(?::\s*([^\]\n]*))?\]/g))
      achadas.push({ linha: i + 1, texto: (m[1] ?? "").trim() });
  });
  return achadas;
}
var PASTA_DE_HISTORICO = /^(?:\.git|\.local|node_modules|dist|gen)$|(?:^|[\s_.-])(?:hist[oó]rico|archive|arquivo|legado|backups?|evid[eê]ncias?)(?:[\s_.-]|$)/i;
var COPIA_NO_TRONCO = /\(\d+\)$|\s-\s(?:c[oó]pia|copy)(?:\s\(\d+\))?$|^(?:c[oó]pia de|copy of)\s|[\s_.-]old$/i;
var COPIA_NO_NOME = /\.(?:bak|old|orig)$|~$/i;
var ARQUIVO_DE_STATUS = /^(?:projeto|status|project_state)\.json$/i;
var MANUAL_MD = /(?:^|\/)docs\/(?:[^/]+\/)*manual[^/]*\.md$/i;
var MANUAL_HTML = /(?:^|\/)docs\/(?:[^/]+\/)*manual[^/]*\.html?$/i;
var DOC_DO_TOPO = /^docs\/[^/]+\.md$/i;
var TAMANHO_MINIMO_DA_COPIA = 512;
var ehManualMd = (caminho) => MANUAL_MD.test(String(caminho ?? "").replace(/\\/g, "/"));
exports.ehManualMd = ehManualMd;
var ehManualHtml = (caminho) => MANUAL_HTML.test(String(caminho ?? "").replace(/\\/g, "/"));
exports.ehManualHtml = ehManualHtml;
var ehNomeDeCopia = (nome) => COPIA_NO_TRONCO.test(String(nome ?? "").replace(/\.[^.]+$/, "")) || COPIA_NO_NOME.test(String(nome ?? ""));
exports.ehNomeDeCopia = ehNomeDeCopia;
var noHistorico = (caminho) => caminho.split("/").slice(0, -1).some((p) => PASTA_DE_HISTORICO.test(p));
var nomeDe = (caminho) => caminho.split("/").pop() ?? caminho;
function textoDoHtml(html) {
  return String(html ?? "").replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&middot;|&#183;|&#xB7;/gi, "\xB7").replace(/&nbsp;|&#160;/gi, " ").replace(/&amp;/gi, "&").replace(/[ \t]+/g, " ");
}
function conferirFonteUnica(e) {
  const achados = [];
  const existe = new Set(e.arquivos.map((a) => a.caminho));
  const vivos = e.arquivos.filter((a) => !noHistorico(a.caminho));
  for (const a of vivos) {
    if ((0, exports.ehManualHtml)(a.caminho)) {
      const md = a.caminho.replace(/\.html?$/i, ".md");
      if (!existe.has(md)) {
        achados.push({ tipo: "manual-sem-md", caminho: a.caminho, detalhe: `falta ${nomeDe(md)} ao lado` });
        continue;
      }
      const vHtml = (0, manual_js_1.versaoDoTexto)(textoDoHtml(e.ler(a.caminho)));
      const vMd = (0, manual_js_1.lerManual)(e.ler(md)).versao;
      if (vHtml && vMd && vHtml.versao !== vMd)
        achados.push({ tipo: "versao-diferente", caminho: a.caminho, detalhe: `o HTML est\xE1 na ${vHtml.versao}; o .md, na ${vMd}` });
    } else if ((0, exports.ehManualMd)(a.caminho)) {
      const m = (0, manual_js_1.lerManual)(e.ler(a.caminho));
      if (!m.versao)
        achados.push({ tipo: "manual-sem-versao", caminho: a.caminho, detalhe: 'sem "Vers\xE3o X.Y \xB7 DD/MM/AAAA" no topo' });
      if (!m.total)
        achados.push({ tipo: "manual-sem-caixas", caminho: a.caminho, detalhe: "nenhum passo com - [ ] ou - [x]" });
    }
  }
  const readme = existe.has("README.md") ? e.ler("README.md") : null;
  if (readme === null) {
    achados.push({ tipo: "fora-do-indice", caminho: "README.md", detalhe: "a pasta n\xE3o tem README.md com o \xEDndice dos documentos" });
  } else {
    for (const a of vivos) {
      if (!DOC_DO_TOPO.test(a.caminho) && !(0, exports.ehManualMd)(a.caminho))
        continue;
      const citado = readme.includes(a.caminho) || readme.includes(encodeURI(a.caminho)) || readme.includes(a.caminho.replace(/ /g, "%20"));
      if (!citado)
        achados.push({ tipo: "fora-do-indice", caminho: a.caminho, detalhe: "n\xE3o est\xE1 no \xEDndice do README.md" });
    }
  }
  const porHash = /* @__PURE__ */ new Map();
  for (const a of vivos) {
    if (!a.hash || a.tamanho < TAMANHO_MINIMO_DA_COPIA)
      continue;
    const lista = porHash.get(a.hash) ?? [];
    lista.push(a.caminho);
    porHash.set(a.hash, lista);
  }
  for (const lista of porHash.values()) {
    if (lista.length < 2)
      continue;
    const [primeiro, ...outros] = [...lista].sort();
    achados.push({ tipo: "mesmo-conteudo", caminho: primeiro, detalhe: `igual a ${outros.join(", ")}` });
  }
  for (const a of vivos) {
    const nome = nomeDe(a.caminho);
    if ((0, exports.ehNomeDeCopia)(nome))
      achados.push({ tipo: "nome-de-copia", caminho: a.caminho, detalhe: nome });
  }
  for (const a of vivos) {
    if (ARQUIVO_DE_STATUS.test(nomeDe(a.caminho)))
      achados.push({ tipo: "arquivo-de-status", caminho: a.caminho, detalhe: "status, radar e quem precisa agir moram no board" });
  }
  for (const a of vivos) {
    if (!/\.md$/i.test(a.caminho) || a.tamanho > TAMANHO_MAXIMO_PARA_A_MARCA)
      continue;
    const marcas = marcasAEsclarecer(e.ler(a.caminho));
    if (!marcas.length)
      continue;
    const primeira = marcas[0];
    achados.push({ tipo: "a-esclarecer", caminho: a.caminho, detalhe: `${marcas.length} marca(s); a primeira na linha ${primeira.linha}${primeira.texto ? `: ${primeira.texto}` : ""}` });
  }
  for (const caminho of CAMINHOS_DO_ESTADO) {
    if (!existe.has(caminho))
      continue;
    const texto = e.ler(caminho) ?? "";
    const linhas = texto.split(/\r?\n/).length;
    if (linhas > exports.TETO_DO_ESTADO.linhas || texto.length > exports.TETO_DO_ESTADO.caracteres) {
      achados.push({ tipo: "estado-grande", caminho, detalhe: `${linhas} linhas e ${texto.length} caracteres (o teto: ${exports.TETO_DO_ESTADO.linhas} linhas e ${exports.TETO_DO_ESTADO.caracteres} caracteres); o que \xE9 hist\xF3ria vai ao guia ou \xE0s decis\xF5es` });
    }
    for (const m of texto.matchAll(SECAO_QUE_NAO_E_DO_ESTADO)) {
      achados.push({ tipo: "estado-grande", caminho, detalhe: `a se\xE7\xE3o "${m[0].replace(/^##\s+/, "").trim()}" \xE9 do guia ou de docs/decisoes/, n\xE3o do estado` });
    }
  }
  achados.push(...(0, cenario_js_1.conferirCenarios)({ caminhos: vivos.map((a) => a.caminho), ler: e.ler }));
  const ordem = Object.keys(exports.ROTULO_DO_ACHADO);
  return achados.sort((x, y) => ordem.indexOf(x.tipo) - ordem.indexOf(y.tipo) || x.caminho.localeCompare(y.caminho));
}
