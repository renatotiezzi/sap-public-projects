---
name: fiori-testes
description: O portão de qualidade de um app Fiori ou UI5 com o Speed Up — o UI5 linter com zero achado, o manifest validado, os dados simulados para o preview, os testes OPA5 do fluxo principal (sap.fe.test no Fiori elements V4, a testLibrary no V2, QUnit e OPA no freestyle) e os testes do backend (RAP e CAP). Use antes de toda entrega e depois de toda mudança no app; o app só segue para a fiori-entrega com tudo verde.
titulo: "Fiori: o portão de qualidade (lint, manifest, dados simulados e testes)"
area: fiori
bundles: [fiori, rap, cap]
versao: 1.3.0
ordem: 40
atualizado_em: 2026-10-22
origem:
  - "Sap-Speed-Up/docs/melhorias/2026-10-21-plano-apps-fiori.md"
  - "Sap-Speed-Up/docs/melhorias/2026-10-22-fiori-f1-docs-e-skills.md"
  - "Sap-Speed-Up/docs/melhorias/2026-10-22-fiori-f3-modificar-e-anotar.md"
---

# Fiori: o portão de qualidade

Um app só segue para a entrega quando o portão está todo verde. Conselho não conta: cada item abaixo é uma execução com resultado, e o resultado fica no projeto.

## Quando usar

- Antes de toda entrega (`fiori-entrega`).
- Depois de toda mudança no app: a anotação, o manifest, uma extensão, a versão UI5.
- Ao revisar um app que alguém fez.

## O portão numa chamada (desde a F4, 22/10/2026)

Num app da pasta de apps Fiori (a conexão `fiori-project`), o caminho é este:
1. **`sap.fiori.app.install`** instala as dependências do app (npm install, sem os scripts de instalação). Uma vez por app, e de novo quando o `package.json` mudar.
2. **`sap.fiori.app.check`** roda o portão inteiro e devolve **VERDE** ou **VERMELHO**, com a lista do que falta (`pendencias`) e o resultado de cada item (`itens`). Os itens:

| Item | O que roda | Verde quando |
|---|---|---|
| `lint` | O UI5 linter (`@ui5/linter`, versão fixa): API depreciada, globais, preparo para o UI5 2.x e o manifest | Nenhum achado |
| `eslint` | O ESLint do próprio app, com as regras do Fiori tools (`@sap-ux/eslint-plugin-fiori-tools`). Se o app não traz ESLint, o item não bloqueia | Zero erro |
| `build` | O `ui5 build` do app, que gera o `dist` com o `Component-preload.js` | O build termina e o `dist/manifest.json` existe |
| `opa` | O preview com os dados simulados (o `fiori run` com o `ui5-mock.yaml`) e a suíte OPA (`/test/integration/opaTests.qunit.html`), num navegador sem tela: o Edge ou o Chrome desta máquina | Todos os testes passam, e há pelo menos um |
| `capturas` | A lista (com a busca feita com o mouse e as linhas esperadas) e o primeiro objeto (a primeira linha clicada), nos quatro temas Horizon e no desktop e no celular, gravados em `<app>/.speedup/capturas/<data>/` | Nenhum erro do app no console, o tema pedido aplicado em todas e todo objeto clicado aberto. O console é separado em três grupos: **erro** (bloqueia), **aviso** (aparece, não bloqueia: o idioma de reserva fora dos `supportedLocales`, as APIs depreciadas que a UI5 registra e o pseudo-módulo depreciado que a própria UI5 importa por dentro, como o `sap/m/ListKeyboardMode` do `sap/ui/mdc` na tabela do Object Page) e **ambiente** (só contado: o launchpad local de teste, o `sap/ushell`, o LREP e os `changes-bundle`, que só existem no sistema). A lista sem dados é dita, mas não bloqueia, porque a OVP e a página própria não têm tabela |

- **`itens`, `temas` e `tamanhos`** escolhem uma parte. Por exemplo, `itens: ["lint"]` depois de cada mudança: o guia do UI5 manda rodar o linter de novo para ver que nada novo apareceu.
- **No fim,** o preview e o navegador são fechados sempre, com a árvore de processos inteira.
- **As capturas são a base da conferência** da `fiori-aparencia`: olhe cada uma.

**Os testes do backend** ficam fora do portão do app: RAP com `sap.rap.unit.run` (o ABAP Unit da classe) e CAP com `sap.cap.test.run` (o `cds.test`). Rode antes do portão.

**O manifest validado contra o esquema:** o `run_manifest_validation` do MCP de UI5 (`mcp_sap_executar`) continua valendo para conferir um manifest mexido à mão.

**O primeiro achado do portão:** o app que o gerador oficial escreve vem com o manifest `_version` 1.x, e o UI5 linter acusa `no-outdated-manifest-version`. A geração do Speed Up já entrega o manifest na Version 2 (`_version` 2.0.0, que vale da UI5 1.136 em diante). Num app que venha de fora, essa é a primeira correção.

## Os dados simulados (o preview sem o backend)

- **Fiori elements (V4 e V2):** o `@sap-ux/ui5-middleware-fe-mockserver`, configurado no `ui5-mock.yaml` e subido com `npm run start-mock`.
  - O app gerado pelo Speed Up (`sap.fiori.app.generate`) usa os endpoints virtuais do preview: o endereço do launchpad local vem na resposta da geração (`preview`, por exemplo `/test/flp.html#app-preview`). Não crie o `flpSandbox.html` físico: o da geração clássica não resolve a navegação na UI5 1.148 (achado da prova da F2, 22/10/2026).
  - Os dados ficam na pasta `mockdataPath` do `ui5-mock.yaml` (no app gerado, `webapp/localService/mainService/data/`), um JSON por EntitySet. Sem o arquivo, o mockserver gera os dados sozinho (`generateMockData: true`).
  - **O gerador do mockserver escreve a data e hora com milissegundos** (`…:08.000Z`; o `@sap-ux/fe-mockserver-core` 1.8.0), e a UI5 recusa o valor quando o serviço não declara a precisão (`FormatException … Illegal sap.ui.model.odata.type.DateTimeOffset value`). Toda tabela com data e hora deixa o portão vermelho (achado da F3, 22/10/2026). A saída é o `sap.fiori.app.mockdata`: ele escreve os arquivos a partir do `$metadata`, com a data na precisão do serviço, as chaves únicas e os itens ligados ao pai (pela `ReferentialConstraint`, ou pela chave do pai com o mesmo nome, como o mockserver resolve a navegação). Ele recusa trocar o arquivo que já existe sem o `sobrescrever`.
  - Apps V2 antigos podem usar o `sap.ui.core.util.MockServer` (`localService/mockserver.js`). Em app novo, use o middleware.
- **Freestyle criado pelo MCP de UI5:** o projeto já vem com `npm start` (o `ui5 serve`) e a página `test/preview.html`.
- **CAP:** o próprio `cds watch` serve com dados de exemplo (o bundle `cap`: `sap.cap.serve.start`).

## Os testes OPA5

**Fiori elements V4:** a biblioteca `sap.fe.test`, com o `JourneyRunner` e os page objects do List Report e do Object Page.
- Com o `test` configurado no `fiori-tools-preview` (ou no `preview-middleware`) do `ui5.yaml` ou do `ui5-mock.yaml`, a página e o arquivo de entrada da suíte são gerados na hora. Toda jornada cujo nome casa com o padrão entra sozinha (padrão: `/test/**/*Journey{,.gen}.{js,ts}`). Nesse caso, não crie o `opaTests.qunit.html` à mão.
- No esquema clássico (os arquivos físicos), o arquivo de entrada põe `QUnit.config.autostart = false` antes de carregar as jornadas e chama `QUnit.start()` no fim. Sem isso, os testes falham de vez em quando.

**Fiori elements V2:** a `sap/suite/ui/generic/template/integration/testLibrary`. **Nunca misture com a `sap.fe.test`.**

**Freestyle:** o `create_ui5_app` do MCP de UI5 já gera:
- o QUnit (`test/unit`);
- o OPA (`test/integration`, com uma jornada e um page object);
- o `ui5-test-runner` com a cobertura mínima no `package.json`.

O exemplo conferido em 22/10/2026 é um app TypeScript na UI5 1.148.0. O `npm test` roda o lint e o `test-ui5`, que é o `ui5-test-runner` com `--coverage -ccb 50 -ccf 40 -ccl 50 -ccs 50`. O linter voltou `[]` e o manifest voltou `isValid: true`.

**O que cada jornada cobre:** o fluxo principal do desenho (`fiori-desenho-do-app`). Por exemplo: abrir a lista, filtrar, abrir o objeto, editar com draft, salvar e ver a mensagem de sucesso. Uma jornada por tarefa do usuário, não por tela.

**Quando um teste falha:**
- Ponha `sap.ui.test.qunitPause.pauseRule = "assert,timeout";` na entrada, para o app parar vivo no ponto da falha. Tire a linha quando passar.
- A partir da UI5 1.147, a biblioteca `sap.ui.testrecorder` ajuda a achar o seletor certo. Ela entra só enquanto se investiga.
- No CI, o tempo padrão do OPA5 (15 s) é curto: use 60 (`opaConfig.timeout` no V4, `Opa5.extendConfig({ timeout: 60 })` no V2).

## O resultado

Cada rodada do portão vira resultado no projeto: o que rodou, quando, o resultado e a versão. Use os cenários de teste em `.md` da `processo-cenario-de-teste`. "Passou" sem a saída da execução não conta.

## Com o Speed Up

- **O portão:** `sap.fiori.app.install` e `sap.fiori.app.check` (o bundle `fiori`, sobre a conexão `fiori-project`).
- **O lint e o manifest avulsos:** `mcp_sap_executar`, MCP `ui5` (`run_ui5_linter`, `run_manifest_validation`, `get_project_info`). Leia antes o esquema com `mcp_sap_ferramentas`.
- **As docs de teste, com a fonte:** `mcp_sap_docs` (por exemplo, "OPA5 tests Fiori elements", "mockserver local preview data").
- **O backend:** `sap.rap.unit.run` e `sap.cap.test.run` (`sap_execute`).

## Limites

- **Sem Edge nem Chrome na máquina,** o `opa` e as `capturas` não rodam, e o portão fica vermelho com o motivo. A lacuna `fiori.app.preview` traz a escada (o preview pelo navegador da IA).
- **O freestyle:** o portão usa o `ui5-mock.yaml` do Fiori elements. No freestyle, o `opa` não sobe o preview; rode o `npm test` do app (o `ui5-test-runner`) pelo terminal da IA.
- **O wdi5** (o teste ponta a ponta com WebdriverIO, contra o sistema de verdade) fica para o app piloto (F7): o portão roda contra os dados simulados.

## Fontes (consultadas em 22/10/2026)

- As docs de Fiori pelo `search_docs`, na skill "sap-fiori-opa5-test-development" (versão 1.0.4, de sap-fiori-tools): a `sap.fe.test` e a `fioriElementsTestLibrary` (nunca misturar); o arquivo de entrada com o `autostart`; o endpoint virtual do `fiori-tools-preview` com o padrão das jornadas; o `pauseRule`, o TestRecorder (1.147+) e o tempo de 60 s no CI.
- As docs de Fiori: "Fiori Tools — Data Editor: Generate, Edit, and Persist Mock Data" e "Use Mock Data" (o `npm run start-mock`, o `webapp/localService/mockdata`, o `ui5-mock.yaml`, o `@sap-ux/ui5-middleware-fe-mockserver`).
- O MCP de UI5 (`@ui5/mcp-server` 0.3.2): `run_ui5_linter` (rodar de novo depois de mudar), `run_manifest_validation`, `create_ui5_app`. Também o app gerado na prova da F1, com os scripts do `package.json`.
