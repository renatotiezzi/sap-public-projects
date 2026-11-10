---
name: cpi-principios
description: Porta de entrada para qualquer trabalho em SAP Cloud Integration (CPI). Traz os princípios de integração confiável e diz qual skill de CPI usar em cada etapa. Use primeiro quando o pedido envolver iFlow, pacote, adapter, monitoramento ou reprocessamento.
titulo: "CPI: princípios e por onde começar"
area: cpi
bundles: [cpi]
versao: 1.1.0
ordem: 1
atualizado_em: 2026-10-02
origem:
  - "sap-tech-lab/Library - Dev completed/Setup antigo - 2026-07-29/skills/integration-cpi/SKILL.md@sha256:ca6a127760fa"
  - "Sap-Speed-Up/.agents/skills/speedup-traceability/SKILL.md@sha256:6f89e1903432 (seção sobre competências de CPI)"
---

# CPI: princípios e por onde começar

O objetivo é uma integração estável, observável e fácil de sustentar. Esta skill dá os princípios e indica a skill certa para cada etapa. Ela não autoriza criar, implantar nem testar nada no tenant.

## Princípios

- **Contrato antes da implementação:** o que entra, o que sai, o que significa sucesso e o que acontece na falha.
- **Observável em produção:** correlação e identificadores de negócio no log; um MPL que outra pessoa consiga ler.
- **Erro explícito:** nenhuma falha silenciosa nem "Completed" que esconde erro de negócio.
- **Idempotência** sempre que houver reenvio, retry ou reprocessamento.
- **Sem acoplamento escondido:** não dependa de detalhes internos do payload que o contrato não garante.
- **Passo nativo antes de script:** Groovy só quando o passo padrão não resolve.

## Qual skill usar

| Etapa | Skill |
|---|---|
| Entender o pedido e fechar o que o fluxo precisa garantir | `cpi-contrato` |
| Desenhar ou revisar os passos do iFlow (nativo × Groovy) | `cpi-desenho-iflow` |
| Escolher e configurar sender e receiver | `cpi-adapters` |
| Tabela de correspondência (origem → destino) como Value Mapping | `cpi-value-mapping` |
| Falhas, retry e reprocessamento | `cpi-falhas-reprocessamento` |
| Retry com fila JMS (só se JMS entrar no contrato) | `cpi-jms-retry` |
| Provar a entrega: deploy, gatilho real, MPL e destino | `cpi-prova-entrega` |

Em uma integração completa, combine as skills sem repetir ritos.

## Com o Speed Up

- **Bundle CPI** (29 ações), sobre uma conexão do tipo `cpi`. Antes de agir, liste as ações com `sap_capabilities` e `bundle: "cpi"`; execute com `sap_execute`.
- **Para conhecer o que já existe:**
  - `sap.cpi.packages.list` e `sap.cpi.package.get`;
  - `sap.cpi.package.analyze`: quem chama quem (ProcessDirect, JMS, endpoints);
  - `sap.cpi.iflow.describe`: adapters, passos, scripts e parâmetros;
  - `sap.cpi.source.read`: a fonte inteira de um script, mapeamento ou `.iflw`.
- **Saúde do tenant:**
  - `sap.cpi.runtime.status`, `sap.cpi.messages.list` e `sap.cpi.message.get`;
  - recursos disponíveis: `sap.cpi.tenant.features` e `sap.cpi.jms.status`.
- **Ações que alteram o tenant** (criar, alterar, implantar, chamar endpoint) só rodam em DEV, TEST ou SANDBOX, com autorização dada no painel. QAS e PRD são somente leitura.

## Limites

- Princípio não é prova: o que vale é o critério observável de `cpi-prova-entrega`.
- Não presuma recurso do tenant (JMS, Data Store, edição); confira com `sap.cpi.tenant.features`.
