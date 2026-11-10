---
name: abapgit-repositorios
description: Lê o abapGit de um sistema ABAP pelo Speed Up — se ele tem a API do abapGit da SAP (BTP ABAP) ou só o relatório ZABAPGIT, quais repositórios estão ligados e o que mudou entre o sistema e o Git —, só em leitura. Use antes de um pull ou push, para saber o que vai mudar, e depois, para conferir que sistema e Git ficaram iguais.
titulo: "abapGit: repositórios e diferenças"
area: abap
bundles: [abapgit]
versao: 1.1.0
atualizado_em: 2026-11-02
origem:
  - "Sap-Speed-Up/packages/adapters/src/bundles/abapgit/manifesto.ts@sha256:171910917998"
  - "Sap-Speed-Up/packages/adapters/src/bundles/abapgit/lacunas.ts@sha256:b4796daebc00"
---

# abapGit: repositórios e diferenças

O bundle `abapgit` lê o abapGit de um sistema ABAP pela conexão `sapgui`, com o mesmo usuário e senha dos bundles ADT e RAP. Ele usa o ADT do sistema e não faz pull nem push.

## Quando usar

- **Antes de um pull ou push:** saber quais objetos e arquivos vão mudar.
- **Depois do pull ou push** (feito pelo usuário): conferir que sistema e Git ficaram iguais.
- **Num sistema novo:** saber se dá para trabalhar com o abapGit por API.

## Ler

1. **A variante do sistema:** `sap.abapgit.service.discover`. Ela vem da rota que o sistema anuncia, nunca do nome:
   - `adt_api`: o abapGit da SAP, no BTP ABAP, com API. As leituras abaixo funcionam.
   - `report_only`: só o relatório comunitário `ZABAPGIT` (on-premise), sem API remota. A resposta traz a escada: a SE38 pelo `sap_gui_abrir`, que o Claude abre e opera, e depois o SAP GUI desktop (a escada única do Speed Up ([sap-gui-web-abrir › A escada](../sap-gui-web-abrir/SKILL.md#a-escada-a-regra-unica))).
   - `absent`: nenhum dos dois.
2. **Os repositórios:** `sap.abapgit.repos.list` devolve a chave, a URL, o branch, o pacote, o autor, as datas e as ações que o backend anuncia (pull, stage, push…).
3. **O que mudou:** `sap.abapgit.repo.status` recebe a `key` e devolve o stage:
   - os objetos e arquivos novos, alterados e removidos;
   - o que já está preparado (staged) e o que é ignorado.

   Ele não grava nada.

## O que não fazer

- **Repositório privado** é a lacuna `abapgit.remote.credentials`: o backend pede o usuário e o token do Git.
  1. o host abre a view abapGit Repositories no Eclipse;
  2. quem digita o token é o usuário.
- **Pull, push e ligar repositório** são da fase 2: as lacunas `abapgit.repo.pull`, `abapgit.repo.push` e `abapgit.repo.link`.
  1. o host mostra o que vai mudar (`sap.abapgit.repo.status`);
  2. o usuário roda no Eclipse, ou no ZABAPGIT no on-premise;
  3. a leitura pelo Speed Up confere depois.

## Limites

- O bundle está qualificado em fixture. A primeira prova real, com o seu OK, faz a descoberta no DEV e, se a variante for `adt_api`, o status de um repositório público.
- A API do abapGit da SAP vem das fontes publicadas (project-odense, arquivado): os nomes dos campos se confirmam na prova real.
- A evidência guarda a variante, as chaves, os pacotes e as contagens, nunca a URL do Git nem o autor.

## Fontes (consultadas em 03/10/2026)

- [SAP-docs, Install and Set Up abapGit](https://github.com/SAP-docs/btp-cloud-platform/blob/main/docs/30-development/install-and-set-up-abapgit-2002380.md): o abapGit da SAP no BTP ABAP, pelo plug-in ADT; a SAP não dá suporte ao ZABAPGIT comunitário.
- [SAP/project-odense](https://github.com/SAP/project-odense): a API ADT do abapGit (`/sap/bc/adt/abapgit/repos`, os tipos v1 a v4 e o stage).
- [abapGit/ADT_Backend](https://github.com/abapGit/ADT_Backend): o backend ADT comunitário, fora de uso.
- Speed Up: o bundle `abapgit` (as ações, o recorte e as lacunas com a escada única; desenho 027 §2.4).

## Histórico de versões

| Versão | Data | O que mudou |
|---|---|---|
| 1.1.0 | 2026-11-02 | O relatório ZABAPGIT pela escada única: a SE38 pelo sap_gui_abrir (o Claude abre e opera), depois o SAP GUI desktop (SU-WI-220, #522) |
