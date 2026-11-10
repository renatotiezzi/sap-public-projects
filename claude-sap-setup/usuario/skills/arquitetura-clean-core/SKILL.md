---
name: arquitetura-clean-core
description: Aplica os princípios de Clean Core às decisões de desenho SAP, favorecendo o comportamento standard e a extensibilidade segura para upgrade. Use em extensibilidade, alternativa ao standard, segurança de upgrade ou para evitar modificação.
titulo: "Arquitetura: Clean Core"
area: arquitetura
bundles: [adt, rap]
versao: 1.0.0
atualizado_em: 2026-10-01
origem:
  - "sap-tech-lab/Library - Dev completed/Setup antigo - 2026-07-29/skills/clean-core/SKILL.md@sha256:517c08fd02ed"
---

# Arquitetura: Clean Core

Proteger o núcleo SAP, reduzindo ao mínimo a interferência custom.

## Quando usar

- Decisões de extensibilidade.
- Busca de alternativa no standard.
- Avaliação de segurança de upgrade.
- Pedido que levaria a modificar objeto standard.

## Regras

- Comportamento standard SAP primeiro.
- Use APIs liberadas e pontos de extensão quando existirem.
- Evite modificar objetos standard diretamente.
- Mantenha a lógica custom isolada e substituível.
- Reduza o custo de propriedade de longo prazo.
- A ordem completa de decisão está em `arquitetura-sap-enterprise`.

## Com o Speed Up

- **Achar o que já foi modificado ou estendido:** `sap.adt.search` e `sap.adt.object.source`, sobre uma conexão `sap-abap`.
- **Construir do jeito limpo:** o bundle RAP (`rap-desenvolvimento`) cria CDS, BDEF e serviço sobre o modelo RAP.
- **Lacuna conhecida:** consultar se um objeto ou API standard é **liberado** (contrato de liberação C0–C4) ainda não é ação do Speed Up. Confirme no ADT ou na documentação da SAP antes de recomendar o uso.

## Limites

- Não declare um objeto "liberado" sem fonte.
- Uma exceção ao Clean Core precisa de motivo registrado e de dono.
