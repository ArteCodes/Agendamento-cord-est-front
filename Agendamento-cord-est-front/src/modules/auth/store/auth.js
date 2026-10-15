import { defineStore } from 'pinia'

// Lista de usuários simulados para autenticação (mock - estático, sem backend)
export const mockUsers = [
  { id: 1, nome: 'Maria Silva', email: 'aluno@teste.com', senha: '123456', tipo: 'aluno', matricula: '2026001' },
  { id: 2, nome: 'João Santos', email: 'coord@teste.com', senha: '123456', tipo: 'coordenador', matricula: 'C001', carga_horaria_semanal: 20 },
  { id: 3, nome: 'Suporte Silva', email: 'suporte@teste.com', senha: '123456', tipo: 'suporte', matricula: 'S001' }
]

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Objeto do usuário autenticado: null ou { id, nome, email, tipo }
    user: null
  }),

  getters: {
    // Retorna true se o usuário estiver autenticado (diferente de null)
    isAuthenticated: (state) => state.user !== null,

    // Retorna true se o usuário for do tipo 'aluno'
    isAluno: (state) => state.user?.tipo === 'aluno',

    // Retorna true se o usuário for do tipo 'coordenador'
    isCoordenador: (state) => state.user?.tipo === 'coordenador',

    // Retorna true se o usuário for do tipo 'suporte'
    isSuporte: (state) => state.user?.tipo === 'suporte',

    // Pode criar agendamentos: aluno ou suporte (coordenador não cria)
    canCreate: (state) => state.user?.tipo === 'aluno' || state.user?.tipo === 'suporte',

    // Pode validar agendamentos: coordenador ou suporte (validação só no Show)
    canValidate: (state) => state.user?.tipo === 'coordenador' || state.user?.tipo === 'suporte',

    // Retorna o tipo do usuário ('aluno', 'coordenador') ou null se não logado
    userTipo: (state) => (state.user ? state.user.tipo : null),

    // Retorna o nome do usuário autenticado ou string vazia
    userName: (state) => (state.user ? state.user.nome : ''),

    // Carga horária semanal do coordenador (fixa, vinda da tabela de coordenadores — não editável na tela).
    // Fallback 20h para coordenador com sessão antiga sem o campo.
    cargaHorariaSemanal: (state) => {
      if (state.user?.carga_horaria_semanal != null) return Number(state.user.carga_horaria_semanal)
      if (state.user?.tipo === 'coordenador') return 20
      return 0
    }
  },

  actions: {
    /**
     * Valida credenciais contra os usuários simulados.
     * Atualiza o estado, persiste no localStorage e retorna true/false.
     */
    login(email, senha) {
      const foundUser = mockUsers.find(
        (u) => u.email === email && u.senha === senha
      )

      if (foundUser) {
        // Armazena dados do usuário sem expor a senha no estado
        const { senha: _, ...userData } = foundUser
        this.user = userData
        localStorage.setItem('user', JSON.stringify(userData))
        return true
      }

      return false
    },

    /**
     * Limpa o estado do usuário e remove os dados do localStorage.
     */
    logout() {
      this.user = null
      localStorage.removeItem('user')
    },

    /**
     * Tenta carregar o usuário salvo no localStorage na inicialização da aplicação.
     */
    loadFromStorage() {
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          this.user = JSON.parse(storedUser)
          return true
        }
      } catch (error) {
        console.error('Erro ao recuperar dados do usuário do localStorage:', error)
        this.user = null
        localStorage.removeItem('user')
      }
      return false
    }
  }
})
