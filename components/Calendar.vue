<template>
  <div class="calendar-wrapper">
    <!-- 头部控制区域 -->
    <div class="calendar-header">
      <div class="header-left">
        <h2 class="calendar-title">{{ title || '日历' }}</h2>
        <div class="current-date">{{ currentMonth }}</div>
      </div>
      <div class="header-controls">
        <button @click="prevMonth" class="nav-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
        </button>
        <button @click="nextMonth" class="nav-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- 图例 -->
    <div class="legend-section" v-if="legends.length">
      <div v-for="legend in legends" :key="legend.label" class="legend-item">
        <div :class="['legend-dot', legend.color]"></div>
        <span>{{ legend.label }}</span>
      </div>
    </div>

    <!-- 日历网格 -->
    <div class="calendar-grid">
      <!-- 星期标题 -->
      <div class="weekdays">
        <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
      </div>

      <!-- 日期网格 -->
      <div class="days-grid">
        <div
            v-for="date in calendarDates"
            :key="`${date.year}-${date.month}-${date.day}`"
            v-show="date.isCurrentMonth"
            :class="getDayClasses(date)"
            @click="handleDateClick(date)"
            @mouseenter="handleDateHover(date, true)"
            @mouseleave="handleDateHover(date, false)"
        >
          <span class="day-number">{{ date.day }}</span>
          <div v-if="date.hasEvent" class="event-indicator">
            <div :class="['event-dot', getEventStatus(date)]"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 悬浮提示框 -->
    <div
        v-if="showTooltip && hoveredDate"
        :style="tooltipStyle"
        class="tooltip"
    >
      <div class="tooltip-arrow"></div>
      <div class="tooltip-content">
        <div class="tooltip-header">
          <span class="tooltip-date">{{ formatTooltipDate(hoveredDate) }}</span>
        </div>
        <div class="tooltip-body">
          <div v-for="event in hoveredDate.events" :key="event.id" class="tooltip-event">
            <div :class="['event-status-dot', getEventStatusClass(event)]"></div>
            <div class="event-info">
              <div class="event-title">{{ event.title }}</div>
              <div class="event-meta">{{ getEventStatusText(event) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface CalendarEvent {
  id: string | number
  title: string
  start: string
  className?: string
  extendedProps?: Record<string, any>
}

interface CalendarLegend {
  label: string
  color: string
}

interface CalendarDate {
  day: number
  month: number
  year: number
  isCurrentMonth: boolean
  isToday: boolean
  hasEvent: boolean
  events: CalendarEvent[]
}

interface Props {
  title?: string
  events?: CalendarEvent[]
  legends?: CalendarLegend[]
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  events: () => [],
  legends: () => [
    { label: '作业', color: 'bg-blue-500' },
    { label: '截止', color: 'bg-orange-500' }
  ]
})

const emit = defineEmits<{
  dateClick: [date: CalendarDate]
  monthChange: [year: number, month: number]
}>()

// 响应式数据
const currentDate = ref(new Date())
const hoveredDate = ref<CalendarDate | null>(null)
const showTooltip = ref(false)
const tooltipPosition = ref({ x: 0, y: 0 })

// 计算属性
const currentMonth = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth() + 1
  return `${year}年${month}月`
})

const weekdays = ['日', '一', '二', '三', '四', '五', '六']

const calendarDates = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  // 获取当月第一天和最后一天
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  // 获取日历网格开始日期（包含上月末尾）
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())

  // 生成42天的日历网格（6周）
  const dates: CalendarDate[] = []
  const today = new Date()

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)

    // 修复日期匹配问题：使用本地日期格式而不是ISO格式
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    const dayEvents = props.events.filter(event => event.start === dateStr)

    dates.push({
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      isCurrentMonth: date.getMonth() === month,
      isToday: date.toDateString() === today.toDateString(),
      hasEvent: dayEvents.length > 0,
      events: dayEvents
    })
  }

  return dates
})

// 新增计算属性
const tooltipStyle = computed(() => {
  if (!tooltipPosition.value) return {}

  return {
    left: `${tooltipPosition.value.x}px`,
    top: `${tooltipPosition.value.y}px`,
    transform: 'translate(-50%, -100%)'
  }
})

// 方法
const prevMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentDate.value = newDate
  emit('monthChange', newDate.getFullYear(), newDate.getMonth() + 1)
}

const nextMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentDate.value = newDate
  emit('monthChange', newDate.getFullYear(), newDate.getMonth() + 1)
}

const getDayClasses = (date: CalendarDate) => {
  const classes = ['day-cell']

  if (!date.isCurrentMonth) {
    classes.push('is-other-month')
  }

  if (date.isToday) {
    classes.push('is-today')
  }

  if (date.hasEvent) {
    classes.push('has-event')
    // 添加具体的事件状态类
    const event = date.events[0]
    const status = event.extendedProps?.status || event.className
    classes.push(`event-${status}`)
  }

  if (hoveredDate.value === date) {
    classes.push('is-hovered')
  }

  return classes
}

const getEventStatus = (date: CalendarDate) => {
  if (!date.hasEvent) return ''

  // 根据事件状态返回样式类
  const event = date.events[0]
  const status = event.extendedProps?.status || event.className

  switch (status) {
    case 'submitted': return 'event-success'
    case 'overdue': return 'event-danger'
    case 'urgent': return 'event-warning'
    case 'pending': return 'event-info'
    default: return 'event-info' // 默认也改为pending样式
  }
}

const handleDateClick = (date: CalendarDate) => {
  emit('dateClick', date)
}

const handleDateHover = (date: CalendarDate, isHovered: boolean) => {
  // 只有在有事件的日期才显示悬浮提示
  if (isHovered && date.hasEvent) {
    hoveredDate.value = date
    showTooltip.value = true

    // 获取鼠标位置
    nextTick(() => {
      const event = window.event as MouseEvent
      if (event) {
        tooltipPosition.value = {
          x: event.clientX,
          y: event.clientY - 10
        }
      }
    })
  } else {
    hoveredDate.value = null
    showTooltip.value = false
  }
}

// 新增方法
const formatTooltipDate = (date: CalendarDate) => {
  return `${date.year}年${date.month + 1}月${date.day}日`
}

const getEventStatusClass = (event: CalendarEvent) => {
  const status = event.extendedProps?.status || event.className
  return `status-${status}`
}

const getEventStatusText = (event: CalendarEvent) => {
  const status = event.extendedProps?.status || event.className

  const statusTexts = {
    'submitted': '已提交',
    'pending': '未提交',
    'overdue': '已逾期',
    'urgent': '紧急',
    'warning': '即将到期',
    'active': '进行中',
    'draft': '草稿',
    'closed': '已结束'
  }

  return statusTexts[status] || '未提交' // 默认显示为未提交
}

// 监听鼠标移动更新tooltip位置
const updateTooltipPosition = (event: MouseEvent) => {
  if (showTooltip.value) {
    tooltipPosition.value = {
      x: event.clientX,
      y: event.clientY - 10
    }
  }
}

onMounted(() => {
  document.addEventListener('mousemove', updateTooltipPosition)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', updateTooltipPosition)
})
</script>

<style scoped>
.calendar-wrapper {
  background: #ffffff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(229, 231, 235, 0.6);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.dark .calendar-wrapper {
  background: #1f2937;
  border: 1px solid rgba(75, 85, 99, 0.6);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
}

/* 头部样式 */
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.calendar-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  letter-spacing: -0.025em;
}

.dark .calendar-title {
  color: #f9fafb;
}

.current-date {
  font-size: 1.25rem;
  font-weight: 700;
  color: #374151;
  letter-spacing: -0.025em;
  line-height: 1;
}

.dark .current-date {
  color: #e5e7eb;
}

.header-controls {
  display: flex;
  gap: 6px;
}

.nav-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: #f3f4f6;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dark .nav-btn {
  background: #374151;
  color: #9ca3af;
}

.nav-btn:hover {
  background: #e5e7eb;
  color: #374151;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dark .nav-btn:hover {
  background: #4b5563;
  color: #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.nav-btn svg {
  width: 16px;
  height: 16px;
}

/* 图例样式 */
.legend-section {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  padding: 10px 0;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.dark .legend-item {
  color: #9ca3af;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

/* 日历网格样式 */
.calendar-grid {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  margin-bottom: 8px;
}

.weekday {
  text-align: center;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  padding: 8px 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark .weekday {
  color: #9ca3af;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
}

.day-cell {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
  min-height: 36px;
}

/* 移除通用的hover效果 */
/* .day-cell:hover 已移除 */

.day-cell.is-other-month {
  opacity: 0.3;
}

.day-cell.is-today {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.day-cell.is-today .day-number {
  color: white;
  font-weight: 700;
}

/* 今日不显示hover效果 */

.day-cell.has-event {
  background: transparent;
  color: white;
  box-shadow: none;
}

.day-cell.has-event .day-number {
  color: white !important;
  font-weight: 600;
}

/* 只对有事件的日期添加hover效果 */
.day-cell.has-event:hover {
  transform: scale(1.05);
}

.dark .day-cell.has-event:hover {
  /* 保持原有的hover效果 */
}

/* 事件状态样式 */
.day-cell.has-event.event-submitted {
  background: linear-gradient(135deg, #10b981, #059669);
}

.day-cell.has-event.event-overdue {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  animation: pulse 2s infinite;
}

.day-cell.has-event.event-urgent {
  background: linear-gradient(135deg, #ff6b35, #e55039);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.6);
}

.day-cell.has-event.event-warning {
  background: linear-gradient(135deg, #eab308, #ca8a04);
}

.day-cell.has-event.event-pending {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

/* 移除normal样式，所有未分类的都使用pending样式 */
.day-cell.has-event.event-info {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.day-cell.has-event.event-active {
  background: linear-gradient(135deg, #10b981, #059669);
}

.day-cell.has-event.event-draft {
  background: linear-gradient(135deg, #6b7280, #4b5563);
}

.day-cell.has-event.event-closed {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

/* hover效果保持原背景色，只对有事件的日期生效 */
.day-cell.has-event.event-submitted:hover {
  background: linear-gradient(135deg, #10b981, #059669);
}

.day-cell.has-event.event-overdue:hover {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.day-cell.has-event.event-urgent:hover {
  background: linear-gradient(135deg, #ff6b35, #e55039);
  animation: urgentPulse 1.5s infinite;
}

.day-cell.has-event.event-warning:hover {
  background: linear-gradient(135deg, #eab308, #ca8a04);
}

.day-cell.has-event.event-pending:hover {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.day-cell.has-event.event-info:hover {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.day-cell.has-event.event-active:hover {
  background: linear-gradient(135deg, #10b981, #059669);
}

.day-cell.has-event.event-draft:hover {
  background: linear-gradient(135deg, #6b7280, #4b5563);
}

.day-cell.has-event.event-closed:hover {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.event-indicator {
  display: none;
}

/* 悬浮提示框样式 */
.tooltip {
  position: fixed;
  z-index: 1000;
  pointer-events: none;
  animation: fadeIn 0.2s ease-in-out;
}

.tooltip-content {
  background: #ffffff;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 12px 16px;
  min-width: 200px;
  max-width: 300px;
  backdrop-filter: blur(10px);
}

.dark .tooltip-content {
  background: #374151;
  border-color: rgba(75, 85, 99, 0.8);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
}

.tooltip-arrow {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  background: #ffffff;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-top: none;
  border-left: none;
  transform: translateX(-50%) rotate(45deg);
}

.dark .tooltip-arrow {
  background: #374151;
  border-color: rgba(75, 85, 99, 0.8);
}

.tooltip-header {
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
}

.dark .tooltip-header {
  border-bottom-color: rgba(75, 85, 99, 0.5);
}

.tooltip-date {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.dark .tooltip-date {
  color: #f3f4f6;
}

.tooltip-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tooltip-event {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.event-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;
}

.event-status-dot.status-submitted {
  background: #10b981;
}

.event-status-dot.status-pending {
  background: #f59e0b;
}

.event-status-dot.status-overdue {
  background: #ef4444;
}

.event-status-dot.status-urgent {
  background: #ff6b35;
  box-shadow: 0 0 6px rgba(255, 107, 53, 0.6);
}

.event-status-dot.status-warning {
  background: #eab308;
}

.event-status-dot.status-active {
  background: #10b981;
}

.event-status-dot.status-draft {
  background: #6b7280;
}

.event-status-dot.status-closed {
  background: #3b82f6;
}

.event-info {
  flex: 1;
  min-width: 0;
}

.event-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  line-height: 1.2;
  margin-bottom: 2px;
}

.dark .event-title {
  color: #f3f4f6;
}

.event-meta {
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1;
}

.dark .event-meta {
  color: #9ca3af;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes urgentPulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.6);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.07);
    box-shadow: 0 6px 16px rgba(255, 107, 53, 0.8);
  }
}

/* 响应式设计 */
@media (max-width: 640px) {
  .calendar-wrapper {
    padding: 16px;
  }

  .current-date {
    font-size: 1.125rem;
  }

  .nav-btn {
    width: 32px;
    height: 32px;
  }

  .day-number {
    font-size: 0.8rem;
  }

  .legend-section {
    flex-wrap: wrap;
    gap: 12px;
  }

  .day-cell {
    min-height: 32px;
  }

  .tooltip-content {
    min-width: 180px;
    max-width: 250px;
    padding: 10px 12px;
  }

  .tooltip-event {
    gap: 6px;
  }

  .event-title {
    font-size: 0.8rem;
  }

  .event-meta {
    font-size: 0.7rem;
  }
}
</style>