// API 基础配置和请求拦截器
import axios from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

// API 响应基础接口
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
  timestamp: string
}

// 错误响应接口
export interface ApiError {
  code: number
  message: string
  timestamp: string
}

// 创建 axios 实例
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加认证 token
    const token = localStorage.getItem('authToken')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // 检查业务状态码
    if (response.data.code === 0) {
      return response
    } else {
      // 业务错误
      return Promise.reject({
        code: response.data.code,
        message: response.data.message,
        timestamp: response.data.timestamp,
      } as ApiError)
    }
  },
  (error) => {
    // HTTP 错误处理
    if (error.response) {
      const { status, data } = error.response

      // 处理特定的 HTTP 状态码
      switch (status) {
        case 401:
          // 未授权，清除本地存储的认证信息
          localStorage.removeItem('authToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('currentUser')
          // 可以在这里触发跳转到登录页
          window.location.href = '/auth/login'
          break
        case 403:
          console.error('权限不足')
          break
        case 404:
          console.error('请求的资源不存在')
          break
        case 500:
          console.error('服务器内部错误')
          break
        default:
          console.error(`请求失败: ${status}`)
      }

      return Promise.reject({
        code: status,
        message: data?.message || `HTTP Error: ${status}`,
        timestamp: new Date().toISOString(),
      } as ApiError)
    } else if (error.request) {
      // 网络错误
      return Promise.reject({
        code: -1,
        message: '网络连接失败，请检查网络设置',
        timestamp: new Date().toISOString(),
      } as ApiError)
    } else {
      // 其他错误
      return Promise.reject({
        code: -1,
        message: error.message || '未知错误',
        timestamp: new Date().toISOString(),
      } as ApiError)
    }
  }
)

export default api
