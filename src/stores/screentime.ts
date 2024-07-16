import { defineStore } from 'pinia'
import { getScreenTimeData, dataToSummary } from '@/firebase/data'
import type { ScreenTimeSummary, ScreenTimeData } from '@/types'
import { useAuthStore } from './auth'
import { getFirestore, collection, onSnapshot } from 'firebase/firestore'
import { ref } from 'vue'


export const useScreenTimeStore = defineStore('screentime', () => {
  const screenTimeData = ref<ScreenTimeData[] | []>([])
  const summary = ref<ScreenTimeSummary[] | []>([])

  function fetchSummary() {
    const userId = useAuthStore().user!.uid
    const db = getFirestore()
    const colRef = collection(db, `screentime/${userId}/${userId}`)
    onSnapshot(colRef, (snapshot) => {
      const changes = snapshot.docChanges()
      if (changes.length === 0) return
      console.log('updated screenTimeData')
      getScreenTimeData(userId).then((data) => {
        console.log('data', data)
        screenTimeData.value = data
        if (screenTimeData.value) {
          summary.value = screenTimeData.value.map((data) => dataToSummary(data))
        } else {
          summary.value = []
        }
      })
    })
  }

  function resetStore() {
    screenTimeData.value = []
    summary.value = []
  }

  return { screenTimeData, summary, fetchSummary, resetStore }
}, {
  persist: true
})
