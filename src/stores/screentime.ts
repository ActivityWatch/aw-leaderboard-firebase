import { defineStore } from 'pinia'
import { getScreenTimeData, dataToSummary,  } from '@/firebase/data'
import type { ScreenTimeSummary, ScreenTimeData } from '@/types'
import { useAuthStore } from './auth'
import { getFirestore, collection } from 'firebase/firestore'

export const useScreenTimeStore = defineStore('screentime', {
  state: () => ({
    screenTimeData: null as ScreenTimeData[] | null,
    summary: null as ScreenTimeSummary[] | null
  }),
  getters: {
    summaryExists: (state) => Boolean(state.summary),
    getSummaries: (state) => state.summary
  },
  persist: true,
  actions: {
    async fetchSummary() {
      const userId = useAuthStore().user!.uid
      const db = getFirestore()
      const colRef = collection(db, `screentime/${userId}/${userId}`)
      this.sync(
        'screenTimeData',
        colRef
      )
      if (!this.screenTimeData) {
        console.error('No data found in screentime store')
        return
      }
      const summary = this.screenTimeData.map(dataToSummary)
      this.summary = summary
    }
  }
})
