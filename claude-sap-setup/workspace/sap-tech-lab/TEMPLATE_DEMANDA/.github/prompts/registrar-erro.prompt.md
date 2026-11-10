---
mode: agent
description: Registrar um erro/dump em 05_ERROS seguindo o modelo de rastreabilidade
---
# Registrar erro

Registre o erro/dump fornecido seguindo o modelo de trabalho deste repositório.

## Passos

1. Descubra o próximo `NN` livre em `05_ERROS/` da demanda atual (dois dígitos,
   sequencial, nunca reutilizar).
2. Obtenha data/hora atuais no fuso do projeto:
   - Windows PowerShell: `Get-Date -Format "dd-MM HH'h'mm"`.
3. Crie a subpasta `05_ERROS/<NN> - <DD-MM> - <HHhMM> - <descrição curta>/`.
4. Salve o dump/log bruto exatamente como recebido.
5. Crie `ERRO.md` com as seções:
   - **Contexto**: execução, usuário, ambiente, entrada, arquivos analisados.
   - **Sintoma**: tabela "o que deveria acontecer × o que aconteceu".
   - **Causa raiz**: explicação técnica com trechos de código relevantes.
   - **Evidências**: outputs, snapshots de tabela, prints.
   - **Impacto**: severidade em produção e em teste.
   - **Referências**: caminhos dos objetos e da correção proposta.

## Regras

- Não altere objetos originais em `03_OBJETOS_ORIGINAIS/`.
- Não apague entradas antigas de `05_ERROS/`.
- Ao final, informe o nome exato da pasta criada para reuso na correção.
