<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/modules/auth/store/auth'
import { useManagementStore } from '@/modules/management/store/management'
import TableList from '@/modules/management/model/TableList.vue'
import FormShow from '@/modules/management/model/FormShow.vue'

const authStore = useAuthStore()
const { userName } = storeToRefs(authStore)
const managementStore = useManagementStore()
const { agendamentos, totalAgendamentos, totalPendentes, totalConfirmados } = storeToRefs(managementStore)

const agendamentoSelecionado = ref(null)
const exibirModalDetalhes = ref(false)
const validarAgendamento = (ag) => managementStore.validarAgendamento(ag.id)
const abrirDetalhes = (ag) => { agendamentoSelecionado.value = ag; exibirModalDetalhes.value = true }
const fecharModal = () => { exibirModalDetalhes.value = false; agendamentoSelecionado.value = null }
</script>
<template>
  <div class="painel-gestao">
    <header class="painel-header"><h1 class="titulo">Painel de Gestão</h1><p class="subtitulo">Bem-vindo, {{ userName }}</p></header>
    <section class="metricas-container">
      <div class="card-metrica card-total"><div class="metrica-conteudo"><span class="metrica-rotulo">Total de Agendamentos</span><span class="metrica-valor">{{ totalAgendamentos }}</span></div></div>
      <div class="card-metrica card-pendentes"><div class="metrica-conteudo"><span class="metrica-rotulo">Pendentes</span><span class="metrica-valor valor-laranja">{{ totalPendentes }}</span></div></div>
      <div class="card-metrica card-confirmados"><div class="metrica-conteudo"><span class="metrica-rotulo">Confirmados</span><span class="metrica-valor valor-verde">{{ totalConfirmados }}</span></div></div>
    </section>
    <section class="tabela-secao">
      <TableList :items="agendamentos" @validate="validarAgendamento" @show="abrirDetalhes" />
    </section>
    <div v-if="exibirModalDetalhes && agendamentoSelecionado" class="modal-backdrop" @click.self="fecharModal">
      <div class="modal-card">
        <header class="modal-cabecalho"><h2 class="modal-titulo">Detalhes do Agendamento</h2><button type="button" class="btn-fechar-icone" @click="fecharModal">&times;</button></header>
        <FormShow :item="agendamentoSelecionado" />
        <footer class="modal-rodape">
          <button v-if="agendamentoSelecionado.status === 'Pendente'" type="button" class="btn-acao btn-validar" @click="validarAgendamento(agendamentoSelecionado)">Validar</button>
          <button type="button" class="btn-acao btn-fechar-modal" @click="fecharModal">Fechar</button>
        </footer>
      </div>
    </div>
  </div>
</template>
<style scoped>
.painel-gestao { max-width: 1200px; margin: 0 auto; padding: 2rem 1.5rem; color: #1e293b; }
.painel-header { margin-bottom: 2rem; }
.titulo { font-size: 1.875rem; color: #0f172a; margin: 0 0 0.5rem 0; }
.subtitulo { color: #64748b; margin: 0; }
.metricas-container { display: flex; gap: 1.5rem; margin-bottom: 2.5rem; }
.card-metrica { flex: 1; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; }
.card-total { border-left: 5px solid #3b82f6; }
.card-pendentes { border-left: 5px solid #f97316; }
.card-confirmados { border-left: 5px solid #10b981; }
.metrica-conteudo { display: flex; flex-direction: column; gap: 0.5rem; }
.metrica-rotulo { font-size: 0.875rem; color: #64748b; text-transform: uppercase; }
.metrica-valor { font-size: 2.25rem; font-weight: 700; }
.valor-laranja { color: #ea580c; }
.valor-verde { color: #059669; }
.modal-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
.modal-card { background: #fff; border-radius: 12px; width: 100%; max-width: 480px; overflow: hidden; }
.modal-cabecalho { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid #e2e8f0; }
.modal-titulo { margin: 0; font-size: 1.125rem; }
.btn-fechar-icone { background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b; }
.modal-rodape { display: flex; justify-content: flex-end; gap: 0.75rem; padding: 1.25rem 1.5rem; background: #f8fafc; }
.btn-acao { padding: 0.45rem 0.85rem; border-radius: 6px; border: 1px solid transparent; cursor: pointer; font-weight: 600; }
.btn-validar { background: #10b981; color: #fff; }
.btn-fechar-modal { background: #e2e8f0; color: #334155; }
</style>
