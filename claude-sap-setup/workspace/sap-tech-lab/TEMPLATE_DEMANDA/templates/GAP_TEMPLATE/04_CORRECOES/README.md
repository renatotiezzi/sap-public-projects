# 04_CORRECOES

Correções entregáveis para cada erro registrado em `../05_ERROS/`.

## Regra 1:1
- Cada erro em `../05_ERROS/` gera UMA subpasta aqui, com nome **idêntico**.
- Se um fix desencadeia novo erro, o novo erro vira `NN+1` em `../05_ERROS/` e a
  nova correção `NN+1` aqui. Nunca consolidar vários erros numa única pasta.

## Nome da subpasta
`<NN> - <DD-MM> - <HHhMM> - <descrição curta>` (igual ao da pasta do erro).

## O que vai dentro (apenas isto)
1. Código corrigido (ex.: `.abap`, padrão de export). Pode haver mais de um
   arquivo quando o mesmo erro exige alterar mais de um objeto.
2. Guia `.md` para ações que não são código (criar elemento de dados, tabela,
   entrada de customizing, etc.).

## O que NÃO vai aqui
- EF, README da IA, guia de implementação, decisões técnicas -> `../01_DOCUMENTACAO/`.
- Dump original, print, análise -> `../05_ERROS/<mesma subpasta>/`.
- Metadata de export e baseline -> `../03_OBJETOS_ORIGINAIS/`.
- Código consolidado -> `../02_CODIGO/` (só após aprovação).
