---
name: fiori-entrega
description: Leva um app Fiori ou UI5 ao sistema com o Speed Up — a versão UI5 fixada no manifest, o build, o deploy no repositório UI5 do ABAP (com plano e releitura em pacote local, ou com ordem de transporte) ou no BTP Cloud Foundry (MTA, HTML5 repo e approuter gerenciado), a navegação do launchpad (inbound) e a prova de que o app abre. Use quando o app passou no portão da fiori-testes e precisa chegar ao DEV, e para conferir uma entrega.
titulo: "Fiori: a entrega (build, deploy, launchpad e prova)"
area: fiori
bundles: [fiori, ui5, cf, cap]
versao: 1.2.0
ordem: 50
atualizado_em: 2026-10-22
origem:
  - "Sap-Speed-Up/docs/melhorias/2026-10-21-plano-apps-fiori.md"
  - "Sap-Speed-Up/docs/melhorias/2026-10-22-fiori-f1-docs-e-skills.md"
  - "Sap-Speed-Up/docs/melhorias/2026-10-22-fiori-f5-publicar.md"
---

# Fiori: a entrega

A entrega é o app no sistema, aberto pelo caminho que o usuário vai usar (o launchpad), com a prova guardada. "Fez o deploy" sem a tela aberta não é entrega.

## Quando usar

- Depois do portão verde da `fiori-testes`.
- Para conferir uma entrega que alguém fez.

## Regras

- **Escrita e deploy só em DEV, TEST ou SANDBOX,** com a autorização no painel do Speed Up. QAS e PRD são só leitura.
- **A credencial é do usuário.** O deploy por linha de comando lê o usuário e a senha de variáveis de ambiente que o próprio usuário define. A IA nunca digita senha.
- **A versão UI5 é a da régua** (`fiori-desenho-do-app`): a LTS vigente, igual no `ui5.yaml` e no `manifest.json`.

## O caminho, na ordem

### 1. A versão UI5

- **`manifest.json`:** `sap.ui5.dependencies.minUI5Version` com a versão da régua. Ele fixa o que o app exige em tempo de execução, e o deploy avisa se o sistema não tem essa versão.
- **`ui5.yaml`:** `framework.version` com a mesma versão. O app criado pelo MCP de UI5 já vem assim, por exemplo `framework.version: "1.148.0"` com a biblioteca `themelib_sap_horizon`.
- **Confira na hora** com `get_version_info` do MCP de UI5. A versão do sistema de destino tem que ser igual ou maior que a `minUI5Version`.

### 2. O build

- O build vem do portão: `sap.fiori.app.check` (o item `build`, ou o portão inteiro) roda o `ui5 build` do app e confere o `dist`, com o `manifest.json` e o `Component-preload.js`. Pelo terminal, é o `npm run build`.
- O que vai ao sistema é o conteúdo do `dist`, menos o `test`.

### 3. O deploy

**A. No repositório UI5 do ABAP.** Pré-requisitos:
- SAP_UI 7.53 ou maior;
- o serviço `/UI5/ABAP_REPOSITORY_SRV` ativo;
- a autorização `S_DEVELOP`.

O caminho é pelo Speed Up, governado, no bundle `ui5` (a skill `fiori-ui5-repositorio`):
1. `sap.ui5.service.discover`;
2. `sap.ui5.app.plan` (o `planHash`);
3. `sap.ui5.app.deploy`, com ensaio, envio e releitura arquivo a arquivo. Há duas formas:
   - **no pacote local (`$…`);**
   - **no pacote transportável, com a ordem em `transport`** (desde a F5, 22/10/2026). O `sap.abap.transport.info` diz as ordens que servem ao pacote, e o `sap.abap.transport.create` cria uma. A ordem vai no ensaio e no envio (`TransportRequest`, como o cliente oficial), e o pacote local recusa a ordem. Liberar a ordem é gesto do usuário (a lacuna `ui5.transportable.deploy`).
4. `sap.ui5.app.check`: o app servido no ICF.

**A remoção governada** (`sap.ui5.app.remove`):
- **Só apaga o app que foi visto:** o `appHash` do `sap.ui5.app.get` com `files: true` precisa bater. O app que mudou depois da leitura não é apagado.
- **No pacote transportável,** a remoção vai com a ordem.
- **A releitura confirma** que o app saiu.

**O `deploy-to-abap` do Fiori tools** (o `npm run deploy` com o `ui5-deploy.yaml`) continua valendo quando o projeto já o usa. Confira depois pelo Speed Up (`sap.ui5.app.get` e `sap.ui5.app.check`).

**B. No BTP Cloud Foundry** (desde a F5, pelo Speed Up, sem o `mbt` nem o CF CLI):
1. **`sap.fiori.app.mta`** monta o arquivo `.mtar` do `dist`, e o grava em `<app>/.speedup/mta/`, com o `mtad.yaml` ao lado para ler. O arquivo leva:
   - **o app para o HTML5 repo,** com a UI5 pelo CDN, o serviço por caminho relativo e o `xs-app.json`;
   - **os destinos do proxy do `ui5.yaml`.** O endereço https público vira destino criado pelo MTA. O sistema SAP com login usa um destino que já existe, pelo nome, em `destinos`;
   - **o roteador**, de um dos dois tipos:
     - `proprio`: um approuter no space; o app abre em `https://<rota>/<app>/index.html`;
     - `gerenciado`: pelo SAP Build Work Zone, que precisa estar assinado na subconta.
2. **`sap.cf.mta.deploy`** (o bundle `cf`, a conexão da subconta) implanta pelo serviço de deploy de MTA, o mesmo do `cf deploy`: envia o arquivo, começa a operação DEPLOY, espera o fim e relê o MTA (os módulos, as rotas, os serviços).
   - A operação que para (`ERROR`, `ACTION_REQUIRED`) volta com as mensagens.
   - O `sap.cf.mta.operation` aborta ou repete essa operação, com o usuário de acordo.
3. **`sap.cf.mta.get`** relê o MTA a qualquer hora.

- **A conta certa:** criar e implantar só na subconta de desenvolvimento do próprio projeto, ou na BTP Trial para prova. Confira o `sap.cf.space.describe` (a org e o space) antes de implantar.
- **App sobre CAP:** a publicação do serviço e do banco segue a `btp-publicar-cap`.

### 4. O launchpad

- **A navegação de entrada (inbound)** no `manifest.json` (`sap.app.crossNavigation.inbounds`): o semantic object e a action pelos quais o launchpad abre o app.
  - Pelo Speed Up, o **`sap.fiori.app.inbound`** grava o objeto semântico, a ação, o título, o subtítulo e o ícone, com os textos no i18n (`flpTitle`, `flpSubtitle`).
  - Depois, rode o build (o portão) antes do MTA ou do deploy.
- **O launchpad local para conferir antes:** o `preview-middleware` serve um launchpad em `/test/flp.html`, com o tema configurável (`flp.theme`).
- **No sistema**, o tile e o catálogo do app vêm da configuração do launchpad (no ABAP, a app descriptor e o target mapping; no BTP, o Work Zone ou o Launchpad Service). Esse passo é do usuário ou do administrador: a lacuna `ui5.app.open` traz a escada.

### 5. A prova

1. **Abra o app publicado:** `sap.fiori.app.open` com a `url` (a rota que o `sap.cf.mta.deploy` devolve, mais `/<app>/index.html`). É o navegador sem tela do portão: ele faz as capturas da lista e do objeto nos temas e tamanhos, e separa o console em erro, aviso e ambiente.
   - O app com login (o XSUAA, o launchpad do ABAP) se abre pelo navegador da IA, e o login é do usuário.
2. **Olhe o console:** sem erro.
3. **Confira as capturas:** o fluxo principal, nos temas da `fiori-aparencia`.
4. **Guarde a evidência no projeto:**
   - a leitura do Speed Up (`sap.ui5.app.get`, `sap.ui5.app.check` ou `sap.cf.app.get`);
   - a versão UI5;
   - o portão da `fiori-testes`;
   - as capturas.
5. **Atualize o manual do app** (`processo-manual`): cada passo feito no sistema vira um passo marcado, com a data, quem fez e a prova.

## Com o Speed Up

- **O repositório UI5 do ABAP:** o bundle `ui5` (`sap.ui5.service.discover`, `sap.ui5.app.get`, `sap.ui5.app.plan`, `sap.ui5.app.deploy` com ou sem a ordem, `sap.ui5.app.remove`, `sap.ui5.app.check`); a ordem, no bundle `adt` (`sap.abap.transport.info`, `sap.abap.transport.create`).
- **O BTP:** o bundle `fiori` (`sap.fiori.app.inbound`, `sap.fiori.app.mta`, `sap.fiori.app.open`) e o bundle `cf` (`sap.cf.space.describe`, `sap.cf.mta.deploy`, `sap.cf.mta.get`, `sap.cf.mta.operation`, `sap.cf.apps.list`, `sap.cf.app.logs`).
- **A versão e o manifest:** `mcp_sap_executar`, MCP `ui5` (`get_version_info`, `run_manifest_validation`).
- **As docs da entrega, com a fonte:** `mcp_sap_docs` (por exemplo, "deploy to ABAP repository transport request", "Fiori launchpad inbound navigation").

## Limites

- **Liberar a ordem de transporte** é gesto do usuário (a lacuna `ui5.transportable.deploy`).
- **Desimplantar o MTA** (apagar os apps e os serviços) também é gesto do usuário (a lacuna `cf.mta.undeploy`).
- **O tile e o catálogo do launchpad no sistema:** no ABAP, o catálogo e o grupo vêm do Launchpad App Manager; no BTP, do conteúdo do SAP Build Work Zone. São do usuário ou do administrador (a lacuna `ui5.app.open`). O inbound no manifest é o que eles leem.
- **O app com login** (o XSUAA no roteador próprio, o launchpad do ABAP): o `sap.fiori.app.open` abre só o que não pede login. O resto abre no navegador da IA, com o login do usuário.
- **A prova real da F5** (22/10/2026) foi local: o inbound, o build e o arquivo MTA no app de exemplo. O deploy no BTP espera a conexão da BTP Trial no Speed Up, e o deploy com a ordem espera um sistema ABAP. O registro está em `docs/melhorias/2026-10-22-fiori-f5-publicar.md`.
- **O build pelo Speed Up** existe desde a F4: o item `build` do `sap.fiori.app.check`, que fecha a lacuna `ui5.project.build` para os apps da pasta de apps Fiori.

## Fontes (consultadas em 22/10/2026)

- As docs de Fiori pelo `search_docs`:
  - "fiori deploy" e "fiori add deploy-config": as opções, o `ui5-deploy.yaml` e os pré-requisitos do Cloud Foundry;
  - "Deployment to ABAP": os pré-requisitos, o exemplo com `REPLACE_WITH_TRANSPORT` e o `dist` sem o `test`;
  - "add inbound-navigation" e "fiori add flp-config";
  - "Configuring Navigation for SAP Fiori elements";
  - "Preview" (o launchpad local em `/test/flp.html` e o `flp.theme`);
  - "Configure SAPUI5 Version for an Application (manifest.json, Preview, and Deployment)" (a `minUI5Version`).
- O npm (22/10/2026): `@sap-ux/create` 1.5.2.
- O MCP de UI5: o app criado na prova da F1 (o `ui5.yaml` com a 1.148.0 e o `themelib_sap_horizon`).
- Speed Up: os bundles `ui5` e `cf`, e as lacunas `ui5.transportable.deploy`, `ui5.app.open` e `ui5.project.build`.
