// API 错误处理工具
import type { ApiError } from '@/services/api'

/**
 * 格式化 API 错误消息
 */
export const formatApiError = (error: ApiError | unknown): string => {
  if (error && typeof error === 'object') {
    // 如果是 ApiError 类型
    if ('message' in error && typeof error.message === 'string') {
      return error.message
    }

    // 如果是 axios 错误
    if ('response' in error && error.response && typeof error.response === 'object' &&
        'data' in error.response && error.response.data && typeof error.response.data === 'object' &&
        'message' in error.response.data && typeof error.response.data.message === 'string') {
      return error.response.data.message
    }

    // 如果是网络错误
    if ('message' in error && typeof error.message === 'string') {
      return error.message
    }
  }

  // 默认错误消息
  return '未知错误，请稍后重试'
}

/**
 * 检查是否为认证错误
 */
export const isAuthError = (error: ApiError | unknown): boolean => {
  if (error && typeof error === 'object') {
    // 检查状态码
    if (('code' in error && (error.code === 401)) || ('status' in error && (error.status === 401))) {
      return true
    }

    // 检查 axios 错误
    if ('response' in error && error.response && typeof error.response === 'object' &&
        'status' in error.response && error.response.status === 401) {
      return true
    }
  }

  return false
}

/**
 * 检查是否为权限错误
 */
export const isPermissionError = (error: ApiError | unknown): boolean => {
  if (error && typeof error === 'object') {
    // 检查状态码
    if (('code' in error && (error.code === 403)) || ('status' in error && (error.status === 403))) {
      return true
    }

    // 检查 axios 错误
    if ('response' in error && error.response && typeof error.response === 'object' &&
        'status' in error.response && error.response.status === 403) {
      return true
    }
  }

  return false
}

/**
 * 检查是否为网络错误
 */
export const isNetworkError = (error: ApiError | unknown): boolean => {
  if (error && typeof error === 'object') {
    // 检查是否为网络连接错误
    if (('code' in error && (error.code === -1)) || !('response' in error)) {
      return true
    }

    // 检查 axios 网络错误
    if (('code' in error && typeof error.code === 'string' &&
         (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED'))) {
      return true
    }
  }

  return false
}

/**
 * 处理 API 错误的通用函数
 */
export const handleApiError = (error: ApiError | unknown): void => {
  const message = formatApiError(error)

  if (isNetworkError(error)) {
    console.error('网络连接失败:', message)
    // 可以在这里显示网络错误的通知
  } else if (isAuthError(error)) {
    console.error('认证失败:', message)
    // 可以在这里处理认证失败的逻辑，比如跳转到登录页
  } else if (isPermissionError(error)) {
    console.error('权限不足:', message)
    // 可以在这里处理权限错误
  } else {
    console.error('API 错误:', message)
  }

  // 可以集成通知系统来显示错误消息
  // notification.error(message || defaultMessage || '操作失败')
}
