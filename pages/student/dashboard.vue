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
          <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all duration-200 hover:shadow-xl">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                  {{ $t('dashboard.assignments') || '作业列表' }}
                </h2>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    {{ assignments.length }} {{ $t('dashboard.total') || '项' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="max-h-[600px] overflow-y-auto">
              <div v-if="isListView" class="divide-y divide-gray-100 dark:divide-gray-700">
                <!-- 现代化列表视图 -->
                <div
                  v-for="assignment in assignments"
                  :key="assignment.id"
                  class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group cursor-pointer"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-3">
                        <div 
                          :class="[
                            'w-3 h-3 rounded-full',
                            assignment.status === 'submitted' ? 'bg-green-500' : 'bg-yellow-500'
                          ]"
                        ></div>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                          {{ assignment.title }}
                        </h3>
                      </div>
                      
                      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
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
                      </div>
                    </div>
                    
                    <div class="ml-4 flex flex-col items-end gap-2">
                      <span
                        :class="[
                          'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200',
                          assignment.status === 'submitted'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                        ]"
                      >
                        {{ assignment.status === 'submitted' 
                          ? ($t('dashboard.submitted') || '已提交') 
                          : ($t('dashboard.pending') || '未提交') 
                        }}
                      </span>
                      
                      <button class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200">
                        {{ $t('dashboard.viewDetails') || '查看详情' }}
                        <ChevronRightIcon class="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else class="p-6">
                <!-- 现代化网格视图 -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div
                    v-for="assignment in assignments"
                    :key="assignment.id"
                    class="relative group bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    <!-- 状态指示器 -->
                    <div class="absolute top-4 right-4">
                      <div 
                        :class="[
                          'w-3 h-3 rounded-full',
                          assignment.status === 'submitted' ? 'bg-green-500' : 'bg-yellow-500'
                        ]"
                      ></div>
                    </div>
                    
                    <div class="mb-4">
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 pr-8">
                        {{ assignment.title }}
                      </h3>
                      
                      <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div class="flex items-center gap-2">
                          <CalendarIcon class="h-4 w-4" />
                          {{ assignment.assignDate }}
                        </div>
                        <div class="flex items-center gap-2">
                          <ClockIcon class="h-4 w-4" />
                          {{ assignment.dueDate }}
                        </div>
                        <div class="flex items-center gap-2">
                          <ArrowPathIcon class="h-4 w-4" />
                          {{ assignment.attempts }} 次提交
                        </div>
                      </div>
                    </div>
                    
                    <div class="flex items-center justify-between">
                      <span
                        :class="[
                          'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                          assignment.status === 'submitted'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                        ]"
                      >
                        {{ assignment.status === 'submitted' ? '已提交' : '未提交' }}
                      </span>
                      
                      <button class="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200">
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
  const dueDate = new Date(assignment.dueDate)
  const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'overdue'
  if (diffDays <= 3) return 'urgent'
  if (diffDays <= 7) return 'warning'
  return 'normal'
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
    label: t('dashboard.pending') || '待提交',
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
    assignDate: '2025-06-05',
    dueDate: '2025-06-15',
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