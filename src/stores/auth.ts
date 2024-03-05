import { defineStore } from 'pinia'
import { auth } from '@/firebase/firebaseInit'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type User
} from 'firebase/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null
  }),
  persist: true,
  getters: {
    isAuthenticated: (state) => Boolean(state.user)
  },
  actions: {
    async login(email: string, password: string) {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      this.user = user
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
