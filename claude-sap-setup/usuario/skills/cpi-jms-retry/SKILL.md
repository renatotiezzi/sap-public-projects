---
name: cpi-jms-retry
description: Desenha, implementa, revisa ou testa retry e reprocessamento com filas JMS no SAP Cloud Integration. Use somente quando fila JMS entrar no contrato; não aplique a toda integração.
titulo: "CPI: retry e reprocessamento com JMS"
area: cpi
bundles: [cpi]
versao: 1.0.0
atualizado_em: 2026-10-01
origem:
  - "Sap-Speed-Up/.agents/skills/speedup-cpi-jms-retry/SKILL.md@sha256:60817c3ad15a"
  - "Sap-Speed-Up/.agents/skills/speedup-cpi-jms-retry/references/fontes-e-criterios.md@sha256:c886e5e69361"
---

# CPI: retry e reprocessamento com JMS

Orienta decisões e provas para um cenário CPI assíncrono com fila JMS. Não dá acesso ao tenant e não transforma documentação, ZIP válido ou deploy em entrega aceita. Para trabalho no próprio Speed Up, siga também `processo-speedup-desenvolvimento`.

Antes de propor configuração ou iFlow, leia [fontes e critérios](references/fontes-e-criterios.md). Confirme as regras no SAP Help atual, a edição e os recursos do tenant e as versões dos adapters; registre URL e data da consulta. Artigos de terceiros apoiam, mas não têm autoridade sobre o produto.

## Decisão antes do desenho

1. **O remetente aceita confirmação de recebimento?** Se ele precisa do resultado final síncrono, JMS não substitui o contrato diretamente.
2. **Levante o cenário:** origem, destino, efeito de negócio, chave estável para duplicidade, exigência de ordem, volume, tamanho, prazo de retenção, falhas temporárias e erros permanentes. Confirme que JMS está disponível e dimensionado no tenant; não presuma entitlement nem fila existente.
3. **Compare com as alternativas:** retry do adapter, Data Store e retry do remetente. Escolha JMS quando persistência e desacoplamento assíncrono atendem ao caso, e não por reflexo.

## Invariantes do desenho

- **Recepção e consumo são responsabilidades separadas:** o JMS receiver grava e o JMS sender lê **a mesma fila**. A confirmação ao remetente só significa que a mensagem foi aceita na persistência, não que o destino concluiu.
- **Access type** segue a necessidade de ordem e concorrência, e os dois canais da fila precisam coincidir. Verifique as implicações antes de criar a fila: o tipo não muda livremente depois.
- **Intervalo, backoff, horizonte de recuperação, retenção e expiração** seguem o contrato. Não imponha contagens ou tempos universais.
- **Três tipos de falha:** a transitória mantém a mensagem para retry; o erro permanente precisa de destino e operação definidos, sem laço infinito nem descarte silencioso; o resultado incerto depois do envio precisa de tratamento próprio.
- **Idempotência:** o JMS pode entregar de novo depois de perder uma confirmação. Defina idempotência no receptor ou perto do efeito de negócio e preserve um identificador estável entre as tentativas. Se o remetente também pode reenviar, a identidade precisa sobreviver a **novas** entradas, não só ao retry da mesma mensagem.
- **Dead-letter não é limite de tentativas:** a opção nativa de dead-letter que a SAP descreve é para bloqueio depois de falhas graves do worker, e a disponibilidade depende do tipo de fila.

## Com o Speed Up

- **O tenant tem JMS?** `sap.cpi.tenant.features` responde disponível, indisponível ou desconhecido. `sap.cpi.jms.status` mostra a capacidade do broker (filas usadas e livres, alertas) e as filas pelo nome.
- **Acompanhar o retry:** `sap.cpi.message.get`. A retentativa do JMS acontece **no mesmo MPL**; enquanto ela dura, o MPL fica em RETRY. Espere e leia de novo, sem concluir antes.
- **Copiar fluxos que usam fila:** `sap.cpi.iflow.copy` e `sap.cpi.package.copy` renomeiam as filas JMS com sufixo, mantendo produtor e consumidor ligados pela fila da cópia.
- **Undeploy não apaga fila:** `sap.cpi.iflow.undeploy` lista as filas que ficaram no broker; apagar fila é do usuário.

## Dois gates de entrega

1. **Técnico:** os artefatos abrem no editor, a configuração de fila e adapters é coerente, e o deploy só acontece no DEV autorizado.
2. **Funcional:** a entrada é adequada ao adapter (Postman só para HTTP), e se verificam persistência, saída no destino, MPL e monitor da fila. Prove:
   - indisponibilidade temporária com retry e recuperação;
   - erro permanente sem repetição indevida;
   - duplicidade e ACK incerto;
   - ordenação, quando aplicável.

Registre `requisito → desenho → teste → evidência` e os limites ainda não provados. Sem tenant DEV autorizado, o máximo é desenho ou artefato local candidato; não declare JMS qualificado em operação.
