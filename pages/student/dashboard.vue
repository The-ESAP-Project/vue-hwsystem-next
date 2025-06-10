<script setup lang="ts">
import { Bars4Icon, Squares2X2Icon, FunnelIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { ref, onMounted, computed, watch } from 'vue'

// 视图模式切换
const isListView = ref(true)

// 筛选功能状态
const showFilters = ref(false)
const filters = ref({
  subject: '',
  status: '',
  urgency: '',
  dateRange: '',
  customStartDate: '',
  customEndDate: ''
})

// Tooltip状态
const tooltip = ref({
  show: false,
  x: 0,
  y: 0,
  content: '',
  assignments: []
})

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

// 获取状态显示文本
const getStatusText = (assignment) => {
  const status = getEventStatus(assignment)
  switch (status) {
    case 'submitted': return '已提交'
    case 'overdue': return '已逾期'
    case 'urgent': return '紧急'
    case 'warning': return '警告'
    default: return '正常'
  }
}

// 定义学科颜色映射
const subjectColors = {
  '数学': { bg: '#E8F5E9', text: '#2E7D32' },
  '英语': { bg: '#E3F2FD', text: '#1565C0' },
  '物理': { bg: '#FFF3E0', text: '#EF6C00' },
  '化学': { bg: '#F3E5F5', text: '#7B1FA2' },
  '生物': { bg: '#E8EAF6', text: '#303F9F' },
  '历史': { bg: '#FFEBEE', text: '#C62828' },
  '地理': { bg: '#E0F2F1', text: '#00695C' },
  '政治': { bg: '#FBE9E7', text: '#D84315' }
}

// 获取状态颜色
const getStatusColor = (assignment) => {
  const status = getEventStatus(assignment)
  switch (status) {
    case 'submitted': return 'bg-green-100 text-green-800'
    case 'overdue': return 'bg-red-100 text-red-800'
    case 'urgent': return 'bg-orange-100 text-orange-800'
    case 'warning': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-blue-100 text-blue-800'
  }
}

// 获取学科标签样式
const getSubjectStyle = (subject: string) => {
  const color = subjectColors[subject] || { bg: '#F3F4F6', text: '#374151' }
  return {
    backgroundColor: color.bg,
    color: color.text
  }
}

// 清空筛选条件
const clearFilters = () => {
  filters.value = {
    subject: '',
    status: '',
    urgency: '',
    dateRange: '',
    customStartDate: '',
    customEndDate: ''
  }
}

// 检查是否有激活的筛选条件
const hasActiveFilters = computed(() => {
  return Object.values(filters.value).some(value => value !== '')
})

// 显示tooltip
const showTooltip = (event, dayAssignments) => {
  tooltip.value = {
    show: true,
    x: event.clientX + 10,
    y: event.clientY - 10,
    assignments: dayAssignments
  }
}

// 隐藏tooltip
const hideTooltip = () => {
  tooltip.value.show = false
}

// 模拟作业数据
const assignments = ref([
  {
    id: 1,
    title: '数学习题集第一章',
    subject: '数学',
    assignDate: '2025-05-29',
    dueDate: '2025-06-07',
    submitTime: '2025-06-02 14:30',
    status: 'submitted'
  },
  {
    id: 2,
    title: '英语口语作业',
    subject: '英语',
    assignDate: '2025-06-01',
    dueDate: '2025-06-28',
    submitTime: null,
    status: 'pending'
  },
  {
    id: 3,
    title: '物理实验报告',
    subject: '物理',
    assignDate: '2025-06-03',
    dueDate: '2025-06-12',
    submitTime: null,
    status: 'pending'
  },
  {
    id: 4,
    title: '化学作业第二章',
    subject: '化学',
    assignDate: '2025-06-05',
    dueDate: '2025-06-15',
    submitTime: null,
    status: 'pending'
  },
  {
    id: 5,
    title: '生物实验观察报告',
    subject: '生物',
    assignDate: '2025-06-08',
    dueDate: '2025-06-20',
    submitTime: null,
    status: 'pending'
  },
  {
    id: 6,
    title: '历史朝代整理',
    subject: '历史',
    assignDate: '2025-06-10',
    dueDate: '2025-06-25',
    submitTime: null,
    status: 'pending'
  }
])

// 筛选后的作业列表
const filteredAssignments = computed(() => {
  let filtered = assignments.value

  // 按学科筛选
  if (filters.value.subject) {
    filtered = filtered.filter(assignment => assignment.subject === filters.value.subject)
  }

  // 按提交状态筛选
  if (filters.value.status) {
    filtered = filtered.filter(assignment => {
      if (filters.value.status === 'submitted') {
        return assignment.status === 'submitted'
      } else if (filters.value.status === 'pending') {
        return assignment.status === 'pending'
      }
      return true
    })
  }

  // 按紧急程度筛选
  if (filters.value.urgency) {
    filtered = filtered.filter(assignment => {
      const urgency = getEventStatus(assignment)
      return urgency === filters.value.urgency
    })
  }

  // 按日期范围筛选
  if (filters.value.dateRange) {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    filtered = filtered.filter(assignment => {
      const dueDate = new Date(assignment.dueDate)

      switch (filters.value.dateRange) {
        case 'today':
          return dueDate.toDateString() === today.toDateString()
        case 'week':
          const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
          return dueDate >= today && dueDate <= weekEnd
        case 'month':
          const monthEnd = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
          return dueDate >= today && dueDate <= monthEnd
        case 'overdue':
          return dueDate < today && assignment.status !== 'submitted'
        default:
          return true
      }
    })
  }

  // 按自定义日期范围筛选
  if (filters.value.customStartDate && filters.value.customEndDate) {
    const startDate = new Date(filters.value.customStartDate)
    const endDate = new Date(filters.value.customEndDate)
    filtered = filtered.filter(assignment => {
      const dueDate = new Date(assignment.dueDate)
      return dueDate >= startDate && dueDate <= endDate
    })
  }

  return filtered
})

// 获取唯一学科列表
const subjects = computed(() => {
  return [...new Set(assignments.value.map(assignment => assignment.subject))]
})

let calendar = null

// 初始化日历
const initCalendar = () => {
  const calendarEl = document.getElementById('calendar')
  if (calendarEl && !calendar) {
    calendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      locale: 'zh-cn',
      height: 'auto',
      events: [],
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: ''
      },
      buttonText: {
        today: '今'
      },
      dayCellContent: function(arg) {
        return arg.dayNumberText.replace('日', '')
      },
      eventDidMount: function(info) {
        // 为有作业的日期添加圆形样式和自定义事件
        const dayNumber = info.el.closest('.fc-daygrid-day').querySelector('.fc-daygrid-day-number')
        if (dayNumber) {
          dayNumber.classList.add('has-assignment', info.event.extendedProps.status)

          // 获取该日期的所有作业
          const dayAssignments = filteredAssignments.value.filter(assignment => assignment.dueDate === info.event.extendedProps.dueDate)

          // 添加鼠标事件
          dayNumber.addEventListener('mouseenter', (e) => {
            showTooltip(e, dayAssignments)
          })

          dayNumber.addEventListener('mouseleave', () => {
            hideTooltip()
          })

          dayNumber.addEventListener('mousemove', (e) => {
            if (tooltip.value.show) {
              tooltip.value.x = e.clientX + 10
              tooltip.value.y = e.clientY - 10
            }
          })
        }
      },
      datesSet: function() {
        // 日历渲染完成后，移除今天日期的默认样式
        setTimeout(() => {
          const todayElements = calendarEl.querySelectorAll('.fc-day-today')
          todayElements.forEach(el => {
            el.style.backgroundColor = 'white'
            el.style.background = 'white'

            const dayFrame = el.querySelector('.fc-daygrid-day-frame')
            if (dayFrame) {
              dayFrame.style.backgroundColor = 'white'
              dayFrame.style.background = 'white'
            }
          })
        }, 0)
      }
    })
    calendar.render()
  }
}

// 更新日历事件
const updateCalendarEvents = () => {
  if (calendar) {
    const events = filteredAssignments.value.map(assignment => ({
      title: assignment.title,
      start: assignment.dueDate,
      className: getEventStatus(assignment),
      display: 'background',
      extendedProps: {
        status: getEventStatus(assignment),
        title: assignment.title,
        dueDate: assignment.dueDate,
        assignment: assignment
      }
    }))

    calendar.removeAllEvents()
    calendar.addEventSource(events)
  }
}

// 监听筛选条件变化，更新日历
watch(filteredAssignments, () => {
  updateCalendarEvents()
}, { deep: true })

onMounted(() => {
  initCalendar()
  updateCalendarEvents()
})

</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- 头部区域 -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-semibold text-gray-900">作业仪表盘</h1>
          <div class="flex space-x-2">
            <!-- 筛选按钮 -->
            <button
                @click="showFilters = !showFilters"
                :class="[
                'p-2 rounded-md flex items-center space-x-1',
                showFilters || hasActiveFilters ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700'
              ]"
            >
              <FunnelIcon class="h-5 w-5" />
              <span v-if="hasActiveFilters" class="text-xs bg-indigo-600 text-white rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center">
                {{ Object.values(filters).filter(v => v !== '').length }}
              </span>
            </button>
            <!-- 视图切换按钮 -->
            <button @click="isListView = true" :class="['p-2 rounded-md', isListView ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700']">
              <Bars4Icon class="h-5 w-5" />
            </button>
            <button @click="isListView = false" :class="['p-2 rounded-md', !isListView ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700']">
              <Squares2X2Icon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- 筛选面板 -->
      <div v-if="showFilters" class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">筛选条件</h2>
          <div class="flex space-x-2">
            <button
                @click="clearFilters"
                v-if="hasActiveFilters"
                class="px-3 py-1 text-sm text-gray-700 hover:text-gray-900 flex items-center space-x-1"
            >
              <XMarkIcon class="h-4 w-4" />
              <span>清空筛选</span>
            </button>
            <button
                @click="showFilters = false"
                class="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- 学科筛选 -->
          <div>
            <label class="block text-sm font-medium text-gray-800 mb-2">学科</label>
            <select v-model="filters.subject" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="">全部学科</option>
              <option v-for="subject in subjects" :key="subject" :value="subject">{{ subject }}</option>
            </select>
          </div>

          <!-- 提交状态筛选 -->
          <div>
            <label class="block text-sm font-medium text-gray-800 mb-2">提交状态</label>
            <select v-model="filters.status" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="">全部状态</option>
              <option value="submitted">已提交</option>
              <option value="pending">未提交</option>
            </select>
          </div>

          <!-- 紧急程度筛选 -->
          <div>
            <label class="block text-sm font-medium text-gray-800 mb-2">紧急程度</label>
            <select v-model="filters.urgency" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="">全部程度</option>
              <option value="overdue">已逾期</option>
              <option value="urgent">紧急</option>
              <option value="warning">警告</option>
              <option value="normal">正常</option>
              <option value="submitted">已完成</option>
            </select>
          </div>

          <!-- 日期范围筛选 -->
          <div>
            <label class="block text-sm font-medium text-gray-800 mb-2">日期范围</label>
            <select v-model="filters.dateRange" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="">全部日期</option>
              <option value="today">今天到期</option>
              <option value="week">一周内</option>
              <option value="month">一月内</option>
              <option value="overdue">已逾期</option>
            </select>
          </div>
        </div>

        <!-- 自定义日期范围 -->
        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-800 mb-2">自定义开始日期</label>
            <input
                type="date"
                v-model="filters.customStartDate"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-800 mb-2">自定义结束日期</label>
            <input
                type="date"
                v-model="filters.customEndDate"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- 筛选结果统计 -->
        <div class="mt-4 pt-4 border-t border-gray-200">
          <p class="text-sm text-gray-700">
            显示 <span class="font-medium text-indigo-600">{{ filteredAssignments.length }}</span> 项作业
            <span v-if="filteredAssignments.length !== assignments.length" class="text-gray-600">
              / 共 {{ assignments.length }} 项
            </span>
          </p>
        </div>
      </div>

      <!-- 主体区域：日历在左，作业列表在右 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 日历区域（左侧） -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div id="calendar" class="calendar-container"></div>
          </div>
        </div>
        <!-- 作业列表区域（右侧，占两列） -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-sm h-full flex flex-col">
            <!-- 列表视图 -->
            <div v-if="isListView">
              <div v-if="filteredAssignments.length === 0" class="p-6 text-center text-gray-600">
                <p class="text-lg">没有找到符合条件的作业</p>
                <p class="text-sm mt-1 text-gray-700">请尝试调整筛选条件</p>
              </div>
              <div v-else class="divide-y divide-gray-200">
                <div
                    v-for="assignment in filteredAssignments"
                    :key="assignment.id"
                    class="p-6"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="text-lg font-medium text-gray-900">
                        {{ assignment.title }}
                      </h3>
                      <div class="mt-2 text-sm text-gray-700 space-y-1">
                        <div class="flex items-center space-x-2">
                          <span
                              class="px-2 py-1 rounded-full text-sm"
                              :style="getSubjectStyle(assignment.subject)"
                          >
                            {{ assignment.subject }}
                          </span>
                          <span
                              :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusColor(assignment)]"
                          >
                            {{ getStatusText(assignment) }}
                          </span>
                        </div>
                        <p class="text-gray-800">下发时间: {{ assignment.assignDate }}</p>
                        <p class="text-gray-800">截止时间: {{ assignment.dueDate }}</p>
                      </div>
                    </div>
                    <div
                        :class="[
                        'px-3 py-1 rounded-full text-sm',
                        assignment.status === 'submitted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      ]"
                    >
                      {{ assignment.status === 'submitted' ? `已提交 (${assignment.submitTime})` : '未提交' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 网格视图 -->
            <div v-else class="p-6">
              <div v-if="filteredAssignments.length === 0" class="text-center text-gray-600">
                <p class="text-lg">没有找到符合条件的作业</p>
                <p class="text-sm mt-1 text-gray-700">请尝试调整筛选条件</p>
              </div>
              <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div
                    v-for="assignment in filteredAssignments"
                    :key="assignment.id"
                    class="border rounded-lg p-4"
                >
                  <h3 class="text-lg font-medium text-gray-900">
                    {{ assignment.title }}
                  </h3>
                  <div class="mt-2 text-sm text-gray-700 space-y-1">
                    <div class="flex items-center space-x-2 mb-2">
                      <span
                          class="px-2 py-1 rounded-full text-sm"
                          :style="getSubjectStyle(assignment.subject)"
                      >
                        {{ assignment.subject }}
                      </span>
                      <span
                          :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusColor(assignment)]"
                      >
                        {{ getStatusText(assignment) }}
                      </span>
                    </div>
                    <p class="text-gray-800">下发时间: {{ assignment.assignDate }}</p>
                    <p class="text-gray-800">截止时间: {{ assignment.dueDate }}</p>
                    <div
                        :class="[
                        'mt-2 inline-block px-3 py-1 rounded-full text-sm',
                        assignment.status === 'submitted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      ]"
                    >
                      {{ assignment.status === 'submitted' ? `已提交 (${assignment.submitTime})` : '未提交' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 自定义Tooltip -->
    <div
        v-if="tooltip.show"
        :style="{
        position: 'fixed',
        left: tooltip.x + 'px',
        top: tooltip.y + 'px',
        zIndex: 1000
      }"
        class="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm"
    >
      <div v-for="assignment in tooltip.assignments" :key="assignment.id" class="mb-3 last:mb-0">
        <div class="flex items-start justify-between mb-2">
          <h4 class="font-medium text-gray-900 text-sm">{{ assignment.title }}</h4>
          <span
              :class="['px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0', getStatusColor(assignment)]"
          >
            {{ getStatusText(assignment) }}
          </span>
        </div>
        <div class="text-xs text-gray-700 space-y-1">
          <div class="flex items-center space-x-2 mb-1">
            <span
                class="px-2 py-1 rounded-full text-xs"
                :style="getSubjectStyle(assignment.subject)"
            >
              {{ assignment.subject }}
            </span>
          </div>
          <p class="text-gray-800">下发时间: {{ assignment.assignDate }}</p>
          <p class="text-gray-800">截止时间: {{ assignment.dueDate }}</p>
          <p v-if="assignment.submitTime" class="text-green-700">
            提交时间: {{ assignment.submitTime }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 日历容器样式 */
.calendar-container {
  width: 100%;
  font-family: system-ui, -apple-system, sans-serif;
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

/* 日历整体样式 */
:deep(.fc) {
  background: white;
  border: none;
  color: #374151;
}

/* 工具栏样式 */
:deep(.fc-toolbar) {
  margin-bottom: 1rem;
  padding: 1rem;
  background: white;
}

:deep(.fc-toolbar-title) {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

/* 按钮样式 - 三角形导航 */
:deep(.fc-button-primary) {
  background: #f3f4f6;
  border: none;
  padding: 0.5rem;
  font-size: 0;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  transition: background-color 0.2s;
  position: relative;
}

:deep(.fc-button-primary:hover) {
  background: #e5e7eb;
}

:deep(.fc-button-primary:focus) {
  box-shadow: none;
}

/* 三角形箭头 */
:deep(.fc-prev-button::after) {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-40%, -50%);
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-right: 8px solid #4b5563;
}

:deep(.fc-next-button::after) {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-60%, -50%);
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 8px solid #4b5563;
}

/* 表头样式 */
:deep(.fc-col-header-cell) {
  background-color: white;
  border: none;
  padding: 0.75rem 0;
}

:deep(.fc-col-header-cell-cushion) {
  color: #4b5563;
  font-weight: 600;
  font-size: 0.875rem;
}

/* 日历表格样式 */
:deep(.fc-scrollgrid) {
  border: none;
}

:deep(.fc-daygrid-body) {
  background: white;
}

/* 日期单元格样式 - 去除网格线 */
:deep(.fc-daygrid-day) {
  border: none;
  min-height: 60px;
  background: white;
}

:deep(.fc-daygrid-day-top) {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 60px;
}

:deep(.fc-daygrid-day-number) {
  padding: 0;
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin: 0;
  transition: all 0.2s;
  border-radius: 50%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 其他月份日期样式 - 调整为更深的颜色 */
:deep(.fc-day-other .fc-daygrid-day-number) {
  color: #9ca3af;
}

/* 有作业的日期样式 - 完美圆形包裹 */
:deep(.fc-daygrid-day-number.has-assignment) {
  background-color: #3b82f6;
  color: white;
  font-weight: 600;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  min-width: 40px;
  min-height: 40px;
  max-width: 40px;
  max-height: 40px;
  flex-shrink: 0;
}

:deep(.fc-daygrid-day-number.has-assignment:hover) {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* 不同状态的融合颜色 - 都使用正圆形 */
:deep(.fc-daygrid-day-number.submitted) {
  background-color: #10b981;
  color: white;
  font-weight: 600;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  min-width: 40px;
  min-height: 40px;
  max-width: 40px;
  max-height: 40px;
  flex-shrink: 0;
}

:deep(.fc-daygrid-day-number.overdue) {
  background-color: #ef4444;
  color: white;
  font-weight: 600;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  min-width: 40px;
  min-height: 40px;
  max-width: 40px;
  max-height: 40px;
  flex-shrink: 0;
}

:deep(.fc-daygrid-day-number.urgent) {
  background-color: #f59e0b;
  color: white;
  font-weight: 600;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  min-width: 40px;
  min-height: 40px;
  max-width: 40px;
  max-height: 40px;
  flex-shrink: 0;
}

:deep(.fc-daygrid-day-number.warning) {
  background-color: #eab308;
  color: white;
  font-weight: 600;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  min-width: 40px;
  min-height: 40px;
  max-width: 40px;
  max-height: 40px;
  flex-shrink: 0;
}

:deep(.fc-daygrid-day-number.normal) {
  background-color: #3b82f6;
  color: white;
  font-weight: 600;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  min-width: 40px;
  min-height: 40px;
  max-width: 40px;
  max-height: 40px;
  flex-shrink: 0;
}

/* 今天的日期样式 - 完全移除默认的黄色背景 */
:deep(.fc-day-today) {
  background-color: white !important;
  background: white !important;
}

:deep(.fc-day-today .fc-daygrid-day-frame) {
  background-color: white !important;
  background: white !important;
}

:deep(.fc-day-today .fc-daygrid-day-events) {
  background-color: transparent !important;
  background: transparent !important;
}

:deep(.fc-day-today .fc-daygrid-day-bg) {
  background-color: transparent !important;
  background: transparent !important;
}

:deep(.fc-day-today .fc-daygrid-day-top) {
  background-color: transparent !important;
  background: transparent !important;
}

:deep(.fc-day-today .fc-daygrid-day-number) {
  border: 2px solid #E1E7FD;
  color: #3b82f6;
  font-weight: 600;
  background-color: #E1E7FD !important;
  background: #E1E7FD !important;
}

/* 额外的FullCalendar today类覆盖 */
:deep(.fc-daygrid-day.fc-day-today) {
  background-color: white !important;
}

:deep(.fc-daygrid-day.fc-day-today .fc-daygrid-day-frame) {
  background-color: white !important;
}

/* 隐藏背景事件 */
:deep(.fc-bg-event) {
  display: none;
}

/* 清理多余样式 */
:deep(.fc-daygrid-day-frame) {
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 60px;
}

/* 移除所有边框和网格线 */
:deep(.fc-scrollgrid-section > *) {
  border: none;
}

:deep(.fc-scrollgrid-sync-table) {
  border: none;
}

:deep(.fc-daygrid-day-top) {
  justify-content: center;
  align-items: center;
  display: flex;
  height: 100%;
  min-height: 60px;
}
</style>