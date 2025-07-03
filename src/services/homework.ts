// 作业管理服务
import api from './api'
import type { ApiResponse } from './api'
import type {
  Homework,
  CreateHomeworkRequest,
  UpdateHomeworkRequest,
  HomeworkListParams,
  HomeworkListResponse,
} from '@/types/homework'

export class HomeworkService {
  /**
   * 创建作业
   */
  static async createHomework(data: CreateHomeworkRequest): Promise<Homework> {
    const formData = new FormData()

    // 添加基本字段
    formData.append('title', data.title)
    formData.append('content', data.content)
    formData.append('deadline', data.deadline)

    if (data.description) {
      formData.append('description', data.description)
    }
    if (data.max_score) {
      formData.append('max_score', data.max_score.toString())
    }
    if (data.allow_late_submission !== undefined) {
      formData.append('allow_late_submission', data.allow_late_submission.toString())
    }

    // 添加附件
    if (data.attachments) {
      data.attachments.forEach((file) => {
        formData.append('attachments[]', file)
      })
    }

    const response = await api.post<ApiResponse<Homework>>('/v1/homeworks', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data
  }

  /**
   * 获取作业列表
   */
  static async getHomeworks(params?: HomeworkListParams): Promise<HomeworkListResponse> {
    const response = await api.get<ApiResponse<HomeworkListResponse>>('/v1/homeworks', {
      params,
    })
    return response.data.data
  }

  /**
   * 获取作业详情
   */
  static async getHomework(homeworkId: number): Promise<Homework> {
    const response = await api.get<ApiResponse<Homework>>(`/v1/homeworks/${homeworkId}`)
    return response.data.data
  }

  /**
   * 更新作业
   */
  static async updateHomework(homeworkId: number, data: UpdateHomeworkRequest): Promise<Homework> {
    const response = await api.put<ApiResponse<Homework>>(`/v1/homeworks/${homeworkId}`, data)
    return response.data.data
  }

  /**
   * 删除作业
   */
  static async deleteHomework(homeworkId: number): Promise<void> {
    await api.delete(`/v1/homeworks/${homeworkId}`)
  }
}

export default HomeworkService
