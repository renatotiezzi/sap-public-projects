---
mode: agent
description: Registrar a correção correspondente a um erro em 04_CORRECOES mantendo rastreabilidade 1:1
---
# Registrar correção

Registre a correção do erro indicado, mantendo rastreabilidade 1:1.

## Passos

1. Identifique a pasta do erro correspondente em `05_ERROS/`.
2. Crie em `04_CORRECOES/` uma subpasta com **nome idêntico**
   (`NN - DD-MM - HHhMM - descrição`).
3. Adicione dentro dela apenas:
   - O objeto corrigido (`.abap` ou outra linguagem, no padrão de export).
   - E/ou um `.md` de guia para ações que não são código (criar elemento de
     dados, tabela, entrada de customizing, etc.).
4. No cabeçalho do objeto corrigido, adicione a linha de versão:
   `* V<NN> - <AUTOR> - correção NN (DD-MM HHhMM): <descrição>`.

## Regras

- A correção NÃO edita o baseline em `03_OBJETOS_ORIGINAIS/`.
- Não coloque aqui EF, guias de implementação, dump original ou análise.
- Se a correção introduzir novo erro, abra `NN+1` em `05_ERROS/` e
  `04_CORRECOES/`.
- Só propague para `02_CODIGO/` após aprovação/teste.
