// 认证相关的类型定义

// 用户角色
export type UserRole = 'student' | 'teacher' | 'monitor'

// 用户状态
export type UserStatus = 'active' | 'inactive' | 'suspended'

// 用户资料
export interface UserProfile {
  name: string
  student_id?: string
  class?: string
  avatar?: string
}

// 用户信息
export interface User {
  id: number
  username: string
  role: UserRole
  email: string
  status: UserStatus
  profile: UserProfile
  created_at: string
  last_login: string
}

// 登录请求
export interface LoginRequest {
  username: string
  password: string
}

// 登录响应数据
export interface LoginResponseData {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: User
}

// 刷新令牌请求
export interface RefreshTokenRequest {
  refresh_token: string
}

// 刷新令牌响应数据
export interface RefreshTokenResponseData {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}
