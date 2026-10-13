<script setup>
/**
 * CalendarioView.vue
 * Tela de Calendário de Atendimento para agendamentos confirmados.
 * Exclusivo para Coordenador/Gestão para acompanhamento e execução de atendimentos.
 */

import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAgendamentosStore } from '@/stores/agendamentos'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const { userName } = storeToRefs(authStore)

const agendamentosStore = useAgendamentosStore()
const { agendamentosConfirmados } = storeToRefs(agendamentosStore)

// Estado da data do calendário - inicializado em Outubro de 2026 (onde estão os dados mockados)
const dataAtual = ref(new Date(2026, 9, 15)) // Mês 9 = Outubro (0-indexed)
const diaSelecionado = ref('2026-10-15')

const nomesMeses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

// Mês e ano exibidos no cabeçalho
const mesAtualNome = computed(() => nomesMeses[dataAtual.value.getMonth()])
const anoAtual = computed(() => dataAtual.value.getFullYear())

// Navegação entre meses
function mesAnterior() {
  dataAtual.value = new Date(dataAtual.value.getFullYear(), dataAtual.value.getMonth() - 1, 1)
}

function proximoMes() {
  dataAtual.value = new Date(dataAtual.value.getFullYear(), dataAtual.value.getMonth() + 1, 1)
}

function irParaHoje() {
  dataAtual.value = new Date(2026, 9, 15)
  diaSelecionado.value = '2026-10-15'
}

// Formatar número com dois dígitos
function pad(num) {
  return String(num).padStart(2, '0')
}

// Montagem dos dias do mês para a grade do calendário
const gradeDias = computed(() => {
  const ano = dataAtual.value.getFullYear()
  const mes = dataAtual.value.getMonth()

  // Primeiro dia do mês e total de dias do mês
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay()
  const totalDiasMes = new Date(ano, mes + 1, 0).getDate()

  // Total de dias do mês anterior para preencher início da grade
  const totalDiasMesAnterior = new Date(ano, mes, 0).getDate()

  const dias = []

  // Dias do mês anterior
  for (let i = primeiroDiaSemana - 1; i >= 0; i--) {
    const diaNum = totalDiasMesAnterior - i
    const mesAnt = mes === 0 ? 11 : mes - 1
    const anoAnt = mes === 0 ? ano - 1 : ano
    const dataIso = `${anoAnt}-${pad(mesAnt + 1)}-${pad(diaNum)}`
    dias.push({
      numero: diaNum,
      dataIso,
      mesAtual: false,
      agendamentos: agendamentosStore.confirmadosPorData(dataIso)
    })
  }

  // Dias do mês atual
  for (let d = 1; d <= totalDiasMes; d++) {
    const dataIso = `${ano}-${pad(mes + 1)}-${pad(d)}`
    dias.push({
      numero: d,
      dataIso,
      mesAtual: true,
      agendamentos: agendamentosStore.confirmadosPorData(dataIso)
    })
  }

  // Preencher até completar múltiplos de 7 (geralmente 35 ou 42 células)
  const restante = (7 - (dias.length % 7)) % 7
  for (let p = 1; p <= restante; p++) {
    const mesProx = mes === 11 ? 0 : mes + 1
    const anoProx = mes === 11 ? ano + 1 : ano
    const dataIso = `${anoProx}-${pad(mesProx + 1)}-${pad(p)}`
    dias.push({
      numero: p,
      dataIso,
      mesAtual: false,
      agendamentos: agendamentosStore.confirmadosPorData(dataIso)
    })
  }

  return dias
})

// Agendamentos confirmados do dia selecionado
const agendamentosDiaSelecionado = computed(() => {
  if (!diaSelecionado.value) return []
  return agendamentosStore.confirmadosPorData(diaSelecionado.value)
})

// Formatação amigável da data selecionada
const dataFormatadaSelecionada = computed(() => {
  if (!diaSelecionado.value) return ''
  const [ano, mes, dia] = diaSelecionado.value.split('-')
  return `${dia}/${mes}/${ano}`
})

function selecionarDia(dia) {
  diaSelecionado.value = dia.dataIso
}
</script>

<template>
  <div class="calendario-container">
    <!-- Cabeçalho -->
    <header class="header-section">
      <div class="header-info">
        <h1 class="header-title">Calendário de Atendimento</h1>
        <p class="header-subtitle">
          Visualização dos agendamentos confirmados para atendimento
        </p>
      </div>

      <div class="header-stats">
        <div class="badge-total-confirmados">
          <span class="dot-verde"></span>
          <strong>{{ agendamentosConfirmados.length }}</strong> atendimentos confirmados no sistema
        </div>
      </div>
    </header>

    <!-- Layout principal dividido em Calendário e Painel do Dia -->
    <div class="calendario-layout">
      <!-- Seção do Calendário Mensal -->
      <section class="calendario-box">
        <!-- Barra de Controles do Mês -->
        <div class="calendario-nav">
          <div class="mes-ano-display">
            <h2>{{ mesAtualNome }} <span>{{ anoAtual }}</span></h2>
          </div>

          <div class="nav-botoes">
            <button type="button" class="btn-nav" @click="mesAnterior" title="Mês anterior">
              &lt;
            </button>
            <button type="button" class="btn-hoje" @click="irParaHoje">
              Hoje
            </button>
            <button type="button" class="btn-nav" @click="proximoMes" title="Próximo mês">
              &gt;
            </button>
          </div>
        </div>

        <!-- Grade de Dias da Semana -->
        <div class="dias-semana-header">
          <div v-for="d in diasSemana" :key="d" class="dia-semana-col">
            {{ d }}
          </div>
        </div>

        <!-- Grade de Dias do Mês -->
        <div class="grade-dias">
          <div
            v-for="(dia, idx) in gradeDias"
            :key="idx"
            class="dia-celula"
            :class="{
              'fora-do-mes': !dia.mesAtual,
              'dia-ativo': dia.dataIso === diaSelecionado,
              'tem-atendimento': dia.agendamentos.length > 0
            }"
            @click="selecionarDia(dia)"
          >
            <div class="dia-topo">
              <span class="dia-numero">{{ dia.numero }}</span>
              <span
                v-if="dia.agendamentos.length > 0"
                class="badge-qtd-atendimentos"
                :title="`${dia.agendamentos.length} atendimento(s) confirmado(s)`"
              >
                {{ dia.agendamentos.length }}
              </span>
            </div>

            <!-- Mini etiquetas para os primeiros agendamentos do dia -->
            <div class="dia-eventos" v-if="dia.agendamentos.length > 0">
              <div
                v-for="ag in dia.agendamentos.slice(0, 2)"
                :key="ag.id"
                class="evento-chip"
              >
                {{ ag.horario }} {{ ag.aluno.split(' ')[0] }}
              </div>
              <div v-if="dia.agendamentos.length > 2" class="mais-eventos">
                +{{ dia.agendamentos.length - 2 }} mais
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Painel Lateral: Detalhes do Dia Selecionado -->
      <aside class="painel-dia">
        <div class="painel-header">
          <h3>Atendimentos do Dia</h3>
          <span class="data-tag">{{ dataFormatadaSelecionada }}</span>
        </div>

        <!-- Lista de Atendimentos Confirmados -->
        <div v-if="agendamentosDiaSelecionado.length > 0" class="lista-atendimentos">
          <div
            v-for="ag in agendamentosDiaSelecionado"
            :key="ag.id"
            class="card-atendimento-dia"
          >
            <div class="card-horario-status">
              <span class="horario-badge">⏰ {{ ag.horario }}</span>
              <span class="local-badge">📍 {{ ag.local }}</span>
            </div>

            <h4 class="atendimento-titulo">{{ ag.nome }}</h4>

            <div class="atendimento-detalhe">
              <strong>Aluno:</strong> {{ ag.aluno }}
            </div>

            <p class="atendimento-descricao" v-if="ag.descricao">
              {{ ag.descricao }}
            </p>

            <div class="card-footer-acoes">
              <span class="badge-status-confirmado">Confirmado</span>
            </div>
          </div>
        </div>

        <!-- Estado Vazio para o Dia -->
        <div v-else class="painel-vazio">
          <div class="icone-vazio">📅</div>
          <p class="texto-vazio-titulo">Nenhum atendimento confirmado</p>
          <p class="texto-vazio-desc">
            Não há atendimentos com status <strong>Confirmado</strong> agendados para {{ dataFormatadaSelecionada }}.
          </p>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.calendario-container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 24px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #2d3748;
}

/* Header */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  background-color: #ffffff;
  padding: 20px 24px;
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
  margin: 4px 0 0;
  font-size: 0.95rem;
  color: #718096;
}

.badge-total-confirmados {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.dot-verde {
  width: 8px;
  height: 8px;
  background-color: #10b981;
  border-radius: 50%;
}

/* Layout Principal */
.calendario-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 960px) {
  .calendario-layout {
    grid-template-columns: 2fr 1fr;
  }
}

/* Caixa do Calendário */
.calendario-box {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #edf2f7;
}

.calendario-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.mes-ano-display h2 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a202c;
}

.mes-ano-display h2 span {
  color: #718096;
  font-weight: 400;
}

.nav-botoes {
  display: flex;
  gap: 8px;
}

.btn-nav {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  color: #4a5568;
  transition: all 0.2s;
}

.btn-nav:hover {
  background: #edf2f7;
  color: #1a202c;
}

.btn-hoje {
  background: #edf2f7;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  color: #4a5568;
  transition: all 0.2s;
}

.btn-hoje:hover {
  background: #e2e8f0;
}

/* Cabeçalho dos dias da semana */
.dias-semana-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 8px;
}

.dia-semana-col {
  font-size: 0.85rem;
  font-weight: 700;
  color: #a0aec0;
  text-transform: uppercase;
  padding: 8px 0;
}

/* Grade dos dias */
.grade-dias {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.dia-celula {
  min-height: 80px;
  border: 1px solid #edf2f7;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  background-color: #ffffff;
  transition: all 0.2s;
}

.dia-celula:hover {
  border-color: #cbd5e0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.dia-celula.fora-do-mes {
  background-color: #f7fafc;
  opacity: 0.45;
}

.dia-celula.dia-ativo {
  border-color: #3182ce;
  background-color: #ebf8ff;
  box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.3);
}

.dia-topo {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dia-numero {
  font-size: 0.95rem;
  font-weight: 600;
  color: #2d3748;
}

.badge-qtd-atendimentos {
  background-color: #10b981;
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 10px;
  padding: 1px 6px;
}

.dia-eventos {
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow: hidden;
}

.evento-chip {
  background-color: #e6fffa;
  color: #234e52;
  border-left: 3px solid #319795;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 4px;
  border-radius: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mais-eventos {
  font-size: 0.65rem;
  color: #718096;
  font-weight: 500;
}

/* Painel Lateral do Dia */
.painel-dia {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #edf2f7;
  display: flex;
  flex-direction: column;
}

.painel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #edf2f7;
  padding-bottom: 14px;
  margin-bottom: 18px;
}

.painel-header h3 {
  margin: 0;
  font-size: 1.15rem;
  color: #1a202c;
}

.data-tag {
  background-color: #edf2f7;
  color: #4a5568;
  font-weight: 600;
  font-size: 0.85rem;
  padding: 4px 10px;
  border-radius: 6px;
}

.lista-atendimentos {
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
  max-height: 550px;
}

.card-atendimento-dia {
  border: 1px solid #e2e8f0;
  border-left: 4px solid #10b981;
  border-radius: 8px;
  padding: 14px;
  background-color: #fafafa;
  transition: all 0.2s;
}

.card-atendimento-dia:hover {
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.card-horario-status {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  margin-bottom: 6px;
}

.horario-badge {
  font-weight: 700;
  color: #2b6cb0;
}

.local-badge {
  color: #718096;
}

.atendimento-titulo {
  margin: 0 0 6px 0;
  font-size: 1rem;
  color: #2d3748;
}

.atendimento-detalhe {
  font-size: 0.85rem;
  color: #4a5568;
  margin-bottom: 6px;
}

.atendimento-descricao {
  font-size: 0.8rem;
  color: #718096;
  margin: 6px 0 10px;
  line-height: 1.4;
}

.card-footer-acoes {
  display: flex;
  justify-content: flex-end;
}

.badge-status-confirmado {
  background-color: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 12px;
  text-transform: uppercase;
}

.painel-vazio {
  text-align: center;
  padding: 48px 16px;
  color: #a0aec0;
  margin: auto 0;
}

.icone-vazio {
  font-size: 2.5rem;
  margin-bottom: 12px;
}

.texto-vazio-titulo {
  font-size: 1rem;
  font-weight: 600;
  color: #4a5568;
  margin: 0 0 6px;
}

.texto-vazio-desc {
  font-size: 0.85rem;
  color: #718096;
  margin: 0;
  line-height: 1.4;
}
</style>
