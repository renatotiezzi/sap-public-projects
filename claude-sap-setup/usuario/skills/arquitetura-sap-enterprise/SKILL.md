---
name: arquitetura-sap-enterprise
description: Aplica o raciocínio de um arquiteto SAP sênior, com padrão SAP primeiro, segurança na atualização e atenção à operação. Use em desenho de solução SAP, revisão de arquitetura, decisão de extensão ou análise de modernização.
titulo: "Arquitetura: visão de arquiteto SAP"
area: arquitetura
bundles: []
versao: 1.0.0
ordem: 1
atualizado_em: 2026-10-01
origem:
  - "sap-tech-lab/Library - Dev completed/Setup antigo - 2026-07-29/skills/sap-enterprise-mindset/SKILL.md@sha256:f776fa082427"
---

# Arquitetura: visão de arquiteto SAP

Pensar como um engenheiro SAP sênior: a melhor solução é a que o cliente consegue manter, atualizar e operar.

## Quando usar

- Desenho de solução SAP.
- Revisão de arquitetura.
- Decisão de extensão.
- Análise de Clean Core ou de modernização.

## Sempre avaliar

- padrão SAP primeiro;
- segurança na atualização (upgrade);
- facilidade de suporte;
- impacto operacional;
- manutenção;
- governança.

## Ordem de decisão

1. Padrão SAP.
2. Configuração.
3. Extensibilidade liberada.
4. BAdI ou enhancement.
5. Desenvolvimento custom.
6. Modificação, só como último recurso.

## Verificações obrigatórias

Antes de propor uma solução, identifique:

- impacto de negócio;
- impacto técnico;
- dependência de objetos standard;
- risco de transporte e de ciclo de vida;
- impacto em monitoramento e suporte.

## Com o Speed Up

- **Comece pelo que o Speed Up sabe:** `speedup_status` mostra conexões, bundles e skills; `context_resolve` traz o conhecimento do projeto.
- **Confirme no sistema real antes de decidir:** use os bundles da conexão em questão (ADT/RAP no ABAP, CPI, CAP, Cloud Foundry, BTP, HANA) para ler o que existe, em vez de supor.
- **Para o detalhe:** Clean Core em `arquitetura-clean-core`; integração em `cpi-principios`; RAP em `rap-desenvolvimento`.

## Como responder

- Explique os trade-offs e os riscos.
- Diga o que está sendo evitado.
- Mantenha a regra de negócio intacta.
