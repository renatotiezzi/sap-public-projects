# Base online para retry JMS no SAP Cloud Integration

Consultada em **2026-09-23**. Reconfirme versão, disponibilidade e parâmetros no SAP Help e no tenant antes de implementar. Estas páginas fundamentam decisões; não provam que o tenant tem JMS habilitado nem que um iFlow existente está correto.

## Fontes de implementação (SAP oficial)

1. [Apply the Retry Pattern with JMS Queue](https://help.sap.com/docs/integration-suite/sap-integration-suite/apply-retry-pattern-with-jms-queue): o tutorial SAP mais direto. Mostra o fluxo de entrada que persiste, o fluxo de saída que consome, Retry/Completed no monitor, intervalo/backoff e uma ressalva de edição. Use para o primeiro desenho e a prova de recuperação.
2. [Decoupling via JMS Queue](https://help.sap.com/docs/cloud-integration/sap-cloud-integration/decoupling-via-jms-queue): quando desacoplar, o limite da confirmação ao remetente, erro antes da persistência e por que duplicidade e ID estável são necessários. Use para o contrato funcional e a idempotência.
3. [Configure the JMS Receiver Adapter](https://help.sap.com/docs/integration-suite/isuite-integrations-and-apis/configure-jms-receiver-adapter): fila, acesso Exclusive/Non-Exclusive, correspondência com o consumidor, retenção, expiração e disponibilidade por edição. Use para configurar a entrada.
4. [JMS Resource Limits and Optimizing their Usage](https://help.sap.com/docs/integration-suite/isuite-integrations-and-apis/jms-resource-limits-and-optimizing-their-usage): limites de filas, armazenamento, transações, consumidores e cabeçalhos. Use antes de prometer capacidade ou custo operacional.
5. [Managing Queues](https://help.sap.com/docs/integration-suite/sap-integration-suite/managing-queues): estados e operação das filas. Use para runbook e recuperação manual autorizada; monitorar não significa que toda mensagem será reprocessada para sempre.
6. [Idempotent Process Call Handles Duplicates](https://help.sap.com/docs/cloud-integration/sap-cloud-integration/idempotent-process-call-handles-duplicates-with-jms-and-data-store-operations): exemplo SAP de efeito repetido quando JMS e banco não compartilham transação. Use ao revisar escritas antes de permitir retry.
7. [Define Exception Subprocess](https://help.sap.com/docs/cloud-integration/sap-cloud-integration/define-exception-subprocess): tratamento de erro e tipo de fim. Use para não confundir notificação de exceção com política de retry.

## Padrão conceitual e exemplo complementar

- [Idempotent Receiver — Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/patterns/messaging/IdempotentReceiver.html): fundamento independente de produto para não repetir o efeito ao receber a mesma mensagem mais de uma vez.
- [Configure Asynchronous Messaging with Retry Using JMS Adapter — SAP Community](https://community.sap.com/t5/integration-blog-posts/cloud-integration-configure-asynchronous-messaging-with-retry-using-jms/ba-p/13315669): passo a passo complementar de 2017. O próprio artigo avisa que foi escrito para filas **Non-Exclusive** e que parte das recomendações pode não valer para **Exclusive**. Confira cada configuração no SAP Help atual e não copie valores como padrão.

## Decisões que cada implementação deve registrar

| Pergunta | Evidência necessária |
| --- | --- |
| O remetente aceita resposta assíncrona? | Contrato de resposta e prova de que "aceito" não foi tratado como "processado no destino" |
| JMS está disponível e cabe na capacidade do tenant? | Edição/runtime, broker e limites lidos no ambiente atual |
| A ordem importa? | Escolha justificada entre fila Exclusive e Non-Exclusive, considerando bloqueio e throughput |
| O que é temporário e o que é permanente? | Matriz de erros com retry, parada ou encaminhamento, e responsável operacional |
| Como impedir efeito duplicado? | Chave estável, comportamento do receptor e teste de repetição e de ACK incerto |
| Como saber o que ocorreu? | MPL, estado da fila, correlação e evidência do destino |

**Cuidado:** a opção nativa de Dead-Letter Queue do tutorial SAP cobre cenários específicos de crash do worker e depende de fila Non-Exclusive. Não a apresente como solução automática para qualquer mensagem inválida ou limite de falhas de negócio.
