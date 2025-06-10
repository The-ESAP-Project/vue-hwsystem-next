<template>
  <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all duration-200 hover:shadow-xl">
    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ title || $t('dashboard.assignments') || '作业列表' }}
        </h2>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ filteredAndSortedAssignments.length }} {{ $t('dashboard.total') || '项' }}
          </span>
          <slot name="header-actions"></slot>
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

    <div class="max-h-[600px] overflow-y-auto">
      <div v-if="isListView" class="divide-y divide-gray-100 dark:divide-gray-700">
        <!-- 列表视图 -->
        <div
          v-for="assignment in filteredAndSortedAssignments"
          :key="assignment.id"
          :class="[
            'p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group cursor-pointer',
            getAssignmentRowClass(assignment)
          ]"
          @click="$emit('assignment-click', assignment)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-3">
                <div :class="getStatusIndicatorClass(assignment)"></div>
                <h3 :class="[
                  'text-lg font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200',
                  getAssignmentTitleClass(assignment)
                ]">
                  {{ assignment.title }}
                  <!-- 只在紧急或过期时显示额外的状态标签 -->
                  <span v-if="isOverdue(assignment)" class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 animate-pulse">
                    已过期
                  </span>
                  <span v-else-if="isUrgent(assignment)" class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 animate-pulse">
                    紧急
                  </span>
                </h3>
                <!-- 班级进度显示 -->
                <div v-if="showClassProgress" class="flex items-center gap-2 px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                  <UsersIcon class="h-3 w-3" />
                  <span class="text-xs font-medium">{{ assignment.classSubmitted || assignment.submitted }}/{{ assignment.classTotal || assignment.totalStudents }}</span>
                </div>
                <!-- 只在 showStatusBadge 为 true 且不是紧急/过期状态时显示普通状态标签 -->
                <span v-if="showStatusBadge && !isOverdue(assignment) && !isUrgent(assignment)" :class="getStatusBadgeClass(assignment)">
                  {{ getStatusText(assignment) }}
                </span>
              </div>
              
              <div :class="['grid gap-4 text-sm', gridCols]">
                <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <CalendarIcon class="h-4 w-4" />
                  {{ $t('dashboard.assigned') || '布置' }}: {{ assignment.assignDate }}
                </div>
                <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <ClockIcon class="h-4 w-4" />
                  {{ $t('dashboard.due') || '截止' }}: {{ assignment.dueDate }}
                </div>
                <div v-if="showAttempts" class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <ArrowPathIcon class="h-4 w-4" />
                  {{ $t('dashboard.attempts') || '提交次数' }}: {{ assignment.attempts }}
                </div>
                <div v-if="showProgress" class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <ChartBarIcon class="h-4 w-4" />
                  {{ progressLabel }}: {{ getProgressPercentage(assignment) }}%
                </div>
              </div>
            </div>
            
            <div class="ml-4 flex flex-col items-end gap-2">
              <!-- 删除右侧重复的状态标签，只保留操作按钮 -->
              <div class="flex items-center gap-1">
                <slot name="assignment-actions" :assignment="assignment">
                  <button class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200">
                    {{ $t('dashboard.viewDetails') || '查看详情' }}
                    <ChevronRightIcon class="h-3 w-3" />
                  </button>
                </slot>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="p-6">
        <!-- 网格视图 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            v-for="assignment in filteredAndSortedAssignments"
            :key="assignment.id"
            :class="[
              'relative group bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer',
              getAssignmentCardClass(assignment),
              getCardHoverClass(assignment)
            ]"
            @click="$emit('assignment-click', assignment)"
          >
            <div class="absolute top-4 right-4">
              <div :class="getStatusIndicatorClass(assignment)"></div>
              <div v-if="isOverdue(assignment)" class="absolute top-0 left-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
              <div v-else-if="isUrgent(assignment)" class="absolute top-0 left-0 w-3 h-3 bg-orange-500 rounded-full animate-ping"></div>
            </div>
            
            <div class="mb-4">
              <h3 :class="[
                'text-lg font-semibold mb-2 pr-8',
                getAssignmentTitleClass(assignment)
              ]">
                {{ assignment.title }}
                <!-- 网格视图中不在标题后显示状态标签，避免重复 -->
              </h3>
              
              <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div class="flex items-center gap-2">
                  <CalendarIcon class="h-4 w-4" />
                  {{ assignment.assignDate }} - {{ assignment.dueDate }}
                </div>
                <div v-if="showAttempts" class="flex items-center gap-2">
                  <ArrowPathIcon class="h-4 w-4" />
                  {{ assignment.attempts }} 次提交
                </div>
                <div v-if="showClassProgress" class="flex items-center gap-2">
                  <UsersIcon class="h-4 w-4" />
                  {{ classProgressLabel }}: {{ assignment.classSubmitted || assignment.submitted }}/{{ assignment.classTotal || assignment.totalStudents }} 已提交
                </div>
                <div v-if="showProgress" class="flex items-center gap-2">
                  <ChartBarIcon class="h-4 w-4" />
                  {{ getProgressPercentage(assignment) }}% 完成率
                </div>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <!-- 删除网格视图底部重复的状态标签 -->
              <div></div>
              
              <div class="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all duration-200">
                <slot name="grid-actions" :assignment="assignment">
                  <button class="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200">
                    查看
                    <ChevronRightIcon class="h-3 w-3" />
                  </button>
                </slot>
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
  CalendarIcon, 
  ClockIcon, 
  ArrowPathIcon,
  ChevronRightIcon,
  ChartBarIcon,
  UsersIcon
} from '@heroicons/vue/24/outline'

interface Assignment {
  id: string | number
  title: string
  assignDate: string
  dueDate: string
  status: string
  attempts?: number
  submitted?: number
  totalStudents?: number
  classSubmitted?: number
  classTotal?: number
}

interface Props {
  title?: string
  assignments: Assignment[]
  isListView: boolean
  showAttempts?: boolean
  showProgress?: boolean
  showClassProgress?: boolean
  showStatusBadge?: boolean
  progressLabel?: string
  classProgressLabel?: string
  statusColors?: Record<string, string>
  statusBadgeColors?: Record<string, string>
  statusTexts?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  showAttempts: true,
  showProgress: false,
  showClassProgress: false,
  showStatusBadge: false,
  progressLabel: '进度',
  classProgressLabel: '班级',
  statusColors: () => ({
    submitted: 'bg-green-500',
    pending: 'bg-yellow-500',
    active: 'bg-green-500',
    draft: 'bg-gray-500',
    closed: 'bg-blue-500'
  }),
  statusBadgeColors: () => ({
    submitted: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
    active: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
    draft: 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200',
    closed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
  }),
  statusTexts: () => ({
    submitted: '已提交',
    pending: '未提交',
    active: '进行中',
    draft: '草稿',
    closed: '已结束'
  })
})

const { t } = useI18n()

defineEmits<{
  'assignment-click': [assignment: Assignment]
}>()

const gridCols = computed(() => {
  let cols = 'grid-cols-1 sm:grid-cols-2'
  if (props.showAttempts && props.showProgress) {
    cols = 'grid-cols-1 sm:grid-cols-4'
  } else if (props.showAttempts || props.showProgress) {
    cols = 'grid-cols-1 sm:grid-cols-3'
  }
  return cols
})

// 新增方法
const isUrgent = (assignment: Assignment) => {
  // 检查是否为紧急状态
  if (assignment.status === 'submitted') return false
  
  const now = new Date()
  now.setHours(0, 0, 0, 0) // 重置到当天00:00:00
  
  const dueDate = new Date(assignment.dueDate + 'T00:00:00') // 确保使用本地时间
  const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  return diffDays <= 3 && diffDays >= 0
}

const isOverdue = (assignment: Assignment) => {
  // 检查是否已过期
  if (assignment.status === 'submitted' || assignment.status === 'closed') return false
  
  const now = new Date()
  now.setHours(23, 59, 59, 999) // 设置到当天的最后一刻
  
  const dueDate = new Date(assignment.dueDate + 'T23:59:59') // 设置到截止日的最后一刻
  return dueDate < now
}

// 筛选状态
const selectedFilter = ref('all')

// 筛选选项
const filterOptions = computed(() => [
  { 
    label: '全部', 
    value: 'all', 
    count: props.assignments.length 
  },
  { 
    label: '紧急', 
    value: 'urgent', 
    count: props.assignments.filter(a => isUrgent(a)).length 
  },
  { 
    label: '过期', 
    value: 'overdue', 
    count: props.assignments.filter(a => isOverdue(a)).length 
  },
  { 
    label: '待完成', 
    value: 'pending', 
    count: props.assignments.filter(a => a.status === 'pending' || a.status === 'active' || a.status === 'draft').length 
  },
  { 
    label: '已完成', 
    value: 'completed', 
    count: props.assignments.filter(a => a.status === 'submitted' || a.status === 'closed').length 
  }
])

// 筛选逻辑
const filteredAssignments = computed(() => {
  switch (selectedFilter.value) {
    case 'urgent':
      return props.assignments.filter(a => isUrgent(a))
    case 'overdue':
      return props.assignments.filter(a => isOverdue(a))
    case 'pending':
      return props.assignments.filter(a => a.status === 'pending' || a.status === 'active' || a.status === 'draft')
    case 'completed':
      return props.assignments.filter(a => a.status === 'submitted' || a.status === 'closed')
    default:
      return props.assignments
  }
})

// 排序逻辑：过期 -> 紧急 -> 普通未完成 -> 已完成
const filteredAndSortedAssignments = computed(() => {
  return [...filteredAssignments.value].sort((a, b) => {
    const aOverdue = isOverdue(a)
    const bOverdue = isOverdue(b)
    const aUrgent = isUrgent(a)
    const bUrgent = isUrgent(b)
    const aCompleted = a.status === 'submitted' || a.status === 'closed'
    const bCompleted = b.status === 'submitted' || b.status === 'closed'
    
    // 过期的排在最前面
    if (aOverdue && !bOverdue) return -1
    if (!aOverdue && bOverdue) return 1
    
    // 紧急的排在第二位
    if (aUrgent && !bUrgent) return -1
    if (!aUrgent && bUrgent) return 1
    
    // 已完成的排在最后面
    if (aCompleted && !bCompleted) return 1
    if (!aCompleted && bCompleted) return -1
    
    // 同类型内按截止日期排序
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })
})

const getAssignmentRowClass = (assignment: Assignment) => {
  if (isOverdue(assignment)) {
    return 'bg-red-100/50 dark:bg-red-900/20'
  }
  if (isUrgent(assignment)) {
    return 'bg-orange-50/50 dark:bg-orange-900/10'
  }
  return ''
}

const getAssignmentCardClass = (assignment: Assignment) => {
  if (isOverdue(assignment)) {
    return 'border-red-400 dark:border-red-600 bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20 shadow-red-300 dark:shadow-red-900/30'
  }
  if (isUrgent(assignment)) {
    return 'border-orange-300 dark:border-orange-700 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 shadow-orange-200 dark:shadow-orange-900/20'
  }
  return ''
}

const getCardHoverClass = (assignment: Assignment) => {
  if (isOverdue(assignment)) {
    return 'hover:border-red-500 dark:hover:border-red-400'
  }
  if (isUrgent(assignment)) {
    return 'hover:border-orange-400 dark:hover:border-orange-300'
  }
  return 'hover:border-indigo-300 dark:hover:border-indigo-500'
}

const getAssignmentTitleClass = (assignment: Assignment) => {
  if (isOverdue(assignment)) {
    return 'text-red-900 dark:text-red-100'
  }
  if (isUrgent(assignment)) {
    return 'text-orange-900 dark:text-orange-100'
  }
  return 'text-gray-900 dark:text-white'
}

const getStatusIndicatorClass = (assignment: Assignment) => {
  const baseClasses = ['w-3 h-3 rounded-full']
  const statusColor = props.statusColors[assignment.status] || 'bg-gray-500'
  
  if (isOverdue(assignment)) {
    baseClasses.push('bg-red-500', 'animate-pulse', 'shadow-lg', 'shadow-red-500/50')
  } else if (isUrgent(assignment)) {
    baseClasses.push('bg-orange-500', 'animate-pulse', 'shadow-lg', 'shadow-orange-500/50')
  } else {
    baseClasses.push(statusColor)
  }
  
  return baseClasses
}

const getStatusBadgeClass = (assignment: Assignment) => {
  const baseClasses = ['inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200']
  
  if (isOverdue(assignment)) {
    baseClasses.push('bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700')
  } else if (isUrgent(assignment)) {
    baseClasses.push('bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border border-orange-300 dark:border-orange-700')
  } else {
    const statusBadgeColor = props.statusBadgeColors[assignment.status] || 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200'
    baseClasses.push(statusBadgeColor)
  }
  
  return baseClasses
}

const getStatusText = (assignment: Assignment) => {
  // 不在这里返回紧急/过期状态，这些在模板中单独处理
  return props.statusTexts[assignment.status] || assignment.status
}

const getProgressPercentage = (assignment: Assignment) => {
  const submitted = assignment.submitted || assignment.classSubmitted || 0
  const total = assignment.totalStudents || assignment.classTotal || 1
  return Math.round((submitted / total) * 100)
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
