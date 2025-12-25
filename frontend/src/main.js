import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import i18n from './locales'

const app = createApp(App)
app.use(i18n)
const vm = app.mount('#app')

// Register service worker with update detection
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/dr-denker-app/sw.js').then(registration => {
      
      // Listen for successful update installation
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'activated' && navigator.serviceWorker.controller) {
            // New service worker activated - show toast
            if (vm.$refs?.updateToast) {
              vm.$refs.updateToast.show()
            }
          }
        })
      })
      
    }).catch(error => {
      console.log('Service worker registration failed:', error)
    })
  })
}

