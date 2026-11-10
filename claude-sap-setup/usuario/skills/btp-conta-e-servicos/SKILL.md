---
name: btp-conta-e-servicos
description: Lê e organiza a conta SAP BTP pelo Speed Up — conta global, subconta, regiões, ambientes, entitlements, ofertas, planos e instâncias de serviço e destinos — e cria instância de serviço ou destino quando autorizado. Use para entender o que uma subconta tem antes de construir, e para preparar serviços e destinos.
titulo: "BTP: conta, serviços e destinos"
area: btp
bundles: [btp]
versao: 1.0.0
ordem: 40
atualizado_em: 2026-10-02
origem:
  - "Sap-Speed-Up/packages/adapters/src/bundles/btp/manifesto.ts@sha256:b1a724c8d8c8"
  - "Sap-Speed-Up/packages/adapters/src/bundles/btp/lacunas.ts@sha256:99d4f1247f7a"
---

# BTP: conta, serviços e destinos

Antes de construir no BTP, saiba o que a subconta tem: onde ela está, que ambientes e entitlements existem, que serviços já foram criados e que destinos apontam para fora. O bundle BTP lê isso com a conexão `btp` e cria instância de serviço ou destino quando autorizado.

## Quando usar

- Entender uma subconta nova ou desconhecida antes de construir.
- Descobrir por que um plano de serviço "não aparece" (entitlement).
- Criar ou ajustar um destino (Destination) usado por CAP, CPI ou Fiori.

## Ler a conta

1. **A conexão funciona:** `sap.btp.connection.check`.
2. **Onde estamos:** `sap.btp.globalaccount.get` (a conta global), `sap.btp.subaccount.identify` (GUID, região e se é de produção) e `sap.btp.regions.list`.
3. **Ambientes:** `sap.btp.environments.list` mostra o Cloud Foundry (org) e os outros ambientes da subconta.
4. **Entitlements:** `sap.btp.entitlements.list` (filtre por `serviceName`). Plano sem entitlement não pode ser criado; atribuir entitlement é passo do usuário no Cockpit.
5. **Catálogo e instâncias:** `sap.btp.service-offerings.list`, `sap.btp.service-plans.list` e `sap.btp.service-instances.list`.
6. **Destinos:** `sap.btp.destinations.list` e `sap.btp.destination.get`.

## Criar, com autorização

- **Instância pelo Service Manager:** `sap.btp.service-instance.create` (nome, oferta, plano e `parameters`) cria a instância na **subconta**, fora de um space.
  - Para um app no Cloud Foundry se ligar a ela, use `sap.cf.service-instance.create` no space, do bundle `cf`: veja `btp-publicar-cap`.
- **Destino:**
  - `sap.btp.destination.create` e `sap.btp.destination.update` recebem as propriedades do destino;
  - **só autenticação sem segredo:** a escrita aceita `NoAuthentication` e `PrincipalPropagation`, com proxy `Internet`, `OnPremise` ou `PrivateLink`;
  - o Speed Up recusa propriedade de autenticação (usuário, client ID, scope, OAuth, SAML), propriedade com nome de segredo (senha, token, secret, certificado…), cabeçalho ou query de canal (`URL.headers.*`, `URL.queries.*`) e URL com usuário e senha;
  - um destino com Basic ou OAuth o **usuário** cria no Cockpit, com o segredo dele;
  - na leitura, o valor dessas propriedades não volta, e a URL sai sem credencial nem query;
  - confira depois com `sap.btp.destination.get`.
- **Escrita só em DEV, TEST ou SANDBOX,** com autorização no painel.

## Lacunas conhecidas (com escada)

- **Spaces e apps do Cloud Foundry** (`btp.cf.spaces`): fora do bundle BTP, porque a API do Cloud Foundry exige token de usuário. Use o bundle `cf` (`sap.cf.space.describe`, `sap.cf.apps.list`) com uma conexão `cloud-foundry`, ou o Cockpit (subconta → Cloud Foundry → Spaces).
- **Chave de serviço** (`btp.service-key.create`): fora do bundle BTP.
  - Para instância de um space, `sap.cf.service-key.create`, que devolve só os metadados.
  - Para as outras, o usuário cria no Cockpit (Instances and Subscriptions) e guarda os valores; o segredo nunca volta ao host.
- Depois do Cockpit, volte ao Speed Up para conferir por leitura (`sap.btp.service-instances.list`, `sap.btp.environments.list`): é a leitura que gera a evidência.

## Limites

- O bundle está qualificado em fixture. Criar subconta, dar papel e mexer em entitlement ficam com o usuário.

## Fontes (consultadas em 02/10/2026)

- Speed Up: o bundle `btp` (ações, recorte e lacunas com escada).
- As páginas da SAP Help sobre entitlements e o Service Manager são montadas por JavaScript e não puderam ser lidas por ferramenta nesta data. Confirme no portal antes de afirmar comportamento de plano ou cota.
