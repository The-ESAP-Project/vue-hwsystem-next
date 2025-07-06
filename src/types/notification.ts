export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number // 持续时间（毫秒），0 表示不自动关闭
  closable?: boolean // 是否可以手动关闭
  actions?: NotificationAction[]
}

export interface NotificationAction {
  label: string
  action: () => void
  style?: 'primary' | 'secondary' | 'danger'
}

export interface NotificationOptions {
  type?: NotificationType
  title: string
  message?: string
  duration?: number
  closable?: boolean
  actions?: NotificationAction[]
}
