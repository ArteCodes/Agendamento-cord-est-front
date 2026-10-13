<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Título e subtítulo do sistema -->
      <h1 class="title">Sistema de Agendamentos</h1>
      <p class="subtitle">Faça login para continuar</p>

      <!-- Formulário de autenticação -->
      <form @submit.prevent="handleLogin" class="login-form">
        <!-- Campo de Email -->
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Digite seu email"
            autocomplete="email"
            required
          />
        </div>

        <!-- Campo de Senha -->
        <div class="form-group">
          <label for="senha">Senha</label>
          <input
            id="senha"
            v-model="senha"
            type="password"
            placeholder="Digite sua senha"
            autocomplete="current-password"
            required
          />
        </div>

        <!-- Mensagem de erro exibida quando houver falha no login -->
        <div v-if="errorMsg" class="error-message error">
          {{ errorMsg }}
        </div>

        <!-- Botão de submissão do formulário -->
        <button type="submit" class="btn-login">
          Entrar
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Inicialização do roteador e da store de autenticação
const router = useRouter()
const authStore = useAuthStore()

// Estados reativos para os campos de entrada e mensagem de erro
const email = ref('')
const senha = ref('')
const errorMsg = ref('')

// Controle de submissão para evitar múltiplas chamadas simultâneas
const isLoading = ref(false)

/**
 * Função responsável por realizar o login do usuário.
 * Invoca authStore.login e redireciona de acordo com o perfil retornado (aluno ou coordenador).
 * Em caso de credenciais incorretas ou falha, define a mensagem de erro apropriada.
 */
const handleLogin = async () => {
  if (isLoading.value) return
  isLoading.value = true
  errorMsg.value = ''

  try {
    const success = await authStore.login(email.value, senha.value)

    if (success) {
      // Identifica o tipo do usuário autenticado (através da store ou do retorno da ação)
      const tipo = authStore.user?.tipo || authStore.userTipo || (success && success.tipo)

      if (tipo === 'aluno') {
        router.push('/agendamentos')
      } else if (tipo === 'coordenador') {
        router.push('/gestao')
      } else {
        router.push('/agendamentos')
      }
    } else {
      errorMsg.value = 'Email ou senha inválidos'
    }
  } catch (error) {
    errorMsg.value = 'Email ou senha inválidos'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Container principal cobrindo toda a viewport com fundo neutro */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 1.5rem;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

/* Card centralizado com cantos arredondados e sombra */
.login-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  max-width: 400px;
  width: 100%;
  padding: 2.5rem 2rem;
  box-sizing: border-box;
  text-align: center;
}

/* Título e subtítulo */
.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333333;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  font-size: 0.95rem;
  color: #666666;
  margin: 0 0 2rem 0;
}

/* Formulário e campos de entrada */
.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-bottom: 1.25rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #333333;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  box-sizing: border-box;
  font-size: 0.95rem;
  color: #333333;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

/* Mensagem de erro */
.error-message {
  color: #d32f2f;
  font-size: 0.875rem;
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
  text-align: center;
  font-weight: 500;
}

/* Botão de login com estilo moderno e efeito hover */
.btn-login {
  width: 100%;
  background-color: #4CAF50;
  color: #ffffff;
  padding: 12px;
  border-radius: 6px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
  margin-top: 0.5rem;
}

.btn-login:hover {
  background-color: #43a047;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.btn-login:active {
  background-color: #388e3c;
}
</style>
