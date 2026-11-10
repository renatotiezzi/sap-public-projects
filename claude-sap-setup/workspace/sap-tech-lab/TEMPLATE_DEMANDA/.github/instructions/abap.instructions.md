---
applyTo: '**/*.abap'
---
# Convenções ABAP (versão genérica e portável)

> Modelo de convenções para desenvolvimento ABAP Cloud / ABAP 7.5+ e RAP.
> Genérico: substitua o prefixo `Z<PREFIXO>` pelo prefixo do seu projeto.

## Modernização / Clean Core

- Preferir sintaxe moderna: expressões construtoras (`VALUE`, `NEW`, `CONV`,
  `CAST`, `CORRESPONDING`) e declarações inline (`DATA(...)`, `FIELD-SYMBOL(...)`).
- Evitar sintaxe obsoleta: `MOVE`, `CONCATENATE`, `REFRESH`, SQL antigo,
  `CALL METHOD`.
- Usar apenas APIs liberadas (released) para cloud-readiness.
- SQL moderno e operações de tabela performáticas (evitar SELECT em loop).

## Prefixos de objeto

- Objetos do projeto: `Z<PREFIXO>_*`.
- Classes globais: `ZCL_*`; locais: `LCL_*`; behavior pools: `ZBP_*`.
- CDS: interface `I_*`, consumo `C_*`, projeção `P_*`.

## Nomenclatura de variáveis

- Globais: `GV_*` (variável), `GT*_*` (tabela), `GST_*` (estrutura),
  `GC_*` (constante).
- Locais: `LV_*`, `LT*_*`, `LST_*`, `LC_*`.
- Field-symbols: `<GFS_*>` / `<LFS_*>`.

## Parâmetros de método

- Importing: `iv_*` / `ist_*` / `ita_*`.
- Exporting: `ev_*` / `est_*` / `eta_*`.
- Changing: `cv_*` / `cst_*` / `cta_*`.
- Returning: `rv_*` / `rst_*` / `rta_*`.

## Revisão de segurança (obrigatória antes de entregar)

- Sem usuário/senha/API key hardcoded.
- Sem `BREAK-POINT` ou breakpoints que parem a execução.
- Sem URLs privadas ou dados de cliente no código.
