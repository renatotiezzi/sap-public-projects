---
name: smartforms-formularios
description: Acha Smart Forms e Smart Styles de um sistema ABAP pelo Speed Up (nome, pacote e descrição) e guia o resto — ler o desenho, editar, ativar, transportar, verificar e testar — pela transação SMARTFORMS, porque nada disso tem interface remota. Use para localizar o formulário certo antes de mexer nele e para conferir depois.
titulo: "Smart Forms: achar e mexer pela escada"
area: abap
bundles: [smartforms]
versao: 1.1.0
atualizado_em: 2026-11-02
origem:
  - "Sap-Speed-Up/packages/adapters/src/bundles/smartforms/manifesto.ts@sha256:8240f918634b"
  - "Sap-Speed-Up/packages/adapters/src/bundles/smartforms/lacunas.ts@sha256:db4abbe2b253"
---

# Smart Forms: achar e mexer pela escada

Smart Forms não têm interface remota publicada para ler, editar, ativar, transportar, verificar ou executar. O módulo de função gerado só roda dentro do ABAP. O bundle `smartforms` faz o que dá para fazer por HTTP: acha os formulários pela busca do ADT, na conexão `sapgui`. O resto é guiado pela transação SMARTFORMS.

## Quando usar

- **Antes de mexer:** achar o formulário certo (nome, pacote e descrição).
- **Depois que o usuário mudou:** conferir que o formulário está no pacote certo.

## Achar

`sap.smartforms.forms.find`:
- `query`: o nome ou um padrão com `*` (padrão `Z*`). Vai em maiúsculas.
- `kind`: `form` (padrão; Smart Forms, `SSFO`) ou `style` (Smart Styles, `SSST`).
- `package`: só os de um pacote; com `*` no fim, os pacotes que começam assim.
- `maxResults`: até 200 (padrão 50).

A resposta traz nome, pacote, descrição e URI de cada um.

## O resto, pela escada

Cada pedido abaixo responde a lacuna com a escada única do Speed Up ([sap-gui-web-abrir › A escada](../sap-gui-web-abrir/SKILL.md#a-escada-a-regra-unica)). O Claude abre a transação certa pelo `sap_gui_abrir` e faz o trabalho na tela. Gravar, ativar e liberar só acontecem no DEV com a escrita autorizada, e a liberação só com o pedido do usuário. O SAP GUI desktop fica para o que o Web GUI não mostra. O usuário só age quando o SAP recusa pela autorização dele ou quando a gravação está fora do que a guarda libera.
- **Ler o desenho, criar, alterar, ativar** (e os estilos): `smartforms.form.edit`, na SMARTFORMS (ou na SMARTSTYLES).
- **Transportar:** `smartforms.form.transport`, na SE09.
- **Verificar:** `smartforms.form.check`, na SMARTFORMS → Verificar.
- **Executar, imprimir ou pré-visualizar:** `smartforms.form.render`, na SMARTFORMS → Testar (F8).

Depois, `sap.smartforms.forms.find` confere pelo Speed Up.

## Limites

- **No BTP ABAP Environment não existem Smart Forms:** a busca diz isso.
- **Executar por HTTP exige um executor no DEV** (`ZCL_SPEEDUP_SSF_RUN`, em `$TMP`). Ele só será feito com a sua aprovação (a Q3 do desenho 027).
- O bundle está qualificado em fixture. A primeira prova real é a busca no DEV.

## Fontes (consultadas em 03/10/2026)

- Speed Up: o bundle `smartforms` (a busca e as lacunas com a escada única; desenho 027 §2.5).
- A busca ADT (`repository/informationsystem/search`, com o tipo de objeto) é a mesma do Eclipse.

## Histórico de versões

| Versão | Data | O que mudou |
|---|---|---|
| 1.1.0 | 2026-11-02 | O resto pela escada única: o Claude abre a SMARTFORMS pelo sap_gui_abrir e faz o trabalho; o usuário só na recusa pela autorização ou fora da guarda (SU-WI-220, #522) |
