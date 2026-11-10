---
name: rap-desenvolvimento
description: Orienta o desenvolvimento RAP (ABAP RESTful Application Programming) com modelagem de entidades, behavior definitions, determinações, validações, ações e EML. Use ao criar ou revisar um business object RAP e o serviço OData dele.
titulo: "RAP: desenvolvimento de business objects"
area: rap-cds
bundles: [rap, adt]
versao: 1.0.0
atualizado_em: 2026-10-01
origem:
  - "sap-tech-lab/Library - Dev completed/Setup antigo - 2026-07-29/skills/rap-development/SKILL.md@sha256:487f8448c609"
---

# RAP: desenvolvimento de business objects

Soluções RAP com modelagem limpa de entidades e comportamentos pequenos.

## Quando usar

- Criar ou revisar um business object RAP.
- Desenhar behavior definition, validações, determinações ou ações.
- Uso de EML.
- Expor o serviço OData (service definition e binding).

## Foco

- modelagem de entidades (CDS);
- behavior definitions;
- projeções;
- determinações, validações e ações;
- EML.

## Regras

- Regra de negócio fora da camada de UI.
- Autorização separada da regra de negócio.
- Lógica reutilizável em vez de comportamento duplicado.
- Para a camada CDS, veja `cds-modelagem`. Para decisões de extensão, veja `arquitetura-clean-core`.

## Com o Speed Up

- **Bundle RAP** (9 ações), sobre uma conexão do tipo `sap-abap`.
- **Descobrir e ler:**
  - `sap.rap.discovery`: o que o sistema-alvo expõe para RAP e em qual release;
  - `sap.rap.object.read`: fonte ou metadado de DDLS, BDEF e SRVD; da SRVB, só metadado.
- **Criar ou alterar, com ativação e releitura por hash:**
  - `sap.rap.ddls.upsert` (CDS);
  - `sap.rap.bdef.upsert`: behavior definition **managed ou projection, sem draft e sem handler**;
  - `sap.rap.srvd.upsert` (service definition);
  - `sap.rap.srvb.create` (service binding): **só criar**; alterar e publicar não são suportados.
- **Diagnóstico:** `sap.rap.activation.inactive` lista os objetos inativos do usuário. `sap.rap.service.describe` dá a URL OData candidata, **não verificada**.
- **Testes:** `sap.rap.unit.run` roda o ABAP Unit de uma classe.
- **Escrita só em DEV, TEST ou SANDBOX,** com autorização no painel.
- **Lacunas:** draft, handler/implementação da behavior, publicação do binding. Entregue o código para o usuário aplicar e confira depois com `sap.rap.object.read`.

## Limites

- Serviço "publicado" só depois de chamado de verdade; a URL candidata não prova nada.
