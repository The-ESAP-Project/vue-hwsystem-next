export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated, user } = useAuth()
  
  // 如果未登录，重定向到登录页
  if (!isAuthenticated.value) {
    return navigateTo('/auth/login')
  }
  
  // 根据路由检查角色权限
  const path = to.path
  const userRole = user.value?.role
  
  // 检查路由权限
  if (path.startsWith('/teacher/') && userRole !== 'teacher') {
    throw createError({
      statusCode: 403,
      statusMessage: '无权访问教师页面'
    })
  }
  
  if (path.startsWith('/monitor/') && userRole !== 'monitor') {
    throw createError({
      statusCode: 403,
      statusMessage: '无权访问课代表页面'
    })
  }
  
  if (path.startsWith('/student/') && userRole !== 'student') {
    throw createError({
      statusCode: 403,
      statusMessage: '无权访问学生页面'
    })
  }
})
