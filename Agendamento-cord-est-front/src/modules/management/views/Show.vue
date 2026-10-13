<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useManagementStore } from '@/modules/management/store/management'
import FormShow from '@/modules/management/model/FormShow.vue'

const route = useRoute()
const router = useRouter()
const managementStore = useManagementStore()
const item = computed(() => managementStore.agendamentos.find((a) => String(a.id) === String(route.params.id)))
const validar = () => { if (item.value) managementStore.validarAgendamento(item.value.id) }
const voltar = () => router.push('/gestao')
</script>
<template>
  <div class="show-container">
    <div class="show-card">
      <h1>Detalhes do Agendamento</h1>
      <FormShow v-if="item" :item="item" />
      <p v-else class="vazio">Agendamento não encontrado.</p>
      <div class="actions">
        <button v-if="item && item.status === 'Pendente'" type="button" class="btn-validar" @click="validar">Validar</button>
        <button type="button" class="btn-voltar" @click="voltar">Voltar</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.show-container { min-height: calc(100vh - 60px); background: #f5f5f5; display: flex; justify-content: center; padding: 40px 20px; }
.show-card { background: #fff; border-radius: 12px; padding: 32px; width: 100%; max-width: 560px; height: fit-content; }
h1 { font-size: 22px; color: #0f172a; margin: 0 0 20px; }
.vazio { color: #64748b; }
.actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px; }
.btn-validar { padding: 10px 18px; background: #10b981; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
.btn-voltar { padding: 10px 18px; background: #e2e8f0; border: none; border-radius: 8px; cursor: pointer; }
</style>
