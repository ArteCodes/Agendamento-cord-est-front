<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/store/auth'
import FormCreate from '@/modules/auth/model/FormCreate.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const senha = ref('')
const errorMsg = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  if (isLoading.value) return
  isLoading.value = true
  errorMsg.value = ''
  try {
    const success = await authStore.login(email.value, senha.value)
    if (success) {
      router.push('/agendamentos')
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
<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="title">Sistema de Agendamentos</h1>
      <p class="subtitle">Faça login para continuar</p>
      <FormCreate v-model:email="email" v-model:password="senha" :error-msg="errorMsg" @submit="handleLogin" />
    </div>
  </div>
</template>
<style scoped>
.login-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #f5f5f5; padding: 1.5rem; box-sizing: border-box; }
.login-card { background: #fff; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); max-width: 400px; width: 100%; padding: 2.5rem 2rem; text-align: center; }
.title { font-size: 1.5rem; font-weight: 700; color: #333; margin: 0 0 0.5rem 0; }
.subtitle { font-size: 0.95rem; color: #666; margin: 0 0 2rem 0; }
</style>
