import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/modules/auth/store/auth'
import AuthCreate from '@/modules/auth/views/Create.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: AuthCreate,
      meta: { requiresAuth: false }
    },
    {
      path: '/agendamentos',
      name: 'agendamentos',
      component: () => import('@/modules/appointment/views/List.vue'),
      meta: { requiresAuth: true, role: 'aluno' }
    },
    {
      path: '/agendamentos/criar',
      name: 'criar-agendamento',
      component: () => import('@/modules/appointment/views/Create.vue'),
      meta: { requiresAuth: true, role: 'aluno' }
    },
    {
      path: '/agendamentos/:id',
      name: 'detalhe-agendamento',
      component: () => import('@/modules/appointment/views/Show.vue'),
      meta: { requiresAuth: true, role: 'aluno' }
    },
    {
      path: '/gestao',
      name: 'gestao',
      component: () => import('@/modules/management/views/List.vue'),
      meta: { requiresAuth: true, role: 'coordenador' }
    },
    {
      path: '/gestao/:id',
      name: 'detalhe-gestao',
      component: () => import('@/modules/management/views/Show.vue'),
      meta: { requiresAuth: true, role: 'coordenador' }
    },
    {
      path: '/calendario',
      name: 'calendario',
      component: () => import('@/modules/calendar/views/List.vue'),
      meta: { requiresAuth: true, role: 'coordenador' }
    },
    {
      // Rota raiz: redireciona para o dashboard correto baseado no role
      path: '/',
      name: 'home',
      redirect: () => {
        const authStore = useAuthStore()
        if (!authStore.isAuthenticated) return '/login'
        if (authStore.isAluno) return '/agendamentos'
        if (authStore.isCoordenador) return '/gestao'
        return '/login'
      }
    }
  ]
})

// Navigation Guard global - protege rotas por autenticação e role
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Tenta carregar usuário do localStorage na primeira navegação
  if (!authStore.isAuthenticated) {
    authStore.loadFromStorage()
  }

  const requiresAuth = to.meta.requiresAuth
  const requiredRole = to.meta.role

  // Se a rota não requer autenticação (ex: login), permite acesso
  if (requiresAuth === false) {
    // Se já está logado e tenta ir para login, redireciona para o dashboard
    if (to.name === 'login' && authStore.isAuthenticated) {
      if (authStore.isAluno) return next('/agendamentos')
      if (authStore.isCoordenador) return next('/gestao')
    }
    return next()
  }

  // Se a rota requer autenticação e o usuário não está logado
  if (requiresAuth && !authStore.isAuthenticated) {
    return next('/login')
  }

  // Se a rota requer um role específico e o tipo do usuário não bate
  if (requiredRole && authStore.userTipo !== requiredRole) {
    // Redireciona para o dashboard correto do usuário
    if (authStore.isAluno) return next('/agendamentos')
    if (authStore.isCoordenador) return next('/gestao')
    return next('/login')
  }

  // Tudo certo, permite acesso
  next()
})

export default router
