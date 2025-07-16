// 认证服务
import api from './api'
import type { ApiResponse, ApiError } from './api'
import type {
  LoginRequest,
  LoginResponseData,
  RefreshTokenResponseData,
  TokenVerificationResult,
} from '@/types/auth'
import type { User } from '@/types/user'

export class AuthService {
  /**
   * 用户登录
   */
  static async login(credentials: LoginRequest): Promise<LoginResponseData> {
    const response = await api.post<ApiResponse<LoginResponseData>>('/v1/auth/login', credentials)
    return response.data.data
  }

  /**
   * 刷新访问令牌
   */
  static async refreshToken(): Promise<RefreshTokenResponseData> {
    const response = await api.get<ApiResponse<RefreshTokenResponseData>>('/v1/auth/refresh')
    return response.data.data
  }

  /**
   * 获取当前用户信息
   */
  static async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/v1/auth/me')
    return response.data.data
  }

  /**
   * 验证令牌有效性
   */
  static async verifyToken(): Promise<TokenVerificationResult> {
    try {
      await api.get<ApiResponse>('/v1/auth/verify-token')
      return {
        isValid: true,
        isNetworkError: false,
      }
    } catch (error) {
      const apiError = error as ApiError

      // 判断是否为网络错误
      const isNetworkError =
        apiError.code === -1 ||
        apiError.message?.includes('网络') ||
        apiError.message?.includes('timeout') ||
        apiError.message?.includes('Network') ||
        apiError.message?.toLowerCase().includes('fetch')

      return {
        isValid: false,
        isNetworkError,
        error: {
          code: apiError.code,
          message: apiError.message,
          timestamp: apiError.timestamp,
        },
      }
    }
  }
}

export default AuthService
