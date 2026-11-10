---
name: btp-principios
description: Porta de entrada para trabalho no SAP BTP com o Speed Up — projeto CAP, Cloud Foundry, SAP HANA Cloud e a conta BTP. Diz qual skill usar em cada etapa, qual conexão cada uma pede e as regras que valem para todas. Use antes de qualquer pedido de CAP, Cloud Foundry, HANA Cloud ou BTP.
titulo: "BTP: princípios e mapa das skills"
area: btp
bundles: [cap, cf, hana, btp, calm, datasphere]
versao: 1.1.0
ordem: 1
atualizado_em: 2026-10-03
origem:
  - "Sap-Speed-Up/packages/adapters/src/bundles/cap/lacunas.ts@sha256:55d831f1fc69"
  - "Sap-Speed-Up/packages/adapters/src/bundles/btp/lacunas.ts@sha256:99d4f1247f7a"
  - "Sap-Speed-Up/docs/work-items/SU-WI-047-payload-store-cap-hana/RESULT.md@sha256:5122857521dc"
---

# BTP: princípios e mapa das skills

No SAP BTP o trabalho atravessa quatro coisas diferentes: o **projeto CAP** (código na máquina), o **Cloud Foundry** (onde o app roda), o **SAP HANA Cloud** (o banco) e a **conta BTP** (subconta, entitlements, instâncias, destinos). O Speed Up tem um bundle para cada uma, e cada bundle pede o seu tipo de conexão.

## Quando usar

- Antes de qualquer pedido de CAP, Cloud Foundry, HANA Cloud ou BTP.
- Quando não estiver claro em que etapa o trabalho está.

## Qual skill em cada etapa

| Etapa | Skill | Conexão que o Speed Up pede |
|---|---|---|
| Desenvolver e testar o CAP na máquina | `cap-desenvolvimento-local` | `cap-project` (a pasta do projeto) |
| Modelar entidades e views CDS | `cds-modelagem` | `cap-project` |
| Publicar o CAP no BTP (HDI, XSUAA, app) | `btp-publicar-cap` | `cloud-foundry` (o space de destino) |
| Ler o banco, conferir HDI, implantar artefato | `hana-cloud-leitura-e-hdi` | `hana-cloud` |
| Subconta, entitlements, instâncias e destinos | `btp-conta-e-servicos` | `btp` |
| Ler o que o projeto pede no Cloud ALM (requisitos, user stories, tarefas, defeitos) | `calm-contexto-do-projeto` | `cloud-alm` (a service key da API; só leitura) |
| Ler os objetos de um espaço do Datasphere (estado e definição) | `datasphere-objetos-do-espaco` | `datasphere` (o cliente OAuth "Technical User"; só leitura) |

## Regras que valem para todas

- **Leia antes de mudar.** Cada bundle tem as leituras que confirmam o estado (`sap.cf.space.describe`, `sap.btp.subaccount.identify`, `sap.hana.connection.identify`, `sap.cap.project.discover`). Use-as antes de criar ou publicar.
- **Escrita e deploy só em DEV, TEST ou SANDBOX,** com a autorização dada no painel do Speed Up. QAS e PRD são somente leitura.
- **Segredo nunca entra por argumento.** O Speed Up recusa nome ou valor com cara de credencial em `parameters`, `env`, `services` e `route`. Chave de serviço e senha ficam com o usuário; o login no Cockpit, no Business Application Studio e no `cf login` é do usuário.
- **Instância de serviço tem dois caminhos:** `sap.cf.service-instance.create` cria no **space** do Cloud Foundry (é o que um app CAP precisa para se ligar); `sap.btp.service-instance.create` cria pelo **Service Manager** da subconta, fora de um space. Para publicar CAP, use o do Cloud Foundry.
- **Efeito incerto não se repete às cegas.** Quando uma ação devolve `outcome_unknown`, confira por leitura (ou `sap_reconcile`) antes de tentar de novo: repetir um deploy pode executá-lo duas vezes.
- **Lacuna tem escada.** Quando o Speed Up não tem a ação, a resposta traz o `fallback`: primeiro outro bundle do Speed Up, depois o navegador (Cockpit, Business Application Studio, HANA Cloud Central). Recusa de política não é lacuna e não se contorna.

## Limites

- Os bundles `cap`, `cf`, `hana` e `btp` estão qualificados em fixture; o CAP também roda o motor real na máquina (E131). Uma prova em conta real exige alvo, efeito e autorização atuais.

## Fontes (consultadas em 02/10/2026)

- [CAP — Deploy to Cloud Foundry](https://cap.cloud.sap/docs/guides/deploy/to-cf): preparação (`cds add hana`, `cds add xsuaa`, `cds add mta`), build e deploy no Cloud Foundry.
- [CAP — Using SAP HANA Cloud for Production](https://cap.cloud.sap/docs/guides/databases/hana): HDI com o plano `hdi-shared` e a instância HANA ligada e mapeada para o space.
- Speed Up: as lacunas e escadas dos bundles `cap` e `btp`, e o resultado real da SU-WI-047 (CAP publicado no BTP pelo bundle `cf`).
