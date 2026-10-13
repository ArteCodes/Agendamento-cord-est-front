<script setup>
/**
 * AgendamentosAlunoView.vue
 * Visão principal do Aluno (Dashboard) para acompanhamento dos agendamentos.
 */

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useAgendamentosStore } from '@/stores/agendamentos'

// Inicialização do roteador e dos stores
const router = useRouter()
const authStore = useAuthStore()
const agendamentosStore = useAgendamentosStore()

// Obtém o nome e dados do usuário a partir do store de autenticação
const { userName, user } = storeToRefs(authStore)

// Estados reativos
const filtroData = ref('')
const showModal = ref(false)
const showDetailsModal = ref(false)
const selectedAgendamento = ref(null)

// Agendamentos pertencentes ao aluno logado (filtra pelo email do aluno ou mostra os do aluno mockado)
const agendamentosDoAluno = computed(() => {
  const email = user.value?.email || 'aluno@teste.com'
  return agendamentosStore.agendamentosPorAluno(email)
})

// Computed property para filtrar agendamentos por data caso filtroData esteja preenchido
const agendamentosFiltrados = computed(() => {
  if (!filtroData.value) {
    return agendamentosDoAluno.value
  }
  return agendamentosDoAluno.value.filter((item) => item.data === filtroData.value)
})

// Abre modal de confirmação para cancelar o agendamento
const confirmCancel = (agendamento) => {
  selectedAgendamento.value = agendamento
  showModal.value = true
}

// Cancela o agendamento selecionado alterando seu status para 'Cancelado'
const cancelAgendamento = () => {
  if (selectedAgendamento.value) {
    agendamentosStore.cancelarAgendamento(selectedAgendamento.value.id)
  }
  closeModals()
}

// Abre modal com os detalhes completos do agendamento
const showDetails = (agendamento) => {
  selectedAgendamento.value = agendamento
  showDetailsModal.value = true
}

// Fecha todos os modais e limpa a seleção atual
const closeModals = () => {
  showModal.value = false
  showDetailsModal.value = false
  selectedAgendamento.value = null
}

// Navega para a rota de criação de agendamento
const navegarParaCriar = () => {
  router.push('/agendamentos/criar')
}

// Formata a data de AAAA-MM-DD para DD/MM/AAAA
const formatarData = (dataStr) => {
  if (!dataStr) return ''
  const partes = dataStr.split('-')
  if (partes.length === 3) {
    const [ano, mes, dia] = partes
    return `${dia}/${mes}/${ano}`
  }
  return dataStr
}

// Retorna a classe CSS correspondente para a cor do status badge
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Confirmado':
      return 'badge-confirmado'
    case 'Pendente':
      return 'badge-pendente'
    case 'Cancelado':
      return 'badge-cancelado'
    default:
      return ''
  }
}
</script>

<template>
  <div class="aluno-dashboard">
    <!-- Cabeçalho -->
    <header class="header-section">
      <h1 class="header-title">Olá, {{ userName }}</h1>
      <p class="header-subtitle">Seus agendamentos</p>
    </header>

    <!-- Barra de Controles -->
    <section class="controls-bar">
      <div class="filter-wrapper">
        <label for="filtro-data" class="filter-label">Filtrar por data:</label>
        <input
          id="filtro-data"
          type="date"
          v-model="filtroData"
          class="input-date"
        />
        <button
          v-if="filtroData"
          type="button"
          class="btn-clear-date"
          @click="filtroData = ''"
        >
          Limpar filtro
        </button>
      </div>

      <button
        type="button"
        class="btn-novo-agendamento"
        @click="navegarParaCriar"
      >
        Novo Agendamento
      </button>
    </section>

    <!-- Grid de Cards de Agendamentos -->
    <main class="cards-grid">
      <div
        v-if="agendamentosFiltrados.length === 0"
        class="empty-state"
      >
        <p>Nenhum agendamento encontrado para a data selecionada.</p>
      </div>

      <article
        v-for="agendamento in agendamentosFiltrados"
        :key="agendamento.id"
        class="card-agendamento"
      >
        <!-- Topo do Card com Título e Badge de Status -->
        <div class="card-top">
          <h2 class="card-title">{{ agendamento.nome }}</h2>
          <span
            class="status-badge"
            :class="getStatusBadgeClass(agendamento.status)"
          >
            {{ agendamento.status }}
          </span>
        </div>

        <!-- Informações do Agendamento -->
        <div class="card-info">
          <div class="info-row">
            <span class="info-label">Data:</span>
            <span class="info-value">{{ formatarData(agendamento.data) }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Horário:</span>
            <span class="info-value">{{ agendamento.horario }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Local:</span>
            <span class="info-value">{{ agendamento.local }}</span>
          </div>
        </div>

        <!-- Botões de Ação do Card -->
        <div class="card-actions">
          <button
            type="button"
            class="btn-outline-danger"
            @click="confirmCancel(agendamento)"
            :disabled="agendamento.status === 'Cancelado'"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="btn-outline-primary"
            @click="showDetails(agendamento)"
          >
            Ver Detalhes
          </button>
        </div>
      </article>
    </main>

    <!-- Modal de Confirmação de Cancelamento -->
    <div
      v-if="showModal"
      class="modal-overlay"
      @click.self="closeModals"
    >
      <div class="modal-box">
        <h3 class="modal-title">Cancelar Agendamento</h3>
        <p class="modal-message">
          Tem certeza que deseja cancelar o agendamento {{ selectedAgendamento?.nome }}?
        </p>
        <div class="modal-actions">
          <button
            type="button"
            class="btn-gray"
            @click="closeModals"
          >
            Não
          </button>
          <button
            type="button"
            class="btn-danger"
            @click="cancelAgendamento"
          >
            Sim, Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes do Agendamento -->
    <div
      v-if="showDetailsModal"
      class="modal-overlay"
      @click.self="closeModals"
    >
      <div class="modal-box">
        <div class="modal-header">
          <h3 class="modal-title">Detalhes do Agendamento</h3>
          <button
            type="button"
            class="btn-close-icon"
            @click="closeModals"
            aria-label="Fechar modal"
          >
            &times;
          </button>
        </div>

        <div v-if="selectedAgendamento" class="modal-body">
          <div class="detail-row">
            <span class="detail-label">Nome:</span>
            <span class="detail-value">{{ selectedAgendamento.nome }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span
              class="status-badge"
              :class="getStatusBadgeClass(selectedAgendamento.status)"
            >
              {{ selectedAgendamento.status }}
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Data:</span>
            <span class="detail-value">{{ formatarData(selectedAgendamento.data) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Horário:</span>
            <span class="detail-value">{{ selectedAgendamento.horario }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Local:</span>
            <span class="detail-value">{{ selectedAgendamento.local }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Descrição:</span>
            <span class="detail-value">{{ selectedAgendamento.descricao }}</span>
          </div>
        </div>

        <div class="modal-actions">
          <button
            type="button"
            class="btn-gray"
            @click="closeModals"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos Gerais do Dashboard */
.aluno-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #2d3748;
}

/* Seção de Cabeçalho */
.header-section {
  background-color: #ffffff;
  padding: 24px 28px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

.header-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a202c;
}

.header-subtitle {
  margin: 6px 0 0;
  font-size: 1rem;
  color: #718096;
}

/* Barra de Controles (Filtro e Botão Novo Agendamento) */
.controls-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}

.filter-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 0.95rem;
  font-weight: 500;
  color: #4a5568;
}

.input-date {
  padding: 9px 12px;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #2d3748;
  background-color: #ffffff;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-date:focus {
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.15);
}

.btn-clear-date {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  background-color: #edf2f7;
  color: #4a5568;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-clear-date:hover {
  background-color: #e2e8f0;
}

.btn-novo-agendamento {
  padding: 10px 20px;
  background-color: #3182ce;
  color: #ffffff;
  border: 1.5px solid #3182ce;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
}

.btn-novo-agendamento:hover {
  background-color: #2b6cb0;
  border-color: #2b6cb0;
}

/* Grid de Cards (CSS Grid Responsivo de 1 a 3 colunas) */
.cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 640px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Estado Vazio */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 48px 16px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  color: #718096;
  font-size: 1rem;
}

/* Estilo do Card Individual */
.card-agendamento {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #edf2f7;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card-agendamento:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.card-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: #1a202c;
  line-height: 1.3;
}

/* Badges de Status (Confirmado=#4CAF50, Pendente=#FF9800, Cancelado=#f44336) */
.status-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  color: #ffffff;
  white-space: nowrap;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.badge-confirmado {
  background-color: #4CAF50;
}

.badge-pendente {
  background-color: #FF9800;
}

.badge-cancelado {
  background-color: #f44336;
}

/* Informações do Agendamento dentro do Card */
.card-info {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.info-label {
  color: #718096;
  font-weight: 500;
}

.info-value {
  color: #2d3748;
  font-weight: 600;
}

/* Ações do Card (Botões com Estilo Outline) */
.card-actions {
  display: flex;
  gap: 10px;
  margin-top: auto;
}

.card-actions button {
  flex: 1;
}

.btn-outline-danger {
  padding: 8px 12px;
  background-color: transparent;
  color: #f44336;
  border: 1.5px solid #f44336;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  text-align: center;
}

.btn-outline-danger:hover:not(:disabled) {
  background-color: #f44336;
  color: #ffffff;
}

.btn-outline-danger:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  border-color: #e2e8f0;
  color: #a0aec0;
}

.btn-outline-primary {
  padding: 8px 12px;
  background-color: transparent;
  color: #3182ce;
  border: 1.5px solid #3182ce;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  text-align: center;
}

.btn-outline-primary:hover {
  background-color: #3182ce;
  color: #ffffff;
}

/* Estilos de Modais (Overlay semi-transparente fixo e caixa branca centralizada) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-box {
  background-color: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  padding: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: modal-fade-in 0.2s ease-out;
}

@keyframes modal-fade-in {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
}

.btn-close-icon {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: #a0aec0;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
}

.btn-close-icon:hover {
  color: #4a5568;
}

.modal-message {
  font-size: 1rem;
  color: #4a5568;
  margin: 16px 0 24px;
  line-height: 1.5;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #edf2f7;
  font-size: 0.95rem;
}

.detail-label {
  font-weight: 600;
  color: #718096;
}

.detail-value {
  color: #2d3748;
  font-weight: 500;
  text-align: right;
  max-width: 65%;
  word-break: break-word;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-danger {
  padding: 9px 18px;
  background-color: #f44336;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-danger:hover {
  background-color: #d32f2f;
}

.btn-gray {
  padding: 9px 18px;
  background-color: #e2e8f0;
  color: #4a5568;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-gray:hover {
  background-color: #cbd5e0;
}
</style>
