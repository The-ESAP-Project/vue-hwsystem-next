<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-all duration-200">
    <div class="w-full max-w-md space-y-8">
      <!-- 头部 -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center mb-6 shadow-lg">
          <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-11.674 1.515A6 6 0 003 9a6 6 0 1011.674 1.515zM12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          忘记密码
        </h1>
        <p class="mt-3 text-lg text-gray-600 dark:text-gray-300">
          输入您的用户名，我们将帮您重置密码
        </p>
      </div>

      <!-- 表单 -->
      <div class="relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl border p-8">
        <div v-if="!submitted">
          <form class="space-y-6" @submit.prevent="handleSubmit">
            <div>
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                用户名
              </label>
              <input
                v-model="form.username"
                type="text"
                required
                placeholder="请输入您的用户名"
                class="block w-full px-3 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 transition-all duration-200"
              >
            </div>

            <!-- 错误提示 -->
            <div v-if="error" class="rounded-2xl bg-red-50 dark:bg-red-900/30 border border-red-200 p-4">
              <p class="text-sm font-medium text-red-800 dark:text-red-200">
                {{ error }}
              </p>
            </div>

            <!-- 提交按钮 -->
            <button
              type="submit"
              :disabled="pending"
              class="w-full py-3 px-4 text-sm font-semibold rounded-2xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
            >
              <span v-if="pending">处理中...</span>
              <span v-else>重置密码</span>
            </button>
          </form>
        </div>

        <!-- 成功提示 -->
        <div v-else class="text-center">
          <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            重置申请已提交
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            请联系管理员获取新密码，或稍后重试
          </p>
        </div>

        <!-- 返回登录链接 -->
        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            记起密码了？
            <router-link
              to="/auth/login"
              class="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
            >
              返回登录
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const form = reactive({
  username: ''
})

const pending = ref(false)
const error = ref('')
const submitted = ref(false)

const handleSubmit = async () => {
  try {
    error.value = ''

    if (!form.username.trim()) {
      throw new Error('请输入用户名')
    }

    pending.value = true

    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    submitted.value = true

  } catch (err: any) {
    error.value = err.message || '重置失败，请重试'
  } finally {
    pending.value = false
  }
}
</script>
