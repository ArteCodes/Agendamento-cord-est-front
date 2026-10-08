<template>
  <div class="login-container">
    <h2>Acesso ao Sistema</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label>E-mail:</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label>Senha:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Entrando...' : 'Entrar' }}
      </button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useRouter } from 'vue-router';
import api from '../services/api';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    // 1. Autentica no Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    
    // 2. Opcional: Chama uma rota do seu backend FastAPI (ex: /usuarios/me) 
    // para buscar dados como matrícula, nome e perfil no PostgreSQL.
    // O token vai automaticamente pelo interceptador criado no passo 2.
    const response = await api.get('/routers/auth/me'); 
    
    const userProfile = response.data.perfil; // Ex: 'Aluno', 'Apoio', 'Coordenador'
    
    // 3. Redireciona com base no perfil
    if (userProfile === 'Aluno') {
      router.push('/meus-agendamentos');
    } else {
      router.push('/painel-triagem');
    }

  } catch (error) {
    errorMessage.value = "Falha no login. Verifique suas credenciais.";
    console.error("Erro Firebase:", error.message);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.error { color: red; }
/* Adicione sua estilização aqui para manter a interface 100% responsiva */
</style>    