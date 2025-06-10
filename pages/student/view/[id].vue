<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-200">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen p-4">
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-2xl p-6 max-w-md w-full text-center">
        <ExclamationTriangleIcon class="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">加载失败</h3>
        <p class="text-red-600 dark:text-red-300 mb-4">{{ error }}</p>
        <button
            @click="fetchHomeworkData"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          重试
        </button>
      </div>
    </div>

    <!-- 主要内容 -->
    <div v-else class="max-w-4xl mx-auto p-4 sm:p-6">
      <!-- 头部区域 -->
      <div class="relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8 mb-6 transition-all duration-200">
        <!-- 背景装饰 -->
        <div class="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 dark:from-indigo-400/10 dark:to-purple-400/10"></div>
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-800 dark:to-purple-800 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>

        <div class="relative">
          <!-- 返回按钮 -->
          <button
              @click="goBack"
              class="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-4 transition-colors"
          >
            <ArrowLeftIcon class="h-4 w-4" />
            {{ $t('common.back') || '返回' }}
          </button>

          <!-- 作业标题和基本信息 -->
          <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div class="flex-1">
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {{ homework?.title || '作业标题' }}
              </h1>

              <!-- 测试显示ID -->
              <div class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 mb-4">
                ID: {{ homeworkId }}
              </div>

              <!-- 作业信息网格 -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div class="flex items-center gap-3">
                  <CalendarIcon class="h-5 w-5 text-gray-400" />
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('homework.assignedDate') || '布置时间' }}</p>
                    <p class="font-medium text-gray-900 dark:text-white">{{ homework?.assignedDate || '2024-01-15' }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <ClockIcon class="h-5 w-5 text-gray-400" />
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('homework.dueDate') || '截止时间' }}</p>
                    <p class="font-medium text-gray-900 dark:text-white">{{ homework?.dueDate || '2024-01-20 23:59' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 状态标签 -->
            <div class="flex flex-col gap-3">
              <div :class="[
                'inline-flex items-center px-4 py-2 rounded-full text-sm font-medium',
                getStatusClass(homework?.status || 'pending')
              ]">
                <component :is="getStatusIcon(homework?.status || 'pending')" class="h-4 w-4 mr-2" />
                {{ getStatusText(homework?.status || 'pending') }}
              </div>

              <!-- 编辑状态提示 -->
              <div v-if="homework?.editable" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                <PencilIcon class="h-3 w-3 mr-1" />
                {{ $t('homework.editable') || '可编辑' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 作业描述区域 -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6 transition-all duration-200">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <DocumentTextIcon class="h-5 w-5 text-indigo-500" />
          {{ $t('homework.description') || '作业描述' }}
        </h2>
        <div class="prose dark:prose-invert max-w-none">
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
            {{ homework?.description || '这是一个示例作业描述，请根据要求完成相应的内容。作业要求详细描述了需要完成的任务和评分标准。' }}
          </p>
        </div>
      </div>

      <!-- 我的提交区域 -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6 transition-all duration-200">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <PaperAirplaneIcon class="h-5 w-5 text-indigo-500" />
            {{ $t('homework.mySubmission') || '我的提交' }}
          </h2>

          <!-- 自动保存状态 -->
          <div v-if="autoSaveStatus" class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <CheckCircleIcon v-if="autoSaveStatus === 'saved'" class="h-3 w-3 text-green-500" />
            <ArrowPathIcon v-else class="h-3 w-3 animate-spin" />
            {{ autoSaveStatus === 'saving' ? '保存中...' : '已保存' }}
          </div>
        </div>

        <!-- 编辑区域 (仅在可编辑时显示) -->
        <div v-if="homework?.editable">
          <!-- 文本答案 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {{ $t('homework.textAnswer') || '文字答案' }}
            </label>
            <textarea
                v-model="submissionData.content"
                @input="handleContentChange"
                rows="8"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none transition-all duration-200"
                :placeholder="$t('homework.textPlaceholder') || '请在此输入您的答案...'"
            ></textarea>
          </div>

          <!-- 文件上传 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {{ $t('homework.attachments') || '附件上传' }}
            </label>

            <!-- 上传区域 -->
            <div
                @drop="handleDrop"
                @dragover.prevent
                @dragenter.prevent
                class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors duration-200"
            >
              <CloudArrowUpIcon class="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {{ $t('homework.uploadHint') || '拖拽文件到此处或点击上传' }}
              </p>
              <input
                  type="file"
                  multiple
                  @change="handleFileSelect"
                  class="hidden"
                  ref="fileInput"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              >
              <button
                  @click="$refs.fileInput?.click()"
                  class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm"
              >
                {{ $t('homework.selectFiles') || '选择文件' }}
              </button>
            </div>

            <!-- 已上传文件列表 -->
            <div v-if="submissionData.files?.length > 0" class="mt-4 space-y-2">
              <div
                  v-for="(file, index) in submissionData.files"
                  :key="index"
                  class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <DocumentIcon class="h-5 w-5 text-gray-500" />
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ file.name }}</span>
                  <span class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</span>
                </div>
                <button
                    @click="removeFile(index)"
                    class="text-red-500 hover:text-red-700 transition-colors"
                >
                  <XMarkIcon class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
                @click="saveDraft"
                :disabled="isSaving"
                class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center gap-2 justify-center"
            >
              <DocumentDuplicateIcon class="h-4 w-4" />
              {{ isSaving ? '保存中...' : ($t('homework.saveDraft') || '保存草稿') }}
            </button>
            <button
                @click="submitHomework"
                :disabled="isSubmitting || !canSubmit"
                class="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 justify-center"
            >
              <PaperAirplaneIcon class="h-4 w-4" />
              {{ isSubmitting ? '提交中...' : ($t('homework.submit') || '提交作业') }}
            </button>
          </div>
        </div>

        <!-- 只读显示区域 (不可编辑时) -->
        <div v-else>
          <!-- 已提交内容显示 -->
          <div v-if="submission?.content" class="mb-6">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {{ $t('homework.submittedContent') || '已提交内容' }}
            </h3>
            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ submission.content }}</p>
            </div>
          </div>

          <!-- 已提交文件 -->
          <div v-if="submission?.files?.length > 0" class="mb-6">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {{ $t('homework.submittedFiles') || '已提交文件' }}
            </h3>
            <div class="space-y-2">
              <div
                  v-for="(file, index) in submission.files"
                  :key="index"
                  class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <DocumentIcon class="h-5 w-5 text-gray-500" />
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ file.name }}</span>
                <span class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</span>
                <button
                    v-if="file.url"
                    @click="downloadFile(file.url, file.name)"
                    class="ml-auto text-indigo-500 hover:text-indigo-700 text-sm transition-colors"
                >
                  {{ $t('homework.download') || '下载' }}
                </button>
              </div>
            </div>
          </div>

          <!-- 提交时间 -->
          <div v-if="submission?.submitTime" class="text-sm text-gray-500 dark:text-gray-400">
            {{ $t('homework.submitTime') || '提交时间' }}: {{ submission.submitTime }}
          </div>

          <!-- 未提交提示 -->
          <div v-if="!submission?.content && !submission?.files?.length" class="text-center py-8">
            <DocumentTextIcon class="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p class="text-gray-500 dark:text-gray-400">
              {{ $t('homework.noSubmission') || '暂未提交' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
  CloudArrowUpIcon,
  DocumentIcon,
  XMarkIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/vue/24/solid'
import {
  useHomework,
  type Homework,
  type HomeworkSubmission,
  formatFileSize,
  isValidFileType,
  validateFileSize
} from '~/composables/useHomework'

// 路由和i18n
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const localePath = useLocalePath()

// 页面元信息
useHead({
  title: '作业详情',
  titleTemplate: '%s | 作业管理系统'
})

// 页面配置
definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

// 使用作业相关的composable
const {
  loading: homeworkLoading,
  error: homeworkError,
  getHomeworkDetail,
  saveDraft: saveHomeworkDraft,
  submitHomework: submitHomeworkAPI
} = useHomework()

// 响应式数据
const homeworkId = computed(() => route.params.id as string)
const homework = ref<Homework | null>(null)
const submission = ref<HomeworkSubmission | null>(null)
const isSaving = ref(false)
const isSubmitting = ref(false)
const autoSaveStatus = ref<'saving' | 'saved' | null>(null)

// 提交数据
const submissionData = ref({
  content: '',
  files: [] as File[]
})

// 自动保存定时器
let autoSaveTimer: NodeJS.Timeout | null = null

// 计算属性
const loading = computed(() => homeworkLoading.value)
const error = computed(() => homeworkError.value)

const canSubmit = computed(() => {
  return submissionData.value.content.trim() || submissionData.value.files.length > 0
})

// 获取作业数据
const fetchHomeworkData = async () => {
  try {
    const response = await getHomeworkDetail(homeworkId.value)

    homework.value = response.homework
    submission.value = response.submission

    // 加载已有的提交内容
    if (submission.value?.content) {
      submissionData.value.content = submission.value.content
    }
    if (submission.value?.files) {
      // 将已上传的文件转换为File对象用于显示
      submissionData.value.files = submission.value.files.map(f => {
        return new File([], f.name, { type: f.type })
      })
    }

  } catch (err: any) {
    console.error('获取作业数据失败:', err)
  }
}

// 状态相关方法
const getStatusClass = (status: string) => {
  const classes = {
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
    submitted: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
    overdue: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
    graded: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
  }
  return classes[status] || classes.pending
}

const getStatusIcon = (status: string) => {
  const icons = {
    pending: ExclamationCircleIcon,
    submitted: CheckCircleSolid,
    overdue: ExclamationTriangleIcon,
    graded: CheckCircleSolid
  }
  return icons[status] || icons.pending
}

const getStatusText = (status: string) => {
  const texts = {
    pending: '待提交',
    submitted: '已提交',
    overdue: '已过期',
    graded: '已批改'
  }
  return texts[status] || '未知状态'
}

// 文件相关方法
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    addFiles(Array.from(target.files))
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files))
  }
}

const addFiles = (files: File[]) => {
  // 过滤文件类型和大小
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png']

  const validFiles = files.filter(file => {
    const isValidType = isValidFileType(file, allowedTypes)
    const isValidSize = validateFileSize(file, 10)

    if (!isValidType) {
      console.warn(`文件 ${file.name} 类型不支持`)
      return false
    }
    if (!isValidSize) {
      console.warn(`文件 ${file.name} 超过大小限制`)
      return false
    }
    return true
  })

  submissionData.value.files.push(...validFiles)
  triggerAutoSave()
}

const removeFile = (index: number) => {
  submissionData.value.files.splice(index, 1)
  triggerAutoSave()
}

// 内容变化处理
const handleContentChange = () => {
  triggerAutoSave()
}

// 自动保存
const triggerAutoSave = () => {
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
  }

  autoSaveTimer = setTimeout(() => {
    saveDraft(true)
  }, 2000) // 2秒后自动保存
}

// 保存草稿
const saveDraft = async (isAuto = false) => {
  if (isSaving.value || !homework.value?.editable) return

  isSaving.value = true
  if (isAuto) {
    autoSaveStatus.value = 'saving'
  }

  try {
    await saveHomeworkDraft(homeworkId.value, {
      content: submissionData.value.content,
      files: submissionData.value.files
    })

    if (isAuto) {
      autoSaveStatus.value = 'saved'
      setTimeout(() => {
        autoSaveStatus.value = null
      }, 2000)
    }

  } catch (err: any) {
    console.error('保存草稿失败:', err)
    if (!isAuto) {
      // 可以在这里显示错误提示
    }
  } finally {
    isSaving.value = false
  }
}

// 提交作业
const submitHomework = async () => {
  if (!canSubmit.value || isSubmitting.value || !homework.value?.editable) return

  isSubmitting.value = true

  try {
    await submitHomeworkAPI(homeworkId.value, {
      content: submissionData.value.content,
      files: submissionData.value.files
    })

    // 提交成功后刷新数据
    await fetchHomeworkData()

  } catch (err: any) {
    console.error('提交作业失败:', err)
    // 可以在这里显示错误提示
  } finally {
    isSubmitting.value = false
  }
}

// 返回上级页面
const goBack = () => {
  router.back()
}

// 下载文件
const downloadFile = (url: string, filename: string) => {
  // 创建临时链接下载文件
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 页面加载时获取数据
onMounted(() => {
  fetchHomeworkData()
})

// 页面卸载时清理定时器
onUnmounted(() => {
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
  }
})
</script>

<style scoped>
/* 自定义滚动条 */
textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track {
  background: transparent;
}

textarea::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.dark textarea::-webkit-scrollbar-thumb {
  background: #4b5563;
}

/* 拖拽时的样式 */
.border-dashed:hover {
  border-color: #6366f1;
}
</style>