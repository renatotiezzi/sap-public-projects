---
name: processo-organizar-projeto
description: "Monta ou reorganiza um projeto no padrão do Speed Up: a pasta com tudo no repositório (README com o índice dos documentos, AGENTS.md com a regra de cada pedido, docs/ e o guia do projeto) e a gestão no board do GitHub (Issues + Projects: cada entrega é uma issue com status, radar e quem precisa agir). Use ao começar um projeto numa pasta, quando o usuário pedir \"organiza o projeto\" ou \"cria o projeto\", ou quando a pasta não tiver board. Não use para registrar o andamento depois de cada pedido: aí é processo-atualizar-projeto."
titulo: "Processo: organizar o projeto (pasta, guia e board)"
area: processo
bundles: []
versao: 3.4.0
ordem: 5
atualizado_em: 2026-10-17
origem:
  - "Sap-Speed-Up/docs/melhorias/2026-10-13-gestao-no-github.md (pedidos do usuário de 12 e 13/10/2026: \"a IA está acima de uma pasta que tem tudo; a skill manda organizar e extrair\"; \"AMBOS têm que existir no GitHub, com o código\")"
  - "Sap-Speed-Up/docs/melhorias/2026-10-16-status-coerente.md (16/10/2026: a versão visual do manual é a que o Speed Up gera do .md; o HTML ao lado obrigava um segundo commit e ficava para trás)"
  - "Sap-Speed-Up/docs/melhorias/2026-10-17-entregue-so-com-tudo-verde.md (17/10/2026: \"fala que foi entregue e nem está tudo verde\"; o selo Entregue só com as tarefas feitas e a fase no fim da trilha, e o board.js fase)"
---
# Processo: organizar o projeto (pasta, guia e board)

A IA trabalha dentro de uma pasta que tem TUDO do projeto: documentos, integrações, payloads, testes, evidências. Organizar é deixar duas coisas prontas, as duas no GitHub: o **projeto** (a pasta, no repositório) e a **gestão** (o board do projeto, com uma issue por entrega). Uma fonte para cada informação: o código e os documentos no repositório; o status, o radar e quem precisa agir no board.

## Quando aplicar

- Começar um projeto numa pasta nova (ex.: `CLIENTE/PROJETO`), ou trazer para o padrão um projeto que já existe.
- O usuário pede "organiza o projeto", "cria o projeto", "o que temos aqui?".
- A pasta não tem board, ou o board parou e não mostra o trabalho real.

## Quando NÃO aplicar

- Registrar o que mudou depois de cada pedido: é `processo-atualizar-projeto`.
- Nunca copie um segredo, uma senha, uma chave ou um token para issue, comentário ou documento. O arquivo fica no repositório privado; o valor não se espalha.
- Não mova nem apague arquivo, e não crie issues em lote, sem mostrar antes ao usuário a lista do que vai mudar.

## Como fazer

1. **Inventarie a pasta inteira**, inclusive o que o `.gitignore` exclui: documentos, integrações (iFlows, scripts), payloads, testes, evidências e histórico. Leia os documentos principais e o histórico do git da pasta.
2. **A pasta, no repositório**, no desenho da skill processo-fonte-unica (o que mora onde, uma fonte para cada informação, o GitHub como backup da pasta):
   - `README.md`: a entrada única. Primeiro o link do board ("Gestão do projeto"), depois o índice dos documentos (documento → do que trata);
   - `AGENTS.md`: a regra de cada pedido (commit citando a issue, a issue em dia, o radar como issue nova, o índice em dia);
   - `docs/`: os documentos, em Markdown (os originais `.docx`/`.pdf` ficam ao lado); cada manual em `.md`, com os passos em caixas e a linha `Entrega: #N` em cada seção (a versão visual é a que o Speed Up gera do `.md` a cada leitura; HTML ao lado só se o projeto o publica fora; skill processo-manual);
   - o guia do projeto (ex.: `docs/GUIA.md`) com as seções `## O que estamos fazendo`, `## Por que`, `## Como funciona`, `## O que já fizemos`, `## O que cadastramos` (passos manuais: onde, o quê, por quê, quando, evidência), `## Decisões` e `## Depende de alguém`.
   Proponha uma estrutura simples só para o que está solto, mostre a lista antes de mover e atualize as referências depois.
3. **A gestão, no GitHub:**
   - um board (GitHub Project) para o projeto; o README do board começa com as linhas `Guia: <link do GUIA.md no GitHub>` e `Pasta: <link da pasta do projeto no GitHub>` (a página do projeto do Speed Up lê as duas);
   - uma issue por entrega, com um ID estável no título (ex.: `PRJ-03-01 — …`), filha da frente a que ela serve (sub-issue): o pai é escolhido pelo escopo, não pelo tipo do artefato (o manual de um fluxo fica na frente do fluxo);
   - o status de cada uma: concluída (só com evidência: o arquivo ou o commit, num comentário), em andamento, pronta para iniciar, pendente, dependência externa (com quem precisa agir);
   - o campo "Fase" no board (Desenho, Construção, Testes em DEV, Homologação, Produção), preenchido em cada entregável com a fase de hoje pelo `node Sap-Speed-Up/tools/board.js fase <projeto> <issue> "<Fase>"`. O entregável que não segue a trilha fica com "N/A" (no board que tem essa opção), e aí só as tarefas dizem se está entregue.
   Mostre ao usuário a lista de issues antes de gravar no GitHub.
4. **Confira:** o board mostra o trabalho real; o README da pasta abre pelo board; nenhum documento importante ficou fora do índice; a página do projeto no Speed Up acha o guia e a pasta.

## Exemplo

Uma pasta de integração tinha mais de mil arquivos, e o board estava parado havia um mês, com 24%. Organizado:
- o README abre pelo board e lista os 11 documentos (integração assíncrona, gravação no HANA, saída standard para o S/4…);
- o board ganhou as 8 entregas de outubro que só existiam na pasta, cada conclusão com o commit que a prova, e foi para 30%;
- o guia guarda os cadastros feitos no sistema de destino e as decisões.

## Contraexemplo

Criar a gestão num arquivo próprio dentro da pasta (um JSON "de status"). O GitHub não mostra board, ninguém é avisado, duas pessoas editando dão conflito, e o arquivo para de ser atualizado sem ninguém perceber.
