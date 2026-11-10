# Espaço de trabalho — modo de trabalho

Dentro deste espaço (esta pasta e todas as subpastas, incluindo `.claude`), aja por padrão. Execute as ações necessárias para concluir a tarefa sem pedir confirmação para operações locais, normais e reversíveis: ler, criar, editar, renomear/mover arquivos e pastas; `git status/diff/add/commit/branch`; `npm`/`npx`/`python`/build/teste; ferramentas MCP de leitura ou que só manipulam artefatos locais.

Continue pedindo confirmação apenas para: `git push`/`push --force`, qualquer chamada MCP que crie, altere, faça deploy ou ative algo num tenant SAP/BTP real (`create*`, `update*`, `deploy*`, `activate*`, `set*Source`, `push/create*Repo`, credenciais), envio de mensagem/e-mail, e qualquer operação destrutiva fora do escopo direto da tarefa.

Regras completas de permissão em `.claude/settings.json` — não duplicar aqui, editar lá.

## Demandas SAP (GAP / Ticket): o template

Toda demanda SAP nasce do template em `sap-tech-lab/TEMPLATE_DEMANDA/templates/GAP_TEMPLATE/` e segue as regras de `sap-tech-lab/CLAUDE.md`:

- uma pasta por demanda (`GAP_<n>` / `TICKET_<n>`), nada na raiz;
- `03_OBJETOS_ORIGINAIS/` é baseline imutável; a versão atual de cada objeto mora em `03.1_LAST_VERSION/`;
- todo erro em `05_ERROS/<NN> - <DD-MM> - <HHhMM> - <descrição>/` (dump bruto + `ERRO.md`) e a correção em `04_CORRECOES/` com o **mesmo nome**; o par aberto pelo Claude leva `<NN> - CL - ...` e a assinatura `<NN>CL`;
- correção mínima, nunca refactor fora do escopo; o header do objeto ganha `* V<NN> - <AUTOR> - ...`;
- a validação em `06_RESULTADO_ESPERADO/` (`script_validacao.md` + `cenario_NN_validacao.md`).

As skills `processo-corrigir-abap`, `processo-registrar-erro` e `processo-registrar-correcao` fazem o ciclo.

## SAP: o Speed Up primeiro

Todo trabalho SAP começa no Speed Up (MCP `speedup`): `speedup_status`, `sap_capabilities` (com `bundle` ou `prefix` e `compact: true`) e `sap_execute`. Ele lê ABAP (`sap.abap.data.query` para SQL, `sap.abap.object.read` com `search`/`method`/linhas, `sap.abap.object.search`, `sap.abap.data.table`) e faz o CPI (descrever, ler fonte, parâmetros, deploy, MPL). O Sps v1 fica para o que o Speed Up ainda não faz, sem proibição; cada uso dele é uma lacuna anotada para o Speed Up fechá-la. QAS e PRD só leem; escrita e deploy só em DEV, TEST ou SANDBOX.

## Projetos: o projeto no repositório, a gestão no board do GitHub ou no STATUS.md

Cada projeto é uma pasta com tudo (código, integrações, payloads, documentos, testes), e tudo vai ao GitHub do projeto. A documentação mora na pasta (`docs/`), com índice no `README.md` dela. Os projetos deste espaço e onde mora o status de cada um estão em **`.claude/projetos.json`** (o hook lê de lá):

- `"board": <n>` — a gestão é o GitHub Project `<n>`: cada entrega é uma issue;
- `"board": null` — o status mora no `docs/STATUS.md` do projeto: cada processo com a situação em DEV, QAS e PRD (🟢 🟡 🔴 ⚪), onde quebra, por quê, o próximo passo e quem age, mais o "O que fazer agora", escrito com o que os sistemas provaram.

**O status só se afirma pelo motor:** comece pelo mapa dos cenários (`projeto_cenarios`, ou `node Sap-Speed-Up/tools/testes.js status "<pasta>"` com o Speed Up instalado) e valide o que mudou; a leitura avulsa vira um cenário proposto, nunca um número escrito à mão; o que uma decisão manda ignorar (a linha "Ignorar na validação" dela) nunca se conta como achado.

**Fonte única** (skill `processo-fonte-unica`): cada informação mora num lugar só, na pasta local do projeto. Grave ali e faça o commit no mesmo pedido. O GitHub é o backup da mesma pasta. Antes de criar, procure o que já existe. O que é gerado (o HTML de um manual) sai da fonte, e nenhum estado fica só no navegador ou na página publicada. A conferência: `node Sap-Speed-Up/tools/conferir-fonte-unica.js "<pasta do projeto>"`.

Ao fim de todo pedido que muda um projeto com board:

1. Faça o commit citando a issue em que trabalhou: `Refs #63`, ou `Closes #63` quando a entrega termina com evidência.
2. Deixe a issue em dia pelo caminho único, `node Sap-Speed-Up/tools/board.js status <board> <issue> "<Status>" --evidencia "<o arquivo, o commit ou a execução>"`. Nunca feche a issue nem mude o Status por fora. A issue que recebeu trabalho e estava no radar vai para "Em andamento" na mesma resposta. Uma issue por entrega (nada de guarda-chuva), e o título diz a entrega, nunca o estado. Depois, `board.js conferir <board>` não pode apontar nada, e `board.js auditar <board>` diz o trabalho da pasta que o board ainda não sabe. `board.js motor <board>` mostra o plano (ações mecânicas e pendências); `--aplicar` aplica as ações; as pendências são decisões, nunca se aplicam sozinhas. A fase do entregável muda por `board.js fase <board> <issue> "<Fase>"` (Desenho, Construção, Testes em DEV, Homologação, Produção) e a do projeto segue o SAP Activate (`board.js fase-do-projeto <board> "<Discover|Prepare|Explore|Realize|Deploy|Run>"`): no Realize o entregável fecha em Homologação; a Produção só abre no Deploy.
3. O que entrou no radar vira issue nova sob o pai certo (o entregável a que a entrega serve), pelo caminho único: `node Sap-Speed-Up/tools/board.js criar <board> --pai <issue> --titulo "<a entrega>" --status "<Status>" --evidencia "<o motivo>"`.
4. Documento novo ou mudado entra no índice do `README.md` da pasta. O manual novo nasce do modelo (`node Sap-Speed-Up/tools/manual-novo.js`) e é conferido antes do commit (`node Sap-Speed-Up/tools/conferir-manual.js`). O `.md` é a única fonte do manual: cada passo é uma caixa (`- [ ]` / `- [x]` com data, quem e a prova), marcada na hora; o HTML é gerado do `.md`, nunca editado à mão. Todo manual tem versão e data (`Versão 1.3 · 13/10/2026`), o histórico de versões no fim, a linha `Entregável: <ID>` no topo e `Entrega: #N` em cada seção. Toda EF passa por `node Sap-Speed-Up/tools/conferir-ef.js`. Cenário de teste novo: `node Sap-Speed-Up/tools/cenario-novo.js`.
5. Antes de encerrar, confira a integridade. O hook `.claude/hooks/projeto-em-dia.js` segura o fim da resposta quando o commit não cita a issue, quando o arquivo editado ficou sem commit, quando o HTML de um manual foi editado sem o `.md`, quando um arquivo novo tem nome de cópia, quando uma issue citada segue no radar e quando o pedido trouxe uma decisão que não foi gravada.

Nos projetos com `docs/STATUS.md` (sem board), atualize o STATUS no mesmo pedido em que o status mudar e faça o commit; não se cria nem se move issue.

## A sessão curta: a conversa vira .md

Excesso de contexto na conversa é arquitetura ruim: a memória do trabalho mora nos arquivos da pasta, não nas mensagens.

- Uma sessão por entrega, que começa pelo `README.md` e pelo `docs/ESTADO.md` do projeto e pela próxima entrega (`node Sap-Speed-Up/tools/board.js proxima <board>`), e lê o resto sob demanda. O que falta decidir é marcado no documento com `[A ESCLARECER: ...]`.
- O trabalho pesado (a suíte inteira de testes, varreduras, leituras grandes, logs) vai a subagentes que devolvem só o resumo.
- Ao acabar uma parte, o `ESTADO.md` é sobrescrito: onde estamos e o próximo passo, curto.
- Cada decisão do usuário vira um arquivo em `docs/decisoes/` na hora, pelo caminho único `node Sap-Speed-Up/tools/decisao.js nova "<pasta do projeto>" --titulo "..." --decisao "..." --porque "..." --frase "<as palavras dele>"`.

Projeto novo: uma pasta, um board (ou o `docs/STATUS.md`) e um guia, criados juntos, e a linha dele em `.claude/projetos.json`. Instalador não vai ao repositório: é publicado numa página de download.
