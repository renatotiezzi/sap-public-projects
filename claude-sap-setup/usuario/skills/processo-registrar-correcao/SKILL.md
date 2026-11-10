---
name: processo-registrar-correcao
description: Registra em 04_CORRECOES a correção de um erro já registrado em 05_ERROS, com rastreabilidade 1:1, cabeçalho de versão no objeto e assinatura do executor. Use depois de corrigir um erro registrado.
titulo: "Processo: registrar uma correção"
area: processo
bundles: []
versao: 1.0.0
atualizado_em: 2026-10-01
origem:
  - "sap-tech-lab/.claude/skills/registrar-correcao-claude/SKILL.md@sha256:842394df5e9c"
---

# Processo: registrar uma correção

Registre a correção do erro indicado, com rastreabilidade 1:1 com a pasta em `05_ERROS/` (modelo de pastas em `processo-corrigir-abap`). Regras próprias do repositório prevalecem.

## Passos

1. **Identifique a pasta do erro** correspondente em `05_ERROS/`.
2. **Defina o nome da pasta de correção:**
   - se a pasta do erro **já existe**, aberta por você ou por outro autor, reuse o nome **exatamente igual**, com ou sem sigla conforme o original. Não acrescente sigla depois;
   - se você está abrindo o par erro + correção agora, siga antes `processo-registrar-erro`.
3. **Crie em `04_CORRECOES/`** a pasta com esse nome idêntico.
4. **Coloque dentro dela apenas:**
   - o objeto corrigido (`.abap` ou outra linguagem, no padrão de export), editado primeiro em `03.1_LAST_VERSION/` e depois copiado para cá;
   - e/ou um `.md` de guia para ações que não são código, como criar elemento de dados, tabela ou entrada de customizing.
5. **No cabeçalho do objeto corrigido,** acrescente a linha de versão: `* V<NN> - <SIGLA> - correção <NN> (DD-MM HHhMM): <descrição>`.
6. **Depois de validar,** copie o objeto corrigido para `03.1_LAST_VERSION/` (substituindo a versão anterior) e, se aprovado, para `02_CODIGO/`.

## Regras

- A correção nunca edita o baseline em `03_OBJETOS_ORIGINAIS/`.
- Não coloque aqui especificação, guia de implementação, dump original ou análise: cada um tem sua pasta.
- Correção mínima: só o necessário para resolver o problema relatado.
- Se a correção introduzir um erro novo, abra um par novo (`NN+1`); nunca consolide no par anterior.
- Ao final, mostre o diff e informe a assinatura, por exemplo `Assinatura: 07CL`, quando o par for seu.

## Com o Speed Up

- Aplicar a correção no SAP é um passo separado e autorizado. Para programa, `sap.adt.program.upsert` (DEV, TEST ou SANDBOX); para os demais objetos, o usuário aplica.
- Depois de aplicar, confirme com `sap.adt.object.source` que o SAP tem a versão registrada.
