---
name: btp-publicar-cap
description: Publica um projeto SAP CAP (Node.js) no SAP BTP Cloud Foundry com banco no SAP HANA Cloud, pelo Speed Up — conferir o space e os entitlements, criar o container HDI e o XSUAA, implantar o banco por tarefa, publicar o serviço e provar. Use quando o CAP já passou nos testes locais e é hora de colocá-lo no BTP.
titulo: "BTP: publicar CAP no Cloud Foundry com HANA"
area: btp
bundles: [cap, cf, hana, btp]
versao: 1.0.0
ordem: 20
atualizado_em: 2026-10-02
origem:
  - "Sap-Speed-Up/packages/adapters/src/bundles/cap/lacunas.ts@sha256:55d831f1fc69"
  - "Sap-Speed-Up/docs/work-items/SU-WI-047-payload-store-cap-hana/RESULT.md@sha256:5122857521dc"
  - "Sap-Speed-Up/docs/work-items/SU-WI-047-payload-store-cap-hana/P1_BUNDLE_CF.md@sha256:adf9cfc305d7"
  - "Sap-Speed-Up/packages/adapters/src/bundles/cf/lacunas.ts@sha256:cd018ba9fcbe"
---

# BTP: publicar CAP no Cloud Foundry com HANA

O caminho do Speed Up para colocar um CAP no BTP é o **bundle Cloud Foundry**, pela API v3, sem a `cf` CLI: o banco é implantado por uma **tarefa** e o serviço por **push**. Foi assim que um CAP real foi publicado e provado (SU-WI-047). O deploy de `.mtar` (`cf deploy`) é lacuna conhecida: é o degrau do navegador, ao fim desta skill.

## Quando usar

- O projeto já compila, testa e responde local (`cap-desenvolvimento-local`).
- Há uma conexão `cloud-foundry` do space de **destino** (DEV, TEST ou SANDBOX), com a escrita autorizada no painel.

## Antes de publicar

1. **Prontidão do projeto:** `sap.cap.deploy.diagnose` (não faz deploy) confere `@sap/cds` em `dependencies`, o motor instalado, o `mta.yaml`, o `gen/srv` e o banco de produção.
2. **Os dois builds:**
   - `sap.cap.build` gera `gen/srv` (o app Node.js);
   - o artefato do banco, `gen/db` (artefatos HDI e o deployer), sai de `cds build --production` no terminal ou no Business Application Studio. É passo do usuário: o Speed Up não roda esse build.
   - No `package.json` do deployer, o script de start usa o `@sap/hdi-deploy` **com `--exit`**: sem ele, o deployer não termina quando roda como tarefa (achado real da SU-WI-047).
3. **O space:** `sap.cf.space.describe` mostra org, space e a cota de memória livre. Um app CAP pequeno pede cerca de 256 MB; a tarefa do banco, 512 MB.
4. **Os planos:** `sap.cf.services.list` lista as ofertas e planos visíveis no space e as instâncias que já existem. Precisa haver `hana` / `hdi-shared` e `xsuaa` / `application`. Plano invisível = falta entitlement: `sap.btp.entitlements.list` (conexão `btp`) confirma, e atribuir é passo do usuário no Cockpit.
5. **O HANA ligado e mapeado ao space:** o HDI só é criado com a instância HANA rodando. Se ela é uma instância do space, `sap.cf.service-instance.update` com `{"data":{"serviceStopped":false}}` a liga (pode levar vários minutos: use `waitSeconds` até 900). Se foi criada fora do space (HANA Cloud Central), ligar é passo do usuário.

## Publicar, passo a passo

1. **Container HDI:** `sap.cf.service-instance.create` com `offering: "hana"`, `plan: "hdi-shared"`. Por nome, a criação é idempotente; outro plano com o mesmo nome é recusado sem pedido.
2. **XSUAA:** `sap.cf.service-instance.create` com `offering: "xsuaa"`, `plan: "application"` e os `parameters` do `xs-security.json`. Os campos `token-validity`, `credential-types` e `grant-types` passam; nome com cara de segredo é recusado antes de qualquer pedido.
3. **Implantar o banco:**
   - `sap.cf.app.push` do `gen/db` com `start: false` e `noRoute: true`, ligado ao HDI (`services`). O app fica STAGED, com droplet e parado;
   - `sap.cf.task.run` nesse app com `command: "npm start"`. O resultado é `SUCCEEDED` ou `FAILED`, com o motivo;
   - leia **logo** `sap.cf.app.logs` com `task`: o log da tarefa fica pouco tempo no log-cache. A prova é o código de saída 0 e a linha do deployer dizendo que o deploy no container terminou.
4. **Publicar o serviço:** `sap.cf.app.push` do `gen/srv`, com `memoryMb`, os `services` (HDI e XSUAA) e a rota (`route.host`). Num domínio compartilhado, o host é global: prefixe com algo próprio da conta. O push recusa host que pertence a outra conta antes de criar qualquer coisa.
5. **Conferir:** `sap.cf.app.get` mostra as instâncias (`RUNNING`), o droplet, as rotas e os serviços ligados; `sap.cf.app.logs` mostra o boot. `sap.cf.apps.list` dá a visão do space.
6. **Provar o efeito de negócio:** uma chamada real ao serviço, ou uma tarefa de conferência (`sap.cf.task.run` com um script que grava, lê de volta e sai com 0 só se tudo bater). Deploy no ar não é prova de que grava.
7. **Quem consome o serviço:** `sap.cf.service-key.create` na instância XSUAA cria a chave. O Speed Up recebe só os metadados; o conteúdo (client ID e segredo) o usuário lê no Cockpit e guarda onde o consumidor precisa.

## Quando algo dá errado

- **`staging_failed`:** o `npm install` roda na nuvem durante o staging. Leia `sap.cf.app.logs` com `source: "staging"`.
- **`app_crashed`:** leia os logs do app; falta de binding, variável ou porta é o mais comum.
- **Tarefa presa:** `sap.cf.task.get` mostra o estado, e `sap.cf.task.cancel` cancela.
- **Tarefa `FAILED`:** o `task.run` reserva pelo app, então rode `sap_reconcile` antes de tentar de novo.
- **Instância em "create failed"** (por exemplo, o HANA estava parado): crie outra com outro nome. Apagar é passo do usuário no Cockpit, porque apagar é lacuna conhecida do bundle.

## Degrau do navegador (lacuna `cap.deploy.cf`)

Sem conexão `cloud-foundry` do destino, ou quando o projeto precisa de `.mtar`:
1. no Business Application Studio, gerar o arquivo com `mbt build` (o `sap.cap.mta.prepare` cria o `mta.yaml`, com `cds add mta`, e nunca sobrescreve um existente);
2. o **usuário** entra com `cf login` (API da região, org e space; usuário e senha são dele);
3. com o usuário de acordo, `cf deploy mta_archives/<arquivo>.mtar`.

Depois, volte ao Speed Up: `sap.cf.app.get` confere o que foi publicado, e `sap.cap.deploy.diagnose` dá a evidência da prontidão.

## Limites

- O bundle `cf` está qualificado em fixture e já publicou um CAP real numa conta trial (SU-WI-047). Prova em outra conta exige alvo, efeito e autorização atuais.
- O push não apaga app, rota nem binding e não faz rolling deployment.

## Fontes (consultadas em 02/10/2026)

- [CAP — Deploy to Cloud Foundry](https://cap.cloud.sap/docs/guides/deploy/to-cf): `cds add hana`, `cds add xsuaa`, `cds add mta`, build e `cf deploy`.
- [CAP — Using SAP HANA Cloud for Production](https://cap.cloud.sap/docs/guides/databases/hana): HDI com `hdi-shared`, artefatos em `gen/db`, a instância ligada e mapeada para o space.
- [Cloud Foundry — Running tasks in your apps](https://docs.cloudfoundry.org/devguide/using-tasks.html): tarefa como processo único num contêiner próprio, com os estados RUNNING, SUCCEEDED e FAILED.
- Speed Up: o resultado real da SU-WI-047 (o `--exit` do deployer, o log-cache curto, o HANA parado) e a escada da lacuna `cap.deploy.cf`.
