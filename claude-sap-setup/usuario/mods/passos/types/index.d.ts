export type Passo = {
  id: string
  titulo: string
  estado: 'feito' | 'andamento' | 'falta' | 'voce' | 'bloqueado'
  quem?: string
  porque?: string
  prova?: string
}

export type Painel = {
  /** O projeto da conversa (Speed Up ou outro), achado pelo cwd da sessão. */
  projeto?: string
  titulo: string
  atualizadoEm: string
  agora?: string
  passos: Passo[]
  erro?: string
}

declare module 'claude-code' {
  interface PluginState {
    'passos': { painel: Painel }
  }
}
