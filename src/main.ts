import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { useUserStore } from './stores/user'
import { darkMode } from './composables/useDarkMode'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

// 初始化主题系统
const initTheme = () => {
  const storedTheme = darkMode.getStoredTheme()
  darkMode.theme.value = storedTheme
  darkMode.updateDarkMode()

  // 监听系统主题变化
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (darkMode.theme.value === 'system') {
        darkMode.updateDarkMode()
      }
    }

    mediaQuery.addEventListener('change', handleChange)
  }
}

// 初始化用户认证状态
const initApp = async () => {
  // 首先初始化主题，确保页面加载时就有正确的主题
  initTheme()

  const userStore = useUserStore()
  await userStore.initAuth()

  app.mount('#app')
}

// 启动应用
initApp().catch(console.error)
