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
              {{ $t('dashboard.title') || '作业仪表盘' }}
            </h1>
            <p class="mt-2 text-gray-600 dark:text-gray-300 text-lg">
              {{ $t('dashboard.subtitle') || '管理您的学习进度' }}
            </p>
          </div>
          
          <!-- 现代化视图切换按钮 -->
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

        <!-- 统计卡片 -->
        <StatsCards :stats="stats" />
      </div>

      <!-- 主体区域：日历在左，作业列表在右 -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        <!-- 现代化日历区域 -->
        <div class="xl:col-span-1">
          <Calendar 
            :events="calendarEvents"
            :legends="calendarLegends"
          />
        </div>

        <!-- 现代化作业列表区域 -->
        <div class="xl:col-span-2">
          <AssignmentList
            :assignments="assignments"
            :is-list-view="isListView"
            :show-attempts="true"
            :show-progress="false"
            :show-class-progress="false"
            @assignment-click="handleAssignmentClick"
          />
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
  ArrowPathIcon,
  ChevronRightIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'
import Calendar from '@/components/Calendar.vue'
import StatsCards from '@/components/StatsCards.vue'
import AssignmentList from '@/components/AssignmentList.vue'

// i18n
const { t } = useI18n()
const localePath = useLocalePath()

// 页面元信息 - 修复标题翻译问题
useHead({
  title: t('dashboard.title'),
  titleTemplate: '%s | ' + t('home.title'),
  meta: [
    { name: 'description', content: t('dashboard.subtitle') },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: t('dashboard.title') + ' | ' + t('home.title') },
    { property: 'og:description', content: t('dashboard.subtitle') },
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

// 计算作业紧急程度
const getEventStatus = (assignment) => {
  if (assignment.status === 'submitted') return 'submitted' 

  const now = new Date()
  now.setHours(0, 0, 0, 0) // 重置到当天00:00:00
  
  const dueDate = new Date(assignment.dueDate + 'T00:00:00') // 确保使用本地时间
  const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'overdue'
  if (diffDays <= 3) return 'urgent'
  return 'pending' // 移除normal，统一为pending
}

// 日历事件数据
const calendarEvents = computed(() => 
  assignments.value.map(assignment => ({
    id: assignment.id,
    title: assignment.title,
    start: assignment.dueDate,
    className: getEventStatus(assignment),
    extendedProps: {
      status: getEventStatus(assignment),
      title: assignment.title,
      dueDate: assignment.dueDate
    }
  }))
)

// 日历图例
const calendarLegends = computed(() => [
  {
    label: t('dashboard.submitted') || '已提交',
    color: 'bg-green-500'
  },
  {
    label: t('dashboard.pending') || '未提交',
    color: 'bg-yellow-500'
  }
])

// 模拟作业数据
const assignments = ref([
  {
    id: 1,
    title: '数学习题集第一章',
    assignDate: '2025-05-29',
    dueDate: '2025-06-07',
    submitTime: '2025-06-02 14:30',
    status: 'submitted',
    attempts: 1
  },
  {
    id: 2,
    title: '英语口语作业',
    assignDate: '2025-06-01',
    dueDate: '2025-06-28',
    submitTime: null,
    status: 'pending',
    attempts: 0
  },
  {
    id: 3,
    title: '物理实验报告',
    assignDate: '2025-06-03',
    dueDate: '2025-06-12',
    submitTime: null,
    status: 'pending',
    attempts: 0
  },
  {
    id: 4,
    title: '化学作业第二章',
    assignDate: '2025-01-09',
    dueDate: '2025-01-10',
    submitTime: null,
    status: 'pending',
    attempts: 0
  }
])

// 统计数据
const stats = computed(() => [
  {
    label: t('dashboard.stats.total') || '总作业',
    value: assignments.value.length,
    icon: AcademicCapIcon,
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    label: t('dashboard.stats.completed') || '已完成',
    value: assignments.value.filter(a => a.status === 'submitted').length,
    icon: CheckCircleIcon,
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    label: t('dashboard.stats.pending') || '待完成',
    value: assignments.value.filter(a => a.status === 'pending').length,
    icon: ExclamationTriangleIcon,
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    iconColor: 'text-yellow-600 dark:text-yellow-400'
  },
  {
    label: t('dashboard.stats.progress') || '完成率',
    value: Math.round((assignments.value.filter(a => a.status === 'submitted').length / assignments.value.length) * 100) + '%',
    icon: ChartBarIcon,
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400'
  }
])

// 添加主题管理
const { isDark } = useTheme()

const handleAssignmentClick = (assignment) => {
  console.log('点击作业:', assignment)
}
</script>

<style scoped>
/* 清理样式 */
:deep(.fc-daygrid-day-frame) {
  padding: 0;
}

:deep(.fc-scrollgrid-section > *) {
  border: none;
}

:deep(.fc-scrollgrid-sync-table) {
  border: none;
}

:deep(.fc-daygrid-day-top) {
  justify-content: center;
}
</style>