---
name: gts-funcional
description: O funcional do SAP Global Trade Services, edition for SAP HANA (GTS E4H 2023/2025), e a conversão do GTS 11.0 para ele. Cobre a arquitetura com o alimentador (ECC ou S/4), o Compliance (SPL, embargo, legal control e licenças), o Customs (declaração de exportação e ATLAS), o cálculo de imposto e a classificação, a preferência na UE (LTSD), o Intrastat, a conversão (readiness, Simplification List, SUM), os testes, a reconciliação e as armadilhas. Use para desenhar, configurar, converter, testar, investigar ou estimar um projeto GTS.
titulo: "SAP GTS E4H: o funcional e a conversão do 11.0"
area: arquitetura
bundles: [adt, smartforms, ui5]
versao: 1.1.0
atualizado_em: 2026-11-06
origem:
  - "Pesquisa de 03/11/2026: o User Guide do SAP GTS E4H 2025 SP00 (help.sap.com, PDF de 616 páginas), o SAP Learning, KBAs e notas da SAP, a SAP Community, o SAPinsider, a SAP Press e parceiros (as 35 fontes na seção Fontes)"
---

# SAP GTS E4H: o funcional e a conversão do 11.0

O GTS é um sistema separado, alimentado por outro sistema (o feeder: ECC, S/4HANA, S/4HANA Cloud, EWM, TM ou um ERP de outro fornecedor). Ele recebe os mestres e os documentos de lá, faz o compliance e o comércio exterior e devolve o bloqueio ou a liberação [1].

No E4H 2025 as áreas são: Products and Classification, Compliance Management, Customs Management, Preference Management e Intrastat [1]. O GTS 11.0 saiu da manutenção principal em 31/12/2025 [17][27].

## Quando usar

- Desenhar, revisar ou estimar um projeto GTS: implantação, conversão do 11.0 ou extensão a um país.
- Levantar o estado atual (AS-IS) do GTS: o que está configurado e em uso.
- Montar o plano de testes, a reconciliação da conversão e o cutover.
- Investigar um documento bloqueado, uma declaração rejeitada ou uma triagem errada.

## 1. A arquitetura

- **O alimentador:**
  - No ECC, precisa do plug-in SLL_PI (o E4H 2023 pede o SLL_PI 900) [8][31].
  - No S/4 on-premise, a função já vem no núcleo [8].
  - Um não-SAP pode chamar a interface direto [1].
- **O que vai ao GTS:**
  - Mestres: produto, parceiro e BOM. A BOM vai top-down ou bottom-up, para a preferência [1][12].
  - Documentos, que viram documentos aduaneiros: ordem, remessa de saída, pedido, remessa de entrada, entrada e saída de mercadoria, fatura e ordem de frete do TM [1].
- **O bloqueio volta ao alimentador.**
  - A ordem e a remessa bloqueadas aparecem em `/SAPSLL/MENU_LEGALR3`, com o log do GTS [1].
  - Para exibir o log, a RFC usa usuário tipo A, ou uma RFC só de exibição [1].
  - Há um índice de recuperação: se o documento estiver em edição no GTS, o alimentador grava mesmo assim e a mudança segue depois [1].
- **A base técnica:**
  - O E4H 2023 é o GTSCORE 200 sobre o S/4HANA Foundation 2022; o 2025 pede o Foundation 2025 e o Fiori FES 2025 [1][5][8].
  - O Fiori vem no UIGRCGTS [8].
  - O componente antigo era o SLL-LEG [5].
- **A coimplantação:** o E4H pode ficar no mesmo sistema de um S/4 2022 ou superior. O GTS 10.x/11.0 no mesmo S/4 não é suportado [8]. Com o E4H já coimplantado num S/4, não se converte depois um ECC para esse S/4 [4].
- **O que muda para o usuário:**
  - O parceiro é o Business Partner, com função por área [1].
  - A UI é o Fiori Launchpad [1][27].
  - Transações antigas ficam bloqueadas, como `/SAPSLL/LCLIC05_IMP` e `_EXP` [22].
  - A antiga "Risk Management" foi reorganizada: a preferência virou área própria, e o Intrastat também é área [1][19].

## 2. Compliance Management

**SPL (triagem de listas de sanção)** [1][9][10]:
- **As listas:**
  - Vêm do provedor de conteúdo em XML: a carga completa, depois o delta ou a lista inteira.
  - A carga é pela `/SAPSLL/SPL_UL01` ou pelo app Manage SPL Master Data.
  - Quem sai da lista ganha a data de retirada como fim de validade.
  - Uma lista própria precisa de um provedor manual cadastrado como BP.
- **A configuração:** o regulamento legal (como o de exemplo SPLUS) e os tipos de lista por regulamento.
- **A busca:**
  - A busca HANA é a recomendada e dispensa os termos de comparação. A busca GTS gera, avalia e agrega termos. O TREX saiu [1][9].
  - No 2025 entram a triagem do nome c/o, o regulamento ativo no parceiro, os números de identificação, SWIFT/BIC, banco e titular da conta [1].
- **Quando a triagem roda:**
  - Síncrona ou assíncrona, por parceiro e por tipo de documento.
  - Em job: a periódica de todos os parceiros e a delta dos endereços alterados.
  - Se nada mudou desde a última liberação manual, vale a decisão anterior. A triagem se refaz quando muda a lista, o endereço ou o customizing [1].
- **A liberação:**
  - Pelos apps Manage Business Partners – SPL Screening (o Manage Blocked Business Partners ficou obsoleto no 2025) e Manage Blocked Documents [1].
  - As ações: Release, Confirm Block (com motivo, no 2025), Set Processor, Run SPL Screening e Add to List.
  - Lista positiva: nunca bloqueia enquanto os dados não mudam. Lista negativa: sempre bloqueia [1].
  - O motivo e o comentário podem ser obrigatórios, e há audit trail.
- **Mudanças no 2025:**
  - o status SPL não muda mais na transação BP;
  - há ações em massa;
  - os funcionários (papel BUP003) também são triados (nota 3550506) [1].
- **Endereços avulsos:** Check General Address e Check External Addresses Offline [9].
- **Não suportado:** Case Management [9].

**Embargo** [1]:
- Quatro níveis:
  - o país;
  - regulamento × país;
  - regulamento × origem e destino;
  - regulamento × país × região (novo no 2025).
- O app é Manage Embargo Situation, e o bloqueio vale para documentos e pagamentos.

**Legal control e licenças** [1][13]:
- **O regulamento:** o de exportação segue o país de saída e o de importação o de destino. Ele define a sequência de determinação, os tipos de licença e o ECCN.
- **A classificação:**
  - O produto recebe a classe de controle (ECCN, dual-use) pelo upload XML (Upload Control Classes, sem edição depois) ou pelo Manage Control Classes.
  - Produto nunca classificado fica bloqueado por precaução [13].
- **As licenças:**
  - O app é Manage Licenses. A licença é baixada por valor ou quantidade, e há agreements (ITAR).
  - Também há o monitor, a general license e a simulação de legal control antes da ordem, que também dispara a SPL.
  - No 2025: o relatório marca a licença vencida como "Expired", e a licença coletiva ganhou validade por produto [1].
- **Produtos perigosos:** a checagem é com o SAP Product Safety [1].

## 3. Customs Management

**Exportação** [1]:
- O processo cobre a declaração de exportação, o trânsito, a determinação de documentos e o compliance integrado no documento aduaneiro.
- **Os apps:**
  - Display/Manage Export Declarations. No 2025 entram as propostas "Check message processing log" e "Release after exemption" e o emergency procedure.
  - Exit Confirmations Overdue.
- **A comunicação:**
  - A aba Communication segue a sequência de atividades do customizing: mensagens eletrônicas e impressas, com Execute, Repeat e Deactivate.
  - Há logs de processamento e de determinação, a mensagem EDI/XML original e o anexo (o EAD).
  - Há fallback e e-mail ao receber mensagem.
- **A agregação de itens** pelo esquema oficial reduz o EAD. Depois da liberação, os campos travam [1].

**Alemanha: ATLAS** [16]:
- **O fluxo:** o GTS gera o IDoc, o conversor EDI (tipicamente o Seeburger) mapeia e envia ao ATLAS. A resposta volta como IDoc e o reconhecimento fica como prova.
- **As mensagens da era ATLAS 2.x:**
  - envio: M0940 e M0910;
  - retornos: I2400 (status), I2410 (liberação), E0010 (EAD/MRN), E0011 (prova de saída) e I2430 (erro).
- **O customizing:** o message type `/SAPSLL/CUS_EXP`, o esquema, o EDI, a incompletude e as ações PPF.
- **Os mestres:** os números do declarante (BIN/TIN) e as estâncias aduaneiras.
- **O IDoc** se vê no próprio documento (Goto › IDocs) [1].
- **ATLAS AES 3.0:** confira o nível do E4H e o prazo do conversor no planejamento (KBA 3404291) [35]. Os nomes novos das mensagens estão em "Não confirmado".

**Importação** [1]:
- pré-declaração;
- declaração antes ou depois da entrada de mercadoria;
- regimes especiais: entreposto e aperfeiçoamento ativo e passivo;
- impostos especiais (excise);
- o despachante.

O monitor dos documentos e transações é o Operative Monitoring [1].

## 4. Cálculo de imposto, classificação e UoM

- **O cálculo de imposto:**
  - Do valor aduaneiro (mercadoria, frete, seguro, embalagem e BAdIs) e da taxa, pela combinação geográfica com a classificação [1].
  - O customizing é Define Type of Customs Duty e Define Calculation Procedure.
  - Na UE, mostra também o imposto de importação sobre o faturamento e o valor estatístico.
  - A simulação compara até 3 alternativas, e os custos de cabeçalho são distribuídos nos itens [1].
- **Tarifa e TARIC:**
  - Os mestres: commodity codes, tariff numbers, measures, duty rates e number sets [1].
  - Os uploads XML: `/SAPSLL/LLNS_UPL101` (tarifa) e `/SAPSLL/LLNS_MEA_UPL` (medidas UE e nacionais). A worklist sai pela `/SAPSLL/CD_WL_DISP` e a `/SAPSLL/CD_GENERATE` [14][34].
- **A classificação:** Classify Products, Reclassify (manual ou por XML), Check Product Classification e Manage Worklist for Products [1].
- **A UoM:** o peso acumulado usa a unidade do primeiro item e converte os demais. Unidade sem conversão no produto quebra o cálculo [1].
- **O conteúdo de provedor:**
  - O Descartes/CustomsInfo traz o HTS de mais de 190 países, ECCN, mais de 270 acordos e as denied parties [26].
  - A comunidade cita também o MK Data para a SPL.
  - O contrato e as credenciais costumam ser do cliente.

## 5. Preferência na UE (LTSD)

- **Declarações de fornecedor (entrada)** [11]:
  - Os pedidos saem do pedido de compra e da entrada de mercadoria (`/SAPSLL/LTSDREQ_1` ou o programa `/SAPSLL/CREATE_LTSD_REQUESTS`).
  - A renovação anual é a `/SAPSLL/LTSDREQ_2`, e o app é Manage Requests – Long-Term Supplier's Declarations.
  - A relevância é definida em Manage Preference Properties – Suppliers. Fornecedor de país terceiro nunca é relevante.
- **A agregação** [1][11]:
  - Pior caso entre as LTSD liberadas e as entradas. A origem de país terceiro torna o produto não originário.
  - Há dois métodos: A, as LTSD e as entradas no pior caso; e B, as LTSD vindas das entradas e as entradas.
  - O resultado vai à aba Preference Statement do produto e fica no Display Aggregation Log.
- **A determinação** [1][12]:
  - Pela BOM, fixa ou configurável, explodida top-down ou bottom-up.
  - O preference model é por planta ou entre plantas, com o maior preço (pior caso).
  - Os métodos são o net cost e o transaction value (o limite contra o ex-works das faturas).
  - O indicador pode voltar ao alimentador.
  - Os programas são `/SAPSLL/PREF_AGREEMNTS_SYNC_R3` e `/SAPSLL/PRE_SETTINGS_DISTR`.
- **A LTSD de saída** [1][11][18]:
  - A proposta sai do faturamento (`/SAPSLL/LTSDOUT_1`).
  - Há motivos de reemissão, com o job `/SAPSLL/PROCESS_RIR_TRIGGERS`.
  - A LTSD é trocada entre unidades administrativas (intercompany).
- **No 2023:** o add-on IBPP do 11.0 passou a vir embutido. A classificação e a LTSD são as áreas com mais diferença funcional na conversão [28].
- **Começar de um template** de outra entidade ajuda. Mesmo assim, é preciso adaptar a BOM, os custos, os identificadores, a UoM, a LTSD, as saídas e o regulamento da nova entidade.

## 6. Intrastat

- Declaração para os países da UE, mais GB, pelos apps Manage Providers of Information e Manage Intrastat Declarations (o arquivo no formato de cada país) [1].
- Os papéis de BP:
  - SLLPOI: o provedor da informação, com endereço e IVA;
  - SLLSTL: a pessoa responsável;
  - SLLTPD: o declarante terceiro [1].
- Não há replicação de documento: o alimentador seleciona pela `/SAPSLL/IS_SD` e a `/SAPSLL/IS_MM` e grava no GTS [15].
- O S/4 public cloud faz o Intrastat nele mesmo e não transfere [25].
- **Alemanha:** a entrega muda do IDEV para o eSTATISTIK.CORE em 2027. Confirme no plano.

## 7. A conversão do 11.0 para o E4H

- **As abordagens:**
  - **Brownfield**, a conversão pelo SUM, com dados, customizing e código Z, é a mais usada. Com banco não-HANA, é o SUM DMO [3][4].
  - Também existem o greenfield e a migração seletiva [3][27].
  - Na coimplantação com o S/4: desinstalar o GTS antigo, subir a base e instalar o E4H [8].
- **O que a SAP exige** (Conversion Guide e Simplification List 2025, conferidos em 06/11/2026):
  - SUM 2.0 SP023 ou mais, SPAM 92 ou mais e ST-PI 740 SP20 ou mais; sistema Unicode; alvo no HANA 2.0.
  - O Maintenance Planner é obrigatório, porque gera o stack do SUM. O Zero Downtime Option não é suportado.
  - O guia não cita o ATC: o código e o customizing se adaptam no DEV, em ordens, e o uso de `/ECRS/` sai antes da conversão.
  - **O alvo é um produto novo, não um sucessor:** o menu Easy Access, os papéis padrão antigos, os Web Dynpro, o Data Aging, o Case Management e o TREX saem; Restitution e Letter of Credit não são convertidos.
  - **Sai também:** o Tax Transaction Engine (a categoria `T0`; vale a `NT`), o portal web e o XI da LTSD, a zona Pan-Euro-Med na emissão da LTSD, a classificação de controle de importação e as worklists do Intrastat. As interfaces de upload mudam (`/SAPSLL/NSC_NUM_UPLOAD_101`): confirme com o provedor de conteúdo.
- **Depois da conversão** (Conversion Guide, 2.5):
  - `/SAPSLL/SPL_HANA_SPLMD_CONVERT`, obrigatório, uma vez;
  - `/SAPSLL/SPL_UPDATE_STSPL`, ou a triagem periódica se a auditoria era a clássica;
  - rechecar todos os documentos, para preencher `/SAPSLL/CUITBLR`;
  - `/SAPSLL/SPL_GEN_CPY_MATCH_DAT`, para a auditoria das ocorrências antigas;
  - definir os motivos de liberação e salvar os controles de embargo e SPL em cada regulamento;
  - `/ECRG/ITNUM_UPDATE`; o parceiro `SLLPOI` e os formatos novos do Intrastat;
  - opcional: `/SAPSLL/PRE_MIG_LTSD_*`, `/SAPSLL/PRE_MIG_PARTNER_PROP` e `/SAPSLL/PRE_MIG_IBVD`.
- **A ordem da SAP** [6][7]:
  1. **O readiness check:** a nota 2964245 instala o relatório `/SAPSLL/READINESS_CHK_V8000`, e a 2973223 detalha as medidas (Conversion Guide). Roda na PRD, com antecedência; sem upload, segundo [7]. A 3033398 vem só de [7]: o guia não a cita.
  2. **A Simplification List.**
  3. **O Conversion Guide.**
  4. **O FAQ:** a nota 3296252 (fonte secundária; os guias não a citam).
- **A limpeza antes** [7] (fonte secundária; os guias não citam estas notas de limpeza):
  - as taxas de imposto (2989086);
  - a worklist das medidas (3036789);
  - as estratégias de determinação (3249316);
  - os números (3477652);
  - mais as correções da própria checagem (2973223, 3435410, 3435947, 3441620, 3474557 e 3479546).
- **A conversão dos dados:** são tarefas do SUM e do XPRA, como `INS_LCLICI_2_LICHDTN` (`/SAPSLL/LCLICI` → `/SAPSLL/LICHDTN`), `UPD_2_LICHD` e `/SAPSLL/XPRA_GTSC200` [20][21].
- **Os erros conhecidos:**
  - a violação de unicidade com registros duplicados [21];
  - a parada no XPRAS_AIMMRG [20];
  - o status SPL ausente depois do upgrade para o 2025 (nota 3687129) [23];
  - a `/SDF/RC_START_CHECK` com erros no 11.0 (nota 2399707) [24];
  - o dump de "access denied" no Display Sanctioned Party List (KBA 3715640).
- **O código Z** precisa ser reavaliado e muitas vezes reescrito. O conversor EDI e os provedores de conteúdo seguem ciclos próprios [8][17].
- **As lições:**
  - várias conversões de teste cedo;
  - o negócio nos testes desde o início;
  - mapear o que se usa de fato antes de converter, sem replicar gambiarra;
  - o ATLAS 3.0 no plano [17][18][29].

## 8. Testes e reconciliação

**Os cenários por área** [1][16][17]:
- **SPL:**
  - parceiro novo bloqueado;
  - falso positivo liberado;
  - bloqueio confirmado;
  - listas positiva e negativa;
  - delta da lista e nova triagem;
  - endereço sobrescrito no documento;
  - audit trail (quem, quando, por quê).
- **Embargo:** o país, a combinação e a região.
- **Legal control:**
  - ECCN sem licença bloqueia;
  - com licença, libera e baixa;
  - licença vencida;
  - a simulação.
- **Bloqueio no alimentador:** ordem, remessa e pedido, com o log.
- **Customs:**
  - da remessa à declaração, com envio, aceite, MRN e saída;
  - a rejeição;
  - a repetição;
  - o fallback;
  - o ponta a ponta no ambiente de teste da aduana.
- **Cálculo de imposto:** a simulação contra o cálculo manual.
- **Preferência:**
  - o pedido de LTSD;
  - a agregação A e B;
  - a determinação pela BOM;
  - a LTSD de saída.
- **Intrastat:** a seleção, a transferência e o arquivo do país.
- **Fiori e papéis:** cada app de cada papel abre e age só no que o papel pode.
- **Performance:** a triagem e o documento, nos locais e volumes acordados.

**A reconciliação da conversão** (os critérios são inferência, porque não há roteiro oficial):
- Contagens antes × depois, por objeto:
  - parceiros e o status SPL;
  - licenças e saldos;
  - classificações;
  - LTSD e agregados;
  - documentos aduaneiros abertos.
- As tarefas do SUM sem erro [20][21].
- O status SPL depois do upgrade [23].
- A equivalência da triagem (busca GTS × HANA) numa amostra fixa.

## 9. Tabelas, transações e apps

Só o que as fontes confirmam:
- **Tabelas:**
  - `/SAPSLL/CUHD` e `/SAPSLL/CUIT`: o documento aduaneiro, cabeçalho e item [33];
  - `/SAPSLL/CORREF`: o nº do alimentador → GUID [34];
  - `/SAPSLL/LICHD`, `/SAPSLL/LICHDTN` e `/SAPSLL/LICHDA`: as licenças no E4H, vindas das `/SAPSLL/LCLIC*` [20][21].
- **Transações:** a `/SAPSLL/MENU_LEGALR3` (no alimentador), a `/SAPSLL/SPL_UL01`, as de upload e worklist da seção 4, as de LTSD da seção 5, a `/SAPSLL/IS_SD` e a `/SAPSLL/IS_MM`, e a `/SAPSLL/READINESS_CHK_V8000`.
- **Componentes para chamado:** FT-LEG-CUS-EXP, FT-LEG-CUS-TRP, FT-LEG-CON-SPL, FT-LEG-CON-EMB e FT-LEG-CON-LMG [1].

## Com o Speed Up

O GTS é um sistema ABAP: com uma conexão ADT ou RFC para ele, o bundle `adt` serve. Ainda não há prova num GTS real. Valide primeiro com uma leitura simples.

- **O AS-IS e a reconciliação** (só leitura em QAS e PRD):
  - `sap.abap.data.table` e `sap.abap.data.query`, nas tabelas `/SAPSLL/*` da configuração e dos documentos, com as contagens antes × depois;
  - siga a skill [abap-configuracao-e-cenarios](../abap-configuracao-e-cenarios/SKILL.md).
- **O código Z** (o inventário, o impacto e a remediação):
  - `sap.abap.object.search`, `sap.abap.object.read` e `sap.abap.code.where-used`;
  - `sap.abap.atc.run` com a variante de prontidão;
  - `sap.abap.unit.run`;
  - siga as skills [abap-atc-remediacao](../abap-atc-remediacao/SKILL.md) e [abap-testes-unitarios](../abap-testes-unitarios/SKILL.md).
- **O status:**
  - `sap.abap.status.read`: os IDocs do ATLAS, os jobs (a triagem delta, o LTSD) e as filas;
  - `sap.abap.runtime.dumps`: os dumps depois do upgrade;
  - `sap.abap.transport.info`: os transportes.
- **Formulários e Fiori:**
  - `sap.smartforms.forms.find`, para os formulários do 11.0;
  - `sap.ui5.app.get`, para os apps publicados.
- **Os cenários de teste e o status:** a skill [processo-cenario-de-teste](../processo-cenario-de-teste/SKILL.md).
- **Lacunas conhecidas** (fora do Speed Up hoje):
  - o conversor EDI (Seeburger) e o ATLAS;
  - os papéis (PFCG) e o SoD;
  - a BASIS e o SUM;
  - o teste de performance;
  - a carga de listas e de conteúdo de provedor.

## Limites

- QAS e PRD só leem. Escrita só em DEV, TEST ou SANDBOX.
- Não afirme nota, transação ou tabela que a fonte não confirma. Veja "Não confirmado".
- A decisão de compliance (liberar ou bloquear um parceiro) é do usuário de negócio, nunca da IA.

## Não confirmado

- O conteúdo da Simplification List e do Conversion Guide oficiais não foi lido (as páginas não abriram). Faltam:
  - o tratamento dos documentos aduaneiros abertos no cutover;
  - o que se arquiva antes da conversão.
- Que letter of credit e restitution são obsoletos vem só de pergunta em fórum [32].
- Os nomes novos das mensagens do ATLAS AES 3.0, o SP mínimo do E4H e o prazo do conversor.
- Os equivalentes no E4H da `/SAPSLL/PNTPR` e da `/SAPSLL/SPLAUD`.
- O licenciamento e o preço das áreas, e o GTS E4H no RISE.

## Fontes

Consultadas em 03/11/2026. "(busca)" quer dizer que a página não abriu, e o que se usou foi o trecho do resultado da busca.

1. SAP Help, User Guide do SAP GTS E4H 2025 SP00 (PDF): https://help.sap.com/doc/d523ff9ca1fd49b5b4d9b18833031ba7/2025.000/en-US/loio418667a4b34a4a83815ccdf76e620f0f_en.pdf
2. SAP Help, página do produto (busca): https://help.sap.com/docs/SAP_GLOBAL_TRADE_SERVICES_EDITION_HANA
3. SAP Community, "Brown, blue or green: how to move to SAP GTS E4H" (busca): https://community.sap.com/t5/financial-management-blogs-by-sap/brown-blue-or-green-how-to-move-to-sap-global-trade-services-edition-for/ba-p/13561523
4. SAP Community, "Your way to SAP GTS E4H on-premise or cloud" (busca): https://community.sap.com/t5/financial-management-blog-posts-by-sap/your-way-to-sap-gts-edition-for-sap-hana-on-premise-or-cloud/ba-p/13782776
5. SAP Community, "Basis view on upgrade/conversion to GTS E4H 2023" (busca): https://blogs.sap.com/t5/financial-management-blogs-by-members/basis-view-on-upgrade-conversion-to-sap-gts-e4h-2023-gts-ed-for-sap-hana/ba-p/13556093
6. SAP Community, "How to prepare for the move to GTS E4H" (busca): https://groups.community.sap.com/t5/financial-management-blogs-by-sap/how-to-prepare-for-the-move-to-sap-global-trade-services-edition-for-sap/ba-p/13568003
7. SAP Technical Guru, "GTS Edition for HANA readiness check": https://www.saptechnicalguru.com/gts-edition-for-hana-readiness-check/
8. Surety Systems, "Making the move to SAP GTS E4H": https://www.suretysystems.com/insights/making-the-move-to-sap-gts-e4h-key-functions-steps-and-best-practices
9. SAPinsider, "SAP GTS Sanctioned Party List Screening": https://sapinsider.org/expert-insights/sap-global-trade-services-sap-gts-sanctioned-party-list-screening/
10. SAP Learning, "Managing Sanctioned Party Lists": https://learning.sap.com/courses/configuring-the-essential-functions-of-sap-global-trade-services/managing-sanctioned-party-lists_d8cb7373-30fe-4c9c-b499-b5dee2af756a
11. SAP Learning, "Managing Supplier's Declarations": https://learning.sap.com/courses/discovering-the-basics-of-sap-global-trade-services/managing-supplier-s-declarations_a6b35362-d5a7-4b3f-9f89-693dd33cce5d
12. SAP Learning, "Configuring Preference Determination": https://learning.sap.com/courses/configuring-the-essential-functions-of-sap-global-trade-services/setting-up-preference-determination_a686a8c1-f3c1-45e1-98cb-2e13ec91101b
13. SAP Learning, "Maintaining Goods Lists and Classifying Products": https://learning.sap.com/courses/configuring-the-essential-functions-of-sap-global-trade-services/maintaining-goods-lists-and-classifying-products_afa7d6d4-6241-460f-9e6f-ff673b7ab466
14. SAP Learning, "Uploading Codes for Tariff and Non-Tariff Measures (EU)" (busca): https://learning.sap.com/learning-journeys/configuring-and-using-classifications-for-international-trade/uploading-codes-for-tariff-and-non-tariff-measures-eu-
15. SAP Learning, "Submitting Intrastat Declarations" (busca): https://learning.sap.com/learning-journeys/configuring-the-essential-functions-of-sap-global-trade-services/submitting-intrastat-declarations_e932f0e4-5f39-4b1c-9cb8-13e49e8d0678
16. SAPinsider, "Automate online export declarations to Germany with ATLAS": https://sapinsider.org/automate-online-export-declarations-to-germany-with-atlas/
17. SAPinsider, "SAP GTS 11.0 support has ended": https://sapinsider.org/case-studies/sap-gts-11-0-support-has-ended-heres-how-to-move-forward-without-risk/
18. ArchLynk, caso de migração do GTS: https://info.archlynk.com/how-fresenius-kabi-achieved-a-seamless-sap-gts-migration-with-archlynk
19. SAP Press, sumário de "Implementing SAP GTS Edition for SAP HANA": https://www.sap-press.com/implementing-sap-global-trade-services_5789/toc/5091
20. KBA 3552351: https://userapps.support.sap.com/sap/support/knowledge/en/3552351
21. KBA 3707785: https://userapps.support.sap.com/sap/support/knowledge/en/3707785
22. KBA 3636938: https://userapps.support.sap.com/sap/support/knowledge/en/3636938
23. KBA 3707505: https://userapps.support.sap.com/sap/support/knowledge/en/3707505
24. KBA 3656578: https://userapps.support.sap.com/sap/support/knowledge/en/3656578
25. KBA 3601426: https://userapps.support.sap.com/sap/support/knowledge/en/3601426
26. Descartes CustomsInfo, conteúdo para o SAP GTS: https://customsinfo.com/global-trade-management-content/global-trade-management-content-sap-gts
27. SAP Press Blog, "Navigating your migration to SAP GTS E4H": https://blog.sap-press.com/navigating-your-migration-to-sap-gts-edition-for-sap-hana
28. SAP Learning Live, "What's new in SAP GTS E4H": https://learning.sap.com/live-sessions/what-s-new-in-sap-global-trade-services-edition-for-sap-hana
29. Sulzer, passo a passo de migração: https://www.sulzer.de/en/?p=3536
30. SAP Community Q&A, GTSCORE 200 e S/4HANA 2022 (busca): https://community.sap.com/t5/financial-management-q-a/is-it-mandatory-to-have-sap-s-4hana-2022-for-gtscore-200/qaq-p/12815172
31. KBA 3391222 (busca): https://userapps.support.sap.com/sap/support/knowledge/en/3391222
32. SAP Community Q&A, letter of credit e restitution no E4H (busca): https://community.sap.com/t5/financial-management-q-a/e4h-eoh-letter-of-credit-and-restitution-obsolte/qaq-p/12593221
33. SAPDatasheet, `/SAPSLL/CUHD` (busca): https://www.sapdatasheet.org/abap/tabl//sapsll/cuhd.html
34. SAP Community, `CORREF`/`CORCTS` (busca): https://community.sap.com/t5/financial-management-q-a/records-in-sapsll-corcts-missing/qaq-p/11562633
35. Sulzer, "The end of SAP GTS": https://www.sulzer.de/en/the-end-of-sap-gts-an-analysis-for-your-busines/
