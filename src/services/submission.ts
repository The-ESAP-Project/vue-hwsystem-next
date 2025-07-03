// 提交管理服务
import api from './api'
import type { ApiResponse } from './api'
import type {
  Submission,
  CreateSubmissionRequest,
  SubmissionListParams,
  SubmissionListResponse,
  GradingRequest,
  ExportSubmissionsRequest,
  ExportTaskResponse,
} from '@/types/homework'

export class SubmissionService {
  /**
   * 提交作业
   */
  static async createSubmission(
    homeworkId: number,
    data: CreateSubmissionRequest,
  ): Promise<Submission> {
    const formData = new FormData()

    formData.append('content', data.content)

    // 添加附件
    if (data.attachments) {
      data.attachments.forEach((file) => {
        formData.append('attachments[]', file)
      })
    }

    const response = await api.post<ApiResponse<Submission>>(
      `/v1/homeworks/${homeworkId}/submissions`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return response.data.data
  }

  /**
   * 获取作业的提交列表
   */
  static async getSubmissions(
    homeworkId: number,
    params?: SubmissionListParams,
  ): Promise<SubmissionListResponse> {
    const response = await api.get<ApiResponse<SubmissionListResponse>>(
      `/v1/homeworks/${homeworkId}/submissions`,
      { params },
    )
    return response.data.data
  }

  /**
   * 获取提交详情
   */
  static async getSubmission(submissionId: number): Promise<Submission> {
    const response = await api.get<ApiResponse<Submission>>(`/v1/submissions/${submissionId}`)
    return response.data.data
  }

  /**
   * 批改作业
   */
  static async gradeSubmission(submissionId: number, data: GradingRequest): Promise<Submission> {
    const response = await api.post<ApiResponse<Submission>>(
      `/v1/submissions/${submissionId}/feedback`,
      data,
    )
    return response.data.data
  }

  /**
   * 导出提交统计
   */
  static async exportSubmissions(
    homeworkId: number,
    data: ExportSubmissionsRequest,
  ): Promise<ExportTaskResponse> {
    const response = await api.post<ApiResponse<ExportTaskResponse>>(
      `/v1/homeworks/${homeworkId}/submissions/export`,
      data,
    )
    return response.data.data
  }

  /**
   * 获取学生的提交历史
   */
  static async getStudentSubmissions(
    params?: SubmissionListParams,
  ): Promise<SubmissionListResponse> {
    const response = await api.get<ApiResponse<SubmissionListResponse>>('/v1/submissions', {
      params,
    })
    return response.data.data
  }
}

export default SubmissionService
