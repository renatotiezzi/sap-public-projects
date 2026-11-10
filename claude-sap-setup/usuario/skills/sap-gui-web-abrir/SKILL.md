---
name: sap-gui-web-abrir
description: Abre e opera o SAP GUI for HTML (Web GUI) de uma conexão ABAP do Speed Up no navegador embutido do Claude, de ponta a ponta e sem o usuário - sap_gui_abrir (a ponte local cuida do certificado, do login do cofre e da sessão), as telas intermediárias até a transação, a leitura da tela pelo texto, a navegação pelo campo de comando, o modo leitura de QAS e PRD e o fechamento com sap_gui_fechar. Use quando a transação não tem capacidade de API, quando o passo de lacuna diz "Web GUI", ou quando o usuário quer ver a tela; antes, a API (sap_execute).
titulo: "SAP GUI no navegador do Claude: abrir, passar as telas, ler e fechar"
area: abap
bundles: [adt]
versao: 1.3.0
atualizado_em: 2026-11-04
origem:
  - "Sap-Speed-Up/packages/local-service/src/web-gui-bridge.ts"
  - "Sap-Speed-Up/packages/local-service/src/web-gui.ts"
  - "Sap-Speed-Up/docs/melhorias/2026-11-02-sap-gui-html-no-claude.md"
  - "Sap-Speed-Up/docs/decisoes/2026-11-02-web-gui-o-abrir-e-de-ponta-a-ponta-sem-o-usuario.md (\"ela faz tudo, qnd vc clicar no botao abrir\")"
---

# SAP GUI no navegador do Claude: abrir, passar as telas, ler e fechar

O Speed Up abre o SAP GUI for HTML (o Web GUI) de qualquer conexão ABAP no navegador embutido do Claude, o painel ao lado da conversa. Entre o painel e o SAP fica a **ponte local** do Speed Up (`http://127.0.0.1:<porta>`). Ela cuida de três coisas:
- **o certificado:** o mesmo fixado do resto do Speed Up; o painel não vê o aviso;
- **o login:** o usuário e a senha do cofre, em cada chamada; nunca no chat, na URL nem no navegador;
- **a sessão:** os cookies do SAP ficam na ponte.

O usuário não clica em nada: o Claude abre, passa as telas intermediárias e chega à transação.

## A escada (a regra única)

Esta é a única regra de quando usar o quê no Speed Up. As outras skills, as lacunas dos bundles (`fallback`) e as instruções do MCP citam esta regra, sem repeti-la de outro jeito. O texto abaixo é o mesmo da constante `REGRA_DA_ESCADA` do core, e o teste E524 confere que os dois são iguais:

> A ESCADA DO SPEED UP (a regra única; skill sap-gui-web-abrir): 1) a API: sap_execute com a capacidade do Speed Up; para buscar, comparar e entender dados (QAS e PRD inclusive), este degrau basta. 2) no SAP ABAP, o Web GUI pelo Claude: sap_gui_abrir abre a transação no navegador embutido, já logado pelo cofre, e o Claude opera; em QAS, PRD e em conexão sem escrita autorizada a abertura é só de leitura (a guarda da ponte). 3) as telas web da nuvem (CPI, BTP, Cloud ALM, Datasphere), no navegador embutido do Claude. 4) por último, a tela do SAP GUI desktop (sap_gui_abrir com onde "desktop", ou o botão Abrir SAP GUI do Speed Up, e o computer use), para o que o Web GUI não mostra; a tela SAP só se abre pelo Speed Up, nunca pelo SAP Logon por fora. O usuário só age quando o SAP recusa pela autorização do usuário dele, quando a gravação está fora do que a guarda libera (QAS, PRD, sem escrita autorizada; na nuvem que o Speed Up só lê, o Cloud ALM e o Datasphere), quando o login é dele (o SSO da nuvem, a conexão sem senha no cofre), quando um segredo precisa ser digitado ou para apagar. Nenhuma recusa do Speed Up (de política, de proteção ou de alvo) se contorna por degrau nenhum.

## Quando usar

A API vem primeiro: `sap_execute` (o ADT, o RFC, o OData) é mais rápido, tem a política por efeito e devolve dados estruturados. O Web GUI entra quando:
- a transação não tem capacidade de API;
- o passo de uma lacuna diz "Web GUI" (SMARTFORMS, SE09, `/IWFND/V4_ADMIN`...);
- o usuário quer ver a tela (uma prova, uma demonstração, um erro que só aparece na tela).

O SAP GUI do Windows e o mouse ficam depois, para o que o Web GUI não mostra.

## O roteiro

1. **Conferir, na primeira vez em cada conexão:** `sap_gui_conferir` com a conexão (só leitura, sem login). O veredito tem de ser `pronto`. Nos outros, o campo `oQueFazer` diz o passo:
   - `sem-icm`: rode `sap_diagnose`;
   - `sem-webgui`: o pedido ao Basis para ativar o serviço no SICF;
   - `sem-rota`: a VPN.
2. **Abrir:** `sap_gui_abrir` com a `conexao`, a `transacao` e, quando der, os `campos` da primeira tela. Exemplo: `{"conexao": "1 - DEV", "transacao": "SE16N", "campos": {"GD-TAB": "T000"}}`. A resposta traz:
   - a `url` (de uso único);
   - o `modo` (`leitura` ou `escrita`) e as `transacoesPermitidas`;
   - o `login` (`cofre` ou `usuario`);
   - o `aberturaId`.
3. **Mostrar:** `preview_start` com a `url`, no navegador embutido do Claude. Nunca no navegador do usuário: a URL vale uma vez, e a ponte só atende o painel que a usou.
4. **Passar as telas intermediárias.** Leia o texto da tela (`get_page_text`, ou `find`) e siga a tabela abaixo até a transação aparecer.
5. **Trabalhar na tela:**
   - leia pelo texto, não pela imagem;
   - navegue pelo campo de comando (`/nSM37`, `/nSLG1`). No painel estreito ele fica escondido: **Ctrl+/** leva o foco a ele (o campo `ToolbarOkCode`);
   - preencha com `form_input` e execute com Enter ou F8;
   - com o painel escondido, `read_page` vem vazio: use `get_page_text` ou `find`.
6. **Fechar:** `sap_gui_fechar` com o `aberturaId` e o `resumo` do que foi feito (as transações, o que foi lido, o que foi gravado). Ele faz o logoff no SAP, solta os bloqueios, derruba a ponte e grava o registro. Feche sempre, também quando der erro.

## As telas intermediárias

| A tela (o texto) | O que fazer |
|---|---|
| "Mensagem do sistema" / "System Messages" | o botão de continuar (Enter) |
| "Logon múltiplo" / "already logged on" | "Continuar com este logon, sem encerrar os outros" e confirmar |
| "Informação" ao entrar (licença, último logon, senha perto de vencer) | continuar |
| A escolha do idioma | não deveria aparecer (o idioma vai na URL): escolha PT e continue |
| A tela "Logon", com `login: cofre` | a ponte não conseguiu entrar: **não digite nada**. Feche, rode `sap_gui_conferir` e diga o veredito |
| A tela "Logon", com `login: usuario` | o login é do usuário: peça para ele entrar no painel. Nunca digite senha |
| "A senha deve ser modificada", ou o usuário bloqueado | pare e diga ao usuário: trocar a senha é dele |
| "Recusado pelo Speed Up: ..." | a guarda de leitura recusou (5.1 do plano). Não tente outro caminho: diga o motivo e use "Voltar à tela anterior" para seguir lendo |
| Uma tela que não está aqui | pare, diga o texto da tela ao usuário e registre o caso no resumo do `sap_gui_fechar`, para a skill aprender |

## O SAP GUI desktop, também pelo Speed Up

Quando o Web GUI não mostra a tela (ou o usuário quer a janela do SAP GUI para Windows), o caminho é o mesmo `sap_gui_abrir`, com `"onde": "desktop"`. Exemplo: `{"conexao": "Cliente - DEV", "transacao": "SE80", "onde": "desktop"}`.
- O Speed Up abre a **entrada exata** do SAP Logon da conexão (pelo `sapshcut`), já logado pelo cofre e na transação. A senha não passa pelo Claude.
- As regras do modo são as mesmas: em `leitura`, só uma transação da lista abre.
- No desktop **não há ponte**, então a guarda não vê os comandos da tela. Em `leitura`, o Claude só **olha** (a captura, pelo controle de tela) e não digita nem clica para gravar, excluir, ativar, executar ou trocar de transação. Para navegar com a guarda, use o Web GUI.
- Cada abertura vira registro (a evidência), aberta ou recusada.

## As regras

- **A tela SAP só se abre pelo Speed Up** (o pedido do usuário em 03/11/2026: "garantir que só o Speed Up abra o SAP GUI, isso é uma ferramenta poderosa, sempre"):
  - o Web GUI e o SAP GUI desktop, só pelo `sap_gui_abrir`;
  - nunca pelo SAP Logon, pelo `saplogon.exe`, pelo `sapshcut`, por um atalho `.sap` nem pela URL do Web GUI digitada no navegador;
  - a transação recusada pela lista de leitura não se abre por outro caminho: diga ao usuário qual transação faltou, para ela entrar na lista.

- **QAS, PRD e qualquer conexão sem escrita autorizada abrem em `leitura`:**
  - só as transações de `transacoesPermitidas`;
  - a ponte recusa gravar, excluir, ativar e trocar para uma transação fora da lista.
  - Não procure outro caminho até a gravação, nem pelo mouse.
- **`escrita`** só no DEV, TEST e SANDBOX, com a escrita autorizada no Speed Up. Mesmo assim, confirme com o usuário cada gravação que ele não pediu com todas as letras.
- **A senha nunca passa pelo Claude.** Nem na URL, nem num campo, nem no chat.
- **Uma abertura por tarefa.** O resumo do fechamento é o registro do que foi feito na tela. O passo feito na tela que for passo de manual leva a prova (a data, quem fez, a captura).

## Histórico de versões

| Versão | Data | O que mudou |
|---|---|---|
| 1.3.0 | 2026-11-04 | O SAP GUI desktop pelo `sap_gui_abrir` (`onde: "desktop"`), a regra "a tela SAP só se abre pelo Speed Up" e a lista de leitura com as transações de consulta (SU-WI-241, #559) |
| 1.2.0 | 2026-11-02 | A escada (a regra única) entrou: o mesmo texto da REGRA_DA_ESCADA do core, que as outras skills, as lacunas e o MCP citam (SU-WI-220, #522) |
