# SAP Tech Lab — Contrato de trabalho (Claude Code)

> Este arquivo é carregado automaticamente pelo Claude Code sempre que você
> abre este repositório. Ele existe para que você **não precise reexplicar
> o processo em cada conversa**.

## Fonte única da verdade

As regras centrais deste repositório (estrutura de demanda `GAP_<n>` /
`TICKET_<n>`, classificação de arquivos, fluxo `erro → correção`,
convenção de nomes de pasta, versionamento de header ABAP, segurança) já
estão escritas para o GitHub Copilot e valem **igualmente para você**.
Não duplicamos essas regras aqui — elas são importadas abaixo. Se precisar
mudar o processo, edite os arquivos importados, não este arquivo.

@.github/copilot-instructions.md
@.github/instructions/error-correction-workflow.instructions.md

Resumo rápido (detalhes completos nos arquivos importados acima):

1. Fonte da verdade de um objeto, nesta ordem: `03.1_LAST_VERSION/` →
   `02_CODIGO/` → `03_OBJETOS_ORIGINAIS/`.
2. `03_OBJETOS_ORIGINAIS/` é baseline imutável — nunca editar direto.
3. Toda correção nasce de um erro registrado em `05_ERROS/` e é entregue em
   `04_CORRECOES/` com **nome de pasta idêntico** ao do erro.
4. Correção mínima: nunca alterar algo que não seja necessário para resolver
   o problema relatado. Sem refactor fora do escopo.
5. Após aprovação, o objeto corrigido é copiado para `03.1_LAST_VERSION/`
   (substituindo a versão anterior) e, quando aplicável, para `02_CODIGO/`.

---

## Regra exclusiva do Claude: assinatura `CL`

Este repositório é usado tanto por GitHub Copilot quanto por você (Claude
Code), sobre a mesma estrutura de pastas. Para saber, só de olhar o nome da
pasta, **quem originou** um erro/correção, aplique esta regra sempre que for
você a criar uma pasta nova em `05_ERROS/` ou `04_CORRECOES/`:

### Quando você ORIGINA um novo erro/correção

`NN` segue a **sequência única da demanda** (mesma numeração usada por
Copilot/registro manual — não é mais um contador isolado seu). Calcule `NN`
como o maior número já usado em `05_ERROS/` + `04_CORRECOES/` daquela
demanda (considerando TODAS as pastas, com ou sem `CL`) + 1. Marque a
autoria com `CL` como segmento **separado** (não colado ao número), para a
pasta ordenar corretamente ao lado das demais no explorer:

```
<NN> - CL - <DD-MM> - <HHhMM> - <descrição curta>
```

Exemplos: `10 - CL - 13-08 - 16h25 - werks modfrete manual numeracao`,
`11 - CL - 14-08 - 09h10 - ajuste exception SLIN`.

- Nunca reutilize um número já usado (por qualquer autor, `CL` ou não).
- A pasta em `05_ERROS/<NN> - CL - ...` e a pasta em
  `04_CORRECOES/<NN> - CL - ...` devem ter **nome idêntico** (mesma
  rastreabilidade 1:1 já exigida pelo processo geral).
- Na assinatura do chat e nos marcadores inline do código (`"Ajuste NNCL -
  Inicio/Fim"`), use a forma compacta `<NN>CL` (sem espaço) — só o nome da
  pasta usa o formato espaçado `<NN> - CL - ...`.
- Ao final de todo registro de erro ou correção, informe explicitamente no
  chat: `Assinatura: <NN>CL`.

### Quando você CONTINUA um erro que já existe

Se o erro já foi registrado por outra fonte (pasta sem sufixo `CL`, ex.
`03 - 13-08 - 08h30 - ...`) e você está apenas entregando a correção
correspondente, **não** adicione `CL` — reuse o nome exato da pasta do erro
para não quebrar a correlação 1:1. O sufixo `CL` marca autoria de quem
**abriu** o par erro/correção, não de quem participou dele.

### Nunca

- Não renomeie pastas existentes para adicionar ou remover `CL`.
- Não misture, numa mesma pasta, conteúdo originado por você e por outro
  agente.

---

## Skills disponíveis (vêm do Speed Up)

As skills deste fluxo são **nativas do Speed Up**
(`Sap-Speed-Up/skills/processo/`) e chegam pela conexão MCP `speedup`. O
SETUP também as instala em `~/.claude/skills/`, para o fluxo funcionar antes
de o Speed Up estar ligado (`/processo-corrigir-abap`, etc.).

- `processo-corrigir-abap` (antes `/corrigir-sap`) — fluxo completo: localiza o
  objeto em `03.1_LAST_VERSION/`, lê documentação relacionada, identifica a
  causa, aplica a correção mínima, registra `05_ERROS/<NN>CL` +
  `04_CORRECOES/<NN>CL`, atualiza `03.1_LAST_VERSION/` e mostra o diff.
- `processo-registrar-erro` (antes `/registrar-erro-claude`) — só a etapa de
  registrar o erro/dump.
- `processo-registrar-correcao` (antes `/registrar-correcao-claude`) — só a
  etapa de registrar a correção de um erro já registrado.

No Claude Code, use o prompt MCP (`/mcp__speedup__processo-corrigir-abap`) ou
leia a skill pela tool `skill_get` do Speed Up.
