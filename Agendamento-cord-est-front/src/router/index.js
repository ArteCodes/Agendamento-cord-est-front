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
      meta: { requiresAuth: true }
    },
    {
      path: '/agendamentos/criar',
      name: 'criar-agendamento',
      component: () => import('@/modules/appointment/views/Create.vue'),
      meta: { requiresAuth: true, canCreate: true }
    },
    {
      path: '/agendamentos/:id',
      name: 'detalhe-agendamento',
      component: () => import('@/modules/appointment/views/Show.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/gestao',
      name: 'gestao',
      redirect: '/agendamentos',
      meta: { requiresAuth: true }
    },
    {
      path: '/gestao/:id',
      name: 'detalhe-gestao',
      redirect: (to) => `/agendamentos/${to.params.id}`,
      meta: { requiresAuth: true }
    },
    {
      path: '/calendario',
      name: 'calendario',
      component: () => import('@/modules/calendar/views/List.vue'),
      meta: { requiresAuth: true, role: 'coordenador' }
    },
    {
      path: '/gestao-horarios',
      name: 'gestao-horarios',
      component: () => import('@/modules/schedule/views/List.vue'),
      meta: { requiresAuth: true, role: 'coordenador' }
    },
    {
      // Rota raiz: lista unificada para aluno, coordenador e suporte
      path: '/',
      name: 'home',
      redirect: () => {
        const authStore = useAuthStore()
        if (!authStore.isAuthenticated) return '/login'
        return '/agendamentos'
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
    // Se já está logado e tenta ir para login, redireciona para a lista unificada
    if (to.name === 'login' && authStore.isAuthenticated) {
      return next('/agendamentos')
    }
    return next()
  }

  // Se a rota requer autenticação e o usuário não está logado
  if (requiresAuth && !authStore.isAuthenticated) {
    return next('/login')
  }

  // Criação: só aluno ou suporte (coordenador não cria)
  if (to.meta.canCreate && !authStore.canCreate) {
    return next('/agendamentos')
  }

  // Se a rota requer um role específico e o tipo do usuário não bate
  if (requiredRole && authStore.userTipo !== requiredRole) {
    return next('/agendamentos')
  }

  // Tudo certo, permite acesso
  next()
})

export default router
