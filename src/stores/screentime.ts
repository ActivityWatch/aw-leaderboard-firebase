import { defineStore } from 'pinia'
import { getScreenTimeData, dataToSummary } from '@/firebase/data'
import type { ScreenTimeSummary, ScreenTimeData } from '@/types'
import { useAuthStore } from './auth'
import { getFirestore, collection, onSnapshot } from 'firebase/firestore'
import { ref } from 'vue'

export const useScreenTimeStore = defineStore('screentime', {
  state: () => ({
    screenTimeData: ref<ScreenTimeData[] | null>(null),
    summary: ref<ScreenTimeSummary[] | null>(null)
  }),
  getters: {
    summaryExists: (state) => Boolean(state.summary),
    screenTimeExists: (state) => Boolean(state.screenTimeData),
    getSummaries: (state) => state.summary,
    getScreenTimeData: (state) => state.screenTimeData
  },
  persist: true,
  actions: {
    async fetchSummary() {
      const userId = useAuthStore().user!.uid
      const db = getFirestore()
      const colRef = collection(db, `screentime/${userId}/${userId}`)
      onSnapshot(colRef, (snapshot) => {
        const changes = snapshot.docChanges()
        if (changes.length === 0) return
        console.log('updated screenTimeData')
        getScreenTimeData(userId).then((data) => {
          console.log('data', data)
          this.screenTimeData = data
          if (this.screenTimeData) {
            this.summary = this.screenTimeData.map((data) => dataToSummary(data))
          } else {
            this.summary = null
          }
        })
      })
    },
    async resetStore() {
      this.screenTimeData = null
      this.summary = null
      this.$reset()
    }
  }
})
