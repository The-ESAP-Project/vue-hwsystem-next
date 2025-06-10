import axios from 'axios'

// 创建 axios 实例
export const apiClient = axios.create({
  baseURL: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:5500/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 重要：允许发送 cookies
})

// 创建用于 SSR 的 axios 实例
export const createSSRApiClient = (cookieHeader?: string) => {
  return axios.create({
    baseURL: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:5500/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(cookieHeader && { 'Cookie': cookieHeader })
    }
  })
}

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
