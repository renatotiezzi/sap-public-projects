---
name: abap-testes-unitarios
description: Cria ou revisa testes ABAP Unit que protegem o comportamento de negócio com pouco acoplamento. Use em proteção contra regressão, desenho de testes, refatoração testável ou aumento de cobertura.
titulo: "ABAP: testes unitários (ABAP Unit)"
area: abap
bundles: [adt, rap]
versao: 1.0.0
atualizado_em: 2026-10-01
origem:
  - "sap-tech-lab/Library - Dev completed/Setup antigo - 2026-07-29/skills/unit-test/SKILL.md@sha256:90c630b1ff91"
---

# ABAP: testes unitários (ABAP Unit)

Testes que protegem o comportamento de negócio, com pouco acoplamento à implementação.

## Quando usar

- Proteção contra regressão antes ou depois de uma mudança.
- Desenho de testes para código novo.
- Refatoração para tornar o código testável.
- Aumento de cobertura.

## Prioridades

- Teste o comportamento, não detalhes de implementação.
- Isole as dependências.
- Mantenha os testes determinísticos.
- Use fixtures pequenas.
- Estrutura clara: preparar, agir, verificar.

## Regras

- Métodos de teste pequenos; um comportamento por teste quando for prático.
- Evite asserções frágeis que dependem de formatação sem relação com o caso.
- Use dublês para dependências externas (banco, RFC, APIs) quando necessário.
- Dados de teste que deixem a intenção óbvia.

## Com o Speed Up

- **Rodar os testes de uma classe:** `sap.rap.unit.run` executa o ABAP Unit pela API publicada, sobre uma conexão `sap-abap`, quando o sistema expõe essa API. É execução remota: só em DEV, TEST ou SANDBOX e com autorização.
- **Ler a classe e os includes de teste:** `sap.adt.object.source` e `sap.adt.object.structure`.
- **Lacuna conhecida:** criar o include de teste de uma classe ainda não é ação do Speed Up. Entregue o código do teste para o usuário aplicar e depois rode-o com `sap.rap.unit.run`.

## Limites

- Teste verde não prova o comportamento de ponta a ponta; registre o que ficou fora.
- Não escreva teste que só repete a implementação.
