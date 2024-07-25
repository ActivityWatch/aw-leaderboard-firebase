import { defineStore } from 'pinia'
import { getScreenTimeData, dataToSummary } from '@/firebase/data'
import type { ScreenTimeSummary, ScreenTimeData } from '@/types'
import { useAuthStore } from './auth'
import { getFirestore, collection, onSnapshot } from 'firebase/firestore'
import { ref,computed, type ComputedRef, watch } from 'vue'


export const useScreenTimeStore = defineStore('screentime', () => {

  const screenTimeData = ref<ScreenTimeData[]>([])
  const summary:ComputedRef<ScreenTimeSummary[]> = computed(
    () => screenTimeData.value.map((data) => dataToSummary(data))
  )
  const userId = useAuthStore().user!.uid
  const db = getFirestore()
  const colRef = collection(db, 'screentime/' + userId + '/' + userId)
  onSnapshot(colRef, (snapshot) => {
      const changes = snapshot.docChanges()
      if (changes.length === 0) return
      console.log('updated screenTimeData')
      getScreenTimeData(userId).then((data) => {
        console.log('data', data)
        // This prevents charts from re-rendering when the data hasn't changed
        if (JSON.stringify(screenTimeData.value) !== JSON.stringify(data)) {
          // TODO: optimize this JSON.stringify might be slow
          screenTimeData.value = data
        }
      })
    })
  
  // resets the store on user logout
  watch(() => userId, () => {
    screenTimeData.value = []
  })

  return { screenTimeData, summary}
}, {
  persist: true
})
