import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse, ApiError } from '@/types/api'

class HttpClient {
  private instance: AxiosInstance
  private baseURL: string

  constructor() {
    // 从环境变量获取 API 基础 URL，如果没有设置则使用默认值
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // 请求拦截器 - 添加认证令牌
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器 - 处理通用错误和令牌刷新
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        // 检查业务状态码
        if (response.data.code !== 0) {
          const error: ApiError = {
            code: response.data.code,
            message: response.data.message,
          }
          return Promise.reject(error)
        }
        return response
      },
      async (error) => {
        const originalRequest = error.config

        // 处理 401 未授权错误 - 尝试刷新令牌
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const refreshToken = localStorage.getItem('refresh_token')
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken)
              localStorage.setItem('access_token', response.data.access_token)

              // 重新发送原始请求
              originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`
              return this.instance(originalRequest)
            }
          } catch (refreshError) {
            // 刷新令牌失败，清除本地存储并跳转到登录页
            this.clearTokens()
            window.location.href = '/auth/login'
            return Promise.reject(refreshError)
          }
        }

        // 其他错误处理
        const apiError: ApiError = {
          code: error.response?.status || -1,
          message: error.response?.data?.message || error.message || '网络错误',
          details: error.response?.data,
        }

        return Promise.reject(apiError)
      }
    )
  }

  private async refreshToken(refreshToken: string) {
    return this.instance.post('/v1/auth/refresh', {
      refresh_token: refreshToken,
    })
  }

  private clearTokens() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  // GET 请求
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.get(url, config)
  }

  // POST 请求
  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.post(url, data, config)
  }

  // PUT 请求
  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.put(url, data, config)
  }

  // DELETE 请求
  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.delete(url, config)
  }

  // PATCH 请求
  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.patch(url, data, config)
  }

  // 获取基础 URL
  getBaseURL(): string {
    return this.baseURL
  }

  // 设置令牌
  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)
  }

  // 清除令牌
  clearAllTokens() {
    this.clearTokens()
  }
}

// 创建全局 HTTP 客户端实例
export const httpClient = new HttpClient()
export default httpClient
