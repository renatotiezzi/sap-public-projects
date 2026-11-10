---
name: cpi-value-mapping
description: Cria, implanta e lê Value Mappings do SAP Cloud Integration pelo Speed Up, com as regras que o tenant cobra (padrão em mapeamento N:1, sem atualização de conteúdo, global no runtime). Use quando uma tabela de correspondência (origem → destino) for virar Value Mapping, ou para entender um Value Mapping existente.
titulo: "CPI: Value Mapping"
area: cpi
bundles: [cpi]
versao: 1.1.0
ordem: 35
atualizado_em: 2026-10-03
origem:
  - "Sap-Speed-Up/docs/melhorias (achados de campo de 29/09/2026, #16, #18 e #19)@sha256:0471abd827a7"
---

# CPI: Value Mapping

Value Mapping é a tabela de correspondência do CPI: para um par **agência/identificador** de origem, o valor do outro lado. Ele substitui tabela fixa em Groovy ou em parâmetro JSON e pode ser mantido sem mexer no iFlow. Mas tem regras que o tenant cobra só na hora do deploy, e o conteúdo **não se atualiza** pela API.

## Quando usar

- Ao trocar uma tabela de correspondência exata, hoje em script ou parâmetro, por Value Mapping.
- Ao investigar por que um Value Mapping não implanta ou não devolve o valor esperado.

## Com o Speed Up

- **Ler:** `sap.cpi.valuemapping.get` traz metadados, identificadores, os pares agência/identificador e o estado no runtime. A tabela só vem quando pedida (`includeContent`) e nunca vai para a evidência.
- **Criar:** `sap.cpi.valuemapping.upsert` (Id, pacote e o ZIP em base64).
  - Antes de enviar, ele confere o ZIP: o MANIFEST tem `SAP-BundleType: ValueMapping` e `Bundle-SymbolicName` igual ao Id, e o `value_mapping.xml` está bem formado (`<vm version="2.0">`, grupos com `<entry>` de agência, schema e valor).
  - Ele confere o N:1: sem o padrão, recusa antes de enviar (`n_para_1_sem_padrao`), dizendo o valor e os grupos.
  - Ele relê o que ficou no tenant.
  - Um Id que já existe em outro pacote é `target_mismatch`, e um pacote protegido é recusado.
- **Implantar:** `sap.cpi.valuemapping.deploy` acompanha o build e o runtime até STARTED (ou o erro com a causa). "Em andamento" no prazo não é sucesso.
  - Antes do envio, ele confere o N:1 no conteúdo do designtime e recusa sem o padrão.
  - Numa falha HTTP, o resumo traz o motivo que o tenant deu.
- **Escrita só em DEV, TEST ou SANDBOX,** com autorização no painel.

## Regras que o tenant cobra

- **N:1 precisa de padrão:** quando várias origens apontam para o **mesmo destino**, marque `isDefault="true"` na origem de **um** dos grupos de cada conjunto. O padrão só vale para a consulta inversa.
  - Sem ele, o tenant recusa o **deploy com HTTP 500**, sem motivo no corpo (achado real #18 de 29/09).
  - O Speed Up confere antes: o upsert e o deploy recusam com `n_para_1_sem_padrao`.
  - O 1:N (uma origem para vários destinos) é o mesmo caso no outro sentido: o padrão vai num dos destinos.
- **O conteúdo não se atualiza:** a API não tem PUT para Value Mapping. O Speed Up não apaga e recria, então:
  - mesmo conteúdo no mesmo pacote: nada é enviado (`sem_mudanca`);
  - conteúdo diferente: recusa (`atualizacao_nao_suportada`). Os caminhos são:
    - criar com **outro Id** (por exemplo, sufixo `_V2`) e implantar depois que o antigo sair do runtime, se os pares forem os mesmos;
    - ou o usuário edita no editor do CPI, pelo navegador, e o deploy volta pelo Speed Up.
- **É global no runtime:** os fluxos consultam pelo par agência/identificador, não pelo Id. Por isso:
  - um par que já está num Value Mapping **implantado** de pacote protegido barra o deploy (`protected_runtime_target`);
  - a comparação não diferencia maiúscula de minúscula.
- **Nomeie pelo papel no negócio,** não pelo projeto: o mesmo par pode servir a vários fluxos.

## Limites

- Apagar Value Mapping, ou um par só, não existe no Speed Up. É passo do usuário no editor do CPI.

## Fontes

- Speed Up: o achado #16 (as três ações de Value Mapping, com as regras de criação, deploy e proteção), o #18 (N:1 sem padrão cai no deploy; desde 03/10, o Speed Up confere antes) e o #19 (sem atualização de conteúdo), registrados nos achados de campo de 29/09/2026 em `docs/melhorias/`. São provas reais num tenant DEV.
