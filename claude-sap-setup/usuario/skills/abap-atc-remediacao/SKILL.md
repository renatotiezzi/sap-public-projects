---
name: abap-atc-remediacao
description: Corrige achados do ATC com segurança, identificando causa raiz, risco de negócio e a correção menos invasiva. Use em achado ATC, problema de qualidade de código ou pedido de adequação de código ABAP.
titulo: "ABAP: correção de achados do ATC"
area: abap
bundles: [adt]
versao: 1.1.0
atualizado_em: 2026-11-02
origem:
  - "sap-tech-lab/Library - Dev completed/Setup antigo - 2026-07-29/skills/atc-remediation/SKILL.md@sha256:b562346df20d"
---

# ABAP: correção de achados do ATC

Resolver achados do ATC **sem mudar o comportamento de negócio válido**.

## Quando usar

- Achado do ATC (ou do SLIN) a corrigir.
- Pedido de adequação ou limpeza de código ABAP.

## Verificações obrigatórias

Para cada achado, identifique:

- objeto afetado;
- categoria do achado;
- nível de risco;
- causa raiz;
- estratégia de correção.

## Prioridade

1. Sintaxe.
2. Segurança.
3. Performance.
4. Código limpo.
5. Nomenclatura.

## Regras

- **Não suprima achado** sem justificativa registrada. Isenção é decisão de outra pessoa, não do executor.
- Prefira a menor mudança segura.
- Preserve o comportamento e a semântica dos dados.
- Valide a correção depois de aplicar.

## Com o Speed Up

- **Ler o objeto e o contexto do achado:** `sap.adt.object.source` e `sap.adt.object.structure`, sobre uma conexão `sap-abap`.
- **Gravar a correção de um programa:** `sap.adt.program.upsert`, só em DEV, TEST ou SANDBOX e com autorização.
- **Rodar o ATC e ler os achados:** `sap.abap.atc.run` e `sap.abap.atc.worklist` (os argumentos em `sap_capabilities`, prefix `sap.abap.atc`). Depois da correção, rode de novo e compare. Se a API não chegar, siga a escada única (skill sap-gui-web-abrir › A escada): o Claude abre a transação ATC pelo `sap_gui_abrir`.
- **Rastreabilidade:** registre cada correção com `processo-registrar-erro` e `processo-registrar-correcao`.

## Limites

- Uma correção que muda o comportamento deixa de ser adequação: pare e confirme.
- Não junte vários achados não relacionados numa mudança grande.

## Histórico de versões

| Versão | Data | O que mudou |
|---|---|---|
| 1.1.0 | 2026-11-02 | O ATC já é ação do Speed Up (sap.abap.atc.run e worklist); a tela pela escada única (SU-WI-220, #522) |
