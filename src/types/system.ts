// 系统管理相关类型定义

export interface SystemSettings {
  system_name: string
  max_file_size: number
  allowed_file_types: string[]
  environment: string
  log_level: string
}

// 以下的实现暂未完成
export interface UpdateSystemSettingsRequest {
  system_name?: string
  max_file_size?: number
  allowed_file_types?: string[]
  environment?: string
  log_level?: string
}

export interface UpdateSystemSettingsResponse {
  updated_settings: string[]
  updated_at: string // ISO 8601
}

export interface SystemLog {
  id: string
  level: 'info' | 'warn' | 'error'
  message: string
  module: 'auth' | 'homework' | 'submission' | 'user' | 'file' | 'system'
  user_id?: number
  ip_address?: string
  user_agent?: string
  details?: Record<string, unknown>
  created_at: string // ISO 8601
}

export interface SystemLogParams {
  page?: number
  size?: number
  level?: 'info' | 'warn' | 'error'
  start_date?: string
  end_date?: string
  module?: 'auth' | 'homework' | 'submission' | 'user' | 'file' | 'system'
}

export interface SystemLogResponse {
  items: SystemLog[]
  pagination: {
    page: number
    size: number
    total: number
    pages: number
  }
}
