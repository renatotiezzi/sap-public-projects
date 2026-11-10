#!/usr/bin/env node
'use strict';
/**
 * A barreira do público: varre o SETUP inteiro antes de cada push e sai com 1 se algum arquivo cita cliente, consultoria,
 * autor, caminho pessoal, e-mail ou segredo. As regras moram em regras-publico.json (um termo novo = uma linha lá).
 *
 *   node conferir-publico.js [pasta]       (padrão: a pasta deste arquivo)
 */
const fs = require('node:fs');
const path = require('node:path');

const raiz = path.resolve(process.argv[2] || __dirname);
const regras = JSON.parse(fs.readFileSync(path.join(__dirname, 'regras-publico.json'), 'utf8'));
const FORA = new Set(['.git', 'node_modules']);
const PROPRIO = new Set([path.join(__dirname, 'regras-publico.json')]);

const semAcento = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const termos = regras.termos.map((t) => {
  const corpo = semAcento(t.termo).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = t.parcial ? corpo : `(?<![A-Za-z0-9])${corpo}(?![A-Za-z0-9])`;
  return { ...t, re: new RegExp(re, t.exato ? 'g' : 'gi') };
});
const padroes = [...regras.padroes, ...regras.segredos].map((p) => ({ ...p, re: new RegExp(p.regex, `${p.flags || ''}g`) }));

const achados = [];
function varrer(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (FORA.has(e.name)) continue;
    const arq = path.join(dir, e.name);
    if (e.isDirectory()) { varrer(arq); continue; }
    if (PROPRIO.has(arq)) continue;
    const rel = path.relative(raiz, arq).split(path.sep).join('/');
    for (const t of termos) if (t.re.test(semAcento(rel))) achados.push({ arquivo: rel, linha: 0, oque: `nome do arquivo: ${t.termo}` });
    const buf = fs.readFileSync(arq);
    if (buf.includes(0)) continue; // binário
    // o endereço do próprio repositório público é livre (regras-publico.json, "permitidos")
    let texto = buf.toString('utf8');
    for (const p of regras.permitidos || []) texto = texto.split(p).join('');
    const linhas = semAcento(texto).split(/\r?\n/);
    linhas.forEach((l, i) => {
      for (const t of termos) { t.re.lastIndex = 0; if (t.re.test(l)) achados.push({ arquivo: rel, linha: i + 1, oque: `${t.termo} (${t.motivo})` }); }
      for (const p of padroes) {
        p.re.lastIndex = 0;
        for (const m of l.matchAll(p.re)) {
          if (p.nome === 'e-mail' && regras.emailsLivres.some((x) => m[0].endsWith(x) || m[0].includes(x))) continue;
          achados.push({ arquivo: rel, linha: i + 1, oque: `${p.nome}: ${m[0].slice(0, 40)}` });
        }
      }
    });
  }
}
varrer(raiz);
if (!achados.length) { console.log(`Barreira do público: nada a apontar em ${raiz}.`); process.exit(0); }
const porArquivo = {};
for (const a of achados) (porArquivo[a.arquivo] ||= []).push(a);
console.log(`Barreira do público: ${achados.length} achado(s) em ${Object.keys(porArquivo).length} arquivo(s). Nada sai até zerar.\n`);
for (const [arq, lista] of Object.entries(porArquivo)) {
  console.log(arq);
  for (const a of lista.slice(0, 6)) console.log(`   ${a.linha ? `linha ${a.linha}: ` : ''}${a.oque}`);
  if (lista.length > 6) console.log(`   ... e mais ${lista.length - 6}`);
}
process.exit(1);
