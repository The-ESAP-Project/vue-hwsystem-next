// 黑夜模式管理 composable
import { ref, computed, watch, onMounted } from 'vue'

// 主题类型
export type Theme = 'light' | 'dark' | 'system'

// 全局状态
const theme = ref<Theme>('system')
const isDark = ref(false)

// 从 localStorage 获取保存的主题设置
const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'system'

  const stored = localStorage.getItem('theme') as Theme
  return stored && ['light', 'dark', 'system'].includes(stored) ? stored : 'system'
}

// 保存主题设置到 localStorage
const storeTheme = (newTheme: Theme) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', newTheme)
  }
}

// 检测系统主题偏好
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// 应用主题到 DOM
const applyTheme = (isDarkMode: boolean) => {
  if (typeof document === 'undefined') return

  if (isDarkMode) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// 更新实际的深色模式状态
const updateDarkMode = () => {
  const currentTheme = theme.value
  let newIsDark = false

  if (currentTheme === 'dark') {
    newIsDark = true
  } else if (currentTheme === 'light') {
    newIsDark = false
  } else {
    // system
    newIsDark = getSystemTheme() === 'dark'
  }

  isDark.value = newIsDark
  applyTheme(newIsDark)
}

export const useDarkMode = () => {
  // 初始化主题
  const initTheme = () => {
    theme.value = getStoredTheme()
    updateDarkMode()

    // 监听系统主题变化
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        if (theme.value === 'system') {
          updateDarkMode()
        }
      }

      mediaQuery.addEventListener('change', handleChange)

      // 清理函数
      return () => {
        mediaQuery.removeEventListener('change', handleChange)
      }
    }
  }

  // 切换主题
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    storeTheme(newTheme)
    updateDarkMode()
  }

  // 切换深色模式（在 light 和 dark 之间切换）
  const toggleDarkMode = () => {
    const newTheme = isDark.value ? 'light' : 'dark'
    setTheme(newTheme)
  }

  // 计算属性
  const themeIcon = computed(() => {
    if (theme.value === 'light') return 'sun'
    if (theme.value === 'dark') return 'moon'
    return 'system'
  })

  const themeLabel = computed(() => {
    switch (theme.value) {
      case 'light': return '浅色模式'
      case 'dark': return '深色模式'
      case 'system': return '跟随系统'
      default: return '跟随系统'
    }
  })

  // 监听主题变化
  watch(theme, updateDarkMode, { immediate: false })

  // 组件挂载时初始化
  onMounted(initTheme)

  return {
    theme: computed(() => theme.value),
    isDark: computed(() => isDark.value),
    themeIcon,
    themeLabel,
    setTheme,
    toggleDarkMode,
    initTheme
  }
}

// 导出单例实例供全局使用
export const darkMode = {
  theme,
  isDark,
  getStoredTheme,
  storeTheme,
  getSystemTheme,
  applyTheme,
  updateDarkMode
}
