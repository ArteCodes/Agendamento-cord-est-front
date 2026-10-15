<template>
  <div class="modal-backdrop" @click.self="$emit('continuar')">
    <div class="modal-card">
      <header class="modal-cabecalho">
        <h2 class="modal-titulo">Horas não completas</h2>
        <button type="button" class="btn-fechar-icone" @click="$emit('continuar')">&times;</button>
      </header>
      <div class="modal-corpo">
        <p class="msg">As horas semanais <strong>não foram completas</strong> ou há alterações <strong>não salvas</strong>.</p>
        <p class="resumo">Salvo: <strong>{{ horasSalvas }}h</strong> de <strong>{{ metaHoras }}h</strong> · Não salvos: <strong>{{ qtdRascunho }}</strong></p>
        <p class="alerta">Se sair agora sem confirmar, os novos horários serão descartados.</p>
      </div>
      <footer class="modal-rodape">
        <button type="button" class="btn-acao btn-sair" @click="$emit('sair')">Sair sem salvar</button>
        <button type="button" class="btn-acao btn-continuar" @click="$emit('continuar')">Continuar editando</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  horasSalvas: { type: String, default: '0' },
  metaHoras: { type: Number, default: 20 },
  qtdRascunho: { type: Number, default: 0 }
})

defineEmits(['sair', 'continuar'])
</script>

<style scoped>
.modal-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,0.55); display: flex; align-items: center; justify-content: center; z-index: 1100; padding: 1rem; }
.modal-card { background: #fff; border-radius: 12px; width: 100%; max-width: 460px; overflow: hidden; }
.modal-cabecalho { display: flex; justify-content: space-between; align-items: center; padding: 1.1rem 1.4rem; border-bottom: 1px solid #e2e8f0; }
.modal-titulo { margin: 0; font-size: 1.1rem; color: #b91c1c; }
.btn-fechar-icone { background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b; }
.modal-corpo { padding: 1.25rem 1.4rem; color: #334155; display: flex; flex-direction: column; gap: 8px; }
.msg, .resumo, .alerta { margin: 0; }
.resumo { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 8px 12px; }
.alerta { font-size: 0.85rem; color: #92400e; }
.modal-rodape { display: flex; justify-content: flex-end; gap: 0.75rem; padding: 1.1rem 1.4rem; background: #f8fafc; flex-wrap: wrap; }
.btn-acao { padding: 0.55rem 1rem; border-radius: 8px; border: 1px solid transparent; cursor: pointer; font-weight: 600; }
.btn-sair { background: #dc2626; color: #fff; }
.btn-continuar { background: #16a34a; color: #fff; }
</style>
