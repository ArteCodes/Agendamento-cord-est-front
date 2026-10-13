<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function voltar() {
  router.push('/agendamentos')
}
</script>

<template>
  <div class="criar-container">
    <div class="criar-card">
      <h1>Criar Novo Agendamento</h1>
      <p class="subtitle">Preencha os dados para agendar um atendimento</p>

      <form @submit.prevent class="form">
        <div class="form-group">
          <label for="tipo">Tipo de Atendimento</label>
          <select id="tipo" class="input">
            <option value="">Selecione...</option>
            <option value="psicologico">Consulta Psicológica</option>
            <option value="academico">Orientação Acadêmica</option>
            <option value="social">Atendimento Social</option>
            <option value="nutricional">Consulta Nutricional</option>
          </select>
        </div>

        <div class="form-group">
          <label for="data">Data</label>
          <input id="data" type="date" class="input" />
        </div>

        <div class="form-group">
          <label for="horario">Horário</label>
          <input id="horario" type="time" class="input" />
        </div>

        <div class="form-group">
          <label for="descricao">Descrição / Observações</label>
          <textarea id="descricao" class="input textarea" rows="3" placeholder="Descreva o motivo do agendamento..."></textarea>
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
