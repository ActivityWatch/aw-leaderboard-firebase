import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore/lite'
import { getAnalytics } from 'firebase/analytics'

// Your firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4M_ASCxrRPSzAnfOZ4gykuceoxf8ZYTY",
  authDomain: "aw-mockup.firebaseapp.com",
  projectId: "aw-mockup",
  storageBucket: "aw-mockup.appspot.com",
  messagingSenderId: "815662035897",
  appId: "1:815662035897:web:efea41a0c4ca9843c0bc68",
  measurementId: "G-Z5QBXYENH0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Utility functions
export const db = getFirestore(app)
export const auth = getAuth(app)
export const analytics = getAnalytics(app)

export default app
