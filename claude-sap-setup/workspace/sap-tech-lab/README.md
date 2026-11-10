# sap-tech-lab

Template oficial de organização para demandas SAP (GAP, Ticket e pacotes de desenvolvimento), com operação orientada ao GitHub Copilot.

## Fonte oficial

A única fonte de verdade para novas demandas está em:

- `TEMPLATE_DEMANDA/`

Esse template é reutilizável, evolutivo e contém:

- Blueprint completo de setup
- Instruções operacionais do Copilot
- Estrutura padrão de demanda
- Templates de erro, correção e validação

## Estrutura conceitual da raiz

```text
sap-tech-lab/
├── .github/
├── .vscode/
├── TEMPLATE_DEMANDA/
├── GAP_<numero>/
├── TICKET_<numero>/
├── Library - Dev completed/
└── README.md
```

## Regra operacional

Sempre que uma nova demanda for informada, o Copilot deve:

1. Identificar a demanda.
2. Criar automaticamente a estrutura baseada em `TEMPLATE_DEMANDA/templates/GAP_TEMPLATE/`.
3. Classificar os arquivos recebidos.
4. Organizar cada arquivo no local correto.
5. Preservar os arquivos originais.
6. Preparar a demanda para análise, correções e testes.

## Observação

`Library - Dev completed/` é área de histórico e backup. O template oficial permanece na raiz, em `TEMPLATE_DEMANDA/`.
