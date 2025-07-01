// 文件管理相关类型定义

export interface UploadFileRequest {
  file: File
  type: 'homework_attachment' | 'submission_attachment' | 'avatar'
  related_id?: number
}

export interface UploadFileResponse {
  id: string
  filename: string
  original_name: string
  size: number
  content_type: string
  download_url: string
  uploaded_at: string
}

export interface FileDownloadResponse {
  // 文件流，直接下载
  blob: Blob
  filename?: string
}
