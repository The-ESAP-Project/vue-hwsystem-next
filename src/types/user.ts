import type { PaginationInfo, PaginationQuery } from './api'

// 用户管理相关类型定义

// 用户角色
export type UserRole = 'user' | 'teacher' | 'admin'

// 用户状态
export type UserStatus = 'active' | 'inactive' | 'suspended'

// 用户资料
export interface UserProfile {
  profile_name: string
  avatar_url?: string
}

// 用户信息
export interface User {
  id: number
  username: string
  email: string
  role: UserRole
  status: UserStatus
  profile: UserProfile
  last_login?: string // ISO 8601 字符串（"2024-07-16T12:34:56Z"）
  created_at: string // ISO 8601 字符串（"2024-07-16T12:34:56Z"）
  updated_at: string // ISO 8601 字符串（"2024-07-16T12:34:56Z"）
}

export interface UserListParams {
  pagination?: PaginationQuery
  role?: UserRole
  status?: UserStatus
  search?: string
}

export interface UserListResponse {
  items: User[]
  pagination: PaginationInfo
}

export interface CreateUserRequest {
  username: string
  email: string
  password: string
  role: UserRole
  profile: UserProfile
}

export interface CreateUserResponse {
  user: User
}

export interface UpdateUserRequest {
  email?: string
  password?: string
  role?: UserRole
  status?: UserStatus
  profile?: UserProfile
}
