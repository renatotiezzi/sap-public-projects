---
name: abap-clean-code
description: Escreve ou revisa código ABAP seguindo o Clean ABAP da SAP, incluindo nomenclatura. Use em refatoração, code review, melhoria de legibilidade ou ao criar objetos custom.
titulo: "ABAP: código limpo e nomenclatura"
area: abap
bundles: [adt]
versao: 1.0.0
atualizado_em: 2026-10-01
origem:
  - "sap-tech-lab/Library - Dev completed/Setup antigo - 2026-07-29/skills/clean-abap/SKILL.md@sha256:f5e938513d7b"
  - "sap-tech-lab/Library - Dev completed/Setup antigo - 2026-07-29/skills/naming-conventions/SKILL.md@sha256:653161e58d2b"
---

# ABAP: código limpo e nomenclatura

Código ABAP legível, simples, pouco acoplado, coeso, fácil de manter e de testar, segundo o [Clean ABAP da SAP](https://github.com/SAP/styleguides/blob/main/clean-abap/CleanABAP.md). Quando a convenção do cliente conflitar com o guia, vale a do cliente; registre a diferença.

## Quando usar

- Refatoração e code review.
- Melhoria de legibilidade.
- Limpeza depois do ATC.
- Criação de objetos custom.

## Regras

- **Métodos:** uma responsabilidade por método; métodos curtos e retorno antecipado em vez de aninhamento profundo.
- **Condições:** evite IFs aninhados quando uma condição combinada é mais clara. Use `CHECK`, `RETURN` e `CONTINUE` para reduzir aninhamento.
- **Comentários:** não explique o que o código faz. Explique só o porquê, a regra de negócio ou a limitação SAP.
- **Tabelas internas:** prefira `ASSIGNING` quando couber, e tabelas `HASHED` ou `SORTED` quando o padrão de acesso pedir.
- **SQL:**
  - evite `SELECT` dentro de `LOOP` e `SELECT *`;
  - prefira campos explícitos, joins e `FOR ALL ENTRIES` validado (tabela de entrada não vazia).
- **Orientação a objetos:** prefira classes, métodos e injeção de dependência a desenho procedural cheio de `FORM`.
- **Exceções:**
  - prefira exceções baseadas em classe, com mensagem significativa;
  - não deixe falha silenciosa nem `SY-SUBRC` ignorado.

## Nomenclatura

- Nomes pelo significado de negócio, não por ruído técnico.
- Evite abreviações, a não ser termos SAP padrão.
- Evite nomes genéricos como `data`, `result`, `temp`, `value`, `item`, `obj`.
- Singular ou plural conforme a entidade.
- Nome de classe e de método alinhado à responsabilidade.

| Bom | Ruim |
|---|---|
| `sales_order_item` | `temp_data` |
| `approval_status` | `gv_value` |
| `posting_date` | `ls_result` |
| `billing_document` | `lt_table` |
| `is_reprocessing_enabled` | `process1` |

## Com o Speed Up

- **Bundle ABAP (ADT)**, sobre uma conexão do tipo `sap-abap`.
- **Ler o código real antes de opinar:** `sap.adt.search` para achar o objeto; `sap.adt.object.source` e `sap.adt.object.structure` para ler fonte e estrutura (classe, programa, grupo de funções, interface, CDS, tabela).
- **Gravar:** `sap.adt.program.upsert` cria ou altera um **programa** e ativa. Só roda em DEV, TEST ou SANDBOX e com autorização no painel. Para classe e outros objetos ainda não há ação de escrita: entregue o código revisado para o usuário aplicar.

## Limites

- Refatoração não muda comportamento de negócio. Se mudar, é outra tarefa, com outro teste.
- Não reescreva o objeto inteiro para "limpar" quando o pedido é pontual.
