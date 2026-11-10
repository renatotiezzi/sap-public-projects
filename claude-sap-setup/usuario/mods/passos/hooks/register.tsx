import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Painel, Passo } from '../types'

const PANE = 'passos'
// Cada projeto guarda os seus passos no mesmo lugar, dentro da própria pasta.
const RELATIVO = '/docs/acompanhamento/PASSOS.json'

const vazio: Painel = { titulo: 'Passos', atualizadoEm: '', passos: [] }
const painel = atom({ plugin: 'passos', key: 'painel' } as const, vazio)

const MARCA: Record<Passo['estado'], string> = {
  feito: '✅',
  andamento: '⏳',
  falta: '⬜',
  voce: '👤',
  bloqueado: '⛔',
}

let ultimo = ''
let arquivoAtual = ''
let aberto = false

function nomeDoProjeto(pasta: string): string {
  if (/\/sap-speed-up$/i.test(pasta)) return 'Speed Up'
  return pasta.slice(pasta.lastIndexOf('/') + 1)
}

// Sobe do cwd da conversa até achar a pasta de projeto que tem o arquivo de passos.
async function acharProjeto($: EngineInterface): Promise<{ arquivo: string; nome: string } | undefined> {
  let pasta = (await $.session.cwd()).replace(/\\/g, '/').replace(/\/+$/, '')
  while (pasta.lastIndexOf('/') > 2) {
    const arquivo = pasta + RELATIVO
    if (await $.fs.exists(arquivo)) return { arquivo, nome: nomeDoProjeto(pasta) }
    pasta = pasta.slice(0, pasta.lastIndexOf('/'))
  }
  return undefined
}

// Declarada no topo do arquivo: o motor (2.1.308) só segue o $ até uma função assim.
// Devolve a mudança do painel; quem chama aplica com update (o validador só aceita o update no hook).
async function ler($: EngineInterface): Promise<((atual: Painel) => Painel) | undefined> {
  try {
    const projeto = await acharProjeto($)
    if (!projeto) {
      if (arquivoAtual === '') return undefined
      arquivoAtual = ''
      ultimo = ''
      return () => ({ ...vazio, titulo: 'Esta conversa não está num projeto com passos' })
    }
    if (projeto.arquivo !== arquivoAtual) {
      arquivoAtual = projeto.arquivo
      ultimo = ''
    }
    const texto = await $.fs.read(projeto.arquivo)
    if (!aberto) {
      aberto = true
      void $.ui.open({ id: PANE, title: `${projeto.nome} · passos` })
    }
    if (texto === ultimo) return undefined
    ultimo = texto
    const dado = JSON.parse(texto) as Painel
    return () => ({ ...vazio, ...dado, projeto: projeto.nome, erro: undefined })
  } catch (erro) {
    const msg = erro instanceof Error ? erro.message : String(erro)
    return atual => ({ ...atual, erro: msg })
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'passos',
      description: 'Abre o painel com os passos do projeto desta conversa',
    })
    aberto = false
    const mudanca = await ler($)
    if (mudanca) await update($, painel, mudanca)
    $.clock.every(3000, async () => {
      const m = await ler($)
      if (m) await update($, painel, m)
    })

    return next(e)
  })

  on('command.run', { command: 'passos' }, async $ => {
    aberto = false
    const mudanca = await ler($)
    if (mudanca) await update($, painel, mudanca)
    if (!aberto) return { text: 'Esta conversa não está num projeto com o arquivo de passos (docs/acompanhamento/PASSOS.json).' }

    return { text: 'Painel de passos aberto.' }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text } = $.ui.resolve(e)
    const p = await read($, painel)
    const feitos = p.passos.filter(x => x.estado === 'feito').length

    return (
      <Box flexDirection="column">
        {p.projeto && <Text dimColor>{p.projeto}</Text>}
        <Text bold>{p.titulo}</Text>
        <Text dimColor>
          {feitos} de {p.passos.length} feitos · atualizado {p.atualizadoEm || '—'}
        </Text>
        {p.agora && <Text color="yellow">Agora: {p.agora}</Text>}
        {p.erro && <Text color="red">Não li o arquivo de passos: {p.erro}</Text>}
        {p.passos.map(x => (
          <Box flexDirection="column" marginTop={1}>
            <Text bold={x.estado === 'andamento' || x.estado === 'voce'} dimColor={x.estado === 'feito'}>
              {MARCA[x.estado] ?? '•'} {x.id}. {x.titulo}
              {x.quem ? ` · ${x.quem}` : ''}
            </Text>
            {x.porque && <Text dimColor>   por quê: {x.porque}</Text>}
            {x.prova && <Text dimColor>   prova: {x.prova}</Text>}
          </Box>
        ))}
        <Text dimColor>✅ feito · ⏳ em andamento · 👤 você · ⛔ bloqueado · ⬜ falta</Text>
      </Box>
    )
  })
}
