<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-all duration-200">
    <div class="max-w-md w-full text-center">
      <!-- 错误图标 -->
      <div class="mx-auto h-24 w-24 rounded-3xl bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center mb-8 shadow-lg">
        <component :is="errorIcon" class="h-12 w-12 text-white" />
      </div>

      <!-- 错误标题 -->
      <h1 class="text-6xl font-bold bg-gradient-to-r from-red-600 to-pink-600 dark:from-red-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
        {{ error.statusCode }}
      </h1>

      <!-- 错误描述 -->
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">
        {{ errorTitle }}
      </h2>

      <p class="text-lg text-gray-600 dark:text-gray-300 mb-8 transition-colors duration-200">
        {{ errorMessage }}
      </p>

      <!-- 操作按钮 -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="handleError"
          class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
        >
          {{ $t('error.goHome') || '返回首页' }}
        </button>
        
        <button
          @click="goBack"
          class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
        >
          {{ $t('error.goBack') || '返回上页' }}
        </button>
      </div>

      <!-- 开发环境错误详情 -->
      <div v-if="isDev && error.stack" class="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl text-left">
        <details>
          <summary class="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('error.technicalDetails') || '技术详情' }}
          </summary>
          <pre class="text-xs text-gray-600 dark:text-gray-400 overflow-auto">{{ error.stack }}</pre>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ExclamationTriangleIcon,
  NoSymbolIcon,
  ServerIcon,
  ShieldExclamationIcon
} from '@heroicons/vue/24/outline'

// i18n
const { t } = useI18n()
const localePath = useLocalePath()

// 获取错误信息
const error = useError()

// 检查是否为开发环境
const { $config } = useNuxtApp()
const isDev = process.dev

// 错误类型映射
const errorIcon = computed(() => {
  const statusCode = error.value?.statusCode || 500
  
  switch (statusCode) {
    case 404:
      return ExclamationTriangleIcon
    case 403:
      return NoSymbolIcon
    case 401:
      return ShieldExclamationIcon
    default:
      return ServerIcon
  }
})

// 错误标题
const errorTitle = computed(() => {
  const statusCode = error.value?.statusCode || 500
  
  switch (statusCode) {
    case 404:
      return t('error.404.title') || '页面未找到'
    case 403:
      return t('error.403.title') || '访问被拒绝'
    case 401:
      return t('error.401.title') || '未授权访问'
    case 500:
      return t('error.500.title') || '服务器错误'
    default:
      return t('error.default.title') || '出现错误'
  }
})

// 错误消息
const errorMessage = computed(() => {
  const statusCode = error.value?.statusCode || 500
  
  switch (statusCode) {
    case 404:
      return t('error.404.message') || '您访问的页面不存在，可能已被删除或移动。'
    case 403:
      return t('error.403.message') || '您没有权限访问此页面。'
    case 401:
      return t('error.401.message') || '请先登录以访问此页面。'
    case 500:
      return t('error.500.message') || '服务器遇到了问题，请稍后再试。'
    default:
      return error.value?.statusMessage || t('error.default.message') || '发生了未知错误。'
  }
})

// 处理错误
const handleError = async () => {
  // 清除错误
  await clearError({
    redirect: localePath('/')
  })
}

// 返回上一页
const goBack = () => {
  // 如果有历史记录，返回上一页
  if (window.history.length > 1) {
    window.history.back()
  } else {
    // 否则跳转到首页
    navigateTo(localePath('/'))
  }
}

// SEO Meta
useHead({
  title: computed(() => `${errorTitle.value} - ${t('home.title')}`),
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<style scoped>
/* 确保错误页面在所有设备上都有适当的间距 */
@media (max-width: 640px) {
  h1 {
    font-size: 3rem;
  }
}

/* 开发环境错误详情样式 */
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 200px;
}
</style>
