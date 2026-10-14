<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/modules/auth/store/auth'
import { useAppointmentStore } from '@/modules/appointment/store/appointment'
import FormShow from '@/modules/appointment/model/FormShow.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const appointmentStore = useAppointmentStore()
const { user, canValidate } = storeToRefs(authStore)
const item = computed(() => appointmentStore.agendamentos.find((a) => String(a.id) === String(route.params.id)))
// Guard de visibilidade por ID: só mostra se o item está na lista visível da função
const podeVer = computed(() => {
  if (!item.value || !user.value) return false
  return appointmentStore.visiveisPorFuncao(user.value).some((a) => a.id === item.value.id)
})
const podeValidar = computed(() => podeVer.value && canValidate.value && item.value?.status === 'Pendente')
const validar = () => {
  if (!podeValidar.value) return
  appointmentStore.validarAgendamento(item.value.id)
}
const voltar = () => router.push('/agendamentos')
</script>
<template>
  <div class="show-container">
    <div class="show-card">
      <h1>Detalhes do Agendamento</h1>
      <FormShow v-if="item && podeVer" :item="item" />
      <p v-else class="vazio">Agendamento não encontrado ou sem permissão.</p>
      <div class="actions">
        <button v-if="podeValidar" type="button" class="btn-validar" @click="validar">Validar</button>
        <button type="button" class="btn-voltar" @click="voltar">Voltar</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.show-container { min-height: calc(100vh - 60px); background: #f5f5f5; display: flex; justify-content: center; padding: 40px 20px; }
.show-card { background: #fff; border-radius: 12px; padding: 32px; width: 100%; max-width: 560px; height: fit-content; }
h1 { font-size: 22px; color: #1a202c; margin: 0 0 20px; }
.vazio { color: #718096; }
.actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px; }
.btn-validar { padding: 10px 18px; background: #10b981; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
.btn-voltar { padding: 10px 18px; background: #e2e8f0; border: none; border-radius: 8px; cursor: pointer; }
</style>

