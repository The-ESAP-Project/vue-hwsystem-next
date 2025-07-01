// 系统管理相关类型定义

export interface SystemSettings {
  max_file_size: number
  allowed_file_types: string[]
  max_attachments_per_submission: number
  late_submission_penalty: number
  auto_grade_enabled: boolean
  notification_enabled: boolean
  system_name: string
  maintenance_mode: boolean
}

export interface UpdateSystemSettingsRequest {
  max_file_size?: number
  allowed_file_types?: string[]
  max_attachments_per_submission?: number
  late_submission_penalty?: number
  auto_grade_enabled?: boolean
  notification_enabled?: boolean
  system_name?: string
  maintenance_mode?: boolean
}

export interface UpdateSystemSettingsResponse {
  updated_settings: string[]
  updated_at: string
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
  created_at: string
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
