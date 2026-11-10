---
name: hana-cloud-leitura-e-hdi
description: Lê o SAP HANA Cloud com segurança (identidade, containers HDI, schemas, objetos, SQL só de leitura) e prepara, valida, simula e implanta artefatos HDI (.hdbtable, .hdbview) pelo Speed Up, com a leitura de volta como prova. Use para investigar dados ou estrutura no HANA Cloud e para mudar tabela ou view num container HDI.
titulo: "HANA Cloud: leitura e artefatos HDI"
area: btp
bundles: [hana]
versao: 1.0.0
ordem: 30
atualizado_em: 2026-10-02
origem:
  - "Sap-Speed-Up/packages/adapters/src/bundles/hana/manifesto.ts@sha256:9b9249465315"
  - "Sap-Speed-Up/packages/adapters/src/bundles/hana/lacunas.ts@sha256:8438a49855d3"
---

# HANA Cloud: leitura e artefatos HDI

O bundle HANA faz duas coisas: **ler** o banco com tetos e em transação só de leitura, e **mudar artefatos HDI** pelo caminho que o próprio HDI usa (WRITE e MAKE no container), sempre com a leitura de volta. Tudo pela conexão `hana-cloud`.

## Quando usar

- Investigar estrutura ou dados no HANA Cloud: que containers existem, que tabelas, que colunas, quantas linhas.
- Criar ou alterar uma tabela (`.hdbtable`) ou view (`.hdbview`) num container HDI.
- Conferir o que um deploy de CAP deixou no banco.

## Ler com segurança

1. **Quem e onde:** `sap.hana.connection.identify` mostra o usuário, o schema atual e o banco.
2. **Containers e schemas:** `sap.hana.hdi.containers.list` e `sap.hana.schemas.list`.
3. **Objetos:** `sap.hana.objects.list` (por schema e tipo) e `sap.hana.object.describe` (colunas, tipos e nulidade).
4. **SQL de leitura:** `sap.hana.sql.read` aceita **uma** instrução que comece por `SELECT` ou `WITH`, com até 20 000 caracteres. Os tetos são:
   - linhas: 100 por padrão, até 1 000;
   - bytes: 256 KB por padrão, até 1 MB;
   - tempo: 30 s por padrão, até 60 s.

   O resultado diz quando foi cortado (`truncated`). Peça agregados (`COUNT`, `GROUP BY`) em vez de despejar tabela.

O texto do SQL não vai para a auditoria: ela guarda só o tamanho e o hash.

## Mudar um artefato HDI

1. **Preparar:** `sap.hana.hdi.artifact.prepare` gera o texto de um `.hdbtable` (a partir das colunas) ou de um `.hdbview` (a partir da consulta), de forma determinística. Não usa conexão.
2. **Validar a estrutura:** `sap.hana.hdi.artifact.validate` confere o artefato localmente. A sintaxe SQL quem valida é o servidor, no build do HDI.
3. **Simular:** `sap.hana.hdi.simulate` grava no design-time do container e simula o MAKE, sem implantar. Use antes do deploy de verdade.
4. **Implantar:** `sap.hana.hdi.deploy` faz WRITE e MAKE no container, lê de volta o que ficou implantado e confere com o enviado.
5. **Ler o resultado:**
   - código 0 é sucesso; 1 é sucesso com aviso;
   - −1 (erro) e −2 (fatal) dão `ok: false`, parcial, com as mensagens do HDI;
   - **releitura diferente** do enviado dá `readback_mismatch`, nunca sucesso;
   - **conexão perdida depois do envio** dá `outcome_unknown`. Não repita: confira por leitura (`sap.hana.object.describe` ou `sap_reconcile`) e decida.

## Regras

- **Escrita só em DEV, TEST ou SANDBOX,** com autorização no painel. Em QAS, PRD ou ambiente desconhecido, o bundle falha fechado.
- **Só `.hdbtable` e `.hdbview` nesta versão.** Uma tabela criada a partir de consulta (`AS SELECT`) ou `WITH DATA` é recusada, porque copia dados no MAKE.
- **Mudança de estrutura com dados** (tirar coluna, mudar tipo) pode exigir migração: decida com o usuário antes do deploy.

## Limites

- **Driver `hdb`:** é dependência **opcional**, que o Speed Up não baixa nem instala. Sem ele, toda ação de rede responde `dependency_missing` (lacuna `hana.driver.hdb`).
  - Instalar é decisão do usuário.
  - Enquanto isso, a leitura vai pelo navegador: SAP HANA Cloud Central da instância → SQL Console, só SELECT. O login é do usuário.
- **Fora do recorte:** undeploy, grants, roles, procedures, sinônimos e SQL que escreve.
- O bundle está qualificado em fixture, com um driver falso (E133). A prova num banco real exige alvo, efeito e autorização atuais.

## Fontes (consultadas em 02/10/2026)

- [CAP — Using SAP HANA Cloud for Production](https://cap.cloud.sap/docs/guides/databases/hana): HDI, containers `hdi-shared` e os artefatos de design-time (`.hdbtable`, `.hdbview`).
- Speed Up: o bundle `hana` (tetos, recorte, semântica de WRITE e MAKE, reconciliação) e a lacuna `hana.driver.hdb`.
