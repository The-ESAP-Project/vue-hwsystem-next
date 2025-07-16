import type { User } from './user'

// 认证相关的类型定义

// 登录请求
export interface LoginRequest {
  username: string
  password: string
  remember_me?: boolean
}

// 登录响应数据
export interface LoginResponseData {
  access_token: string
  expires_in: number
  user: User
  created_at: string // ISO 8601 字符串（"2024-07-16T12:34:56Z"）
}

// 刷新令牌响应数据
export interface RefreshTokenResponseData {
  access_token: string
  expires_in: number
}

// 获取用户信息响应数据
export interface UserInfoResponseData {
  user: User
}

// Token 验证结果接口
export interface TokenVerificationResult {
  isValid: boolean
  isNetworkError: boolean
  error?: {
    code: number
    message: string
    timestamp: string
  }
}
