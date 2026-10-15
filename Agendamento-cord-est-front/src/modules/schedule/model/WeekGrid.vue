<template>
  <section class="semana-grid">
    <div v-for="dia in dias" :key="dia.valor" class="dia-coluna">
      <header class="dia-titulo">{{ dia.nome }}</header>
      <div class="dia-lista">
        <div v-if="(porDia[dia.valor] || []).length === 0" class="dia-vazio">Sem horários</div>
        <article
          v-for="h in (porDia[dia.valor] || [])"
          :key="`${h.origem}-${h.id ?? h.tempId}`"
          class="horario-card"
          :class="{ 'eh-rascunho': h.origem === 'rascunho' }"
        >
          <div class="horario-tempo">{{ h.hora_inicio }} - {{ h.hora_fim }}</div>
          <div class="horario-tipo">{{ h.tipo }}</div>
          <div class="horario-meta">
            <span v-if="h.origem === 'rascunho'" class="badge-novo">novo</span>
            <button
              v-if="h.origem === 'rascunho'"
              type="button"
              class="btn-mini btn-remover"
              @click="$emit('remover-rascunho', h)"
            >
              remover
            </button>
            <button
              v-else
              type="button"
              class="btn-mini btn-excluir"
              @click="$emit('remover-salvo', h)"
            >
              excluir
            </button>
          </div>
        </article>
        <!-- Ícone + no final da lista de cada dia. Oculto quando a meta semanal foi concluída. -->
        <button
          v-if="!metaConcluida"
          type="button"
          class="btn-mais"
          :title="`Adicionar horário em ${dia.nome}`"
          @click="$emit('adicionar', dia.valor)"
        >
          +
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  dias: { type: Array, default: () => [] },
  porDia: { type: Object, default: () => ({}) },
  metaConcluida: { type: Boolean, default: false }
})

defineEmits(['adicionar', 'remover-rascunho', 'remover-salvo'])
</script>

<style scoped>
.semana-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
@media (min-width: 900px) { .semana-grid { grid-template-columns: repeat(7, 1fr); } }
.dia-coluna { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
.dia-titulo { background: #f8fafc; padding: 10px 12px; font-weight: 700; color: #0f172a; text-align: center; border-bottom: 1px solid #e2e8f0; }
.dia-lista { padding: 10px; display: flex; flex-direction: column; gap: 8px; min-height: 120px; }
.dia-vazio { color: #94a3b8; font-size: 0.85rem; text-align: center; padding: 8px 0; }
.horario-card { border: 1px solid #e2e8f0; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 8px 10px; background: #f8fafc; }
.horario-card.eh-rascunho { border-left-color: #f59e0b; background: #fffbeb; }
.horario-tempo { font-weight: 700; color: #0f172a; font-size: 0.9rem; }
.horario-tipo { color: #475569; font-size: 0.8rem; margin-top: 2px; }
.horario-meta { display: flex; align-items: center; justify-content: space-between; margin-top: 6px; }
.badge-novo { background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; font-size: 0.7rem; font-weight: 700; padding: 1px 8px; border-radius: 12px; text-transform: uppercase; }
.btn-mini { background: transparent; border: none; cursor: pointer; font-size: 0.75rem; font-weight: 600; padding: 2px 4px; }
.btn-remover { color: #b45309; }
.btn-excluir { color: #dc2626; }
.btn-mais { margin-top: 2px; border: 1px dashed #94a3b8; background: #fff; border-radius: 8px; font-size: 1.25rem; font-weight: 700; color: #334155; cursor: pointer; padding: 4px 0; }
.btn-mais:hover { background: #f1f5f9; border-color: #475569; }
</style>
