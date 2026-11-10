---
name: cpi-prova-entrega
description: Valida um iFlow do SAP Cloud Integration do artefato gerado até o deploy autorizado em DEV e a evidência de ponta a ponta em runtime. Use antes de chamar uma integração de pronta.
titulo: "CPI: prova de entrega"
area: cpi
bundles: [cpi]
versao: 1.1.1
atualizado_em: 2026-10-03
origem:
  - "Sap-Speed-Up/.agents/skills/speedup-cpi-delivery-validation/SKILL.md@sha256:f9f2b1dd599f"
---

# CPI: prova de entrega

Arquivo gerado, ZIP/XML válido, fixture verde, simulação, deploy iniciado e integração funcional são coisas **diferentes**. Registre o estágio alcançado e o próximo gate. Prova em tenant exige alvo DEV, efeito e autorização atuais; QAS e PRD ficam sem mutação.

## Quando usar

- Antes de declarar uma integração pronta.
- Depois de cada mudança que precise de nova prova.

## Gate técnico

1. Valide o artefato local e as dependências.
2. Abra no editor SAP e confira passos, canais, scripts e parâmetros.
3. Com autorização, salve e acompanhe o deploy até o estado efetivo, corrigindo os erros de modelagem.

A simulação do iFlow antecipa defeitos, mas não prova conectividade nem efeito final. Sem tenant ou autorização, pare em **candidato local** e entregue o procedimento de prova pendente.

## Gate funcional

- **Dispare pelo gatilho real:** cliente HTTP para sender HTTPS, arquivo para sender SFTP, evento, fila ou agendamento conforme o canal.
- **Verifique** a resposta ao remetente, a transformação, o efeito no destino, o Message Processing Log e a correlação entre entrada e saída.
- **Cubra** ao menos um caso de sucesso e um de falha relevante; inclua duplicidade, retry e recuperação quando o contrato exigir. Com o Speed Up, esses casos são a lista `cases` do `sap.cpi.test.run`.
- **HTTP 202 não prova** que o processamento assíncrono terminou.

## Com o Speed Up

- **Deploy acompanhado:** `sap.cpi.iflow.deploy` espera o desfecho no runtime: STARTED desta implantação, com a versão do designtime, ou ERROR com a causa. Em andamento dentro do prazo **não é sucesso**.
- **Estado:** `sap.cpi.runtime.status`.
- **Gatilho HTTP real:** `sap.cpi.endpoint.call` chama o endpoint implantado com a credencial de execução e devolve status, cabeçalhos, corpo e o id do MPL. Só roda em DEV, TEST ou SANDBOX.
- **Bateria de teste** (para iFlow com entrada HTTPS):
  - `sap.cpi.test.run` roda os casos de uma vez, um por vez, cada um com o `x-speedup-id` `<runId>-<n>`;
  - ele espera cada MPL chegar ao estado final e diz, por caso, o HTTP, o MPL e se passou;
  - para isso, declare em cada caso o esperado: `expectStatus`, `expectMplStatus` (COMPLETED, FAILED…) e `expectBodyContains`;
  - use um `runId` novo a cada rodada;
  - sem `expectMplStatus`, o MPL só é informado e não reprova o caso;
  - um caso inconclusivo diz o motivo: o MPL sem estado final no prazo, o corpo cortado em 4 MiB ou a resposta perdida (confira pelo MPL);
  - só roda em DEV, TEST ou SANDBOX.
- **Collection para o Postman:** `sap.cpi.test.collection` monta a collection v2.1 e o environment com os mesmos casos.
  - Só sai para DEV, TEST ou SANDBOX, e não sai para iFlow de pacote protegido: rodar a collection é chamar o iFlow. Essa recusa não se contorna.
  - O token sai por um script da collection, então ela roda no Runner e no Newman.
  - O client secret nunca sai do Speed Up: o usuário o digita no environment.
  - Sem deploy, o caminho vem do designtime, com aviso.
- **Monitor:** `sap.cpi.messages.list` e `sap.cpi.message.get`, com as execuções por tentativa e o texto do erro.
- **Evidência:** toda execução pelo Speed Up gera evidência sanitizada; use-a na tabela de prova.
- **Fora do alcance do Speed Up:**
  - para SFTP, eventos e efeito no sistema de destino, peça a observação ao usuário ou use a escada de ferramentas;
  - depois, confirme com uma leitura pelo Speed Up.

## Saída esperada

Uma tabela `critério → comando ou ação de prova → evidência sem segredo → resultado → pendência`. Evidência de deploy e evidência de negócio são separadas. Peça validação humana do resultado no destino quando a ferramenta não puder observá-lo; não marque `Done` por conta própria.

## Fontes (consultadas em 23/09/2026)

- [SAP Help — Creating an Integration Flow](https://help.sap.com/docs/cloud-integration/sap-cloud-integration/creating-integration-flow): abertura e upload de artefato no editor.
- [SAP Help — Save and Deploy the Integration Flow](https://help.sap.com/docs/cloud-integration/sap-cloud-integration/save-and-deploy-integration-flow): validação do modelo e estado da implantação.
- [SAP Help — Simulation of an Integration Flow](https://help.sap.com/docs/integration-suite/sap-integration-suite/simulation-of-integration-flow): simulação antes do deploy e o alcance dela.
- [SAP Help — Message Monitoring](https://help.sap.com/docs/cloud-integration/sap-cloud-integration/message-monitoring): observação do comportamento em runtime.
- [SAP Help — Sender-Initiated Scenario (HTTPS)](https://help.sap.com/docs/cloud-integration/sap-cloud-integration/sender-initiated-scenario-with-https-sender-adapter): teste por cliente HTTP quando esse é o canal.
