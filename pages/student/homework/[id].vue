<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="flex flex-col items-center gap-4">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
        <p class="text-gray-600 dark:text-gray-400 animate-pulse">{{ $t('common.loading') || '正在加载作业详情...' }}</p>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen p-4">
      <div class="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 rounded-3xl p-8 max-w-lg w-full text-center shadow-lg">
        <div class="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <ExclamationTriangleIcon class="h-10 w-10 text-red-500" />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">{{ $t('errors.operationFailed') || '加载失败' }}</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">{{ error }}</p>
        <button
          @click="fetchHomeworkData"
          class="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-md hover:shadow-lg"
        >
          {{ $t('common.refresh') || '重试' }}
        </button>
      </div>
    </div>

    <!-- 主要内容 -->
    <div v-else class="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <!-- 面包屑导航 -->
      <nav class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <button @click="goBack" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          {{ $t('dashboard.title') || '仪表盘' }}
        </button>
        <ChevronRightIcon class="h-4 w-4" />
        <span class="text-gray-900 dark:text-white font-medium">{{ $t('homework.title') || '作业详情' }}</span>
      </nav>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        <!-- 左侧主要内容 -->
        <div class="xl:col-span-2 space-y-6">
          <!-- 作业标题卡片 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="relative p-6 sm:p-8">
              <!-- 背景装饰 -->
              <div class="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 opacity-50"></div>
              <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-700 dark:to-purple-700 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
              
              <div class="relative">
                <!-- 返回按钮 -->
                <button
                  @click="goBack"
                  class="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-4 transition-colors group"
                >
                  <ArrowLeftIcon class="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  {{ $t('common.back') || '返回' }}
                </button>

                <!-- 标题 -->
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                  {{ homework?.title || '作业标题' }}
                </h1>

                <!-- 状态标签 -->
                <div class="flex flex-wrap items-center gap-3 mb-6">
                  <div :class="[
                    'inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-sm',
                    getStatusClass(homework?.status || 'pending')
                  ]">
                    <component :is="getStatusIcon(homework?.status || 'pending')" class="h-4 w-4 mr-2" />
                    {{ getStatusText(homework?.status || 'pending') }}
                  </div>

                  <div v-if="homework?.editable" class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700">
                    <PencilIcon class="h-3 w-3 mr-1.5" />
                    {{ $t('homework.editable') || '可编辑' }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 作业描述 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
              <div class="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <DocumentTextIcon class="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              {{ $t('homework.description') || '作业描述' }}
            </h2>
            <div class="prose prose-gray dark:prose-invert max-w-none">
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {{ homework?.description || '这是一个示例作业描述，请根据要求完成相应的内容。作业要求详细描述了需要完成的任务和评分标准。' }}
              </p>
            </div>
          </div>

          <!-- 我的提交区域 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="border-b border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                  <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <PaperAirplaneIcon class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  {{ $t('homework.mySubmission') || '我的提交' }}
                </h2>

                <!-- 自动保存状态 -->
                <Transition name="fade" mode="out-in">
                  <div v-if="autoSaveStatus" class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg">
                    <CheckCircleIcon v-if="autoSaveStatus === 'saved'" class="h-3 w-3 text-green-500" />
                    <ArrowPathIcon v-else class="h-3 w-3 animate-spin text-blue-500" />
                    {{ autoSaveStatus === 'saving' ? ($t('homework.autoSaving') || '保存中...') : ($t('homework.autoSaved') || '已保存') }}
                  </div>
                </Transition>
              </div>
            </div>

            <div class="p-6 sm:p-8">
              <!-- 编辑区域 -->
              <div v-if="homework?.editable" class="space-y-8">
                <!-- 文本答案 -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    {{ $t('homework.textAnswer') || '文字答案' }}
                  </label>
                  <div class="relative">
                    <textarea
                      v-model="submissionData.content"
                      @input="handleContentChange"
                      rows="10"
                      class="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none transition-all duration-200 shadow-sm"
                      :placeholder="$t('homework.textPlaceholder') || '请在此输入您的答案...'"
                    ></textarea>
                    <div class="absolute bottom-3 right-3 text-xs text-gray-400">
                      {{ submissionData.content.length }} 字符
                    </div>
                  </div>
                </div>

                <!-- 文件上传 -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    {{ $t('homework.attachments') || '附件上传' }}
                  </label>

                  <!-- 上传区域 -->
                  <div
                    @drop="handleDrop"
                    @dragover.prevent
                    @dragenter.prevent
                    class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                  >
                    <CloudArrowUpIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 font-medium">
                      {{ $t('homework.uploadHint') || '拖拽文件到此处或点击上传' }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-500 mb-4">
                      支持 PDF、Word、图片等格式，单个文件最大 10MB
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
                      class="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors text-sm font-medium shadow-md hover:shadow-lg"
                    >
                      {{ $t('homework.selectFiles') || '选择文件' }}
                    </button>
                  </div>

                  <!-- 已上传文件列表 -->
                  <TransitionGroup name="file-list" tag="div" class="mt-6 space-y-3">
                    <div
                      v-for="(file, index) in submissionData.files"
                      :key="index"
                      class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div class="flex items-center gap-3 flex-1 min-w-0">
                        <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <DocumentIcon class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{{ file.name }}</p>
                          <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                        </div>
                      </div>
                      <button
                        @click="removeFile(index)"
                        class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <XMarkIcon class="h-4 w-4" />
                      </button>
                    </div>
                  </TransitionGroup>
                </div>

                <!-- 操作按钮 -->
                <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    @click="saveDraft"
                    :disabled="isSaving"
                    class="flex-1 sm:flex-none px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50 flex items-center gap-3 justify-center font-medium shadow-sm"
                  >
                    <DocumentDuplicateIcon class="h-5 w-5" />
                    {{ isSaving ? ($t('homework.saving') || '保存中...') : ($t('homework.saveDraft') || '保存草稿') }}
                  </button>
                  <button
                    @click="submitHomework"
                    :disabled="isSubmitting || !canSubmit"
                    class="flex-1 px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-3 justify-center font-medium shadow-md hover:shadow-lg"
                  >
                    <PaperAirplaneIcon class="h-5 w-5" />
                    {{ isSubmitting ? ($t('homework.submitting') || '提交中...') : ($t('homework.submit') || '提交作业') }}
                  </button>
                </div>
              </div>

              <!-- 只读显示区域 -->
              <div v-else class="space-y-6">
                <!-- 已提交内容显示 -->
                <div v-if="submission?.content">
                  <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    {{ $t('homework.submittedContent') || '已提交内容' }}
                  </h3>
                  <div class="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{{ submission.content }}</p>
                  </div>
                </div>

                <!-- 已提交文件 -->
                <div v-if="submission?.files?.length > 0">
                  <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    {{ $t('homework.submittedFiles') || '已提交文件' }}
                  </h3>
                  <div class="space-y-3">
                    <div
                      v-for="(file, index) in submission.files"
                      :key="index"
                      class="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
                    >
                      <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <DocumentIcon class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ file.name }}</p>
                        <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                      </div>
                      <button
                        v-if="file.url"
                        @click="downloadFile(file.url, file.name)"
                        class="px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg text-sm font-medium transition-colors"
                      >
                        {{ $t('homework.download') || '下载' }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- 提交时间 -->
                <div v-if="submission?.submitTime" class="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700">
                  <div class="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <CheckCircleIcon class="h-5 w-5" />
                    <span class="text-sm font-medium">
                      {{ $t('homework.submitTime') || '提交时间' }}: {{ submission.submitTime }}
                    </span>
                  </div>
                </div>

                <!-- 未提交提示 -->
                <div v-if="!submission?.content && !submission?.files?.length" class="text-center py-12">
                  <div class="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <DocumentTextIcon class="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {{ $t('homework.noSubmission') || '暂未提交' }}
                  </h3>
                  <p class="text-gray-500 dark:text-gray-400">
                    请在截止时间前完成并提交作业
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧信息栏 -->
        <div class="space-y-6">
          <!-- 作业信息卡片 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-6">
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <InformationCircleIcon class="h-5 w-5 text-gray-500" />
                作业信息
              </h3>
              
              <div class="space-y-6">
                <!-- 基本信息 -->
                <div class="space-y-4">
                  <div class="flex items-start gap-3">
                    <CalendarIcon class="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div class="flex-1 min-w-0">
                      <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ $t('homework.assignedDate') || '布置时间' }}</p>
                      <p class="font-medium text-gray-900 dark:text-white">{{ homework?.assignedDate || '2024-01-15' }}</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <ClockIcon class="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div class="flex-1 min-w-0">
                      <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ $t('homework.dueDate') || '截止时间' }}</p>
                      <p class="font-medium text-gray-900 dark:text-white">{{ homework?.dueDate || '2024-01-20 23:59' }}</p>
                    </div>
                  </div>
                </div>

                <!-- 进度指示器 -->
                <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">完成进度</span>
                    <span class="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      {{ submission?.content || submission?.files?.length ? '100%' : '0%' }}
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      class="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                      :style="{ width: submission?.content || submission?.files?.length ? '100%' : '0%' }"
                    ></div>
                  </div>
                </div>

                <!-- 快速操作 -->
                <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">快速操作</p>
                  <div class="space-y-2">
                    <button 
                      @click="$refs.fileInput?.click()"
                      v-if="homework?.editable"
                      class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                    >
                      <CloudArrowUpIcon class="h-4 w-4" />
                      上传文件
                    </button>
                    <button 
                      @click="saveDraft"
                      v-if="homework?.editable"
                      class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    >
                      <DocumentDuplicateIcon class="h-4 w-4" />
                      保存草稿
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 帮助提示 -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
            <div class="flex items-start gap-3">
              <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <InformationCircleIcon class="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-2">提交提示</h4>
                <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• 支持多次编辑和保存草稿</li>
                  <li>• 文件大小限制为 10MB</li>
                  <li>• 提交后可查看但无法修改</li>
                  <li>• 请在截止时间前完成提交</li>
                </ul>
              </div>
            </div>
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
  ExclamationCircleIcon,
  InformationCircleIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/vue/24/solid'
import {
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
  title: t('homework.title') || '作业详情',
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
    pending: t('common.pending') || '待提交',
    submitted: t('common.submitted') || '已提交',
    overdue: t('common.overdue') || '已过期',
    graded: t('homework.graded') || '已批改'
  }
  return texts[status] || (t('common.unknown') || '未知状态')
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
/* 文件列表动画 */
.file-list-enter-active {
  transition: all 0.3s ease;
}

.file-list-leave-active {
  transition: all 0.3s ease;
}

.file-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.file-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.file-list-move {
  transition: transform 0.3s ease;
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 自定义滚动条 */
textarea::-webkit-scrollbar {
  width: 8px;
}

textarea::-webkit-scrollbar-track {
  background: transparent;
}

textarea::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.dark textarea::-webkit-scrollbar-thumb {
  background: #4b5563;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.dark textarea::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* 拖拽悬停效果 */
.border-dashed:hover {
  border-color: #6366f1;
  background-color: rgba(99, 102, 241, 0.05);
}

/* 加载动画优化 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .sticky {
    position: static;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .border {
    border-width: 2px;
  }
}

/* 减少动画（用户偏好） */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
</style>