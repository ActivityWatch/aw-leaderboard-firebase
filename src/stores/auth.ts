import { defineStore } from 'pinia'
import { auth } from '@/firebase/firebaseInit'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type User
} from 'firebase/auth'
import { getApiKey } from './../../src/firebase/data'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    apiKey: null as String | null,
  }),
  persist: true,
  getters: {
    isAuthenticated: (state) => Boolean(state.user),
    getApiKey: (state) => state.apiKey
  },
  actions: {
    async login(email: string, password: string) {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      this.user = user
      
    },
    async fetchKey() {
      if (this.apiKey) return
      const key = await getApiKey(this.user?.uid || '')
      this.apiKey = key
    },
    async signup(email: string, password: string) {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      this.user = user
    },
    async logout() {
      await auth.signOut()
      this.$reset()
      this.user = null
    }
  }
})
