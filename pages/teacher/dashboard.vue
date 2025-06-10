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
import { useTeacherDashboard } from '~/composables/useDashboardData'

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

// 页面配置 - 启用认证保护
definePageMeta({
  layout: 'app',
  middleware: 'auth',
  keepalive: false
})

// 使用教师 Dashboard 数据
const {
  assignments,
  stats,
  calendarEvents,
  loading,
  error,
  fetchTeacherData,
  createAssignment
} = useTeacherDashboard()

// 视图模式切换
const isListView = ref(true)
const showCreateAssignment = ref(false)

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

// 页面加载时获取数据
await fetchTeacherData()

// 监听错误
watch(error, (newError) => {
  if (newError) {
    console.error('Teacher Dashboard Error:', newError)
  }
})
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