---
name: processo-manual
description: "Cria, atualiza e ACOMPANHA um MANUAL do projeto (um passo a passo para alguém executar: configuração num sistema, conexão entre sistemas, setup de ambiente). O .md em docs/ é a ÚNICA fonte: o texto e o estado de cada passo (caixa [ ]/[x], com data, quem e a prova); passo feito ou confirmado na conversa é marcado no .md na hora. A versão visual em HTML é gerada do .md no ID visual do projeto (e exportada em PDF ou Word quando pedido), a linha vai no índice do README da pasta, e a versão é numerada com data (ex.: Versão 1.3 · 13/10/2026), com o histórico. Use sempre que o usuário pedir um manual ou um passo a passo, sempre que um manual mudar e sempre que um passo de um manual for feito. Não use para o guia do projeto nem para o registro de correção ou de erro."
titulo: "Processo: manual do projeto (.md, HTML e versão numerada)"
area: processo
bundles: []
versao: 2.8.0
ordem: 7
atualizado_em: 2026-10-17
origem:
  - "Sap-Speed-Up/docs/melhorias/2026-10-13-pagina-entregaveis-e-manuais.md (pedidos do usuário de 13/10/2026: \"manuais, eles vão ser criados em .md depois transformados em html\"; \"versão tem número além de data... se gerar uma nova hoje, e aí?\"; \"quero que tudo que for acontecendo aqui atualize .md; esses documentos olhem pros .md e sempre esteja atualizado\")"
  - "Sap-Speed-Up/docs/melhorias/2026-10-14-acompanhamento-do-projeto.md (pedido do usuário de 14/10/2026: \"tem poucos manuais, tem que ter todos de forma visual, tem que ter tudo 100% atualizado\")"
  - "Sap-Speed-Up/docs/melhorias/2026-10-16-status-coerente.md (16/10/2026: o passo diz a que entrega serve; o histórico sem a coluna do commit)"
  - "Sap-Speed-Up/docs/melhorias/2026-10-17-documentos-no-id-visual.md (pedidos do usuário de 17/10/2026: \"os manuais teriam que ser páginas .html interativas\"; \"se eu quiser exportar um manual em pdf deveria poder\"; o ID visual escolhido no projeto)"
---
# Processo: manual do projeto (.md, HTML e versão numerada)

Um manual é um passo a passo para alguém executar: o Basis, a segurança, o funcional ou o próprio usuário. O `.md` é a ÚNICA fonte: o texto de cada passo E o estado dele (feito ou não, quando, por quem, com que prova). Tudo o mais olha para o `.md`: a versão visual em HTML é gerada dele, a página do projeto no Speed Up lê dele, e o índice do README aponta para ele. Assim, o que acontece na conversa (um passo feito, uma prova colhida) chega ao manual pelo único lugar que todos leem. Toda versão publicada tem NÚMERO e DATA: a data sozinha não separa duas versões do mesmo dia.

## Quando aplicar

- O usuário pede um manual, um passo a passo, um roteiro de configuração, um "como fazer" para outra pessoa.
- Um manual existente muda: passo novo, correção, valor diferente.

## Quando NÃO aplicar

- O guia do projeto (o que é, por quê, decisões, o que cadastramos): é `processo-organizar-projeto` e `processo-atualizar-projeto`.
- O registro de uma correção ou de um erro: são `processo-registrar-correcao` e `processo-registrar-erro`.
- Nunca ponha senha, chave ou token no manual: diga onde está (o cofre, a credencial no sistema) e quem tem acesso.

## O estado de cada passo (no `.md`)

- **Cada item que alguém executa é uma caixa de marcar** no `.md`: `- [ ] **Binding de vendas no SOAMANAGER** — Basis, no S/4 QAS (400).` com a prova esperada logo abaixo.
- **Feito, a caixa vira `[x]` com data, quem e a prova:** `- [x] **Binding de vendas no SOAMANAGER** — Basis, no S/4 QAS (400). Feito em 13/10/2026 por Basis; prova: as duas URLs na aba Overview.`
- **Na conversa, na hora:** quando um passo é feito ou confirmado (a IA executou, ou o usuário disse "fiz", ou a evidência apareceu), marque no `.md` no mesmo pedido e faça o commit citando a issue. Passo que falhou fica `[ ]`, com a nota do que faltou.
- **Marcar passo não muda a versão**: é progresso, não procedimento novo. A versão sobe quando o TEXTO do procedimento muda.
- **O progresso não mora em outro lugar**: nada de guardar as marcações só no navegador ou na página publicada. Se alguém marcar fora (na página do Speed Up), o Speed Up grava no `.md`.

## A versão

- **Formato:** `Versão X.Y · DD/MM/AAAA`, no topo do `.md` e no cabeçalho do HTML, sempre iguais.
- **A primeira publicada é a 1.0.**
- **Cada mudança publicada sobe o Y** (1.0 → 1.1 → 1.2), mesmo no mesmo dia: o número separa as versões; a data diz quando.
- **Sobe o X** (1.3 → 2.0) quando quem seguiu a versão anterior precisa refazer ou conferir algo: passo trocado de ordem, outro sistema ou mandante, valor que invalida o anterior.
- **Histórico de versões** no fim do `.md`, uma linha por versão: a versão, a data e a hora, e o que mudou. **Sem a coluna do commit:** o hash só existe depois do commit e obrigava um segundo ("o commit da versão X no histórico"); num projeto real, eram 31 de 93 commits. O `git log` do arquivo dá o commit de cada versão.
- **O arquivo não muda de nome** (nada de `_v2` ou `_final`): o Git guarda as versões antigas.
- **O HTML é gerado do `.md`, nunca editado à mão**, e mostra o mesmo número e as mesmas marcações. HTML com número ou marcações diferentes do `.md` está desatualizado: gere de novo.

## Como fazer

0. **Comece pelo modelo e confira no fim** (18/10/2026): `node Sap-Speed-Up/tools/manual-novo.js "<pasta do projeto>" --titulo "Manual da …" --entregavel <ID> --secao "Preparar=#N"` cria o `.md` já no padrão abaixo (pela IA de outro cliente, a ferramenta `documentos_modelo_de_manual` do Speed Up devolve o mesmo modelo); `node Sap-Speed-Up/tools/conferir-manual.js <arquivo>` (ou `--pasta "<pasta do projeto>"`) aponta o que fugiu do padrão, com a correção pronta.
1. **O `.md` em `docs/`** da pasta do projeto, com o nome `MANUAL_<ASSUNTO>.md`. No topo: o título, para quem é, o que se consegue ao final, a linha `Versão X.Y · DD/MM/AAAA` e a linha `Entregável: <ID>` (o entregável do board a que o manual serve; mais de um, separados por vírgula). É por ela que a página do projeto mostra o manual, com o progresso, no cartão do entregável.
   **Em cada seção, a linha `Entrega: #N`**: a issue do board que os passos daquela seção entregam (ex.: os pagamentos, `Entrega: #219`; o teste ponta a ponta, `Entrega: #147`). Ela vale do ponto em que está até o próximo título, e para as seções de dentro; quando um trecho da seção serve a outra entrega, ponha a linha dela logo antes do trecho. É por ela que um passo feito move a entrega certa: a conferência (`board.js auditar`) acusa a entrega que tem passos feitos e segue no radar, e a que tem todos os passos feitos e segue aberta.
   **O passo feito traz a data:** "feito em DD/MM/AAAA" (vale também "conferido em", "provado em", "executado em", "concluído em", "testado em"), com quem e a prova. Sem a data, a conferência não sabe se o passo veio depois da última mudança do status.
2. **Os passos:** um por caixa de marcar (`- [ ]`), com onde fazer (sistema, mandante, transação ou tela), quem faz (você, Basis, segurança, funcional), os valores exatos para copiar e a prova de que deu certo.
3. **A versão visual** é gerada do `.md` pelo Speed Up a cada leitura da página do projeto e a cada mudança do `.md` (a pasta do projeto é vigiada): a página do manual, no ID visual do projeto, com a versão, o progresso, o filtro por papel, o índice, o "Faça agora", o caminho, a matriz, cada passo num cartão com a caixa, a data, quem e a prova, e o histórico. O cartão do manual no painel do projeto abre essa página. O projeto não precisa manter HTML à mão. Se o projeto quiser um `.html` no repositório (para mandar a alguém), ele também é gerado do `.md`, nunca editado à mão, e mostra o mesmo número de versão. Sem dado sensível e sem depender de rede.
4. **O índice:** a linha do manual no `README.md` da pasta (documento → do que trata), sem versão nem estado na descrição: a página do projeto lê a versão e o progresso do `.md` (o índice com "Versão 1.4" num manual na 1.6 confundiu a página de um projeto real). É dali que a página mostra o botão "Abrir o manual".
5. **O board:** o commit cita a issue da entrega a que o manual serve (`Refs #N`); se o manual é a própria entrega, ela fecha com ele como evidência.
6. **Ao fazer um passo:** marque a caixa no `.md` (data, quem, prova: `— feito em DD/MM/AAAA por <quem>; prova: <o quê>`) e faça o commit citando a issue. A versão não muda. A página do projeto mostra o passo como o último feito.
   **Todo passo feito num sistema** (configuração, cadastro, credencial, destino) é passo de um manual: é ele que deixa repetir o caminho em QAS e PRD. Se o manual daquele entregável ainda não existe, crie-o.
7. **Ao mudar o procedimento:** suba a versão e acrescente a linha no histórico; se houver `.html` no repositório, gere de novo e confira que os dois mostram o mesmo número.

## O formato que o Speed Up lê

O motor de documentos lê estas convenções do `.md` (para todo projeto). O que fugir delas ainda aparece, como texto, mas sem virar passo, progresso ou filtro:

- **O topo:** `# Título` (o "Manual:" da frente sai; o que vem entre parênteses no fim vira o subtítulo), a linha `Versão X.Y · DD/MM/AAAA` e a linha `Entregável: <ID>`. O primeiro parágrafo diz o que se consegue ao final.
- **`**Faça agora…**`** seguido de uma lista numerada: o resumo do que fazer primeiro, no topo da página.
- **Os rótulos do topo,** numa lista: `**Para quem:**`, `**Quem faz:**`, `**Prova:**` e `**Caminho:** A → B → C` (o caminho vira a linha do processo).
- **As seções:** `## N. Título` (ou `## Passo N — Título`), cada uma com a linha `Entrega: #N`. Caixas antes do primeiro `##` viram a seção "Antes de começar".
- **Os passos:** `- [ ] **N.M Nome** — Papel, onde.` O papel é a equipe que faz (num projeto, Funcional, Integração, ABAP, Basis e Segurança; noutro, as equipes dele): o Speed Up aprende os papéis do próprio manual, pelo começo dos passos, e eles viram o filtro por papel. "Basis ou ABAP" vale pelos dois; "Todos", por todos. Dentro do passo, as linhas `**Fazer:**`, `**Esperado:**`, `**Se não:**`, `**Atenção:**` e `**No PRD:**`. Caixa dentro de caixa também é passo.
- **O passo feito:** `- [x] **N.M Nome** — Papel. — feito em DD/MM/AAAA por Quem; prova: o quê.`
- **A matriz:** a seção `## Matriz…` com a tabela dos passos.
- **No fim, recolhidas:** as seções de manutenção sem caixas (`## Histórico de versões`, `## Para quem mantém`, `## Documentação SAP`, `## Fontes`, `## Referências`, `## Glossário`).
- **A ficha do documento** (para a capa e a página de controle do PDF oficial): no topo, as linhas `Autor:`, `Cliente:`, `Programa:`, `Frente:`, `Classificação:` (Pública, Uso interno, Confidencial ou Estritamente confidencial), `Preparado por:`, `Aprovado por:` e `Distribuição: Empresa: contato; Empresa: contato`. A página mostra a mesma ficha abaixo do título; o que faltar sai no PDF como "<informação não fornecida>".
- **Os blocos** (iguais na página e no PDF):
  - os destaques, no formato do GitHub: `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]` e `> [!CAUTION]`, ou em português, `> [!NOTA]`, `> [!DICA]`, `> [!IMPORTANTE]`, `> [!ATENÇÃO]`, `> [!CUIDADO]`, `> [!PREMISSA]` e `> [!DECISÃO]`. O texto depois da marca, na mesma linha, é o título;
  - a ficha de interface: `::: ficha Título`, a lista `- **Rótulo:** valor` e `:::`. Ela sai em duas colunas;
  - o termo de aceite: `::: aceite`, o texto e `:::`. Ele sai com o quadro de assinaturas;
  - o código com a linguagem na cerca (` ```abap `, `xml`, `json`, `groovy`, `js`, `sql`, `sh`, `yaml`…), que sai colorido;
  - as notas de rodapé (`[^1]`) e o glossário (`Termo` e, na linha seguinte, `: definição`);
  - as tabelas com células mescladas: `||` junta a célula com a da esquerda, e `^^` com a de cima;
  - antes da tabela, o rótulo em negrito (`**Os fluxos da entrada:**`) vira a legenda dela no PDF ("Tabela N — …").
- **Os diagramas** (` ```mermaid `, o mesmo que o GitHub desenha): fluxo, sequência, estados, C4, Gantt e arquitetura. Eles saem em SVG nas cores do ID visual do projeto, mudam com a troca do ID e com o modo escuro, e no PDF viram "Figura N". As regras:
  - a legenda vem da primeira linha `%% legenda: O título` ou do `title:` do cabeçalho;
  - o fluxo usa o layout ELK com o cabeçalho `---` / `config:` / `  layout: elk` / `---`;
  - o diagrama de ARQUITETURA (`architecture-beta`) usa os ícones oficiais do SAP BTP: `sap:btp`, `sap:integration-suite`, `sap:cloud-integration`, `sap:api-management`, `sap:event-mesh`, `sap:advanced-event-mesh`, `sap:hana-cloud`, `sap:cloud-foundry`, `sap:kyma`, `sap:abap-environment`, `sap:cap`, `sap:connectivity`, `sap:destination`, `sap:cloud-connector`, `sap:credential-store`, `sap:xsuaa`, `sap:identity-authentication`, `sap:job-scheduling`, `sap:alert-notification`, `sap:cloud-logging`, `sap:audit-log`, `sap:build-work-zone`, `sap:build-process-automation`, `sap:datasphere`, `sap:analytics-cloud`, `sap:cloud-alm`, `sap:cloud-transport-management`, `sap:document-management`, `sap:object-store` e `sap:ai-core`, entre outros. Os genéricos (`server`, `database`, `cloud`, `disk`, `internet`) servem para o que não é BTP;
  - o diagrama com erro de sintaxe fica na página como código, com o aviso, e não some.
  - O ```fluxo de antes (as raias salto a salto, com a sintaxe do Speed Up) continua valendo.
- **O que não passa:** HTML escrito no `.md` aparece como texto, e o link só vale com https ou relativo à pasta do projeto.

## Exportar e o ID visual

- **Exportar:** quando o usuário pede "exporta o manual X em PDF" (ou em Word), a IA chama `documentos_exportar` com o nome do `.md` e o formato. O arquivo vai para `Downloads/Speed Up/<projeto>/`. O PDF é o DOCUMENTO OFICIAL do mesmo `.md` (a decisão "página x documento", 19/10/2026): a capa com a ficha e a arte da marca, a página de controle (aprovação, distribuição, classificação, histórico de versões), o sumário com o número da página, o cabeçalho e o rodapé, as seções numeradas e as tabelas e figuras legendadas. O texto é o mesmo da página; muda só a forma; o Word é o MESMO documento oficial, editável: a capa, o controle, o sumário (que o Word atualiza ao abrir), os estilos de título, as tabelas legendadas, os passos com as caixas (☑ feito, ☐ a fazer), os blocos e as figuras (os diagramas e os gráficos como imagem). O painel do projeto sai em PDF como o RELATÓRIO DE STATUS oficial (a capa, o controle, o sumário, os gráficos do status, do andamento de cada entregável, das fases e dos testes, e as tabelas), com os mesmos números da página ("exporta o painel").
- **O ID visual é do projeto, não do manual:** as cores, as fontes e a marca vêm do ID visual escolhido para o projeto (o padrão é o Neutro). Nunca ponha cor, fonte ou logo no `.md`. O usuário troca pelo botão "ID visual" da própria página, ou pede à IA ("usa o ID da marca neste projeto": `documentos_usar_id_visual`); tudo se refaz na hora.
- **Um ID visual novo** nasce dos documentos da marca, pela IA (`documentos_salvar_id_visual`), e aparece em Skills › IDs visuais, com a página modelo e o JSON.

## Exemplo

Um manual de conexão entre dois sistemas foi publicado às 13h (1.0). Às 14h30 ganhou a versão visual (1.1); às 14h45, a visão técnica (1.2); às 15h30, o mínimo para os dois lados se falarem (1.3). O topo diz `Versão 1.3 · 13/10/2026`, e o histórico tem as quatro linhas, cada uma com a hora e o que mudou. Quem abriu a 1.1 de manhã sabe que está desatualizado. A seção do teste traz `Entrega: #147`: quando o teste passa e a caixa vira `[x]`, a #147 sai do radar na mesma resposta.

## Contraexemplo

"Versão de 13/10/2026" no topo de um manual que mudou quatro vezes no mesmo dia: ninguém sabe qual versão está na mão, e o HTML pode estar numa versão e o `.md` em outra.

Outro, real: os passos de um manual foram feitos na conversa, mas o progresso ficava só nas caixas da página publicada. O `.md` não dizia nada, e o manual parecia parado.

Outro, real (16/10/2026): o manual do lançamento chegou a 19 de 32 passos, com a loja piloto lançada e os pagamentos provados, e a issue do teste ponta a ponta seguia "Pendente": nenhum passo dizia a que entrega servia, e os commits citavam todos a mesma issue guarda-chuva.
