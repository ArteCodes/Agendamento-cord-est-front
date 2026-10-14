<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/modules/auth/store/auth'
import { useAppointmentStore } from '@/modules/appointment/store/appointment'
import FormCreate from '@/modules/appointment/model/FormCreate.vue'

const router = useRouter()
const authStore = useAuthStore()
const appointmentStore = useAppointmentStore()
const { userName, user } = storeToRefs(authStore)

const form = reactive({ tipo: 'Consulta Psicológica', data: '', horario: '', local: 'Sala de Atendimento', descricao: '' })
const updateField = ({ field, value }) => { form[field] = value }
const voltar = () => router.push('/agendamentos')
const handleSalvar = () => {
  if (!form.tipo || !form.data || !form.horario) { alert('Por favor, preencha tipo, data e horário.'); return }
  appointmentStore.criarAgendamento({
    aluno: userName.value || 'Aluno',
    alunoEmail: user.value?.email || 'aluno@teste.com',
    aluno_matricula: user.value?.matricula || null,
    created_by: user.value?.id ?? null,
    coordinator_id: 2,
    nome: form.tipo, data: form.data, horario: form.horario, local: form.local || 'A definir', descricao: form.descricao
  }, user.value)
  router.push('/agendamentos')
}
</script>
<template>
  <div class="criar-container">
    <div class="criar-card">
      <h1>Criar Novo Agendamento</h1>
      <p class="subtitle">Preencha os dados para agendar um atendimento</p>
      <FormCreate :form="form" @update:field="updateField" @cancel="voltar" @submit="handleSalvar" />
    </div>
  </div>
</template>
<style scoped>
.criar-container { min-height: calc(100vh - 60px); background: #f5f5f5; display: flex; justify-content: center; padding: 40px 20px; }
.criar-card { background: #fff; border-radius: 12px; padding: 40px; width: 100%; max-width: 560px; height: fit-content; }
h1 { font-size: 24px; color: #333; margin: 0 0 4px; }
.subtitle { color: #888; font-size: 14px; margin: 0 0 32px; }
</style>
