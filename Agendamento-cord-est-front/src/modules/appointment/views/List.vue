<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/modules/auth/store/auth'
import { useAppointmentStore } from '@/modules/appointment/store/appointment'
import TableList from '@/modules/appointment/model/TableList.vue'
import FormShow from '@/modules/appointment/model/FormShow.vue'

const router = useRouter()
const authStore = useAuthStore()
const appointmentStore = useAppointmentStore()
const { userName, user, isCoordenador, isSuporte, canCreate } = storeToRefs(authStore)

const filtroData = ref('')
const showModal = ref(false)
const showDetailsModal = ref(false)
const selectedAgendamento = ref(null)

// Lista unificada por função (IDs):
// aluno -> created_by/matricula/email próprios | coordenador -> coordinator_id == id | suporte -> created_by == id
const agendamentosVisiveis = computed(() => appointmentStore.visiveisPorFuncao(user.value))
const agendamentosFiltrados = computed(() => {
  if (!filtroData.value) return agendamentosVisiveis.value
  return agendamentosVisiveis.value.filter((i) => i.data === filtroData.value)
})
// Coluna Aluno só faz sentido para quem vê agendamentos de terceiros
const showAlunoColumn = computed(() => isCoordenador.value || isSuporte.value)
// Coordenador não cancela pela lista (só valida no Show); aluno/suporte cancelam os próprios
const canCancel = computed(() => !isCoordenador.value)
const confirmCancel = (ag) => { selectedAgendamento.value = ag; showModal.value = true }
const cancelAgendamento = () => {
  if (selectedAgendamento.value) appointmentStore.cancelarAgendamento(selectedAgendamento.value.id)
  closeModals()
}
const showDetails = (ag) => { selectedAgendamento.value = ag; showDetailsModal.value = true }
const closeModals = () => { showModal.value = false; showDetailsModal.value = false; selectedAgendamento.value = null }
const navegarParaCriar = () => router.push('/agendamentos/criar')
const abrirShow = (ag) => router.push(`/agendamentos/${ag.id}`)
</script>
<template>
  <div class="aluno-dashboard">
    <header class="header-section">
      <h1 class="header-title">Olá, {{ userName }}</h1>
      <p class="header-subtitle">Seus agendamentos</p>
    </header>
    <section class="controls-bar">
      <div class="filter-wrapper">
        <label for="filtro-data" class="filter-label">Filtrar por data:</label>
        <input id="filtro-data" type="date" v-model="filtroData" class="input-date" />
        <button v-if="filtroData" type="button" class="btn-clear-date" @click="filtroData = ''">Limpar filtro</button>
      </div>
      <button v-if="canCreate" type="button" class="btn-novo-agendamento" @click="navegarParaCriar">Novo Agendamento</button>
    </section>
    <TableList :items="agendamentosFiltrados" :show-aluno-column="showAlunoColumn" :can-cancel="canCancel" @cancel="confirmCancel" @show="abrirShow" />
    <div v-if="showModal" class="modal-overlay" @click.self="closeModals">
      <div class="modal-box">
        <h3 class="modal-title">Cancelar Agendamento</h3>
        <p class="modal-message">Tem certeza que deseja cancelar {{ selectedAgendamento?.nome }}?</p>
        <div class="modal-actions">
          <button type="button" class="btn-gray" @click="closeModals">Não</button>
          <button type="button" class="btn-danger" @click="cancelAgendamento">Sim, Cancelar</button>
        </div>
      </div>
    </div>
    <div v-if="showDetailsModal" class="modal-overlay" @click.self="closeModals">
      <div class="modal-box">
        <div class="modal-header"><h3 class="modal-title">Detalhes do Agendamento</h3><button type="button" class="btn-close-icon" @click="closeModals">&times;</button></div>
        <FormShow :item="selectedAgendamento" />
        <div class="modal-actions"><button type="button" class="btn-gray" @click="closeModals">Fechar</button></div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.aluno-dashboard { max-width: 1200px; margin: 0 auto; padding: 24px 16px; color: #2d3748; }
.header-section { background: #fff; padding: 24px 28px; border-radius: 12px; margin-bottom: 24px; }
.header-title { margin: 0; font-size: 1.75rem; color: #1a202c; }
.header-subtitle { margin: 6px 0 0; color: #718096; }
.controls-bar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; }
.filter-wrapper { display: flex; align-items: center; gap: 10px; }
.input-date { padding: 9px 12px; border: 1px solid #cbd5e0; border-radius: 8px; }
.btn-clear-date { padding: 8px 12px; border: 1px solid #e2e8f0; background: #edf2f7; border-radius: 8px; cursor: pointer; }
.btn-novo-agendamento { padding: 10px 20px; background: #3182ce; color: #fff; border: 1px solid #3182ce; border-radius: 8px; cursor: pointer; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px; }
.modal-box { background: #fff; border-radius: 12px; width: 100%; max-width: 480px; padding: 24px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.modal-title { margin: 0; font-size: 1.25rem; color: #1a202c; }
.btn-close-icon { background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: #a0aec0; }
.modal-message { color: #4a5568; margin: 16px 0 24px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 12px; }
.btn-danger { padding: 9px 18px; background: #f44336; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
.btn-gray { padding: 9px 18px; background: #e2e8f0; color: #4a5568; border: none; border-radius: 8px; cursor: pointer; }
</style>
