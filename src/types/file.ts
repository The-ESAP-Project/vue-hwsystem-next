// 文件管理相关类型定义

export interface FileUploadRequest {
  file: File
}

export interface FileUploadResponse {
  submission_token: string
  file_name: string
  size: number
  content_type: string
  uploaded_at: string // ISO 8601 字符串（"2024-07-16T12:34:56Z"）
}

export interface FileDownloadResponse {
  // 文件流，直接下载
  blob: Blob
  filename?: string
}
