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
          v-show="date.isCurrentMonth || date.hasEvent"
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
    
    const dateStr = date.toISOString().split('T')[0]
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
  return [
    'day-cell',
    {
      'is-other-month': !date.isCurrentMonth,
      'is-today': date.isToday,
      'has-event': date.hasEvent,
      'is-hovered': hoveredDate.value === date
    }
  ]
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
    default: return 'event-primary'
  }
}

const handleDateClick = (date: CalendarDate) => {
  emit('dateClick', date)
}

const handleDateHover = (date: CalendarDate, isHovered: boolean) => {
  hoveredDate.value = isHovered ? date : null
}
</script>

<style scoped>
.calendar-wrapper {
  background: linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.2);
  position: relative;
  overflow: hidden;
}

.dark .calendar-wrapper {
  background: linear-gradient(145deg, #1e293b 0%, #334155 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.calendar-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
}

/* 头部样式 */
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.calendar-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  letter-spacing: -0.025em;
}

.dark .calendar-title {
  color: #f8fafc;
}

.current-date {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  letter-spacing: -0.025em;
  line-height: 1;
}

.dark .current-date {
  color: #e2e8f0;
}

.header-controls {
  display: flex;
  gap: 8px;
}

.nav-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: none;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(4px);
}

.nav-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.nav-btn svg {
  width: 18px;
  height: 18px;
}

/* 图例样式 */
.legend-section {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(8px);
}

.dark .legend-section {
  background: rgba(0, 0, 0, 0.2);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.dark .legend-item {
  color: #cbd5e1;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
}

/* 日历网格样式 */
.calendar-grid {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 8px;
}

.weekday {
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  padding: 8px 4px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.dark .weekday {
  color: #94a3b8;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.day-cell {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(4px);
}

.dark .day-cell {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.day-cell:hover {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.dark .day-cell:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.day-cell.is-other-month {
  opacity: 0.3;
}

.day-cell.is-today {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.day-cell.is-today .day-number {
  color: white;
  font-weight: 700;
}

.day-cell.has-event {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
}

.day-number {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  line-height: 1;
  z-index: 2;
}

.dark .day-number {
  color: #e2e8f0;
}

.event-indicator {
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 3;
}

.event-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.event-success {
  background: #10b981;
  box-shadow: 0 0 4px rgba(16, 185, 129, 0.6);
}

.event-danger {
  background: #ef4444;
  box-shadow: 0 0 4px rgba(239, 68, 68, 0.6);
}

.event-warning {
  background: #f59e0b;
  box-shadow: 0 0 4px rgba(245, 158, 11, 0.6);
}

.event-info {
  background: #3b82f6;
  box-shadow: 0 0 4px rgba(59, 130, 246, 0.6);
}

.event-primary {
  background: #8b5cf6;
  box-shadow: 0 0 4px rgba(139, 92, 246, 0.6);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

/* 响应式设计 */
@media (max-width: 640px) {
  .calendar-wrapper {
    padding: 16px;
  }
  
  .current-date {
    font-size: 1.25rem;
  }
  
  .nav-btn {
    width: 36px;
    height: 36px;
  }
  
  .day-number {
    font-size: 0.8rem;
  }
  
  .legend-section {
    flex-wrap: wrap;
    gap: 12px;
  }
}

/* 暗色主题适配 */
.dark .calendar-wrapper::before {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
}

.calendar-wrapper::before {
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent);
}
</style>