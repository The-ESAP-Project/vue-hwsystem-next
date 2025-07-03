// 服务统一入口文件
export { default as AuthService } from './auth'
export { default as HomeworkService } from './homework'
export { default as SubmissionService } from './submission'
export { default as UserService } from './user'
export { default as FileService } from './file'
export { default as SystemService } from './system'

// 导出 HTTP 客户端
export { default as api } from './api'

// 导出类型
export type { ApiResponse, ApiError } from './api'
