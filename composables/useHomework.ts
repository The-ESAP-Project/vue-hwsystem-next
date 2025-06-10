// composables/useHomework.ts
import { apiClient } from '~/utils/api'

// 作业相关类型定义
export interface Homework {
    id: string | number
    title: string
    description: string
    assignedDate: string
    dueDate: string
    status: 'pending' | 'submitted' | 'overdue' | 'graded'
    editable: boolean
    maxScore?: number
    attachments?: HomeworkAttachment[]
}

export interface HomeworkSubmission {
    id?: string | number
    homeworkId: string | number
    content: string
    files: SubmissionFile[]
    submitTime: string | null
    score?: number
    feedback?: string
    isDraft: boolean
}

export interface SubmissionFile {
    id?: string | number
    name: string
    size: number
    type: string
    url?: string
}

export interface HomeworkAttachment {
    id: string | number
    name: string
    size: number
    type: string
    url: string
}

export interface HomeworkViewResponse {
    homework: Homework
    submission: HomeworkSubmission | null
    editable: boolean
}

export const useHomework = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    // 获取作业详情
    const getHomeworkDetail = async (id: string | number): Promise<HomeworkViewResponse> => {
        loading.value = true
        error.value = null

        try {
            const response = await apiClient.get(`/student/homework/view?id=${id}`)
            return response
        } catch (err: any) {
            error.value = err.message || '获取作业详情失败'
            throw err
        } finally {
            loading.value = false
        }
    }

    // 保存草稿
    const saveDraft = async (homeworkId: string | number, data: {
        content: string
        files: File[]
    }) => {
        try {
            // 先上传文件
            const fileData = await uploadFiles(data.files)

            const requestData = {
                homeworkId,
                content: data.content,
                files: fileData,
                isDraft: true
            }

            return await apiClient.post('/student/homework/save-draft', requestData)
        } catch (err: any) {
            error.value = err.message || '保存草稿失败'
            throw err
        }
    }

    // 提交作业
    const submitHomework = async (homeworkId: string | number, data: {
        content: string
        files: File[]
    }) => {
        try {
            // 先上传文件
            const fileData = await uploadFiles(data.files)

            const requestData = {
                homeworkId,
                content: data.content,
                files: fileData,
                isDraft: false
            }

            return await apiClient.post('/student/homework/submit', requestData)
        } catch (err: any) {
            error.value = err.message || '提交作业失败'
            throw err
        }
    }

    // 文件上传
    const uploadFiles = async (files: File[]): Promise<SubmissionFile[]> => {
        if (files.length === 0) return []

        try {
            const formData = new FormData()
            files.forEach(file => {
                formData.append('files', file)
            })

            const response = await apiClient.post('/student/homework/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            return response.files
        } catch (err: any) {
            error.value = err.message || '文件上传失败'
            throw err
        }
    }

    // 获取作业列表
    const getHomeworkList = async () => {
        loading.value = true
        error.value = null

        try {
            const response = await apiClient.get('/student/homework/list')
            return response.assignments
        } catch (err: any) {
            error.value = err.message || '获取作业列表失败'
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        loading: readonly(loading),
        error: readonly(error),
        getHomeworkDetail,
        saveDraft,
        submitHomework,
        uploadFiles,
        getHomeworkList
    }
}

// 工具函数
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
    const fileExt = '.' + (file.name.split('.').pop()?.toLowerCase() || '')
    return allowedTypes.includes(fileExt)
}

export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    return file.size <= maxSizeBytes
}