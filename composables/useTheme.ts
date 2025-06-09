export const useTheme = () => {
  const isDark = ref(false)

  // 初始化主题
  const initTheme = () => {
    if (import.meta.client) {
      // 从本地存储获取主题设置
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        isDark.value = savedTheme === 'dark'
      } else {
        // 检测系统偏好
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      updateTheme()
    }
  }

  // 更新主题
  const updateTheme = () => {
    if (import.meta.client) {
      const html = document.documentElement
      if (isDark.value) {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    }
  }

  // 切换主题
  const toggleTheme = () => {
    isDark.value = !isDark.value
    updateTheme()
  }

  // 设置主题
  const setTheme = (theme: 'light' | 'dark') => {
    isDark.value = theme === 'dark'
    updateTheme()
  }

  return {
    isDark: readonly(isDark),
    initTheme,
    toggleTheme,
    setTheme
  }
}
