// 文件管理服务
import api from './api'
import type { ApiResponse } from './api'
import type {
  UploadFileRequest,
  UploadFileResponse,
  FileDownloadResponse
} from '@/types/file'

export class FileService {
  /**
   * 上传文件
   */
  static async uploadFile(data: UploadFileRequest): Promise<UploadFileResponse> {
    const formData = new FormData()

    formData.append('file', data.file)
    formData.append('type', data.type)

    if (data.related_id) {
      formData.append('related_id', data.related_id.toString())
    }

    const response = await api.post<ApiResponse<UploadFileResponse>>(
      '/files/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data.data
  }

  /**
   * 下载文件
   */
  static async downloadFile(fileId: string): Promise<FileDownloadResponse> {
    const response = await api.get(`/files/download/${fileId}`, {
      responseType: 'blob'
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
      filename
    }
  }

  /**
   * 获取文件下载链接
   */
  static getDownloadUrl(fileId: string): string {
    return `/api/v1/files/download/${fileId}`
  }
}

export default FileService
