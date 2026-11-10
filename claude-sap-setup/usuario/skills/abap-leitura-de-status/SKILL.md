---
name: abap-leitura-de-status
description: Lê o status de um sistema ABAP (QAS e PRD inclusive, só leitura) pelo Speed Up — IDoc, AIF, log de aplicação, web service, jobs, transportes e filas qRFC — com a escada que SEMPRE chega lá - o ADT, depois o RFC (o NW RFC SDK), depois o Web GUI que o Claude abre (sap_gui_abrir, só leitura em QAS e PRD), e por fim o SAP GUI desktop. Use quando pedirem "o status", "o que falhou", "os IDocs com erro", "o job cancelou?", "a fila travou?", ou quando o ADT recusar ou não responder. Buscar, comparar e entender dados em QAS e PRD vão pelo motor (sap_execute), nunca pela tela (o que o motor lê não se lê pelo Web GUI nem pelo SAP GUI desktop: a escada única).
titulo: "Status no ABAP: a escada ADT, RFC, Web GUI e SAP GUI desktop"
area: abap
bundles: [adt]
versao: 1.9.0
atualizado_em: 2026-11-05
origem:
  - "Sap-Speed-Up/packages/adapters/src/bundles/adt/completo/consultas-de-status.ts@sha256:df05d3c04bb9"
  - "Sap-Speed-Up/packages/adapters/src/bundles/adt/completo/leitura-rfc.ts@sha256:e1027773516a"
  - "Sap-Speed-Up/docs/decisoes/2026-10-19-qas-e-prd-leem-pelo-rfc-primeiro-pelo-motor-do-speed-up.md (\"a primeira opção para acessar QAS e PRD eh sempre pela RFC, motor de speed up\")"
  - "Sap-Speed-Up/docs/decisoes/2026-10-19-busca-comparacao-e-entendimento-de-dados-sap-vao-pelo-motor.md"
---

# Status no ABAP: a escada ADT, RFC, Web GUI e SAP GUI desktop

A capacidade `sap.abap.status.read` traz o status pronto de um sistema ABAP. O SQL é do Speed Up: fixo, só SELECT, com os campos conferidos na fonte. A IA escolhe só a área, a data e o filtro. Ela vale em QAS e PRD, porque só lê.

**Toda leitura em QAS e PRD vai pelo motor** (decisão do usuário de 19/10/2026): o status, a busca, a comparação e o entendimento de dados vão pelo `sap_execute` de leitura (aqui; e `sap.abap.data.table` e `sap.abap.data.query`, na skill abap-configuracao-e-cenarios). Em QAS e PRD, o RFC é o primeiro caminho, e o ADT vem depois. O usuário e a senha de QAS e PRD são informação sensível: ficam só no cofre do Speed Up, que os entrega ao RFC sem passar pela conversa, e nunca são pedidos, digitados nem colados no chat, no navegador ou no SAP GUI.

## Quando usar

- "Como estão os IDocs de ontem?", "quais deram erro?";
- "o AIF da interface X falhou?";
- "o job Y cancelou?";
- "a fila qRFC travou?";
- "a ordem de transporte foi liberada?";
- "o web service deu erro?";
- e sempre que o ADT de um sistema recusar (403) ou não responder.

## Ler

1. **A conexão:** `connections_list` e a do sistema pedido (o QAS é a de ambiente QAS).
2. **A leitura:** `sap_execute` com `sap.abap.status.read` e os argumentos:
   - `consulta`, a área:
     - `idoc`: a EDIDC; o filtro é o tipo de mensagem;
     - `aif`: o log `/AIF/LOG`; o filtro é a interface (o subobjeto);
     - `log`: a BALHDR; o filtro é o objeto do log;
     - `webservice`: a SRT_MMASTER; o filtro é a interface de saída ou de entrada (o texto do erro não está nela: vem da SRT_MONI);
     - `jobs`: a TBTCO; o filtro é o nome do job;
     - `transportes`: a E070; o filtro é o dono;
     - `qrfc`: a TRFCQOUT; o filtro é a fila.
   - ou `consulta: "todas"` (ou `consultas: ["idoc", "jobs"]`): as áreas em paralelo, numa chamada só. É o jeito rápido de responder "como está o sistema?". A falha de uma área fica nela (`falhou`, `layer`) e as outras voltam. O filtro, aqui, não vale.
   - `desde`: AAAA-MM-DD ou DD/MM/AAAA. Sem ela, a leitura vai desde ontem.
   - `filtro`: o `*` é curinga.
   - `maxRows`: o padrão é 200. É o teto só das linhas; a conta é sempre do período inteiro.
   - `linhas`: `"erros"` (o padrão: só as linhas com erro, as mais novas), `"todas"` ou `"nenhuma"` (só a conta). Para "como está?", o padrão basta; peça `"todas"` só quando precisar ver as linhas boas.
   - `via`: `"auto"` (o padrão), `"adt"` ou `"rfc"`.
   - **O texto do erro (o "por que falhou"): `sap.abap.log.read`.** O `status.read` só conta e traz o cabeçalho do log; o texto mora comprimido no BALDAT. O `log.read` lê pelo RFC a BAPI_APPLICATIONLOG_GETDETAIL, que descompacta no SAP (só leitura). Argumentos:
     - `area`: `"aif"` (o padrão, o `/AIF/LOG`) ou `"log"` com o `objeto`;
     - `subobjeto`: no AIF, a interface (ex.: `/RFMPI FIN*`);
     - `desde` e `soComErro` (true por padrão);
     - `tipos` (ex.: `["E","A"]`) e `maxLogs` (o padrão é 20, até 100);
     - ou direto os `lognumbers` que o `status.read` devolveu.

     Volta cada log com as mensagens (tipo, classe, número, texto, variáveis) e os `errosMaisComuns`. O erro de dado mestre que uma decisão do projeto manda ignorar continua fora da conta.
3. **A resposta:**
   - o total;
   - a conta por estado (`porEstado`);
   - quantas linhas estão com erro (`comErro`);
   - as linhas;
   - por onde leu (`via`).

   Conte ao usuário o que tem erro primeiro.

## A escada (quando o ADT não lê)

**Em QAS e PRD, a ordem se inverte** (decisão do usuário de 19/10/2026): no `via: "auto"`, o RFC vem primeiro, e o ADT só entra quando o RFC não lê por outro motivo que não a senha. A escada abaixo vale como está nos outros ambientes.

1. **O ADT** é o primeiro degrau. No `via: "auto"`, **todo erro do ADT, menos o de senha, leva a leitura sozinha ao RFC** (decisão do usuário de 19/10/2026): nenhum endereço ADT respondendo (a conexão de SAP GUI só com o RFC aberto, como num CAR PRD), o 404, o 403 do ICM ("Service cannot be reached": o `/sap/bc/adt` fora do SICF, que se pede ao Basis), o 403 de autorização, a rede, o certificado, qualquer outro código. A resposta diz o `porque`.
   - **O erro de senha** (o 401 do ADT, ou o logon recusado no RFC) não vai a lugar nenhum, nem ao Web GUI nem ao SAP GUI desktop (eles entram com a mesma senha do cofre): a resposta começa com "precisa da senha". Pare e peça ao usuário que troque a credencial na conexão (Speed Up → Conexões → Trocar credencial) e **nunca repita a leitura com a mesma senha**: cada tentativa errada aproxima o usuário de travar, sobretudo no PRD.
2. **O RFC** (`via: "rfc"`) lê pelo RFC_READ_TABLE, com o NW RFC SDK da máquina.
   - **O 403 de autorização cai no RFC sozinho.** A recusa do ADT é da autorização do ADT (S_ADT_RES). O RFC pede outras: S_RFC para o RFC_READ_TABLE e S_TABU_DIS/S_TABU_NAM para a tabela. O próprio SAP confere cada uma, então isso não contorna recusa nenhuma do Speed Up.
   - **O endereço** sai da conexão: o host do ADT e a instância do SAP Logon. Quando o servidor RFC é outro, cadastre nas opções da conexão:
     - `rfcAshost` e `rfcSysnr`;
     - ou `rfcMshost`, `rfcSysid` e `rfcGroup`;
     - e o `rfcSaprouter`, se houver.
   - **A ordem:** o RFC_READ_TABLE não ordena. Com o `aviso` (`rfc.noTeto`), aumente o `maxRows` ou estreite o filtro.
3. **O Web GUI pelo Claude** (`sap_gui_abrir`), só quando os dois falham pela autorização (a lacuna real; nunca pela senha recusada). É o degrau 2 da a escada única do Speed Up ([sap-gui-web-abrir › A escada](../sap-gui-web-abrir/SKILL.md#a-escada-a-regra-unica)): o Claude abre a transação já logado e lê a tela; em QAS e PRD, a abertura é só de leitura. As transações:
   - IDoc: WE02;
   - AIF: /AIF/ERR;
   - log de aplicação: SLG1;
   - web service: SRT_MONI (fora da lista de leitura: no QAS e no PRD, a abertura recusa);
   - jobs: SM37;
   - transportes: SE09/STMS (fora da lista de leitura: no QAS e no PRD, a abertura recusa);
   - qRFC: SMQ1.
4. **O SAP GUI desktop** (o botão Abrir SAP GUI do Speed Up, já logado, e o computer use) é o último recurso, para o que o Web GUI não mostra. O usuário só age quando o SAP recusa pela autorização dele.

Em cada degrau que falhou pela autorização, diga ao usuário o papel a pedir à Basis: só de leitura, com S_ADT_RES, S_RFC e S_TABU_DIS. Nunca peça a senha na conversa.

## Volume e velocidade

- **Em paralelo:** até 4 leituras ao mesmo tempo por sistema; a opção `leituraParalela` da conexão vai de 1 a 8. Cada leitura é uma sessão no SAP e ocupa um processo de diálogo, então no QAS e no PRD fique no padrão.
- **No RFC**, as instâncias da ponte ficam abertas entre as leituras, com a conexão: só a primeira paga o custo de abrir (alguns segundos), e as instâncias ociosas fecham depois de 5 minutos. Os tamanhos dos campos ficam guardados, e cada leitura seguinte é uma chamada só.
- **A conta é do sistema** (`contagem: "sistema"`): o total, os erros e os estados do período inteiro.
  - Pelo ADT, vem do GROUP BY.
  - Pelo RFC, vem da leitura só do estado e dos campos do erro, página por página até esgotar (`rfc.paginasDaConta`). Acima de 1 milhão de linhas, ela para (`contagem: "parcial"`).
  - Num release sem o agregado, a conta é a das linhas que voltaram (`contagem: "linhas"`); diga isso ao usuário.
- **A resposta é enxuta:** as linhas são só as com erro por padrão, então 5.000 IDocs com 50 erros voltam com a conta inteira e 50 linhas.

## O que não fazer

- **Não monte SQL à mão para estes status** (`sap.abap.data.query`): o `status.read` já tem os campos conferidos e conta os erros.
- **Não troque de conexão para "chegar lá":** a leitura é sempre na conexão do sistema pedido.
- **Não trate uma recusa de proteção do Speed Up como lacuna:** só a resposta do SAP (o 404, a rede, o 403) leva ao próximo degrau.

## Limites

- **Os campos não conferidos ficam fora da leitura:** o índice do AIF (`/AIF/STD_IDX_TBL`), o log do SRT_UTIL, o bgRFC e o TPALOG.
- **O RFC precisa do Windows com o NW RFC SDK** (`sapnwrfc.dll`). Sem o SDK, a resposta diz "dependência" e a leitura segue pelo degrau 3.
- **A evidência guarda só a contagem** (a área, a tabela, o total, os erros, por estado e o `via`), nunca as linhas.

## Fontes (consultadas em 18/10/2026)

- [vibing-steampunk](https://github.com/oisee/vibing-steampunk): o ADT e o RFC no mesmo servidor, com o NW RFC SDK direto.
- [pyrfc-mcp](https://pypi.org/project/pyrfc-mcp/): a política do RFC, que nega tudo menos a lista.
- Speed Up: `docs/melhorias/2026-10-18-leitura-no-qas.md` (o estudo e as tabelas conferidas) e a escada única (skill sap-gui-web-abrir › A escada).

## Histórico de versões

| Versão | Data | O que mudou |
|---|---|---|
| 1.9.0 | 2026-11-05 | No `webservice`, o filtro acha também a interface de entrada (IB_IF_NAME), e a resposta avisa que o texto do erro vem da SRT_MONI. |
| 1.8.0 | 2026-11-02 | Os degraus 3 e 4 seguem a escada única: o Web GUI pelo Claude (sap_gui_abrir, só leitura em QAS e PRD), depois o SAP GUI desktop; o usuário só na recusa pela autorização (SU-WI-220, #522) |
