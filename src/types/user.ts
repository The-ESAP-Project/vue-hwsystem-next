// 用户管理相关类型定义
import type { User } from '@/types/auth'

export interface UserListParams {
  page?: number
  size?: number
  role?: 'student' | 'teacher' | 'admin'
  status?: 'active' | 'inactive' | 'suspended'
  search?: string
}

export interface UserListResponse {
  items: User[]
  pagination: {
    page: number
    size: number
    total: number
    pages: number
  }
}

export interface CreateUserRequest {
  username: string
  email: string
  password: string
  role: 'student' | 'teacher' | 'admin'
  profile: {
    name: string
    student_id?: string
    class?: string
  }
}

export interface UpdateUserRequest {
  email?: string
  role?: 'student' | 'teacher' | 'admin'
  status?: 'active' | 'inactive' | 'suspended'
  profile?: {
    name?: string
    student_id?: string
    class?: string
  }
}

// 重新导出 User 类型
export type { User }
