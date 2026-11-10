# MCPs do modo de trabalho

| MCP | Para quê | Como entra na máquina nova |
|---|---|---|
| `speedup` | **o primeiro em todo trabalho SAP**: ABAP (ler, buscar, SQL, where-used, dumps), CPI (descrever, fonte, deploy, MPL), RAP, BTP, as skills (`skill_get`) e o motor de testes | Instale o app Speed Up pela página de download. No app: **Conexões** (os sistemas SAP, com as credenciais) e **Conectar IA → Claude Code**. O app grava a entrada em `~/.claude.json` com o token dele. Para regravar depois: `node <pasta do Speed Up>/tools/conectar-ia.js claude-code`. |
| Sps v1 | o que o Speed Up ainda não faz (cada uso é uma lacuna anotada) | Instale o app e ligue-o ao Claude Desktop pelo próprio app (as conexões SAP ficam nele). O `instalar.ps1 -Mcp` acha essa entrada, copia para o Claude Code e acerta as permissões (`mcp__spsv1__*` no `.claude/settings.json` vira o nome que o app usa). |
| abapfs | editar ABAP pelo VS Code (`murbani.vscode-abap-remote-fs`) | A extensão do VS Code; os sistemas em `abapfs.remote` no `settings.json` do usuário do VS Code (modelo em [`vscode-abapfs.template.json`](vscode-abapfs.template.json)). |
| Conectores do claude.ai (Gmail, Drive, Postman, Figma, Miro…) | e-mail, documentos, coleções | Login na conta do claude.ai → Configurações → Conectores. Nada a instalar. |

## Regras de uso (valem com qualquer MCP)

- QAS e PRD só leem; escrita e deploy só em DEV, TEST ou SANDBOX.
- Criar, alterar, ativar ou fazer deploy num tenant real pede confirmação (as regras `ask` do `.claude/settings.json`).
- Senha nunca no chat nem no repositório: ela mora na conexão do app (Speed Up, Sps v1) ou num `${input:...}` do VS Code.

## Como aplicar o modelo à mão

`instalar.ps1 -Mcp` junta as entradas de `claude.mcp.template.json` ao `~/.claude.json` (com cópia de segurança antes) e copia a do Sps v1 do Claude Desktop. A entrada do `speedup` só vem do próprio app. Rode de novo depois de instalar um app: o que já existe é mantido.
