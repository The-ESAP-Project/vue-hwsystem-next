import { computed } from 'vue'

// 环境变量配置 composable
export function useEnvConfig() {
  // 是否开放注册功能
  const isRegistrationEnabled = computed(() => {
    return import.meta.env.VITE_ENABLE_REGISTRATION === 'true'
  })

  // 应用标题
  const appTitle = computed(() => {
    return import.meta.env.VITE_APP_TITLE || '作业管理系统'
  })

  // API 基础 URL
  const apiBaseUrl = computed(() => {
    return import.meta.env.VITE_API_BASE_URL || ''
  })

  // 是否为开发模式
  const isDev = computed(() => {
    return import.meta.env.DEV
  })

  return {
    isRegistrationEnabled,
    appTitle,
    apiBaseUrl,
    isDev,
  }
}
