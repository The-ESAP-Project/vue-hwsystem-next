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
            // 在开发阶段，返回模拟数据
            if (process.dev) {
                return await getMockHomeworkDetail(id)
            }

            // 生产环境调用真实API
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
            // 模拟文件上传
            const fileData = await uploadFiles(data.files)

            const requestData = {
                homeworkId,
                content: data.content,
                files: fileData,
                isDraft: true
            }

            if (process.dev) {
                return await mockSaveDraft(requestData)
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
            // 模拟文件上传
            const fileData = await uploadFiles(data.files)

            const requestData = {
                homeworkId,
                content: data.content,
                files: fileData,
                isDraft: false
            }

            if (process.dev) {
                return await mockSubmitHomework(requestData)
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

            if (process.dev) {
                return files.map(file => ({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: URL.createObjectURL(file) // 开发环境使用临时URL
                }))
            }

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

    return {
        loading: readonly(loading),
        error: readonly(error),
        getHomeworkDetail,
        saveDraft,
        submitHomework,
        uploadFiles
    }
}

// 模拟API响应 (开发环境使用)
const getMockHomeworkDetail = async (id: string | number): Promise<HomeworkViewResponse> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800))

    // 从localStorage获取之前保存的草稿
    const savedDraft = localStorage.getItem(`homework_draft_${id}`)
    const draftData = savedDraft ? JSON.parse(savedDraft) : null

    const homework: Homework = {
        id,
        title: `数学作业 #${id}`,
        description: `请完成课本第${45 + Number(id)}页的练习题，并提交解题过程。注意：
    1. 需要详细说明每个步骤的计算方法和理由
    2. 可以手写后拍照上传，也可以直接在文本框中输入
    3. 如有疑问请及时联系老师
    4. 截止时间前可以多次修改提交`,
        assignedDate: '2024-01-15',
        dueDate: '2024-01-25 23:59',
        status: draftData?.submitted ? 'submitted' : 'pending',
        editable: !draftData?.submitted,
        maxScore: 100,
        attachments: [
            {
                id: 1,
                name: '练习题参考资料.pdf',
                size: 2048000,
                type: 'application/pdf',
                url: '/files/reference.pdf'
            }
        ]
    }

    const submission: HomeworkSubmission | null = draftData ? {
        id: Date.now(),
        homeworkId: id,
        content: draftData.content || '',
        files: draftData.files || [],
        submitTime: draftData.submitted ? draftData.submitTime : null,
        isDraft: !draftData.submitted
    } : null

    return {
        homework,
        submission,
        editable: homework.editable
    }
}

const mockSaveDraft = async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500))

    // 保存到localStorage
    const draftData = {
        content: data.content,
        files: data.files,
        submitted: false,
        saveTime: new Date().toISOString()
    }
    localStorage.setItem(`homework_draft_${data.homeworkId}`, JSON.stringify(draftData))

    return {
        success: true,
        message: '草稿保存成功',
        saveTime: draftData.saveTime
    }
}

const mockSubmitHomework = async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 保存到localStorage并标记为已提交
    const submissionData = {
        content: data.content,
        files: data.files,
        submitted: true,
        submitTime: new Date().toISOString()
    }
    localStorage.setItem(`homework_draft_${data.homeworkId}`, JSON.stringify(submissionData))

    return {
        success: true,
        message: '作业提交成功',
        submission: {
            id: Date.now(),
            homeworkId: data.homeworkId,
            submitTime: submissionData.submitTime
        }
    }
}

// 在api.ts中添加作业相关的mock响应
export const addHomeworkMockResponses = () => {
    return {
        ...mockApiResponses,

        // 获取作业详情
        '/student/homework/view': async (params: { id: string }) => {
            return await getMockHomeworkDetail(params.id)
        },

        // 保存草稿
        '/student/homework/save-draft': async (data: any) => {
            return await mockSaveDraft(data)
        },

        // 提交作业
        '/student/homework/submit': async (data: any) => {
            return await mockSubmitHomework(data)
        },

        // 文件上传
        '/student/homework/upload': async (files: FormData) => {
            // 模拟文件上传成功
            await new Promise(resolve => setTimeout(resolve, 1000))

            const uploadedFiles: SubmissionFile[] = []
            const fileList = files.getAll('files') as File[]

            fileList.forEach(file => {
                uploadedFiles.push({
                    id: Date.now() + Math.random(),
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: `/uploads/${Date.now()}_${file.name}`
                })
            })

            return {
                success: true,
                files: uploadedFiles
            }
        }
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