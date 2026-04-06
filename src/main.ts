import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/main.css'
import { LemonHub } from './sdk'
import { initializeDefaultApps } from './utils/defaultApps'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize SDK
const sdk = LemonHub.create({ debug: import.meta.env.DEV })
sdk.init(router)

// Initialize default applications using SDK
initializeDefaultApps(sdk)

app.provide('sdk', sdk)

app.mount('#app')

// Export SDK for external use
declare global {
  interface Window {
    LemonHub: typeof LemonHub
  }
}

if (import.meta.env.DEV) {
  window.LemonHub = LemonHub
}
