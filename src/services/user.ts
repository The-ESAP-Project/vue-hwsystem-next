// 用户管理服务
import api from './api'
import type { ApiResponse } from './api'
import type {
  User,
  UserListParams,
  UserListResponse,
  CreateUserRequest,
  UpdateUserRequest
} from '@/types/user'

export class UserService {
  /**
   * 获取用户列表
   */
  static async getUsers(params?: UserListParams): Promise<UserListResponse> {
    const response = await api.get<ApiResponse<UserListResponse>>('/users', {
      params
    })
    return response.data.data
  }

  /**
   * 创建用户
   */
  static async createUser(data: CreateUserRequest): Promise<User> {
    const response = await api.post<ApiResponse<User>>('/users', data)
    return response.data.data
  }

  /**
   * 获取用户详情
   */
  static async getUser(userId: number): Promise<User> {
    const response = await api.get<ApiResponse<User>>(`/users/${userId}`)
    return response.data.data
  }

  /**
   * 更新用户信息
   */
  static async updateUser(userId: number, data: UpdateUserRequest): Promise<User> {
    const response = await api.put<ApiResponse<User>>(`/users/${userId}`, data)
    return response.data.data
  }

  /**
   * 删除用户
   */
  static async deleteUser(userId: number): Promise<void> {
    await api.delete(`/users/${userId}`)
  }
}

export default UserService
