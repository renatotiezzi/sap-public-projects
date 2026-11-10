---
name: processo-cenario-de-teste
description: "O cenário de teste do projeto e o status dele: a fonte é o BANCO do Speed Up, por projeto, e a busca e a escrita são pela API projeto_cenarios (primeiro o mapa por grupo; depois o cenário, propor e validar), nunca pelo .md. Traz o formato do cenário (o front matter, as cinco seções e o bloco ```cenario com os passos e os asserts), o status calculado pelo motor (passed, failed, broken) e o histórico. Use ao criar, mudar ou revisar um cenário, ao montar os testes de uma frente (Inbound, CPI, HANA, CAP, as descidas ao S/4) e quando o usuário perguntar como uma frente está ou como provar que está ok. Não use para o manual de um passo feito à mão num sistema (processo-manual)."
titulo: "Processo: o cenário de teste e o status, pela API do banco"
area: processo
bundles: [cpi, adt, hana, cap]
versao: 2.2.0
ordem: 11
atualizado_em: 2026-10-22
origem:
  - "Sap-Speed-Up/docs/decisoes/2026-10-22-os-cenarios-de-teste-e-os-resultados-moram-no-banco-do-speed.md (o usuário, 22/10/2026: \"esse md deveria ir pra dentro do banco… deixar claro nas skills que a busca por cenário é via API… chama uma primeira pra ter o mapa de cenários… projeto é chave\"; SU-WI-167 #434). Substitui a de 19/10 (cenários em .md)."
  - "Sap-Speed-Up/docs/decisoes/2026-10-19-os-cenarios-de-teste-do-projeto-moram-em-md-os-resultados-em.md, 2026-10-19-o-motor-de-testes-do-projeto-o-speed-up-desenha-o-mod-pilota.md e 2026-10-19-projetos-do-github-como-referencia-estudar-sem-copiar.md (pedido do usuário de 19/10/2026: \"vai ser tipo uma collection postman, vc define o que gostaria de rodar e roda tudo automatico\"; \"é fundamental ele criar os cenários de testes que garanta que está tudo ok\"; SU-F36 #326, SU-WI-102 #327)"
  - "Sap-Speed-Up/docs/decisoes/2026-10-19-revisar-a-cobertura-dos-testes-um-botao-no-mod-e-no-speed-up.md (o usuário: \"o projeto é algo vivo\"; \"um botão no MOD e no Speed Up (mesma fonte)\"; SU-WI-109 #358)"
---
# Processo: o cenário de teste e o status, pela API do banco

**A fonte é a pasta do projeto, e a porta é a ferramenta.** O cenário (a regra) e cada resultado (calculado pelo motor no SAP) são arquivos da pasta, que sincronizam com a equipe; o banco do Speed Up é o índice refeito deles, separado por projeto. A IA não deduz status de um `.md` nem escreve status em lugar nenhum: tudo passa pela ferramenta **`projeto_cenarios`**.

## A API, na ordem de uso

1. **`projeto_cenarios` com `acao: "mapa"`** (o padrão), SEMPRE primeiro: os grupos (Inbound, S/4, CPI…), cada cenário com o último resultado e se ele mudou depois (`desatualizado`), e o placar. Diga o `projeto` (a chave, ex.: `<dono>/<n>`); sem ele, vale o projeto aberto no Speed Up. Projetos nunca se misturam.
2. **`acao: "cenario"`, com o `id`:** a definição, o histórico das versões e as últimas execuções.
3. **`acao: "propor"`, com o `texto`** (o formato abaixo) e o `motivo`: grava um cenário novo ou uma versão nova. O Speed Up confere e recusa o que foge do formato. Antes, olhe o mapa: se o cenário existe, proponha a versão nova dele.
4. **`acao: "validar"`, com `grupos`, `ids` ou `falhados: true`:** o motor roda no SAP (QAS e PRD só leem) e grava o resultado. Responda com o que ele devolveu.
5. **`acao: "importar"`** (uma vez por projeto): traz os `.md` antigos de `testes/cenarios/` para o banco.

Desde 07/11/2026 a pasta `testes/` do projeto é a **fonte**: cada cenário é um `.md` (com a linha da revisão, que o Speed Up escreve) e cada execução um JSON com quem rodou e quando, em `testes/resultados/`. É isso que sincroniza; o banco é o índice refeito deles, ao ler e quando a pasta muda. O `.md` editado à mão e o `.md` que chega pelo Git valem, com ou sem a marca antiga. Quem roda por fora do motor não conta como prova: rode pela API (`validar`), pela tela ou por `tools/testes.js`.

## Quando aplicar

- Criar, mudar ou revisar um cenário de teste.
- Montar os testes de uma frente (Inbound, a ativação do produto, CPI, HANA Cloud, app/CAP, as descidas ao S/4, Sales, ECO, Financeiro).
- O usuário pergunta como provar que uma frente está ok, ou o que falta testar.
- O projeto andou (entrega fechada, versão nova, correção, conexão nova) e os testes precisam acompanhar: a revisão da cobertura.

## Quando NÃO aplicar

- O passo feito à mão num sistema (cadastrar, ativar, configurar): é um manual (processo-manual).
- A evidência solta de uma entrega já feita: vai em `docs/evidencias/` e é citada na issue.

## A exportação na pasta (gerada; não se edita)

```text
<projeto>/testes/
├── README.md                              ← o índice: uma linha por cenário (o motor e a página leem daqui)
├── cenarios/
│   └── <grupo>/                           ← um grupo = uma pasta (financeiro, integracao-cpi, inbound, …)
│       └── <ID>-<assunto>.md              ← o cenário: FIN-003-pagamento-entra-no-s4.md
└── resultados/
    └── <AAAA-MM-DD_HHMMSS>.json           ← uma execução, gerada pelo motor, nunca editada à mão
```

- **O grupo é a pasta** (como no Bruno). O nome da pasta é o grupo do front matter em minúsculas, sem acento e com hífen: `Integração CPI` mora em `integracao-cpi/`.
- **O ID é o prefixo do grupo mais três dígitos** (`FIN-003`), sem repetir no projeto, e o nome do arquivo começa por ele.
- **O índice** `testes/README.md` cita cada cenário. A ferramenta abaixo já põe a linha.
- **O resultado é gerado.** Não é arquivo de status: é a prova da execução, com a data no nome. A gestão continua no board.

## O cenário

````markdown
---
id: FIN-003
titulo: Pagamento do legado entra no S/4 com o tipo convertido
grupo: Financeiro
frente: Integração CPI
sistema: CPI DEV
conexao: cpi-dev
tags: [smoke, regressao]
issue: 63
prioridade: alta
---
# FIN-003 — Pagamento do legado entra no S/4

## Objetivo
O que o cenário prova, em uma ou duas frases.

## Pré-condições
- O iFlow implantado na 3.1.0; a massa de dados; a conexão.

## Passos
1. O que o motor faz, na ordem, em palavras de gente.

## Esperado
O resultado que diz "está certo".

## Evidência
O que o motor guarda em testes/resultados/ como prova.

```cenario
passo Último MPL do iFlow
  capacidade sap.cpi.messages.list
  args {"iflow":"Z_FIN_IN","top":1}
  assert status == ok
  assert jsonpath "$.items" count >= 1
  assert jsonpath "$.items[0].Status" == "COMPLETED"
passo Registro no S/4
  conexao s4-qas
  capacidade sap.abap.data.query
  args {"sql":"SELECT COUNT(*) AS N FROM ZTAB WHERE ..."}
  assert jsonpath "$.rows[0].N" > 0
```
````

- **Os campos obrigatórios:** `id`, `titulo`, `grupo`, `frente`, `sistema` e `issue` (a entrega que o cenário prova). Os opcionais são `conexao` e `capacidade` (valem para o passo que não diz os seus), `tags` e `prioridade`.
- **As cinco seções, nesta ordem:** Objetivo, Pré-condições, Passos, Esperado e Evidência. São para gente: o funcional lê o cenário sem abrir o bloco.
- **Um bloco ```cenario,** linha a linha, como o Hurl: `passo <nome>` abre um passo; dentro dele vão `capacidade` (uma capacidade do Speed Up, a mesma do `sap_execute`), `conexao`, `args` (JSON numa linha) e `assert`. Cada passo tem pelo menos um assert.
- **O assert:** `<consulta> [caminho] [count] [not] <predicado> [valor]`.
  - A consulta é `status` (`ok`, ou a recusa) ou `jsonpath "<caminho>"`.
  - O predicado é `==`, `!=`, `>`, `>=`, `<`, `<=`, `contains`, `matches` ou `exists` (este último sem valor).
  - O `count` conta os itens e pede um número. O `not` nega o predicado.
  - O caminho começa em `$`, a saída da capacidade: `$.ok`, `$.summary`, `$.data…` (`sap_execute`), ou `$.status` e `$.body…` (`http`).
- **Guardar e usar depois (o cenário que compara ou encadeia):** `guardar <nome> jsonpath "<caminho>" [count]` dentro de um passo guarda o valor (ou a contagem) quando o passo passa; `{{nome}}` nos `args` e no valor do `assert` dos passos seguintes usa o valor. É assim que um cenário compara dois sistemas (o passo com `conexao` do PRD guarda, o do QAS confere `== {{nome}}`) ou leva o número de um documento para a consulta seguinte. O passo que não passou não guarda, e o seguinte fica skipped. Sem código por projeto: o cenário é dado.
- **A data da execução:** `{{hoje}}`, `{{hoje-1}}`, `{{hoje+7}}` viram AAAAMMDD contados do dia em que o motor roda. O cenário diz "o lote de ontem" e nunca envelhece com uma data escrita.
- **Entrar no banco pela linha de comando:** `node Sap-Speed-Up/tools/testes.js propor "<pasta do projeto>" <cenario.md> [...] [--motivo "..."]` manda cada .md pela API (`projeto_cenarios` propor), com o Speed Up aberto.
- **A tabela de status sai do resultado:** um documento do projeto marca `<!-- speedup:testes grupos="<grupo>, <grupo>" -->` … `<!-- speedup:testes fim -->` (sem `grupos`, todos), e o Speed Up reescreve o bloco com o último resultado de cada cenário a cada execução ou cenário novo. Nunca se escreve status à mão nesse bloco.
- **As capacidades especiais:** `capacidade rea:<ferramenta>` chama o REA (`rea_executar`), e `capacidade http`, com `args {"method","url","headers","body"}`, faz o pedido HTTP direto.
- **O modelo preenchido:** um `<…>` que sobrou do modelo deixa o cenário fora do padrão, e o motor não o roda. Um `<Tag>` de payload XML não conta.

## O status de uma execução

Vem do Allure:
- **passed:** todos os asserts batem.
- **failed:** um assert não bate. O sistema respondeu diferente do esperado.
- **broken:** a execução não chegou ao fim: sem conexão, a recusa da política, um erro. A recusa nunca é contornada. Ela fica registrada como broken, com o motivo.
- **skipped:** o passo depois de um que não passou, ou o cenário depois da primeira falha com `--bail`.

O cenário que ESPERA a recusa (por exemplo, `assert status == recusa` para provar que o QAS não aceita escrita) passa quando ela vem.

## Rodar (como uma collection do Postman)

A CLI chama o Speed Up que já está aberto e nunca abre outro. Ela usa o token que o "Conectar IA" gravou.

```text
node Sap-Speed-Up/tools/testes.js listar "<pasta do projeto>" [filtro]
node Sap-Speed-Up/tools/testes.js rodar  "<pasta do projeto>" [filtro] [--bail] [--ensaio]
node Sap-Speed-Up/tools/testes.js status "<pasta do projeto>"          ← o último status de cada cenário, por frente
filtro: --grupo <nome> (repete) · --id FIN-003 (repete) · --tags "smoke & !lento" · --falhados
```

- Cada execução grava `testes/resultados/<AAAA-MM-DD_HHMMSS>.json`, com o resumo por grupo e por frente.
- A saída inteira de cada passo vai para `testes/resultados/<execução>/anexos/`.
- A CLI sai com 0 quando tudo passou, com 1 quando algo falhou ou quebrou, e com 2 num erro de uso: Speed Up fechado ou cenário fora do padrão.
- Com `--json`, a CLI dá a saída para o painel e para a página.

## A conversa de testes e o painel no Claude (o MOD)

Cada projeto tem uma conversa fixa de testes, sempre com o mesmo fim: rodar, validar e atualizar o que está ok.
- **O prompt dela é gerado pelo Speed Up:** `node Sap-Speed-Up/tools/mod-de-testes.js "<pasta do projeto>" --nome "<nome>" --board <n>`. O comando grava o `testes/PROMPT.md` (com `{{FILTRO}}` e `{{ESCOLHA}}`) e registra o projeto no MOD. O prompt não se edita à mão: muda-se o modelo na ferramenta e gera-se de novo.
- **O MOD `speedup-testes`** fica em `Sap-Speed-Up/mods/` e é o marketplace local `speedup`. Na conversa, `/testes` abre o painel "Testes do projeto":
  - um check por grupo, com o placar de cada um;
  - os cenários de cada grupo, com o último status e o porquê da falha;
  - os botões "Rodar marcados" (atalho `r`), "Rodar tudo" (`t`), "Só o que falhou" (`f`) e "Atualizar" (`a`).

  O botão manda à conversa o `testes/PROMPT.md` com o filtro da CLI. Ao fim de cada turno, o painel relê `testes/`.
- **A conversa sem ninguém digitar:** `node Sap-Speed-Up/tools/testes.js conversa "<pasta do projeto>" [--grupo X | --id FIN-004 | --falhados] [--ensaio]` monta o mesmo prompt que o painel manda e roda a conversa de testes inteira num Claude Code sem tela (`claude -p`, na raiz do espaço, a pasta confiável). O progresso sai na tela, e o fim vai para `<perfil>/conversas-de-testes.jsonl`. O Speed Up dispara pelo mesmo caminho.
- **A revisão da cobertura (o projeto é vivo):** a cada entrega, versão ou correção, os testes ficam para trás. O botão "Revisar a cobertura" (atalho `c` no painel `/testes`; também na área Projeto do Speed Up, ao lado de "Rodar selecionados") e `node Sap-Speed-Up/tools/testes.js cobertura "<pasta do projeto>" [--ensaio]` mandam o mesmo prompt, o `testes/PROMPT-COBERTURA.md`, gerado pela mesma ferramenta do `PROMPT.md`. A conversa:
  1. lê o projeto inteiro: o `README.md` e o índice, o `docs/ESTADO.md`, o guia, as decisões, os manuais, os commits desde a última revisão e o board (`board.js auditar`), mais as conexões e as capacidades do Speed Up;
  2. compara com o `testes/MAPA.md` e os cenários e acha o que mudou sem teste: entregável novo, entrega fechada, fluxo ou versão nova, problema corrigido que pede regressão, conexão nova que destrava uma lacuna, cenário desatualizado;
  3. atualiza o mapa (com a linha `Última revisão da cobertura: <data> — <o que entrou>` no topo), cria os cenários pelo `cenario-novo.js` e corrige os desatualizados; a lacuna que só o usuário destrava fica no mapa, com quem destrava;
  4. roda os cenários tocados, valida cada falha pelo `sap_execute` e faz o commit citando a issue.

  Na área Projeto, o botão abre a sessão da IA (o Claude Code sem tela, uma por vez, como o "Conferir com a IA"); no MOD, o prompt vai à conversa aberta.
- **Para instalar, uma vez por máquina e com o OK do usuário**, num terminal: `claude plugin marketplace add "<Git_HUB>/Sap-Speed-Up/mods"` e `claude plugin install speedup-testes@speedup`. O plugin é lido da própria pasta, e o `/reload-plugins` pega as mudanças.

## Como fazer

1. **Comece pelo mapa** (`projeto_cenarios`, acao "mapa"). Se o cenário já existe, trabalhe na versão nova dele.
2. **Escreva o texto do cenário** no formato abaixo. O `modeloDeCenario` (`node Sap-Speed-Up/tools/cenario-novo.js ... --imprimir`) dá o esqueleto. Use só capacidades que o Speed Up tem (`sap_capabilities`). Escrita e deploy, só em DEV, TEST ou SANDBOX; no QAS e no PRD, o cenário só lê.
3. **Proponha** (`acao "propor"`, com o motivo). A recusa diz o que foge do formato: corrija e proponha de novo.
4. **Valide** (`acao "validar"`, com o id) e responda com o resultado do motor, citando a execução. Nunca diga "passou" sem ele.
5. **O commit** leva a exportação que o Speed Up gravou na pasta, citando a issue (processo-atualizar-projeto).
6. **Revise a cobertura** quando o projeto andar (uma entrega fechada, uma versão nova, uma conexão nova) ou quando o usuário perguntar o que falta testar: o botão "Revisar a cobertura" ou `testes.js cobertura`, acima. A revisão parte do mapa e não recria o que existe.

## Exemplo

A frente do Financeiro precisava provar que o pagamento do legado entra no S/4. A IA chamou o mapa, viu que não havia cenário para isso e propôs o FIN-003, com dois passos: o MPL do iFlow no CPI e a contagem no S/4 QAS, só leitura. O Speed Up aceitou (revisão 1), a IA validou o FIN-003 e respondeu com o resultado do motor. O mapa passou a mostrar o Financeiro com o placar novo, para qualquer conversa que pergunte.

## Contraexemplo

Uma conversa gerou o mapa dos processos lendo os `.md` e escreveu "DEU ERRADO" num cenário que já tinha a prova da correção. Outra conversa, no mesmo dia, disse o contrário. O status escrito por conversa diverge. Só o mapa da API, calculado pelo motor, dá a mesma resposta em qualquer conversa.
