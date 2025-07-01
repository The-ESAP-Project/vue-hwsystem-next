// 作业相关类型定义

export interface Homework {
  id: number
  title: string
  description?: string
  content: string
  deadline: string
  max_score: number
  allow_late_submission: boolean
  submission_count: number
  status: 'draft' | 'published' | 'closed'
  created_by: {
    id: number
    username: string
    name: string
  }
  created_at: string
  updated_at: string
  attachments?: FileAttachment[]
}

export interface FileAttachment {
  id: string
  filename: string
  original_name?: string
  size: number
  content_type?: string
  download_url: string
  uploaded_at?: string
}

export interface CreateHomeworkRequest {
  title: string
  description?: string
  content: string
  deadline: string
  max_score?: number
  allow_late_submission?: boolean
  attachments?: File[]
}

export interface UpdateHomeworkRequest {
  title?: string
  description?: string
  content?: string
  deadline?: string
  max_score?: number
  allow_late_submission?: boolean
}

export interface HomeworkListParams {
  page?: number
  size?: number
  status?: 'draft' | 'published' | 'closed'
  search?: string
  order_by?: 'created_at' | 'deadline' | 'title'
  order?: 'asc' | 'desc'
}

export interface HomeworkListResponse {
  items: Homework[]
  pagination: {
    page: number
    size: number
    total: number
    pages: number
  }
}

// 提交相关类型
export interface Submission {
  id: number
  homework_id: number
  student_id: number
  content: string
  attachments: FileAttachment[]
  submitted_at: string
  status: 'submitted' | 'graded' | 'late'
  score?: number
  is_late: boolean
  has_feedback?: boolean
  feedback?: {
    content: string
    graded_by: {
      id: number
      username: string
      name: string
    }
    graded_at: string
  }
  student?: {
    id: number
    username: string
    name: string
    student_id: string
  }
  homework?: {
    id: number
    title: string
    max_score: number
  }
}

export interface CreateSubmissionRequest {
  content: string
  attachments?: File[]
}

export interface SubmissionListParams {
  page?: number
  size?: number
  status?: 'submitted' | 'graded' | 'late'
  order_by?: 'submitted_at' | 'student_name' | 'score'
  order?: 'asc' | 'desc'
}

export interface SubmissionListResponse {
  items: Submission[]
  pagination: {
    page: number
    size: number
    total: number
    pages: number
  }
  statistics: {
    total_submissions: number
    graded_count: number
    average_score: number
    late_submissions: number
  }
}

export interface GradingRequest {
  score: number
  feedback: string
  send_notification?: boolean
}

export interface ExportSubmissionsRequest {
  format: 'xlsx' | 'csv'
  include_fields: string[]
  filter?: {
    status?: string
    min_score?: number
    max_score?: number
  }
}

export interface ExportTaskResponse {
  task_id: string
  download_url: string
  expires_at: string
}
