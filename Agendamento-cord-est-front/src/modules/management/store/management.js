import { defineStore } from 'pinia'
import { useAppointmentStore } from '@/modules/appointment/store/appointment'

/**
 * management.js — store do módulo management (Gestão / Coordenador).
 * Modelo estático, sem backend: delega para o appointment store (fonte única).
 */
export const useManagementStore = defineStore('management', {
  getters: {
    agendamentos: () => useAppointmentStore().agendamentos,
    totalAgendamentos: () => useAppointmentStore().totalAgendamentos,
    totalPendentes: () => useAppointmentStore().totalPendentes,
    totalConfirmados: () => useAppointmentStore().totalConfirmados
  },
  actions: {
    validarAgendamento(id) {
      useAppointmentStore().validarAgendamento(id)
    }
  }
})
