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
              {{ $t('teacher.dashboard.title') || '教师工作台' }}
            </h1>
            <p class="mt-2 text-gray-600 dark:text-gray-300 text-lg">
              {{ $t('teacher.dashboard.subtitle') || '管理课程和作业' }}
            </p>
          </div>
          
          <!-- 快捷操作按钮 -->
          <div class="flex items-center gap-3">
            <button 
              @click="showCreateAssignment = true"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <PlusIcon class="h-4 w-4" />
              {{ $t('teacher.dashboard.createAssignment') || '新建作业' }}
            </button>
            
            <div class="flex items-center bg-gray-100 dark:bg-gray-700 rounded-2xl p-1 transition-colors duration-200">
              <button 
                @click="isListView = true" 
                :class="[
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isListView 
                    ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-lg transform scale-105' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                ]"
              >
                <Bars4Icon class="h-4 w-4" />
                {{ $t('dashboard.listView') || '列表' }}
              </button>
              <button 
                @click="isListView = false" 
                :class="[
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  !isListView 
                    ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-lg transform scale-105' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                ]"
              >
                <Squares2X2Icon class="h-4 w-4" />
                {{ $t('dashboard.gridView') || '网格' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 统计卡片 -->
        <StatsCards :stats="stats" />
      </div>

      <!-- 主体区域 -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        <!-- 日历区域 -->
        <div class="xl:col-span-1">
          <Calendar 
            :events="calendarEvents"
            :legends="calendarLegends"
            class="mb-6"
          />
        </div>

        <!-- 作业管理区域 -->
        <div class="xl:col-span-2">
          <AssignmentList
            :title="$t('teacher.dashboard.assignmentManagement') || '作业管理'"
            :assignments="assignments"
            :is-list-view="isListView"
            :show-attempts="false"
            :show-progress="true"
            :show-class-progress="false"
            :show-status-badge="true"
            :status-colors="teacherStatusColors"
            :status-badge-colors="teacherStatusBadgeColors"
            :status-texts="teacherStatusTexts"
            progress-label="进度"
            @assignment-click="handleAssignmentClick"
          >
            <template #assignment-actions="{ assignment }">
              <button class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200">
                <EyeIcon class="h-3 w-3" />
                {{ $t('teacher.dashboard.viewSubmissions') || '查看提交' }}
              </button>
              <button class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200">
                <PencilIcon class="h-3 w-3" />
                {{ $t('common.edit') || '编辑' }}
              </button>
            </template>
            
            <template #grid-actions="{ assignment }">
              <button class="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200">
                <EyeIcon class="h-3 w-3" />
              </button>
              <button class="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200">
                <PencilIcon class="h-3 w-3" />
              </button>
            </template>
          </AssignmentList>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Bars4Icon, 
  Squares2X2Icon, 
  CalendarIcon, 
  ClockIcon, 
  ChartBarIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UsersIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'
import Calendar from '@/components/Calendar.vue'
import StatsCards from '@/components/StatsCards.vue'
import AssignmentList from '@/components/AssignmentList.vue'

// i18n
const { t } = useI18n()
const localePath = useLocalePath()

// 页面元信息
useHead({
  title: t('teacher.dashboard.title'),
  titleTemplate: '%s | ' + t('home.title'),
  meta: [
    { name: 'description', content: t('teacher.dashboard.subtitle') },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: t('teacher.dashboard.title') + ' | ' + t('home.title') },
    { property: 'og:description', content: t('teacher.dashboard.subtitle') },
  ]
})

// 页面配置
definePageMeta({
  layout: 'app',
  auth: false,
  keepalive: false
})

// 视图模式切换
const isListView = ref(true)
const showCreateAssignment = ref(false)

// 模拟作业数据
const assignments = ref([
  {
    id: 1,
    title: '数学习题集第一章',
    assignDate: '2025-05-29',
    dueDate: '2025-06-07',
    status: 'active',
    totalStudents: 35,
    submitted: 28,
    description: '完成课本第1-20页的习题'
  },
  {
    id: 2,
    title: '英语口语作业',
    assignDate: '2025-06-01',
    dueDate: '2025-06-28',
    status: 'active',
    totalStudents: 35,
    submitted: 15,
    description: '录制3分钟英语自我介绍视频'
  },
  {
    id: 3,
    title: '物理实验报告',
    assignDate: '2025-06-03',
    dueDate: '2025-06-12',
    status: 'draft',
    totalStudents: 35,
    submitted: 0,
    description: '完成光学实验报告'
  },
  {
    id: 4,
    title: '化学作业第二章',
    assignDate: '2025-06-05',
    dueDate: '2025-06-15',
    status: 'closed',
    totalStudents: 35,
    submitted: 35,
    description: '化学方程式练习'
  }
])

// 统计数据
const stats = computed(() => [
  {
    label: t('teacher.dashboard.stats.totalAssignments') || '总作业数',
    value: assignments.value.length,
    icon: AcademicCapIcon,
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    label: t('teacher.dashboard.stats.activeAssignments') || '进行中',
    value: assignments.value.filter(a => a.status === 'active').length,
    icon: CheckCircleIcon,
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    label: t('teacher.dashboard.stats.totalStudents') || '学生总数',
    value: 35,
    icon: UsersIcon,
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400'
  },
  {
    label: t('teacher.dashboard.stats.avgSubmissionRate') || '平均提交率',
    value: Math.round(assignments.value.reduce((acc, a) => acc + (a.submitted / a.totalStudents), 0) / assignments.value.length * 100) + '%',
    icon: ChartBarIcon,
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    iconColor: 'text-orange-600 dark:text-orange-400'
  }
])

// 快速统计
const quickStats = computed(() => [
  {
    label: t('teacher.dashboard.pendingReview') || '待批改',
    value: assignments.value.reduce((acc, a) => acc + a.submitted, 0),
    icon: ExclamationTriangleIcon,
    bgColor: 'bg-gradient-to-r from-yellow-500 to-orange-500'
  },
  {
    label: t('teacher.dashboard.dueToday') || '今日截止',
    value: 2,
    icon: ClockIcon,
    bgColor: 'bg-gradient-to-r from-red-500 to-pink-500'
  },
  {
    label: t('teacher.dashboard.completedThisWeek') || '本周已完成',
    value: 15,
    icon: CheckCircleIcon,
    bgColor: 'bg-gradient-to-r from-green-500 to-emerald-500'
  }
])

// 状态相关方法
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500'
    case 'draft': return 'bg-gray-500'
    case 'closed': return 'bg-blue-500'
    default: return 'bg-gray-500'
  }
}

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
    case 'draft': return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200'
    case 'closed': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
    default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return t('teacher.dashboard.status.active') || '进行中'
    case 'draft': return t('teacher.dashboard.status.draft') || '草稿'
    case 'closed': return t('teacher.dashboard.status.closed') || '已结束'
    default: return status
  }
}

// 主题管理
const { isDark } = useTheme()

// 日历事件数据
const calendarEvents = computed(() => 
  assignments.value.map(assignment => ({
    id: assignment.id,
    title: assignment.title,
    start: assignment.dueDate,
    className: assignment.status,
    extendedProps: {
      status: assignment.status,
      title: assignment.title,
      dueDate: assignment.dueDate
    }
  }))
)

// 日历图例
const calendarLegends = computed(() => [
  {
    label: t('teacher.dashboard.assignments') || '作业',
    color: 'bg-blue-500'
  },
  {
    label: t('teacher.dashboard.deadlines') || '截止',
    color: 'bg-orange-500'
  }
])

// 教师专用状态配置
const teacherStatusColors = {
  active: 'bg-green-500',
  draft: 'bg-gray-500',
  closed: 'bg-blue-500'
}

const teacherStatusBadgeColors = {
  active: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
  draft: 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200',
  closed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
}

const teacherStatusTexts = {
  active: t('teacher.dashboard.status.active') || '进行中',
  draft: t('teacher.dashboard.status.draft') || '草稿',
  closed: t('teacher.dashboard.status.closed') || '已结束'
}

const handleAssignmentClick = (assignment) => {
  console.log('点击作业:', assignment)
}
</script>

<style scoped>
/* 自定义滚动条 */
.max-h-\[600px\]::-webkit-scrollbar {
  width: 6px;
}

.max-h-\[600px\]::-webkit-scrollbar-track {
  background: transparent;
}

.max-h-\[600px\]::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.dark .max-h-\[600px\]::-webkit-scrollbar-thumb {
  background: #4b5563;
}
</style>