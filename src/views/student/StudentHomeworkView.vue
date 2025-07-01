<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 transition-all duration-200">
    <div class="max-w-4xl mx-auto">
      <!-- 头部导航 -->
      <div class="mb-6">
        <button
          @click="goBack"
          class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          返回作业列表
        </button>
      </div>

      <!-- 作业详情卡片 -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-4">
              <div :class="getStatusIndicatorClass()"></div>
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {{ assignment.title }}
              </h1>
              <span :class="getStatusBadgeClass()">
                {{ getStatusText() }}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-4 12h0m-4 0h0" />
                </svg>
                <span>布置时间: {{ assignment.assignDate }}</span>
              </div>
              <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>截止时间: {{ assignment.dueDate }}</span>
              </div>
              <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>提交次数: {{ assignment.attempts }}/{{ assignment.maxAttempts || '无限制' }}</span>
              </div>
              <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span v-if="assignment.score">成绩: {{ assignment.score }}/100</span>
                <span v-else>成绩: 未评分</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 作业描述 -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">作业要求</h3>
          <div class="prose prose-gray dark:prose-invert max-w-none">
            <p class="text-gray-600 dark:text-gray-300">{{ assignment.description }}</p>
          </div>
        </div>

        <!-- 附件下载 -->
        <div v-if="assignment.attachments && assignment.attachments.length > 0" class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">相关附件</h3>
          <div class="space-y-2">
            <div
              v-for="attachment in assignment.attachments"
              :key="attachment.id"
              class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
            >
              <svg class="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="flex-1 text-sm font-medium text-gray-900 dark:text-white">{{ attachment.name }}</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ attachment.size }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 提交区域 -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">作业提交</h3>

        <form @submit.prevent="submitAssignment" class="space-y-6">
          <!-- 答案输入 -->
          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              作业答案
            </label>
            <textarea
              v-model="submission.content"
              rows="8"
              class="block w-full px-3 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 transition-all duration-200 resize-none"
              placeholder="请输入您的作业答案..."
              :disabled="assignment.status === 'submitted' && !canResubmit"
            ></textarea>
          </div>

          <!-- 文件上传 -->
          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              上传附件（可选）
            </label>
            <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-6 text-center hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors duration-200">
              <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">点击上传或拖拽文件到此处</p>
              <input type="file" class="hidden" multiple accept=".pdf,.doc,.docx,.txt,.jpg,.png">
            </div>
          </div>

          <!-- 提交按钮 -->
          <div class="flex justify-end gap-4">
            <button
              type="button"
              class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              保存草稿
            </button>
            <button
              type="submit"
              :disabled="!submission.content.trim() || submitting"
              class="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
            >
              <span v-if="submitting">提交中...</span>
              <span v-else-if="assignment.status === 'submitted' && canResubmit">重新提交</span>
              <span v-else>提交作业</span>
            </button>
          </div>
        </form>
      </div>

      <!-- 提交历史 -->
      <div v-if="submissionHistory.length > 0" class="mt-6 bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">提交历史</h3>
        <div class="space-y-4">
          <div
            v-for="(history, index) in submissionHistory"
            :key="index"
            class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
          >
            <div class="flex justify-between items-start mb-2">
              <span class="text-sm font-medium text-gray-900 dark:text-white">第{{ index + 1 }}次提交</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ history.submitTime }}</span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">{{ history.content.substring(0, 100) }}...</p>
            <div class="flex justify-between items-center">
              <span v-if="history.score" class="text-sm font-medium text-green-600 dark:text-green-400">
                得分: {{ history.score }}/100
              </span>
              <span v-else class="text-sm text-gray-500 dark:text-gray-400">待评分</span>
              <button class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                查看详情
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 模拟作业数据
const assignment = ref({
  id: route.params.id,
  title: '数学作业 - 第三章练习',
  description: '请完成教材第三章的所有练习题，包括：\n1. 基础计算题 1-20\n2. 应用题 21-30\n3. 思考题 31-35\n\n要求：\n- 写出详细的解题步骤\n- 标注重要的公式和定理\n- 对于应用题，要画出相应的图形\n\n注意事项：\n- 请用黑色钢笔或签字笔书写\n- 字迹工整，步骤清晰\n- 按时提交，逾期将扣分',
  assignDate: '2024-12-28',
  dueDate: '2025-01-05',
  status: 'pending',
  attempts: 0,
  maxAttempts: 3,
  score: null,
  attachments: [
    {
      id: 1,
      name: '第三章练习题.pdf',
      size: '2.3 MB'
    },
    {
      id: 2,
      name: '参考资料.docx',
      size: '1.1 MB'
    }
  ]
})

// 提交表单
const submission = reactive({
  content: ''
})

const submitting = ref(false)

// 提交历史
const submissionHistory = ref([
  {
    submitTime: '2024-12-30 14:30',
    content: '这是我的第一次提交，包含了所有题目的解答...',
    score: 85 as number | null
  }
])

// 计算属性
const canResubmit = computed(() => {
  return assignment.value.attempts < (assignment.value.maxAttempts || Infinity)
})

// 获取状态指示器样式
const getStatusIndicatorClass = () => {
  if (isOverdue()) {
    return 'w-3 h-3 rounded-full bg-red-500 animate-pulse'
  }
  if (assignment.value.status === 'submitted') {
    return 'w-3 h-3 rounded-full bg-green-500'
  }
  return 'w-3 h-3 rounded-full bg-blue-500'
}

// 获取状态徽章样式
const getStatusBadgeClass = () => {
  if (isOverdue()) {
    return 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
  }
  if (assignment.value.status === 'submitted') {
    return 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
  }
  return 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
}

// 获取状态文本
const getStatusText = () => {
  if (isOverdue()) {
    return '已过期'
  }
  if (assignment.value.status === 'submitted') {
    return '已提交'
  }
  return '待完成'
}

// 判断是否过期
const isOverdue = () => {
  const now = new Date()
  const due = new Date(assignment.value.dueDate)
  return now > due && assignment.value.status !== 'submitted'
}

// 提交作业
const submitAssignment = async () => {
  try {
    submitting.value = true

    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 更新状态
    assignment.value.status = 'submitted'
    assignment.value.attempts += 1

    // 添加到提交历史
    submissionHistory.value.unshift({
      submitTime: new Date().toLocaleString('zh-CN'),
      content: submission.content,
      score: null
    })

    // 清空表单
    submission.content = ''

    alert('作业提交成功！')

  } catch (error) {
    alert('提交失败，请重试')
  } finally {
    submitting.value = false
  }
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}
</script>
