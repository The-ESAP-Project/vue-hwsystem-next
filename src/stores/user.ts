import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import AuthService from '@/services/auth'
import { useNotification } from '@/composables/useNotification'
import type { LoginRequest } from '@/types/auth'
import type { User } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  // 通知系统
  const { success, info, error } = useNotification()

  // 状态
  const currentUser = ref<User | null>(null)
  const isLoading = ref(false)
  const isInitialized = ref(false) // 添加初始化状态标记

  // 计算属性
  const isAuthenticated = computed(() => currentUser.value !== null)

  const roleText = computed(() => {
    if (!currentUser.value) return ''
    switch (currentUser.value.role) {
      case 'admin':
        return '管理员'
      case 'teacher':
        return '教师'
      case 'user':
        return '用户'
      default:
        return ''
    }
  })

  const userAvatar = computed(() => {
    if (!currentUser.value) return '用'
    switch (currentUser.value.role) {
      case 'admin':
        return '管'
      case 'teacher':
        return '师'
      case 'user':
        return '用'
      default:
        return '用'
    }
  })

  const userAvatarColor = computed(() => {
    if (!currentUser.value) return 'bg-gradient-to-r from-gray-500 to-gray-600'
    switch (currentUser.value.role) {
      case 'admin':
        return 'bg-gradient-to-r from-red-500 to-orange-500'
      case 'teacher':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500'
      case 'user':
        return 'bg-gradient-to-r from-green-500 to-emerald-500'
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600'
    }
  })

  const dashboardPath = computed(() => {
    if (!currentUser.value) return '/'
    switch (currentUser.value.role) {
      case 'admin':
        return '/admin/dashboard'
      case 'teacher':
        return '/teacher/dashboard'
      case 'user':
        return '/user/dashboard'
      default:
        return '/'
    }
  })

  // 方法
  const login = async (credentials: LoginRequest) => {
    isLoading.value = true

    try {
      const loginData = await AuthService.login(credentials)

      // 设置用户信息
      currentUser.value = loginData.user

      // 保存到本地存储
      localStorage.setItem('currentUser', JSON.stringify(loginData.user))
      localStorage.setItem('authToken', loginData.access_token)
      localStorage.setItem('tokenExpiresIn', loginData.expires_in.toString())

      // 显示登录成功通知
      const userName = loginData.user.profile?.profile_name || loginData.user.username
      success('登录成功', `欢迎回来，${userName}！`)

      return loginData.user
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true

    // 保存当前用户名用于通知
    const userName =
      currentUser.value?.profile?.profile_name || currentUser.value?.username || '用户'

    try {
      // JWT 模式下主要由客户端处理退出
      // 可以选择调用后端接口通知服务器（如果有的话）
      console.log('User logging out...')
    } catch (error) {
      console.error('Logout process error:', error)
    } finally {
      // 清除本地状态
      currentUser.value = null

      // 清除本地存储
      await clearAuthData()

      // 显示登出成功通知
      info('已安全退出', `再见，${userName}！期待您的再次光临。`)

      isLoading.value = false
    }
  }

  const checkAuthStatus = async () => {
    // 检查本地存储中是否有用户信息
    const storedUser = localStorage.getItem('currentUser')
    const storedToken = localStorage.getItem('authToken')

    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser)
        // 验证数据完整性
        if (userData.id && userData.username && userData.role) {
          // 先设置用户状态，这样即使 token 验证失败也能显示用户信息
          currentUser.value = userData

          // 异步验证 token 是否有效
          const verificationResult = await AuthService.verifyToken()

          if (!verificationResult.isValid) {
            if (verificationResult.isNetworkError) {
              console.log('检测到网络错误，保持离线状态，不清除用户信息')
              error('网络错误，无法验证 token，有可能是网络问题或服务器不可用')
            } else {
              // 真正的认证失败（如 token 过期、无效等）
              console.warn('Token 验证失败，清除用户状态:', verificationResult.error?.message)
              await clearAuthData()
            }
          }

          return currentUser.value !== null
        }
      } catch (error) {
        console.error('Failed to parse stored user data:', error)
        // 清除无效的存储数据
        await clearAuthData()
      }
    }

    return false
  }

  // 清除认证数据的辅助函数
  const clearAuthData = async () => {
    currentUser.value = null
    localStorage.removeItem('currentUser')
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('tokenExpiresIn')
  }

  // 检测是否为网络错误的辅助函数
  const isNetworkError = (error: unknown): boolean => {
    if (!error || typeof error !== 'object') return false

    const errorObj = error as { code?: number; message?: string }
    return Boolean(
      errorObj.code === -1 || // API 定义的网络错误
        errorObj.message?.includes('网络') ||
        errorObj.message?.includes('timeout') ||
        errorObj.message?.includes('Network') ||
        errorObj.message?.toLowerCase().includes('fetch'),
    )
  }

  const initAuth = async () => {
    // 如果已经初始化过，直接返回
    if (isInitialized.value) return

    isInitialized.value = true

    try {
      isLoading.value = true
      // 初始化时检查认证状态
      await checkAuthStatus()

      // 监听来自 API 拦截器的登出事件
      window.addEventListener('auth:logout', handleAuthLogout)
    } finally {
      isLoading.value = false
    }
  }

  // 处理来自 API 拦截器的登出事件
  const handleAuthLogout = async () => {
    currentUser.value = null
    await clearAuthData()
  }

  // 清理函数，用于移除事件监听器
  const cleanup = () => {
    window.removeEventListener('auth:logout', handleAuthLogout)
  }

  // 刷新用户信息（从服务器获取最新信息）
  const refreshUserInfo = async () => {
    if (!isAuthenticated.value) return

    try {
      const user = await AuthService.getCurrentUser()
      currentUser.value = user
      localStorage.setItem('currentUser', JSON.stringify(user))
      return user
    } catch (error) {
      console.error('Failed to refresh user info:', error)

      if (isNetworkError(error)) {
        console.log('网络错误，不执行登出操作')
        throw error
      } else {
        // 非网络错误（如 token 过期、认证失败等）才执行登出
        console.warn('认证相关错误，执行登出操作')
        await logout()
        throw error
      }
    }
  }

  return {
    // 状态
    currentUser,
    isLoading,
    isInitialized,
    // 计算属性
    isAuthenticated,
    roleText,
    userAvatar,
    userAvatarColor,
    dashboardPath,
    // 方法
    login,
    logout,
    checkAuthStatus,
    initAuth,
    refreshUserInfo,
    clearAuthData,
    handleAuthLogout,
    cleanup,
    isNetworkError,
  }
})
