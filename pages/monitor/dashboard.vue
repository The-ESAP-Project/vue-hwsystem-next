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
        <div class="relative mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            v-for="stat in stats" 
            :key="stat.label"
            class="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-600/50 transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ stat.label }}</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
              </div>
              <div :class="['p-3 rounded-xl', stat.bgColor]">
                <component :is="stat.icon" :class="['h-6 w-6', stat.iconColor]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 主体区域 -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        <!-- 左侧：日历和提交情况概览 -->
        <div class="xl:col-span-1 space-y-6">
          <!-- 日历 -->
          <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-200 hover:shadow-xl">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ $t('dashboard.calendar') || '日历' }}
              </h2>
              <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div class="flex items-center gap-1">
                  <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                  {{ $t('dashboard.submitted') || '已提交' }}
                </div>
                <div class="flex items-center gap-1">
                  <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  {{ $t('dashboard.pending') || '待提交' }}
                </div>
              </div>
            </div>
            <div id="calendar" class="calendar-container"></div>
          </div>

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
          <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all duration-200 hover:shadow-xl">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                  {{ $t('dashboard.assignments') || '作业列表' }}
                </h2>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ assignments.length }} {{ $t('dashboard.total') || '项' }}
                </span>
              </div>
            </div>

            <div class="max-h-[600px] overflow-y-auto">
              <!-- 列表视图 -->
              <div v-if="isListView" class="divide-y divide-gray-100 dark:divide-gray-700">
                <div
                  v-for="assignment in assignments"
                  :key="assignment.id"
                  class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group cursor-pointer"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-3">
                        <div :class="statusIndicatorClass(assignment.status)"></div>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                          {{ assignment.title }}
                        </h3>
                        <div class="flex items-center gap-2 px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                          <UsersIcon class="h-3 w-3" />
                          <span class="text-xs font-medium">{{ assignment.classSubmitted }}/{{ assignment.classTotal }}</span>
                        </div>
                      </div>
                      
                      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
                        <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <CalendarIcon class="h-4 w-4" />
                          {{ $t('dashboard.assigned') || '布置' }}: {{ assignment.assignDate }}
                        </div>
                        <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <ClockIcon class="h-4 w-4" />
                          {{ $t('dashboard.due') || '截止' }}: {{ assignment.dueDate }}
                        </div>
                        <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <ArrowPathIcon class="h-4 w-4" />
                          {{ $t('dashboard.attempts') || '提交次数' }}: {{ assignment.attempts }}
                        </div>
                        <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <ChartBarIcon class="h-4 w-4" />
                          班级进度: {{ Math.round((assignment.classSubmitted / assignment.classTotal) * 100) }}%
                        </div>
                      </div>
                    </div>
                    
                    <div class="ml-4 flex flex-col items-end gap-2">
                      <span :class="statusBadgeClass(assignment.status)">
                        {{ assignment.status === 'submitted' ? '已提交' : '未提交' }}
                      </span>
                      
                      <div class="flex items-center gap-1">
                        <button 
                          @click="viewClassSubmissions(assignment)"
                          class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                        >
                          <UsersIcon class="h-3 w-3" />
                          班级情况
                        </button>
                        
                        <button class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200">
                          {{ $t('dashboard.viewDetails') || '查看详情' }}
                          <ChevronRightIcon class="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 网格视图 -->
              <div v-else class="p-6">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div
                    v-for="assignment in assignments"
                    :key="assignment.id"
                    class="relative group bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    <div class="absolute top-4 right-4">
                      <div :class="statusIndicatorClass(assignment.status)"></div>
                    </div>
                    
                    <div class="mb-4">
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 pr-8">
                        {{ assignment.title }}
                      </h3>
                      
                      <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div class="flex items-center gap-2">
                          <CalendarIcon class="h-4 w-4" />
                          {{ assignment.assignDate }} - {{ assignment.dueDate }}
                        </div>
                        <div class="flex items-center gap-2">
                          <ArrowPathIcon class="h-4 w-4" />
                          {{ assignment.attempts }} 次提交
                        </div>
                        <div class="flex items-center gap-2">
                          <UsersIcon class="h-4 w-4" />
                          班级: {{ assignment.classSubmitted }}/{{ assignment.classTotal }} 已提交
                        </div>
                      </div>
                    </div>
                    
                    <div class="flex items-center justify-between">
                      <span :class="statusBadgeClass(assignment.status)">
                        {{ assignment.status === 'submitted' ? '已提交' : '未提交' }}
                      </span>
                      
                      <div class="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all duration-200">
                        <button 
                          @click="viewClassSubmissions(assignment)"
                          class="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                        >
                          <UsersIcon class="h-3 w-3" />
                        </button>
                        <button class="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200">
                          查看
                          <ChevronRightIcon class="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

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

// 初始化日历
onMounted(() => {
  const calendarEl = document.getElementById('calendar')
  if (calendarEl) {
    const calendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      locale: 'zh-cn',
      height: 'auto',
      events: assignments.value.map(assignment => ({
        title: assignment.title,
        start: assignment.dueDate,
        className: assignment.status === 'submitted' ? 'submitted' : 'pending',
        display: 'background',
        extendedProps: { status: assignment.status, title: assignment.title, dueDate: assignment.dueDate }
      })),
      headerToolbar: { left: 'prev,next', center: 'title', right: '' },
      buttonText: { today: '今' },
      eventDidMount: function(info) {
        const dayNumber = info.el.closest('.fc-daygrid-day').querySelector('.fc-daygrid-day-number')
        if (dayNumber) {
          dayNumber.classList.add('has-assignment', info.event.extendedProps.status)
          dayNumber.title = `${info.event.extendedProps.title} - 截止日期：${info.event.extendedProps.dueDate}`
        }
      }
    })
    calendar.render()
  }
})
</script>

<style scoped>
.calendar-container {
  width: 100%;
  font-family: system-ui, -apple-system, sans-serif;
  background: transparent;
  border-radius: 16px;
  overflow: hidden;
}

:deep(.fc) {
  background: transparent;
  border: none;
  color: #374151;
  transition: all 0.2s;
}

.dark :deep(.fc) {
  color: #f3f4f6;
}

:deep(.fc-toolbar) {
  margin-bottom: 1rem;
  padding: 0;
  background: transparent;
}

:deep(.fc-toolbar-title) {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  transition: color 0.2s;
}

.dark :deep(.fc-toolbar-title) {
  color: #f3f4f6;
}

:deep(.fc-button-primary) {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  padding: 0;
  font-size: 0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
  box-shadow: none;
}

.dark :deep(.fc-button-primary) {
  background: #4b5563;
  border-color: #6b7280;
}

:deep(.fc-button-primary:hover) {
  background: #e5e7eb;
  border-color: #d1d5db;
  transform: none;
  box-shadow: none;
}

.dark :deep(.fc-button-primary:hover) {
  background: #6b7280;
  border-color: #9ca3af;
}

:deep(.fc-prev-button::after) {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-30%, -50%);
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 7px solid #6b7280;
  transition: border-color 0.2s;
}

:deep(.fc-next-button::after) {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-70%, -50%);
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 7px solid #6b7280;
  transition: border-color 0.2s;
}

:deep(.fc-col-header-cell-cushion) {
  color: #6b7280;
  font-weight: 500;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

:deep(.fc-daygrid-day-number) {
  padding: 0;
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin: 0 auto;
  transition: all 0.2s ease;
  border-radius: 8px;
}

.dark :deep(.fc-daygrid-day-number) {
  color: #f3f4f6;
}

:deep(.fc-daygrid-day-number.has-assignment) {
  background: #3b82f6;
  color: white;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

:deep(.fc-daygrid-day-number.has-assignment:hover) {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
}

:deep(.fc-daygrid-day-number.submitted) {
  background: #10b981;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
}

:deep(.fc-daygrid-day-number.pending) {
  background: #f59e0b;
  box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
}

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