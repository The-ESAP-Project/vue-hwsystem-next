import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置（比如从浏览器后退按钮），则恢复到保存的位置
    if (savedPosition) {
      return savedPosition
    }
    // 如果目标路由有锚点，则滚动到锚点位置
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    // 默认滚动到页面顶部
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    // 首页路由
    {
      path: '/',
      component: DefaultLayout, // 这里用你的布局组件
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('@/views/AboutView.vue'),
        },
        {
          path: 'contact',
          name: 'contact',
          component: () => import('@/views/ContactView.vue'),
        },
        {
          path: 'privacy',
          name: 'privacy',
          component: () => import('@/views/PrivacyView.vue'),
        },
        {
          path: 'terms',
          name: 'terms',
          component: () => import('@/views/TermsView.vue'),
        },
      ],
    },
    // 认证页面路由组
    {
      path: '/auth',
      meta: { requiresGuest: true },
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/auth/LoginView.vue'),
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/views/auth/RegisterView.vue'),
        },
        {
          path: 'forgot-password',
          name: 'forgot-password',
          component: () => import('@/views/auth/ForgotPasswordView.vue'),
        },
      ],
    },
    // 用户页面路由组
    {
      path: '/user',
      meta: { requiresAuth: true, roles: ['user'] },
      children: [
        {
          path: '',
          name: 'student',
          component: () => import('@/views/user/UserIndexView.vue'),
        },
        {
          path: 'dashboard',
          name: 'student-dashboard',
          component: () => import('@/views/user/UserDashboardView.vue'),
        },
        {
          path: 'homework/:id',
          name: 'student-homework',
          component: () => import('@/views/user/UserHomeworkView.vue'),
        },
      ],
    },
    // 老师页面路由组
    {
      path: '/teacher',
      meta: { requiresAuth: true, roles: ['teacher'] },
      children: [
        {
          path: '',
          name: 'teacher',
          component: () => import('@/views/teacher/TeacherIndexView.vue'),
        },
        {
          path: 'dashboard',
          name: 'teacher-dashboard',
          component: () => import('@/views/teacher/TeacherDashboardView.vue'),
        },
      ],
    },
    // 管理员页面路由组
    {
      path: '/admin',
      meta: { requiresAuth: true, roles: ['admin'] },
      children: [
        {
          path: 'dashboard',
          name: 'admin',
          component: () => import('@/views/admin/AdminIndexView.vue'),
        },
      ],
    },
    // 404 页面 - 必须放在最后
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // 确保用户状态已经初始化
  if (!userStore.isInitialized) {
    await userStore.initAuth()
  }

  // 获取最匹配的路由记录（包括父路由的 meta）
  const matchedRoute = to.matched[to.matched.length - 1]
  const parentRoute = to.matched.length > 1 ? to.matched[to.matched.length - 2] : null

  // 合并父子路由的 meta 信息
  const combinedMeta = {
    ...parentRoute?.meta,
    ...matchedRoute?.meta,
  }

  // 如果已登录用户访问首页，重定向到对应的 dashboard
  if (to.name === 'home' && userStore.isAuthenticated) {
    if (to.path !== userStore.dashboardPath) {
      next({ path: userStore.dashboardPath })
      return
    }
  }

  // 检查是否需要认证
  if (combinedMeta.requiresAuth) {
    if (!userStore.isAuthenticated) {
      console.warn('用户未认证，重定向到登录页')
      // 未登录，重定向到登录页
      next({
        name: 'login',
        query: { redirect: to.fullPath },
      })
      return
    }

    // 检查角色权限
    if (combinedMeta.roles && Array.isArray(combinedMeta.roles)) {
      const userRole = userStore.currentUser?.role
      if (!userRole || !combinedMeta.roles.includes(userRole)) {
        // 角色不匹配，重定向到对应的 dashboard（避免死循环）
        if (to.path !== userStore.dashboardPath) {
          next({ path: userStore.dashboardPath })
          return
        }
      }
    }
  }

  // 检查是否需要游客状态（如登录页面）
  if (combinedMeta.requiresGuest && userStore.isAuthenticated) {
    // 已登录用户访问登录页面，重定向到对应的控制台（避免死循环）
    if (to.path !== userStore.dashboardPath) {
      next({ path: userStore.dashboardPath })
      return
    }
  }

  next()
})

export default router
