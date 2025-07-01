<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 transition-all duration-200">
    <div class="max-w-7xl mx-auto">
      <!-- 现代化头部区域 -->
      <div class="relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8 mb-8 transition-all duration-200">
        <!-- 背景装饰 -->
        <div class="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 dark:from-indigo-400/10 dark:to-purple-400/10"></div>
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-800 dark:to-purple-800 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>

        <div class="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              学生控制台
            </h1>
            <p class="mt-2 text-gray-600 dark:text-gray-300 text-lg">
              管理您的学习进度
            </p>
          </div>

          <!-- 用户信息 -->
          <div class="flex items-center gap-4">
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900 dark:text-white">小明同学</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">学生身份</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-medium">
              生
            </div>
            <button
              @click="logout"
              class="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              退出
            </button>
          </div>
        </div>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100">总作业数</p>
                <p class="text-2xl font-bold">{{ stats.total }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-400/30 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100">已完成</p>
                <p class="text-2xl font-bold">{{ stats.completed }}</p>
              </div>
              <div class="w-12 h-12 bg-green-400/30 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-orange-100">进行中</p>
                <p class="text-2xl font-bold">{{ stats.pending }}</p>
              </div>
              <div class="w-12 h-12 bg-orange-400/30 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-red-100">已过期</p>
                <p class="text-2xl font-bold">{{ stats.overdue }}</p>
              </div>
              <div class="w-12 h-12 bg-red-400/30 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 主体区域：作业列表 -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all duration-200 hover:shadow-xl">
        <div class="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3 sm:gap-0">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              我的作业
            </h2>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ assignments.length }} 个作业
              </span>
            </div>
          </div>

          <!-- 筛选器 -->
          <div class="flex items-center gap-2 flex-wrap">
            <button
              v-for="filter in filterOptions"
              :key="filter.value"
              @click="selectedFilter = filter.value"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                selectedFilter === filter.value
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              ]"
            >
              {{ filter.label }}
              <span v-if="filter.count !== undefined" class="ml-1 opacity-75">({{ filter.count }})</span>
            </button>
          </div>
        </div>

        <div class="max-h-[60vh] overflow-y-auto">
          <div class="divide-y divide-gray-100 dark:divide-gray-700">
            <div
              v-for="assignment in filteredAssignments"
              :key="assignment.id"
              :class="[
                'p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group cursor-pointer',
                getAssignmentRowClass(assignment)
              ]"
              @click="viewAssignment(assignment)"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1 min-w-0">
                  <div class="flex items-start sm:items-center gap-2 sm:gap-3 mb-3 flex-col sm:flex-row">
                    <div class="flex items-center gap-2">
                      <div :class="getStatusIndicatorClass(assignment)"></div>
                      <h3 :class="[
                        'text-base sm:text-lg font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 break-words',
                        getAssignmentTitleClass(assignment)
                      ]">
                        {{ assignment.title }}
                      </h3>
                    </div>

                    <!-- 状态标签 -->
                    <div class="flex items-center gap-2 flex-wrap">
                      <span v-if="isOverdue(assignment)" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 animate-pulse">
                        已过期
                      </span>
                      <span v-else-if="isUrgent(assignment)" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 animate-pulse">
                        紧急
                      </span>
                      <span v-else :class="getStatusBadgeClass(assignment)">
                        {{ getStatusText(assignment) }}
                      </span>
                    </div>
                  </div>

                  <div class="flex flex-col sm:grid gap-2 sm:gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                    <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <svg class="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-4 12h0m-4 0h0"></path>
                      </svg>
                      <span class="truncate">布置时间: {{ assignment.assignDate }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <svg class="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span class="truncate">截止时间: {{ assignment.dueDate }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <svg class="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                      <span class="truncate">提交次数: {{ assignment.attempts }}</span>
                    </div>
                  </div>
                </div>

                <!-- 右侧操作按钮 -->
                <div class="ml-2 sm:ml-4 flex flex-col items-end gap-2">
                  <button class="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200">
                    <span class="hidden sm:inline">查看详情</span>
                    <span class="sm:hidden">详情</span>
                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 统计数据
const stats = ref({
  total: 12,
  completed: 8,
  pending: 3,
  overdue: 1
})

// 当前筛选器
const selectedFilter = ref('all')

// 筛选选项
const filterOptions = computed(() => [
  { label: '全部', value: 'all', count: stats.value.total },
  { label: '进行中', value: 'pending', count: stats.value.pending },
  { label: '已完成', value: 'completed', count: stats.value.completed },
  { label: '已过期', value: 'overdue', count: stats.value.overdue }
])

// 作业数据
const assignments = ref([
  {
    id: 1,
    title: '数学作业 - 第三章练习',
    assignDate: '2024-12-28',
    dueDate: '2025-01-05',
    status: 'pending',
    attempts: 0
  },
  {
    id: 2,
    title: '英语作业 - 阅读理解',
    assignDate: '2024-12-27',
    dueDate: '2025-01-03',
    status: 'pending',
    attempts: 1
  },
  {
    id: 3,
    title: '物理作业 - 力学实验报告',
    assignDate: '2024-12-26',
    dueDate: '2024-12-30',
    status: 'overdue',
    attempts: 0
  },
  {
    id: 4,
    title: '语文作业 - 古诗词背诵',
    assignDate: '2024-12-25',
    dueDate: '2024-12-28',
    status: 'submitted',
    attempts: 2
  },
  {
    id: 5,
    title: '化学作业 - 元素周期表',
    assignDate: '2024-12-24',
    dueDate: '2024-12-27',
    status: 'submitted',
    attempts: 1
  }
])

// 筛选后的作业
const filteredAssignments = computed(() => {
  if (selectedFilter.value === 'all') {
    return assignments.value
  }
  return assignments.value.filter(assignment => {
    if (selectedFilter.value === 'pending') {
      return assignment.status === 'pending' && !isOverdue(assignment)
    }
    if (selectedFilter.value === 'completed') {
      return assignment.status === 'submitted'
    }
    if (selectedFilter.value === 'overdue') {
      return isOverdue(assignment)
    }
    return false
  })
})

// 判断是否过期
const isOverdue = (assignment: any) => {
  const now = new Date()
  const due = new Date(assignment.dueDate)
  return now > due && assignment.status !== 'submitted'
}

// 判断是否紧急
const isUrgent = (assignment: any) => {
  if (assignment.status === 'submitted') return false

  const now = new Date()
  const due = new Date(assignment.dueDate)
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  return diffDays <= 3 && diffDays > 0
}

// 获取状态指示器样式
const getStatusIndicatorClass = (assignment: any) => {
  if (isOverdue(assignment)) {
    return 'w-3 h-3 rounded-full bg-red-500 animate-pulse'
  }
  if (isUrgent(assignment)) {
    return 'w-3 h-3 rounded-full bg-orange-500 animate-pulse'
  }
  if (assignment.status === 'submitted') {
    return 'w-3 h-3 rounded-full bg-green-500'
  }
  return 'w-3 h-3 rounded-full bg-blue-500'
}

// 获取作业行样式
const getAssignmentRowClass = (assignment: any) => {
  if (isOverdue(assignment)) {
    return 'border-l-4 border-red-500 bg-red-50/30 dark:bg-red-900/10'
  }
  if (isUrgent(assignment)) {
    return 'border-l-4 border-orange-500 bg-orange-50/30 dark:bg-orange-900/10'
  }
  return ''
}

// 获取作业标题样式
const getAssignmentTitleClass = (assignment: any) => {
  if (assignment.status === 'submitted') {
    return 'text-gray-900 dark:text-white'
  }
  if (isOverdue(assignment)) {
    return 'text-red-700 dark:text-red-300'
  }
  return 'text-gray-900 dark:text-white'
}

// 获取状态徽章样式
const getStatusBadgeClass = (assignment: any) => {
  if (assignment.status === 'submitted') {
    return 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
  }
  return 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
}

// 获取状态文本
const getStatusText = (assignment: any) => {
  if (assignment.status === 'submitted') {
    return '已提交'
  }
  return '待完成'
}

// 查看作业详情
const viewAssignment = (assignment: any) => {
  console.log('查看作业详情:', assignment)
  // 这里可以跳转到作业详情页面
  // router.push(`/student/homework/${assignment.id}`)
}

// 退出登录
const logout = () => {
  router.push('/')
}
</script>
