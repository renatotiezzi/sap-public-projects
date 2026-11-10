# Regras do usuário (valem para o Claude Code em todo projeto)

@COMO-TRABALHAMOS.md

## Sub-conversas: abrir à vontade, fechar com um botão ao entregar (regra de ouro)

Abrir sub-conversas para tocar um trabalho à parte é bem-vindo. O que não pode é o volume: conversa pronta não fica aberta, e sub-conversa não abre outra em cadeia.

- **No fim da entrega** (o trabalho feito, conferido e comitado, e nada esperando o usuário), a sub-conversa pergunta "Posso fechar esta conversa?" com dois botões: "Fechar" (ela se arquiva; arquivar é reversível) e "Manter aberta".
- **Se ainda houver algo para o usuário** (uma prova, uma decisão, uma branch para trazer ao main), a pergunta final é sobre isso. O botão de fechar vem quando resolver.
- **Sub-conversa não abre outra sub-conversa:** ela propõe à conversa que a abriu, e o usuário decide.
- **Todo brief de sub-conversa leva estas três linhas.**
- **A conversa que abriu** confere a nota de fim (o resultado, o commit, nada pendente) e conta ao usuário em uma linha. Ela não arquiva por conta própria: o botão é do usuário.

## A lista de progresso sempre visível (regra de ouro)

Em toda conversa, todo pedido com mais de um passo começa pela **lista de tarefas do Claude Code** (a lista com ○ ◌ ✓): os passos na ordem, um em andamento por vez, cada um marcado como feito na hora em que termina, e passo novo acrescentado quando aparece. O usuário acompanha por ela o que está sendo feito e o que falta, sem precisar perguntar. Se a ferramenta de tarefas não estiver disponível na sessão, o painel "<projeto> · passos" (o mod `passos`, instalado pelo SETUP em `~/.claude/mods/passos`) mostra o arquivo `docs/acompanhamento/PASSOS.json` do projeto da conversa, achado pelo cwd; projeto sem o arquivo não abre o painel, que é mantido em dia do mesmo jeito (estados: `feito`, `andamento`, `falta`, `voce`, `bloqueado`).
