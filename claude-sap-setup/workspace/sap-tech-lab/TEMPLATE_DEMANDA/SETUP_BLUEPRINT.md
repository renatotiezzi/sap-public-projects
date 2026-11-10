# SETUP BLUEPRINT — Modelo de trabalho Copilot (GAP/Ticket + fluxo Erro→Correção)

> **O que é este arquivo?**
> Um blueprint auto-suficiente. Entregue este único `.md` a uma IA (GitHub
> Copilot, Claude, etc.) em um repositório vazio e peça: _"Leia este arquivo e
> recrie exatamente toda a estrutura e todos os arquivos descritos"_.
> Ele contém a árvore de diretórios, as regras do modelo de trabalho e o
> **conteúdo integral (verbatim) de cada arquivo**.
>
> **Por que existe?** Substitui o script `setup-workspace.ps1` (bloqueado por
> email/antivírus por ser executável). Aqui a própria IA cria a estrutura.

---

## 1. Instruções para a IA (execute na ordem)

1. Crie a árvore de diretórios da **Seção 3** exatamente como listada.
2. Crie cada arquivo da **Seção 5** com o conteúdo **idêntico** ao bloco
   correspondente (não resuma, não reescreva, não traduza).
3. Onde houver placeholders `<...>`, `Z<PREFIXO>`, `<AJUSTE_SEU_FUSO>`,
   `<AUTOR>`, **mantenha-os** como placeholders (o usuário preenche depois).
4. **Nunca** insira credenciais, senhas, tokens, URLs privadas, IPs ou dados de
   cliente. O `mcp.json` só existe como **template** com placeholders.
5. Ao final, rode o **checklist de validação** da Seção 6 e reporte o resultado.
6. Não crie arquivos além dos listados. Não altere nomes de pasta.

---

## 2. Regras invioláveis do modelo de trabalho

Estas regras são o núcleo. Devem ser preservadas em qualquer reprodução.

- **Isolamento por demanda:** cada demanda vive em `GAP_<numero>/` ou
  `TICKET_<numero>/` na raiz. Nunca misturar conteúdo entre demandas. Nunca
  salvar conteúdo de uma demanda na raiz.
- **Baseline imutável:** o que está em `03_OBJETOS_ORIGINAIS/` nunca é editado
  diretamente. Toda mudança passa por análise (erro) + correção.
- **Fluxo Erro → Correção com rastreabilidade 1:1:**
  1. Erro/dump → `05_ERROS/<NN> - <DD-MM> - <HHhMM> - <descrição>/` com o dump
     bruto + um `ERRO.md` (Contexto, Sintoma, Causa raiz, Evidências, Impacto,
     Referências).
  2. Correção → `04_CORRECOES/<mesmo nome da pasta do erro>/` com o código
     corrigido (`.abap`) e/ou um guia `.md` para ações não-código.
  3. O nome da pasta do erro e o da correção são **idênticos** (mesmo `NN`).
  4. Se uma correção gerar novo erro, abre-se `NN+1` (erro + correção). Nunca
     consolidar vários erros numa pasta.
  5. Após aprovação/teste, o código aprovado migra para `02_CODIGO/`; a pasta de
     correção vira histórico.
- **Nomenclatura de erro/correção:** `<NN> - <DD-MM> - <HHhMM> - <descrição>`.
  `NN` sequencial de 2 dígitos por demanda (nunca reutilizar). `-` e `h` porque
  `/` e `:` são inválidos em nomes de pasta no Windows. Fuso do projeto.
- **Timestamp (Windows PowerShell):** `Get-Date -Format "dd-MM HH'h'mm"`.
- **Versão no header do objeto corrigido:**
  `* V<NN> - <AUTOR> - correção NN (DD-MM HHhMM): <descrição>`.
- **Validação:** cenários em `06_RESULTADO_ESPERADO/script_validacao.md`; cada
  execução real em `cenario_NN_validacao.md`.
- **Segurança:** sem credenciais/URLs privadas no repositório; sinalizar
  qualquer segredo hardcoded; sem breakpoints em código entregue.

---

## 3. Árvore de diretórios completa

```
<raiz-do-repo>/
  SETUP_BLUEPRINT.md                 (este arquivo)
  AGENTS.md                          (a partir do template da Seção 5)
  .gitignore
  .github/
    copilot-instructions.md
    instructions/
      error-correction-workflow.instructions.md
      abap.instructions.md
    prompts/
      registrar-erro.prompt.md
      registrar-correcao.prompt.md
  .vscode/
    settings.json
    extensions.json
    mcp.json.template
  docs/
    ORGANIZATION_GUIDE.md
  templates/
    ERRO_TEMPLATE.md
    CORRECAO_GUIA_TEMPLATE.md
    CENARIO_VALIDACAO_TEMPLATE.md
    AGENTS.md.template
    GAP_TEMPLATE/
      README.md
      01_DOCUMENTACAO/
        README.md
        01_EF/README.md
        02_README_IA/README.md
        03_GUIA_IMPLEMENTACAO/README.md
        04_DECISOES_TECNICAS/README.md
        05_TESTES/README.md
        06_REFERENCIAS/README.md
      02_CODIGO/README.md
      03_OBJETOS_ORIGINAIS/README.md
      04_CORRECOES/README.md
      05_ERROS/README.md
      06_RESULTADO_ESPERADO/README.md
```

Para **criar uma nova demanda**: copiar `templates/GAP_TEMPLATE/` para
`GAP_<numero>/` (ou `TICKET_<numero>/`) e ajustar o `README.md`.

---

## 4. Camadas de configuração (o que migra e o que não migra)

| Camada | Onde vive | Migra? |
|---|---|---|
| Config do repositório | `.github/`, `AGENTS.md`, `docs/`, `templates/` | ✅ Sim |
| Config local do VS Code | `.vscode/settings.json`, `extensions.json` | ✅ Sim (sem segredos) |
| Config MCP com credenciais | `.vscode/mcp.json` | ⚠️ Só o template; preencher manualmente |
| Conta GitHub (login/assinatura Copilot) | serviço | ❌ Refazer login |
| Políticas da organização | tenant | ❌ Não exportável |

---

## 5. Conteúdo verbatim de cada arquivo

> Cada bloco abaixo usa cerca de 4 crases para envolver arquivos que contêm
> blocos de código internos. Ao criar o arquivo, use **apenas o conteúdo
> interno** (sem a cerca externa de 4 crases).

### 5.1 `.github/copilot-instructions.md`

````md
# Copilot Instructions — Modelo de trabalho (ABAP / GAP / Ticket)

> Este arquivo define, para o GitHub Copilot, o modelo de trabalho deste
> repositório. Ele é genérico e portável: não contém credenciais, URLs
> privadas, dados de cliente ou informações corporativas. Ajuste apenas os
> nomes de placeholder marcados com `<...>`.

## Papel do assistente

Você apoia o desenvolvimento e a manutenção de objetos (ABAP e correlatos)
organizados por demanda (GAP ou Ticket), com forte ênfase em rastreabilidade
entre **erro identificado** e **correção entregue**.

## Regra central de organização

- Cada demanda vive em uma pasta isolada na raiz: `GAP_<numero>` ou
  `TICKET_<numero>`.
- Nunca misturar conteúdo entre demandas diferentes.
- Nunca salvar conteúdo de uma demanda na raiz do repositório.
- Toda demanda segue a estrutura padrão do template (ver `templates/GAP_TEMPLATE/`).

## Estrutura padrão de cada demanda

```
GAP_XXX/
  README.md                 índice/estado da demanda
  01_DOCUMENTACAO/          EF, README da IA, guia, decisões, testes, referências
  02_CODIGO/                somente código-fonte aprovado
  03_OBJETOS_ORIGINAIS/     baseline original, antes de qualquer alteração
  04_CORRECOES/             uma subpasta por correção (espelha 05_ERROS)
  05_ERROS/                 histórico permanente de erros/dumps
  06_RESULTADO_ESPERADO/    provas de que a correção funciona
```

## Fluxo obrigatório erro → correção (NÃO alterar este modelo)

Ao identificar um erro ou receber um dump:

1. **Registrar o erro** em `05_ERROS/<NN> - <DD-MM> - <HHhMM> - <descrição curta>/`.
   - Criar `ERRO.md` (ou `analise.md`) documentando, no mínimo:
     - **Contexto** (execução, usuário, ambiente, entrada).
     - **Sintoma** (o que deveria acontecer × o que aconteceu).
     - **Causa raiz** (com trechos de código relevantes).
     - **Evidências** (outputs, snapshots de tabela, prints).
     - **Impacto** (severidade em produção/teste).
     - **Referências** (arquivos analisados, correção proposta).
   - Anexar o dump/log bruto exatamente como recebido.
2. **Registrar a correção** em `04_CORRECOES/<mesmo nome da pasta do erro>/`.
   - `.abap` (ou outra linguagem) com o objeto corrigido, padrão de export.
   - E/ou `.md` com guia para ações não-código (criar elemento, tabela,
     entrada de customizing, etc.).
3. **Manter rastreabilidade 1:1**: a pasta do erro e a pasta da correção têm
   nome **idêntico** (`NN - DD-MM - HHhMM - descrição`).
4. **Nunca alterar objetos originais** em `03_OBJETOS_ORIGINAIS/` diretamente.
   O baseline é imutável. Toda mudança é registrada como análise (erro) +
   correção.
5. Se uma correção gerar novo erro (regressão/efeito lateral), abrir um novo
   `NN+1` em `05_ERROS/` e a nova correção em `04_CORRECOES/NN+1`. Nunca
   consolidar vários erros numa única pasta.
6. Após aprovação/teste, o código aprovado é propagado para `02_CODIGO/` e a
   subpasta de correção vira histórico.

## Convenção de nomes de erro/correção

Formato: `<NN> - <DD-MM> - <HHhMM> - <descrição curta>`

- `NN`: contador sequencial de dois dígitos por demanda (`01`..`99`). Nunca
  reutilizar número.
- `DD-MM` e `HHhMM`: data/hora do recebimento no fuso configurado (ver abaixo).
  Usa `-` e `h` porque `/` e `:` não são válidos em nomes de pasta no Windows.
- Descrição curta: identificação rápida do problema.

Exemplo: `01 - 25-07 - 13h51 - Dump classe de processamento`.

### Timestamp

Obter data/hora com o fuso do projeto. Exemplo Windows PowerShell:

```powershell
Get-Date -Format "dd-MM HH'h'mm"
```

Fuso de referência padrão deste modelo: `<AJUSTE_SEU_FUSO>` (ex.:
America/Sao_Paulo, UTC-3).

## Versionamento no cabeçalho do objeto corrigido

Ao entregar um `.abap` corrigido, registrar no header um histórico de versão:

```
* V<NN> - <AUTOR> - correção NN (DD-MM HHhMM): <descrição do que mudou>
```

## Validação após correção

- Descrever cenários esperados em `06_RESULTADO_ESPERADO/script_validacao.md`
  (smoke, caminho feliz, cada erro esperado, borda) com base na especificação.
- Registrar cada execução real em `06_RESULTADO_ESPERADO/cenario_NN_validacao.md`
  com data/hora, output capturado e checklist de verificação.

## Segurança

- Nunca escrever credenciais, tokens, senhas ou URLs privadas em código ou docs.
- Sinalizar qualquer credencial hardcoded encontrada.
- Verificar ausência de `BREAK-POINT` / breakpoints e de usuários/senhas fixos
  antes de entregar código.

## Documentação — diferença entre tipos

- **EF**: especificação funcional oficial (requisito recebido). Não alterar.
- **README da IA**: apoio gerado com IA para entendimento/direcionamento. Não
  substitui a EF.
- **Guia de Implementação**: documento técnico do que foi implementado.
````

### 5.2 `.github/instructions/error-correction-workflow.instructions.md`

````md
---
applyTo: '**/05_ERROS/**,**/04_CORRECOES/**'
---
# Fluxo Erro → Correção (rastreabilidade 1:1)

Aplique estas regras sempre que trabalhar dentro de `05_ERROS/` ou
`04_CORRECOES/`.

## Ao registrar um erro (`05_ERROS/`)

- Criar subpasta `<NN> - <DD-MM> - <HHhMM> - <descrição curta>`.
- Dentro dela:
  - Dump/log bruto exatamente como recebido (`dump.txt`, `.log`, `.png`).
  - `ERRO.md` (ou `analise.md`) com: Contexto, Sintoma, Causa raiz,
    Evidências, Impacto, Referências.
- Nunca apagar entradas antigas. A pasta é histórico permanente.

## Ao registrar a correção (`04_CORRECOES/`)

- Criar subpasta com **nome idêntico** ao da pasta do erro.
- Conter SOMENTE:
  - Código corrigido (padrão de export, ex.: `.abap`).
  - E/ou `.md` de guia para ações que não são código.
- Não guardar aqui: EF, guia de implementação, dump original, análise,
  metadata ou baseline. Cada um tem seu diretório próprio.

## Regras invioláveis

- Correlação 1:1: mesmo `NN`, mesma descrição entre erro e correção.
- Baseline em `03_OBJETOS_ORIGINAIS/` é imutável — nunca editar direto.
- Um novo problema causado por uma correção vira `NN+1` (erro + correção),
  nunca consolidado na pasta anterior.
- Após aprovação, o código migra para `02_CODIGO/`; a pasta de correção
  permanece como histórico.
````

### 5.3 `.github/instructions/abap.instructions.md`

````md
---
applyTo: '**/*.abap'
---
# Convenções ABAP (versão genérica e portável)

> Modelo de convenções para desenvolvimento ABAP Cloud / ABAP 7.5+ e RAP.
> Genérico: substitua o prefixo `Z<PREFIXO>` pelo prefixo do seu projeto.

## Modernização / Clean Core

- Preferir sintaxe moderna: expressões construtoras (`VALUE`, `NEW`, `CONV`,
  `CAST`, `CORRESPONDING`) e declarações inline (`DATA(...)`, `FIELD-SYMBOL(...)`).
- Evitar sintaxe obsoleta: `MOVE`, `CONCATENATE`, `REFRESH`, SQL antigo,
  `CALL METHOD`.
- Usar apenas APIs liberadas (released) para cloud-readiness.
- SQL moderno e operações de tabela performáticas (evitar SELECT em loop).

## Prefixos de objeto

- Objetos do projeto: `Z<PREFIXO>_*`.
- Classes globais: `ZCL_*`; locais: `LCL_*`; behavior pools: `ZBP_*`.
- CDS: interface `I_*`, consumo `C_*`, projeção `P_*`.

## Nomenclatura de variáveis

- Globais: `GV_*` (variável), `GT*_*` (tabela), `GST_*` (estrutura),
  `GC_*` (constante).
- Locais: `LV_*`, `LT*_*`, `LST_*`, `LC_*`.
- Field-symbols: `<GFS_*>` / `<LFS_*>`.

## Parâmetros de método

- Importing: `iv_*` / `ist_*` / `ita_*`.
- Exporting: `ev_*` / `est_*` / `eta_*`.
- Changing: `cv_*` / `cst_*` / `cta_*`.
- Returning: `rv_*` / `rst_*` / `rta_*`.

## Revisão de segurança (obrigatória antes de entregar)

- Sem usuário/senha/API key hardcoded.
- Sem `BREAK-POINT` ou breakpoints que parem a execução.
- Sem URLs privadas ou dados de cliente no código.
````

### 5.4 `.github/prompts/registrar-erro.prompt.md`

````md
---
mode: agent
description: Registrar um erro/dump em 05_ERROS seguindo o modelo de rastreabilidade
---
# Registrar erro

Registre o erro/dump fornecido seguindo o modelo de trabalho deste repositório.

## Passos

1. Descubra o próximo `NN` livre em `05_ERROS/` da demanda atual (dois dígitos,
   sequencial, nunca reutilizar).
2. Obtenha data/hora atuais no fuso do projeto:
   - Windows PowerShell: `Get-Date -Format "dd-MM HH'h'mm"`.
3. Crie a subpasta `05_ERROS/<NN> - <DD-MM> - <HHhMM> - <descrição curta>/`.
4. Salve o dump/log bruto exatamente como recebido.
5. Crie `ERRO.md` com as seções:
   - **Contexto**: execução, usuário, ambiente, entrada, arquivos analisados.
   - **Sintoma**: tabela "o que deveria acontecer × o que aconteceu".
   - **Causa raiz**: explicação técnica com trechos de código relevantes.
   - **Evidências**: outputs, snapshots de tabela, prints.
   - **Impacto**: severidade em produção e em teste.
   - **Referências**: caminhos dos objetos e da correção proposta.

## Regras

- Não altere objetos originais em `03_OBJETOS_ORIGINAIS/`.
- Não apague entradas antigas de `05_ERROS/`.
- Ao final, informe o nome exato da pasta criada para reuso na correção.
````

### 5.5 `.github/prompts/registrar-correcao.prompt.md`

````md
---
mode: agent
description: Registrar a correção correspondente a um erro em 04_CORRECOES mantendo rastreabilidade 1:1
---
# Registrar correção

Registre a correção do erro indicado, mantendo rastreabilidade 1:1.

## Passos

1. Identifique a pasta do erro correspondente em `05_ERROS/`.
2. Crie em `04_CORRECOES/` uma subpasta com **nome idêntico**
   (`NN - DD-MM - HHhMM - descrição`).
3. Adicione dentro dela apenas:
   - O objeto corrigido (`.abap` ou outra linguagem, no padrão de export).
   - E/ou um `.md` de guia para ações que não são código (criar elemento de
     dados, tabela, entrada de customizing, etc.).
4. No cabeçalho do objeto corrigido, adicione a linha de versão:
   `* V<NN> - <AUTOR> - correção NN (DD-MM HHhMM): <descrição>`.

## Regras

- A correção NÃO edita o baseline em `03_OBJETOS_ORIGINAIS/`.
- Não coloque aqui EF, guias de implementação, dump original ou análise.
- Se a correção introduzir novo erro, abra `NN+1` em `05_ERROS/` e
  `04_CORRECOES/`.
- Só propague para `02_CODIGO/` após aprovação/teste.
````

### 5.6 `.vscode/settings.json`

````json
{
  // Configurações portáveis do workspace (sem dados sensíveis).
  "files.eol": "\n",
  "files.encoding": "utf8",
  "editor.formatOnSave": false,
  "editor.rulers": [120],
  // Habilita instruções/prompts/agentes personalizados do Copilot no repositório.
  "chat.promptFiles": true,
  "github.copilot.chat.codeGeneration.useInstructionFiles": true,
  // Mantém arquivos de trabalho legíveis (dumps, logs) sem quebra automática.
  "[abap]": {
    "files.trimTrailingWhitespace": false
  }
}
````

### 5.7 `.vscode/extensions.json`

````json
{
  // Extensões recomendadas para reproduzir este modelo de trabalho.
  // O VS Code sugere instalá-las ao abrir o workspace.
  "recommendations": [
    "github.copilot",
    "github.copilot-chat",
    "larshp.vscode-abap",
    "murbani.vscode-abap-remote-fs",
    "sapse.sap-ux-fiori-tools-extension-pack"
  ]
}
````

### 5.8 `.vscode/mcp.json.template`  (SANITIZADO — sem credenciais)

````json
{
  // ==========================================================================
  // TEMPLATE de configuração de servidor MCP (ABAP) — SANITIZADO
  // --------------------------------------------------------------------------
  // NENHUMA credencial real está aqui. Copie este arquivo para
  // ".vscode/mcp.json" e substitua os placeholders <...>.
  //
  // BOA PRÁTICA DE SEGURANÇA:
  //   - NÃO cometa senhas em texto puro. Prefira ${input:...} (o VS Code
  //     solicita o valor ao iniciar) ou variáveis de ambiente do SO.
  //   - Adicione ".vscode/mcp.json" ao .gitignore.
  // ==========================================================================
  "inputs": [
    {
      "id": "sapUsername",
      "type": "promptString",
      "description": "Usuário SAP"
    },
    {
      "id": "sapPassword",
      "type": "promptString",
      "description": "Senha SAP",
      "password": true
    }
  ],
  "servers": {
    "sap_mcp_client_<CLIENT>": {
      "type": "stdio",
      "command": "<CAMINHO_ABSOLUTO_PARA_O_EXECUTAVEL_MCP>",
      "env": {
        "SAP_URL": "<https://SEU_HOST:PORTA>",
        "SAP_USERNAME": "${input:sapUsername}",
        "SAP_PASSWORD": "${input:sapPassword}",
        "SAP_CLIENT": "<CLIENT>",
        "SAP_LANGUAGE": "en",
        "TLS_REJECT_UNAUTHORIZED": "0"
      }
    }
  }
}
````

### 5.9 `.gitignore`

````gitignore
# Segredos e config local do MCP
.vscode/mcp.json
*.local
.env
````

### 5.10 `docs/ORGANIZATION_GUIDE.md`

````md
# Organization Guide (genérico e portável)

## Objetivo
Padronizar a organização de documentos, código e arquivos de apoio por demanda
(GAP ou Ticket), mantendo isolamento total entre demandas.

## Estrutura padrão de cada demanda
```
GAP_XXX/
  README.md
  01_DOCUMENTACAO/
    01_EF/  02_README_IA/  03_GUIA_IMPLEMENTACAO/
    04_DECISOES_TECNICAS/  05_TESTES/  06_REFERENCIAS/
  02_CODIGO/
  03_OBJETOS_ORIGINAIS/
  04_CORRECOES/
  05_ERROS/
  06_RESULTADO_ESPERADO/
```
Cada pasta tem um `README.md` explicando sua finalidade. O template já traz essas
READMEs prontas.

## Função de cada diretório
- `README.md`: índice/estado da demanda.
- `01_DOCUMENTACAO/`: EF, README da IA, guia de implementação, decisões, testes, referências.
- `02_CODIGO/`: somente código aprovado. Subpastas apenas por processo funcional.
- `03_OBJETOS_ORIGINAIS/`: baseline imutável antes de qualquer alteração.
- `04_CORRECOES/`: uma subpasta por correção, espelhando `05_ERROS/`.
- `05_ERROS/`: histórico permanente de erros/dumps (`NN - DD-MM - HHhMM - descrição`).
- `06_RESULTADO_ESPERADO/`: prova de que as correções funcionam.

## Convenção de nomes
- Demanda: `GAP_<numero>` ou `TICKET_<numero>` (sem variações como `Gap 265`).
- Documentos: nome explícito por finalidade (`EF_GAP_XXX.md`,
  `GUIA_IMPLEMENTACAO_GAP_XXX.md`, etc.). Evitar `documento.md`, `final.md`.

## Como criar uma nova demanda
1. Copiar `templates/GAP_TEMPLATE/` para `GAP_<numero>/`.
2. Ajustar o `README.md` da demanda.
3. Colocar arquivos iniciais em `01_DOCUMENTACAO/` e `03_OBJETOS_ORIGINAIS/`.
4. Erros entram em `05_ERROS/`, correções em `04_CORRECOES/`.

## Como classificar erros e correções
1. Erro chega em `05_ERROS/NN - DD-MM - HHhMM - descrição/` (dump + `ERRO.md`).
2. Correção correspondente em `04_CORRECOES/NN - DD-MM - HHhMM - descrição/`
   (nome idêntico), com código e/ou guia `.md`.
3. Após aprovação, o código migra para `02_CODIGO/`.

## Isolamento por demanda
Todo arquivo de uma demanda permanece dentro da pasta dela. Nunca misturar
conteúdo entre demandas nem salvar na raiz.
````

### 5.11 `templates/ERRO_TEMPLATE.md`

````md
# Erro <NN> - <título curto do problema>

## Contexto
- Execução / transação:
- Data/hora (fuso do projeto):
- Usuário / ambiente / client:
- Entrada (parâmetros, arquivos, seleção):
- Arquivos analisados (baseline, código, EF):

## Sintoma
| O que deveria acontecer | O que aconteceu |
|---|---|
|  |  |

## Causa raiz
Explicação técnica. Inclua os trechos de código relevantes:

```abap
* trecho relevante (objeto / método / linha)
```

## Evidências
- Output capturado:
- Snapshots de tabela (antes/depois, deltas):
- Prints / logs anexados nesta pasta:

## Impacto
- Severidade em produção:
- Severidade em teste:
- Condição que dispara o erro:

## Referências
- Objeto(s) afetado(s): `../../02_CODIGO/...`
- Baseline: `../../03_OBJETOS_ORIGINAIS/...`
- Requisito: `../../01_DOCUMENTACAO/01_EF/...`
- Correção proposta: `../../04_CORRECOES/<NN> - <DD-MM> - <HHhMM> - <descrição>/`
````

### 5.12 `templates/CORRECAO_GUIA_TEMPLATE.md`

````md
# Guia de correção <NN> - <título curto>

> Use este `.md` quando a correção exige ações que NÃO são código
> (criar elemento de dados, domínio, tabela, view, entrada de customizing,
> ajuste de parametrização, etc.). Correções de código vão em arquivos de
> código (ex.: `.abap`) na mesma pasta.

## Erro relacionado
- Pasta do erro: `../../05_ERROS/<NN> - <DD-MM> - <HHhMM> - <descrição>/`

## Ação a executar
- Transação / caminho na ferramenta:
- Nome do objeto:
- Atributos (tipo, tamanho, domínio, texto, valores):

## Justificativa
Ligação com o erro e com o requisito.

## Verificação
Como confirmar que a ação foi aplicada corretamente.
````

### 5.13 `templates/CENARIO_VALIDACAO_TEMPLATE.md`

````md
# Cenário <NN> - Validação

## Identificação
- Cenário (referência ao `script_validacao.md`):
- Data/hora da execução (fuso do projeto):
- Executor / ambiente / client:
- Entrada usada:

## Resultado
- Output capturado:

```
<cole o output aqui>
```

## Checklist de verificação
| # | Verificação | Esperado | Obtido | OK? |
|---|---|---|---|---|
| V1 |  |  |  |  |
| V2 |  |  |  |  |

## Conclusão
- [ ] Aprovado
- [ ] Reprovado -> abrir erro em `../05_ERROS/` + correção em `../04_CORRECOES/`
````

### 5.14 `templates/AGENTS.md.template`  (copiar para `AGENTS.md` na raiz)

````md
# AGENTS.md (template genérico)

> Coloque este arquivo na raiz do repositório novo. Descreve, de forma
> agnóstica, o modelo de trabalho para qualquer assistente de IA (Copilot,
> Claude, etc.). Ajuste os placeholders `<...>`.

## Modelo de trabalho

- Cada demanda vive em `GAP_<numero>/` ou `TICKET_<numero>/` isolada.
- Fluxo erro → correção com rastreabilidade 1:1 (ver
  `.github/copilot-instructions.md` e
  `.github/instructions/error-correction-workflow.instructions.md`).
- Baseline em `03_OBJETOS_ORIGINAIS/` é imutável.

## Checklist de segurança (obrigatório)

- Sem usuário/senha/API key hardcoded.
- Sem breakpoints que parem a execução.
- Sem URLs privadas, dados de cliente ou informações corporativas no repositório.

## Ferramentas MCP (opcional)

Se usar um servidor MCP (ex.: ABAP), configure-o em `.vscode/mcp.json` a partir
de `.vscode/mcp.json.template`. Nunca cometa credenciais reais.

Modo de uso recomendado do MCP: **consulta/leitura** (inspeção de objetos,
where-used, preview de dados, busca em documentação). Operações de
escrita/ativação em ambiente produtivo/cliente devem ser aplicadas manualmente
pelo responsável no sistema correto.

## Convenções de nomenclatura

Ver `.github/instructions/abap.instructions.md` para prefixos de objeto e
variáveis (ajuste `Z<PREFIXO>` ao seu projeto).
````

### 5.15 `templates/GAP_TEMPLATE/README.md`

````md
# GAP XXX / TICKET XXX

## Identificação
- Número:
- Título:
- Cliente:
- Projeto:
- Responsável:
- Status:

## Objetivo
Aguardando informações.

## Resumo funcional
Aguardando documentação.

## Resumo técnico
Aguardando análise.

## Estrutura de pastas
- `01_DOCUMENTACAO/` - EF, README da IA, guia de implementação, decisões técnicas, plano de testes, referências.
- `02_CODIGO/` - código-fonte aprovado. Subpastas por processo funcional quando necessário.
- `03_OBJETOS_ORIGINAIS/` - baseline original (não alterar).
- `04_CORRECOES/` - uma subpasta por correção, espelhando `05_ERROS/`.
- `05_ERROS/` - histórico permanente de erros/dumps. Formato `NN - DD-MM - HHhMM - descrição`.
- `06_RESULTADO_ESPERADO/` - `script_validacao.md` + `cenario_NN_validacao.md` + prints.

## Fluxo end-to-end
1. Baseline importado em `03_OBJETOS_ORIGINAIS/`. Código em `02_CODIGO/`.
2. Requisito lido de `01_DOCUMENTACAO/01_EF/`.
3. Erro recebido -> `05_ERROS/NN - DD-MM - HHhMM - descrição/` (dump + `ERRO.md`).
4. Correção entregue em `04_CORRECOES/NN - DD-MM - HHhMM - descrição/` (mesmo nome).
5. Se surgir novo erro, abrir novo `NN+1` em `05_ERROS/` + `04_CORRECOES/`.
6. Validação em `06_RESULTADO_ESPERADO/`.
7. Código aprovado migra para `02_CODIGO/`. Pasta em `04_CORRECOES/` vira histórico.

## Pendências
- Receber os arquivos da demanda.
- Classificar a documentação.
- Identificar os objetos técnicos.
````

### 5.16 `templates/GAP_TEMPLATE/01_DOCUMENTACAO/README.md`

````md
# 01_DOCUMENTACAO

Documentação da demanda, classificada por finalidade.

- `01_EF/` - Especificação Funcional oficial recebida.
- `02_README_IA/` - Documentos de apoio criados com IA. Não são EF.
- `03_GUIA_IMPLEMENTACAO/` - Documentação técnica do que foi implementado.
- `04_DECISOES_TECNICAS/` - Registro de decisões técnicas.
- `05_TESTES/` - Cenários, plano, resultados e validações.
- `06_REFERENCIAS/` - Notas, KBAs, links e materiais externos de referência.
````

### 5.17 `templates/GAP_TEMPLATE/01_DOCUMENTACAO/01_EF/README.md`

````md
# 01_EF

Especificação Funcional oficial recebida (requisito). Documento oficial — não
alterar. Ex.: `EF_GAP_XXX.md`.
````

### 5.18 `templates/GAP_TEMPLATE/01_DOCUMENTACAO/02_README_IA/README.md`

````md
# 02_README_IA

Documentos de apoio criados com IA para entendimento e direcionamento. Não são
EF e não substituem a especificação oficial. Ex.: `README_IA_GAP_XXX.md`.
````

### 5.19 `templates/GAP_TEMPLATE/01_DOCUMENTACAO/03_GUIA_IMPLEMENTACAO/README.md`

````md
# 03_GUIA_IMPLEMENTACAO

Documentação técnica do que foi implementado e como a solução foi organizada.
Ex.: `GUIA_IMPLEMENTACAO_GAP_XXX.md`.
````

### 5.20 `templates/GAP_TEMPLATE/01_DOCUMENTACAO/04_DECISOES_TECNICAS/README.md`

````md
# 04_DECISOES_TECNICAS

Registro das decisões de arquitetura, desenho e implementação tomadas durante o
desenvolvimento. Ex.: `DECISOES_TECNICAS_GAP_XXX.md`.
````

### 5.21 `templates/GAP_TEMPLATE/01_DOCUMENTACAO/05_TESTES/README.md`

````md
# 05_TESTES

Cenários, plano de testes, resultados, pendências e validações.
Ex.: `TEST_PLAN_GAP_XXX.md`.
````

### 5.22 `templates/GAP_TEMPLATE/01_DOCUMENTACAO/06_REFERENCIAS/README.md`

````md
# 06_REFERENCIAS

Notas, KBAs, links, materiais externos e payloads usados apenas como referência.
````

### 5.23 `templates/GAP_TEMPLATE/02_CODIGO/README.md`

````md
# 02_CODIGO

Somente código-fonte aprovado da demanda.

- Guardar apenas arquivos de código (ex.: `.abap`). Metadata e exports originais
  ficam em `03_OBJETOS_ORIGINAIS/`.
- Sem subdivisão padrão por tecnologia. Criar subpastas apenas quando o processo
  funcional exigir (ex.: `inbound/`, `outbound/`).
- O código só chega aqui após aprovação/teste da correção correspondente.
````

### 5.24 `templates/GAP_TEMPLATE/03_OBJETOS_ORIGINAIS/README.md`

````md
# 03_OBJETOS_ORIGINAIS

Baseline dos objetos, com metadata completo do export, **antes de qualquer
alteração**.

- Serve para comparar versão original × alterada × final.
- **Imutável**: nunca editar diretamente. Toda mudança é registrada como
  análise em `05_ERROS/` + correção em `04_CORRECOES/`.
````

### 5.25 `templates/GAP_TEMPLATE/04_CORRECOES/README.md`

````md
# 04_CORRECOES

Correções entregáveis para cada erro registrado em `../05_ERROS/`.

## Regra 1:1
- Cada erro em `../05_ERROS/` gera UMA subpasta aqui, com nome **idêntico**.
- Se um fix desencadeia novo erro, o novo erro vira `NN+1` em `../05_ERROS/` e a
  nova correção `NN+1` aqui. Nunca consolidar vários erros numa única pasta.

## Nome da subpasta
`<NN> - <DD-MM> - <HHhMM> - <descrição curta>` (igual ao da pasta do erro).

## O que vai dentro (apenas isto)
1. Código corrigido (ex.: `.abap`, padrão de export). Pode haver mais de um
   arquivo quando o mesmo erro exige alterar mais de um objeto.
2. Guia `.md` para ações que não são código (criar elemento de dados, tabela,
   entrada de customizing, etc.).

## O que NÃO vai aqui
- EF, README da IA, guia de implementação, decisões técnicas -> `../01_DOCUMENTACAO/`.
- Dump original, print, análise -> `../05_ERROS/<mesma subpasta>/`.
- Metadata de export e baseline -> `../03_OBJETOS_ORIGINAIS/`.
- Código consolidado -> `../02_CODIGO/` (só após aprovação).
````

### 5.26 `templates/GAP_TEMPLATE/05_ERROS/README.md`

````md
# 05_ERROS

Histórico permanente de todos os erros/dumps da demanda.

## Nome de cada entrada
`<NN> - <DD-MM> - <HHhMM> - <descrição curta>`

- `NN`: sequencial de dois dígitos por demanda (`01`..`99`). Nunca reutilizar.
- `DD-MM` / `HHhMM`: data/hora do recebimento no fuso do projeto (`-` e `h`
  porque `/` e `:` não são válidos em nomes de pasta no Windows).

## O que vai dentro
- Dump/log bruto exatamente como recebido (`dump.txt`, `.log`, `.png`).
- `ERRO.md` (ou `analise.md`) com: Contexto, Sintoma, Causa raiz, Evidências,
  Impacto, Referências (ver `templates/ERRO_TEMPLATE.md`).

## Ligação com `04_CORRECOES/`
O nome da pasta do erro e o da correção são **idênticos** — rastreabilidade 1:1.

## Regra
- Nunca apagar entradas. Esta pasta é histórico, não área de trânsito.
````

### 5.27 `templates/GAP_TEMPLATE/06_RESULTADO_ESPERADO/README.md`

````md
# 06_RESULTADO_ESPERADO

Prova de que as correções funcionam. **Não** é correção e **não** tem relação
1:1 com `05_ERROS/`.

## Conteúdo
- `script_validacao.md` - todos os cenários previstos na EF (smoke, caminho
  feliz, cada erro esperado, borda).
- `cenario_NN_validacao.md` - registro de cada execução real: data/hora, output
  capturado, checklist de verificação.
- Prints/evidências de suporte.

## Regra
- Se um cenário reprovar por bug real de código, abrir nova entrada em
  `../05_ERROS/` + correção em `../04_CORRECOES/`.
````

---

## 6. Checklist de validação final (a IA deve rodar e reportar)

- [ ] A árvore da Seção 3 foi criada por completo (todas as pastas e arquivos).
- [ ] Cada arquivo bate com o conteúdo verbatim da Seção 5.
- [ ] `AGENTS.md` foi criado na raiz a partir do template 5.14.
- [ ] `.gitignore` contém `.vscode/mcp.json`.
- [ ] Nenhum arquivo contém credenciais, senhas, tokens, IPs ou URLs privadas.
- [ ] Placeholders `<...>`, `Z<PREFIXO>`, `<AJUSTE_SEU_FUSO>`, `<AUTOR>` foram
      mantidos (não preenchidos automaticamente).
- [ ] `settings.json` habilita `chat.promptFiles` e
      `github.copilot.chat.codeGeneration.useInstructionFiles`.

## 7. Passos manuais após a IA criar a estrutura

1. Abrir o repositório no VS Code e instalar as extensões recomendadas.
2. Fazer login no Copilot com a conta pessoal do GitHub.
3. Copiar `.vscode/mcp.json.template` para `.vscode/mcp.json` e preencher os
   placeholders (de preferência via `${input:...}`; nunca cometer o arquivo).
4. Ajustar `Z<PREFIXO>`, `<AJUSTE_SEU_FUSO>` e `<AUTOR>` ao seu projeto.
5. Criar a primeira demanda copiando `templates/GAP_TEMPLATE/` para `GAP_<numero>/`.
