import { defineStore } from 'pinia'

/**
 * schedule.js — store do módulo schedule (Gestão de Horários / Coordenador).
 * Horários semanais recorrentes (Seg-Dom), sem backend: persistência em localStorage.
 * Item: { id, coordinator_id, dia_semana (0=Dom..6=Sab), hora_inicio "HH:MM", duracao_min, hora_fim "HH:MM", tipo }
 */
const keyPorCoordenador = (coordId) => `schedule:${coordId}`

export function somarMinutos(horaStr, minutos) {
  const [h, m] = String(horaStr || '00:00').split(':').map(Number)
  const total = (h || 0) * 60 + (m || 0) + (minutos || 0)
  if (total < 0 || total > 24 * 60) return null
  const nh = Math.floor(total / 60) % 24
  const nm = total % 60
  return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`
}

export function paraMinutos(horaStr) {
  const [h, m] = String(horaStr || '00:00').split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    // Somente horários CONFIRMADOS (botão Confirmar). Rascunho fica só na view.
    salvos: []
  }),

  getters: {
    porCoordenador: (state) => (coordId) => {
      if (coordId == null) return []
      return state.salvos.filter((s) => s.coordinator_id === coordId)
    },
    totalMinSalvos: (state) => (coordId) => {
      if (coordId == null) return 0
      return state.salvos
        .filter((s) => s.coordinator_id === coordId)
        .reduce((acc, s) => acc + (Number(s.duracao_min) || 0), 0)
    }
  },

  actions: {
    carregar(coordId) {
      if (coordId == null) {
        this.salvos = []
        return
      }
      try {
        const raw = localStorage.getItem(keyPorCoordenador(coordId))
        const todos = raw ? JSON.parse(raw) : []
        // Mantém apenas deste coordenador no estado visível + preserva outros? Simplifica: estado global, filtra por coord.
        // Para não perder outros coordenadores, faz merge.
        const outros = this.salvos.filter((s) => s.coordinator_id !== coordId)
        this.salvos = [...outros, ...todos.filter((s) => s.coordinator_id === coordId)]
      } catch (e) {
        console.error('Erro ao carregar horários:', e)
      }
    },

    persistir(coordId) {
      try {
        const meus = this.salvos.filter((s) => s.coordinator_id === coordId)
        localStorage.setItem(keyPorCoordenador(coordId), JSON.stringify(meus))
      } catch (e) {
        console.error('Erro ao persistir horários:', e)
      }
    },

    temSobreposicao(coordId, diaSemana, horaInicio, duracaoMin, ignorarId = null) {
      const ini = paraMinutos(horaInicio)
      const fim = ini + Number(duracaoMin)
      return this.salvos.some((s) => {
        if (s.coordinator_id !== coordId) return false
        if (Number(s.dia_semana) !== Number(diaSemana)) return false
        if (ignorarId != null && s.id === ignorarId) return false
        const sIni = paraMinutos(s.hora_inicio)
        const sFim = sIni + Number(s.duracao_min)
        return ini < sFim && fim > sIni
      })
    },

    salvarLote(coordId, novos) {
      const lote = (novos || []).map((n) => {
        const novoId = this.salvos.length > 0 ? Math.max(...this.salvos.map((s) => s.id)) + 1 : 1
        // incrementa para múltiplos itens
        const maxAtual = Math.max(novoId, ...this.salvos.map((s) => s.id), 0)
        const id = maxAtual + (this._seq = (this._seq || 0) + 1) - 1
        return {
          id,
          coordinator_id: coordId,
          dia_semana: Number(n.dia_semana),
          hora_inicio: n.hora_inicio,
          duracao_min: Number(n.duracao_min),
          hora_fim: somarMinutos(n.hora_inicio, Number(n.duracao_min)),
          tipo: n.tipo || 'Atendimento'
        }
      })
      // reseta sequenciador auxiliar
      this._seq = 0
      this.salvos.push(...lote)
      this.persistir(coordId)
      return lote
    },

    removerSalvo(id, coordId) {
      this.salvos = this.salvos.filter((s) => s.id !== id)
      if (coordId != null) this.persistir(coordId)
    }
  }
})