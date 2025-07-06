<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="text-center">
        <div
          class="mx-auto h-16 w-16 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg flex items-center justify-center mb-6"
        >
          <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">管理员面板</h1>

        <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
          管理员功能正在开发中，敬请期待...
        </p>

        <router-link
          to="/"
          class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors duration-200"
        >
          返回首页
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 管理员页面 - 待开发
</script>
