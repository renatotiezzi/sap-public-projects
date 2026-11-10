---
name: cpi-falhas-reprocessamento
description: Desenha ou revisa tratamento de exceção, classificação de falhas, retry e reprocessamento manual no SAP Cloud Integration. Use quando o fluxo precisa sobreviver a falhas ou quando uma mensagem falhou e precisa ser entendida.
titulo: "CPI: falhas, retry e reprocessamento"
area: cpi
bundles: [cpi]
versao: 1.2.0
atualizado_em: 2026-11-02
origem:
  - "Sap-Speed-Up/.agents/skills/speedup-cpi-error-recovery/SKILL.md@sha256:5295435e7add"
---

# CPI: falhas, retry e reprocessamento

Use o contrato do fluxo para classificar cada falha em um destes tipos:

- **transitória:** por exemplo, indisponibilidade temporária;
- **permanente ou funcional:** payload ou regra inválida;
- **efeito incerto:** o destino pode ter executado sem confirmar.

Diga quem pode tentar de novo, por quanto tempo, com que identidade de mensagem e onde o operador vê e resolve o caso. Não imponha retry automático nem JMS a toda integração.

## Diagnóstico: primeiro o LOG da chamada (regra de 02/11/2026)

Erro de iFlow se diagnostica pelo **log da mensagem que falhou**, nunca por contagem, horário ou dedução. A ordem é fixa:

1. **O log da mensagem:** `sap.cpi.message.get` com o `messageGuid` da falha. Na mensagem que falhou, ele traz o `log` sem pedir: os passos de cada execução, o passo que falhou, os anexos (com a seção `Body` à parte), as mensagens persistidas e, em TRACE, o conteúdo do passo. Leia a `log.linha`: o passo que falhou, o receptor, o texto exato que voltou e o que o receptor respondeu, das propriedades do passo que falhou (`log.receptorRespondeu`: o `HTTPStatusCode`, o `ErrorPayload`, o `ErrorFaultCode`, o tipo e o `RealDestinationUrl`) e, quando um anexo guarda, dos cabeçalhos da resposta (`log.resposta`). O `Error` do passo pode ser só o sintoma (o parser lendo o que voltou); o `ErrorPayload` é o que voltou.
2. **Diga o que o log provou** com as palavras dele: o passo (`ModelStepId`), o erro exato e o que o receptor devolveu. O que o log não guardou (o corpo da resposta fora de TRACE, por exemplo) é dito como lacuna, nunca suposto.
3. **Só depois as hipóteses de sistema** (rede, Cloud Connector, certificado, o receptor), cada uma apontando o trecho do log que a sustenta. Contagens e horários servem para dizer **desde quando**, não **por quê**.
4. **Faltou o corpo?** Peça ao usuário para pôr o iFlow em TRACE (o trace dura 1 hora) ou leia o lado do receptor; não feche a causa sem ele.

Prova da regra (02/11/2026, o CPI DEV de um projeto real): as três mensagens com `Unexpected character 'j' (code 106) in prolog` falharam no passo do adaptador SOAP; as propriedades do passo mostraram **HTTP 500 com `ErrorPayload=javax.net.ssl.SSLHandshakeException: Received fatal alert: certificate_expired`** (os 78 bytes do `Content-Length`, cujo "j" o parser SOAP recusou), pelo Cloud Connector do projeto: um certificado vencido no caminho até o QAS, o que nenhuma contagem tinha dito.

## Quando usar

- Ao desenhar o tratamento de erro de um iFlow.
- Quando uma mensagem falhou e é preciso entender a causa e decidir o reprocessamento.

## Escolha do mecanismo

Escolha entre retry do remetente, recurso específico do adapter, Data Store e JMS, conforme protocolo, sincronia, retenção e necessidade de desacoplamento. Se a escolha for JMS, use `cpi-jms-retry`: fila, ACK, idempotência e operação têm gate próprio. Reenvio sem controle de duplicidade pode repetir o efeito de negócio.

## Exception Subprocess

- Modele o Exception Subprocess com o desfecho desejado.
- **Message End pode aparecer como Completed** no monitor mesmo depois de uma exceção. **Error End** mantém o erro propagado. Confirme essa semântica no cenário, inclusive a resposta ao remetente.
- Um aviso por e-mail ou log não substitui um resultado correto.
- Registre erro permanente, mensagem irrecuperável e procedimento manual, sem descarte silencioso.

## Com o Speed Up

- **Entender uma falha:**
  - `sap.cpi.messages.list` filtra por artefato, status e data;
  - `sap.cpi.message.get` traz as execuções (uma por tentativa), os cabeçalhos, o texto do erro e, na mensagem que falhou, o log passo a passo (`log`: os passos, o passo que falhou, os anexos, as persistidas, o trace e a resposta do receptor); `log: true` pede numa mensagem sem falha e `tetoDoConteudo` muda o teto de cada conteúdo;
  - `sap.cpi.runtime.status` mostra o estado do artefato implantado.
- **Data Store:** `sap.cpi.datastores.list`, `sap.cpi.datastore.entries.list` e `sap.cpi.datastore.entry.get`. Elas leem só metadados; o conteúdo não é lido.
- **JMS:** `sap.cpi.jms.status` mostra a capacidade do broker e as filas.
- **Lacuna conhecida:** reprocessar, reenfileirar ou apagar uma entrada de Data Store ou de fila **não é ação do Speed Up hoje**. Siga a escada única (skill sap-gui-web-abrir › A escada): a tela indicada no navegador embutido do Claude; apagar é do usuário. Depois, volte ao Speed Up para conferir o resultado com uma leitura.

## Saída esperada

Uma matriz `falha → status/efeito → tentativa/limite → onde observar → ação humana`, mais testes de falha e de duplicidade proporcionais ao caso. Sem execução autorizada em DEV, descreva o desenho e os testes pendentes, não um comportamento comprovado.

## Fontes (consultadas em 23/09/2026)

- [SAP Help — Define Exception Subprocess](https://help.sap.com/docs/cloud-integration/sap-cloud-integration/define-exception-subprocess): pontos de captura e tipos de término.
- [SAP Help — Handle Errors Gracefully](https://help.sap.com/docs/cloud-integration/sap-cloud-integration/handle-errors-gracefully): diferença operacional entre Message End e Error End.
- [SAP Help — Apply the Retry Pattern](https://help.sap.com/docs/cloud-integration/sap-cloud-integration/apply-retry-pattern): alternativas de retry com JMS, Data Store, sender e adapters.
- [SAP Help — Quality of Service](https://help.sap.com/docs/cloud-integration/sap-cloud-integration/quality-of-service): falhas e duplicidade ao longo do fluxo completo.

## Histórico de versões

| Versão | Data | O que mudou |
|---|---|---|
| 1.2.0 | 2026-11-02 | A lacuna do Data Store e das filas cita a escada única (SU-WI-220, #522) |
