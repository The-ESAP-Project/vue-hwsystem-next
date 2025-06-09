<script setup lang="ts">
import { Bars4Icon, Squares2X2Icon } from '@heroicons/vue/24/outline'
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { ref, onMounted } from 'vue'

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
        className: getEventStatus(assignment),
        display: 'background',
        extendedProps: {
          status: getEventStatus(assignment),
          title: assignment.title,
          dueDate: assignment.dueDate
        }
      })),
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: ''
      },
      buttonText: {
        today: '今'
      },
      eventDidMount: function(info) {
        // 为有作业的日期添加圆形样式和tooltip
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

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- 头部区域 -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-semibold text-gray-900">作业仪表盘</h1>
          <div class="flex space-x-2">
            <button @click="isListView = true" :class="['p-2 rounded-md', isListView ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600']">
              <Bars4Icon class="h-5 w-5" />
            </button>
            <button @click="isListView = false" :class="['p-2 rounded-md', !isListView ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600']">
              <Squares2X2Icon class="h-5 w-5" />
            </button>
          </div>
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
            <div v-if="isListView">
              <!-- 列表视图 -->
              <div class="divide-y divide-gray-200">
                <div
                    v-for="assignment in assignments"
                    :key="assignment.id"
                    class="p-6"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="text-lg font-medium text-gray-900">
                        {{ assignment.title }}
                      </h3>
                      <div class="mt-2 text-sm text-gray-500 space-y-1">
                        <p>提交次数: {{ assignment.attempts }}</p>
                        <p>下发时间: {{ assignment.assignDate }}</p>
                        <p>截止时间: {{ assignment.dueDate }}</p>
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
            <div v-else class="p-6">
              <!-- 网格视图 -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div
                    v-for="assignment in assignments"
                    :key="assignment.id"
                    class="border rounded-lg p-4"
                >
                  <h3 class="text-lg font-medium text-gray-900">
                    {{ assignment.title }}
                  </h3>
                  <div class="mt-2 text-sm text-gray-500 space-y-1">
                    <p>提交次数: {{ assignment.attempts }}</p>
                    <p>下发时间: {{ assignment.assignDate }}</p>
                    <p>截止时间: {{ assignment.dueDate }}</p>
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
  border-right: 8px solid #6b7280;
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
  border-left: 8px solid #6b7280;
}

/* 表头样式 */
:deep(.fc-col-header-cell) {
  background-color: white;
  border: none;
  padding: 0.75rem 0;
}

:deep(.fc-col-header-cell-cushion) {
  color: #9ca3af;
  font-weight: 500;
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

:deep(.fc-daygrid-day-number) {
  padding: 0;
  font-size: 1rem;
  color: #374151;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin: 0 auto;
  transition: all 0.2s;
  border-radius: 50%;
}

/* 其他月份日期样式 */
:deep(.fc-day-other .fc-daygrid-day-number) {
  color: #d1d5db;
}

/* 有作业的日期样式 - 完美圆形包裹 */
:deep(.fc-daygrid-day-number.has-assignment) {
  background-color: #3b82f6;
  color: white;
  font-weight: 600;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

:deep(.fc-daygrid-day-number.has-assignment:hover) {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* 不同状态的融合颜色 */
:deep(.fc-daygrid-day-number.submitted) {
  background-color: #10b981;
}

:deep(.fc-daygrid-day-number.overdue) {
  background-color: #ef4444;
}

:deep(.fc-daygrid-day-number.urgent) {
  background-color: #f59e0b;
}

:deep(.fc-daygrid-day-number.warning) {
  background-color: #eab308;
}

:deep(.fc-daygrid-day-number.normal) {
  background-color: #3b82f6;
}

/* 隐藏背景事件 */
:deep(.fc-bg-event) {
  display: none;
}

/* 清理多余样式 */
:deep(.fc-daygrid-day-frame) {
  padding: 0;
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
}
</style>