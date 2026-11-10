# Skills do Speed Up

As skills são **nativas do produto**: vêm junto com o Speed Up, aparecem no app desde o primeiro uso (sem precisar de GitHub) e são entregues à IA quando ela conecta, junto com as conexões e os bundles.

- **Bundle** = o que o Speed Up **faz** no SAP (ações, via `sap_execute`).
- **Skill** = **como** fazer bem um tipo de trabalho, e quais ações do bundle usar em cada etapa.

## Como a IA usa

1. Ao conectar, a IA recebe a ficha do Speed Up: conexões, bundles e esta lista de skills, com o "quando usar" de cada uma.
2. Quando o pedido se encaixa numa skill, a IA lê a skill inteira com `skill_get`, ou pela lista `skills_list`.
3. A skill indica as ações do bundle; a IA executa com `sap_execute`.

## Índice

### CPI (SAP Cloud Integration)

| Skill | Quando usar |
|---|---|
| [cpi-principios](./cpi-principios/SKILL.md) | Porta de entrada para qualquer trabalho em CPI; diz qual skill usar em cada etapa |
| [cpi-contrato](./cpi-contrato/SKILL.md) | Definir ou revisar o contrato de negócio e técnico antes de mexer no iFlow |
| [cpi-desenho-iflow](./cpi-desenho-iflow/SKILL.md) | Desenhar ou revisar os passos do iFlow (nativo × Groovy) |
| [cpi-adapters](./cpi-adapters/SKILL.md) | Escolher e configurar sender e receiver |
| [cpi-value-mapping](./cpi-value-mapping/SKILL.md) | Tabela de correspondência como Value Mapping: criar, implantar, regras do tenant |
| [cpi-falhas-reprocessamento](./cpi-falhas-reprocessamento/SKILL.md) | Exceções, retry e reprocessamento; entender uma mensagem que falhou |
| [cpi-jms-retry](./cpi-jms-retry/SKILL.md) | Retry com fila JMS, só quando JMS entra no contrato |
| [cpi-prova-entrega](./cpi-prova-entrega/SKILL.md) | Provar a entrega: deploy, gatilho real, MPL e destino |

### ABAP

| Skill | Quando usar |
|---|---|
| [abap-engenharia-reversa](./abap-engenharia-reversa/SKILL.md) | **Porta de entrada para entender um ambiente SAP (o REA do SAP)**: a escada, o inventário do código próprio, o uso real, a configuração feita, o volume e as análises do vibing-steampunk, só leitura (QAS e PRD inclusive); o resultado vira um `.md` no projeto |
| [abap-clean-code](./abap-clean-code/SKILL.md) | Escrever ou revisar ABAP pelo Clean ABAP, incluindo nomenclatura |
| [abap-performance](./abap-performance/SKILL.md) | Relatório lento, SELECT em LOOP, tabelas internas, acesso ao banco |
| [abap-testes-unitarios](./abap-testes-unitarios/SKILL.md) | Criar ou revisar ABAP Unit |
| [abap-debugging](./abap-debugging/SKILL.md) | Dump, erro de runtime, saída errada: achar a causa raiz |
| [abap-atc-remediacao](./abap-atc-remediacao/SKILL.md) | Corrigir achados do ATC sem mudar o comportamento |
| [abap-modernizacao-legado](./abap-modernizacao-legado/SKILL.md) | Modernizar FORMs, includes e lógica procedural aos poucos |
| [abap-configuracao-e-cenarios](./abap-configuracao-e-cenarios/SKILL.md) | Configuração e cenários (QAS e PRD, só leitura): ler as tabelas de um processo, como o frete, na engenharia reversa e no double check em PRD |
| [abap-leitura-de-status](./abap-leitura-de-status/SKILL.md) | Status no ABAP (QAS e PRD, só leitura): IDoc, AIF, log, web service, jobs, transportes e qRFC, pela escada ADT, RFC, Web GUI e SAP GUI desktop |
| [abapgit-repositorios](./abapgit-repositorios/SKILL.md) | abapGit: variante do sistema, repositórios ligados e o que mudou entre o sistema e o Git (só leitura) |
| [smartforms-formularios](./smartforms-formularios/SKILL.md) | Achar Smart Forms e estilos; editar, transportar, verificar e testar pela escada única (a SMARTFORMS pelo sap_gui_abrir) |
| [sap-gui-web-abrir](./sap-gui-web-abrir/SKILL.md) | **A escada (a regra única de quando usar o quê)** e o SAP GUI for HTML (Web GUI) no navegador do Claude: abrir de ponta a ponta pela ponte local (certificado, login do cofre), passar as telas intermediárias, ler pelo texto, o modo leitura de QAS e PRD e fechar com o logoff |

### RAP e CDS

| Skill | Quando usar |
|---|---|
| [rap-desenvolvimento](./rap-desenvolvimento/SKILL.md) | Business objects RAP: CDS, behavior, serviço OData |
| [cds-modelagem](./cds-modelagem/SKILL.md) | Modelar views CDS no ABAP, no CAP ou no HANA Cloud |

### Fiori e UI5

O app Fiori do desenho à entrega, sobre RAP ou CAP. O app é gerado pelo bundle `fiori` (`sap.fiori.app.generate`, os writers da SAP com a versão fixa); as docs oficiais vêm pela ferramenta `mcp_sap_docs`, e o lint e a modificação da SAP pelos MCPs que o Speed Up serve (`mcp_sap_ferramentas` e `mcp_sap_executar`).

| Skill | Quando usar |
|---|---|
| [fiori-desenho-do-app](./fiori-desenho-do-app/SKILL.md) | Porta de entrada de todo app Fiori: o floorplan certo e o porquê, a régua de qualidade e qual skill usar em cada etapa |
| [fiori-anotacoes](./fiori-anotacoes/SKILL.md) | A UI dirigida por anotação: a metadata extension no RAP, o `annotate` no CAP e o arquivo local do app pelo `sap.fiori.app.annotate` (com o diff e a releitura), com os exemplos dos showcases da SAP |
| [fiori-aparencia](./fiori-aparencia/SKILL.md) | A aparência no nível mais alto: Horizon, os estados (vazio, erro, carregando), as mensagens, as tabelas e a conferência por captura |
| [fiori-testes](./fiori-testes/SKILL.md) | O portão de qualidade: o lint, o manifest, os dados simulados, o OPA5 e os testes do backend |
| [fiori-entrega](./fiori-entrega/SKILL.md) | Levar o app ao sistema: o build, o deploy (ABAP ou BTP), o launchpad e a prova |
| [fiori-ui5-repositorio](./fiori-ui5-repositorio/SKILL.md) | Publicar e conferir apps Fiori/UI5 no repositório do ABAP: plano, deploy em $TMP, releitura e ICF |

### BTP: CAP, Cloud Foundry, HANA, Cloud ALM e Datasphere

| Skill | Quando usar |
|---|---|
| [btp-principios](./btp-principios/SKILL.md) | Porta de entrada para CAP, Cloud Foundry, HANA Cloud e conta BTP; diz qual skill usar |
| [cap-desenvolvimento-local](./cap-desenvolvimento-local/SKILL.md) | Desenvolver e testar o CAP na máquina: editar, testar, servir, exercitar o OData |
| [btp-publicar-cap](./btp-publicar-cap/SKILL.md) | Publicar o CAP no Cloud Foundry com HANA: HDI, XSUAA, banco por tarefa, serviço e prova |
| [hana-cloud-leitura-e-hdi](./hana-cloud-leitura-e-hdi/SKILL.md) | Ler o HANA Cloud com segurança e mudar tabela ou view num container HDI |
| [btp-conta-e-servicos](./btp-conta-e-servicos/SKILL.md) | Subconta, entitlements, instâncias de serviço e destinos |
| [calm-contexto-do-projeto](./calm-contexto-do-projeto/SKILL.md) | Ler projetos, tarefas, user stories, requisitos e defeitos do Cloud ALM (só leitura) |
| [datasphere-objetos-do-espaco](./datasphere-objetos-do-espaco/SKILL.md) | Ler os objetos de um espaço do Datasphere: estado de implantação e definição (só leitura) |

### Arquitetura

| Skill | Quando usar |
|---|---|
| [arquitetura-sap-enterprise](./arquitetura-sap-enterprise/SKILL.md) | Desenho e revisão de solução SAP com visão de arquiteto |
| [arquitetura-clean-core](./arquitetura-clean-core/SKILL.md) | Extensibilidade, alternativa ao standard, evitar modificação |
| [btp-automacao-processos](./btp-automacao-processos/SKILL.md) | Workflow e automação de processos na nuvem SAP |
| [gts-funcional](./gts-funcional/SKILL.md) | O funcional do SAP GTS E4H e a conversão do 11.0: SPL, embargo, licenças, aduana (ATLAS), imposto, preferência (LTSD), Intrastat, testes, reconciliação e armadilhas |

### Processo

| Skill | Quando usar |
|---|---|
| [processo-corrigir-abap](./processo-corrigir-abap/SKILL.md) | Ciclo completo de correção de um erro ABAP, com rastreabilidade |
| [processo-registrar-erro](./processo-registrar-erro/SKILL.md) | Registrar um erro ou dump em `05_ERROS` |
| [processo-registrar-correcao](./processo-registrar-correcao/SKILL.md) | Registrar a correção em `04_CORRECOES`, 1:1 com o erro |
| [processo-organizar-projeto](./processo-organizar-projeto/SKILL.md) | Montar o projeto: a pasta com o índice dos documentos, o guia e o board do GitHub (uma issue por entrega) |
| [processo-atualizar-projeto](./processo-atualizar-projeto/SKILL.md) | Ao fim de todo pedido que muda um projeto: o commit cita a issue, o board em dia e a integridade conferida |
| [processo-manual](./processo-manual/SKILL.md) | Manual do projeto: o `.md` como única fonte (as caixas dos passos e a `Entrega: #N` de cada seção), o formato que o Speed Up lê, a versão visual no ID visual do projeto, a exportação em PDF e Word, o índice e a versão numerada com data |
| [processo-ef](./processo-ef/SKILL.md) | Especificação funcional: as páginas HTML para o usuário entender, o OK, e o "Extrair a EF" em PDF pelo motor do documento oficial, com a conferência do padrão (o AS-IS em passos, as telas desenhadas, os campos com a origem) |
| [processo-fonte-unica](./processo-fonte-unica/SKILL.md) | Fonte única: cada informação num lugar só, na pasta local do projeto; o GitHub é o backup; o desenho da pasta e a conferência |
| [processo-double-check](./processo-double-check/SKILL.md) | O double check de tempo em tempo: o board contra o que foi entregue, acertado só pelo caminho único; o que é de arquivo vira relatório |
| [processo-cenario-de-teste](./processo-cenario-de-teste/SKILL.md) | O cenário de teste e o status pela API do banco do Speed Up, por projeto (`projeto_cenarios`: o mapa por grupo primeiro, o cenário, propor e validar), o formato com os asserts e o status calculado pelo motor; a pasta `testes/` é só a exportação |
| [processo-rea-para-cenario](./processo-rea-para-cenario/SKILL.md) | Do REA ao cenário: o REA (dentro do Speed Up) entende o sistema de origem, o contrato vira .md e os criadores do Speed Up montam o iFlow, a coleção de teste e o ABAP |

## Formato de uma skill

Uma pasta por skill, `skills/<área>/<id>/`, com um `SKILL.md`. Arquivos de apoio opcionais ficam na própria pasta, por exemplo `references/`.

```markdown
---
name: cpi-contrato                     # igual ao nome da pasta: minúsculas e hífen
description: O que faz e quando usar   # 1–2 frases; é o que a IA lê para decidir
titulo: "CPI: contrato da integração"  # nome legível no app
area: cpi                              # igual à pasta da área
bundles: [cpi]                         # ids de bundle que a skill usa ([] = geral)
versao: 1.0.0
ordem: 1                               # opcional: posição na área (porta de entrada = 1)
atualizado_em: 2026-10-01
origem:                                # de onde veio, com o hash do original
  - "caminho/original/SKILL.md@sha256:0123456789ab"
---

# Título

Corpo: Quando usar · regras · Com o Speed Up (ações do bundle) · Limites · Fontes
```

**Áreas:** `cpi`, `abap`, `rap-cds`, `fiori`, `btp`, `arquitetura`, `processo`.
**Bundles:** `adt`, `rap`, `cpi`, `cap`, `cf`, `btp`, `hana`, `ui5`, `fiori`.

## Regras

- **Sem dado de cliente:** nenhum nome, sistema, URL de tenant ou credencial. O teste da instalação inicial faz essa varredura.
- **Ações reais:** a seção "Com o Speed Up" só cita ações que existem nos bundles. O que ainda não existe é declarado como **lacuna conhecida**.
- **Fontes com data:** skill de competência SAP cita a fonte oficial e a data da consulta.
- **Personalização:** o usuário pode customizar uma skill; atualização do produto nunca sobrescreve a customização. Ver abaixo.
- **Nova skill:** cria a pasta, segue o formato e acrescenta a linha no índice acima. O teste confere que índice e pastas batem.

## Personalizar uma skill (ou criar a sua)

As skills do produto ficam nesta pasta. As **suas** ficam no perfil do Speed Up, em `%LOCALAPPDATA%\SpeedUp\skills\<área>\<id>\SKILL.md`, no mesmo formato. Elas têm precedência:

- **Personalizar uma do produto:** copie a pasta da skill para o perfil, **com o mesmo id e na mesma área**, e edite o `SKILL.md`. A sua vale no lugar da do produto, em todo lugar: o painel mostra "personalizada por você", e a IA recebe a sua e a vê marcada na ficha;
- **Criar uma sua:** uma pasta com um id novo, numa das áreas. Ela entra no catálogo como "skill sua";
- **Atualizar o produto** (baixar o projeto de novo) **nunca toca o perfil**: a personalização continua valendo. O detalhe da skill mostra a versão do produto que ela substitui, para você ver quando o produto evoluiu por baixo;
- **Voltar à do produto:** apague a pasta da skill no perfil;
- **Erro na sua pasta** (frontmatter faltando, área errada…) aparece como problema e não derruba nenhuma skill. O teste é o E273.

Vale na hora, sem reiniciar: o catálogo relê as pastas a cada pedido.
