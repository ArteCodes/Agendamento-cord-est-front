<template>
  <form @submit.prevent="$emit('submit')" class="login-form">
    <!-- Campo de Email -->
    <div class="form-group">
      <label for="email">Email</label>
      <input
        id="email"
        :value="email"
        type="email"
        placeholder="Digite seu email"
        autocomplete="email"
        required
        @input="$emit('update:email', $event.target.value)"
      />
    </div>

    <!-- Campo de Senha -->
    <div class="form-group">
      <label for="senha">Senha</label>
      <input
        id="senha"
        :value="password"
        type="password"
        placeholder="Digite sua senha"
        autocomplete="current-password"
        required
        @input="$emit('update:password', $event.target.value)"
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
</template>

<script setup>
defineProps({
  email: { type: String, default: '' },
  password: { type: String, default: '' },
  errorMsg: { type: String, default: '' }
})

defineEmits(['submit', 'update:email', 'update:password'])
</script>

<style scoped>
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
