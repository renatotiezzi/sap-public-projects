# GAP XXX / TICKET XXX

## Identificação
- Número:
- Título:
- Cliente:
- Projeto:
- Responsável:
- Status:

## Objetivo
Aguardando informações.

## Resumo funcional
Aguardando documentação.

## Resumo técnico
Aguardando análise.

## Estrutura de pastas
- `01_DOCUMENTACAO/` - EF, README da IA, guia de implementação, decisões técnicas, plano de testes, referências.
- `02_CODIGO/` - código-fonte aprovado. Subpastas por processo funcional quando necessário.
- `03_OBJETOS_ORIGINAIS/` - baseline original (não alterar).
- `03.1_LAST_VERSION/` - versão atual de cada objeto (a fonte da verdade); a correção é aplicada aqui primeiro.
- `04_CORRECOES/` - uma subpasta por correção, espelhando `05_ERROS/`.
- `05_ERROS/` - histórico permanente de erros/dumps. Formato `NN - DD-MM - HHhMM - descrição`.
- `06_RESULTADO_ESPERADO/` - `script_validacao.md` + `cenario_NN_validacao.md` + prints.

## Fluxo end-to-end
1. Baseline importado em `03_OBJETOS_ORIGINAIS/`. Código em `02_CODIGO/`.
2. Requisito lido de `01_DOCUMENTACAO/01_EF/`.
3. Erro recebido -> `05_ERROS/NN - DD-MM - HHhMM - descrição/` (dump + `ERRO.md`).
4. Correção entregue em `04_CORRECOES/NN - DD-MM - HHhMM - descrição/` (mesmo nome).
5. Se surgir novo erro, abrir novo `NN+1` em `05_ERROS/` + `04_CORRECOES/`.
6. Validação em `06_RESULTADO_ESPERADO/`.
7. Código aprovado migra para `02_CODIGO/`. Pasta em `04_CORRECOES/` vira histórico.

## Pendências
- Receber os arquivos da demanda.
- Classificar a documentação.
- Identificar os objetos técnicos.
