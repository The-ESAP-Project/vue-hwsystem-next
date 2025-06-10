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
              {{ $t('monitor.dashboard.title') || '课代表工作台' }}
            </h1>
            <p class="mt-2 text-gray-600 dark:text-gray-300 text-lg">
              {{ $t('monitor.dashboard.subtitle') || '协助管理班级作业' }}
            </p>
          </div>
          
          <!-- 视图切换按钮 -->
          <div class="flex items-center bg-gray-100 dark:bg-gray-700 rounded-2xl p-1 transition-colors duration-200">
            <button 
              @click="isListView = true" 
              :class="viewButtonClass(isListView)"
            >
              <Bars4Icon class="h-4 w-4" />
              {{ $t('dashboard.listView') || '列表' }}
            </button>
            <button 
              @click="isListView = false" 
              :class="viewButtonClass(!isListView)"
            >
              <Squares2X2Icon class="h-4 w-4" />
              {{ $t('dashboard.gridView') || '网格' }}
            </button>
          </div>
        </div>

        <!-- 统计卡片 -->
        <StatsCards :stats="stats" />
      </div>

      <!-- 主体区域 -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        <!-- 左侧：日历和提交情况概览 -->
        <div class="xl:col-span-1 space-y-6">
          <!-- 日历 -->
          <Calendar 
            :events="calendarEvents"
            :legends="calendarLegends"
          />

          <!-- 提交情况概览 -->
          <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-200 hover:shadow-xl">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                {{ $t('monitor.dashboard.submissionOverview') || '提交情况概览' }}
              </h3>
              <button 
                @click="refreshSubmissionData"
                class="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <ArrowPathIcon class="h-4 w-4" />
              </button>
            </div>
            
            <div class="space-y-3">
              <div v-for="assignment in recentAssignments" :key="assignment.id" class="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate pr-2">
                    {{ assignment.title }}
                  </h4>
                  <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {{ assignment.dueDate }}
                  </span>
                </div>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 min-w-[60px]">
                      <div 
                        class="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300" 
                        :style="{ width: `${(assignment.submitted / assignment.totalStudents) * 100}%` }"
                      ></div>
                    </div>
                    <span class="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {{ assignment.submitted }}/{{ assignment.totalStudents }}
                    </span>
                  </div>
                  
                  <button 
                    @click="viewSubmissionDetails(assignment)"
                    class="ml-2 px-2 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200"
                  >
                    详情
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：作业列表 -->
        <div class="xl:col-span-2">
          <AssignmentList
            :assignments="assignments"
            :is-list-view="isListView"
            :show-attempts="true"
            :show-progress="true"
            :show-class-progress="true"
            progress-label="班级进度"
            @assignment-click="handleAssignmentClick"
          >
            <template #assignment-actions="{ assignment }">
              <button 
                @click.stop="viewClassSubmissions(assignment)"
                class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
              >
                <UsersIcon class="h-3 w-3" />
                班级情况
              </button>
              
              <button class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200">
                {{ $t('dashboard.viewDetails') || '查看详情' }}
                <ChevronRightIcon class="h-3 w-3" />
              </button>
            </template>
            
            <template #grid-actions="{ assignment }">
              <button 
                @click.stop="viewClassSubmissions(assignment)"
                class="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
              >
                <UsersIcon class="h-3 w-3" />
              </button>
              <button class="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200">
                查看
                <ChevronRightIcon class="h-3 w-3" />
              </button>
            </template>
          </AssignmentList>
        </div>
      </div>
    </div>

    <!-- 班级提交情况模态框 -->
    <ClassSubmissionModal 
      v-if="showSubmissionModal"
      :assignment="selectedAssignment"
      :students="classStudents"
      @close="showSubmissionModal = false"
    />
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
  ChartBarIcon,
  UsersIcon
} from '@heroicons/vue/24/outline'
import Calendar from '@/components/Calendar.vue'
import StatsCards from '@/components/StatsCards.vue'
import AssignmentList from '@/components/AssignmentList.vue'

// i18n
const { t } = useI18n()
const localePath = useLocalePath()

// 页面元信息
useHead({
  title: t('monitor.dashboard.title'),
  titleTemplate: '%s | ' + t('home.title'),
  meta: [
    { name: 'description', content: t('monitor.dashboard.subtitle') },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

definePageMeta({
  layout: 'app',
  auth: false,
  keepalive: false
})

// 视图模式切换
const isListView = ref(true)
const showSubmissionModal = ref(false)
const selectedAssignment = ref(null)

// 模拟数据
const assignments = ref([
  { id: 1, title: '数学习题集第一章', assignDate: '2025-05-29', dueDate: '2025-06-07', status: 'submitted', attempts: 1, classSubmitted: 28, classTotal: 35 },
  { id: 2, title: '英语口语作业', assignDate: '2025-06-01', dueDate: '2025-06-28', status: 'pending', attempts: 0, classSubmitted: 15, classTotal: 35 },
  { id: 3, title: '物理实验报告', assignDate: '2025-06-03', dueDate: '2025-06-12', status: 'pending', attempts: 0, classSubmitted: 8, classTotal: 35 }
])

const classStudents = ref([
  { id: 1, name: '张三', submitted: true, submitTime: '2025-06-02 14:30' },
  { id: 2, name: '李四', submitted: true, submitTime: '2025-06-02 15:45' },
  { id: 3, name: '王五', submitted: false, submitTime: null }
])

// 计算属性
const recentAssignments = computed(() => 
  assignments.value.slice(0, 3).map(a => ({
    ...a,
    submitted: a.classSubmitted,
    totalStudents: a.classTotal
  }))
)

const stats = computed(() => [
  { label: '总作业数', value: assignments.value.length, icon: AcademicCapIcon, bgColor: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400' },
  { label: '我已完成', value: assignments.value.filter(a => a.status === 'submitted').length, icon: CheckCircleIcon, bgColor: 'bg-green-100 dark:bg-green-900/30', iconColor: 'text-green-600 dark:text-green-400' },
  { label: '班级平均进度', value: Math.round(assignments.value.reduce((acc, a) => acc + (a.classSubmitted / a.classTotal), 0) / assignments.value.length * 100) + '%', icon: ChartBarIcon, bgColor: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600 dark:text-purple-400' },
  { label: '待提醒同学', value: assignments.value.reduce((acc, a) => acc + (a.classTotal - a.classSubmitted), 0), icon: ExclamationTriangleIcon, bgColor: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-600 dark:text-orange-400' }
])

// 样式类方法
const viewButtonClass = (isActive: boolean) => [
  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
  isActive 
    ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-lg transform scale-105' 
    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
]

const statusIndicatorClass = (status: string) => [
  'w-3 h-3 rounded-full',
  status === 'submitted' ? 'bg-green-500' : 'bg-yellow-500'
]

const statusBadgeClass = (status: string) => [
  'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200',
  status === 'submitted'
    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
]

// 方法
const viewClassSubmissions = (assignment) => {
  selectedAssignment.value = assignment
  showSubmissionModal.value = true
}

const viewSubmissionDetails = (assignment) => {
  viewClassSubmissions(assignment)
}

const refreshSubmissionData = () => {
  console.log('刷新提交数据...')
}

// 日历事件数据
const calendarEvents = computed(() => 
  assignments.value.map(assignment => ({
    id: assignment.id,
    title: assignment.title,
    start: assignment.dueDate,
    className: assignment.status === 'submitted' ? 'submitted' : 'pending',
    extendedProps: {
      status: assignment.status === 'submitted' ? 'submitted' : 'pending',
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
    label: t('dashboard.pending') || '待提交',
    color: 'bg-yellow-500'
  }
])

const handleAssignmentClick = (assignment) => {
  console.log('点击作业:', assignment)
}
</script>

<style scoped>
/* 删除所有日历相关的样式 */
</style>