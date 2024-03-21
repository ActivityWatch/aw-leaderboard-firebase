import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore/lite'
import { getAnalytics } from 'firebase/analytics'

// Your firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCyzf_6QNLFJtHoTIpOjanFvk5W0smBF2w',
  authDomain: 'aw-leaderboard.firebaseapp.com',
  projectId: 'my-first-project-5abef',
  storageBucket: 'aw-leaderboard.appspot.com',
  messagingSenderId: '1026556434182',
  appId: '1:1026556434182:web:ac634f38e5a6fe0baab087',
  measurementId: 'G-DZC0Z6GGEZ'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Utility functions
export const db = getFirestore(app)
export const auth = getAuth(app)
export const analytics = getAnalytics(app)

export default app
