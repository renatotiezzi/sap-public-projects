# MANIFEST — itens exportados

Lista de cada item deste pacote, sua origem no setup atual e sua finalidade.
Tudo foi **genericizado**: sem credenciais, URLs privadas, dados de cliente ou
informações corporativas.

## Configurações do repositório (migram integralmente)

| Item | Origem no setup atual | Finalidade | Genericizado |
|---|---|---|---|
| `.github/copilot-instructions.md` | Novo, consolidando `ORGANIZATION_GUIDE.md` + `SETUP_INICIAL.md` + memória de repo do fluxo | Regras do modelo de trabalho aplicadas a todo o repo | Sim |
| `.github/instructions/error-correction-workflow.instructions.md` | Regras de `05_ERROS/` e `04_CORRECOES/` | Fluxo erro→correção com escopo `applyTo` | Sim |
| `.github/instructions/abap.instructions.md` | Convenções de `AGENTS.md` (SAP_MCP) + instrução global de ABAP | Convenções ABAP / clean core | Sim (prefixos → `Z<PREFIXO>`) |
| `.github/prompts/registrar-erro.prompt.md` | Novo, derivado do fluxo `05_ERROS/` | Prompt para registrar erro | Sim |
| `.github/prompts/registrar-correcao.prompt.md` | Novo, derivado do fluxo `04_CORRECOES/` | Prompt para registrar correção | Sim |
| `AGENTS.md` (via `templates/AGENTS.md.template`) | `SAP_MCP/AGENTS.md` (reduzido e limpo) | Descrição agnóstica do modelo p/ IAs | Sim |
| `docs/ORGANIZATION_GUIDE.md` | `EY-Tech-DEV/ORGANIZATION_GUIDE.md` | Guia de organização por demanda | Sim (sem marca) |

## Configurações locais do VS Code (migram sem segredos)

| Item | Origem | Finalidade | Observação |
|---|---|---|---|
| `.vscode/settings.json` | Novo (portável) | Habilitar instruções/prompts + preferências de arquivo | Sem segredos |
| `.vscode/extensions.json` | Novo (portável) | Extensões recomendadas | Ajuste conforme sua stack |
| `.vscode/mcp.json.template` | `SAP_MCP/.vscode/mcp.json` | Config MCP **sanitizada** | Credenciais removidas → placeholders `<...>` e `${input:...}` |

## Templates de estrutura e documentação

| Item | Origem | Finalidade |
|---|---|---|
| `templates/GAP_TEMPLATE/` (+ READMEs) | `EY-Tech-DEV/_TEMPLATES/GAP_TEMPLATE/` | Estrutura padrão de uma demanda |
| `templates/ERRO_TEMPLATE.md` | Padrão dos `ERRO.md`/`analise.md` em `05_ERROS/` | Documentar contexto, causa, evidências, impacto, solução |
| `templates/CORRECAO_GUIA_TEMPLATE.md` | Padrão dos guias `.md` em `04_CORRECOES/` | Guia para ações não-código |
| `templates/CENARIO_VALIDACAO_TEMPLATE.md` | `06_RESULTADO_ESPERADO/cenario_NN_validacao.md` | Registro de validação de cenário |
| `templates/AGENTS.md.template` | `SAP_MCP/AGENTS.md` | Base do `AGENTS.md` da raiz |

## Automação

| Item | Finalidade |
|---|---|
| `SETUP_BLUEPRINT.md` | Blueprint auto-suficiente: a IA lê e recria toda a estrutura e os arquivos (substitui o antigo script `.ps1`, que era bloqueado por email) |

## O que NÃO foi exportado (intencionalmente)

| Item | Motivo |
|---|---|
| Credenciais SAP em `SAP_MCP/.vscode/mcp.json` (`SAP_USERNAME`, `SAP_PASSWORD`, `SAP_URL`, `SAP_CLIENT`) | Segredos / URL privada — substituídos por placeholders |
| Pastas de demanda reais (`GAP_265`, `GAP_265_CARGA`, `GAP_025A`) | Contêm código, dumps e dados de cliente |
| Agentes específicos de ABAP/RAP (`.github/agents/*.agent.md`, `.claude/`) | Reutilizáveis, mas específicos do fluxo SAP-MCP; opcional copiar manualmente se desejar |
| `CLAUDE.md`, `sdd_template.md` (SAP_MCP) | Específicos de outra ferramenta/fluxo; fora do escopo do modelo genérico |
| Instruções globais da organização (nível de conta/tenant) | Impostas pela organização — não exportáveis |
| Caminho absoluto do executável MCP | Específico da máquina — vira placeholder |

## O que precisa ser configurado manualmente no destino

1. Login no Copilot com a conta pessoal do GitHub.
2. Instalação das extensões recomendadas.
3. Preenchimento de `.vscode/mcp.json` (a partir do template), sem cometer o arquivo.
4. Ajuste dos placeholders `Z<PREFIXO>`, `<AJUSTE_SEU_FUSO>`, `<AUTOR>` conforme o projeto.
