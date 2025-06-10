export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, user, initAuth } = useAuth()
  
  console.log('Guest middleware - path:', to.path, 'SSR:', import.meta.server)
  
  // 在客户端检查认证状态
  if (import.meta.client) {
    // 如果还未初始化，先初始化认证状态
    if (!isAuthenticated.value) {
      console.log('Guest middleware - initializing auth...')
      await initAuth()
    }
    
    // 如果已认证，重定向到对应的面板
    if (isAuthenticated.value && user.value) {
      console.log('Guest middleware - user is authenticated, redirecting to dashboard')
      const redirectPath = getRoleRedirectPath(user.value.role)
      return navigateTo(redirectPath, { replace: true })
    }
  } else {
    // SSR 期间检查 Cookie
    const event = useRequestEvent()
    const cookies = parseCookies(event.node.req.headers.cookie || '')
    const authToken = cookies['auth-token']
    
    if (authToken) {
      console.log('Guest middleware - SSR user has token, redirecting to dashboard')
      // 可以尝试验证 token 并获取用户信息，但为了简化，我们暂时重定向到通用路径
      // 在实际应用中，你可能想要验证 token 并根据角色重定向
      return navigateTo('/', { replace: true })
    }
  }
  
  console.log('Guest middleware - allowing access to auth page')
})

// 辅助函数
function getRoleRedirectPath(role: string) {
  switch (role) {
    case 'monitor':
      return '/monitor/dashboard'
    case 'teacher':
      return '/teacher/dashboard'
    case 'student':
      return '/student/dashboard'
    default:
      return '/'
  }
}

// Cookie 解析辅助函数
function parseCookies(cookieHeader: string) {
  const cookies: Record<string, string> = {}
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [name, ...rest] = cookie.split('=')
      const value = rest.join('=').trim()
      if (name && value) {
        cookies[name.trim()] = decodeURIComponent(value)
      }
    })
  }
  return cookies
}
