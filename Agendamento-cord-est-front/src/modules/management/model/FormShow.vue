<template>
  <div class="modal-corpo">
    <div class="item-detalhe">
      <span class="rotulo-detalhe">Aluno:</span>
      <span class="valor-detalhe">{{ item.aluno }}</span>
    </div>
    <div class="item-detalhe">
      <span class="rotulo-detalhe">Agendamento:</span>
      <span class="valor-detalhe">{{ item.nome }}</span>
    </div>
    <div class="item-detalhe">
      <span class="rotulo-detalhe">Data:</span>
      <span class="valor-detalhe">{{ item.data }}</span>
    </div>
    <div class="item-detalhe">
      <span class="rotulo-detalhe">Horário:</span>
      <span class="valor-detalhe">{{ item.horario }}</span>
    </div>
    <div class="item-detalhe">
      <span class="rotulo-detalhe">Status:</span>
      <span :class="['badge-status', `badge-${item.status.toLowerCase()}`]">
        {{ item.status }}
      </span>
    </div>
    <div v-if="item.local" class="item-detalhe">
      <span class="rotulo-detalhe">Local:</span>
      <span class="valor-detalhe">{{ item.local }}</span>
    </div>
    <div v-if="item.descricao" class="item-detalhe">
      <span class="rotulo-detalhe">Descrição:</span>
      <span class="valor-detalhe">{{ item.descricao }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: { type: Object, required: true }
})
</script>

<style scoped>
.modal-corpo {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item-detalhe {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f1f5f9;
}

.item-detalhe:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.rotulo-detalhe {
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
}

.valor-detalhe {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1e293b;
}

.badge-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: 9999px;
  line-height: 1.2;
}

.badge-pendente {
  background-color: #fff7ed;
  color: #c2410c;
  border: 1px solid #fed7aa;
}

.badge-confirmado {
  background-color: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

.badge-cancelado {
  background-color: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}
</style>
