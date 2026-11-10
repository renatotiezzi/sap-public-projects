---
name: processo-double-check
description: "O DOUBLE CHECK de um projeto, de tempo em tempo: confronta o que estava pendente no board com o que foi entregue na pasta (commits, passos de manual, comentários) e deixa o board dizendo o que aconteceu. Roda a conferência (board.js auditar), julga cada caso lendo a evidência, acerta o status SÓ pelo caminho único (board.js status), abre a issue da entrega que não tem uma e relata o que é de arquivo para a conversa do projeto. Use no job agendado de double check, ou quando o usuário pedir para conferir se o board está em dia com o que foi entregue. Não edita arquivo da pasta, não faz push, não toca em sistema."
titulo: "Processo: o double check do projeto (o board contra o que foi entregue)"
area: processo
bundles: []
versao: 1.3.0
ordem: 9
atualizado_em: 2026-10-17
origem:
  - "Sap-Speed-Up/docs/melhorias/2026-10-16-status-coerente.md (pedido do usuário de 16/10/2026: \"de tempo em tempo você dispara um job... o job seria um double check: ele vai varrendo o projeto, e garantindo que o que está entregue está atualizado\")"
  - "Sap-Speed-Up/docs/melhorias/2026-10-17-entregue-so-com-tudo-verde.md (17/10/2026: \"fala que foi entregue e nem está tudo verde\"; o selo Entregue só com as tarefas feitas e a fase no fim da trilha, e o board.js fase)"
---
# Processo: o double check do projeto

A regra de cada pedido (skill processo-atualizar-projeto) e a trava do fim de resposta pegam o que acontece na resposta. O que escapa entre as respostas, e o que precisa de julgamento, fica para o double check. De tempo em tempo, ele varre o projeto, confronta o que estava pendente com o que foi entregue e deixa o board dizendo o que aconteceu. A página do projeto lê o board: com o board em dia, ela mostra a verdade.

## Quando aplicar

- No job agendado de double check: uma tarefa agendada que roda esta skill para cada projeto da tabela do `CLAUDE.md` do repositório.
- Quando o usuário pedir para conferir se o projeto está em dia ("a página não bate", "faz um double check").

## Quando NÃO aplicar

- No meio de um pedido que muda o projeto: ali vale a processo-atualizar-projeto, e o status muda na mesma resposta.
- Para editar arquivos da pasta (manual, README, guia): o double check só relata, e quem edita é a conversa do projeto. Dois escritores na mesma fonte se atropelam.
- Nunca faça push, nunca toque num sistema SAP e nunca copie um segredo, uma senha ou um token para issue ou comentário.

## Como fazer

Para cada projeto (o número do board e a pasta estão na tabela do `CLAUDE.md`):

1. **As regras do projeto:** leia o `AGENTS.md` da pasta. Ele diz quem pode concluir uma entrega e os nomes do Status daquele board (veja "Os nomes de cada board", abaixo).
2. **A conferência:** rode `node Sap-Speed-Up/tools/board.js auditar <projeto>` e `node Sap-Speed-Up/tools/board.js conferir <projeto>`, e guarde os achados. O `auditar` já conta o commit que cita a issue sozinha ou com mais uma, e não volta a acusar o que tem um "visto" (passo 5) sem trabalho novo depois.
3. **O que a regra não vê:** liste as issues do radar (Pendente, Pronto para iniciar, Backlog, Ready) e as em andamento. Para cada uma, procure a evidência de entrega:
   - os commits da pasta que falam dela, pelo ID (a chave inteira, como `PRJ-05-03`) ou por `Refs #N`/`Closes #N`, nunca por um "#8" solto, que costuma ser outra coisa;
   - os comentários das issues vizinhas, porque a issue guarda-chuva costuma guardar o avanço de outras;
   - os passos `[x]` dos manuais que tratam do mesmo assunto (o passo diz "feito em", "conferido em" ou "provado em" com a data).
4. **Julgue cada caso** com a evidência na mão:
   - recebeu trabalho e está no radar: "Em andamento";
   - a entrega terminou, com prova (o teste passou, o documento existe, o passo foi feito com a evidência): o Status de concluído que o `AGENTS.md` deixa quem entrega pôr (veja abaixo);
   - espera alguém: o Status de espera do board, dizendo quem e o quê;
   - estava em validação e a prova real achou defeito: volta para "Em andamento", com a evidência do defeito;
   - o achado é falso (foi só uma menção, o comentário só explicou, a espera continua): nada muda, e marque o "visto" (passo 5).

   Na dúvida, não mude: ponha a pergunta no relatório. A Fase do entregável (Desenho, Construção, Testes em DEV, Homologação, Produção) só muda quando o guia do projeto tem o critério escrito; sem critério, é pergunta. O achado `fase-em-aberto` (as tarefas acabaram e a Fase não chegou ao fim da trilha; a página mostra "Fase em aberto", nunca "Entregue") é sempre um destes: a Fase ficou para trás (mude pelo `board.js fase`, com o critério do guia), ou falta a tarefa das fases seguintes (abra pelo `board.js criar`).
5. **Acerte o board só pelo caminho único** (`--ensaio` em qualquer um deles diz o que faria, sem escrever):
   - o Status: `node Sap-Speed-Up/tools/board.js status <projeto> <issue> "<Status>" --evidencia "<o commit, o arquivo ou o comentário que prova>"`. Nunca feche a issue nem mude o Status por fora;
   - a Fase do entregável: `node Sap-Speed-Up/tools/board.js fase <projeto> <issue> "<Fase>" --evidencia "<o critério do guia e a prova>"`. Nunca mude a Fase por fora;
   - o "visto", quando você conferiu e nada muda: `node Sap-Speed-Up/tools/board.js visto <projeto> <issue> --nota "<o que foi conferido e por que nada muda>"`. Ele comenta a nota com a marca do double check, e a conferência só volta a acusar a issue com trabalho novo depois dele. Sem o visto, o mesmo achado volta a cada rodada.
6. **A entrega sem issue:** a issue guarda-chuva (o achado `guarda-chuva`) tem entregas dentro dela.
   - **Como repartir:** pelas entregas que o `AGENTS.md` da pasta nomeia; sem isso, pelas seções do manual que a guarda-chuva acompanha (uma entrega por resultado que alguém aceita: o lançamento, os pagamentos, a confirmação). Na dúvida, pergunte.
   - Abra a issue de cada entrega sob o mesmo pai, só pelo caminho único: `node Sap-Speed-Up/tools/board.js criar <projeto> --pai <issue do pai> --titulo "<a entrega>" --status "<Status>" --corpo "<o que é e o aceite>" --evidencia "<a prova>"`. Ela recusa a entrega que já existe sob o pai e dá o próximo ID livre (quando os filhos não continuam a chave do pai, passe `--id`).
   - A guarda-chuva fica com a entrega original dela: o título volta para o nome dessa entrega (`gh issue edit <n> --repo <dono/repositório> --title "<ID> — <a entrega>"`), e o Status segue a evidência só dela (o que passou para as novas sai da conta).
   - Feche a separação com o visto na guarda-chuva, que serve de comentário com os links: `board.js visto <projeto> <n> --nota "separada em #a, #b e #c; esta fica com <a entrega original>"`. A conta da guarda-chuva recomeça dali.
7. **O que é de arquivo vira relatório, não edição:** o manual fora do padrão, a linha `Entrega: #N` que falta numa seção, o índice ou o guia com estado. Diga o arquivo, o que falta e a issue a que ele serve.
8. **Confira:** `board.js conferir` sem divergência, e `board.js auditar` só com o que foi relatado.
9. **O relatório**, curto:
   - a versão desta skill que você seguiu;
   - o que mudou no board: a issue, de que Status para qual, e a evidência;
   - as issues abertas e os vistos;
   - o que ficou para a conversa do projeto (arquivos);
   - o que precisa do usuário (as perguntas).

## Os nomes de cada board

O `board.js` aceita o nome em português nos dois boards e usa a opção do board com o mesmo sentido ("Em andamento" vira "In Progress" no board em inglês). O que muda de um projeto para outro é QUEM conclui e o nome da espera, e quem diz é o `AGENTS.md` da pasta:

| | Board em português (ex.: um projeto de cliente) | Board em inglês (ex.: o do Speed Up) |
|---|---|---|
| Em andamento | Em andamento | In Progress |
| Terminou, com prova | Concluído com evidência | Validation (só o revisor põe Done) |
| Espera alguém | Dependência externa | Blocked |
| No radar | Pendente, Pronto para iniciar | Backlog, Ready |

Se o `AGENTS.md` diz que só o revisor conclui, o job põe a entrega pronta em validação, nunca em concluído.

## Exemplo

O job das 14h olha a integração de um sistema de loja com o S/4. A issue do teste ponta a ponta está "Pendente", mas o manual do lançamento tem a loja piloto lançada e o teste feito em 15/10, e os comentários da issue guarda-chuva contam o mesmo. O job:
- muda a issue do teste para "Em andamento", com a evidência (o commit do manual e o comentário);
- abre "Lançamento das vendas no S/4" e "Pagamentos" sob a mesma frente, com os links;
- volta o título da guarda-chuva para o nome da conexão;
- relata: "o manual do lançamento não tem `Entrega: #N` nas seções; a conversa do projeto põe".

## Contraexemplo

O job "arruma" tudo para "Concluído" porque os commits são muitos, sem a prova da entrega. O board passa a errar para o outro lado, e a página mostra como entregue o que ninguém testou. Sem prova, o máximo é "Em andamento".

Outro: o job edita o manual para pôr as linhas `Entrega:` enquanto a conversa do projeto edita o mesmo arquivo. Por isso o double check só relata o que é de arquivo.
