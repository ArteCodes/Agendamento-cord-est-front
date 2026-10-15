<template>
  <div class="modal-backdrop" @click.self="$emit('fechar')">
    <div class="modal-card">
      <header class="modal-cabecalho">
        <h2 class="modal-titulo">Novo horário — {{ nomeDia }}</h2>
        <button type="button" class="btn-fechar-icone" @click="$emit('fechar')">&times;</button>
      </header>
      <div class="modal-corpo">
        <div class="form-group">
          <label>Dia da semana</label>
          <!-- Campo não editável: vem fixo do dia clicado -->
          <input class="input" :value="nomeDia" disabled />
        </div>
        <div class="form-linha">
          <div class="form-group">
            <label for="hora-inicio">Hora inicial</label>
            <input id="hora-inicio" v-model="horaInicio" type="time" class="input" required />
          </div>
          <div class="form-group">
            <label for="duracao">Tempo (duração)</label>
            <select id="duracao" v-model.number="duracaoMin" class="input">
              <option :value="30">30 min</option>
              <option :value="45">45 min</option>
              <option :value="60">1h</option>
              <option :value="90">1h30</option>
              <option :value="120">2h</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="tipo">Tipo de atendimento</label>
          <select id="tipo" v-model="tipo" class="input">
            <option>Atendimento</option>
            <option>Consulta Psicológica</option>
            <option>Orientação Acadêmica</option>
            <option>Atendimento Social</option>
            <option>Consulta Nutricional</option>
            <option>Apoio Psicopedagógico</option>
          </select>
        </div>
        <p class="preview">Horário: <strong>{{ horaInicio || '--:--' }} - {{ horaFim || '--:--' }}</strong></p>
        <p v-if="erro" class="erro">{{ erro }}</p>
      </div>
      <footer class="modal-rodape">
        <button type="button" class="btn-acao btn-fechar-modal" @click="$emit('fechar')">Fechar</button>
        <button type="button" class="btn-acao btn-adicionar" @click="adicionar">Adicionar ao rascunho</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { somarMinutos } from '@/modules/schedule/store/schedule'

const props = defineProps({
  diaSemana: { type: Number, required: true },
  nomeDia: { type: String, default: '' }
})

const emit = defineEmits(['fechar', 'adicionar'])

const horaInicio = ref('14:00')
const duracaoMin = ref(60)
const tipo = ref('Atendimento')
const erro = ref('')

const horaFim = computed(() => {
  if (!horaInicio.value) return ''
  return somarMinutos(horaInicio.value, Number(duracaoMin.value)) || ''
})

function adicionar() {
  erro.value = ''
  if (!horaInicio.value) {
    erro.value = 'Informe a hora inicial.'
    return
  }
  if (!horaFim.value) {
    erro.value = 'Horário inválido (estoura o dia). Ajuste hora ou duração.'
    return
  }
  emit('adicionar', {
    dia_semana: props.diaSemana,
    hora_inicio: horaInicio.value,
    duracao_min: Number(duracaoMin.value),
    tipo: tipo.value
  })
}
</script>

<style scoped>
.modal-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
.modal-card { background: #fff; border-radius: 12px; width: 100%; max-width: 460px; overflow: hidden; }
.modal-cabecalho { display: flex; justify-content: space-between; align-items: center; padding: 1.1rem 1.4rem; border-bottom: 1px solid #e2e8f0; }
.modal-titulo { margin: 0; font-size: 1.1rem; color: #0f172a; }
.btn-fechar-icone { background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b; }
.modal-corpo { padding: 1.25rem 1.4rem; display: flex; flex-direction: column; gap: 12px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 13px; font-weight: 600; color: #475569; }
.form-linha { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.input { padding: 10px 12px; border: 1px solid #cbd5e0; border-radius: 8px; font-size: 14px; color: #1a202c; }
.input:disabled { background: #f1f5f9; color: #64748b; }
.preview { margin: 0; color: #334155; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 12px; }
.erro { margin: 0; color: #b91c1c; font-size: 0.85rem; }
.modal-rodape { display: flex; justify-content: flex-end; gap: 0.75rem; padding: 1.1rem 1.4rem; background: #f8fafc; }
.btn-acao { padding: 0.55rem 1rem; border-radius: 8px; border: 1px solid transparent; cursor: pointer; font-weight: 600; }
.btn-adicionar { background: #16a34a; color: #fff; }
.btn-fechar-modal { background: #e2e8f0; color: #334155; }
</style>
