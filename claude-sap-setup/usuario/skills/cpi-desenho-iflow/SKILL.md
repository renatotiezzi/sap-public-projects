---
name: cpi-desenho-iflow
description: Desenha, gera, reconstrói ou revisa a estrutura de processamento de um iFlow do SAP Cloud Integration, principalmente a escolha entre passos nativos e Groovy. Use depois que o contrato estiver claro.
titulo: "CPI: desenho do iFlow"
area: cpi
bundles: [cpi]
versao: 1.1.1
atualizado_em: 2026-10-03
origem:
  - "Sap-Speed-Up/.agents/skills/speedup-cpi-iflow-design/SKILL.md@sha256:7dba400488c9"
---

# CPI: desenho do iFlow

Parta do contrato do cenário (`cpi-contrato`, se ele ainda não estiver explícito). Modele início, processamento, rotas, transformação, chamada ao receptor e saída de erro de um jeito legível no editor. Confirme suporte e versão de cada passo na documentação SAP atual.

## Quando usar

- Ao criar um iFlow novo, reconstruir um existente ou revisar o desenho de outro.
- Ao decidir entre passo nativo e script Groovy.

## Regras de desenho

- **Passos nativos primeiro** para roteamento, conversão, mapeamento, divisão, propriedades e tratamento padrão, quando atendem ao requisito.
- **Groovy quando houver necessidade concreta** que o passo padrão não resolve bem. Para cada script, registre motivo, entradas e saídas, dependências, falhas possíveis e teste.
- **Nem Groovy monolítico,** que reconstrói toda a integração num script só, **nem proibição** de scripts úteis.
- **Externalize o que varia entre ambientes,** quando o campo aceita. Nunca coloque endpoint, senha ou chave real em arquivo de exemplo.
- **Separe transformação de regra de transporte.**
- **Desenhe um caminho de exceção** e uma resposta ou estado que não escondam falha de negócio. O detalhe operacional está em `cpi-falhas-reprocessamento`.

## Com o Speed Up

- **Ler antes de mudar:**
  - `sap.cpi.iflows.list` lista os iFlows de um pacote; `sap.cpi.iflow.download` baixa o ZIP de um iFlow (o conteúdo só quando pedido);
  - `sap.cpi.iflow.describe`, `sap.cpi.source.read`, `sap.cpi.script-collection.get`;
  - para reutilizar um script ou mapeamento, use a referência `{ fromIflow, path }`: o Speed Up lê o original.
- **Pacote novo:** `sap.cpi.package.create` cria o pacote (Id, nome e textos).
- **Criar:** `sap.cpi.iflow.create` gera um iFlow que abre no editor. O diagrama vem completo, as condições do editor são validadas localmente e o resultado é relido. Ele nunca sobrescreve outro iFlow.
- **Enviar um iFlow pronto:** `sap.cpi.iflow.upsert` grava o ZIP inteiro de um iFlow (Id, pacote, conteúdo em base64) e relê o que ficou. Use quando o artefato já existe (exportado, montado fora). Um Id que já existe noutro pacote é recusado.
- **Condição de roteador** (expressão NonXML): valor literal sempre entre aspas simples, também número, por exemplo `${property.status} = '202'`. Sem as aspas, o build do CPI recusa a condição. A validação local (criar, enviar, alterar e copiar) barra o número sem aspas antes de enviar e avisa o texto sem aspas (achado #20 de 29/09).
- **Alterar arquivos internos** (script, mapeamento, `.iflw`, `parameters.prop`): `sap.cpi.iflow.patch` valida, envia e relê arquivo por arquivo.
- **Parâmetros externalizados:** `sap.cpi.iflow.configure` só escreve as chaves que o iFlow declara.
- **Copiar para outro pacote:** `sap.cpi.iflow.copy` ou `sap.cpi.package.copy`, com sufixo opcional nos endereços e nas filas JMS.
- **Tabela de correspondência:** em vez de Groovy ou parâmetro JSON, use Value Mapping: `cpi-value-mapping`.
- **Escrita só em DEV, TEST ou SANDBOX,** com autorização no painel. Pacotes protegidos são recusados.

## Do artefato à entrega

Um ZIP ou XML validado localmente é só um **candidato**. Para qualificar o artefato, ainda é preciso:
1. abrir no editor SAP;
2. conferir componentes e parâmetros;
3. com autorização em DEV, validar e fazer o deploy.

O teste de efeito no destino é outro gate: `cpi-prova-entrega`. Não declare suporte a um passo ou versão só porque existe um modelo local.

## Fontes (consultadas em 23/09/2026)

- [SAP Help — Integration Flow Design Guidelines](https://help.sap.com/docs/cloud-integration/sap-cloud-integration/integration-flow-design-guidelines): índice oficial para revisar os padrões aplicáveis.
- [SAP Help — General Scripting Guidelines](https://help.sap.com/docs/cloud-integration/sap-cloud-integration/general-scripting-guidelines): priorizar passos padrão e manter scripts customizados.
- [SAP Help — Elements of an Integration Flow](https://help.sap.com/docs/cloud-integration/sap-cloud-integration/elements-of-integration-flow): estrutura de sender, receiver, canais e passos.
- [SAP Help — Externalize Parameters of an Integration Flow](https://help.sap.com/docs/cloud-integration/sap-cloud-integration/45b2a0772db94bd9b0e57bc82d8d3797.html): parâmetros externos e precedência do valor configurado.
