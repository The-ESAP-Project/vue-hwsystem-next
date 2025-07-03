import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import AuthService from '@/services/auth'
import type { User, LoginRequest } from '@/types/auth'

export const useUserStore = defineStore('user', () => {
  // 状态
  const currentUser = ref<User | null>(null)
  const isLoading = ref(false)

  // 计算属性
  const isAuthenticated = computed(() => currentUser.value !== null)

  const roleText = computed(() => {
    if (!currentUser.value) return ''
    switch (currentUser.value.role) {
      case 'monitor':
        return '课代表'
      case 'teacher':
        return '教师'
      case 'student':
        return '学生'
      default:
        return ''
    }
  })

  const userAvatar = computed(() => {
    if (!currentUser.value) return '用'
    switch (currentUser.value.role) {
      case 'monitor':
        return '管'
      case 'teacher':
        return '师'
      case 'student':
        return '生'
      default:
        return '用'
    }
  })

  const userAvatarColor = computed(() => {
    if (!currentUser.value) return 'bg-gradient-to-r from-gray-500 to-gray-600'
    switch (currentUser.value.role) {
      case 'monitor':
        return 'bg-gradient-to-r from-purple-500 to-pink-500'
      case 'teacher':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500'
      case 'student':
        return 'bg-gradient-to-r from-green-500 to-emerald-500'
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600'
    }
  })

  const dashboardPath = computed(() => {
    if (!currentUser.value) return '/'
    switch (currentUser.value.role) {
      case 'monitor':
        return '/monitor/dashboard'
      case 'teacher':
        return '/teacher/dashboard'
      case 'student':
        return '/student/dashboard'
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
      localStorage.setItem('refreshToken', loginData.refresh_token)
      localStorage.setItem('tokenType', loginData.token_type)
      localStorage.setItem('tokenExpiresIn', loginData.expires_in.toString())

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
      localStorage.removeItem('currentUser')
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('tokenType')
      localStorage.removeItem('tokenExpiresIn')

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
          // 验证 token 是否有效
          const isValid = await AuthService.verifyToken()
          if (isValid) {
            currentUser.value = userData
            return true
          } else {
            // Token 无效，清除存储
            localStorage.removeItem('currentUser')
            localStorage.removeItem('authToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('tokenType')
            localStorage.removeItem('tokenExpiresIn')
          }
        }
      } catch (error) {
        console.error('Failed to parse stored user data:', error)
        // 清除无效的存储数据
        localStorage.removeItem('currentUser')
        localStorage.removeItem('authToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('tokenType')
        localStorage.removeItem('tokenExpiresIn')
      }
    }

    return false
  }

  const initAuth = async () => {
    // 初始化时检查认证状态
    await checkAuthStatus()
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
      // 如果获取用户信息失败，可能是 token 过期，执行登出
      await logout()
      throw error
    }
  }

  return {
    // 状态
    currentUser,
    isLoading,
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
  }
})
