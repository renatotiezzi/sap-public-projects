---
name: processo-corrigir-abap
description: Fluxo completo de correção SAP/ABAP, do erro relatado até a correção registrada e a versão atual atualizada, com rastreabilidade por pastas de demanda. Use quando o usuário trouxer um erro ou dump e o objeto, esperando o ciclo inteiro de correção.
titulo: "Processo: corrigir um erro ABAP de ponta a ponta"
area: processo
bundles: [adt]
versao: 1.0.1
ordem: 1
atualizado_em: 2026-10-02
origem:
  - "sap-tech-lab/.claude/skills/corrigir-sap/SKILL.md@sha256:ce9960f930a0"
---

# Processo: corrigir um erro ABAP de ponta a ponta

Use quando o usuário informar um erro ou dump e o objeto, esperando o ciclo completo. Exemplo de pedido:

```
Erro: Extended Program Check (SLIN) — Class-based exception is not handled
Objeto: ZPROGRAMA_EXEMPLO
```

## Modelo de pastas da demanda

Cada demanda (por exemplo `<Cliente> - <Ambiente>/<Demanda>`) segue este modelo, salvo regra própria do repositório:

| Pasta | Papel |
|---|---|
| `01_DOCUMENTACAO/` | Especificação, decisões técnicas e notas da demanda |
| `02_CODIGO/` | Código aprovado |
| `03_OBJETOS_ORIGINAIS/` | Baseline **imutável**: nunca editar |
| `03.1_LAST_VERSION/` | Versão atual de cada objeto: a fonte da verdade |
| `04_CORRECOES/` | Uma pasta por correção, com o mesmo nome da pasta do erro |
| `05_ERROS/` | Uma pasta por erro, com `ERRO.md` e o dump/log bruto |

Se o repositório tiver `CLAUDE.md`, `AGENTS.md` ou instruções próprias, elas prevalecem sobre este modelo.

## Fluxo

1. **Localize o objeto atual:** primeiro em `03.1_LAST_VERSION/`, depois em `02_CODIGO/` e por último em `03_OBJETOS_ORIGINAIS/`.
2. **Leia a documentação relacionada** em `01_DOCUMENTACAO/`.
3. **Identifique a causa raiz** do erro (veja `abap-debugging`).
4. **Registre o erro** com `processo-registrar-erro`.
5. **Aplique a correção mínima,** editando primeiro em `03.1_LAST_VERSION/`. Não altere nada fora do escopo do erro e não faça refactor cosmético.
6. **Registre a correção** com `processo-registrar-correcao`.
7. **Atualize `03.1_LAST_VERSION/`** com o objeto corrigido.
8. **Mostre o diff** e informe a assinatura (por exemplo `Assinatura: 07CL`).

## Regras invioláveis

- `03_OBJETOS_ORIGINAIS/` é baseline imutável.
- Correção mínima: só o necessário para resolver o problema apontado, sobretudo em correções de SLIN e ATC.
- Antes de alterar código, verifique o impacto em chamadas `PERFORM`, interfaces de `FORM`, funções, métodos, estruturas, tratamento de exceções, `sy-subrc` e commits.
- Não crie objetos novos sem necessidade.

## Com o Speed Up

- **Sistema novo:** `sap.adt.discovery` confere os serviços ADT que o sistema expõe. Sem ADT habilitado (SICF), boa parte das ações ABAP não funciona.
- **Conferir com o sistema:** com uma conexão `sap-abap`, compare a versão local com a do SAP usando `sap.adt.object.source`, para não corrigir sobre uma versão desatualizada.
- **Aplicar no SAP é outro passo:**
  - para um **programa**, `sap.adt.program.upsert`, só em DEV, TEST ou SANDBOX e com autorização;
  - para os demais objetos, o usuário aplica.
- **Rastreabilidade:** a evidência do Speed Up registra o que foi lido e gravado no SAP; as pastas da demanda registram o raciocínio.
