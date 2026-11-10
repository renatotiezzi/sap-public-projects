---
name: processo-rea-para-cenario
description: "Do REA ao cenário: o REA (engenharia reversa, dentro do Speed Up) entende o sistema de origem, o contrato vira um .md na pasta do projeto, e os criadores do Speed Up montam o iFlow, a coleção de teste e o ABAP, conferidos pela leitura. Use quando o pedido for recriar, migrar ou entender a lógica de um sistema, app, integração ou captura de rede para montar um cenário."
titulo: "Processo: do REA ao cenário (entender com o REA, montar com o Speed Up)"
area: processo
bundles: [cpi, adt]
versao: 1.1.0
ordem: 10
atualizado_em: 2026-10-18
origem:
  - "Sap-Speed-Up/docs/melhorias/2026-10-18-rea-no-speed-up.md (pedido do usuário de 17/10/2026: \"ele entende a lógica, faz engenharia reversa, e depois outra ferramenta monta os cenários. É fundamental isso\"; 18/10/2026: \"o REA deveria estar dentro do Speed Up\")"
---
# Processo: do REA ao cenário

O REA (Reverse Engineer Anything) roda dentro do Speed Up, sob demanda. Ele **entende**; os criadores do Speed Up **montam**. Esta skill liga os dois sem perder o que foi entendido no meio do caminho: o contrato mora num `.md` da pasta do projeto, não na conversa.

## Quando aplicar

- Recriar ou migrar um fluxo de outro sistema: um middleware, um app, um script, uma integração antiga.
- Entender a lógica de um app (JavaScript/Electron, .NET), de um site ou de uma captura de rede (HAR) para montar o cenário equivalente.
- Montar a coleção de teste a partir das chamadas reais de uma captura.

## Quando NÃO aplicar

- O sistema de origem já tem a especificação escrita e conferida: comece pelo contrato (skill cpi-contrato) e use o REA só para tirar dúvidas.
- Ler o que já está no SAP: as leituras do Speed Up (`sap_execute`) bastam. A configuração e os cenários de um processo, em QAS e PRD: skill abap-configuracao-e-cenarios.

## Como fazer

1. **Ache a ferramenta do REA certa.** `rea_ferramentas` com `busca` (ex.: "har", "electron", "dotnet", "string", "procedure"); depois `rea_ferramentas` com `nome`, para o esquema. A primeira chamada leva até 2 minutos (o REA sobe).
2. **Entenda com o REA** (`rea_executar`). Tire do sistema de origem:
   - as entradas e as saídas (os campos, os formatos, os exemplos reais);
   - as regras (o roteamento, as transformações, os valores fixos);
   - os erros e as novas tentativas.

   O REA trabalha sobre arquivos desta máquina. Nada sai dela.
3. **Grave o contrato num `.md` na pasta do projeto** (`docs/`, no índice do README), antes de montar:
   - o que foi entendido e de onde (a ferramenta do REA e o arquivo analisado);
   - o mapeamento de campo para campo;
   - o que fica de fora.

   O que estiver em dúvida leva a marca `[A ESCLARECER: …]`. A decisão do usuário vai para `docs/decisoes/` (`tools/decisao.js`).
4. **Monte com os criadores do Speed Up** (`sap_capabilities`, depois `sap_execute`):
   - o fluxo: a criação de iFlow do CPI, nas regras das skills de CPI (o contrato, o desenho, os adapters);
   - o teste: a coleção de teste a partir das chamadas reais da captura;
   - o ABAP: a criação e a escrita do ABAP, nas regras das skills de ABAP.

   Criar só no ambiente de teste do projeto, nunca em ambiente protegido.
5. **Confira pela leitura do Speed Up:** o que foi montado e o que o contrato pede, campo a campo; a prova vai para o manual do entregável (skill processo-manual) e para o board (skill processo-atualizar-projeto).

## O que nunca fazer

- Montar direto do que o REA mostrou, sem o contrato gravado: o que foi entendido se perde na conversa.
- Analisar com o REA o que não é do projeto, ou o que o usuário não trouxe para a pasta.
- Copiar segredo achado na análise (chave, senha, token) para o `.md`, a issue ou a mensagem.
