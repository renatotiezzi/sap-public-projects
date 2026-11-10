---
name: fiori-desenho-do-app
description: Porta de entrada de todo app Fiori com o Speed Up — escolhe o floorplan certo (List Report/Object Page, Worklist, Analytical List Page, Overview Page, Form Entry, página própria do FPM ou freestyle) e escreve o porquê, fixa a régua de qualidade do app (arquitetura, aparência, testes, entrega) e diz qual skill usar em cada etapa. Use antes de gerar, mudar ou revisar qualquer app Fiori ou UI5, sobre RAP ou CAP.
titulo: "Fiori: o desenho do app e o mapa das skills"
area: fiori
bundles: [fiori, rap, cap, ui5]
versao: 1.2.0
ordem: 1
atualizado_em: 2026-10-22
origem:
  - "Sap-Speed-Up/docs/melhorias/2026-10-21-plano-apps-fiori.md"
  - "Sap-Speed-Up/docs/melhorias/2026-10-21-fiori-f0-ponte-de-mcps.md"
  - "Sap-Speed-Up/docs/melhorias/2026-10-22-fiori-f2-gerar-o-app.md"
---

# Fiori: o desenho do app e o mapa das skills

Um app Fiori de alto nível nasce de um desenho escrito antes de qualquer código: o usuário e a tarefa dele, o floorplan que serve a essa tarefa e o porquê. A UI é dirigida por anotação no backend; o código de tela entra só onde o floorplan não chega.

## Quando usar

- Antes de gerar um app Fiori ou UI5, sobre RAP (ABAP) ou CAP.
- Antes de mudar ou revisar um app que já existe.
- Quando não estiver claro em que etapa o trabalho está.

## O caminho, na ordem

| Etapa | Skill | O que sai dela |
|---|---|---|
| 1. O desenho | esta | O `.md` do desenho no projeto: o usuário, a tarefa, o floorplan e o porquê, as entidades e as ações |
| 2. O backend | `rap-desenvolvimento` ou `cap-desenvolvimento-local` (e `cds-modelagem`) | O serviço OData V4 servido, com draft quando há edição |
| 3. As anotações | `fiori-anotacoes` | A UI dirigida por anotação, no backend |
| 4. Gerar o app | esta (a seção abaixo) | O app gerado pelo gerador oficial da SAP, na versão UI5 da régua |
| 5. A aparência | `fiori-aparencia` | As telas conferidas por captura, nos temas e tamanhos |
| 6. O portão de qualidade | `fiori-testes` | Lint, manifest, testes: tudo verde |
| 7. A entrega | `fiori-entrega` e `fiori-ui5-repositorio` | O app publicado, aberto no launchpad, com a prova |

## O floorplan certo

Escolha pela tarefa do usuário, não pela tela que alguém desenhou. Na dúvida, o List Report/Object Page.

| Floorplan | O id no gerador | Quando usar | Quando não usar |
|---|---|---|---|
| **List Report / Object Page** | `FE_LROP` | Achar, filtrar e agir sobre muitos objetos, e abrir um para ver ou editar o detalhe (o caso mais comum: pedidos, documentos, cadastros) | Tarefa que é só um formulário de entrada |
| **Worklist** | `FE_WORKLIST` | Uma lista de itens a tratar, sem a barra de filtros completa (a fila de trabalho do dia) | Quando a pessoa precisa filtrar por muitos critérios |
| **Analytical List Page** | `FE_ALP` | Analisar e agir: o gráfico e a tabela juntos, com os filtros visuais, para achar o que está fora do padrão | Quando não há medida a agregar |
| **Overview Page** | `FE_OVP` | A visão de um papel: cartões de várias fontes, cada um levando ao app que trata o assunto | Como lugar de trabalho: ela só mostra e navega |
| **Form Entry Object Page** | `FE_FEOP` (só OData V4) | Criar um objeto por um formulário, direto, sem a lista antes | Quando a pessoa precisa achar o objeto primeiro |
| **Página própria do FPM** | `FE_FPM` (só OData V4) | O que nenhum floorplan faz, montado com os building blocks do Fiori elements (tabela, formulário, gráfico, filtro), sem perder o comportamento padrão | Para refazer o que um floorplan já faz |
| **Freestyle** | `FF_SIMPLE` (ou `create_ui5_app` do MCP de UI5) | Só com o motivo escrito no desenho: uma interação que nenhum floorplan nem o FPM cobre. E então em TypeScript | Como primeira escolha |

**Antes de fechar o floorplan, confirme na fonte:** `mcp_sap_docs` com a pergunta "choosing a floorplan list report worklist analytical list page overview page". O guia "Supported Floorplans for SAP Fiori elements" diz o que cada um suporta na versão atual.

## A régua do app (o nível mais alto)

Cada item é conferido, não aconselhado. A skill de cada etapa diz como.

- **Arquitetura:**
  - Fiori elements primeiro, sobre OData V4. O V2 só para manter um app que já é V2.
  - As anotações moram no backend: a metadata extension no RAP e o arquivo de anotação no CAP. O arquivo local de anotações do app fica só para o que é da tela (`fiori-anotacoes`).
  - O FPM para o que o floorplan não faz. O freestyle só com o motivo escrito, e em TypeScript.
  - Sem modificação de standard: extensão, adaptação ou app próprio.
  - Edição com draft (RAP com draft, CAP com `@odata.draft.enabled`).
- **A versão UI5:** a de manutenção longa (LTS) vigente, conferida na hora com `get_version_info` do MCP de UI5. Em 22/10/2026 a mais nova é a 1.153, e a LTS é a 1.148. O gerador, sem a versão, usa a mais nova: passe `project.ui5Version`.
- **Aparência:** o tema Horizon, os estados (vazio, erro, carregando), as mensagens e a densidade, conferidos por captura nos temas e tamanhos (`fiori-aparencia`).
- **Qualidade:** o UI5 linter com zero achado, o manifest validado, os testes OPA5 do fluxo principal e os testes do backend (`fiori-testes`).
- **Entrega:** o deploy com plano, ensaio, releitura e conferência; a ordem de transporte; o tile no launchpad; o manual do app no projeto (`fiori-entrega`).

## Gerar o app (a etapa 4)

O Speed Up gera pelo bundle `fiori` (desde a F2, 22/10/2026). Ele usa os writers oficiais da SAP (o mesmo motor do Fiori tools), com a versão fixa e instalados do npm na primeira geração. A conexão é do tipo `fiori-project`: a pasta onde os apps ficam.

1. **O `$metadata` do serviço na pasta:**
   - **num service binding RAP publicado:** `sap.rap.service.metadata` com `objectName` e `targetDir` (por exemplo, `<pasta dos apps>/metadata`). Ela grava o EDMX e devolve o `servicePath` e o `serviceUrl` prontos;
   - **em outro serviço:** salve o `$metadata` como `.xml` dentro da pasta (a lacuna `fiori.service.metadata` traz a escada).
2. **Gerar:** `sap.fiori.app.generate` (escrita local: habilite no painel na primeira vez). Os argumentos:
   - `name` (a pasta do app, em minúsculas e hífen), `appId` (com namespace) e `title`;
   - `floorplan` (`lrop`, `worklist`, `alp`, `ovp`, `feop`, `fpm` ou `freestyle`);
   - `metadataFile` (relativo à pasta), `serviceUrl`, `servicePath` e `mainEntity`;
   - `navigationEntity`, se houver itens;
   - `pageName`, na `fpm`.

   A UI5 padrão é a da régua (1.148.0) e o tema é o Horizon. Vêm junto os testes OPA (menos na OVP, que o gerador de testes não suporta) e o preview com dados simulados no launchpad local.
3. **O que a geração confere antes de rodar** (e recusa, com a lista do que vale):
   - o EntitySet existe no `$metadata`;
   - a navegação para os itens leva a OUTRO EntitySet. A de contenção (sem EntitySet) e a que volta ao próprio EntitySet (como `Friends` de `People`) fazem o writer gerar duas rotas com o mesmo nome, e o Object Page abre em branco, como a prova da F2 mostrou;
   - a FEOP e a FPM pedem OData V4;
   - a pasta do app ainda não existe, porque a geração nunca sobrescreve.

   Se a geração falhar, nada fica na pasta.
4. **Depois de gerar:**
   - `sap.fiori.app.read` mostra o app (o floorplan, a versão, as jornadas OPA e o hash de cada arquivo);
   - `sap.fiori.app.install` (as dependências) e `sap.fiori.app.check` (o portão: lint, ESLint, build, OPA e as capturas nos temas) dizem se o app está verde;
   - siga para a `fiori-testes` (o portão) e a `fiori-aparencia` (as capturas).

**App dentro de um projeto CAP** (na pasta `app/`, com o `cds watch`): ainda não está no bundle `fiori`. O MCP de Fiori tem o `generate_fiori_app_cap`, mas ele exige o gerador `@sap/generator-fiori` instalado de forma global (licença SAP). Instalar isso é decisão do usuário.

## Com o Speed Up

- **As docs, com a fonte:** `mcp_sap_docs`. Busca nas de Fiori elements, anotações, UI5 e OPA5 e nas do CAP; com `simbolo` e `projeto`, na referência da API do UI5.
- **Gerar e ler os apps:** o bundle `fiori` (`sap.fiori.project.discover`, `sap.fiori.app.generate`, `sap.fiori.app.read`), sobre a conexão `fiori-project`.
- **Os MCPs oficiais da SAP:** `mcp_sap_ferramentas` lista as ferramentas, e `mcp_sap_executar` chama uma.
  - `fiori`: modificar o app (`list_functionality`, `get_functionality_details`, `execute_functionality`), baixar o `$metadata` e listar os apps. O `generate_*` dele exige o gerador global da SAP: use o bundle `fiori`;
  - `ui5`: versões, guias, API, lint, manifest, app freestyle;
  - `cap`: o modelo CDS.
- **O backend:**
  - o bundle `rap`: `sap.rap.ddls.upsert`, `sap.rap.bdef.upsert`, `sap.rap.srvd.upsert`, `sap.rap.srvb.create`, `sap.rap.srvb.publish`, `sap.rap.service.describe` e `sap.rap.service.metadata` (o EDMX na pasta);
  - o bundle `cap`: `sap.cap.model.upsert`, `sap.cap.service.upsert`, `sap.cap.serve.start` e `sap.cap.test.run`.
- **A publicação no ABAP:** o bundle `ui5` (`fiori-ui5-repositorio`).

## Limites

- **Sem Edge nem Chrome na máquina,** o portão não roda o OPA nem as capturas (a lacuna `fiori.app.preview` traz a escada).
- **Modificar o app gerado** (página, coluna, seção) é a F3. Até lá, use a modificação do MCP de Fiori.
- **O app dentro do projeto CAP:** veja acima.
- **O adaptation project** (variante de um app standard) fica fora: precisa do sistema do cliente e é fase própria do plano, se houver o caso.

## Fontes (consultadas em 22/10/2026)

- O MCP de Fiori (`@sap-ux/fiori-mcp-server` 1.15.14): o esquema do `generate_fiori_app_odata` e do `generate_fiori_app_cap` (os floorplans `FE_LROP`, `FE_ALP`, `FE_OVP`, `FE_WORKLIST`, `FE_FEOP`, `FE_FPM`, `FF_SIMPLE`; a pasta que não pode existir; o `metadataFilePath`; a versão UI5 mais nova quando omitida).
- O MCP de UI5 (`@ui5/mcp-server` 0.3.2): `get_version_info` (SAPUI5 1.153.0 a mais nova; 1.148 a LTS).
- As docs de Fiori pelo `search_docs`: "Supported Floorplans for SAP Fiori elements", "Using SAP Fiori Elements Floorplans — Quick Reference for Code Generation", "Form Entry Object Page (SAP Fiori elements for OData V4)", "Page Building Block (sap.fe.macros.Page)", "Enable and Configure Flexible Column Layout (FCL) in SAP Fiori Elements".
- O plano aprovado:  (documento do Speed Up).
- A F2:  (documento do Speed Up) (os sete floorplans gerados de verdade, a navegação de contenção que quebra o Object Page e o preview no launchpad virtual).
