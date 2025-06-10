<template>
  <div class="calendar-wrapper">
    <!-- 头部控制区域 - 移动端优化 -->
    <div class="calendar-header">
      <div class="header-left">
        <h2 class="calendar-title">{{ title || $t('common.calendar') || '日历' }}</h2>
        <div class="current-date">{{ currentMonth }}</div>
      </div>
      <div class="header-controls">
        <button @click="prevMonth" class="nav-btn touch-manipulation" :aria-label="$t('common.prevMonth') || '上个月'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
        </button>
        <button @click="nextMonth" class="nav-btn touch-manipulation" :aria-label="$t('common.nextMonth') || '下个月'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- 图例 - 补充完整状态 -->
    <div class="legend-section" v-if="legends.length">
      <div class="legend-items">
        <div v-for="legend in legends" :key="legend.label" class="legend-item">
          <div :class="['legend-dot', legend.color]"></div>
          <span>{{ getLocalizedLegendLabel(legend.label) }}</span>
        </div>
      </div>
    </div>

    <!-- 日历网格 -->
    <div class="calendar-grid">
      <!-- 星期标题 -->
      <div class="weekdays">
        <div v-for="(day, index) in localizedWeekdays" :key="index" class="weekday">
          <span class="hidden sm:inline">{{ day.full }}</span>
          <span class="sm:hidden">{{ day.short }}</span>
        </div>
      </div>

      <!-- 日期网格 -->
      <div class="days-grid">
        <div 
          v-for="date in calendarDates" 
          :key="`${date.year}-${date.month}-${date.day}`"
          v-show="date.isCurrentMonth"
          :class="getDayClasses(date)"
          @click="handleDateClick(date)"
          @touchstart="handleTouchStart(date, $event)"
          @touchend="handleTouchEnd"
          @mouseenter="!isMobile && handleDateHover(date, true)"
          @mouseleave="!isMobile && handleDateHover(date, false)"
        >
          <span class="day-number">{{ date.day }}</span>
          <div v-if="date.hasEvent && date.events.length > 1" class="event-count">
            {{ date.events.length }}
          </div>
          <!-- 添加过期和紧急指示器 -->
          <div v-if="hasOverdueEvents(date)" class="status-indicator overdue-indicator">
            <div class="pulse-dot"></div>
          </div>
          <div v-else-if="hasUrgentEvents(date)" class="status-indicator urgent-indicator">
            <div class="pulse-dot"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 悬浮提示框 - 移动端优化 -->
    <div 
      v-if="showTooltip && hoveredDate"
      :style="tooltipStyle"
      :class="['tooltip', isMobile ? 'tooltip-mobile' : '']"
      @click.stop
    >
      <div class="tooltip-arrow" v-if="!isMobile"></div>
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
              <div v-if="event.extendedProps?.dueTime" class="event-time">
                {{ event.extendedProps.dueTime }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 移动端遮罩 - 点击关闭 -->
    <div 
      v-if="isMobile && showTooltip" 
      class="tooltip-overlay"
      @click="closeTooltip"
      @touchstart="closeTooltip"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'

interface CalendarEvent {
  id: string | number
  title: string
  start: string
  dueDate?: string // 添加截止日期字段
  className?: string
  extendedProps?: {
    status?: string
    dueTime?: string
    priority?: 'low' | 'medium' | 'high'
    [key: string]: any
  }
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
    { label: '已过期', color: 'bg-red-500' },
    { label: '紧急', color: 'bg-orange-500' },
    { label: '未完成', color: 'bg-yellow-500' },
    { label: '已完成', color: 'bg-green-500' },
    { label: '进行中', color: 'bg-blue-500' },
    { label: '草稿', color: 'bg-gray-500' }
  ]
})

const emit = defineEmits<{
  dateClick: [date: CalendarDate]
  monthChange: [year: number, month: number]
  eventClick: [event: CalendarEvent]
}>()

// 响应式数据
const currentDate = ref(new Date())
const hoveredDate = ref<CalendarDate | null>(null)
const showTooltip = ref(false)
const tooltipPosition = ref({ x: 0, y: 0 })
const isMobile = ref(false)
const touchStartTime = ref(0)

// 计算属性
const { t, locale } = useI18n()

const currentMonth = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth() + 1
  
  // 根据语言格式化月份显示
  if (locale.value === 'en') {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    return `${monthNames[currentDate.value.getMonth()]} ${year}`
  } else if (locale.value === 'ja') {
    return `${year}年${month}月`
  } else {
    return `${year}年${month}月`
  }
})

const localizedWeekdays = computed(() => {
  if (locale.value === 'en') {
    return [
      { full: 'Sun', short: 'S' },
      { full: 'Mon', short: 'M' },
      { full: 'Tue', short: 'T' },
      { full: 'Wed', short: 'W' },
      { full: 'Thu', short: 'T' },
      { full: 'Fri', short: 'F' },
      { full: 'Sat', short: 'S' }
    ]
  } else if (locale.value === 'ja') {
    return [
      { full: '日曜日', short: '日' },
      { full: '月曜日', short: '月' },
      { full: '火曜日', short: '火' },
      { full: '水曜日', short: '水' },
      { full: '木曜日', short: '木' },
      { full: '金曜日', short: '金' },
      { full: '土曜日', short: '土' }
    ]
  } else {
    return [
      { full: '星期日', short: '日' },
      { full: '星期一', short: '一' },
      { full: '星期二', short: '二' },
      { full: '星期三', short: '三' },
      { full: '星期四', short: '四' },
      { full: '星期五', short: '五' },
      { full: '星期六', short: '六' }
    ]
  }
})

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

// 修改tooltip样式计算
const tooltipStyle = computed(() => {
  if (!tooltipPosition.value) return {}

  if (isMobile.value) {
    return {
      position: 'fixed' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1001
    }
  }

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

// 新增过期和紧急状态判断方法
const isOverdue = (event: CalendarEvent) => {
  // 检查是否为过期状态
  if (event.extendedProps?.status === 'submitted' || event.extendedProps?.status === 'closed') return false
  
  const now = new Date()
  now.setHours(23, 59, 59, 999) // 设置到当天的最后一刻
  
  // 使用 dueDate 字段或 start 字段作为截止日期
  const dueDateStr = event.dueDate || event.start
  const dueDate = new Date(dueDateStr + 'T23:59:59') // 设置到截止日的最后一刻
  return dueDate < now
}

const isUrgent = (event: CalendarEvent) => {
  // 检查是否为紧急状态
  if (event.extendedProps?.status === 'submitted') return false
  
  const now = new Date()
  now.setHours(0, 0, 0, 0) // 重置到当天00:00:00
  
  // 使用 dueDate 字段或 start 字段作为截止日期
  const dueDateStr = event.dueDate || event.start
  const dueDate = new Date(dueDateStr + 'T00:00:00') // 确保使用本地时间
  const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  return diffDays <= 3 && diffDays >= 0
}

const hasOverdueEvents = (date: CalendarDate) => {
  return date.hasEvent && date.events.some(event => isOverdue(event))
}

const hasUrgentEvents = (date: CalendarDate) => {
  return date.hasEvent && date.events.some(event => isUrgent(event))
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
    
    // 检查过期和紧急状态
    if (hasOverdueEvents(date)) {
      classes.push('has-overdue-events')
    } else if (hasUrgentEvents(date)) {
      classes.push('has-urgent-events')
    }
    
    // 根据优先级或状态添加样式
    const primaryEvent = getPrimaryEvent(date.events)
    const status = primaryEvent.extendedProps?.status || primaryEvent.className
    const priority = primaryEvent.extendedProps?.priority
    
    if (priority) {
      classes.push(`priority-${priority}`)
    }
    
    if (status) {
      classes.push(`event-${status}`)
    }
  }

  if (hoveredDate.value === date) {
    classes.push('is-hovered')
  }

  return classes
}

const getPrimaryEvent = (events: CalendarEvent[]) => {
  // 按优先级排序，返回最重要的事件，过期和紧急优先级最高
  const priorityOrder = { high: 3, medium: 2, low: 1 }
  const statusPriority = { 
    overdue: 10,  // 过期最高优先级
    urgent: 9,    // 紧急次之
    pending: 3, 
    active: 2, 
    submitted: 1, 
    closed: 0 
  }
  
  return events.sort((a, b) => {
    // 首先按过期和紧急状态排序
    const aOverdue = isOverdue(a) ? 10 : 0
    const bOverdue = isOverdue(b) ? 10 : 0
    const aUrgent = isUrgent(a) ? 9 : 0
    const bUrgent = isUrgent(b) ? 9 : 0
    
    const aPriority = priorityOrder[a.extendedProps?.priority as keyof typeof priorityOrder] || 0
    const bPriority = priorityOrder[b.extendedProps?.priority as keyof typeof priorityOrder] || 0
    
    const aStatus = statusPriority[a.extendedProps?.status as keyof typeof statusPriority] || 0
    const bStatus = statusPriority[b.extendedProps?.status as keyof typeof statusPriority] || 0
    
    const aTotal = aOverdue + aUrgent + aPriority + aStatus
    const bTotal = bOverdue + bUrgent + bPriority + bStatus
    
    return bTotal - aTotal
  })[0]
}

const getEventStatus = (date: CalendarDate) => {
  if (!date.hasEvent) return ''
  
  const primaryEvent = getPrimaryEvent(date.events)
  const status = primaryEvent.extendedProps?.status || primaryEvent.className

  switch (status) {
    case 'submitted': return 'event-success'
    case 'overdue': return 'event-danger'
    case 'urgent': return 'event-warning'
    case 'pending': return 'event-info'
    case 'active': return 'event-primary'
    case 'draft': return 'event-secondary'
    case 'closed': return 'event-muted'
    default: return 'event-info'
  }
}

const handleDateClick = (date: CalendarDate) => {
  if (isMobile.value) {
    // 移动端已在touchstart处理
    return
  }
  
  if (date.hasEvent && date.events.length === 1) {
    emit('eventClick', date.events[0])
  }
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

// 获取本地化的图例标签
const getLocalizedLegendLabel = (label: string) => {
  const legendTranslations = {
    '已过期': {
      en: 'Overdue',
      ja: '期限切れ',
      zh: '已过期'
    },
    '紧急': {
      en: 'Urgent',
      ja: '緊急',
      zh: '紧急'
    },
    '未完成': {
      en: 'Pending',
      ja: '未完了',
      zh: '未完成'
    },
    '已完成': {
      en: 'Completed',
      ja: '完了済み',
      zh: '已完成'
    },
    '进行中': {
      en: 'Active',
      ja: '進行中',
      zh: '进行中'
    },
    '草稿': {
      en: 'Draft',
      ja: '下書き',
      zh: '草稿'
    }
  }
  
  return legendTranslations[label]?.[locale.value] || label
}

const formatTooltipDate = (date: CalendarDate) => {
  const dateObj = new Date(date.year, date.month, date.day)
  
  if (locale.value === 'en') {
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const weekDay = weekDays[dateObj.getDay()]
    const monthName = months[date.month]
    return `${weekDay}, ${monthName} ${date.day}, ${date.year}`
  } else if (locale.value === 'ja') {
    const weekDays = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日']
    const weekDay = weekDays[dateObj.getDay()]
    return `${date.year}年${date.month + 1}月${date.day}日 ${weekDay}`
  } else {
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const weekDay = weekDays[dateObj.getDay()]
    return `${date.year}年${date.month + 1}月${date.day}日 ${weekDay}`
  }
}

const getEventStatusClass = (event: CalendarEvent) => {
  const status = event.extendedProps?.status || event.className
  return `status-${status}`
}

const getEventStatusText = (event: CalendarEvent) => {
  // 优先显示过期和紧急状态
  if (isOverdue(event)) {
    return t('common.overdue') || '已过期'
  }
  if (isUrgent(event)) {
    return t('common.urgent') || '紧急'
  }
  
  const status = event.extendedProps?.status || event.className
  
  const statusTranslations = {
    submitted: t('common.submitted') || '已提交',
    pending: t('common.pending') || '未提交',
    overdue: t('common.overdue') || '已逾期',
    urgent: t('common.urgent') || '紧急',
    warning: t('common.warning') || '即将到期',
    active: t('common.active') || '进行中',
    draft: t('common.draft') || '草稿',
    closed: t('common.closed') || '已结束'
  }
  
  return statusTranslations[status] || t('common.unknown') || '未知状态'
}

// 关闭tooltip的方法
const closeTooltip = () => {
  showTooltip.value = false
  hoveredDate.value = null
}

// 监听鼠标移动更新tooltip位置
const updateTooltipPosition = (event: MouseEvent) => {
  if (showTooltip.value && !isMobile.value) {
    tooltipPosition.value = {
      x: event.clientX,
      y: event.clientY - 10
    }
  }
}

// 触摸事件处理
const handleTouchStart = (date: CalendarDate, event: TouchEvent) => {
  event.preventDefault() // 防止默认的触摸行为
  touchStartTime.value = Date.now()
  
  if (date.hasEvent) {
    // 短按直接显示tooltip（移除长按延迟）
    hoveredDate.value = date
    showTooltip.value = true
    
    tooltipPosition.value = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    }
  }
}

const handleTouchEnd = (event: TouchEvent) => {
  event.preventDefault()
  const touchDuration = Date.now() - touchStartTime.value
  
  // 如果是短按且没有事件，执行点击处理
  if (touchDuration < 300 && hoveredDate.value && !showTooltip.value) {
    const date = hoveredDate.value
    if (date.hasEvent && date.events.length === 1) {
      emit('eventClick', date.events[0])
    }
    emit('dateClick', date)
  }
}

// 生命周期
onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768 || 'ontouchstart' in window
  }
  
  checkMobile()
  window.addEventListener('resize', checkMobile)
  document.addEventListener('mousemove', updateTooltipPosition)
  
  // 添加全局点击事件监听，用于关闭tooltip
  const handleGlobalClick = (event: Event) => {
    if (isMobile.value && showTooltip.value) {
      const target = event.target as Element
      const tooltip = document.querySelector('.tooltip-mobile')
      const overlay = document.querySelector('.tooltip-overlay')
      
      // 如果点击的不是tooltip内容或遮罩，则关闭tooltip
      if (tooltip && !tooltip.contains(target) && target !== overlay) {
        closeTooltip()
      }
    }
  }
  
  document.addEventListener('click', handleGlobalClick)
  document.addEventListener('touchstart', handleGlobalClick)
  
  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
    document.removeEventListener('mousemove', updateTooltipPosition)
    document.removeEventListener('click', handleGlobalClick)
    document.removeEventListener('touchstart', handleGlobalClick)
  })
})

// 键盘导航支持
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') {
    prevMonth()
  } else if (event.key === 'ArrowRight') {
    nextMonth()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
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

/* 图例样式 - 增强 */
.legend-section {
  margin-bottom: 20px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(229, 231, 235, 0.3);
}

.dark .legend-section {
  border-bottom-color: rgba(75, 85, 99, 0.3);
}

.legend-items {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
  background: rgba(243, 244, 246, 0.5);
  transition: all 0.2s ease;
}

.dark .legend-item {
  color: #9ca3af;
  background: rgba(55, 65, 81, 0.5);
}

.legend-item:hover {
  background: rgba(243, 244, 246, 0.8);
  transform: translateY(-1px);
}

.dark .legend-item:hover {
  background: rgba(55, 65, 81, 0.8);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 移动端图例优化 */
@media (max-width: 640px) {
  .legend-section {
    padding: 10px 0;
  }
  
  .legend-items {
    gap: 8px;
    justify-content: flex-start;
  }
  
  .legend-item {
    font-size: 0.7rem;
    padding: 3px 6px;
    gap: 4px;
  }
  
  .legend-dot {
    width: 8px;
    height: 8px;
  }
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
  display: flex;
  align-items: center;
  justify-content: space-between;
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

/* 事件计数器样式 */
.event-count {
  position: absolute;
  top: 2px;
  right: 2px;
  background: rgba(255, 255, 255, 0.9);
  color: #374151;
  font-size: 0.6rem;
  font-weight: 600;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.dark .event-count {
  background: rgba(31, 41, 55, 0.9);
  color: #f3f4f6;
}

/* 优先级样式 */
.day-cell.priority-high {
  border: 2px solid #ef4444;
}

.day-cell.priority-medium {
  border: 2px solid #f59e0b;
}

.day-cell.priority-low {
  border: 2px solid #10b981;
}

/* 事件时间样式 */
.event-time {
  font-size: 0.7rem;
  color: #9ca3af;
  font-style: italic;
  margin-top: 2px;
}

.dark .event-time {
  color: #6b7280;
}

/* 键盘导航提示 */
.calendar-wrapper:focus-within .nav-btn {
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
}

/* 动画优化 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


.tooltip {
  animation: fadeIn 0.2s ease-out;
}

/* 无障碍支持 */
.day-cell:focus {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}

.nav-btn:focus {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .day-cell.has-event {
    border: 2px solid currentColor;
  }
  
  .tooltip-content {
    border: 2px solid #000;
  }
  
  .dark .tooltip-content {
    border: 2px solid #fff;
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  .day-cell,
  .nav-btn,
  .tooltip {
    transition: none;
    animation: none;
  }
}

/* 过期和紧急状态样式 */
.day-cell.has-overdue-events {
  background: linear-gradient(135deg, #ef4444, #dc2626) !important;
  animation: pulse 2s infinite;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.6) !important;
}

.day-cell.has-urgent-events {
  background: linear-gradient(135deg, #ff6b35, #e55039) !important;
  animation: urgentPulse 1.5s infinite;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.6) !important;
}

.day-cell.has-overdue-events:hover {
  background: linear-gradient(135deg, #ef4444, #dc2626) !important;
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.8) !important;
}

.day-cell.has-urgent-events:hover {
  background: linear-gradient(135deg, #ff6b35, #e55039) !important;
  box-shadow: 0 6px 16px rgba(255, 107, 53, 0.8) !important;
}

/* 状态指示器样式 */
.status-indicator {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 8px;
  height: 8px;
}

.pulse-dot {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  animation: statusPulse 1.5s infinite;
}

.overdue-indicator .pulse-dot {
  background: #fca5a5;
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.8);
}

.urgent-indicator .pulse-dot {
  background: #fed7aa;
  box-shadow: 0 0 6px rgba(255, 107, 53, 0.8);
}

@keyframes statusPulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
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

/* 事件状态点样式更新 */
.event-status-dot.status-overdue,
.event-status-dot.status-urgent {
  animation: statusPulse 1.5s infinite;
}

/* 移动端状态指示器优化 */
@media (max-width: 640px) {
  .status-indicator {
    top: 2px;
    left: 2px;
    width: 6px;
    height: 6px;
  }
}

/* 无障碍支持 - 高对比度模式 */
@media (prefers-contrast: high) {
  .day-cell.has-overdue-events {
    border: 3px solid #dc2626 !important;
    background: #fca5a5 !important;
    color: #000 !important;
  }
  
  .day-cell.has-urgent-events {
    border: 3px solid #ea580c !important;
    background: #fed7aa !important;
    color: #000 !important;
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  .day-cell.has-overdue-events,
  .day-cell.has-urgent-events,
  .pulse-dot {
    animation: none;
  }
  
  .overdue-indicator .pulse-dot {
    background: #dc2626;
  }
  
  .urgent-indicator .pulse-dot {
    background: #ea580c;
  }
}
</style>