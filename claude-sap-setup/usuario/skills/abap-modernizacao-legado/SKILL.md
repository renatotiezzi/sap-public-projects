---
name: abap-modernizacao-legado
description: Moderniza ABAP legado (lógica procedural, includes, rotinas FORM, acesso ineficiente ao banco) de forma incremental e sem redesenho arriscado. Use em programa baseado em includes, refatoração procedural ou plano de modernização.
titulo: "ABAP: modernização de código legado"
area: abap
bundles: [adt]
versao: 1.0.0
atualizado_em: 2026-10-01
origem:
  - "sap-tech-lab/Library - Dev completed/Setup antigo - 2026-07-29/skills/legacy-abap-modernization/SKILL.md@sha256:caf60b71e7d2"
---

# ABAP: modernização de código legado

Transformar ABAP legado em código fácil de manter, **sem redesenho arriscado**.

## Quando usar

- Programa baseado em includes e rotinas `FORM`.
- Refatoração de lógica procedural.
- Plano de modernização, inclusive preparação para S/4HANA e Clean Core.

## O que procurar

- Rotinas `FORM`.
- Estado global.
- Padrões de `SELECT` repetidos.
- Lógica procedural aninhada.
- Acoplamento forte entre includes.

## Estratégia

1. Preserve o comportamento.
2. Reduza a complexidade.
3. Isole responsabilidades.
4. Melhore os nomes (veja `abap-clean-code`).
5. Acrescente testes onde for viável (veja `abap-testes-unitarios`).

## Regras

- Modernize em passos pequenos: uma extração segura por vez.
- Não mude a arquitetura sem motivo de negócio claro.
- Para decisões de extensão e Clean Core, use `arquitetura-clean-core`.

## Com o Speed Up

- **Mapear o legado:** `sap.adt.search`, `sap.adt.object.source` (inclusive includes) e `sap.adt.object.structure`, sobre uma conexão `sap-abap`.
- **Gravar um programa modernizado:** `sap.adt.program.upsert`, só em DEV, TEST ou SANDBOX e com autorização.
- **Lacuna conhecida:** onde-usado e dependências entre objetos ainda não são ações do Speed Up. Peça ao usuário a lista de onde-usado (SE80/ADT) antes de mexer em interface.

## Limites

- Sem teste ou evidência de comportamento, não declare equivalência.
