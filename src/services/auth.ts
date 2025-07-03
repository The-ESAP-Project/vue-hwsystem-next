// 认证服务
import api from './api'
import type { ApiResponse } from './api'
import type {
  LoginRequest,
  LoginResponseData,
  RefreshTokenRequest,
  RefreshTokenResponseData,
  User,
} from '@/types/auth'

export class AuthService {
  /**
   * 用户登录
   */
  static async login(credentials: LoginRequest): Promise<LoginResponseData> {
    const response = await api.post<ApiResponse<LoginResponseData>>('/auth/login', credentials)
    return response.data.data
  }

  /**
   * 刷新访问令牌
   */
  static async refreshToken(refreshData: RefreshTokenRequest): Promise<RefreshTokenResponseData> {
    const response = await api.post<ApiResponse<RefreshTokenResponseData>>(
      '/auth/refresh',
      refreshData,
    )
    return response.data.data
  }

  /**
   * 获取当前用户信息
   */
  static async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/me')
    return response.data.data
  }

  /**
   * 验证令牌有效性
   */
  static async verifyToken(): Promise<boolean> {
    try {
      await api.get('/auth/verify')
      return true
    } catch {
      return false
    }
  }
}

export default AuthService
