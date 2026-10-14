<template>
  <main class="cards-grid">
    <div v-if="items.length === 0" class="empty-state">
      <p>Nenhum agendamento encontrado.</p>
    </div>

    <article v-for="agendamento in items" :key="agendamento.id" class="card-agendamento">
      <!-- Topo do Card com Título e Badge de Status -->
      <div class="card-top">
        <h2 class="card-title">{{ agendamento.nome }}</h2>
        <span class="status-badge" :class="getStatusBadgeClass(agendamento.status)">
          {{ agendamento.status }}
        </span>
      </div>

      <!-- Informações do Agendamento -->
      <div class="card-info">
        <div v-if="showAlunoColumn" class="info-row">
          <span class="info-label">Aluno:</span>
          <span class="info-value">{{ agendamento.aluno }}</span>
        </div>
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

      <!-- Botões de Ação do Card (sem Validar na lista: validação só no Show) -->
      <div class="card-actions">
        <button
          v-if="canCancel"
          type="button"
          class="btn-outline-danger"
          :disabled="agendamento.status === 'Cancelado'"
          @click="$emit('cancel', agendamento)"
        >
          Cancelar
        </button>
        <button type="button" class="btn-outline-primary" @click="$emit('show', agendamento)">
          Ver Detalhes
        </button>
      </div>
    </article>
  </main>
</template>

<script setup>
defineProps({
  items: { type: Array, default: () => [] },
  showAlunoColumn: { type: Boolean, default: false },
  canCancel: { type: Boolean, default: true }
})

defineEmits(['cancel', 'show'])

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

<style scoped>
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
</style>
