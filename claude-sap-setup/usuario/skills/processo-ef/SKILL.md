---
name: processo-ef
description: "Cria e entrega uma ESPECIFICAÇÃO FUNCIONAL (EF) do projeto no padrão do Speed Up: primeiro as páginas HTML para o usuário entender (o desenho, o AS-IS e o TO-BE, as telas), ele dá o OK, e só então a EF é extraída em PDF pelo motor do documento oficial, que confere o padrão antes. O .md (docs/<frente>/EF_<NOME>.md) é a única fonte. Use sempre que o usuário pedir uma EF, uma especificação funcional, o desenho de um app ou de uma tela para o técnico construir, ou o PDF de uma EF. Não use para manual (passo a passo de execução: processo-manual) nem para o status do projeto."
titulo: "Processo: especificação funcional (EF) do HTML para entender ao PDF para o técnico"
area: processo
bundles: []
versao: 1.2.0
ordem: 8
atualizado_em: 2026-11-06
origem:
  - "Sap-Speed-Up/docs/melhorias/2026-10-23-area-de-ef.md (23/10/2026: \"tem que ter uma area na doc do projeto no speed up de EF, ela tem que estar junto com os manuais\")"
  - "Sap-Speed-Up/docs/melhorias/2026-10-24-padrao-de-ef.md (24/10/2026: \"é fundamental que vc ao terminar transforme isso num padrão do SPEED up; eu vou pedir paginas html PARA eu entender, eu entendo dando ok; gerar a opção de extrair a EF; extrair a EF vai ter que passar por esse motor e garantir a entrega com padrão\")"
---
# Processo: especificação funcional (EF)

Uma EF diz ao técnico o que construir: o processo de hoje, o processo novo, a arquitetura, cada tela e cada campo com a origem dele. Ela nasce para o usuário ENTENDER (as páginas HTML no Speed Up) e sai para o técnico CONSTRUIR (o PDF oficial). O `.md` é a única fonte das duas.

## O fluxo (sempre nesta ordem)

1. **Ler antes de escrever.** Tudo o que a EF afirma vem dos sistemas (pelo Speed Up) ou do código do projeto; o que não foi lido diz "não lido". Nada inventado: papéis, máscaras, requisitos não funcionais só entram se vierem do usuário ou de um documento do projeto.
2. **As páginas para entender.** Escreva o `.md` em `docs/<frente>/EF_<NOME>.md`, ponha no índice do `README.md` da pasta (a página do projeto mostra na área "Especificações funcionais (EF)") e mostre ao usuário a página visual. Use os desenhos do Speed Up: o ```` ```mermaid ```` (`architecture-beta` com os ícones `sap:`), o ```` ```esteira ```` (o AS-IS × TO-BE peça a peça), o ```` ```etapas ````, o ```` ```fluxo ```` e o ```` ```tela ```` (cada tela do app).
3. **O OK do usuário.** Cada ajuste pedido sobe a versão (`Versão X.Y · data` e a linha no histórico). Decisão vira arquivo em `docs/decisoes/` (`tools/decisao.js`).
4. **Extrair a EF.** Com o OK, o botão "Extrair a EF" da página (ou `documentos_exportar` com o `EF_*.md`) gera o PDF oficial: a capa, o controle (aprovação, distribuição, classificação, histórico), o sumário, as seções numeradas, as tabelas e as figuras legendadas e o Termo de Aceite. Antes, a conferência do padrão (`conferirEf`); o que falta bloqueia e volta com a correção. Para conferir à mão: `node Sap-Speed-Up/tools/conferir-ef.js <EF_*.md>`.

## O padrão (o que a conferência exige)

- O topo: o título `# Especificação funcional: <o objeto>`, `Entregável: <ID>` e `Versão X.Y · DD/MM/AAAA`; no fim, `## Histórico de versões` começando pela versão do topo.
- As seções `## N. ...`, nesta ordem:

| Seção | O que diz |
|---|---|
| Identificação | o projeto, o entregável, o objeto, as referências (os documentos e as decisões) |
| Objetivo | o que o objeto resolve e o que fica fora do escopo |
| O AS-IS: o processo atual | **passo a passo numerado**, como a pessoa faz hoje: "1. Acessa a transação `/POSDW/MON0`; 2. Informa a loja e o dia; 3. Confere ... para validar ...", com o que ela usa em cada passo (a transação, a tabela, o relatório) |
| O TO-BE: o processo novo | o mesmo processo com o objeto novo, passo a passo, e o que muda |
| A arquitetura | os componentes, as integrações, de onde vem cada dado (o desenho com os ícones SAP) |
| As telas | cada tela desenhada com o ```` ```tela ```` |
| Os campos de cada tela | para cada tela, a tabela **`| Campo | Origem | Campo técnico | Regra |`**: o rótulo na tela, o sistema de onde vem, o campo exato (o caminho no payload, a propriedade da API, o campo da CDS) e a regra de exibição |
| As regras | as regras de negócio e de exibição |
| Os testes de aceitação | os cenários com o resultado esperado |

- **Os dois tipos de EF.** A de **app** (com telas) segue a tabela acima inteira. A de **interface** (um arquivo, uma RFC, um iFlow: sem tela) troca as telas pelo **mapeamento campo a campo** (`## N. O mapeamento, campo a campo`, a tabela com a coluna da origem) e aceita o "hoje × com o novo" (`## N. O que muda e o que fica`) como o AS-IS e o TO-BE; as regras ficam opcionais. O Speed Up reconhece o tipo sozinho: tem ```` ```tela ```` ou a seção "Telas", é app.
- **As duas ordens de seções.** Além da tabela acima, a conferência aceita a ordem do template de Especificação Funcional e Técnica, para a EF entregue no modelo do cliente: `## Especificação funcional` (com `### Resumo do Desenvolvimento` e `### Definição da Lógica`), `## Especificação técnica` (com `### Descrição do desenvolvimento`), `## Requests` e `## Coding Quality Review`. Tendo as duas primeiras, vale esta ordem; o topo e o histórico valem nas duas. A decisão:  (documento do Speed Up).
- O que falta decidir vai como `[A ESCLARECER: ...]`: não impede a extração, mas aparece na conferência.
- O modelo para começar: [MODELO_EF.md](MODELO_EF.md).

## Quando NÃO aplicar

- Passo a passo para alguém executar num sistema: é o manual (`processo-manual`).
- O status do projeto: é o `docs/STATUS.md` pelo motor.
