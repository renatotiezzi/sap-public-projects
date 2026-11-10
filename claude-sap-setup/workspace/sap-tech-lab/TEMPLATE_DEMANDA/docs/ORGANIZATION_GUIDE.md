# Organization Guide (genérico e portável)

## Objetivo
Padronizar a organização de documentos, código e arquivos de apoio por demanda
(GAP ou Ticket), mantendo isolamento total entre demandas.

## Estrutura padrão de cada demanda
```
GAP_XXX/
  README.md
  01_DOCUMENTACAO/
    01_EF/  02_README_IA/  03_GUIA_IMPLEMENTACAO/
    04_DECISOES_TECNICAS/  05_TESTES/  06_REFERENCIAS/
  02_CODIGO/
  03_OBJETOS_ORIGINAIS/
  04_CORRECOES/
  05_ERROS/
  06_RESULTADO_ESPERADO/
```
Cada pasta tem um `README.md` explicando sua finalidade. O template já traz essas
READMEs prontas.

## Função de cada diretório
- `README.md`: índice/estado da demanda.
- `01_DOCUMENTACAO/`: EF, README da IA, guia de implementação, decisões, testes, referências.
- `02_CODIGO/`: somente código aprovado. Subpastas apenas por processo funcional.
- `03_OBJETOS_ORIGINAIS/`: baseline imutável antes de qualquer alteração.
- `04_CORRECOES/`: uma subpasta por correção, espelhando `05_ERROS/`.
- `05_ERROS/`: histórico permanente de erros/dumps (`NN - DD-MM - HHhMM - descrição`).
- `06_RESULTADO_ESPERADO/`: prova de que as correções funcionam.

## Convenção de nomes
- Demanda: `GAP_<numero>` ou `TICKET_<numero>` (sem variações como `Gap 265`).
- Documentos: nome explícito por finalidade (`EF_GAP_XXX.md`,
  `GUIA_IMPLEMENTACAO_GAP_XXX.md`, etc.). Evitar `documento.md`, `final.md`.

## Como criar uma nova demanda
1. Copiar `templates/GAP_TEMPLATE/` para `GAP_<numero>/` (ou use o script
   `setup-workspace.ps1`).
2. Ajustar o `README.md` da demanda.
3. Colocar arquivos iniciais em `01_DOCUMENTACAO/` e `03_OBJETOS_ORIGINAIS/`.
4. Erros entram em `05_ERROS/`, correções em `04_CORRECOES/`.

## Como classificar erros e correções
1. Erro chega em `05_ERROS/NN - DD-MM - HHhMM - descrição/` (dump + `ERRO.md`).
2. Correção correspondente em `04_CORRECOES/NN - DD-MM - HHhMM - descrição/`
   (nome idêntico), com código e/ou guia `.md`.
3. Após aprovação, o código migra para `02_CODIGO/`.

## Isolamento por demanda
Todo arquivo de uma demanda permanece dentro da pasta dela. Nunca misturar
conteúdo entre demandas nem salvar na raiz.
