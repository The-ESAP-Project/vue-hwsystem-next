// API 响应基础结构
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
  timestamp: string
}

// 用户相关类型
export interface UserProfile {
  name: string
  student_id?: string
  class?: string
}

export interface User {
  id: number
  username: string
  role: 'student' | 'teacher' | 'monitor'
  email: string
  status: 'active' | 'inactive'
  profile: UserProfile
  created_at: string
  last_login: string
}

// 登录相关类型
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: 'Bearer'
  expires_in: number
  user: User
}

// 刷新令牌类型
export interface RefreshTokenRequest {
  refresh_token: string
}

export interface RefreshTokenResponse {
  access_token: string
  token_type: 'Bearer'
  expires_in: number
}

// 错误响应类型
export interface ApiError {
  code: number
  message: string
  details?: unknown
}
