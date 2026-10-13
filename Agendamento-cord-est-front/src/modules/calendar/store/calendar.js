import { defineStore } from 'pinia'
import { useAppointmentStore } from '@/modules/appointment/store/appointment'

/**
 * calendar.js — store do módulo calendar (Calendário de Atendimento).
 * Modelo estático, sem backend: expõe apenas confirmados.
 */
export const useCalendarStore = defineStore('calendar', {
  getters: {
    agendamentosConfirmados: () => useAppointmentStore().agendamentosConfirmados,
    confirmadosPorData: () => useAppointmentStore().confirmadosPorData
  }
})
