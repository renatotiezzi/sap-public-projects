---
name: abap-performance
description: Melhora a eficiência de execução de código ABAP sem mudar o comportamento de negócio. Use em relatório lento, SELECT dentro de LOOP, otimização de tabelas internas ou de acesso ao banco.
titulo: "ABAP: performance"
area: abap
bundles: [adt]
versao: 1.0.0
atualizado_em: 2026-10-01
origem:
  - "sap-tech-lab/Library - Dev completed/Setup antigo - 2026-07-29/skills/abap-performance/SKILL.md@sha256:c8298d0754e7"
---

# ABAP: performance

Deixar o ABAP mais rápido **sem mudar o comportamento de negócio**. Antes de otimizar, meça; depois de otimizar, meça de novo.

## Quando usar

- Relatório ou job lento.
- `SELECT` dentro de `LOOP`.
- Otimização de tabelas internas.
- Ajuste de acesso ao banco.

## O que procurar

- `SELECT` dentro de `LOOP`.
- Loops aninhados sobre volumes grandes.
- Cópias desnecessárias de dados.
- Uso inadequado de `STANDARD TABLE` para busca por chave.
- `WHERE` ausente ou pouco seletivo.
- `SELECT *`.

## O que preferir

- `HASHED TABLE` para busca por chave.
- `SORTED TABLE` para acesso ordenado.
- `BINARY SEARCH` quando fizer sentido.
- Agregação no SQL em vez de no ABAP.
- Filtro e agrupamento empurrados para o banco.
- **Em HANA:** priorize pushdown e reduza o processamento linha a linha.

## Com o Speed Up

- **Ler o código e a estrutura:** `sap.adt.search`, `sap.adt.object.source` e `sap.adt.object.structure`, sobre uma conexão `sap-abap`.
- **Gravar a versão otimizada de um programa:** `sap.adt.program.upsert`, só em DEV, TEST ou SANDBOX e com autorização.
- **Lacuna conhecida:** medição de runtime (SAT, ST05, SQL Monitor) e leitura de dados do sistema ABAP **não são ações do Speed Up hoje**. Peça a medição ao usuário e registre o antes e o depois.

## Limites

- Não declare ganho sem medição comparável.
- Não troque a semântica (ordem, duplicatas, campos) por velocidade sem aceite explícito.
