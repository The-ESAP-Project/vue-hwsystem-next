import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
    // 认证页面
    {
      path: '/auth/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/auth/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/auth/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/auth/ForgotPasswordView.vue'),
      meta: { requiresGuest: true },
    },
    // 学生页面
    {
      path: '/student',
      name: 'student',
      component: () => import('@/views/student/StudentIndexView.vue'),
      meta: { requiresAuth: true, roles: ['student'] },
    },
    {
      path: '/student/dashboard',
      name: 'student-dashboard',
      component: () => import('@/views/student/StudentDashboardView.vue'),
      meta: { requiresAuth: true, roles: ['student'] },
    },
    {
      path: '/student/homework/:id',
      name: 'student-homework',
      component: () => import('@/views/student/StudentHomeworkView.vue'),
      meta: { requiresAuth: true, roles: ['student'] },
    },
    // 老师页面
    {
      path: '/teacher',
      name: 'teacher',
      component: () => import('@/views/teacher/TeacherIndexView.vue'),
      meta: { requiresAuth: true, roles: ['teacher'] },
    },
    {
      path: '/teacher/dashboard',
      name: 'teacher-dashboard',
      component: () => import('@/views/teacher/TeacherDashboardView.vue'),
      meta: { requiresAuth: true, roles: ['teacher'] },
    },
    // 课代表页面
    {
      path: '/monitor',
      name: 'monitor',
      component: () => import('@/views/monitor/MonitorIndexView.vue'),
      meta: { requiresAuth: true, roles: ['monitor'] },
    },
    {
      path: '/monitor/dashboard',
      name: 'monitor-dashboard',
      component: () => import('@/views/monitor/MonitorDashboardView.vue'),
      meta: { requiresAuth: true, roles: ['monitor'] },
    },
    // 其他页面
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactView.vue'),
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('@/views/PrivacyView.vue'),
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('@/views/TermsView.vue'),
    },
  ],
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    if (!userStore.isAuthenticated) {
      // 未登录，重定向到登录页
      next({
        name: 'login',
        query: { redirect: to.fullPath },
      })
      return
    }

    // 检查角色权限
    if (to.meta.roles && Array.isArray(to.meta.roles)) {
      const userRole = userStore.currentUser?.role
      if (!userRole || !to.meta.roles.includes(userRole)) {
        // 角色不匹配，重定向到首页或显示错误页面
        next({ name: 'home' })
        return
      }
    }
  }

  // 检查是否需要游客状态（如登录页面）
  if (to.meta.requiresGuest && userStore.isAuthenticated) {
    // 已登录用户访问登录页面，重定向到对应的控制台
    next({ path: userStore.dashboardPath })
    return
  }

  next()
})

export default router
