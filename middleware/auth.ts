export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, user, initAuth } = useAuth()
  const localePath = useLocalePath()
  
  console.log('Auth middleware - path:', to.path)
  console.log('Auth middleware - isAuthenticated:', isAuthenticated.value)
  console.log('Auth middleware - user:', user.value)
  
  // 如果在客户端且用户状态未初始化，尝试重新初始化
  if (import.meta.client && !user.value) {
    console.log('Attempting to reinitialize auth state...')
    try {
      await initAuth()
      // 等待状态更新
      await nextTick()
      console.log('Reinitialized - isAuthenticated:', isAuthenticated.value, 'user:', user.value)
    } catch (err) {
      console.warn('Auth reinitialization failed:', err)
    }
  }
  
  // 再次检查认证状态
  if (!isAuthenticated.value) {
    console.log('Not authenticated after reinitialization, redirecting to login')
    return navigateTo(localePath('/auth/login'))
  }
  
  // 根据路由检查角色权限
  const path = to.path
  const userRole = user.value?.role
  
  console.log('Auth middleware - userRole:', userRole, 'path:', path)
  
  // 检查路由权限
  if (path.startsWith('/teacher/') && userRole !== 'teacher') {
    console.log('Access denied: not a teacher')
    throw createError({
      statusCode: 403,
      statusMessage: '无权访问教师页面'
    })
  }
  
  if (path.startsWith('/monitor/') && userRole !== 'monitor') {
    console.log('Access denied: not a monitor')
    throw createError({
      statusCode: 403,
      statusMessage: '无权访问课代表页面'
    })
  }
  
  if (path.startsWith('/student/') && userRole !== 'student') {
    console.log('Access denied: not a student')
    throw createError({
      statusCode: 403,
      statusMessage: '无权访问学生页面'
    })
  }
  
  console.log('Auth middleware - access granted')
})
