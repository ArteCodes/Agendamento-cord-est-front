<script setup>
import { RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/store/auth'
import { storeToRefs } from 'pinia'

const router = useRouter()
const authStore = useAuthStore()
const { isAuthenticated, isAluno, isCoordenador, isSuporte, userName, userTipo } = storeToRefs(authStore)

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <!-- Navbar - só aparece se o usuário estiver autenticado -->
  <nav v-if="isAuthenticated" class="navbar">
    <div class="navbar-brand">
      <span class="navbar-logo">📅</span>
      <span class="navbar-title">Sistema de Agendamentos</span>
    </div>

    <div class="navbar-links">
      <!-- Link só para Aluno -->
      <RouterLink v-if="isAluno" to="/agendamentos" class="nav-link">
        Meus Agendamentos
      </RouterLink>

      <!-- Links só para Coordenador -->
      <RouterLink v-if="isCoordenador" to="/gestao" class="nav-link">
        Gestão
      </RouterLink>
      <RouterLink v-if="isCoordenador" to="/gestao-horarios" class="nav-link">
        Gestão de Horários
      </RouterLink>
      <RouterLink v-if="isCoordenador" to="/calendario" class="nav-link">
        Calendário
      </RouterLink>
    </div>

    <div class="navbar-user">
      <span class="user-name">{{ userName }}</span>
      <span class="user-badge" :class="{ 'badge-aluno': isAluno, 'badge-coord': isCoordenador }">
        {{ isAluno ? 'Aluno' : 'Coordenador' }}
      </span>
      <button class="btn-logout" @click="handleLogout">Sair</button>
    </div>
  </nav>

  <main :class="{ 'with-navbar': isAuthenticated }">
    <RouterView />
  </main>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.navbar-logo {
  font-size: 24px;
}

.navbar-title {
  font-weight: 600;
  font-size: 16px;
  color: #333;
}

.navbar-links {
  display: flex;
  gap: 8px;
}

.nav-link {
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  color: #555;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s, color 0.2s;
}

.nav-link:hover {
  background-color: #f0f0f0;
  color: #333;
}

.nav-link.router-link-active {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-name {
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

.user-badge {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-aluno {
  background-color: #e3f2fd;
  color: #1565c0;
}

.badge-coord {
  background-color: #fce4ec;
  color: #c62828;
}

.btn-logout {
  padding: 6px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #fff;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  background: #f44336;
  color: #fff;
  border-color: #f44336;
}

main {
  min-height: 100vh;
}

main.with-navbar {
  padding-top: 60px;
}
</style>
