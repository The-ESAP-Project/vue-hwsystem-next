import { apiClient } from '~/utils/api'

// 适配你的后端数据格式
export interface Assignment {
  id: number                    // 数字ID，匹配你的Mock数据
  title: string
  assignDate: string           // YYYY-MM-DD 格式
  dueDate: string             // YYYY-MM-DD 格式
  submitTime: string | null   // 'YYYY-MM-DD HH:MM' 格式或 null
  status: 'submitted' | 'pending'
  attempts: number
  description: string
}

// 通用 Dashboard 数据类型
export interface DashboardStats {
  label: string
  value: string | number
  icon?: any
  bgColor?: string
  iconColor?: string
}

export interface CalendarEvent {
  id: number
  title: string
  start: string
  className: string
  extendedProps: {
    status: string
    title: string
    dueDate: string
  }
}

// 学生 Dashboard 数据获取
export const useStudentDashboard = () => {
  const assignments = ref<Assignment[]>([])
  const stats = ref<DashboardStats[]>([])
  const calendarEvents = ref<CalendarEvent[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 获取增强的作业状态（考虑过期和紧急）
  const getEnhancedStatus = (assignment: Assignment) => {
    if (assignment.status === 'submitted') {
      return 'submitted'
    }

    // 对于pending状态，检查是否过期或紧急
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const dueDate = new Date(assignment.dueDate + 'T00:00:00')
    const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return 'overdue'
    if (diffDays <= 3) return 'urgent'
    return 'pending'
  }

  const fetchStudentData = async () => {
    loading.value = true
    error.value = null

    try {
      // 调用真实API
      const response = await apiClient.get('/student/assignments')
      assignments.value = response.assignments || response || []

      // 生成统计数据
      const total = assignments.value.length
      const submitted = assignments.value.filter(a => a.status === 'submitted').length
      const pending = assignments.value.filter(a => a.status === 'pending').length
      const overdue = assignments.value.filter(a => {
        if (a.status === 'submitted') return false
        const now = new Date()
        const dueDate = new Date(a.dueDate + 'T23:59:59')
        return dueDate < now
      }).length

      stats.value = [
        {
          label: '总作业数',
          value: total,
          icon: 'AcademicCapIcon',
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          iconColor: 'text-blue-600 dark:text-blue-400'
        },
        {
          label: '已完成',
          value: submitted,
          icon: 'CheckCircleIcon',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          iconColor: 'text-green-600 dark:text-green-400'
        },
        {
          label: '待完成',
          value: pending,
          icon: 'ClockIcon',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
          iconColor: 'text-yellow-600 dark:text-yellow-400'
        },
        {
          label: '已过期',
          value: overdue,
          icon: 'ExclamationTriangleIcon',
          bgColor: 'bg-red-100 dark:bg-red-900/30',
          iconColor: 'text-red-600 dark:text-red-400'
        }
      ]

      // 生成日历事件
      calendarEvents.value = assignments.value.map(assignment => ({
        id: assignment.id,
        title: assignment.title,
        start: assignment.dueDate,
        className: getEnhancedStatus(assignment),
        extendedProps: {
          status: getEnhancedStatus(assignment),
          title: assignment.title,
          dueDate: assignment.dueDate
        }
      }))

      console.log('Dashboard数据加载完成:', {
        assignments: assignments.value,
        stats: stats.value,
        calendarEvents: calendarEvents.value
      })

    } catch (err: any) {
      error.value = err.message || '获取学生数据失败'
      console.error('Student dashboard error:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    assignments: readonly(assignments),
    stats: readonly(stats),
    calendarEvents: readonly(calendarEvents),
    loading: readonly(loading),
    error: readonly(error),
    fetchStudentData,
    refresh: fetchStudentData
  }
}

// 教师 Dashboard 数据获取
export const useTeacherDashboard = () => {
  const assignments = ref<Assignment[]>([])
  const stats = ref<DashboardStats[]>([])
  const calendarEvents = ref<CalendarEvent[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchTeacherData = async () => {
    loading.value = true
    error.value = null

    try {
      const [assignmentData, statsData] = await Promise.all([
        apiClient.get('/teacher/assignments'),
        apiClient.get('/teacher/stats')
      ])

      assignments.value = assignmentData.assignments || []
      stats.value = statsData.stats || []

      // 生成日历事件
      calendarEvents.value = assignments.value.map(assignment => ({
        id: assignment.id,
        title: assignment.title,
        start: assignment.dueDate,
        className: assignment.status,
        extendedProps: {
          status: assignment.status,
          title: assignment.title,
          dueDate: assignment.dueDate
        }
      }))
    } catch (err: any) {
      error.value = err.message || '获取教师数据失败'
      console.error('Teacher dashboard error:', err)
    } finally {
      loading.value = false
    }
  }

  const createAssignment = async (assignmentData: Partial<Assignment>) => {
    try {
      const newAssignment = await apiClient.post('/teacher/assignments', assignmentData)
      assignments.value.unshift(newAssignment)
      return newAssignment
    } catch (err: any) {
      error.value = err.message || '创建作业失败'
      throw err
    }
  }

  return {
    assignments: readonly(assignments),
    stats: readonly(stats),
    calendarEvents: readonly(calendarEvents),
    loading: readonly(loading),
    error: readonly(error),
    fetchTeacherData,
    createAssignment,
    refresh: fetchTeacherData
  }
}

// 课代表 Dashboard 数据获取
export const useMonitorDashboard = () => {
  const assignments = ref<Assignment[]>([])
  const stats = ref<DashboardStats[]>([])
  const calendarEvents = ref<CalendarEvent[]>([])
  const classStudents = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchMonitorData = async () => {
    loading.value = true
    error.value = null

    try {
      const [assignmentData, statsData, studentsData] = await Promise.all([
        apiClient.get('/monitor/assignments'),
        apiClient.get('/monitor/stats'),
        apiClient.get('/monitor/class-students')
      ])

      assignments.value = assignmentData.assignments || []
      stats.value = statsData.stats || []
      classStudents.value = studentsData.students || []

      // 生成日历事件
      calendarEvents.value = assignments.value.map(assignment => ({
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
    } catch (err: any) {
      error.value = err.message || '获取课代表数据失败'
      console.error('Monitor dashboard error:', err)
    } finally {
      loading.value = false
    }
  }

  const getSubmissionDetails = async (assignmentId: number) => {
    try {
      return await apiClient.get(`/monitor/assignments/${assignmentId}/submissions`)
    } catch (err: any) {
      error.value = err.message || '获取提交详情失败'
      throw err
    }
  }

  return {
    assignments: readonly(assignments),
    stats: readonly(stats),
    calendarEvents: readonly(calendarEvents),
    classStudents: readonly(classStudents),
    loading: readonly(loading),
    error: readonly(error),
    fetchMonitorData,
    getSubmissionDetails,
    refresh: fetchMonitorData
  }
}