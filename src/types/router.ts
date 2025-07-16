// 扩展 Vue Router 的元数据类型
import 'vue-router'
import type { UserRole } from './user'

declare module 'vue-router' {
  interface RouteMeta {
    // 是否需要认证
    requiresAuth?: boolean
    // 是否需要游客状态（未登录）
    requiresGuest?: boolean
    // 允许访问的角色
    roles?: UserRole[]
    // 页面标题
    title?: string
    // 是否在导航中隐藏
    hidden?: boolean
  }
}
