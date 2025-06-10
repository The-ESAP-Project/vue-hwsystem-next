<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
  </div>
</template>

<script setup lang="ts">
// i18n
const localePath = useLocalePath()

// 页面配置
definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

// 自动重定向到 dashboard
await navigateTo(localePath('/monitor/dashboard'), { replace: true })
</script>
