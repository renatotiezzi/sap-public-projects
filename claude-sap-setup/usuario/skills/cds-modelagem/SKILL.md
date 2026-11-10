---
name: cds-modelagem
description: Desenha views CDS com semântica limpa, anotações corretas e modelagem de dados eficiente. Use em modelagem de dados, consumo OData, consultas analíticas ou revisão de CDS, no ABAP ou no CAP.
titulo: "CDS: modelagem de views"
area: rap-cds
bundles: [rap, cap, hana]
versao: 1.0.0
atualizado_em: 2026-10-01
origem:
  - "sap-tech-lab/Library - Dev completed/Setup antigo - 2026-07-29/skills/cds-view-design/SKILL.md@sha256:8aa067e06523"
---

# CDS: modelagem de views

Views CDS legíveis, reutilizáveis e adequadas ao cenário de consumo.

## Quando usar

- Modelagem de dados.
- Consumo OData.
- Consultas analíticas.
- Revisão de CDS existente.

## Foco

- nomes semânticos;
- associações em vez de joins desnecessários;
- cardinalidade correta;
- projeções específicas para cada consumo;
- anotações claras.

## Regras

- Modele o conceito de negócio, não só a estrutura da tabela.
- Views pequenas quando possível, com um propósito claro por view.
- Evite campos calculados redundantes.

## Com o Speed Up

Os três mundos de CDS têm bundles diferentes; escolha pelo destino:

- **CDS no ABAP (RAP):** bundle RAP, conexão `sap-abap`. `sap.rap.object.read` lê a DDLS; `sap.rap.ddls.upsert` cria ou altera e ativa, com releitura por hash (só DEV, TEST ou SANDBOX e com autorização).
- **CDS no CAP:** bundle CAP, sobre o projeto local (conexão `cap-project`):
  - `sap.cap.model.upsert` (`db/`, `srv/`, `app/`);
  - `sap.cap.model.compile` gera o CSN e mostra os erros;
  - `sap.cap.test.run` roda os testes.
- **Artefato nativo no HANA Cloud** (`.hdbview`, `.hdbtable`): bundle HANA. `sap.hana.hdi.artifact.prepare` e `sap.hana.hdi.artifact.validate` trabalham localmente; `sap.hana.hdi.deploy` implanta no container HDI.

## Limites

- Uma view que compila não prova performance: confira o volume real.
