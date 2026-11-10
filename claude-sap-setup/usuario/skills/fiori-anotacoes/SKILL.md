---
name: fiori-anotacoes
description: A UI de um app Fiori elements dirigida por anotação, no backend — a metadata extension no RAP ou o arquivo de anotações no CAP — com o exemplo dos showcases oficiais da SAP para cada uma: HeaderInfo, LineItem (importância, ações, criticidade), SelectionFields, Facets e FieldGroup, Identification e determining actions, variantes, value help, Text e TextArrangement, field control, side effects e Chart. Use para escrever, mudar ou revisar as anotações de um app Fiori, sempre antes de mexer no manifest ou em código de tela.
titulo: "Fiori: as anotações (RAP e CAP, com os exemplos da SAP)"
area: fiori
bundles: [fiori, rap, cap]
versao: 1.1.0
ordem: 20
atualizado_em: 2026-10-22
origem:
  - "github.com/SAP-samples/abap-platform-fiori-feature-showcase (main, 01–06_*.md)"
  - "github.com/SAP-samples/fiori-elements-feature-showcase (app/listreport-objectpage/*.cds, srv/list-report-srv.cds)"
  - "Sap-Speed-Up/docs/melhorias/2026-10-22-fiori-f1-docs-e-skills.md"
  - "Sap-Speed-Up/docs/melhorias/2026-10-22-fiori-f3-modificar-e-anotar.md"
---

# Fiori: as anotações

No Fiori elements, a tela é a anotação. Tudo o que o floorplan sabe fazer se liga por ela; código de tela entra só onde a anotação não chega.

## Quando usar

- Ao escrever ou mudar o que o app mostra: as colunas, os filtros, as seções, os textos, as ações, os campos obrigatórios.
- Ao revisar um app Fiori elements.
- Antes de tocar no `manifest.json` ou numa extensão: quase sempre a anotação resolve.

## Onde a anotação mora (a regra que mais pesa)

- **RAP:**
  - as anotações de UI ficam na **metadata extension** da view de consumo (a projeção `C_`);
  - o value help e a chave semântica ficam na view CDS;
  - o field control e os side effects ficam na **behavior definition**.
- **CAP:** as anotações de UI ficam num **arquivo próprio**, separado do modelo e do serviço. Por exemplo, `app/fiori-layout.cds` com `using { CatalogService } from '../srv/cat-service'; annotate CatalogService.Books with @UI: {...}` (o "Keep Your Core Clean" do capire).
- **O arquivo local de anotações do app** (XML, referenciado no `dataSources` do manifest) fica só para o que o backend não expressa. Exemplos: os `SelectOptions` de um `UI.SelectionVariant` e o `Common.IsActionCritical` no RAP.
  - A cópia local de uma anotação do backend é informativa: **o erro se corrige no backend**, nunca na cópia.
  - O Fiori tools só copia do backend para o local, nunca o contrário.
- **O gerador** (`generate_fiori_app_odata` com `generateLROPAnnotations`) escreve um `UI.LineItem`, um `UI.FieldGroup` e um `UI.Facets` básicos no arquivo LOCAL, só se faltarem. É um ponto de partida: leve as anotações para o backend e ajuste.
- **Os textos** vêm sempre do i18n (`'{i18n>chave}'`), em todas as línguas do app.

## As anotações, com o exemplo da SAP

Os exemplos RAP vêm do *abap-platform-fiori-feature-showcase* (a metadata extension `/DMO/FSA_C_RootTP`, salvo outra indicada). Os CAP vêm do *fiori-elements-feature-showcase* (`app/listreport-objectpage/`).

### O título do objeto: `UI.HeaderInfo`

O `TypeNamePlural` é o título da tabela e é **obrigatório**: sem ele, a tabela do Object Page fica sem título.

```
// RAP
@UI.headerInfo: { typeName: 'Object Page - Root', typeNamePlural: 'Root Entities',
  typeImageUrl: 'sap-icon://sales-order', imageUrl: 'ImageUrl',
  title: { value: 'StringProperty', type: #STANDARD },
  description: { label: 'Root entity', type: #STANDARD, value: 'StringProperty' } }
```
```cds
// CAP
annotate srv.RootEntities with @(UI.HeaderInfo: {
  TypeName: '{i18n>RootEntities}', TypeNamePlural: '{i18n>RootEntities.typeNamePlural}',
  Title: { $Type: 'UI.DataField', Value: stringProperty },
  Description: { $Type: 'UI.DataField', Value: '{i18n>RootEntities}' },
  ImageUrl: imageUrl, TypeImageUrl: 'sap-icon://sales-order', Initials: 'RE' });
```

A chave semântica (o campo em negrito, com o estado do draft): RAP `@ObjectModel.semanticKey: ['StringProperty']` na view CDS; CAP `Common.SemanticKey: [stringProperty]`.

### As colunas: `UI.LineItem`

- **A ordem:** `position` no RAP; a sequência da lista no CAP.
- **`importance`** decide o que aparece em cada tela. No celular, só o `#HIGH`; no tablet, `#HIGH` e `#MEDIUM`; no desktop, tudo. Sem importância, a coluna conta como média. **Marque como `#HIGH` o que identifica a linha.**
- **As ações:**
  - na barra da tabela, `type: #FOR_ACTION` (RAP) ou `UI.DataFieldForAction` (CAP);
  - na linha, `inline: true` / `Inline: true`;
  - a ação desconectada (unbound), no CAP, pelo entity container (`'Servico.EntityContainer/acao'`).
- **A criticidade:** a cor por linha é `criticality: 'CriticalityCode'` no RAP e `UI.LineItem.@UI.Criticality: criticality_code` no CAP. Os valores: 0 neutro, 1 negativo (vermelho), 2 crítico (laranja), 3 positivo (verde), 5 novo (azul).

```
// RAP
@UI.lineItem: [ { position: 10, type: #FOR_ACTION, label: 'Change Criticality', dataAction: 'changeCriticality' },
                { position: 20, importance: #HIGH } ]
StringProperty;
```
```cds
// CAP (trecho)
UI.LineItem: [
  { $Type: 'UI.DataField', Value: stringProperty, @UI.Importance: #High },
  { $Type: 'UI.DataField', Value: fieldWithCriticality, Criticality: criticality_code,
    CriticalityRepresentation: #WithIcon, @UI.Importance: #Low },
  { $Type: 'UI.DataFieldForAction', Action: 'LROPODataService.changeCriticality', Label: '{i18n>changeCriticality}' } ],
UI.LineItem.@UI.Criticality: criticality_code,
```

- **A ação que depende do contexto:** o `Core.OperationAvailable`, no V4. No CAP, por exemplo, `Core.OperationAvailable: ($self.integerValue > 0)`.
- **A ação que pede confirmação:** o `Common.IsActionCritical: true`. No RAP, ele vai no XML local.

### Os filtros: `UI.SelectionFields`

```
// RAP
@UI.selectionField: [{ position: 10 }]
StringProperty;
```
```cds
// CAP
annotate srv.RootEntities with @(UI.SelectionFields: [ stringProperty, validFrom, organizationalUnit_ID ]);
```

- **Esconder um filtro:** RAP `@Consumption.filter.hidden: true`; CAP `@UI.HiddenFilter`.
- **O valor padrão simples:** RAP `@Consumption.filter.defaultValue: '3'`; CAP `Common.FilterDefaultValue`. O valor padrão com faixa vai num `UI.SelectionVariant`; se houver os dois, vale a variante.

### As seções do Object Page: `UI.Facets` e `UI.FieldGroup`

São no máximo dois níveis (o terceiro é ignorado). Não use uma CollectionFacet com uma só ReferenceFacet dentro. O ID de cada facet é único, com sentido e em camelCase, porque é ele que os testes OPA usam (`fiori-testes`).

```
// RAP
@UI.facet: [ { purpose: #STANDARD, type: #COLLECTION, id: 'GeneralInfo', label: 'General Information' },
             { purpose: #STANDARD, type: #FIELDGROUP_REFERENCE, parentId: 'GeneralInfo', targetQualifier: 'OPForm', id: 'SubSectionID' } ]
```
```cds
// CAP
annotate srv.RootEntities with @(UI.Facets: [
  { $Type: 'UI.CollectionFacet', ID: 'collectionFacetSection', Label: '{i18n>collectionSection}', Facets: [
      { $Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Section', ID: 'SubSectionID', Label: '{i18n>subSection}' } ] },
  { $Type: 'UI.ReferenceFacet', Target: 'childEntities3/@UI.LineItem', Label: '{i18n>childEntities3}' } ]);
```

- **A tabela de itens numa seção:** RAP `type: #LINEITEM_REFERENCE, targetElement: '_Child'`; CAP `Target: 'childEntities/@UI.LineItem'`.
- **A seção só no modo de edição:** RAP `hidden: #( IsActiveEntity )`; CAP `@UI.Hidden: IsActiveEntity`.
- **O "Mostrar mais":** RAP `isPartOfPreview: false`; CAP `@UI.PartOfPreview: false`.
- **O cabeçalho:** RAP `purpose: #HEADER`; CAP `UI.HeaderFacets`. Eles levam um DataPoint (o valor-chave, a nota, o progresso), um FieldGroup ou um micro gráfico.

### As ações do objeto: `UI.Identification`

- **A ação no cabeçalho:** `UI.Identification` com `#FOR_ACTION`. A criticidade do botão no cabeçalho aceita só 0, 1 e 3.
- **A ação de processo** (aprovar, recusar) vai no rodapé, como **determining action**: `determining: true` (RAP) ou `Determining: true` (CAP). As ações do rodapé não aparecem no modo de exibição.

```
// RAP
@UI.identification: [{ type: #FOR_ACTION, label: 'Approve', dataAction: 'approve', determining: true }]
```

- **Esconder as operações padrão:** RAP `@UI.updateHidden` e `@UI.deleteHidden`; CAP `UI.UpdateHidden`, `UI.CreateHidden` e `Capabilities.DeleteRestrictions`.

### A ordem e as visões: `UI.PresentationVariant` e `UI.SelectionPresentationVariant`

```
// RAP
@UI.presentationVariant: [{ qualifier: 'pvariant', maxItems: 5,
  sortOrder: [{ by: 'StringProperty', direction: #ASC }], visualizations: [{type: #AS_LINEITEM}] }]
```
```cds
// CAP
UI.PresentationVariant: { SortOrder: [{ Property: stringProperty, Descending: false }], Visualizations: ['@UI.LineItem'] },
```

As várias abas (as visões) do List Report vêm no manifest, em `views.paths`, cada uma apontando para uma `SelectionVariant` ou uma `SelectionPresentationVariant` qualificada.

### O value help

- **CAP:** `Common.ValueList` (os parâmetros `In`, `Out`, `InOut`, `DisplayOnly`, `Constant`).
  - `Common.ValueListWithFixedValues` mostra uma lista suspensa, para conjuntos pequenos.
  - `Common.ValueListForValidation` (com o qualificador vazio) recusa o valor que não existe.
  - O atalho `@cds.odata.valuelist` na entidade dá o value help a toda associação para ela.
- **RAP:** `@Consumption.valueHelpDefinition` na view CDS.
  - `additionalBinding` com `usage: #FILTER` filtra por outro campo, e `#RESULT` preenche outro campo.
  - Com `useForValidation: true`, **sempre** ponha o `qualifier`, para não validar contra o value help errado.
  - A lista suspensa vem com `@ObjectModel.resultSet.sizeCategory: #XS` na view do value help.

```
// RAP (view CDS /DMO/FSA_R_RootTP)
@Consumption.valueHelpDefinition: [{ entity: { name: '/DMO/FSA_I_Contact', element: 'ID' }, label: 'Contacts',
  additionalBinding: [{ element: 'Country', localElement: 'Country', usage: #FILTER }] }]
ContactID,
```
```cds
// CAP (value-helps.cds)
contact @(Common: { Text: contact.name, TextArrangement: #TextOnly,
  ValueList: { Label: '{i18n>contact}', CollectionPath: 'Contacts', Parameters: [
    { $Type: 'Common.ValueListParameterInOut', ValueListProperty: 'ID', LocalDataProperty: contact_ID },
    { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'country_code' } ] } });
```

### O texto no lugar do código: `Common.Text` e `TextArrangement`

- **As opções:** `#TextFirst` (o padrão), `#TextLast`, `#TextOnly` e `#TextSeparate`. A do campo vence a da entidade.
- **RAP:** `@ObjectModel.text.element: ['Name']` na view do código, e `@UI.textArrangement: #TEXT_FIRST` na metadata extension.
- **CAP:** `Common: { Text: region.name, TextArrangement: #TextFirst }`.
- **A chave GUID** mostra um id legível por `Common.ExternalID`.

### Obrigatório, só leitura, dinâmico: o field control

- **RAP** (na behavior definition):
  - `field ( mandatory ) Email;`
  - `field ( readonly, numbering : managed ) ID;`
  - `field ( mandatory : create, readonly : update ) StringProperty;`
  - o dinâmico: `field ( features : instance ) Campo;`, com o `get_instance_features` devolvendo `if_abap_behv=>fc-f-read_only`.
- **CAP:** `@mandatory` e `@readonly` (o Fiori lê só esses estáticos), `@Core.Immutable` (editável só na criação) e `Common.FieldControl` com um caminho para o dinâmico.

### Atualizar o que mudou: os side effects

- **O padrão não precisa de anotação:** criar, apagar, ativar e descartar atualizam a lista sozinhos. Anote só o alvo a mais.
- **A ação vinculada** que muda dados só aparece na tela com um side effect nela.
- **Os side effects das mensagens** atualizam o `SAP__Messages`.
- **RAP:** na behavior definition, e a projeção precisa de `use side effects;`.
  - `field IntegerValue affects field ProgressIntegerValue;`
  - `action resetTimesChildCreated affects field TimesChildCreated;`
  - `determine action validateDate executed on field ValidTo affects messages;`
- **CAP:** `@(Common.SideEffects: { TargetProperties: ['in/criticality_code'] }) action changeCriticality(...)`.

### Gráficos: `UI.Chart` (ALP, seção de gráfico, micro gráfico)

- **O gráfico precisa de agregação.**
  - CAP: `Aggregation.ApplySupported` com as `GroupableProperties` e as `AggregatableProperties`.
  - RAP: a medida como propriedade agregada (`@Aggregation.default: #MAX` na view).
- **O micro gráfico no cabeçalho:** `@UI.chart` com `chartType: #BULLET` e um `@UI.dataPoint` cujo `qualifier` é **igual ao nome da propriedade**, com o `minimumValue`.

## No app da pasta: as anotações pelo Speed Up (desde a F3, 22/10/2026)

Quando a anotação mora no arquivo local do app (o app sobre um serviço que não é seu, como um serviço público ou de outro time, ou o que o backend não expressa), o caminho é este:

1. **`sap.fiori.app.annotations`** lê as anotações pela API de anotações da SAP (`@sap-ux/fiori-annotation-api`, a mesma do Fiori tools). Ela mostra:
   - por entidade, as colunas (com a importância), as seções, o cabeçalho, os filtros e os grupos de campos;
   - se cada uma vem do arquivo **local** ou do **serviço**;
   - as entidades do serviço, com as propriedades e as navegações.

   Leia antes de mudar.
2. **`sap.fiori.app.annotate`** muda, com `operacoes` em ordem:

| Operação | O que faz |
|---|---|
| `coluna` | Acrescenta a coluna ao `UI.LineItem` (cria a tabela se faltar). Aceita `rotulo`, `importancia` e `posicao`. A propriedade pode passar por uma navegação para um registro (ex.: `Customer/CompanyName`) |
| `importancia` | Troca o `UI.Importance` de uma coluna (High, Medium ou Low) |
| `remover_coluna` | Tira a coluna da tabela |
| `secao_tabela` | A tabela dos itens no Object Page: a `ReferenceFacet` para `<navegação>/@UI.LineItem`. Cria a tabela do destino se faltar, com as `colunas` pedidas ou com as chaves e as primeiras propriedades simples. É o que o gerador não faz (o achado da F2) |
| `secao_campos` | Um `UI.FieldGroup` novo com a seção dele |
| `cabecalho` | O `UI.HeaderInfo`: o título e a descrição são propriedades. Troca o que já houver |
| `filtros` | O `UI.SelectionFields`. Troca o que já houver |

   - **Cada operação é conferida contra o serviço:** a entidade, a propriedade, a navegação para vários, a coluna que já existe. A recusa traz a lista do que vale.
   - **O pedido é tudo ou nada:** uma operação recusada, e nada é gravado.
   - **A anotação que só vem do serviço** é copiada para o arquivo local antes de mudar. A local passa a valer, e o resultado diz isso.
   - **`ensaio: true`** devolve o diff sem gravar. Sem ele, o resultado traz o diff e a **releitura** (o arquivo lido de novo do disco).
3. **O manifest** (as páginas, a tabela, a tela cheia, o layout das seções) muda pelo MCP de Fiori: `mcp_sap_executar`, MCP `fiori`, com `list_functionality` → `get_functionality_details` → `execute_functionality`.
   - Ele já enxerga a seção que a anotação criou: por exemplo, `["CustomersObjectPage","sections","Orders::@com.sap.vocabularies.UI.v1.LineItem","table","enableFullScreen"]`.
   - Depois, o `sap.fiori.app.read` relê (o hash de cada arquivo).
4. **Os dados simulados:** `sap.fiori.app.mockdata` escreve um JSON por EntitySet a partir do `$metadata`, com as datas válidas e os itens ligados ao pai. Use-o quando o portão acusar dado inválido no preview: o gerador do mockserver escreve a data e hora com milissegundos, e a UI5 recusa.

**O que o `annotate` ainda não faz:** o value help, a criticidade, as ações, o field control e os side effects. Esses ficam no backend (RAP ou CAP, abaixo) ou na escrita do arquivo local pela IA.

## Depois de mudar uma anotação

1. **Releia o que foi gravado.**
   - App da pasta: a releitura vem no resultado do `sap.fiori.app.annotate`.
   - RAP: `sap.rap.object.read` da metadata extension, da view ou da behavior.
   - CAP: `sap.cap.model.compile`.
2. **Rode o portão da `fiori-testes`:** `sap.fiori.app.check`, no mínimo com `itens: ["lint", "capturas"]`. As capturas no celular mostram a importância das colunas.
3. **Confira na tela,** pela `fiori-aparencia`.

## Com o Speed Up

- **As docs, com a fonte:** `mcp_sap_docs`, por exemplo "UI.Facets ReferenceFacet FieldGroup sections", "side effects annotation", "value help ValueList annotation". Cite a fonte no desenho do app.
- **RAP:**
  - `sap.rap.ddls.upsert`: a view CDS e a metadata extension pela fonte;
  - `sap.rap.bdef.upsert`: a behavior;
  - `sap.rap.object.read`: a releitura.
- **CAP:**
  - `sap.cap.model.upsert`: o arquivo de anotações;
  - `sap.cap.model.compile`;
  - o MCP `cap` (`search_model`) para ver as anotações que o modelo já tem.
- **RAP, a metadata extension por si:** `sap.abap.object.create` e `sap.abap.object.write` com o tipo `DDLX`.
- **O app da pasta:**
  - `sap.fiori.app.annotations` e `sap.fiori.app.annotate`: as anotações locais;
  - `sap.fiori.app.mockdata`: os dados simulados;
  - o MCP `fiori` (`list_functionality` → `get_functionality_details` → `execute_functionality`) muda as páginas, as extensões e o manifest. Ele não muda a anotação.

## Limites

- **O draft e o handler no RAP:** veja a `rap-desenvolvimento`. O `sap.rap.bdef.upsert` cobre managed e projection; o draft e a implementação são entregues ao usuário quando a capacidade não chega.
- **O `sap.fiori.app.annotate` foi provado num app da pasta sobre um serviço OData** (o XML local, 22/10/2026).
  - A API que ele usa também grava o `.cds` de um projeto CAP, mas os apps CAP moram na conexão do CAP, e esse caminho ainda não foi provado.
  - No CAP, use o `sap.cap.model.upsert`.
- **Os rótulos que o `annotate` escreve são texto fixo.** O i18n (`{@i18n>chave}`) ainda é escrito pela IA no arquivo e no `i18n.properties`.

## Fontes (consultadas em 22/10/2026)

- [SAP-samples/abap-platform-fiori-feature-showcase](https://github.com/SAP-samples/abap-platform-fiori-feature-showcase), branch `main`: os guias 01 a 06 (value help e `useForValidation`, feature control, ações, filtros, título, facets, side effects, gráficos), com as fontes `/DMO/FSA_C_RootTP`, `/DMO/FSA_R_RootTP` e `/DMO/FSA_I_Criticality`.
- [SAP-samples/fiori-elements-feature-showcase](https://github.com/SAP-samples/fiori-elements-feature-showcase): `layouts_RootEntities.cds`, `value-helps.cds`, `field-control.cds`, `capabilities.cds`, `list-report-srv.cds` e `manifest.json`.
- As docs de Fiori pelo `search_docs`:
  - "Setting Up the Object Page Header (UI.HeaderInfo)" e "Adding Titles to Object Page Tables";
  - "Defining Line Items" e "Responsiveness Options: Importance-Based Rendering";
  - "Highlight Line Items in Tables by Criticality" e "Action Control for Context-Dependent Actions";
  - "Defining and Adapting Object Page Sections (UI.Facets)" e "Defining Determining Actions for Object Page Footer";
  - "Input with Value Help", "Display Text and ID for Value Help Input Fields" e "Text and Text Arrangement";
  - "Field Control" e "Side Effects";
  - "Overriding Back-End Annotations into Local Annotation Files", "Diagnostics for the XML Annotation Language Server" e "Automatic Generation of UI Annotations for Fiori Tools".
- O capire pelo `search_docs` do CAP:
  - [Separation of Concerns](https://cap.cloud.sap/docs/cds/aspects#factor-out-separate-concerns);
  - [Simple Value Helps](https://cap.cloud.sap/docs/guides/uis/fiori#cdsodatavaluelist);
  - [Declarative Constraints](https://cap.cloud.sap/docs/guides/services/constraints#mandatory-1).
