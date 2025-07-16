// API 响应基础结构
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
  timestamp: string
}

// API 错误响应结构
export interface ApiErrorResponse<T = unknown> {
  code: number
  message: string
  data?: T
  timestamp: string
}

// API 分页请求参数
export interface PaginationQuery {
  page?: number
  size?: number
}

// API 分页响应结构
export interface PaginationInfo {
  page: number
  size: number
  total: number
  pages: number
}
