---
name: abap-configuracao-e-cenarios
description: Entende e confere pela leitura (QAS e PRD inclusive, só leitura) como um processo está configurado e funcionando no SAP — a configuração (customizing), os cadastros e os documentos de um cenário, como o frete — lendo as tabelas pelo Speed Up (sap.abap.data.table), que vai pelo ADT ou, quando o ADT não chega, pelo RFC. Use para buscar, comparar e entender dados em QAS e PRD (o sistema de origem contra o CAR PRD ou o S/4 PRD, QAS contra PRD), na engenharia reversa de um processo e no double check em PRD ("como está o frete em produção?"). A comparação vai sempre pelo motor (sap_execute), que em QAS e PRD lê pelo RFC primeiro, nunca pela tela (o que o motor lê não se lê pelo Web GUI nem pelo SAP GUI desktop: a escada única).
titulo: "Configuração e cenários no SAP: ler, entender e conferir em QAS e PRD"
area: abap
bundles: [adt]
versao: 1.6.0
atualizado_em: 2026-11-02
origem:
  - "Sap-Speed-Up/packages/adapters/src/bundles/adt/completo/rotas-odata.ts (a tabela pelo OData, no motor; #486)"
  - "Sap-Speed-Up/docs/decisoes/2026-10-29-a-leitura-no-prd-escolhe-o-caminho-no-motor-do-speed-up.md (\"com ctz isos tem que se um motor FORTE do speed up\")"
  - "Sap-Speed-Up/packages/adapters/src/bundles/adt/completo/leitura-rfc.ts@sha256:e1027773516a"
  - "Sap-Speed-Up/docs/decisoes/2026-10-19-qas-e-prd-leem-pelo-rfc-primeiro-pelo-motor-do-speed-up.md (\"a primeira opção para acessar QAS e PRD eh sempre pela RFC, motor de speed up\")"
  - "Sap-Speed-Up/docs/decisoes/2026-10-19-busca-comparacao-e-entendimento-de-dados-sap-vao-pelo-motor.md (\"sempre que for algo de busca de dados, comparação, entendimento, o Speed Up deve posicionar a IA para usar o motor\")"
  - "Sap-Speed-Up/docs/melhorias/2026-10-18-leitura-no-qas.md (pedido do usuário de 19/10/2026: \"tem que funcionar pra poder ver dados, config, cenários em PRD... sempre que precisa fazer eng reversa, buscar entendimento do processo, fazer o double check em PRD, usar essa funcionalidade\")"
---

# Configuração e cenários no SAP: ler, entender e conferir em QAS e PRD

O processo de verdade está nas tabelas: a configuração (o customizing), os cadastros e os documentos que o processo gerou. O Speed Up lê qualquer tabela do dicionário com `sap.abap.data.table`, só em leitura, em qualquer ambiente:
- no DEV, no QAS e no PRD;
- **em QAS e PRD (o S/4 PRD e o CAR PRD inclusive), pelo RFC primeiro** (decisão do usuário de 19/10/2026); o ADT só entra depois, quando o RFC não lê por outro motivo que não a senha;
- nos outros ambientes, pelo ADT ou, em todo erro do ADT menos o de senha, pelo RFC.

O `via: "auto"` decide sozinho.

**Quando o RFC não lê a tabela, o motor lê pelo OData** (decisão do usuário de 29/10/2026: o caminho é do motor, não da IA). O caso é o S/4 PRD sem leitora com WHERE, onde o RFC só lê as tabelas de até 512 caracteres. A VBRK, a BSEG, a BKPF e a ACDOCA saem pelo serviço OData que as expõe, com o mesmo pedido:
- os mesmos `campos`, o mesmo `onde` (que vai ao SAP como o `$filter`, inclusive o filtro fora da chave, como a data e o tipo) e o mesmo `maxRows`;
- a resposta com os nomes e o formato da tabela: `via: "odata"`, o `porque` e, em `odata`, o serviço e o filtro usados.

A IA não escolhe o caminho nem troca de capacidade. Duas diferenças a dizer ao usuário:
- a BSEG, a BKPF e a ACDOCA vêm do ledger principal (o cubo dos itens contábeis);
- a VBRP ainda não tem rota (os itens do faturamento não saem pelos serviços mapeados).

O campo que o serviço não traz é recusado, e a resposta lista os que vêm.

Com a senha errada, a resposta começa com "precisa da senha": pare, peça ao usuário que troque a credencial na conexão (Speed Up → Conexões → Trocar credencial) e não repita a leitura, que trava o usuário (no PRD, sobretudo).

**Buscar, comparar e entender dados em QAS e PRD vão sempre por aqui, pelo motor** (decisão do usuário de 19/10/2026): o `sap_execute` de leitura (`sap.abap.data.table`, `sap.abap.data.query` e, para status, `sap.abap.status.read`). O usuário e a senha de QAS e PRD são informação sensível: ficam só no cofre do Speed Up, que os entrega ao RFC sem passar pela conversa. Nunca os peça, digite nem cole no chat nem em tela nenhuma: o Web GUI do Claude (`sap_gui_abrir`) também entra pelo cofre. A tela é para a lacuna real (`fallback`), na a escada única do Speed Up ([sap-gui-web-abrir › A escada](../sap-gui-web-abrir/SKILL.md#a-escada-a-regra-unica)), nunca para a senha recusada.

Use esta skill antes de abrir qualquer tela (o Web GUI ou o SAP GUI desktop) e antes de pedir prints ao usuário.

## Quando usar

- **Engenharia reversa de um processo:** "como o frete é calculado?", "de onde vem esse valor?", "o que esta interface grava?".
- **Double check em PRD:** "como está o frete em produção?", "a configuração de PRD é igual à do QAS?".
- **Antes de mudar uma configuração:** ver como ela está e quantos documentos ela toca.
- **Comparar dados entre sistemas:** "o sistema de origem mandou o mesmo que o CAR PRD tem?", "a fatura do S/4 QAS bate com a do PRD?".

## Como ler

1. **A conexão do sistema pedido** (`connections_list`): o PRD é a de ambiente PRD. Se não houver conexão de PRD, peça ao usuário que a cadastre no Speed Up. Nunca leia o PRD por outra conexão.
2. **A tabela, pelo `sap_execute` com `sap.abap.data.table`:**
   - `table`: a tabela ou view do dicionário;
   - `campos`: só os campos que a pergunta precisa. Sem eles, vêm todos, e a resposta fica grande;
   - `onde`: as condições, juntadas com AND (ex.: `["KAPPL = 'V'", "KSCHL LIKE 'ZF%'"]`). Só campos da própria tabela, sem subconsulta;
   - `maxRows`: o teto das linhas. No teto, a resposta avisa que há mais;
   - `contar: true`: a conta inteira (`total`) no teto. Pelo RFC, ela relê a tabela em páginas: numa tabela enorme do PRD (a `PRCD_ELEMENTS`, os documentos), estreite o `onde` antes;
   - `via`: deixe no `"auto"`. Quando nenhum endereço ADT da conexão responde (o caso de um CAR PRD com só o RFC aberto), o Speed Up vai direto ao RFC.
   - O SELECT pronto também serve: `sap.abap.data.query` com o `sql`. Pelo RFC, só o SELECT simples (uma tabela, campos ou `*`, o WHERE só com os campos dela, o ORDER BY e o UP TO n ROWS); JOIN e agregado, leia cada tabela e junte.
3. **Pelo RFC, a resposta diz o que muda:**
   - a chave da tabela (`chave`), e as linhas voltam na ordem dela;
   - os campos STRING que ficaram de fora (`foraDoRfc`);
   - `via: "rfc"` e o `porque`.

   Pelo OData, ela traz o `via: "odata"`, o `porque` e, em `odata`, o serviço e o filtro.
4. **Status e erros** (IDoc, AIF, jobs, filas, web service) são da skill abap-leitura-de-status, com a conta pronta.

## O caminho para entender um processo (o frete como exemplo)

A ordem vai do documento para a configuração, não o contrário: comece por um caso real.

1. **Um documento real:** um que tenha o frete (a ordem, a fatura, o transporte).
   - No S/4, as condições do documento ficam na `PRCD_ELEMENTS` (no ECC, na `KONV`): leia as do documento, com `onde: ["KNUMV = '<o número>'"]`.
   - Os tipos de condição de frete aparecem ali (`KSCHL`), com o valor e a base.
2. **O tipo de condição:** a `T685A` (o cálculo, a classe, a regra; a aplicação `V` é vendas) e a `T685T` (o texto, com `SPRAS`).
3. **Onde ele entra:** o esquema de cálculo, na `T683S` (os passos, com `KALSM` e `KSCHL`).
4. **Como ele acha o valor:** a sequência de acesso, na `T682I` (os acessos e a tabela de condição de cada um).
5. **Os registros:** as tabelas de condição do acesso (`A` seguido do número) e a `KONP` (o valor de cada registro).
6. **O frete do transporte** (custos de frete, quando o processo usa):
   - a `VFKK` e a `VFKP` (o cabeçalho e os itens do documento de custo de frete);
   - a `TVTF` (os tipos de custo de frete).
7. **Escreva o que entendeu num `.md` da pasta do projeto:** o caminho, as tabelas, os valores e as linhas que provam. Use a skill processo-rea-para-cenario quando o entendimento vira cenário.

As tabelas acima são o caminho padrão do SD. O processo do cliente pode ter Z: a tabela Z aparece no esquema (`T683S`), na sequência (`T682I`) ou no código. Para o código, use `sap.abap.object.read`, pelo ADT.

## Comparar: o sistema de origem contra o CAR PRD ou o S/4 PRD, e QAS contra PRD

- **Um lado de cada vez, pelo motor:** o dado do sistema de origem (o que já está na pasta do projeto ou pela conexão dele) e o do SAP pelo `sap_execute` na conexão do sistema pedido (o CAR PRD é a de ambiente PRD do CAR; o S/4 PRD, a do S/4). Nunca pela tela: o que o motor lê não se lê pelo Web GUI nem pelo SAP GUI desktop (a escada única).
- **O mesmo recorte:** os documentos do caso (a loja, a data, o número), só os campos da comparação.

- **Leia o mesmo recorte nos dois sistemas:** a mesma tabela, os mesmos campos e o mesmo `onde`. Compare linha a linha pela chave.
- **Diga o que difere:** a linha que só existe num, e o campo com valor diferente.
- **Grave o resultado no `.md` do projeto,** com a data e a evidência de cada leitura (o `evidenceId`).

## O que não fazer

- **Não leia dados pessoais sem precisar**, sobretudo em PRD. Peça só os campos da pergunta. Cliente, fornecedor e funcionário só com o número, nunca o nome, o documento ou o endereço, a não ser que o usuário peça.
- **Não leia uma tabela grande inteira:** comece com `maxRows` pequeno e o `onde` pela chave (o documento, a organização). Nos documentos, filtre pela chave (`KNUMV`, `VBELN`), nunca só por um campo que não é chave, que obriga o banco a varrer a tabela.
- **Na dúvida sobre um campo, não chute:** peça a tabela sem `campos` e com `maxRows: 1`. A resposta traz todos os campos, e o campo que não existe é recusado com a lista dos que existem.
- **Não escreva nada:** a escrita é só em DEV, TEST ou SANDBOX, e nunca por esta skill.
- **Não leia pela tela o que o motor lê:** buscar ou comparar dados em QAS e PRD é pelo `sap_execute` (o degrau 1 da escada única basta), e a senha fica no cofre. O "precisa da senha" não é lacuna: pare e peça a troca da credencial.
- **Não contorne uma recusa:** a falta de autorização (S_TABU_DIS, S_TABU_NAM) é do SAP. Diga ao usuário o grupo de autorização ou a tabela a pedir à Segurança.

## Limites

- **O RFC lê uma tabela por vez:** sem JOIN, sem soma, sem ordem própria (o ORDER BY do `sap.abap.data.query` é aplicado depois, nas linhas lidas).
  - A chave ordena as linhas.
  - O JOIN se faz em duas leituras, pela chave.
  - A soma é a conta das linhas, ou o `sap.abap.data.query` pelo ADT, quando o ADT chega.
- **Os campos STRING e RAWSTRING não vêm pelo RFC** (`foraDoRfc`).
- **A entidade CDS só se lê pelo ADT;** pelo RFC, use a tabela de base.

## Fontes (consultadas em 19/10/2026)

- O dicionário SAP de cada tabela, no próprio sistema (`sap.abap.data.table` na `DD02L` e na `DD03L`, ou a SE11 na mão do usuário).
- Speed Up: `docs/melhorias/2026-10-18-leitura-no-qas.md` (a leitura no QAS: ADT e RFC), a escada única (skill sap-gui-web-abrir › A escada) e a skill abap-leitura-de-status.

## Histórico de versões

| Versão | Data | O que mudou |
|---|---|---|
| 1.6.0 | 2026-11-02 | A tela segue a escada única: não se lê pela tela o que o motor lê; o Web GUI do Claude entra pelo cofre (SU-WI-220, #522) |
