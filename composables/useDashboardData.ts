import { apiClient } from '~/utils/api'

// 通用 Dashboard 数据类型
export interface DashboardStats {
  label: string
  value: string | number
  icon?: any
  bgColor?: string
  iconColor?: string
}

export interface Assignment {
  id: number
  title: string
  assignDate: string
  dueDate: string
  status: string
  description?: string
  attempts?: number
  submitTime?: string | null
  totalStudents?: number
  submitted?: number
  classSubmitted?: number
  classTotal?: number
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

  const fetchStudentData = async () => {
    loading.value = true
    error.value = null
    
    try {
      const [assignmentData, statsData] = await Promise.all([
        apiClient.get('/student/assignments'),
        apiClient.get('/student/stats')
      ])
      
      assignments.value = assignmentData.assignments || []
      stats.value = statsData.stats || []
      
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
