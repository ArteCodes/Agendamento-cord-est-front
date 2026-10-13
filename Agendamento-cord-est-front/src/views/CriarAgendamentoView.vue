<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useAgendamentosStore } from '@/stores/agendamentos'

const router = useRouter()
const authStore = useAuthStore()
const agendamentosStore = useAgendamentosStore()

const { userName, user } = storeToRefs(authStore)

const tipo = ref('Consulta Psicológica')
const data = ref('')
const horario = ref('')
const local = ref('Sala de Atendimento')
const descricao = ref('')

function voltar() {
  router.push('/agendamentos')
}

function handleSalvar() {
  if (!tipo.value || !data.value || !horario.value) {
    alert('Por favor, preencha tipo, data e horário.')
    return
  }

  agendamentosStore.criarAgendamento({
    aluno: userName.value || 'Aluno',
    alunoEmail: user.value?.email || 'aluno@teste.com',
    nome: tipo.value,
    data: data.value,
    horario: horario.value,
    local: local.value || 'A definir',
    descricao: descricao.value
  })

  router.push('/agendamentos')
}
</script>

<template>
  <div class="criar-container">
    <div class="criar-card">
      <h1>Criar Novo Agendamento</h1>
      <p class="subtitle">Preencha os dados para agendar um atendimento</p>

      <form @submit.prevent="handleSalvar" class="form">
        <div class="form-group">
          <label for="tipo">Tipo de Atendimento</label>
          <select id="tipo" v-model="tipo" class="input" required>
            <option value="Consulta Psicológica">Consulta Psicológica</option>
            <option value="Orientação Acadêmica">Orientação Acadêmica</option>
            <option value="Atendimento Social">Atendimento Social</option>
            <option value="Consulta Nutricional">Consulta Nutricional</option>
          </select>
        </div>

        <div class="form-group">
          <label for="data">Data</label>
          <input id="data" v-model="data" type="date" class="input" required />
        </div>

        <div class="form-group">
          <label for="horario">Horário</label>
          <input id="horario" v-model="horario" type="time" class="input" required />
        </div>

        <div class="form-group">
          <label for="local">Local Previsto</label>
          <input id="local" v-model="local" type="text" class="input" placeholder="Ex: Sala 201 ou Online" />
        </div>

        <div class="form-group">
          <label for="descricao">Descrição / Observações</label>
          <textarea id="descricao" v-model="descricao" class="input textarea" rows="3" placeholder="Descreva o motivo do agendamento..."></textarea>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="voltar">Cancelar</button>
          <button type="submit" class="btn-submit">Criar Agendamento</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.criar-container {
  min-height: calc(100vh - 60px);
  background: #f5f5f5;
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

.criar-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 40px;
  width: 100%;
  max-width: 560px;
  height: fit-content;
}

h1 {
  font-size: 24px;
  color: #333;
  margin: 0 0 4px;
}

.subtitle {
  color: #888;
  font-size: 14px;
  margin: 0 0 32px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #555;
}

.input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  transition: border-color 0.2s;
}

.input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.textarea {
  resize: vertical;
  font-family: inherit;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.btn-cancel {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #f5f5f5;
}

.btn-submit {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #4CAF50;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-submit:hover {
  background: #43a047;
}
</style>
