# Copilot Setup Export

Pacote **portável** para reproduzir, em outro computador e em outra conta pessoal
do GitHub, o mesmo modelo de trabalho com o GitHub Copilot:

- Organização por demanda (`GAP_<numero>` / `TICKET_<numero>`).
- Fluxo **erro → correção** com rastreabilidade 1:1.
- Instruções, prompts e templates do Copilot.
- Configurações portáveis do VS Code (sem credenciais).

> Este pacote é **genérico**. Não contém tokens, senhas, URLs privadas, dados de
> cliente nem informações corporativas. Onde havia algo específico, foi
> transformado em placeholder `<...>`.

## Conteúdo

```
export setup/
  README.md                      este guia
  MANIFEST.md                    lista de cada item, origem e finalidade
  SETUP_BLUEPRINT.md             blueprint p/ a IA recriar toda a estrutura
  .github/
    copilot-instructions.md      regras do modelo de trabalho (repo-wide)
    instructions/
      error-correction-workflow.instructions.md
      abap.instructions.md
    prompts/
      registrar-erro.prompt.md
      registrar-correcao.prompt.md
  .vscode/
    settings.json                configurações portáveis
    extensions.json              extensões recomendadas
    mcp.json.template            config MCP SANITIZADA (placeholders)
  docs/
    ORGANIZATION_GUIDE.md        guia de organização (genérico)
  templates/
    GAP_TEMPLATE/                estrutura padrão de uma demanda (com READMEs)
    ERRO_TEMPLATE.md
    CORRECAO_GUIA_TEMPLATE.md
    CENARIO_VALIDACAO_TEMPLATE.md
    AGENTS.md.template
```

## Passo a passo — instalar em outro computador / outra conta GitHub

### 1. Pré-requisitos
- VS Code instalado.
- Assinatura do GitHub Copilot ativa na **sua conta pessoal**.
- (Opcional) Servidor MCP, se for usar integração com backend.

### 2. Copie este pacote
Leve a pasta `export setup/` para o novo computador (pen drive, repo Git
pessoal, etc.). Basta o `SETUP_BLUEPRINT.md` para reproduzir tudo.

### 3. Deixe a IA recriar a estrutura (recomendado)
Abra um repositório vazio no VS Code com o Copilot e peça:

> "Leia o `SETUP_BLUEPRINT.md` e recrie exatamente toda a estrutura e todos os
> arquivos descritos, mantendo os placeholders."

O blueprint contém a árvore de diretórios, as regras do modelo de trabalho e o
conteúdo verbatim de cada arquivo, incluindo:
- `.github/`, `.vscode/` (sem credenciais), `docs/`, `templates/`.
- `AGENTS.md` na raiz.
- `.gitignore` protegendo `mcp.json`.

### 4. Abra no VS Code e conclua manualmente
1. Abra `C:\dev\meu-projeto` no VS Code.
2. Instale as **extensões recomendadas** (aviso automático do VS Code).
3. Faça login no Copilot com **sua conta pessoal do GitHub**.
4. Preencha `.vscode/mcp.json` com seus dados (placeholders `<...>`). Prefira
   `${input:...}` a senha em texto puro. **Não** cometa esse arquivo.

### 5. Use o modelo de trabalho
- Nova demanda: copie `templates/GAP_TEMPLATE/` para `GAP_<numero>/` (ou use o
  script com `-DemandName`).
- Ao encontrar um erro: use o prompt `registrar-erro` (cria pasta em
  `05_ERROS/` com `ERRO.md`).
- Correção: use o prompt `registrar-correcao` (cria pasta espelhada em
  `04_CORRECOES/`).
- Rastreabilidade 1:1 é mantida pelo nome idêntico das pastas.

## Como funcionam instruções e prompts no Copilot
- `.github/copilot-instructions.md` — aplicado automaticamente a todo o repo.
- `.github/instructions/*.instructions.md` — aplicado conforme `applyTo`.
- `.github/prompts/*.prompt.md` — invocados sob demanda no chat do Copilot.
- Requer no VS Code: `chat.promptFiles: true` e
  `github.copilot.chat.codeGeneration.useInstructionFiles: true` (já em
  `settings.json`).

## Camadas de configuração (o que migra e o que não migra)

| Camada | Onde vive | Migra com este pacote? |
|---|---|---|
| Config do repositório | `.github/`, `AGENTS.md`, `docs/`, `templates/` | ✅ Sim |
| Config local do VS Code | `.vscode/settings.json`, `extensions.json` | ✅ Sim (sem segredos) |
| Config MCP com credenciais | `.vscode/mcp.json` | ⚠️ Só o **template**; preencha manualmente |
| Config vinculada à conta GitHub | Assinatura Copilot, login, settings sync | ❌ Refazer login com sua conta |
| Políticas da organização | Regras/políticas corporativas do tenant | ❌ Não exportável |

Ver `MANIFEST.md` para o detalhamento item a item.

## Segurança
- Nunca cometa `.vscode/mcp.json` preenchido (já está no `.gitignore`).
- Não guarde tokens, senhas, cookies ou URLs privadas no repositório.
- Não copie dados de cliente ou documentação confidencial para cá.
