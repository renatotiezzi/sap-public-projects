# Copilot Instructions — Modelo de trabalho (ABAP / GAP / Ticket)

> Este arquivo define, para o GitHub Copilot, o modelo de trabalho deste
> repositório. Ele é genérico e portável: não contém credenciais, URLs
> privadas, dados de cliente ou informações corporativas. Ajuste apenas os
> nomes de placeholder marcados com `<...>`.

## Papel do assistente

Você apoia o desenvolvimento e a manutenção de objetos (ABAP e correlatos)
organizados por demanda (GAP ou Ticket), com forte ênfase em rastreabilidade
entre **erro identificado** e **correção entregue**.

## Regra central de organização

- Cada demanda vive em uma pasta isolada na raiz: `GAP_<numero>` ou
  `TICKET_<numero>`.
- Nunca misturar conteúdo entre demandas diferentes.
- Nunca salvar conteúdo de uma demanda na raiz do repositório.
- O template oficial e única fonte de verdade está em
  `TEMPLATE_DEMANDA/templates/GAP_TEMPLATE/`.

## Automação obrigatória para novas demandas

Sempre que o usuário informar um novo GAP, Ticket, pacote, objetos ABAP,
documentação funcional, dumps, prints ou logs, o assistente deve:

1. Identificar a demanda e definir o nome da pasta raiz (`GAP_<numero>` ou
   `TICKET_<numero>`).
2. Criar automaticamente a estrutura da demanda a partir de
   `TEMPLATE_DEMANDA/templates/GAP_TEMPLATE/`.
3. Classificar os arquivos recebidos por tipo e finalidade.
4. Organizar cada arquivo no local correto da demanda.
5. Preservar integralmente os arquivos originais em
   `03_OBJETOS_ORIGINAIS/` (sem edição destrutiva).
6. Preparar a demanda para análise, desenvolvimento, correção e testes.

## Regras de classificação de arquivos

- Especificação funcional e anexos de requisito ->
  `01_DOCUMENTACAO/01_EF/`
- Resumos, anotações e material de apoio IA ->
  `01_DOCUMENTACAO/02_README_IA/`
- Guias de execução/implantação ->
  `01_DOCUMENTACAO/03_GUIA_IMPLEMENTACAO/`
- Decisões de arquitetura/técnicas ->
  `01_DOCUMENTACAO/04_DECISOES_TECNICAS/`
- Evidências e scripts de teste ->
  `01_DOCUMENTACAO/05_TESTES/` e `06_RESULTADO_ESPERADO/`
- Referências externas -> `01_DOCUMENTACAO/06_REFERENCIAS/`
- Código-fonte aprovado -> `02_CODIGO/`
- Baseline recebido/original (sem alteração) -> `03_OBJETOS_ORIGINAIS/`
- Correções incrementais -> `04_CORRECOES/`
- Dumps/logs/prints e análise de falhas -> `05_ERROS/`

## Estrutura padrão de cada demanda

```
GAP_XXX/
  README.md                 índice/estado da demanda
  01_DOCUMENTACAO/          EF, README da IA, guia, decisões, testes, referências
  02_CODIGO/                somente código-fonte aprovado
  03_OBJETOS_ORIGINAIS/     baseline original, antes de qualquer alteração
  03.1_LAST_VERSION/        versão atual de cada objeto (a fonte da verdade)
  04_CORRECOES/             uma subpasta por correção (espelha 05_ERROS)
  05_ERROS/                 histórico permanente de erros/dumps
  06_RESULTADO_ESPERADO/    provas de que a correção funciona
```

## Fluxo obrigatório erro → correção (NÃO alterar este modelo)

Ao identificar um erro ou receber um dump:

1. **Registrar o erro** em `05_ERROS/<NN> - <DD-MM> - <HHhMM> - <descrição curta>/`.
   - Criar `ERRO.md` (ou `analise.md`) documentando, no mínimo:
     - **Contexto** (execução, usuário, ambiente, entrada).
     - **Sintoma** (o que deveria acontecer × o que aconteceu).
     - **Causa raiz** (com trechos de código relevantes).
     - **Evidências** (outputs, snapshots de tabela, prints).
     - **Impacto** (severidade em produção/teste).
     - **Referências** (arquivos analisados, correção proposta).
   - Anexar o dump/log bruto exatamente como recebido.
2. **Registrar a correção** em `04_CORRECOES/<mesmo nome da pasta do erro>/`.
   - `.abap` (ou outra linguagem) com o objeto corrigido, padrão de export.
   - E/ou `.md` com guia para ações não-código (criar elemento, tabela,
     entrada de customizing, etc.).
3. **Manter rastreabilidade 1:1**: a pasta do erro e a pasta da correção têm
   nome **idêntico** (`NN - DD-MM - HHhMM - descrição`).
4. **Nunca alterar objetos originais** em `03_OBJETOS_ORIGINAIS/` diretamente.
   O baseline é imutável. Toda mudança é registrada como análise (erro) +
   correção.
5. Se uma correção gerar novo erro (regressão/efeito lateral), abrir um novo
   `NN+1` em `05_ERROS/` e a nova correção em `04_CORRECOES/NN+1`. Nunca
   consolidar vários erros numa única pasta.
6. Após aprovação/teste, o código aprovado é propagado para `02_CODIGO/` e a
   subpasta de correção vira histórico.

## Convenção de nomes de erro/correção

Formato: `<NN> - <DD-MM> - <HHhMM> - <descrição curta>`

- `NN`: contador sequencial de dois dígitos por demanda (`01`..`99`). Nunca
  reutilizar número.
- `DD-MM` e `HHhMM`: data/hora do recebimento no fuso configurado (ver abaixo).
  Usa `-` e `h` porque `/` e `:` não são válidos em nomes de pasta no Windows.
- Descrição curta: identificação rápida do problema.

Exemplo: `01 - 25-07 - 13h51 - Dump classe de processamento`.

### Timestamp

Obter data/hora com o fuso do projeto. Exemplo Windows PowerShell:

```powershell
Get-Date -Format "dd-MM HH'h'mm"
```

Fuso de referência padrão deste modelo: `<AJUSTE_SEU_FUSO>` (ex.:
America/Sao_Paulo, UTC-3).

## Versionamento no cabeçalho do objeto corrigido

Ao entregar um `.abap` corrigido, registrar no header um histórico de versão:

```
* V<NN> - <AUTOR> - correção NN (DD-MM HHhMM): <descrição do que mudou>
```

## Validação após correção

- Descrever cenários esperados em `06_RESULTADO_ESPERADO/script_validacao.md`
  (smoke, caminho feliz, cada erro esperado, borda) com base na especificação.
- Registrar cada execução real em `06_RESULTADO_ESPERADO/cenario_NN_validacao.md`
  com data/hora, output capturado e checklist de verificação.

## Segurança

- Nunca escrever credenciais, tokens, senhas ou URLs privadas em código ou docs.
- Sinalizar qualquer credencial hardcoded encontrada.
- Verificar ausência de `BREAK-POINT` / breakpoints e de usuários/senhas fixos
  antes de entregar código.

## Documentação — diferença entre tipos

- **EF**: especificação funcional oficial (requisito recebido). Não alterar.
- **README da IA**: apoio gerado com IA para entendimento/direcionamento. Não
  substitui a EF.
- **Guia de Implementação**: documento técnico do que foi implementado.
