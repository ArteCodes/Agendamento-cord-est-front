<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppointmentStore } from '@/modules/appointment/store/appointment'
import FormShow from '@/modules/appointment/model/FormShow.vue'

const route = useRoute()
const router = useRouter()
const appointmentStore = useAppointmentStore()
const item = computed(() => appointmentStore.agendamentos.find((a) => String(a.id) === String(route.params.id)))
const voltar = () => router.push('/agendamentos')
</script>
<template>
  <div class="show-container">
    <div class="show-card">
      <h1>Detalhes do Agendamento</h1>
      <FormShow v-if="item" :item="item" />
      <p v-else class="vazio">Agendamento não encontrado.</p>
      <div class="actions"><button type="button" class="btn-voltar" @click="voltar">Voltar</button></div>
    </div>
  </div>
</template>
<style scoped>
.show-container { min-height: calc(100vh - 60px); background: #f5f5f5; display: flex; justify-content: center; padding: 40px 20px; }
.show-card { background: #fff; border-radius: 12px; padding: 32px; width: 100%; max-width: 560px; height: fit-content; }
h1 { font-size: 22px; color: #1a202c; margin: 0 0 20px; }
.vazio { color: #718096; }
.actions { display: flex; justify-content: flex-end; margin-top: 16px; }
.btn-voltar { padding: 10px 18px; background: #e2e8f0; border: none; border-radius: 8px; cursor: pointer; }
</style>
