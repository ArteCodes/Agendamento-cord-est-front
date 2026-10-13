<template>
  <section class="tabela-wrapper">
    <table class="tabela-gestao">
      <thead>
        <tr>
          <th scope="col">Aluno</th>
          <th scope="col">Agendamento</th>
          <th scope="col">Data</th>
          <th scope="col">Horário</th>
          <th scope="col">Status</th>
          <th scope="col" class="th-acoes">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="agendamento in items" :key="agendamento.id">
          <td class="col-aluno">{{ agendamento.aluno }}</td>
          <td class="col-nome">{{ agendamento.nome }}</td>
          <td class="col-data">{{ agendamento.data }}</td>
          <td class="col-horario">{{ agendamento.horario }}</td>
          <td class="col-status">
            <span :class="['badge-status', `badge-${agendamento.status.toLowerCase()}`]">
              {{ agendamento.status }}
            </span>
          </td>
          <td class="col-acoes">
            <div class="acoes-container">
              <button
                v-if="agendamento.status === 'Pendente'"
                type="button"
                class="btn-acao btn-validar"
                @click="$emit('validate', agendamento)"
              >
                Validar
              </button>
              <button
                type="button"
                class="btn-acao btn-detalhes"
                @click="$emit('show', agendamento)"
              >
                Detalhes
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="items.length === 0">
          <td colspan="6" class="mensagem-vazio">
            Nenhum agendamento encontrado no momento.
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
defineProps({
  items: { type: Array, default: () => [] }
})

defineEmits(['validate', 'show'])
</script>

<style scoped>
.tabela-wrapper {
  width: 100%;
  overflow-x: auto;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.tabela-gestao {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9375rem;
}

.tabela-gestao th {
  background-color: #f8fafc;
  color: #475569;
  font-weight: 600;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1rem 1.25rem;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}

.tabela-gestao td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  color: #334155;
  vertical-align: middle;
}

.th-acoes {
  text-align: center;
}

.tabela-gestao tbody tr:nth-child(even) {
  background-color: #f8fafc;
}

.tabela-gestao tbody tr:hover {
  background-color: #f1f5f9;
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

.acoes-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-acao {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 0.85rem;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1;
}

.btn-validar {
  background-color: #10b981;
  color: #ffffff;
}

.btn-validar:hover {
  background-color: #059669;
}

.btn-detalhes {
  background-color: #3b82f6;
  color: #ffffff;
}

.btn-detalhes:hover {
  background-color: #2563eb;
}

.mensagem-vazio {
  text-align: center;
  padding: 2.5rem 1rem;
  color: #64748b;
  font-size: 0.95rem;
}
</style>
