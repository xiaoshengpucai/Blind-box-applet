import App from './App'
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import uviewPlus from 'uview-plus'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  
  app.use(uviewPlus)
  app.use(pinia)
  
  return {
    app,
  }
}