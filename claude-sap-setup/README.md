# SETUP — o modo de trabalho SAP com o Claude Code numa máquina nova

Leva para uma máquina limpa o jeito de trabalhar: o **template de GAP**, as **regras** (o que o Claude faz sozinho, o que pede, como fecha cada pedido), os **hooks** que conferem o fim de cada resposta, os **motores** (board, decisões, manuais, EF, cenários, projetos), as **skills** (processo, ABAP, CPI, BTP, Fiori, RAP), o **mod de passos** e os **MCPs**.

Nada aqui tem senha, token, host ou dado de cliente: as credenciais ficam nos apps (Speed Up, Sps v1) e no login de cada ferramenta.

## Instalar

**Um comando** (PowerShell na máquina nova; baixa e roda tudo abaixo, com o espaço em `%USERPROFILE%\Trabalho`):

```powershell
irm https://raw.githubusercontent.com/renatotiezzi/sap-public-projects/main/claude-sap-setup/baixar.ps1 | iex
```

Ou à mão:

1. **Baixe** este repositório (Code → Download ZIP, ou `git clone`) e extraia numa pasta.
2. **Rode** no PowerShell, dentro da pasta:

   ```powershell
   powershell -ExecutionPolicy Bypass -File .\instalar.ps1 -Destino C:\Trabalho -Mcp
   ```

   - instala o que faltar pelo winget (Git, Node.js LTS, GitHub CLI, Python 3.12, VS Code) e o Claude Code pelo instalador oficial;
   - instala as extensões do VS Code;
   - monta o espaço em `C:\Trabalho`, junta as regras, as skills e o mod ao `~/.claude` (sem apagar nada: o que já existe e é diferente fica, ou vai para o lado com `-Forcar`);
   - liga os MCPs que já estiverem instalados e confere cada motor e o hook.
3. **Uma vez, à mão:**
   - `gh auth login` (o `board.js` fala com o GitHub pelo seu login);
   - `claude` (o login na sua conta; os conectores do claude.ai vêm junto);
   - o **Speed Up**: instale pela página de download, cadastre as conexões SAP e use **Conectar IA → Claude Code**;
   - o **Sps v1**: instale e ligue ao Claude Desktop pelo app; depois rode `.\instalar.ps1 -SemPrereqs -Mcp` de novo.
4. **Abra** o espaço (`code C:\Trabalho`) e peça ao Claude: *"nova demanda GAP_1234"*, com a EF e os objetos.

Rodar de novo é seguro: o que já está igual fica, e nada é sobrescrito sem `-Forcar`.

## O que vem

| Pasta | O quê | Vai para |
|---|---|---|
| [workspace/](workspace/) | `CLAUDE.md` e `AGENTS.md` (o modo de trabalho), `.claude/settings.json` (permissões e hooks), `.claude/hooks/projeto-em-dia.js`, `.claude/projetos.json` (os projetos do espaço), `.vscode/`, `.gitignore` | a raiz do espaço |
| [workspace/sap-tech-lab/](workspace/sap-tech-lab/) | o **template de GAP** (`TEMPLATE_DEMANDA/`), as instruções do Copilot e do Claude (assinatura `CL`), os agentes e os prompts | `<espaço>/sap-tech-lab` |
| [motores/](motores/) | `board`, `decisao`, `manual-novo`, `conferir-manual`, `conferir-fonte-unica`, `conferir-ef`, `cenario-novo`, `projeto-novo`, `projeto-migrar` e o hook de proteção de dados, empacotados (só pedem o Node >= 22) | `<espaço>/Sap-Speed-Up/tools` (o caminho que as regras citam) |
| [usuario/](usuario/) | `CLAUDE.md` (as regras de ouro) e `COMO-TRABALHAMOS.md`, as skills, o mod `passos` | `~/.claude` |
| [mcp/](mcp/) | os MCPs: o que cada um faz e como entra; os modelos | `~/.claude.json` e o VS Code |

## O modelo de GAP em uma tela

```
GAP_<n>/
  README.md                 índice e estado da demanda
  01_DOCUMENTACAO/          EF (não se altera), README da IA, guia, decisões, testes, referências
  02_CODIGO/                só o código aprovado
  03_OBJETOS_ORIGINAIS/     o original como chegou: imutável
  03.1_LAST_VERSION/        a versão atual de cada objeto: a fonte da verdade
  04_CORRECOES/<NN - ...>/  a correção, com o MESMO nome da pasta do erro
  05_ERROS/<NN - DD-MM - HHhMM - descrição>/   o dump bruto + ERRO.md
  06_RESULTADO_ESPERADO/    script_validacao.md + cenario_NN_validacao.md
```

Correção mínima, rastreabilidade 1:1 entre erro e correção, `NN+1` quando uma correção gera erro novo, `<NN> - CL - ...` quando o par é aberto pelo Claude. O ciclo inteiro está na skill `processo-corrigir-abap`.

## Os projetos do espaço

Cada projeto é uma pasta, com uma linha em `workspace/.claude/projetos.json`: `"board": <n>` quando a gestão é um GitHub Project (cada entrega é uma issue, pelo `board.js`), ou `"board": null` quando o status mora no `docs/STATUS.md`. O hook lê de lá quais pastas conferir. Projeto novo: `node Sap-Speed-Up/tools/projeto-novo.js "<pasta>" --titulo "<o projeto>"`.

## Antes de publicar uma mudança

```powershell
node conferir-publico.js
```

A barreira varre tudo e não deixa sair cliente, consultoria, autor, caminho pessoal, e-mail ou segredo (as regras em `regras-publico.json`).
