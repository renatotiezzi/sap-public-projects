---
name: datasphere-objetos-do-espaco
description: Lê os objetos modelados de um espaço do SAP Datasphere pelo Speed Up — views, tabelas locais e os outros tipos que o tenant descreve, com o estado de implantação e a definição (elementos, chaves, dependências) —, só em leitura. Use para entender um modelo antes de construir sobre ele ou de mudá-lo no Data Builder, e para conferir depois da mudança.
titulo: "Datasphere: objetos do espaço"
area: btp
bundles: [datasphere]
versao: 1.0.0
ordem: 60
atualizado_em: 2026-10-03
origem:
  - "Sap-Speed-Up/packages/adapters/src/bundles/datasphere/manifesto.ts@sha256:004f4b817f9a"
  - "Sap-Speed-Up/packages/adapters/src/bundles/datasphere/lacunas.ts@sha256:d6682a8c4845"
---

# Datasphere: objetos do espaço

O bundle `datasphere` lê os objetos de um espaço do SAP Datasphere pela conexão `datasphere`, que usa o cliente OAuth de propósito "Technical User". Ele usa as mesmas operações que o CLI oficial: o catálogo de comandos que o próprio tenant publica. Não escreve nem implanta nada.

## Quando usar

- **Antes de construir sobre um modelo:** quais views e tabelas existem, se estão implantadas e quais colunas e chaves têm.
- **Antes de mudar no Data Builder:** ler a definição e as dependências.
- **Depois que o usuário mudou e implantou:** conferir a definição e o estado de implantação.

## Conectar

1. **No Datasphere:**
   - o cliente OAuth "Technical User" (System → Administration → App Integration);
   - um papel de escopo **só de leitura** nos espaços que o Speed Up vai ler.
2. **No Speed Up:**
   - a conexão `datasphere` usa a URL do tenant;
   - os espaços são opcionais (`spaces`): o primeiro vira o padrão, e com a lista, espaço fora dela é recusado. Pelo painel, por enquanto, os espaços não são pedidos: informe o `space` no pedido.
3. **Testar:**
   - pede o token e lê o catálogo de comandos do tenant;
   - com espaço declarado, também lista os objetos dele.

## Ler

1. **Objetos de um tipo:** `sap.datasphere.objects.list`.
   - Recebe o `space` (padrão: o primeiro espaço da conexão), o `type` (padrão `views`; também `local-tables`, `remote-tables`, `analytic-models`… os tipos que o catálogo do tenant descreve) e, opcionais, `select`, `filter`, `top` (até 200) e `skip`.
   - Devolve, por objeto, o nome técnico e o de negócio, o uso semântico, o estado de implantação (`Deployed`, `NotDeployed`, `ChangesToDeploy`, `DesignTimeError`, `PendingDeployment`), as datas e os autores.
   - **Sem espaço**, devolve só o catálogo: quais tipos têm leitura neste tenant. O cliente técnico não lista os espaços.
2. **Um objeto:** `sap.datasphere.object.read` recebe o `technicalName` e:
   - a `variant`: `full` (padrão), `design-time` ou `run-time`;
   - o resumo: elementos com tipo e tamanho, chaves e dependências (as fontes da consulta);
   - o CSN inteiro só com `csn: true`, até 256 KB.

## O que não fazer

- **Não mudar objeto pelo Speed Up.** Criar, alterar, salvar, implantar ou apagar é a lacuna `datasphere.object.change`:
  1. o host abre o objeto no Data Builder e mostra a mudança;
  2. quem salva e implanta é o usuário (o `create` e o `update` do CLI implantam por padrão);
  3. `sap.datasphere.object.read` confere depois.
- **Espaços** (Space Management) e **tarefas** (Data Integration Monitor) ficam no navegador: as lacunas `datasphere.spaces` e `datasphere.task.run`.
- **O que o catálogo do tenant não descreve** é a lacuna `datasphere.catalog`. A resposta diz quais tipos têm leitura.

## Limites

- A rota do catálogo não é publicada: o bundle está qualificado em fixture. A primeira prova real, com o seu OK, um cliente só de leitura e um espaço de DEV, confirma o formato do catálogo e das respostas.
- A evidência guarda o envelope (nomes técnicos, estados, contagens) e o hash do CSN, nunca o CSN.

## Fontes (consultadas em 03/10/2026)

- [SAP Help, Manage Modeling Objects](https://help.sap.com/docs/SAP_DATASPHERE/d0ecd6f297ac40249072a44df0549c1a/6f5c65f209004751aa48f9682ee2ec45.html): os comandos `objects list` e `read`, as opções, as três variantes de `--accept` e os estados de implantação.
- [Guia da linha de comando do Datasphere (PDF, 2026.19)](https://help.sap.com/doc/23bac77aef50453f8dbe772f67d0ce89/cloud/en-US/507babe9acf94d1dacd81376429d4c1d.pdf): o cliente técnico, o limite de cerca de 300 pedidos por minuto e o catálogo de comandos do tenant.
- [FAQ do CLI do Datasphere (blog da SAP)](https://community.sap.com/t5/technology-blog-posts-by-sap/faq-amp-troubleshooting-guide-for-sap-datasphere-cli/ba-p/13550029): o caminho do catálogo.
- Speed Up: o bundle `datasphere` (as ações, o recorte e as lacunas com escada; desenho 027 §2.7).
