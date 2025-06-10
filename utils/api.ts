import axios from 'axios'

// 创建 axios 实例
export const apiClient = axios.create({
  baseURL: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 重要：允许发送 cookies
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 不再手动添加 Authorization header，依赖 HttpOnly cookies
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config
    
    // 如果是 401 错误且不是登录/注册请求，尝试刷新 token
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/')) {
      originalRequest._retry = true
      
      try {
        // 尝试刷新 token（通过 cookie）
        await apiClient.post('/auth/refresh')
        
        // 重新发送原请求
        return apiClient(originalRequest)
      } catch (refreshError) {
        // 刷新失败，跳转登录
        if (import.meta.client) {
          // 清除用户数据
          localStorage.removeItem('auth-user')
          window.location.href = '/auth/login'
        }
        return Promise.reject(refreshError)
      }
    }
    
    // 统一错误处理
    const errorMessage = error.response?.data?.message || error.message || '请求失败'
    console.error('API Error:', errorMessage)
    return Promise.reject(error)
  }
)

// Mock API 响应（用于开发环境）
export const mockApiResponses = {
  // 登录 Mock
  '/auth/login': (data: any) => {
    const mockUsers = [
      { username: 'monitor', password: '123456', role: 'monitor', name: '课代表', email: 'monitor@example.com' },
      { username: 'teacher', password: '123456', role: 'teacher', name: '张老师', email: 'teacher@example.com' },
      { username: 'student', password: '123456', role: 'student', name: '小明同学', email: 'student@example.com' }
    ]
    
    const user = mockUsers.find(u => u.username === data.username && u.password === data.password)
    if (!user) {
      throw new Error('用户名或密码错误')
    }
    
    // 模拟设置 httpOnly cookie
    if (import.meta.client) {
      // 在实际环境中，这些 cookie 会由后端设置
      // 这里只是模拟存储用户信息到 localStorage
      const userData = {
        id: Date.now(),
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role
      }
      localStorage.setItem('auth-user', JSON.stringify(userData))
      
      if (data.rememberMe) {
        localStorage.setItem('remembered-username', user.username)
      }
    }
    
    return {
      user: {
        id: Date.now(),
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role
      },
      message: '登录成功'
    }
  },
  
  // 注册 Mock
  '/auth/register': (data: any) => {
    // 模拟检查用户名是否已存在
    const existingUsers = ['admin', 'monitor', 'teacher', 'student']
    if (existingUsers.includes(data.username)) {
      throw new Error('用户名已存在')
    }
    
    const userData = {
      id: Date.now(),
      username: data.username,
      email: data.email,
      name: data.name,
      role: data.role
    }
    
    // 模拟设置 cookie 和用户数据
    if (import.meta.client) {
      localStorage.setItem('auth-user', JSON.stringify(userData))
    }
    
    return {
      user: userData,
      message: '注册成功'
    }
  },
  
  // 退出登录 Mock
  '/auth/logout': () => {
    // 模拟清除 cookie
    if (import.meta.client) {
      localStorage.removeItem('auth-user')
      localStorage.removeItem('remembered-username')
    }
    return { message: '退出成功' }
  },
  
  // 验证用户 Mock
  '/auth/me': () => {
    // 从 localStorage 获取用户信息（模拟从 cookie 验证）
    if (import.meta.client) {
      const userData = localStorage.getItem('auth-user')
      if (userData) {
        return { user: JSON.parse(userData) }
      }
    }
    throw new Error('未登录')
  },
  
  // 刷新 token Mock
  '/auth/refresh': () => {
    // 模拟刷新 token（实际中会更新 httpOnly cookie）
    if (import.meta.client) {
      const userData = localStorage.getItem('auth-user')
      if (userData) {
        return { message: '刷新成功' }
      }
    }
    throw new Error('刷新失败')
  }
}

// 移除开发环境的 Mock 数据拦截器，因为现在使用真实的后端
