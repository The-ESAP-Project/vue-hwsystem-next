// 文件管理服务
import api from './api'
import type { ApiResponse } from './api'
import type { FileUploadRequest, FileUploadResponse, FileDownloadResponse } from '@/types/file'

export class FileService {
  /**
   * 上传文件
   */
  static async uploadFile(data: FileUploadRequest): Promise<FileUploadResponse> {
    const formData = new FormData()

    formData.append('file', data.file)

    const response = await api.post<ApiResponse<FileUploadResponse>>('/v1/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data
  }

  /**
   * 下载文件
   */
  static async downloadFile(fileId: string): Promise<FileDownloadResponse> {
    const response = await api.get(`/v1/files/download/${fileId}`, {
      responseType: 'blob',
    })

    // 从响应头中获取文件名
    const contentDisposition = response.headers['content-disposition']
    let filename: string | undefined

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/)
      if (filenameMatch) {
        filename = filenameMatch[1]
      }
    }

    return {
      blob: response.data,
      filename,
    }
  }

  /**
   * 获取文件下载链接
   */
  static getDownloadUrl(fileId: string): string {
    return `/v1/files/download/${fileId}`
  }
}

export default FileService
