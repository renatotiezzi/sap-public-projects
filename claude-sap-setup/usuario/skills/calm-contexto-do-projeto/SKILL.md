---
name: calm-contexto-do-projeto
description: Lê o contexto de um projeto do SAP Cloud ALM pelo Speed Up — projetos, tarefas, user stories, requisitos e defeitos, com o detalhe de cada item —, só em leitura. Use para saber o que o projeto pede antes de construir ou corrigir, e para conferir um item depois que o usuário o mudou no Cloud ALM.
titulo: "Cloud ALM: contexto do projeto"
area: btp
bundles: [calm]
versao: 1.1.0
ordem: 50
atualizado_em: 2026-11-02
origem:
  - "Sap-Speed-Up/packages/adapters/src/bundles/calm/manifesto.ts@sha256:e08eff18d622"
  - "Sap-Speed-Up/packages/adapters/src/bundles/calm/lacunas.ts@sha256:c8f8f3ae7f91"
---

# Cloud ALM: contexto do projeto

O que o projeto pede está no Cloud ALM: requisitos, user stories, tarefas e defeitos. O bundle `calm` lê isso pela conexão `cloud-alm` (a service key da instância "SAP Cloud ALM API") e não escreve nada: o Cloud ALM é tratado como produção.

## Quando usar

- **Antes de construir:** ler o requisito ou a user story que a entrega atende.
- **Antes de corrigir:** ler o defeito (descrição, estado e responsável).
- **Depois que o usuário mudou um item no Cloud ALM:** conferir pela leitura.

## Conectar

1. **No BTP:** a instância "SAP Cloud ALM API" (plano `standard`) e uma service key **só de leitura**, com authorities de leitura (ex.: `calm-api.projects.read` e `calm-api.tasks.read`).
2. **No Speed Up:**
   - a conexão `cloud-alm` usa a URL do campo `endpoints.Api` da key;
   - a key é colada em Trocar credencial, e o segredo fica no cofre.
3. **Testar:**
   - pede o token e lê os projetos;
   - uma key sem escopo aparece já aqui, como HTTP 403, com a dica do escopo que falta.

## Ler

1. **Projetos:** `sap.calm.projects.list` devolve:
   - id, nome e estado de cada projeto;
   - os escopos do token, com aviso quando a key pode escrever.
2. **Itens do projeto:** `sap.calm.tasks.list` recebe o `projectId` e estes filtros:
   - `types`: `CALMTASK` (tarefa), `CALMUS` (user story), `CALMREQU` (requisito) ou `CALMDEF` (defeito). Aceita também `task`, `userstory`, `requirement` e `defect`.
   - `status`: códigos de estado (ex.: `CIPTKOPEN`, `CIPTKINP`).
   - `titleContains`: um texto do título.
   - `top`: o teto de itens (padrão 100).

   A resposta traz as contagens por tipo e por estado.
3. **Um item:** `sap.calm.task.get` recebe o `taskId` e devolve o detalhe, com a descrição em HTML já virada texto.

## O que não fazer

- **Não escrever no Cloud ALM pelo Speed Up.** Criar, alterar, comentar ou apagar um item é a lacuna `calm.task.write`:
  1. o host abre o item no navegador embutido do Claude e mostra o que mudar;
  2. quem grava é o usuário: o Cloud ALM é nuvem que o Speed Up só lê (D-11), o caso que a escada única reserva a ele (skill sap-gui-web-abrir › A escada);
  3. `sap.calm.task.get` confere depois.
- **Features, analytics, testes e documentos** ficam no navegador por enquanto (a lacuna `calm.other`).
- **Título e descrição são dados do projeto do cliente:** use-os na conversa, mas não os copie para arquivo versionado.

## Limites

- O bundle está qualificado em fixture. A primeira prova real, com o seu OK, confirma os nomes dos campos, os filtros e a paginação da API.
- A evidência guarda só o envelope: ids, contagens, tipos e estados.

## Fontes (consultadas em 03/10/2026)

- [SAP-docs, Enabling SAP Cloud ALM API](https://github.com/SAP-docs/cloud-alm-setup-admin-guide/blob/main/docs/02_integration_and_config_options/enabling-sap-cloud-alm-api-704b5dc.md): a instância, o plano `standard`, o `endpoints.Api` e o nó `uaa` da key.
- [SAP Help, Task API](https://help.sap.com/docs/cloud-alm/apis/task-api): leitura e atualização de tarefas, com os escopos `calm-api.tasks.read` e `write`.
- [SAP-samples, cloud-alm-api-examples](https://github.com/SAP-samples/cloud-alm-api-examples): as rotas de projetos e de tarefas e os tipos `CALMTASK` e `CALMREQU`.
- Speed Up: o bundle `calm` (as ações, o recorte e as lacunas com escada; desenho 027 §2.6).

## Histórico de versões

| Versão | Data | O que mudou |
|---|---|---|
| 1.1.0 | 2026-11-02 | A escrita no Cloud ALM segue a escada única: o item no navegador embutido do Claude; gravar é do usuário porque o Speed Up só lê o Cloud ALM (D-11) (SU-WI-220, #522) |
