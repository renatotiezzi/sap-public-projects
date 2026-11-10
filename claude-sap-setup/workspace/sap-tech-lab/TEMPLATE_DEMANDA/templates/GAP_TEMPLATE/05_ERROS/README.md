# 05_ERROS

Histórico permanente de todos os erros/dumps da demanda.

## Nome de cada entrada
`<NN> - <DD-MM> - <HHhMM> - <descrição curta>`

- `NN`: sequencial de dois dígitos por demanda (`01`..`99`). Nunca reutilizar.
- `DD-MM` / `HHhMM`: data/hora do recebimento no fuso do projeto (`-` e `h`
  porque `/` e `:` não são válidos em nomes de pasta no Windows).

## O que vai dentro
- Dump/log bruto exatamente como recebido (`dump.txt`, `.log`, `.png`).
- `ERRO.md` (ou `analise.md`) com: Contexto, Sintoma, Causa raiz, Evidências,
  Impacto, Referências (ver `templates/ERRO_TEMPLATE.md`).

## Ligação com `04_CORRECOES/`
O nome da pasta do erro e o da correção são **idênticos** — rastreabilidade 1:1.

## Regra
- Nunca apagar entradas. Esta pasta é histórico, não área de trânsito.
