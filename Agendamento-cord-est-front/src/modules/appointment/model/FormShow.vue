<template>
  <div v-if="item" class="modal-body">
    <div class="detail-row">
      <span class="detail-label">Nome:</span>
      <span class="detail-value">{{ item.nome }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Status:</span>
      <span class="status-badge" :class="getStatusBadgeClass(item.status)">
        {{ item.status }}
      </span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Data:</span>
      <span class="detail-value">{{ formatarData(item.data) }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Horário:</span>
      <span class="detail-value">{{ item.horario }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Local:</span>
      <span class="detail-value">{{ item.local }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Descrição:</span>
      <span class="detail-value">{{ item.descricao }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: { type: Object, default: null }
})

const formatarData = (dataStr) => {
  if (!dataStr) return ''
  const partes = dataStr.split('-')
  if (partes.length === 3) {
    const [ano, mes, dia] = partes
    return `${dia}/${mes}/${ano}`
  }
  return dataStr
}

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
</style>
