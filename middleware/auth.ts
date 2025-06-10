import { createSSRApiClient } from '~/utils/api'

export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, user, validateToken } = useAuth()
  
  console.log('Auth middleware - path:', to.path, 'SSR:', import.meta.server)
  
  // 在服务器端，直接验证 Cookie 中的 token
  if (import.meta.server) {
    const event = useRequestEvent()
    const cookies = parseCookies(event.node.req.headers.cookie || '')
    const authToken = cookies['auth-token']
    
    console.log('Auth middleware - SSR token:', !!authToken)
    
    if (!authToken) {
      console.log('Auth middleware - no token found, redirecting to login')
      return navigateTo('/auth/login')
    }
    
    // 在服务器端验证 token
    try {
      // 使用专门的 SSR axios 实例，传递完整的 cookie 头
      const ssrApiClient = createSSRApiClient(event.node.req.headers.cookie)
      const response = await ssrApiClient.get('/auth/me')
      
      // 在正确的上下文中设置用户状态
      user.value = response.data.user
      console.log('SSR token validation successful:', response.data.user)
    } catch (error: any) {
      console.error('Token validation failed:', error.response?.data || error.message)
      console.log('Auth middleware - token validation failed')
      return navigateTo('/auth/login')
    }
  } else {
    // 客户端处理
    if (!isAuthenticated.value) {
      console.log('Auth middleware - client side reinitialization...')
      
      try {
        const { initAuth } = useAuth()
        const initialized = await initAuth()
        
        if (!initialized || !isAuthenticated.value) {
          return navigateTo('/auth/login')
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        return navigateTo('/auth/login')
      }
    }
  }

  // 检查用户角色权限（只在客户端或已有用户信息时）
  const userRole = user.value?.role
  const path = to.path
  
  if (userRole) {
    console.log('Auth middleware - userRole:', userRole, 'path:', path)

    // 角色权限检查
    const rolePermissions = {
      student: ['/student'],
      teacher: ['/teacher'],
      monitor: ['/monitor']
    }

    // 检查是否访问受保护的路由
    for (const [role, allowedPaths] of Object.entries(rolePermissions)) {
      const hasAccess = allowedPaths.some(allowedPath => path.startsWith(allowedPath))
      
      if (hasAccess && userRole !== role) {
        console.log('Auth middleware - access denied for role:', userRole, 'to path:', path)
        const redirectPath = getRoleRedirectPath(userRole)
        return navigateTo(redirectPath)
      }
    }
  }

  console.log('Auth middleware - access granted')
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
      return '/auth/login'
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
