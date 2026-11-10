---
name: processo-atualizar-projeto
description: "Ao fim de TODO pedido que muda um projeto (código, configuração num sistema, teste, documento, decisão), deixa a gestão em dia no GitHub: o commit cita a issue da entrega, a issue ganha o status e um comentário com a evidência, o que entrou no radar vira issue nova no board, e o documento novo entra no índice do README da pasta. Use sempre que a pasta de trabalho, ou uma acima dela, tiver um README ou AGENTS.md com o board do projeto. Não use para montar o projeto do zero: aí é processo-organizar-projeto."
titulo: "Processo: atualizar o projeto a cada pedido"
area: processo
bundles: []
versao: 3.6.0
ordem: 6
atualizado_em: 2026-10-17
origem:
  - "Sap-Speed-Up/docs/melhorias/2026-10-13-gestao-no-github.md (pedidos do usuário de 13/10/2026: \"AMBOS têm que existir no GitHub, com o código\"; \"cada prompt novo que eu vou dando vai atualizando o projeto\")"
  - "Sap-Speed-Up/docs/melhorias/2026-10-16-status-coerente.md (16/10/2026: \"o Speed Up precisa garantir que tudo que for sendo gerado, ele acompanhe e gere um status coerente\")"
  - "Sap-Speed-Up/docs/melhorias/2026-10-17-entregue-so-com-tudo-verde.md (17/10/2026: \"fala que foi entregue e nem está tudo verde\"; o selo Entregue só com as tarefas feitas e a fase no fim da trilha, e o board.js fase)"
---
# Processo: atualizar o projeto a cada pedido

O usuário trabalha por prompts. O projeto mora no repositório (a pasta, com o código e os documentos em `docs/`); a gestão mora no board do GitHub (Issues + Projects): cada entrega é uma issue, com o status, o radar e quem precisa agir. Esta skill fecha cada pedido com as duas coisas em dia. Foi por pular este passo que um projeto real apareceu em 24% quando estava em 30%: o trabalho existia, o board não sabia.

## Quando aplicar

- Ao terminar QUALQUER pedido que muda o projeto: código, iFlow, configuração num sistema, teste, documento, decisão, descoberta.
- Quando o Speed Up mostrar que o board ficou atrás da pasta ("o que o GitHub ainda não sabe").

## Quando NÃO aplicar

- Pergunta que não muda nada no projeto (só leitura, explicação).
- Montar o projeto do zero ou reorganizar a pasta: é `processo-organizar-projeto`.
- Nunca copie um segredo, uma senha, uma chave ou um token para issue, comentário ou documento. O arquivo que o contém fica no repositório privado; o valor não se espalha.

## Como fazer

1. **Ache o board:** o `README.md` ou o `AGENTS.md` da pasta do projeto (ou da primeira pasta acima) tem o link do board. Cada entrega tem um ID estável no título da issue (ex.: `PRJ-03-01 — …`).
2. **Commit citando a issue da entrega em que você TRABALHOU:** `Refs #63` enquanto a entrega anda; `Closes #63` quando ela termina com evidência. Cite só a(s) issue(s) que o commit move; a issue relacionada vai no texto, não no `Refs` (a conferência e a trava de fim de resposta leem o `Refs` como trabalho).
3. **A issue em dia**, sempre pelo caminho único (a seção "O status" abaixo):
   - o status no board: em andamento, pronto para iniciar, pendente, dependência externa (diga quem), concluído, descartado;
   - um comentário com a evidência: o arquivo, o commit ou a execução, com o resultado;
   - concluída só com evidência; sem ela, a entrega continua em andamento;
   - quando o entregável (a frente) muda de fase, o campo "Fase" dele no board, pelo caminho único: `node Sap-Speed-Up/tools/board.js fase <projeto> <issue> "<Fase>" --evidencia "<o motivo>"` (Desenho, Construção, Testes em DEV, Homologação, Produção). É o que a página do projeto mostra em cada cartão, e ela só diz "Entregue" com as tarefas feitas E a fase no fim da trilha: o entregável que fecha com a fase no meio aparece como "Fase em aberto". Ao fechar um entregável, leve a Fase até onde ele chegou.
4. **O radar:** o que surgiu no pedido vira issue nova no board, sob o pai certo (a frente), com o status e o motivo, pelo caminho único: `node Sap-Speed-Up/tools/board.js criar <projeto> --pai <issue da frente> --titulo "<a entrega>" --status "<Status>" --evidencia "<o motivo ou a prova>"`. Ela abre a issue como sub-issue do pai, põe no board com o Status, dá o próximo ID livre sob o pai e recusa a entrega que já existe. O que travou numa pessoa fica em "dependência externa", com quem precisa agir.
5. **Os documentos:** documento novo ou mudado entra no índice do `README.md` da pasta, com uma descrição do que ele é, sem versão nem estado (a página do projeto mostra a versão e o progresso lendo o `.md`). Manual sai em `.md`; a versão visual é a que o Speed Up gera dele a cada leitura (skill processo-manual). Passo manual feito num sistema (onde, o quê, por quê, quando, evidência) e decisão (o quê, por quê, quem) entram no guia do projeto; o guia conta o que foi feito e decidido, sem repetir o estado das entregas (o que falta, o que está em andamento, "faltam…"): isso é o board, e no guia envelhece a cada passo.
6. **Confira a integridade** (a seção abaixo) antes de dizer que terminou.

## O trabalho vira status (16/10/2026)

Num projeto real (16/10/2026), 62 de 93 commits citaram a mesma issue, o avanço foi parar no título dela e nos comentários, e a issue do teste ponta a ponta ficou "Pendente" com o teste feito. A página mostrou a frente parada. Por isso:

- **Trabalhou numa issue que está no radar** (Pendente, Pronto para iniciar, Backlog): na MESMA resposta, `node Sap-Speed-Up/tools/board.js status <projeto> <issue> "Em andamento" --evidencia "<o que foi feito>"`.
- **Uma issue por entrega.** Surgiu uma entrega nova no meio do trabalho (o lançamento, os pagamentos, a confirmação)? Abra a issue dela sob o mesmo pai com `board.js criar` (o ID é o próximo livre) e cite essa. Nada de issue guarda-chuva.
- **O título diz a entrega, nunca o estado.** "S/4 QAS: AIF e bindings feitos; faltam…" envelhece a cada passo; o estado vai no Status e a evidência no comentário.
- **O passo do manual diz a que entrega serve** (`Entrega: #N` na seção; skill processo-manual): é assim que o passo feito move a entrega certa.
- **Antes de encerrar:** `node Sap-Speed-Up/tools/board.js auditar <projeto>`. Ela cruza o trabalho da pasta (commits, passos de manual, títulos, manuais) com o board e diz o que não andou, com o comando para acertar. A trava de fim de resposta (o hook do Git_HUB) faz o mesmo para as issues que os commits da resposta citaram, e o job de double check (skill processo-double-check), quando ligado, faz para o projeto inteiro de tempo em tempo.

## O status: o que cada um quer dizer e o caminho único

O status de uma entrega é o que a página do projeto conta. Ele só é certo quando o campo Status do board e a issue dizem a mesma coisa:

| Status | A issue | Conta como |
|---|---|---|
| Concluído (com evidência) | fechada como **concluída**, com o comentário da evidência | feita |
| Concluído sem evidência suficiente | fechada como concluída | feita, sem evidência |
| Descartado, Duplicado ou obsoleto, Cancelled | fechada como **não planejada** | fora da conta |
| Em andamento, Pronto para iniciar, Pendente, Bloqueado, Dependência externa, Decisão necessária | **aberta** | o que o nome diz |

- **Mude o status só por** `node Sap-Speed-Up/tools/board.js status <projeto> <issue> "<Status>" --evidencia "<o arquivo, o commit ou a execução>"`. Ela grava a evidência, abre ou fecha a issue com o motivo certo, põe o Status e relê depois da automação do GitHub, que troca o Status para concluído quando a issue fecha (também como não planejada), corrigindo o que ela trocar.
- **Nunca** feche a issue nem mude o campo Status por fora (`gh issue close`, a tela do GitHub, um script próprio): a automação desfaz, e o board passa a dizer uma coisa e a issue outra.
- **Depois de gravar**, rode `node Sap-Speed-Up/tools/board.js conferir <projeto>` e corrija, pelo mesmo caminho, o que não bater. A página do projeto mostra o mesmo no topo ("O que não bate no board"), com as mesmas regras.

## Integridade: confira sempre

- **O pai certo:** a entrega nova vai sob o entregável a que ela serve (o resultado que ela ajuda a entregar), não sob o tipo do artefato. O manual, o teste ou o ajuste de um fluxo vão na frente do fluxo, não numa frente de "documentação" ou de "testes". Na dúvida entre dois pais, pergunte ao usuário antes de criar.
- **Sem duplicar:** antes de criar uma issue, procure no board pelo assunto e pelos IDs vizinhos. Se ela já existe, atualize-a.
- **O ID:** o próximo livre sob o pai (o último filho mais um), nunca reaproveitado; o título começa pelo ID. O `board.js criar` calcula quando os filhos continuam a chave do pai (PRJ-05-07 → PRJ-05-08); quando não continuam (uma família própria, como SU-WI-049), passe `--id`.
- **O pai acompanha os filhos:** uma tarefa nova num entregável concluído o reabre. Antes, confira se ela é mesmo dele.
- **Depois de gravar:** a issue está no board, sob o pai certo, com o status certo e, no entregável, a fase certa; `board.js conferir` não acha nada que não bata; o commit cita a issue; nenhum arquivo do pedido ficou sem registro (numa issue, no índice ou no guia).
- **A fonte única** (skill processo-fonte-unica): nada do pedido virou cópia; o que é gerado saiu da fonte (o HTML do manual, do `.md`); nenhum estado ficou fora do `.md` ou do board. Rode a conferência da pasta e corrija o que for desta entrega; o que já estava fora da regra vira issue.

## Exemplo

O pedido foi "corrige a unidade de medida do pedido do e-commerce". Ao fim:
- o commit diz `Refs #148`;
- a issue `PRJ-03-10-02` continua em "dependência externa" (o de-para de pagamentos é do funcional), com um comentário que cita a versão nova e o documento da integração;
- o guia ganha, em "O que cadastramos", o parâmetro configurado no CPI DEV;
- o índice do README já tinha o documento; nada a acrescentar.

## Contraexemplo

Terminar o pedido sem tocar no board. O trabalho existe na pasta, mas a gestão continua dizendo o de ontem; depois de alguns dias, o percentual não é real e ninguém sabe o que falta.

Outro, real (14/10/2026): três issues obsoletas foram fechadas como não planejadas, com o Status "Duplicado ou obsoleto" posto antes. A automação do board trocou o Status para "Concluído com evidência" no fechamento, e a página contou a frente como "4 de 10" quando o real era "3 de 9". Com `board.js status`, o Status é posto de novo depois da automação, e a conferência acha o que escapar.

Outro, real (13 a 16/10/2026): na integração de um sistema de loja com o S/4, quase todo commit citou a mesma issue, que virou guarda-chuva da conexão, do lançamento, dos pagamentos e da confirmação; o avanço foi parar no título dela ("…a loja piloto lançou; faltam…") e em dez comentários, e a issue do teste ponta a ponta com confirmação ficou "Pendente" com o teste feito. A página mostrou "3 de 9 tarefas". Com uma issue por entrega, o `Refs` só da issue trabalhada e o status mudado na mesma resposta, o board conta o que aconteceu.

Outro, real: a tarefa "versão HTML dos manuais do inbound" foi criada na frente de documentação, pelo tipo do arquivo. O entregável de documentação, já entregue, voltou a "em andamento", e a página do projeto mostrou a tarefa no lugar errado. O pai certo era a frente do inbound, a que os manuais servem.
