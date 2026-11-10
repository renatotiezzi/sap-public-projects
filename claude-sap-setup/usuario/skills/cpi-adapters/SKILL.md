---
name: cpi-adapters
description: Seleciona, configura ou revisa adapters de sender e receiver do SAP Cloud Integration e o comportamento deles em runtime. Use ao escolher o canal de uma ponta ou investigar falha de conexão.
titulo: "CPI: adapters e canais"
area: cpi
bundles: [cpi]
versao: 1.0.0
atualizado_em: 2026-10-01
origem:
  - "Sap-Speed-Up/.agents/skills/speedup-cpi-adapters/SKILL.md@sha256:b3f4993d72f8"
---

# CPI: adapters e canais

Escolha o adapter pela ponta e pela semântica exigida, não pelo exemplo mais parecido. Antes de gerar configuração, consulte a documentação SAP **do sender ou receiver exato** e a versão disponível no tenant.

## Quando usar

- Ao escolher o canal de entrada ou saída de um iFlow.
- Ao revisar configuração de canal ou investigar falha de conexão.

## O que confirmar em cada canal

- direção da mensagem;
- endpoint ou endereço;
- método ou polling;
- autenticação por artefato ou alias;
- rede e proxy;
- formato e limites;
- resposta ou ACK;
- o que acontece com o arquivo ou a mensagem depois do processamento;
- comportamento na falha;
- parâmetros externalizados.

Documente a diferença entre falha de conexão, falha de mensagem e efeito incerto no destino. Não trate a reconexão do adapter como retry de ponta a ponta sem prova do cenário.

## Casos frequentes

- **SFTP:** separe a configuração de **leitura/polling** do sender da de **gravação** do receiver. Registre diretório, filtro, lock e pós-processamento.
- **HTTP/HTTPS:** deixe explícito o contrato de status e o corpo da resposta.
- **Outros adapters:** abra a página SAP específica antes de afirmar suporte.
- **Nunca** copie credencial, host ou caminho de exemplo como valor de cliente.

## Com o Speed Up

- **Ver os canais de um iFlow:** `sap.cpi.iflow.describe` mostra os adapters e os endereços (HTTPS, ProcessDirect, SOAP, JMS…).
- **Ajustar parâmetros externalizados do canal:** `sap.cpi.iflow.configure`.
- **Testar um sender HTTPS de verdade:** `sap.cpi.endpoint.call` usa a credencial de **execução** da conexão (plano `integration-flow`). Ele devolve status, cabeçalhos e o id do MPL. Só roda em DEV, TEST ou SANDBOX.
- **A conexão CPI tem dois alvos:** a API de design (plano `api`) e o runtime (plano `integration-flow`). Sem a chave de runtime, o teste de endpoint não roda.

## Saída esperada

Uma tabela curta `canal → opção exigida → fonte/versão → teste de conectividade → teste de efeito`. Se faltar versão, acesso ou detalhe de configuração, marque como não verificado; não simule qualificação real.

## Fontes (consultadas em 23/09/2026)

- [SAP Help — Configure Adapter in Communication Channels](https://help.sap.com/docs/cloud-integration/sap-cloud-integration/configure-adapter-in-communication-channels): catálogo oficial e separação entre sender e receiver.
- [SAP Help — Configure the SFTP Sender Adapter](https://help.sap.com/docs/cloud-integration/sap-cloud-integration/configure-sftp-sender-adapter): leitura/polling e opções do canal.
- [SAP Help — Configure the SFTP Receiver Adapter](https://help.sap.com/docs/cloud-integration/sap-cloud-integration/configure-sftp-receiver-adapter): gravação no servidor remoto e opções de versão.
- [SAP Help — Quality of Service](https://help.sap.com/docs/cloud-integration/sap-cloud-integration/quality-of-service): o QoS do adapter não equivale a garantia de ponta a ponta.
