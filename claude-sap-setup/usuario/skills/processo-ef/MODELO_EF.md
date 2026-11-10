# Especificação funcional: <o objeto>

Entregável: <ID>

Versão 0.1 · <DD/MM/AAAA> · **Rascunho para aprovar**

<Uma frase: o que é o objeto e para quem.>

## 1. Identificação

| Item | Valor |
|---|---|
| Projeto | <o projeto> |
| Entregável | <ID: o que é> |
| Objeto | <o app, a interface, o relatório> |
| Referências | <os documentos e as decisões, com o link> |

## 2. Objetivo

<O que resolve.> **Fora do escopo:** <o que não faz>.

## 3. O AS-IS: o processo atual

Quem faz hoje: <o papel>. O passo a passo:

1. Acessa a transação `<TCODE>` no <sistema>.
2. Informa <os filtros>.
3. Confere <o quê> para validar <o quê>.

## 4. O TO-BE: o processo novo

1. Abre <o objeto novo> no <lugar>.
2. <...>

## 5. A arquitetura

```mermaid
architecture-beta
  group btp(sap:btp)[SAP BTP]
  service origem(server)[<a origem>]
  service app(sap:cap)[<o app>] in btp
  origem:R --> L:app
```

## 6. As telas

```tela
titulo: T1 · <a tela>
app: <o nome do app>
filtros: <Filtro>=<valor>
colunas: <Coluna> | <Coluna>
linha: <valor> | <valor>
```

## 7. Os campos de cada tela

**T1 · <a tela>**

| Campo | Origem | Campo técnico | Regra |
|---|---|---|---|
| <rótulo> | <o sistema> | <o caminho no payload, a propriedade da API, o campo da CDS> | <a regra de exibição> |

## 8. As regras

| # | Regra |
|---|---|
| R1 | <a regra> |

## 9. Os testes de aceitação

| # | Cenário | Resultado esperado |
|---|---|---|
| TA-01 | <o cenário> | <o esperado> |

## Histórico de versões

| Versão | Data | O que mudou |
|---|---|---|
| 0.1 | <DD/MM/AAAA> | O rascunho |
