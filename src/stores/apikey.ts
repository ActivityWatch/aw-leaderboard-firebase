import { defineStore } from 'pinia'
import { getApiKey } from '@/firebase/data'
import { useAuthStore } from './auth'
import { ref } from 'vue'

export const useApiKeyStore = defineStore('apikey', {
  state: () => ({
    apikey : ref<string | null>(null)
  }),
  getters: {
    apikeyExists: (state) => Boolean(state.apikey),
    getApikey: (state) => state.apikey,
  },
  persist: false,
  actions: {
    async fetchKey() {
      const userId = useAuthStore().user!.uid
      const key = await getApiKey(userId);
      this.apikey = key;
        }
      },
  })
