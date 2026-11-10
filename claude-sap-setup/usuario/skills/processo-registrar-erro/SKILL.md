---
name: processo-registrar-erro
description: Registra um erro ou dump na pasta 05_ERROS da demanda, com numeração única, data, hora e assinatura do executor, para manter a rastreabilidade. Use quando o usuário trouxer um erro, dump ou log a investigar.
titulo: "Processo: registrar um erro"
area: processo
bundles: []
versao: 1.0.0
atualizado_em: 2026-10-01
origem:
  - "sap-tech-lab/.claude/skills/registrar-erro-claude/SKILL.md@sha256:d142528ffca2"
---

# Processo: registrar um erro

Registre o erro ou dump fornecido pelo usuário seguindo o modelo de pastas da demanda (veja `processo-corrigir-abap`). Se o repositório tiver regras próprias (`CLAUDE.md`, `AGENTS.md`), elas prevalecem.

## Passos

1. **Identifique a demanda atual** (por exemplo `<Cliente> - <Ambiente>/<Demanda>`) pelo contexto. Se não estiver claro, pergunte.
2. **Calcule o próximo número `NN`:** olhe **todas** as pastas em `05_ERROS/` e `04_CORRECOES/` da demanda, de qualquer autor, e use o maior número + 1. A sequência é **única por demanda** e nunca reutiliza um número.
3. **Pegue data e hora atuais** no fuso do projeto. No Windows PowerShell: `Get-Date -Format "dd-MM HH'h'mm"`.
4. **Crie a pasta** `05_ERROS/<NN> - <SIGLA> - <DD-MM> - <HHhMM> - <descrição curta>/`.
   - A sigla identifica o executor, por exemplo `CL` (Claude), `CX` (Codex) ou `CP` (Copilot).
   - A sigla é um segmento separado, não colado ao número, para a pasta ordenar certo no explorador.
5. **Salve o dump ou log bruto** dentro dela, exatamente como recebido.
6. **Crie `ERRO.md`** com as seções:
   - **Contexto:** execução, usuário, ambiente, entrada e arquivos analisados;
   - **Sintoma:** tabela "o que deveria acontecer × o que aconteceu";
   - **Causa raiz:** explicação técnica com os trechos de código relevantes;
   - **Evidências:** saídas, consultas de tabela, prints;
   - **Impacto:** severidade em produção e em teste;
   - **Referências:** caminhos dos objetos e da correção proposta.

## Regras

- Não altere `03_OBJETOS_ORIGINAIS/`.
- Não apague registros antigos de `05_ERROS/`, seus ou de outro autor.
- Nunca reutilize um número nem renomeie pastas existentes para pôr ou tirar a sigla.
- **Sem segredo:** remova senha, token ou dado pessoal do dump antes de salvar, e diga o que foi removido.
- Ao final, informe o nome exato da pasta criada (para reusar na correção) e a assinatura, por exemplo `Assinatura: 07CL`.
