import { defineStore } from 'pinia'
import type { ScreenTimeSummary } from '@/types'
import { getLeaderboard } from '@/firebase/data'
import { ref } from 'vue'

export const useLeaderboardStore = defineStore('leaderboard', {
  state: () => ({
    leaderboardData: ref<ScreenTimeSummary[] | null>(null)
  }),
  getters: {
    leaderboardExists: (state) => Boolean(state.leaderboardData),
    getleaderboardData: (state) => state.leaderboardData
  },
  persist: true,
  actions: {
    fetchLeaderboardData(offset:number = 0) {
      getLeaderboard(offset).then((data) => {
        this.leaderboardData = data
      })
    },
    resetStore() {
      this.leaderboardData = null
      this.$reset()
    }
  }
})
