import { defineStore } from 'pinia'

// Lista de usuários simulados para autenticação (mock)
export const mockUsers = [
  { id: 1, nome: 'Maria Silva', email: 'aluno@teste.com', senha: '123456', tipo: 'aluno' },
  { id: 2, nome: 'João Santos', email: 'coord@teste.com', senha: '123456', tipo: 'coordenador' }
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

    // Retorna o tipo do usuário ('aluno', 'coordenador') ou null se não logado
    userTipo: (state) => (state.user ? state.user.tipo : null),

    // Retorna o nome do usuário autenticado ou string vazia
    userName: (state) => (state.user ? state.user.nome : '')
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
