<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-all duration-200">
    <div class="w-full max-w-md space-y-8">
      <!-- 头部 -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center mb-6 shadow-lg">
          <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          创建账户
        </h1>
        <p class="mt-3 text-lg text-gray-600 dark:text-gray-300">
          加入我们的学习平台
        </p>
      </div>

      <!-- 注册表单 -->
      <div class="relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl border p-8">
        <form class="space-y-6" @submit.prevent="handleRegister">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                用户名
              </label>
              <input
                v-model="form.username"
                type="text"
                required
                placeholder="请输入用户名"
                class="block w-full px-3 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 transition-all duration-200"
              >
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                真实姓名
              </label>
              <input
                v-model="form.realName"
                type="text"
                required
                placeholder="请输入真实姓名"
                class="block w-full px-3 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 transition-all duration-200"
              >
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                身份
              </label>
              <select
                v-model="form.role"
                required
                class="block w-full px-3 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 transition-all duration-200"
              >
                <option value="">请选择身份</option>
                <option value="student">学生</option>
                <option value="teacher">老师</option>
                <option value="monitor">课代表</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                密码
              </label>
              <input
                v-model="form.password"
                type="password"
                required
                placeholder="请输入密码"
                class="block w-full px-3 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 transition-all duration-200"
              >
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                确认密码
              </label>
              <input
                v-model="form.confirmPassword"
                type="password"
                required
                placeholder="请再次输入密码"
                class="block w-full px-3 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 transition-all duration-200"
              >
            </div>
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
            <span v-if="pending">注册中...</span>
            <span v-else>创建账户</span>
          </button>
        </form>

        <!-- 登录链接 -->
        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            已有账户？
            <router-link
              to="/auth/login"
              class="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
            >
              立即登录
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  username: '',
  realName: '',
  role: '',
  password: '',
  confirmPassword: ''
})

const pending = ref(false)
const error = ref('')

const handleRegister = async () => {
  try {
    error.value = ''

    // 表单验证
    if (!form.username.trim()) {
      throw new Error('请输入用户名')
    }
    if (!form.realName.trim()) {
      throw new Error('请输入真实姓名')
    }
    if (!form.role) {
      throw new Error('请选择身份')
    }
    if (!form.password) {
      throw new Error('请输入密码')
    }
    if (form.password !== form.confirmPassword) {
      throw new Error('两次密码输入不一致')
    }

    pending.value = true

    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 注册成功，跳转到登录页
    await router.push('/auth/login')

  } catch (err: any) {
    error.value = err.message || '注册失败，请重试'
  } finally {
    pending.value = false
  }
}
</script>
