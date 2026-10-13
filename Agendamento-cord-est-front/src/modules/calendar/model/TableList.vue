<template>
  <div class="calendario-layout">
    <section class="calendario-box">
      <div class="calendario-nav">
        <h2>{{ monthName }} <span>{{ year }}</span></h2>
        <div class="nav-botoes">
          <button type="button" class="btn-nav" @click="$emit('prev')">&lt;</button>
          <button type="button" class="btn-hoje" @click="$emit('today')">Hoje</button>
          <button type="button" class="btn-nav" @click="$emit('next')">&gt;</button>
        </div>
      </div>
      <div class="dias-semana-header">
        <div v-for="d in weekDays" :key="d" class="dia-semana-col">{{ d }}</div>
      </div>
      <div class="grade-dias">
        <div
          v-for="(dia, idx) in days" :key="idx" class="dia-celula"
          :class="{ 'fora-do-mes': !dia.mesAtual, 'dia-ativo': dia.dataIso === selectedDay, 'tem-atendimento': dia.agendamentos.length > 0 }"
          @click="$emit('select', dia)"
        >
          <div class="dia-topo">
            <span class="dia-numero">{{ dia.numero }}</span>
            <span v-if="dia.agendamentos.length > 0" class="badge-qtd">{{ dia.agendamentos.length }}</span>
          </div>
          <div class="dia-eventos" v-if="dia.agendamentos.length > 0">
            <div v-for="ag in dia.agendamentos.slice(0, 2)" :key="ag.id" class="evento-chip">{{ ag.horario }} {{ ag.aluno.split(' ')[0] }}</div>
            <div v-if="dia.agendamentos.length > 2" class="mais-eventos">+{{ dia.agendamentos.length - 2 }} mais</div>
          </div>
        </div>
      </div>
    </section>
    <aside class="painel-dia">
      <div class="painel-header"><h3>Atendimentos do Dia</h3><span class="data-tag">{{ formattedSelectedDay }}</span></div>
      <div v-if="dayItems.length > 0" class="lista-atendimentos">
        <div v-for="ag in dayItems" :key="ag.id" class="card-atendimento-dia">
          <div class="card-horario-status"><span class="horario-badge">⏰ {{ ag.horario }}</span><span class="local-badge">📍 {{ ag.local }}</span></div>
          <h4 class="atendimento-titulo">{{ ag.nome }}</h4>
          <div class="atendimento-detalhe"><strong>Aluno:</strong> {{ ag.aluno }}</div>
          <p class="atendimento-descricao" v-if="ag.descricao">{{ ag.descricao }}</p>
          <div class="card-footer-acoes"><span class="badge-status-confirmado">Confirmado</span></div>
        </div>
      </div>
      <div v-else class="painel-vazio"><div class="icone-vazio">📅</div><p class="texto-vazio-titulo">Nenhum atendimento confirmado</p></div>
    </aside>
  </div>
</template>
<script setup>
defineProps({ days: { type: Array, default: () => [] }, dayItems: { type: Array, default: () => [] }, weekDays: { type: Array, default: () => [] }, monthName: { type: String, default: '' }, year: { type: Number, default: 2026 }, selectedDay: { type: String, default: '' }, formattedSelectedDay: { type: String, default: '' } })
defineEmits(['prev', 'next', 'today', 'select'])
</script>
<style scoped>
.calendario-layout { display: grid; grid-template-columns: 1fr; gap: 24px; }
@media (min-width: 960px) { .calendario-layout { grid-template-columns: 2fr 1fr; } }
.calendario-box { background: #fff; border-radius: 12px; padding: 24px; border: 1px solid #edf2f7; }
.calendario-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.calendario-nav h2 { margin: 0; font-size: 1.4rem; color: #1a202c; }
.calendario-nav h2 span { color: #718096; font-weight: 400; }
.nav-botoes { display: flex; gap: 8px; }
.btn-nav { background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 6px 14px; cursor: pointer; }
.btn-hoje { background: #edf2f7; border: 1px solid #cbd5e0; border-radius: 8px; padding: 6px 14px; cursor: pointer; }
.dias-semana-header { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; margin-bottom: 8px; }
.dia-semana-col { font-size: 0.85rem; font-weight: 700; color: #a0aec0; text-transform: uppercase; padding: 8px 0; }
.grade-dias { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
.dia-celula { min-height: 80px; border: 1px solid #edf2f7; border-radius: 8px; padding: 8px; cursor: pointer; }
.dia-celula.fora-do-mes { background: #f7fafc; opacity: 0.45; }
.dia-celula.dia-ativo { border-color: #3182ce; background: #ebf8ff; }
.dia-topo { display: flex; justify-content: space-between; align-items: center; }
.dia-numero { font-weight: 600; color: #2d3748; }
.badge-qtd { background: #10b981; color: #fff; font-size: 0.7rem; font-weight: 700; border-radius: 10px; padding: 1px 6px; }
.evento-chip { background: #e6fffa; border-left: 3px solid #319795; font-size: 0.7rem; padding: 2px 4px; border-radius: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.painel-dia { background: #fff; border-radius: 12px; padding: 24px; border: 1px solid #edf2f7; }
.painel-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #edf2f7; padding-bottom: 14px; margin-bottom: 18px; }
.data-tag { background: #edf2f7; padding: 4px 10px; border-radius: 6px; font-size: 0.85rem; }
.card-atendimento-dia { border: 1px solid #e2e8f0; border-left: 4px solid #10b981; border-radius: 8px; padding: 14px; background: #fafafa; margin-bottom: 12px; }
.badge-status-confirmado { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; font-size: 0.75rem; padding: 2px 8px; border-radius: 12px; }
.painel-vazio { text-align: center; padding: 48px 16px; color: #a0aec0; }
</style>
