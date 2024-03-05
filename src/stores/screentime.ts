import { defineStore } from 'pinia'
import { getScreenTimeData, dataToSummary } from '@/firebase/data'
import type { ScreenTimeSummary } from '@/types'
import { useAuthStore } from './auth'

export const useScreenTimeStore = defineStore('screentime', {
  state: () => ({
    summary: null as ScreenTimeSummary[] | null
  }),
  getters: {
    summaryExists: (state) => Boolean(state.summary),
    getSummaries: (state) => state.summary
  },
  persist: true,
  actions: {
    async fetchSummary() {
      const data = await getScreenTimeData(useAuthStore().user!.uid)
      if (!data) {
        console.error('No data found in screentime store')
        return
      }
      const summary = data.map(dataToSummary)
      this.summary = summary
    }
  }
})
