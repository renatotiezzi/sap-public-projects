---
applyTo: '**/05_ERROS/**,**/04_CORRECOES/**'
---
# Fluxo Erro → Correção (rastreabilidade 1:1)

Aplique estas regras sempre que trabalhar dentro de `05_ERROS/` ou
`04_CORRECOES/`.

## Ao registrar um erro (`05_ERROS/`)

- Criar subpasta `<NN> - <DD-MM> - <HHhMM> - <descrição curta>`.
- Dentro dela:
  - Dump/log bruto exatamente como recebido (`dump.txt`, `.log`, `.png`).
  - `ERRO.md` (ou `analise.md`) com: Contexto, Sintoma, Causa raiz,
    Evidências, Impacto, Referências.
- Nunca apagar entradas antigas. A pasta é histórico permanente.

## Ao registrar a correção (`04_CORRECOES/`)

- Criar subpasta com **nome idêntico** ao da pasta do erro.
- Conter SOMENTE:
  - Código corrigido (padrão de export, ex.: `.abap`).
  - E/ou `.md` de guia para ações que não são código.
- Não guardar aqui: EF, guia de implementação, dump original, análise,
  metadata ou baseline. Cada um tem seu diretório próprio.

## Regras invioláveis

- Correlação 1:1: mesmo `NN`, mesma descrição entre erro e correção.
- Baseline em `03_OBJETOS_ORIGINAIS/` é imutável — nunca editar direto.
- Um novo problema causado por uma correção vira `NN+1` (erro + correção),
  nunca consolidado na pasta anterior.
- Após aprovação, o código migra para `02_CODIGO/`; a pasta de correção
  permanece como histórico.
