---
name: cpi-contrato
description: Define ou revisa o contrato de negócio e técnico de um cenário SAP Cloud Integration antes de construir ou mudar o iFlow. Use ao receber uma intenção de integração, exemplos, links ou arquivos.
titulo: "CPI: contrato da integração"
area: cpi
bundles: [cpi]
versao: 1.0.0
atualizado_em: 2026-10-01
origem:
  - "Sap-Speed-Up/.agents/skills/speedup-cpi-contract/SKILL.md@sha256:59a9c12babfd"
---

# CPI: contrato da integração

Transforma exemplos, links, arquivos e uma intenção em um contrato verificável. Não autoriza criação, deploy nem teste em tenant. Para trabalho no próprio Speed Up, siga também `processo-speedup-desenvolvimento`.

## Quando usar

- Antes de criar ou alterar um iFlow.
- Ao revisar uma integração existente cujo comportamento ninguém escreveu.

## Decisão de entrada

Registre de modo compacto:

- objetivo de negócio;
- remetente e destinatário;
- gatilho e protocolo;
- payload de entrada e saída, com exemplos representativos;
- regras de transformação;
- parâmetros por ambiente;
- autenticação por **referência**, nunca o valor secreto;
- volume e tamanho esperados;
- dono de cada ponta.

Diferencie o que veio do usuário, o que a fonte SAP confirma e o que continua hipótese.

Defina explicitamente o que é **sucesso**:
- **fluxo síncrono:** o que a resposta confirma;
- **fluxo assíncrono:** se confirma só a recepção ou persistência, ou o efeito final.

Escolha o nível de entrega e diga como tratar duplicidade, ordem, falha transitória, erro funcional e resultado incerto. Não atribua garantia de ponta a ponta a um adapter isolado. Sem dado essencial, marque `UNKNOWN` e proponha uma decisão; não complete o contrato com valores de tutorial.

O contrato termina em critérios observáveis para dois gates:
- **artefato técnico:** abre no editor, configuração e deploy em DEV quando autorizados;
- **efeito funcional:** entrada real, saída no destino, monitor e falhas.

Postman é só um cliente para uma entrada HTTP; não testa um sender SFTP.

## Com o Speed Up

- **Ancore o contrato no que já existe**, quando houver integração anterior:
  - `sap.cpi.iflow.describe` e `sap.cpi.package.analyze`;
  - `sap.cpi.source.read` para scripts e mapeamentos;
  - `sap.cpi.valuemapping.get` para tabelas de conversão.
- **Esta etapa não grava nada no tenant.** O contrato vira o critério de aceite das skills seguintes.

## Saída esperada

Uma matriz curta `requisito → decisão/risco → como provar`, com as pendências e o dono de cada uma. Use o contrato da WI existente quando houver; não invente WI nem autoridade de escrita.

## Fontes (consultadas em 23/09/2026)

- [SAP Help — Elements of an Integration Flow](https://help.sap.com/docs/cloud-integration/sap-cloud-integration/elements-of-integration-flow): remetente, destinatário, canal e passos são decisões distintas.
- [SAP Help — Quality of Service](https://help.sap.com/docs/cloud-integration/sap-cloud-integration/quality-of-service): a garantia de ponta a ponta depende do desenho, inclusive falhas e duplicatas.
- [SAP Help — Apply the Retry Pattern](https://help.sap.com/docs/cloud-integration/sap-cloud-integration/apply-retry-pattern): as opções de recuperação dependem do contrato de entrega.
