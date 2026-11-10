"use strict";

// packages/core/dist/project/regras-das-decisoes.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.regrasDasDecisoes = regrasDasDecisoes;
exports.ehDocumentoDeStatus = ehDocumentoDeStatus;
exports.conferirContraDecisoes = conferirContraDecisoes;
var LINHA_DA_REGRA = /^Ignorar na valida[çc][ãa]o:\s*\/(.+)\/([a-z]*)\s*(?:[—–-]\s*(.*))?$/gim;
var LINHA_QUE_REPETE = /^Repete a causa:\s*\/(.+)\/([a-z]*)\s*(?:[—–-]\s*(.*))?$/gim;
var LINHA_QUE_EXPLICA = /esperad|ignorad|ignora-se|fora da valida|decis[ãa]o de|docs\/decisoes\//i;
function regrasDasDecisoes(decisoes) {
  const regras = [];
  for (const d of decisoes) {
    const titulo = (/^#\s+(.+)$/m.exec(d.texto)?.[1] ?? d.caminho).trim();
    for (const [linha, soRepete] of [[LINHA_DA_REGRA, false], [LINHA_QUE_REPETE, true]]) {
      for (const m of d.texto.matchAll(linha)) {
        try {
          const flags = [...new Set(((m[2] ?? "") + "i").split(""))].filter((f) => "imsu".includes(f)).join("");
          regras.push({ decisao: d.caminho, titulo, padrao: new RegExp(m[1] ?? "", flags), descricao: (m[3] ?? "").trim() || titulo, ...soRepete ? { soRepete: true } : {} });
        } catch {
        }
      }
    }
  }
  return regras;
}
function ehDocumentoDeStatus(caminho) {
  const c = caminho.replace(/\\/g, "/");
  if (/(^|\/)docs\/decisoes\//i.test(c) || /(^|\/)(?:hist[oó]rico|archive|evid[eê]ncias?)(\/|$)/i.test(c))
    return false;
  return /(^|\/)docs\/(?:STATUS|MAPA[^/]*|ESTADO)\.md$/i.test(c) || /(^|\/)docs\/validacao[^/]*\/[^/]+\.md$/i.test(c);
}
function conferirContraDecisoes(docs, regras) {
  if (!regras.length)
    return [];
  const achados = [];
  for (const d of docs) {
    if (!ehDocumentoDeStatus(d.caminho))
      continue;
    d.texto.split(/\r?\n/).forEach((linha, i) => {
      if (LINHA_QUE_EXPLICA.test(linha))
        return;
      for (const r of regras) {
        if (!r.soRepete && r.padrao.test(linha)) {
          achados.push({ caminho: d.caminho, linha: i + 1, trecho: linha.trim().slice(0, 160), decisao: r.decisao, descricao: r.descricao });
          break;
        }
      }
    });
  }
  return achados;
}
