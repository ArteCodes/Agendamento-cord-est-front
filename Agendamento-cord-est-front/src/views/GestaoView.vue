<template>
  <div class="painel-gestao">
    <!-- Cabeçalho principal com saudação ao coordenador -->
    <header class="painel-header">
      <h1 class="titulo">Painel de Gestão</h1>
      <p class="subtitulo">Bem-vindo, {{ userName }}</p>
    </header>

    <!-- Barra de resumo de estatísticas (3 cards inline) -->
    <section class="metricas-container" aria-label="Estatísticas de agendamentos">
      <div class="card-metrica card-total">
        <div class="metrica-conteudo">
          <span class="metrica-rotulo">Total de Agendamentos</span>
          <span class="metrica-valor">{{ totalAgendamentos }}</span>
        </div>
      </div>

      <div class="card-metrica card-pendentes">
        <div class="metrica-conteudo">
          <span class="metrica-rotulo">Pendentes</span>
          <span class="metrica-valor valor-laranja">{{ totalPendentes }}</span>
        </div>
      </div>

      <div class="card-metrica card-confirmados">
        <div class="metrica-conteudo">
          <span class="metrica-rotulo">Confirmados</span>
          <span class="metrica-valor valor-verde">{{ totalConfirmados }}</span>
        </div>
      </div>
    </section>

    <!-- Tabela com todos os agendamentos -->
    <section class="tabela-secao" aria-label="Lista de todos os agendamentos">
      <div class="tabela-wrapper">
        <table class="tabela-gestao">
          <thead>
            <tr>
              <th scope="col">Aluno</th>
              <th scope="col">Agendamento</th>
              <th scope="col">Data</th>
              <th scope="col">Horário</th>
              <th scope="col">Status</th>
              <th scope="col" class="th-acoes">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="agendamento in agendamentos" :key="agendamento.id">
              <td class="col-aluno">{{ agendamento.aluno }}</td>
              <td class="col-nome">{{ agendamento.nome }}</td>
              <td class="col-data">{{ agendamento.data }}</td>
              <td class="col-horario">{{ agendamento.horario }}</td>
              <td class="col-status">
                <span :class="['badge-status', `badge-${agendamento.status.toLowerCase()}`]">
                  {{ agendamento.status }}
                </span>
              </td>
              <td class="col-acoes">
                <div class="acoes-container">
                  <button
                    v-if="agendamento.status === 'Pendente'"
                    type="button"
                    class="btn-acao btn-validar"
                    @click="validarAgendamento(agendamento)"
                  >
                    Validar
                  </button>
                  <button
                    type="button"
                    class="btn-acao btn-detalhes"
                    @click="abrirDetalhes(agendamento)"
                  >
                    Detalhes
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="agendamentos.length === 0">
              <td colspan="6" class="mensagem-vazio">
                Nenhum agendamento encontrado no momento.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Modal de Detalhes do Agendamento -->
    <div
      v-if="exibirModalDetalhes && agendamentoSelecionado"
      class="modal-backdrop"
      @click.self="fecharModal"
    >
      <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
        <header class="modal-cabecalho">
          <h2 id="modal-titulo" class="modal-titulo">Detalhes do Agendamento</h2>
          <button
            type="button"
            class="btn-fechar-icone"
            aria-label="Fechar modal"
            @click="fecharModal"
          >
            &times;
          </button>
        </header>

        <div class="modal-corpo">
          <div class="item-detalhe">
            <span class="rotulo-detalhe">Aluno:</span>
            <span class="valor-detalhe">{{ agendamentoSelecionado.aluno }}</span>
          </div>
          <div class="item-detalhe">
            <span class="rotulo-detalhe">Agendamento:</span>
            <span class="valor-detalhe">{{ agendamentoSelecionado.nome }}</span>
          </div>
          <div class="item-detalhe">
            <span class="rotulo-detalhe">Data:</span>
            <span class="valor-detalhe">{{ agendamentoSelecionado.data }}</span>
          </div>
          <div class="item-detalhe">
            <span class="rotulo-detalhe">Horário:</span>
            <span class="valor-detalhe">{{ agendamentoSelecionado.horario }}</span>
          </div>
          <div class="item-detalhe">
            <span class="rotulo-detalhe">Status:</span>
            <span :class="['badge-status', `badge-${agendamentoSelecionado.status.toLowerCase()}`]">
              {{ agendamentoSelecionado.status }}
            </span>
          </div>
        </div>

        <footer class="modal-rodape">
          <button
            v-if="agendamentoSelecionado.status === 'Pendente'"
            type="button"
            class="btn-acao btn-validar"
            @click="validarAgendamento(agendamentoSelecionado)"
          >
            Validar
          </button>
          <button
            type="button"
            class="btn-acao btn-fechar-modal"
            @click="fecharModal"
          >
            Fechar
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useAgendamentosStore } from '@/stores/agendamentos'

// Acesso à store de autenticação para resgatar dados do coordenador
const authStore = useAuthStore()
const { userName } = storeToRefs(authStore)

// Acesso à store centralizada de agendamentos
const agendamentosStore = useAgendamentosStore()
const { agendamentos, totalAgendamentos, totalPendentes, totalConfirmados } = storeToRefs(agendamentosStore)

// Método para alterar o status do agendamento para Confirmado
const validarAgendamento = (agendamento) => {
  agendamentosStore.validarAgendamento(agendamento.id)
}

// Estados e métodos para exibição dos detalhes em modal
const agendamentoSelecionado = ref(null)
const exibirModalDetalhes = ref(false)

const abrirDetalhes = (agendamento) => {
  agendamentoSelecionado.value = agendamento
  exibirModalDetalhes.value = true
}

const fecharModal = () => {
  exibirModalDetalhes.value = false
  agendamentoSelecionado.value = null
}
</script>

<style scoped>
/* Container principal da tela de gestão */
.painel-gestao {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #1e293b;
}

/* Cabeçalho */
.painel-header {
  margin-bottom: 2rem;
}

.titulo {
  font-size: 1.875rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.025em;
}

.subtitulo {
  font-size: 1rem;
  color: #64748b;
  margin: 0;
}

/* Barra de métricas / cartões de resumo */
.metricas-container {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  width: 100%;
}

.card-metrica {
  flex: 1;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.card-metrica:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Destaques visuais coloridos para os cards */
.card-total {
  border-left: 5px solid #3b82f6;
}

.card-pendentes {
  border-left: 5px solid #f97316;
}

.card-confirmados {
  border-left: 5px solid #10b981;
}

.metrica-conteudo {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.metrica-rotulo {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metrica-valor {
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1;
  color: #0f172a;
}

.valor-laranja {
  color: #ea580c;
}

.valor-verde {
  color: #059669;
}

/* Seção da tabela */
.tabela-secao {
  width: 100%;
}

.tabela-wrapper {
  width: 100%;
  overflow-x: auto;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.tabela-gestao {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9375rem;
}

.tabela-gestao th {
  background-color: #f8fafc;
  color: #475569;
  font-weight: 600;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1rem 1.25rem;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}

.tabela-gestao td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  color: #334155;
  vertical-align: middle;
}

.th-acoes {
  text-align: center;
}

/* Efeito zebrado (striped) nas linhas */
.tabela-gestao tbody tr:nth-child(even) {
  background-color: #f8fafc;
}

.tabela-gestao tbody tr:hover {
  background-color: #f1f5f9;
}

/* Badges de Status */
.badge-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: 9999px;
  line-height: 1.2;
}

.badge-pendente {
  background-color: #fff7ed;
  color: #c2410c;
  border: 1px solid #fed7aa;
}

.badge-confirmado {
  background-color: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

/* Botões de Ação */
.acoes-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-acao {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 0.85rem;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1;
}

.btn-validar {
  background-color: #10b981;
  color: #ffffff;
}

.btn-validar:hover {
  background-color: #059669;
}

.btn-detalhes {
  background-color: #3b82f6;
  color: #ffffff;
}

.btn-detalhes:hover {
  background-color: #2563eb;
}

.mensagem-vazio {
  text-align: center;
  padding: 2.5rem 1rem;
  color: #64748b;
  font-size: 0.95rem;
}

/* Modal de Detalhes */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-card {
  background-color: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-titulo {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.btn-fechar-icone {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: #64748b;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.2s ease;
}

.btn-fechar-icone:hover {
  color: #0f172a;
}

.modal-corpo {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item-detalhe {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f1f5f9;
}

.item-detalhe:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.rotulo-detalhe {
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
}

.valor-detalhe {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1e293b;
}

.modal-rodape {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.btn-fechar-modal {
  background-color: #e2e8f0;
  color: #334155;
}

.btn-fechar-modal:hover {
  background-color: #cbd5e1;
}

/* Responsividade */
@media (max-width: 768px) {
  .painel-gestao {
    padding: 1.25rem 1rem;
  }

  .metricas-container {
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .card-metrica {
    padding: 1.25rem;
  }

  .metrica-valor {
    font-size: 1.875rem;
  }

  .tabela-gestao th,
  .tabela-gestao td {
    padding: 0.75rem 1rem;
  }
}
</style>
