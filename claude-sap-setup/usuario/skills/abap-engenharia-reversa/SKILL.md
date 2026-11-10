---
name: abap-engenharia-reversa
description: Porta de entrada para entender um ambiente SAP com o Speed Up (o REA do SAP), só leitura e em qualquer ambiente, QAS e PRD inclusive. Diz em que ordem ir (o motor pelo RFC primeiro, o Web GUI só para a lacuna, o SAP GUI desktop por último), quais leituras usar (o inventário do código próprio, o uso real, a configuração que foi feita, o volume do processo, as análises do vibing-steampunk e as leituras de sempre) e o que entregar (um .md na pasta do projeto). Use em upgrade, conversão, migração, auditoria de código próprio, "o que se usa de verdade" e na preparação de uma proposta.
titulo: "ABAP: engenharia reversa de um ambiente SAP (o REA do SAP)"
area: abap
bundles: [adt]
versao: 1.0.0
ordem: 1
atualizado_em: 2026-11-03
origem:
  - "Sap-Speed-Up/docs/decisoes/2026-11-03-o-rea-do-sap-vira-motor-do-speed-up-e-a-forca-dele-vira-mens.md (\"sim deixa isso como motor, um bandle, sei la,... vamos ter uma apresentação do speedup e precisamos faalar que ele tem um rea mto forte\")"
  - "Sap-Speed-Up/packages/adapters/src/bundles/adt/completo/rea.ts (as capacidades sap.rea.*, SU-WI-240 #558)"
  - "Sap-Speed-Up/docs/decisoes/2026-10-19-qas-e-prd-leem-pelo-rfc-primeiro-pelo-motor-do-speed-up.md"
---

# ABAP: engenharia reversa de um ambiente SAP (o REA do SAP)

Entender um ambiente SAP é responder, com prova lida do sistema: o que existe de código próprio, o que roda de verdade, o que foi configurado (quando e por quem) e quanto volume o processo tem. O Speed Up lê tudo isso só em leitura, inclusive em QAS e PRD, e o resultado vira um `.md` na pasta do projeto, não uma resposta perdida na conversa.

## A escada (sempre nesta ordem)

1. **O motor do Speed Up (`sap_execute`).** Em QAS e PRD ele lê pelo RFC primeiro, com a credencial do cofre da conexão; a senha nunca passa pela conversa. Nos outros ambientes, o ADT e, quando o ADT não chega, o RFC. O `via: "auto"` decide sozinho.
2. **O Web GUI (`sap_gui_abrir`)**, só para a lacuna: a tela que nenhuma leitura do motor alcança. As regras estão na skill [sap-gui-web-abrir](../sap-gui-web-abrir/SKILL.md).
3. **O SAP GUI desktop**, por último, e só se o Web GUI também não servir.

"Precisa da senha" é uma parada: peça ao usuário trocar a credencial na conexão e não tente por outro caminho.

## As leituras do REA do SAP

| Pergunta | Capacidade | O que volta |
|---|---|---|
| O que existe de código próprio? | `sap.rea.inventory` (`padrao` Z*, Y*, /XXX/, ou `pacote`; `tipos`, `teto`, `contar`) | a TADIR contada por tipo, pacote, namespace e sistema de origem |
| O que roda de verdade? | `sap.rea.usage` (`padrao`, `pacote`, `tipos`) | o SUSG (e o SCMON, se houver) contra o inventário: usados × sem uso, por pacote e namespace, com o período. Sem coleta, ela diz "indisponível": o "sem uso" então não prova nada |
| O que foi configurado? | `sap.rea.customizing.history` (`tabela` como /XXX/% ou T%, `de`, `ate`, `teto`, `comChaves`) | as ordens de customizing por tabela ou visão: quantas ordens, quantas chaves, a primeira e a última data, os usuários; e a lista das ordens com o texto |
| Quanto volume o processo tem? | `sap.rea.volume` (`tabelas` até 20, `campoData`, `de`, `ate`, `agrupar`) | a contagem de cada tabela, com o agrupamento (o tipo de documento, a empresa) |
| Como o código está por dentro? | `sap.rea.code.analysis` (`comando`: `slim`, `api-surface`, `boundaries`, `health`, `deps`, `changelog`, `effects`) | as análises do vibing-steampunk, só leitura e pelo ADT: código morto, as APIs SAP usadas, as fronteiras entre pacotes, a saúde, as dependências, as ordens do pacote e os efeitos de LUW de um objeto |

As leituras de sempre completam o quadro:
- **tabela e configuração:** `sap.abap.data.table` (o RFC primeiro em QAS e PRD) e `sap.abap.data.query` (o SQL de leitura);
- **objetos e código:** `sap.abap.object.search`, `sap.abap.package.contents`, `sap.abap.ddic.element`, `sap.abap.code.where-used`;
- **o que acontece no sistema:** `sap.abap.status.read` (IDoc, AIF, jobs, filas), `sap.abap.log.read`, `sap.abap.runtime.dumps`, `sap.abap.traces.read`.

Os argumentos de cada uma: `sap_capabilities {"prefix": "sap.rea"}`.

## Em que ordem trabalhar

1. **O inventário** (`sap.rea.inventory` com `contar: true`): o tamanho do problema, por pacote e tipo.
2. **O uso** (`sap.rea.usage`): o que roda e o que não roda. Confira a coleta antes de chamar algo de "sem uso".
3. **O volume** (`sap.rea.volume`) das tabelas do processo, no período que importa.
4. **A configuração** (`sap.rea.customizing.history`) das tabelas do processo: o que mudou, quando e por quem.
5. **O código** que importa (`sap.rea.code.analysis` no pacote; `sap.abap.object.read` e `sap.abap.code.where-used` no objeto).
6. **O domínio**: a skill funcional do processo — [gts-funcional](../gts-funcional/SKILL.md), [abap-configuracao-e-cenarios](../abap-configuracao-e-cenarios/SKILL.md).

## Fora do SAP

O middleware, os apps e as capturas de rede (HAR) passam pelo REA de fora do SAP: `rea_ferramentas` mostra o que ele lê, e a skill [processo-rea-para-cenario](../processo-rea-para-cenario/SKILL.md) leva o que foi entendido até o cenário.

## O que sai

Um `.md` na pasta do projeto (em `docs/`, no índice do `README.md` dela), com:
- **o inventário:** os números por pacote e tipo, e o sistema de origem;
- **o que se usa:** usados × sem uso, com o período da coleta (ou "sem coleta: não provado");
- **o mapa do processo:** as tabelas, o volume no período, a configuração que foi feita e os objetos de código que o processo toca;
- **a fonte de cada número:** a capacidade, os argumentos e o ambiente.

## Limites

- Tudo é leitura: nenhuma destas capacidades grava no SAP.
- O `sap.rea.usage` só prova uso onde a coleta (SUSG ou SCMON) está ligada há tempo suficiente.
- O `sap.rea.code.analysis` precisa do endereço ADT por HTTP na conexão; sem ele, a recusa diz isso, e o inventário e o volume seguem pelo RFC.
- Na prova real de 03/11/2026, o `effects` funcionou. As análises de pacote (`slim`, `api-surface`, `boundaries`, `health`, `deps`, `changelog`) falharam: o SELECT do próprio vsp volta 403 de CSRF naquele servidor. Quando falharem, diga isso ao usuário e monte o mesmo quadro pelas leituras do Speed Up: `sap.rea.inventory` (o pacote), `sap.abap.code.where-used`, `sap.abap.atc.run` e `sap.rea.customizing.history` (as ordens).
