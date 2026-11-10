---
name: cap-desenvolvimento-local
description: Desenvolve e testa um projeto SAP CAP (Node.js) na máquina com o Speed Up — descobrir o projeto, editar modelo e serviço com trava otimista, testar, subir o servidor local e exercitar o OData. Use antes de publicar qualquer coisa no BTP.
titulo: "CAP: desenvolvimento e teste local"
area: btp
bundles: [cap]
versao: 1.0.0
ordem: 10
atualizado_em: 2026-10-02
origem:
  - "Sap-Speed-Up/packages/adapters/src/bundles/cap/lacunas.ts@sha256:55d831f1fc69"
  - "Sap-Speed-Up/domain-packs/cap/manifest.json@sha256:d2b4b811f1d3"
---

# CAP: desenvolvimento e teste local

Um projeto CAP se prova primeiro na máquina: o modelo compila, os testes passam e o serviço responde. Só depois vale publicar (`btp-publicar-cap`). Tudo aqui acontece na pasta do projeto, com a conexão `cap-project`; nada vai para a conta BTP.

## Quando usar

- Ao criar ou alterar entidades, serviços ou handlers de um projeto CAP.
- Ao investigar por que um serviço OData do CAP não responde como esperado.
- Antes de publicar no BTP.

## Passo a passo com o Speed Up

1. **Descobrir o projeto:** `sap.cap.project.discover` devolve os arquivos `.cds`, as pastas (`db`, `srv`, `app`, `test`, `gen`), as versões declaradas e instaladas de `@sap/cds` e `@sap/cds-dk` e se há `mta.yaml` e `xs-security.json`. `sap.cap.file.read` lê um arquivo do projeto.
2. **Editar com trava otimista:**
   - `sap.cap.model.upsert` grava um `.cds` em `db/`, `srv/` ou `app/`;
   - `sap.cap.service.upsert` grava um `.cds` de serviço em `srv/`;
   - os dois exigem o `expectedSha256` da versão lida, compilam na hora e **devolvem o arquivo anterior** se a compilação falhar. Se alguém mudou o arquivo no meio, a gravação é recusada: leia de novo e refaça sobre a versão atual. A modelagem em si está em `cds-modelagem`.
3. **Compilar o modelo inteiro:** `sap.cap.model.compile` devolve os erros com arquivo e linha.
4. **Testar:** `sap.cap.test.run` roda os testes do projeto (`node --test` com `@cap-js/cds-test`).
5. **Subir o servidor local:** `sap.cap.serve.start` devolve um `handleId`.
6. **Exercitar o OData:** `sap.cap.service.get`, `sap.cap.service.post`, `sap.cap.service.patch` e `sap.cap.service.delete`, sempre com o `handleId` e o caminho do serviço. Cubra o caminho feliz e os erros esperados (validação, chave inexistente, campo obrigatório).
7. **Parar o servidor:** `sap.cap.serve.stop` com o mesmo `handleId`. Não deixe servidor esquecido rodando.
8. **Build do app:** `sap.cap.build` roda `cds build --for nodejs` e gera `gen/srv`, o app Node.js que se publica. O artefato do **banco** para o HANA (`gen/db`) sai do build de produção (`cds build --production`), que o Speed Up não roda: ver `btp-publicar-cap`.

## Regras

- **Mude pouco e prove:** um arquivo por vez; compilar e testar a cada mudança.
- **`@sap/cds` em `dependencies`,** não só em `devDependencies`: o app publicado precisa dele para rodar. O `sap.cap.deploy.diagnose` confere isso.
- **Nada de segredo no projeto:** credencial não vai para `package.json`, `.cdsrc.json` nem `default-env.json` versionado. O push do Speed Up deixa de fora `.env`, `default-env.json`, `*.pem` e `*.key`.
- **Decisões de arquitetura antes do código:** runtime (Node.js ou Java), banco, plataforma de deploy, autenticação e multitenancy. São os pontos de decisão do guia de decisão de CAP do produto.

## Limites

- Tudo aqui é local: não prova conta BTP nem deploy.
- O motor CAP precisa estar instalado no projeto (`@sap/cds`, `@sap/cds-dk`): o Speed Up não instala dependências. Sem ele, o `sap.cap.deploy.diagnose` avisa que o build e o `mta.prepare` não rodam.

## Fontes (consultadas em 02/10/2026)

- [CAP — Deploy to Cloud Foundry](https://cap.cloud.sap/docs/guides/deploy/to-cf): o que o build de produção prepara para o deploy.
- Speed Up: o bundle `cap` (descritores das ações; o E131 exercita o motor real num projeto de prova) e o guia de decisão de CAP do produto.
