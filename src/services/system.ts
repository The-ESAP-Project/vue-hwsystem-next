// 系统管理服务
import api from './api'
import type { ApiResponse } from './api'
import type {
  SystemSettings,
  UpdateSystemSettingsRequest,
  UpdateSystemSettingsResponse,
  SystemLogParams,
  SystemLogResponse
} from '@/types/system'

export class SystemService {
  /**
   * 获取系统设置
   */
  static async getSettings(): Promise<SystemSettings> {
    const response = await api.get<ApiResponse<SystemSettings>>('/system/settings')
    return response.data.data
  }

  /**
   * 更新系统设置
   */
  static async updateSettings(data: UpdateSystemSettingsRequest): Promise<UpdateSystemSettingsResponse> {
    const response = await api.put<ApiResponse<UpdateSystemSettingsResponse>>('/system/settings', data)
    return response.data.data
  }

  /**
   * 获取系统日志
   */
  static async getLogs(params?: SystemLogParams): Promise<SystemLogResponse> {
    const response = await api.get<ApiResponse<SystemLogResponse>>('/system/logs', {
      params
    })
    return response.data.data
  }
}

export default SystemService
