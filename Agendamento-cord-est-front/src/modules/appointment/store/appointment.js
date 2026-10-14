import { defineStore } from 'pinia'

export const useAppointmentStore = defineStore('appointment', {
  state: () => ({
    agendamentos: [
      {
        id: 1,
        aluno: 'Maria Silva',
        alunoEmail: 'aluno@teste.com',
        aluno_matricula: '2026001',
        created_by: 1,
        coordinator_id: 2,
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
        aluno_matricula: '2026002',
        created_by: 3,
        coordinator_id: 2,
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
        aluno_matricula: '2026003',
        created_by: 3,
        coordinator_id: 2,
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
        aluno_matricula: '2026004',
        created_by: 1,
        coordinator_id: 2,
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
        aluno_matricula: '2026001',
        created_by: 1,
        coordinator_id: 2,
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
        aluno_matricula: '2026005',
        created_by: 3,
        coordinator_id: 2,
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
        aluno_matricula: '2026001',
        created_by: 1,
        coordinator_id: 2,
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

    // Retorna agendamentos de um aluno específico pelo email (legado)
    agendamentosPorAluno: (state) => (email) => {
      return state.agendamentos.filter((a) => a.alunoEmail === email)
    },

    // Visibilidade por função (lista unificada):
    // aluno -> created_by == id OU aluno_matricula == matricula OU alunoEmail == email
    // coordenador -> coordinator_id == id (só destinados, nunca todos)
    // suporte -> created_by == id (só próprios)
    visiveisPorFuncao: (state) => (user) => {
      if (!user) return []
      if (user.tipo === 'aluno') {
        return state.agendamentos.filter(
          (a) =>
            a.created_by === user.id ||
            (user.matricula && a.aluno_matricula === user.matricula) ||
            a.alunoEmail === user.email
        )
      }
      if (user.tipo === 'coordenador') {
        return state.agendamentos.filter((a) => a.coordinator_id === user.id)
      }
      if (user.tipo === 'suporte') {
        return state.agendamentos.filter((a) => a.created_by === user.id)
      }
      return []
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
     * Preenche created_by / aluno_matricula / coordinator_id quando não informados.
     */
    criarAgendamento(novoAgendamento, criador = null) {
      const novoId = this.agendamentos.length > 0
        ? Math.max(...this.agendamentos.map((a) => a.id)) + 1
        : 1

      this.agendamentos.push({
        id: novoId,
        status: 'Pendente',
        created_by: criador?.id ?? novoAgendamento.created_by ?? null,
        aluno_matricula: novoAgendamento.aluno_matricula ?? criador?.matricula ?? null,
        coordinator_id: novoAgendamento.coordinator_id ?? 2,
        ...novoAgendamento
      })
    }
  }
})

// Alias para compatibilidade com código antigo (stores/agendamentos.js)
export const useAgendamentosStore = useAppointmentStore
