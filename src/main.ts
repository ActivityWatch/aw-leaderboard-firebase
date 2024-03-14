// In this file, we import the necessary modules and the main App.vue component.
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { PiniaFirestoreSync } from 'pinia-plugin-firestore-sync'

import App from './App.vue'
import router from './router'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
pinia.use(PiniaFirestoreSync)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
console.log('Vue app initialized')
