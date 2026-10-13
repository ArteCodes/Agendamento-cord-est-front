import { defineStore } from 'pinia'

export const useAppointmentStore = defineStore('appointment', {
  state: () => ({
    agendamentos: [
      {
        id: 1,
        aluno: 'Maria Silva',
        alunoEmail: 'aluno@teste.com',
        nome: 'Consulta Psicológica',
        data: '2026-10-15',
        horario: '14:00',
        local: 'Sala 201',
        status: 'Confirmado',
        descricao: 'Sessão de acompanhamento psicológico individual.'
      },
      {
        id: 2,
        aluno: 'Carlos Souza',
        alunoEmail: 'carlos@teste.com',
        nome: 'Orientação Acadêmica',
        data: '2026-10-18',
        horario: '10:30',
        local: 'Sala 105',
        status: 'Confirmado',
        descricao: 'Orientação sobre grade curricular e equivalência de matérias.'
      },
      {
        id: 3,
        aluno: 'Ana Lima',
        alunoEmail: 'ana@teste.com',
        nome: 'Atendimento Social',
        data: '2026-10-20',
        horario: '09:00',
        local: 'Sala 302',
        status: 'Pendente',
        descricao: 'Avaliação socioeconômica para auxílio permanência.'
      },
      {
        id: 4,
        aluno: 'Pedro Costa',
        alunoEmail: 'pedro@teste.com',
        nome: 'Consulta Nutricional',
        data: '2026-10-22',
        horario: '11:00',
        local: 'Sala 108',
        status: 'Pendente',
        descricao: 'Acompanhamento nutricional e reeducação alimentar.'
      },
      {
        id: 5,
        aluno: 'Maria Silva',
        alunoEmail: 'aluno@teste.com',
        nome: 'Orientação Acadêmica',
        data: '2026-10-25',
        horario: '15:00',
        local: 'Coordenação Geral',
        status: 'Confirmado',
        descricao: 'Reunião de alinhamento sobre TCC e estágio supervisionado.'
      },
      {
        id: 6,
        aluno: 'Lucas Ferreira',
        alunoEmail: 'lucas@teste.com',
        nome: 'Apoio Psicopedagógico',
        data: '2026-10-15',
        horario: '16:00',
        local: 'Sala 201',
        status: 'Confirmado',
        descricao: 'Avaliação de métodos de estudo e rendimento acadêmico.'
      },
      {
        id: 7,
        aluno: 'Maria Silva',
        alunoEmail: 'aluno@teste.com',
        nome: 'Consulta Nutricional',
        data: '2026-09-10',
        horario: '11:00',
        local: 'Sala 108',
        status: 'Cancelado',
        descricao: 'Acompanhamento de rotina nutricional.'
      }
    ]
  }),

  getters: {
    // Retorna todos os agendamentos com status 'Confirmado' (usados no calendário)
    agendamentosConfirmados: (state) => {
      return state.agendamentos.filter((a) => a.status === 'Confirmado')
    },

    // Retorna agendamentos confirmados para uma data específica (YYYY-MM-DD)
    confirmadosPorData: (state) => (dataStr) => {
      return state.agendamentos.filter(
        (a) => a.status === 'Confirmado' && a.data === dataStr
      )
    },

    // Retorna agendamentos de um aluno específico pelo email
    agendamentosPorAluno: (state) => (email) => {
      return state.agendamentos.filter((a) => a.alunoEmail === email)
    },

    // Contadores gerais
    totalAgendamentos: (state) => state.agendamentos.length,
    totalPendentes: (state) => state.agendamentos.filter((a) => a.status === 'Pendente').length,
    totalConfirmados: (state) => state.agendamentos.filter((a) => a.status === 'Confirmado').length
  },

  actions: {
    /**
     * Valida um agendamento, mudando seu status para 'Confirmado'.
     * Isso faz o agendamento aparecer imediatamente no Calendário de Atendimento.
     */
    validarAgendamento(id) {
      const item = this.agendamentos.find((a) => a.id === id)
      if (item) {
        item.status = 'Confirmado'
      }
    },

    /**
     * Cancela um agendamento.
     */
    cancelarAgendamento(id) {
      const item = this.agendamentos.find((a) => a.id === id)
      if (item) {
        item.status = 'Cancelado'
      }
    },

    /**
     * Adiciona um novo agendamento (estático, sem backend).
     */
    criarAgendamento(novoAgendamento) {
      const novoId = this.agendamentos.length > 0
        ? Math.max(...this.agendamentos.map((a) => a.id)) + 1
        : 1

      this.agendamentos.push({
        id: novoId,
        status: 'Pendente',
        ...novoAgendamento
      })
    }
  }
})

// Alias para compatibilidade com código antigo (stores/agendamentos.js)
export const useAgendamentosStore = useAppointmentStore
