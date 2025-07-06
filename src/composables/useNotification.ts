import { ref } from 'vue'
import type { Notification, NotificationOptions } from '@/types/notification'

// 全局通知状态
const notifications = ref<Notification[]>([])

// 生成唯一 ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 默认配置
const defaultOptions = {
  duration: 5000, // 5秒
  closable: true,
  type: 'info' as const,
}

export function useNotification() {
  // 添加通知
  const addNotification = (options: NotificationOptions): string => {
    const notification: Notification = {
      id: generateId(),
      ...defaultOptions,
      ...options,
    }

    notifications.value.push(notification)

    // 自动关闭
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        removeNotification(notification.id)
      }, notification.duration)
    }

    return notification.id
  }

  // 移除通知
  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  // 清空所有通知
  const clearNotifications = () => {
    notifications.value = []
  }

  // 便捷方法
  const success = (title: string, message?: string, options?: Partial<NotificationOptions>) => {
    return addNotification({
      type: 'success',
      title,
      message,
      ...options,
    })
  }

  const error = (title: string, message?: string, options?: Partial<NotificationOptions>) => {
    return addNotification({
      type: 'error',
      title,
      message,
      duration: 0, // 错误通知默认不自动关闭
      ...options,
    })
  }

  const warning = (title: string, message?: string, options?: Partial<NotificationOptions>) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      duration: 8000, // 警告通知显示更长时间
      ...options,
    })
  }

  const info = (title: string, message?: string, options?: Partial<NotificationOptions>) => {
    return addNotification({
      type: 'info',
      title,
      message,
      ...options,
    })
  }

  return {
    notifications: notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    success,
    error,
    warning,
    info,
  }
}
