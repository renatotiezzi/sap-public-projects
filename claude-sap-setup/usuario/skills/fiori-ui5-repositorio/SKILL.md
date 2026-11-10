---
name: fiori-ui5-repositorio
description: Publica e confere apps Fiori/SAPUI5 no repositório UI5 de um sistema ABAP pelo Speed Up — descobre o serviço, lê o app publicado, planeja o deploy de uma pasta dist, publica em pacote local ($TMP) ou transportável (com a ordem de transporte) com ensaio e releitura, remove o app conferido pelo appHash, e confere o app servido no ICF. Use para levar um app UI5 ao DEV e provar que ele foi publicado e está servido.
titulo: "Fiori/UI5: publicar no repositório do ABAP"
area: fiori
bundles: [ui5]
versao: 1.2.0
ordem: 60
atualizado_em: 2026-10-22
origem:
  - "Sap-Speed-Up/packages/adapters/src/bundles/ui5/manifesto.ts@sha256:dc714e563d66"
  - "Sap-Speed-Up/packages/adapters/src/bundles/ui5/lacunas.ts@sha256:2f44cd96a16f"
  - "Sap-Speed-Up/docs/melhorias/2026-10-22-fiori-f5-publicar.md"
---

# Fiori/UI5: publicar no repositório do ABAP

O bundle `ui5` lê e publica apps SAPUI5 no repositório UI5 do ABAP pela rota oficial: o serviço OData `/UI5/ABAP_REPOSITORY_SRV`, o mesmo que o tooling da SAP usa. Depois, ele confere o app no ICF. A conexão é a `sapgui`, com o mesmo usuário e senha do ADT, e o repositório pede a autorização S_DEVELOP.

**Onde esta skill entra (22/10/2026):** ela é o último passo da `fiori-entrega`, que diz o que vem antes. O app só chega aqui depois de passar no portão da `fiori-testes`: o lint, o manifest validado e os testes. O caminho inteiro do app começa na `fiori-desenho-do-app`.

## O caminho, na ordem

1. **O serviço existe?** `sap.ui5.service.discover`. Ele existe a partir do SAP_UI 753 e precisa estar ativo; se não estiver, a resposta traz a escada (`/IWFND/MAINT_SERVICE` e SICF).
2. **O build:** a pasta a publicar é o `dist` (ou o `webapp`), com o `manifest.json` na raiz. Num app da pasta de apps Fiori, o build vem do portão (`sap.fiori.app.check` com o item `build`); fora dela, é a lacuna `ui5.project.build`.
3. **O plano:** `sap.ui5.app.plan` recebe o `objectName` e o `sourceDir` (o caminho absoluto da pasta) e mostra:
   - os arquivos novos, alterados e removidos, comparados com o publicado;
   - o `sap.app.id` local e o publicado;
   - o `planHash`.

   Ficam de fora `node_modules`, `.git`, `.env`, `*.pem`, `*.key` e atalhos.
4. **O deploy:** `sap.ui5.app.deploy` recebe o `objectName`, o `sourceDir`, o `package` e o `planHash` do plano. Ele precisa de autorização no painel e só roda em DEV, TEST ou SANDBOX.
   - **O pacote:** local (`$TMP` ou outro `$…`), ou transportável com a ordem em `transport` (desde a F5, 22/10/2026). O `sap.abap.transport.info` diz as ordens que servem; o `sap.abap.transport.create` cria uma.
   - **A ordem vai no ensaio e no envio** (`TransportRequest`, como o cliente oficial). O pacote local recusa a ordem, e o transportável sem ela é recusado antes de enviar.
   - **O app que já existe fica no pacote dele:** outro pacote é recusado (`package_mismatch`).
   - Se a pasta mudou desde o plano, ele recusa sem enviar nada: rode o plano de novo.
   - Primeiro um ensaio (`TestMode`), depois o envio: cria (POST) ou atualiza (PUT), com `SafeMode`. Se o app publicado tiver outro `sap.app.id`, o repositório recusa (412).
   - A releitura compara arquivo a arquivo. Texto que volta com o fim de linha trocado é aviso (`normalizado_pelo_repositorio`), não falha.
   - Se a resposta se perder, use `sap_reconcile`: ele lê o marcador `speedup-deploy.json`, que só tem o hash.
5. **A remoção:** `sap.ui5.app.remove` recebe o `objectName`, o `appHash` do `sap.ui5.app.get` com `files: true` e, no pacote transportável, a ordem.
   - **Só apaga o app que foi visto:** o app que mudou depois da leitura não é apagado.
   - **A releitura confirma** que ele saiu.
6. **O ICF:** `sap.ui5.app.check` confere o app em `/sap/bc/ui5_ui5/<namespace>/<app>/`, com o `sap.app.id` esperado.
7. **A tela:** abrir o app e ver o console é a lacuna `ui5.app.open`, no navegador.

## Regras

- **A pasta local passa pela conferência do kernel:** caminho absoluto, uma pasta que existe, nem a raiz do disco, nem o perfil inteiro, nem as pastas do Speed Up.
- **Liberar a ordem de transporte** (levar o app ao QAS) é gesto do usuário: a lacuna `ui5.transportable.deploy` (a SE09).
- **Quando o OData recusa a remoção,** o caminho manual é a lacuna `ui5.app.remove`: o relatório `/UI5/UI5_REPOSITORY_DELETE`, pelo usuário.
- **Nó ICF não criado** depois do deploy é a lacuna `ui5.icf.node`: o SICF.

## Limites

- O bundle está qualificado em fixture (E290, com o deploy com a ordem e a remoção desde a F5). A prova real, com o seu OK, vai em sequência:
  1. a descoberta;
  2. ler um app existente;
  3. o plano e o deploy de um app mínimo `ZSPEEDUP_PROVA` em `$TMP`;
  4. o check;
  5. abrir a tela;
  6. a atualização;
  7. a reconciliação.
- A evidência guarda nomes, contagens e hashes, nunca o conteúdo dos arquivos.

## Fontes (consultadas em 03/10/2026)

- [SAP-docs, OData to the SAPUI5 ABAP Repository](https://github.com/SAP-docs/sapui5/blob/main/docs/05_Developing_Apps/using-an-odata-service-to-load-data-to-the-sapui5-abap-repository-a883327.md): o serviço, o SAP_UI 753 e a autorização.
- [SAP open-ux-tools, ui5-abap-repository-service](https://github.com/SAP/open-ux-tools/blob/main/packages/axios-extension/src/abap/ui5-abap-repository-service.ts): `DownloadFiles=RUNTIME`, PUT ou POST, `TestMode` e `SafeMode`.
- [SAP-docs, Deploying SAPUI5 Applications](https://github.com/SAP-docs/sapui5/blob/main/docs/05_Developing_Apps/deploying-sapui5-applications-to-the-sapui5-abap-repository-a560bd6.md) e [Runtime Aspects](https://github.com/SAP-docs/sapui5/blob/main/docs/05_Developing_Apps/runtime-aspects-4ebecc2.md): o conteúdo do dist e o endereço `/sap/bc/ui5_ui5/<namespace>/<app>/`.
- Speed Up: o bundle `ui5` (as ações, o recorte e as lacunas com escada; desenho 027 §2.3).
- 22/10/2026: a skill mudou para a área "Fiori e UI5" e ganhou a ligação com as skills do app (desenho, anotações, aparência, testes e entrega).
