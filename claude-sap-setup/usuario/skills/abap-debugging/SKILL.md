---
name: abap-debugging
description: Encontra o caminho de código que controla um problema ABAP e explica a causa raiz com evidência. Use em dump, erro de runtime, saída errada ou investigação de lógica.
titulo: "ABAP: investigação e causa raiz"
area: abap
bundles: [adt]
versao: 1.0.0
atualizado_em: 2026-10-01
origem:
  - "sap-tech-lab/Library - Dev completed/Setup antigo - 2026-07-29/skills/debugging/SKILL.md@sha256:f6d1b3bff24f"
---

# ABAP: investigação e causa raiz

Achar o caminho de código que decide o comportamento e explicar a causa raiz com evidência, não com suposição.

## Quando usar

- Dump ou erro de runtime.
- Saída errada.
- Investigação de lógica que "deveria funcionar".

## Processo

1. **Reproduza** o problema, ou obtenha o registro completo dele. Um print parcial esconde a linha e as variáveis que importam.
2. **Identifique** o programa, a classe ou o método exato envolvido.
3. **Inspecione o estado dos dados** antes da falha.
4. **Ache o ponto de decisão** que muda o comportamento.
5. **Confirme a menor correção** que resolve o problema.

## Regras

- Evidência antes de suposição.
- Siga os dados reais, não só o fluxo esperado.
- Confira limites, valores iniciais e tabelas internas vazias.
- Valide a correção com um teste focado ou uma nova execução.

## Com o Speed Up

- **Ler o código citado no dump:** `sap.adt.search`, `sap.adt.object.source` (inclusive o include do dump) e `sap.adt.object.structure`, sobre uma conexão `sap-abap`.
- **Lacuna conhecida:** ler o dump (ST22), os logs ou os dados do sistema **não é ação do Speed Up hoje**. Peça ao usuário o texto completo do dump e os dados relevantes.
- **Registrar o erro e a correção** com rastreabilidade: `processo-registrar-erro` e `processo-registrar-correcao`. O fluxo completo está em `processo-corrigir-abap`.

## Limites

- Não declare causa raiz sem evidência ligando o dado ao ponto de decisão.
- A correção mínima resolve o problema relatado; melhorias à parte são outra tarefa.
