<template>
  <form @submit.prevent="$emit('submit')" class="form">
    <div class="form-group">
      <label for="tipo">Tipo de Atendimento</label>
      <select id="tipo" :value="form.tipo" class="input" required @change="$emit('update:field', { field: 'tipo', value: $event.target.value })">
        <option value="Consulta Psicológica">Consulta Psicológica</option>
        <option value="Orientação Acadêmica">Orientação Acadêmica</option>
        <option value="Atendimento Social">Atendimento Social</option>
        <option value="Consulta Nutricional">Consulta Nutricional</option>
      </select>
    </div>

    <div class="form-group">
      <label for="data">Data</label>
      <input id="data" :value="form.data" type="date" class="input" required @input="$emit('update:field', { field: 'data', value: $event.target.value })" />
    </div>

    <div class="form-group">
      <label for="horario">Horário</label>
      <input id="horario" :value="form.horario" type="time" class="input" required @input="$emit('update:field', { field: 'horario', value: $event.target.value })" />
    </div>

    <div class="form-group">
      <label for="local">Local Previsto</label>
      <input id="local" :value="form.local" type="text" class="input" placeholder="Ex: Sala 201 ou Online" @input="$emit('update:field', { field: 'local', value: $event.target.value })" />
    </div>

    <div class="form-group">
      <label for="descricao">Descrição / Observações</label>
      <textarea id="descricao" :value="form.descricao" class="input textarea" rows="3" placeholder="Descreva o motivo do agendamento..." @input="$emit('update:field', { field: 'descricao', value: $event.target.value })"></textarea>
    </div>

    <div class="form-actions">
      <button type="button" class="btn-cancel" @click="$emit('cancel')">Cancelar</button>
      <button type="submit" class="btn-submit">Criar Agendamento</button>
    </div>
  </form>
</template>

<script setup>
defineProps({
  form: { type: Object, required: true }
})

defineEmits(['submit', 'cancel', 'update:field'])
</script>

<style scoped>
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
