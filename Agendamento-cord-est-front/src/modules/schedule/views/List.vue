<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/modules/auth/store/auth'
import { useScheduleStore, somarMinutos, paraMinutos } from '@/modules/schedule/store/schedule'
import WeekGrid from '@/modules/schedule/model/WeekGrid.vue'
import ModalHorario from '@/modules/schedule/model/ModalHorario.vue'
import ModalSair from '@/modules/schedule/model/ModalSair.vue'

const router = useRouter()
const authStore = useAuthStore()
const scheduleStore = useScheduleStore()
const { user, userName, cargaHorariaSemanal } = storeToRefs(authStore)

const DIAS = [
  { valor: 1, nome: 'Segunda' },
  { valor: 2, nome: 'Terça' },
  { valor: 3, nome: 'Quarta' },
  { valor: 4, nome: 'Quinta' },
  { valor: 5, nome: 'Sexta' },
  { valor: 6, nome: 'Sábado' },
  { valor: 0, nome: 'Domingo' }
]
const nomeDiaPorValor = (v) => DIAS.find((d) => d.valor === v)?.nome || ''
const coordId = computed(() => user.value?.id ?? null)
const metaHoras = computed(() => Number(cargaHorariaSemanal.value) || 20)
const metaMin = computed(() => metaHoras.value * 60)
const rascunho = ref([])
let seqTemp = 1
const salvosDoCoord = computed(() => scheduleStore.porCoordenador(coordId.value))
const minSalvos = computed(() => scheduleStore.totalMinSalvos(coordId.value))
const minRascunho = computed(() => rascunho.value.reduce((a, r) => a + Number(r.duracao_min || 0), 0))
const minTotal = computed(() => minSalvos.value + minRascunho.value)
const metaConcluida = computed(() => minTotal.value >= metaMin.value)
const formatarHoras = (min) => (Math.round((Number(min) / 60) * 100) / 100).toString().replace('.', ',')
const horasSalvasFmt = computed(() => formatarHoras(minSalvos.value))
const horasTotaisFmt = computed(() => formatarHoras(minTotal.value))
const faltamFmt = computed(() => formatarHoras(Math.max(metaMin.value - minTotal.value, 0)))
const percentual = computed(() => (metaMin.value === 0 ? 0 : Math.min(100, Math.round((minTotal.value / metaMin.value) * 100))))
const porDia = computed(() => {
  const mapa = {}
  DIAS.forEach((d) => { mapa[d.valor] = [] })
  salvosDoCoord.value.forEach((s) => { if (mapa[s.dia_semana] != null) mapa[s.dia_semana].push({ ...s, origem: 'salvo' }) })
  rascunho.value.forEach((r) => { if (mapa[r.dia_semana] != null) mapa[r.dia_semana].push({ ...r, origem: 'rascunho' }) })
  Object.keys(mapa).forEach((k) => { mapa[k].sort((a, b) => paraMinutos(a.hora_inicio) - paraMinutos(b.hora_inicio)) })
  return mapa
})
const modalDia = ref(null)
const abrirModal = (diaValor) => { modalDia.value = diaValor }
const fecharModal = () => { modalDia.value = null }
const erroGrade = ref('')
function temChoque(dia, inicio, duracao) {
  const ini = paraMinutos(inicio)
  const fim = ini + Number(duracao)
  return (porDia.value[dia] || []).some((h) => {
    const hIni = paraMinutos(h.hora_inicio)
    const hFim = hIni + Number(h.duracao_min)
    return ini < hFim && fim > hIni
  })
}
function adicionarRascunho(payload) {
  erroGrade.value = ''
  if (metaConcluida.value) { erroGrade.value = 'Tempo semanal concluído. Não é possível adicionar mais horários.'; return }
  if (minTotal.value + Number(payload.duracao_min) > metaMin.value) { erroGrade.value = `Limite semanal de ${metaHoras.value}h seria estourado.`; return }
  if (scheduleStore.temSobreposicao(coordId.value, payload.dia_semana, payload.hora_inicio, payload.duracao_min)) { erroGrade.value = 'Choque com horário já salvo neste dia.'; return }
  if (temChoque(payload.dia_semana, payload.hora_inicio, payload.duracao_min)) { erroGrade.value = 'Choque com outro horário deste dia (inclui rascunho).'; return }
  const horaFim = somarMinutos(payload.hora_inicio, Number(payload.duracao_min))
  if (!horaFim) { erroGrade.value = 'Horário inválido.'; return }
  rascunho.value.push({ tempId: seqTemp++, ...payload, hora_fim: horaFim })
  fecharModal()
}
function removerRascunho(item) { rascunho.value = rascunho.value.filter((r) => r.tempId !== item.tempId) }
function removerSalvo(item) { scheduleStore.removerSalvo(item.id, coordId.value) }
function confirmar() {
  erroGrade.value = ''
  if (rascunho.value.length === 0) { erroGrade.value = 'Nenhum horário novo para confirmar.'; return }
  scheduleStore.salvarLote(coordId.value, rascunho.value.map(({ tempId, hora_fim, ...r }) => r))
  rascunho.value = []
}
const precisaAvisar = computed(() => rascunho.value.length > 0 || minSalvos.value < metaMin.value)
const mostrarSair = ref(false)
const rotaPendente = ref(null)
const liberadoParaSair = ref(false)
function tentarSairPara(rota) {
  if (liberadoParaSair.value || !precisaAvisar.value) { liberadoParaSair.value = false; router.push(rota); return }
  rotaPendente.value = rota
  mostrarSair.value = true
}
function confirmarSaida() {
  rascunho.value = []
  mostrarSair.value = false
  liberadoParaSair.value = true
  const destino = rotaPendente.value || '/agendamentos'
  rotaPendente.value = null
  router.push(destino)
}
function continuarEditando() { mostrarSair.value = false; rotaPendente.value = null }
onBeforeRouteLeave((to, from, next) => {
  if (liberadoParaSair.value || !precisaAvisar.value) return next()
  rotaPendente.value = to.fullPath
  mostrarSair.value = true
  next(false)
})
function aoBeforeUnload(e) {
  if (!precisaAvisar.value) return
  e.preventDefault()
  e.returnValue = ''
}
onMounted(() => { scheduleStore.carregar(coordId.value); window.addEventListener('beforeunload', aoBeforeUnload) })
onBeforeUnmount(() => { window.removeEventListener('beforeunload', aoBeforeUnload) })
</script>

<template>
  <div class="gestao-horarios">
    <header class="pagina-header">
      <div>
        <h1 class="titulo">Gestão de Horários</h1>
        <p class="subtitulo">Olá, {{ userName }} — seus horários semanais de atendimento</p>
      </div>
      <button type="button" class="btn-voltar" @click="tentarSairPara('/agendamentos')">Voltar</button>
    </header>
    <section class="indicador">
      <div class="indicador-texto">
        <span class="indicador-rotulo">Carga semanal</span>
        <span class="indicador-valor">{{ horasTotaisFmt }}h de {{ metaHoras }}h</span>
        <span v-if="!metaConcluida" class="indicador-falta">faltam {{ faltamFmt }}h</span>
        <span v-else class="indicador-ok">Tempo semanal concluído</span>
      </div>
      <div class="barra"><div class="barra-preenchida" :style="{ width: percentual + '%' }"></div></div>
      <div class="indicador-detalhe">
        <span>Salvo: {{ horasSalvasFmt }}h</span>
        <span>Rascunho: {{ formatarHoras(minRascunho) }}h ({{ rascunho.length }})</span>
      </div>
    </section>
    <p v-if="erroGrade" class="erro-grade">{{ erroGrade }}</p>
    <WeekGrid :dias="DIAS" :por-dia="porDia" :meta-concluida="metaConcluida" @adicionar="abrirModal" @remover-rascunho="removerRascunho" @remover-salvo="removerSalvo" />
    <footer class="acoes-finais">
      <button type="button" class="btn-confirmar" :disabled="rascunho.length === 0" @click="confirmar">Confirmar (salvar {{ rascunho.length }})</button>
      <p class="ajuda">Sem confirmar, recarregar ou sair da tela descarta os novos horários.</p>
    </footer>
    <ModalHorario v-if="modalDia !== null" :dia-semana="modalDia" :nome-dia="nomeDiaPorValor(modalDia)" @fechar="fecharModal" @adicionar="adicionarRascunho" />
    <ModalSair v-if="mostrarSair" :horas-salvas="horasSalvasFmt" :meta-horas="metaHoras" :qtd-rascunho="rascunho.length" @sair="confirmarSaida" @continuar="continuarEditando" />
  </div>
</template>
<style scoped>
.gestao-horarios { max-width: 1300px; margin: 0 auto; padding: 24px 16px; color: #1e293b; }
.pagina-header { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.titulo { margin: 0; font-size: 1.75rem; color: #0f172a; }
.subtitulo { margin: 4px 0 0; color: #64748b; }
.btn-voltar { padding: 8px 16px; border: 1px solid #cbd5e0; background: #fff; border-radius: 8px; cursor: pointer; color: #334155; font-weight: 600; }
.indicador { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 20px; margin-bottom: 16px; }
.indicador-texto { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; }
.indicador-rotulo { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; }
.indicador-valor { font-size: 1.5rem; font-weight: 800; color: #0f172a; }
.indicador-falta { color: #b45309; font-weight: 600; }
.indicador-ok { color: #059669; font-weight: 700; }
.barra { height: 10px; background: #f1f5f9; border-radius: 8px; margin-top: 10px; overflow: hidden; }
.barra-preenchida { height: 100%; background: #16a34a; transition: width 0.2s; }
.indicador-detalhe { display: flex; gap: 16px; margin-top: 8px; color: #64748b; font-size: 0.85rem; flex-wrap: wrap; }
.erro-grade { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; border-radius: 8px; padding: 10px 14px; }
.acoes-finais { margin-top: 20px; display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.btn-confirmar { padding: 12px 24px; background: #16a34a; color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; }
.btn-confirmar:disabled { background: #cbd5e0; cursor: not-allowed; }
.ajuda { margin: 0; color: #64748b; font-size: 0.85rem; }
</style>
