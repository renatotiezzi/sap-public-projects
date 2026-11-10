---
name: processo-fonte-unica
description: "Garante a FONTE ÚNICA de um projeto: cada informação mora num lugar só, na pasta local do projeto, e todo o resto é gerado dela ou aponta para ela. A pasta local é a fonte (a IA grava ali e faz o commit no mesmo pedido); o GitHub é o backup da mesma pasta, com a mesma estrutura, enviado uma vez por dia; a gestão (status, radar, quem precisa agir) mora no board. Traz o desenho da pasta de um projeto e a conferência antes de encerrar. Use em todo pedido que cria, move, copia ou salva arquivo de um projeto, quando o usuário perguntar onde fica alguma coisa, e ao organizar ou revisar uma pasta. Não use para o andamento no board (processo-atualizar-projeto) nem para o conteúdo de um manual (processo-manual)."
titulo: "Processo: fonte única e o desenho da pasta local"
area: processo
bundles: []
versao: 1.2.0
ordem: 8
atualizado_em: 2026-10-21
origem:
  - "Sap-Speed-Up/docs/melhorias/2026-10-13-fonte-unica-e-pasta-local.md (pedidos do usuário de 13/10/2026: \"TUDO tem que sempre ter uma única fonte de informação\"; \"o desenho da pasta LOCAL tem muita importância, ela tem que estar muito bem desenhada\"; \"a máquina local é sempre a fonte de informação\"; \"AMBOS têm que ter a mesma estrutura, de pasta, arquivos\"; \"atualizar o GitHub NÃO DEVE mudar nada no Speed Up: só garante o backup\")"
---
# Processo: fonte única e o desenho da pasta local

Cada informação de um projeto mora num lugar só. Quem precisa dela lê dali. O que mostra a mesma informação em outro formato (o HTML de um manual, a página do projeto, um resumo) é gerado da fonte e nunca é editado à mão. Duas cópias da mesma coisa sempre divergem: uma é atualizada, a outra fica para trás, e ninguém sabe qual vale.

## Quando aplicar

- Todo pedido que cria, move, copia ou salva um arquivo de um projeto.
- O usuário pergunta onde fica alguma coisa, ou acha a mesma informação em dois lugares.
- Ao organizar uma pasta (com processo-organizar-projeto) ou ao revisar uma que cresceu sem desenho.

## Quando NÃO aplicar

- O andamento de cada pedido no board (commit citando a issue, status, radar): é processo-atualizar-projeto.
- O conteúdo e a versão de um manual: é processo-manual. Esta skill diz onde ele mora e o que é gerado dele.

## A regra

- **A pasta local é a fonte.** O que a IA faz num projeto, ela grava na pasta do projeto, nesta máquina, e faz o commit no mesmo pedido. O Speed Up lê a pasta local: o que acabou de ser gravado aparece na hora.
- **O GitHub é o backup da mesma pasta.** É o mesmo repositório, com a mesma estrutura de pastas e arquivos. O Speed Up envia uma vez por dia, ou na hora pelo "Enviar agora". Enviar ou não enviar não muda nada no que o Speed Up mostra. O backup serve para não perder nada se a máquina parar e para abrir o projeto em outra máquina.
- **A gestão mora no board do projeto, no GitHub** (Issues + Projects): status, radar, fase e quem precisa agir. É a única informação do projeto que não está na pasta, e a pasta não guarda cópia dela: o README só aponta para o board.
- **Tudo do projeto vai para o repositório privado**, inclusive o confidencial e os segredos, numa pasta própria do projeto. O segredo nunca é copiado para issue, comentário, documento, mensagem de commit ou log.

## Onde mora cada coisa

| Informação | A fonte | O que sai dela (gerado ou apontado) |
|---|---|---|
| O que é o projeto, por quê, como funciona, decisões, o que cadastramos nos sistemas | o guia, `docs/GUIA.md` | a página do projeto no Speed Up |
| Status, radar, fase, quem precisa agir | o board do projeto (uma issue por entrega) | a página do projeto; o README aponta para o board |
| Um manual e o estado de cada passo | o `.md` do manual, com as caixas `- [ ]` e `- [x]` | o HTML ao lado (gerado do `.md`), a página do projeto |
| Os outros documentos | o `.md` em `docs/`, com o original `.docx` ou `.pdf` ao lado | o índice do README aponta, não copia |
| Um cenário de teste | o `.md` em `testes/cenarios/<grupo>/` (processo-cenario-de-teste) | o resultado de cada execução em `testes/resultados/` (gerado), o status de cada frente |
| Código, integrações, payloads | a pasta do projeto | o que está implantado nos sistemas sai dela |
| Segredos e confidenciais | a pasta do projeto, no repositório privado | nada: ninguém copia |
| A regra do trabalho | `CLAUDE.md` (o espaço de trabalho) e `AGENTS.md` (o projeto) | — |

## O desenho da pasta

```text
<espaço de trabalho>/            ← a pasta local: um repositório, com o backup no GitHub
├── CLAUDE.md                    ← a regra do espaço, para todos os projetos
├── <CLIENTE>/<PROJETO>/         ← um projeto: tudo dele aqui dentro
│   ├── README.md                ← a entrada: o link do board e o índice dos documentos
│   ├── AGENTS.md                ← a regra de cada pedido, para a IA
│   ├── docs/                    ← os documentos: o .md é a fonte; o .html gerado fica ao lado
│   │   └── GUIA.md              ← o guia do projeto
│   ├── <artefatos>/             ← o que roda: integrações, scripts, serviços (uma pasta por tipo)
│   ├── testes/                  ← os cenários de teste (cenarios/<grupo>/<ID>-<assunto>.md), o índice README.md e os resultados gerados (processo-cenario-de-teste)
│   └── segredos/                ← credenciais e documentos confidenciais (o repositório é privado)
└── <produto>/                   ← um produto (por exemplo, o próprio Speed Up), com o desenho dele
```

- **Um projeto, uma pasta.** Tudo do projeto fica dentro dela. Nada do projeto mora na Área de Trabalho, em Downloads, na pasta temporária ou solto no OneDrive.
- **Um lugar para cada tipo.** Não crie uma segunda pasta para o mesmo tipo (`docs/` e `documentos/`, `testes/` e `teste-novo/`). Se o projeto já tem a pasta daquele tipo com outro nome, use a que existe.
- **O nome diz o que é, sem versão nem data** (`MANUAL_CONEXAO.md`, nunca `MANUAL_CONEXAO_final_2.md`). A versão mora dentro do arquivo (processo-manual) e o histórico mora no git.
- **Um projeto que já existe mantém os nomes que tem.** A conferência aponta o que está fora do desenho. Mover só depois de mostrar a lista ao usuário, e as referências são atualizadas em seguida.

## O modelo de projeto (desde 21/10/2026)

A árvore de dentro do projeto é um **dado do Speed Up**, versionado: o modelo `speedup-projeto` (`packages/core/src/project/modelo-de-projeto.ts`). Ele define:
- as pastas (`docs/`, `docs/decisoes/`, `docs/evidencias/`, `funcional/`, `tecnico/` com `abap/`, `cpi/` e `cap/` por papel, `plano/itens/`, `testes/` e `segredos/`);
- o que mora em cada uma e quais papéis escrevem nela;
- os arquivos obrigatórios.

O README do projeto diz a versão que segue: `Modelo: speedup-projeto 1`.

- **Projeto novo:** `node Sap-Speed-Up/tools/projeto-novo.js "<pasta>" --titulo "…" [--cliente "…"] [--papeis abap,cpi,cap]`. Nasce com tudo, inclusive o README de cada pasta e o bloco do modelo no `AGENTS.md`.
- **Projeto que já existe:** `node Sap-Speed-Up/tools/projeto-migrar.js "<pasta>"` mostra o plano. Com `--aplicar`:
  - cria só o que falta;
  - acrescenta a linha do modelo ao README;
  - põe o bloco do modelo no `AGENTS.md` sem tocar no resto.

  As pastas fora do modelo só são listadas, com o destino sugerido: mover é decisão do usuário.
- **A conferência** (`conferir-fonte-unica.js`) cobra a árvore da pasta que adotou o modelo.
- **Onde gravar:** antes de criar um arquivo, pergunte ao motor de .md. Pela ferramenta `projeto_contexto` com `gravar`, ou por `node Sap-Speed-Up/tools/contexto.js "<pasta>" "<assunto>" --gravar "<o que vai produzir>"`. A resposta é um lugar só, com o comando quando há.

## Como fazer, em todo pedido

1. **Antes de criar, procure.** Se o arquivo, a pasta ou a informação já existe, atualize lá. Nunca crie uma cópia "para não mexer no original": o git guarda o original.
2. **Grave no lugar do desenho**, na pasta do projeto, e faça o commit no mesmo pedido, citando a issue (processo-atualizar-projeto).
3. **O que é gerado sai da fonte.** O HTML de um manual, uma página ou um resumo saem do `.md` ou do board e nunca são editados à mão. Se alguém marcou algo numa vista (uma página ou uma tela), grave na fonte.
4. **Nenhum estado fora da fonte.** Progresso, status e escolha do usuário nunca ficam só no navegador, na página publicada, num JSON de status ou na conversa. Eles vão para o `.md` ou para o board.
5. **Confira antes de encerrar** (abaixo) e corrija o que for desta entrega. O que já estava fora da regra vira issue no board, sob o entregável a que serve.

## A conferência

O Speed Up tem a conferência pronta: `node tools/conferir-fonte-unica.js "<pasta do projeto>"`, rodado no repositório do Speed Up. Sem ela, confira à mão. Ela aponta:
- **Manual em HTML sem o `.md` ao lado**, ou com versão diferente da do `.md`. O HTML está desatualizado: gere de novo.
- **Manual `.md` sem a versão no topo ou sem caixas de marcar.** O estado dos passos está em outro lugar.
- **Documento de `docs/` fora do índice do README.** A navegação dos manuais não o acha.
- **O mesmo conteúdo em dois arquivos do projeto.** Fique com um só e aponte para ele.
- **Nome de cópia** (`final`, `cópia`, `copy`, `(1)`, `backup`, `old`) fora da pasta de histórico.
- **Arquivo de status dentro da pasta** (`projeto.json`, `status.json`, `PROJECT_STATE.json`). A gestão mora no board.
- **O cenário de teste fora do padrão** (19/10/2026): fora do formato, fora de `testes/cenarios/<grupo>/<ID>-<assunto>.md`, com o ID repetido ou fora do índice `testes/README.md` (processo-cenario-de-teste).

## Exemplo

Os passos de um manual foram feitos na conversa. A IA marcou cada um no `.md` (data, quem, prova) e fez o commit. A página do projeto no Speed Up, que lê a pasta local, mostrou "12 de 21 passos feitos" na hora, antes de qualquer envio ao GitHub. O HTML do manual foi gerado de novo a partir do `.md`.

## Contraexemplo

Os passos de um manual foram marcados na página publicada do manual, que guardava o progresso na nuvem dela. O `.md` não sabia de nada, e a página do projeto, que lê o `.md`, mostrava o manual parado. Eram duas fontes, e a que todos liam estava atrasada.

Outro, também real: a página do projeto lia o guia do GitHub, e não da pasta. O que a IA acabava de escrever só aparecia depois do envio. A pasta local era a fonte, e a página lia o backup.
