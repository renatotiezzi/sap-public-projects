---
name: btp-automacao-processos
description: Desenha automação de processos e workflows na nuvem SAP (por exemplo, SAP Build Process Automation) de forma governada e segura para upgrade. Use em automação de workflow, fluxo de aprovação ou processo de negócio na nuvem pública.
titulo: "BTP: automação de processos e workflows"
area: arquitetura
bundles: [btp]
versao: 1.0.0
atualizado_em: 2026-10-01
origem:
  - "sap-tech-lab/Library - Dev completed/Setup antigo - 2026-07-29/skills/workflow-public-cloud/SKILL.md@sha256:a6a606e49793"
---

# BTP: automação de processos e workflows

Automatizar processos de negócio sem colocar lógica de processo frágil dentro do core.

## Quando usar

- Automação de workflow.
- Fluxo de aprovação.
- Processo de negócio na nuvem pública SAP, como o SAP Build Process Automation.

## Foco

- limites do processo;
- etapas de aprovação;
- pontos de interação humana;
- auditoria;
- roteamento de exceção.

## Regras

- Lógica de workflow explícita e rastreável.
- Orquestração separada da regra de negócio.
- Pontos de integração standard em vez de atalhos custom.

## Com o Speed Up

- **Bundle BTP** (14 ações), sobre uma conexão do tipo `btp`:
  - **o que a subconta tem:** `sap.btp.entitlements.list`, `sap.btp.service-offerings.list`, `sap.btp.service-plans.list` e `sap.btp.service-instances.list`;
  - **destinos que o processo usa para chamar sistemas:** `sap.btp.destinations.list` e `sap.btp.destination.get` (sem valores de autenticação); `sap.btp.destination.create` e `sap.btp.destination.update` gravam e releem.
- **Lacuna conhecida:** modelar ou implantar o processo no SAP Build Process Automation **não é ação do Speed Up hoje**. O desenho fica no documento e a implantação, com o usuário.

## Limites

- Não presuma serviço disponível: confira os entitlements da subconta.
