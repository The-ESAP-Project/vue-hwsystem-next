import { apiClient } from '~/utils/api'

export interface User {
  id: number
  username: string
  email?: string
  name: string
  role: 'student' | 'teacher' | 'monitor'
  avatar?: string
}

export interface LoginRequest {
  username: string
  password: string
  rememberMe?: boolean
}

export interface RegisterRequest {
  username: string
  email: string
  name: string
  role: 'student' | 'teacher'
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  user: User
  message: string
}

export const useAuth = () => {
  // 使用 useState 保持在各组件间共享的响应式状态
  const user = useState<User | null>('auth-user-state', () => null)
  const loading = useState<boolean>('auth-loading-state', () => false)
  const error = useState<string | null>('auth-error-state', () => null)

  // 初始化认证状态
  const initAuth = async () => {
    if (import.meta.client) {
      try {
        // 先尝试从 localStorage 获取用户信息（如果存在）
        const savedUser = localStorage.getItem('auth-user')
        if (savedUser) {
          user.value = JSON.parse(savedUser)
          console.log('Loaded user from localStorage:', user.value)
        }
        
        // 然后验证 cookie 中的 token 是否有效
        await validateToken()
      } catch (err) {
        console.warn('Auth initialization failed:', err)
        clearAuth()
      }
    }
  }

  // 清除认证信息
  const clearAuth = () => {
    user.value = null
    error.value = null
    
    if (import.meta.client) {
      localStorage.removeItem('auth-user')
      localStorage.removeItem('remembered-username')
    }
  }

  // 保存认证信息 - 确保立即同步状态
  const saveAuth = (authData: AuthResponse, rememberMe: boolean = false) => {
    user.value = authData.user
    error.value = null
    
    console.log('Saving auth data:', authData.user)
    
    if (import.meta.client) {
      localStorage.setItem('auth-user', JSON.stringify(authData.user))
      
      if (rememberMe) {
        localStorage.setItem('remembered-username', authData.user.username)
      }
    }
    
    // 强制触发响应式更新
    nextTick(() => {
      console.log('Auth state after save - user:', user.value, 'isAuthenticated:', !!user.value)
    })
  }

  // 登录 - 确保状态同步后再返回
  const login = async (credentials: LoginRequest) => {
    loading.value = true
    error.value = null
    
    try {
      console.log('Attempting login with:', credentials.username)
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
      console.log('Login response:', response)
      
      // 保存认证信息
      saveAuth(response, credentials.rememberMe)
      
      // 等待状态更新
      await nextTick()
      
      // 验证状态是否正确设置
      console.log('Login completed - user:', user.value, 'isAuthenticated:', !!user.value)
      
      return response
    } catch (err: any) {
      console.error('Login error:', err)
      error.value = err.response?.data?.message || err.message || '登录失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 注册
  const register = async (userData: RegisterRequest) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', userData)
      
      saveAuth(response)
      
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || '注册失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 退出登录
  const logout = async () => {
    loading.value = true
    error.value = null
    
    try {
      // 调用后端退出接口（会清除 httpOnly cookies）
      await apiClient.post('/auth/logout')
    } catch (err: any) {
      // 即使后端退出失败，也要清除本地状态
      console.warn('Logout API failed:', err.message)
    } finally {
      clearAuth()
      loading.value = false
      
      // 跳转到登录页面
      await navigateTo('/auth/login')
    }
  }

  // 验证 token 有效性（通过 cookie）- 改进错误处理
  const validateToken = async () => {
    try {
      const response = await apiClient.get<{ user: User }>('/auth/me')
      user.value = response.user
      
      // 同步更新 localStorage 中的用户信息
      if (import.meta.client) {
        localStorage.setItem('auth-user', JSON.stringify(response.user))
      }
      
      console.log('Token validation successful:', response.user)
      return true
    } catch (err: any) {
      // 只有在真正的认证错误时才清除状态
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.warn('Token validation failed - unauthorized:', err)
        clearAuth()
      } else {
        console.warn('Token validation failed - network/other error:', err)
        // 网络错误时不清除本地状态
      }
      return false
    }
  }

  // 刷新 token（通过 cookie）
  const refreshToken = async () => {
    try {
      await apiClient.post('/auth/refresh')
      // 刷新成功后重新验证用户信息
      return await validateToken()
    } catch (err: any) {
      clearAuth()
      throw err
    }
  }

  // 获取记住的用户名
  const getRememberedUsername = () => {
    if (import.meta.client) {
      return localStorage.getItem('remembered-username') || ''
    }
    return ''
  }

  // 根据角色获取重定向路径
  const getRoleRedirectPath = (role: string) => {
    switch (role) {
      case 'monitor':
        return '/monitor/dashboard'
      case 'teacher':
        return '/teacher/dashboard'
      case 'student':
        return '/student/dashboard'
      default:
        return '/'
    }
  }

  // 检查是否已登录 - 添加更多调试信息
  const isAuthenticated = computed(() => {
    const authenticated = !!user.value
    console.log('Is authenticated check:', {
      authenticated,
      user: user.value,
      hasUser: !!user.value,
      userRole: user.value?.role
    })
    return authenticated
  })

  // 检查用户角色
  const hasRole = (role: string) => user.value?.role === role

  // 检查是否有权限
  const hasPermission = (permission: string) => {
    // 根据角色和权限进行判断
    const rolePermissions: Record<string, string[]> = {
      monitor: ['view_all', 'manage_assignments', 'view_class_progress'],
      teacher: ['create_assignments', 'manage_assignments', 'view_submissions'],
      student: ['view_assignments', 'submit_assignments']
    }
    
    return rolePermissions[user.value?.role || '']?.includes(permission) || false
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    isAuthenticated,
    initAuth,
    login,
    register,
    logout,
    validateToken,
    refreshToken,
    getRememberedUsername,
    getRoleRedirectPath,
    hasRole,
    hasPermission,
    clearAuth
  }
}
