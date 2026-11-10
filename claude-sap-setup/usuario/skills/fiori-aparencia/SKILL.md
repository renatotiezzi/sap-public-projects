---
name: fiori-aparencia
description: A aparência de um app Fiori no nível mais alto, conferida e não opinada — o tema Horizon (claro, escuro e os dois de alto contraste), a resposta ao tamanho da tela pela importância, a tabela certa para cada dado, a densidade, os estados vazio, de erro e de carregamento, as mensagens, as variantes e o cabeçalho com os indicadores — e a conferência por captura de cada tela nos temas e tamanhos. Use antes de entregar um app Fiori e ao revisar um que alguém fez.
titulo: "Fiori: a aparência (Horizon, estados, mensagens e a conferência por captura)"
area: fiori
bundles: [fiori, ui5]
versao: 1.1.0
ordem: 30
atualizado_em: 2026-10-22
origem:
  - "Sap-Speed-Up/docs/melhorias/2026-10-21-plano-apps-fiori.md"
  - "Sap-Speed-Up/docs/melhorias/2026-10-22-fiori-f1-docs-e-skills.md"
---

# Fiori: a aparência

No Fiori elements, a boa aparência vem de usar bem o que o floorplan já sabe fazer, não de CSS. A régua: o tema Horizon, nada de estilo próprio sem motivo escrito, e cada tela conferida por captura antes da entrega.

## Quando usar

- Antes de entregar um app (o passo 5 da `fiori-desenho-do-app`).
- Ao revisar a tela de um app.

## Regras

- **Sem CSS próprio nem controle próprio** onde o floorplan, o building block ou a anotação resolve. Os controles padrão do Fiori elements e do SAPUI5 já vêm prontos para o Horizon; o que é próprio precisa ser testado nos quatro temas.
- **Os textos vêm do i18n,** em todas as línguas do app. Nenhum texto fixo na tela.
- **Formulário no freestyle:** o `sap.ui.layout.form.Form` com o `ColumnLayout`, e não o `SimpleForm`. As colunas são 2 no M, 3 no L e 4 no XL (o guia do UI5).

## O tema Horizon

- **Os quatro temas** que o app tem que aguentar: `sap_horizon` (o claro, o padrão), `sap_horizon_dark` (o escuro), `sap_horizon_hcb` (alto contraste preto) e `sap_horizon_hcw` (alto contraste branco).
- **A versão:** o Horizon existe a partir da UI5 1.93.3 e 1.96.0. A versão da régua (a LTS vigente) já o traz. O app criado pelo MCP de UI5 vem com a biblioteca `themelib_sap_horizon` no `ui5.yaml`.
- **Ver um tema no preview:**
  - o parâmetro de URL `sap-ui-theme`, por exemplo `index.html?sap-ui-theme=sap_horizon_dark`;
  - ou o tema do launchpad local, no `fiori-tools-preview` (`flp: { theme: sap_horizon }`);
  - em código, o `Theming.setTheme` (`sap/ui/core/Theming`, desde a 1.118).

## A tela que responde ao tamanho

- **A importância decide o que aparece.** No celular, só o `#High`; no tablet, `#High` e `#Medium`; no desktop, tudo. Sem importância, conta como média. Marque como `#High` o que identifica a linha e o que a pessoa decide olhando (`fiori-anotacoes`).
- **Os aparelhos** no manifest: `"sap.ui": { "deviceTypes": { "desktop": true, "tablet": true, "phone": true } }`.
- **O Flexible Column Layout** (a lista e o objeto lado a lado) funciona no V2 e no V4, com draft ou sem draft. Ele não existe na Overview Page; na ALP, só o `TwoColumnsBeginExpanded`. O inline edit não funciona com ele.

## A tabela certa

| `tableSettings.type` | Para quê |
|---|---|
| `ResponsiveTable` | O padrão: poucas colunas, uso no celular, linhas com várias linhas de texto |
| `GridTable` | Muitas linhas e colunas, uso no desktop, colar do Excel (`enablePaste`) |
| `AnalyticalTable` | Totais e agrupamento (o serviço com `@Aggregation.ApplySupported`) |
| `TreeTable` | Hierarquia (o `@Aggregation.RecursiveHierarchy`, com o `hierarchyQualifier`) |

- **No V4, a escolha é automática pela anotação.** Um serviço sem agregação numa `AnalyticalTable` mostra a tabela vazia.
- **As tabelas Grid, Tree e Analytical** não mostram coluna de várias linhas (FieldGroup, texto longo).
- **Configurações que valem a pena:**
  - `"selectionMode": "Multi"`, quando a ação vale para várias linhas;
  - `"enableExport": true`;
  - `"enableFullScreen": true`;
  - `"personalization"`;
  - `"creationMode"`: `Inline`, `InlineCreationRows`, a página ou o diálogo.

## A densidade

- **O manifest:** `"contentDensities": { "compact": true, "cozy": true }`. O launchpad escolhe pelo aparelho: compact no mouse, cozy no toque.
- **O `condensedTableLayout: true`** vale só para a `GridTable` e só no modo compact.

## Os estados (o que separa o app bom do comum)

| Estado | Como fica certo |
|---|---|
| **Vazio** | A mensagem ilustrada padrão da tabela ("No results found / Try changing your filter criteria"), que se ajusta ao espaço. O texto se troca pelo i18n. Só texto: `"useTextForNoDataMessages": true` na página |
| **Erro do usuário** | A mensagem presa ao campo (o `target` da mensagem): o CAP devolve os `DraftMessages` com o `target`, e o RAP valida com o `determine action ... affects messages` |
| **Mensagens** | As de estado ficam no popover de mensagens da edição; as de transição aparecem num diálogo. Valide antes de ativar o draft e no Enter. A mensagem com vários alvos é só para a dependência entre campos visíveis |
| **Ação perigosa** | A confirmação pelo `Common.IsActionCritical: true` |
| **Carregando** | O que o floorplan já faz. Sem tela própria de carregamento |

## As variantes

- **Por página ou por controle, nunca os dois** na mesma página.
  - No V4, o List Report usa `"variantManagement": "Page"` (guarda os filtros, a tabela, a ordem e o agrupamento).
  - O Object Page usa `"variantManagement": "Control"`.
- **A navegação de fora** que traz contexto sobrepõe os filtros e mostra "Standard*".

## O cabeçalho com os indicadores

- **O cabeçalho do Object Page** mostra o que decide: um valor-chave, a nota, o progresso (`UI.DataPoint`), um micro gráfico (`UI.Chart` com o `#Bullet`, o `#Area` e outros) ou um formulário curto (`UI.FieldGroup`), pela `fiori-anotacoes`.
- **O clique no indicador** pode levar à seção do detalhe (`navigation.targetSections` no manifest).

## A conferência por captura (a prova da aparência)

**As capturas saem do portão** (desde a F4, 22/10/2026). O `sap.fiori.app.check` com o item `capturas` abre o preview com os dados simulados num navegador sem tela. Ele captura a **lista** (com a busca feita) e o **primeiro objeto** nos **quatro temas** Horizon, em **desktop** (1440×900) e em **celular** (390×844). Grava em `<app>/.speedup/capturas/<data>/`, conta os erros do console de cada tela e confere que o tema pedido foi aplicado.

1. Rode o portão (ou só `itens: ["capturas"]`).
2. As telas que o portão não alcança sozinho (o objeto em edição, um erro de validação, a lista vazia com filtro) a IA abre no navegador dela, com `sap-ui-theme=` no endereço.
3. Olhe cada captura:
   - o texto cortado;
   - a coluna importante que sumiu no celular;
   - o contraste nos temas de alto contraste;
   - o estado vazio e o erro;
   - o console sem erro.
4. Guarde as capturas e o que foi olhado no projeto, junto do portão da `fiori-testes`.

## Com o Speed Up

- **As docs, com a fonte:** `mcp_sap_docs`, por exemplo "Preview an Application with the SAP Horizon Theme", "responsive table grid table tree table choice", "illustrated message empty state", "variant management", "message handling".
- **A API dos controles, na versão do app:** `mcp_sap_docs` com `simbolo` (por exemplo `sap.m.Table#growing`) e `projeto`.
- **Os guias de UI5:** `mcp_sap_executar`, MCP `ui5`, `get_guidelines`.
- **O linter** aponta a API depreciada e problemas de acessibilidade: `run_ui5_linter` (`fiori-testes`).

## Limites

- **A conferência do que as capturas mostram** é da IA, com estes critérios. O portão garante que as telas abrem no tema certo e sem erro no console, mas não julga o texto cortado nem o contraste. A revisão contra as diretrizes é a F6 do plano.
- **A acessibilidade** além do linter, do i18n e do alto contraste (o teclado, o leitor de tela) não veio nas docs consultadas. Ela fica na F6 do plano, com a fonte oficial.

## Fontes (consultadas em 22/10/2026)

- As docs de Fiori pelo `search_docs`:
  - "Preview an Application with the SAP Horizon Theme" e "Preview" (o `flp.theme`);
  - "Responsiveness Options: Importance-Based Rendering" e "Enable and Configure Flexible Column Layout (FCL)";
  - "Configure Table Type and Table Settings in manifest.json and Annotations" e "Using the Condensed Table Layout";
  - "Display an Illustrated Message or Text When a Table Has No Data" e "Using Messages in SAP Fiori Elements";
  - "Add Confirmation Popovers to Actions with IsActionCritical Annotation" e "Managing Variants in SAP Fiori Elements (Page-level vs Control-level)".
- Os ids dos temas: [SAP/theming-base-content](https://github.com/SAP/theming-base-content) (`content/Base/baseLib`) e o UI5/openui5 (`themelib_sap_horizon`). O parâmetro `sap-ui-theme=sap_horizon_dark` está no SAP-docs/sapui5, "What's New in SAPUI5 1.100".
- A API do UI5 1.148.0 pelo `get_api_reference`: `sap.ui.core.Theming` e `setTheme`, desde a 1.118.
- O guia do UI5 pelo `get_guidelines` (o i18n em todas as línguas, o `Form` com o `ColumnLayout`).
- O [fiori-elements-feature-showcase](https://github.com/SAP-samples/fiori-elements-feature-showcase), `manifest.json`: o `contentDensities`, o `variantManagement`, o `tableSettings` e o `deviceTypes`.
