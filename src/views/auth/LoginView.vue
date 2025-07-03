<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-all duration-200"
  >
    <div class="w-full max-w-md space-y-8">
      <!-- 现代化头部 -->
      <div class="text-center">
        <div
          class="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 flex items-center justify-center mb-6 shadow-lg"
        >
          <LockClosedIcon class="h-8 w-8 text-white" />
        </div>
        <h1
          class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent"
        >
          {{ t('auth.login.title') }}
        </h1>
        <p class="mt-3 text-lg text-gray-600 dark:text-gray-300 transition-colors duration-200">
          {{ t('auth.login.subtitle') }}
        </p>
      </div>

      <!-- 现代化卡片容器 -->
      <div
        class="relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 transition-all duration-200 hover:shadow-2xl"
      >
        <!-- 背景装饰 -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 dark:from-indigo-400/10 dark:to-purple-400/10 rounded-3xl"
        ></div>
        <div
          class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-800 dark:to-purple-800 rounded-full opacity-20 transform translate-x-10 -translate-y-10"
        ></div>

        <div class="relative">
          <!-- 登录表单 -->
          <form class="space-y-6" @submit.prevent="handleLogin">
            <div class="space-y-5">
              <div class="group">
                <label
                  for="username"
                  class="block text-sm font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200"
                >
                  {{ t('auth.login.username') }}
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon
                      class="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 transition-colors duration-200"
                    />
                  </div>
                  <input
                    id="username"
                    v-model="form.username"
                    type="text"
                    name="username"
                    :placeholder="t('auth.login.usernamePlaceholder')"
                    autocomplete="username"
                    required
                    :disabled="userStore.isLoading"
                    class="block w-full pl-10 pr-3 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    :class="{ 'ring-2 ring-red-500 focus:ring-red-500': error }"
                  />
                </div>
              </div>

              <div class="group">
                <label
                  for="password"
                  class="block text-sm font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200"
                >
                  {{ t('auth.login.password') }}
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon
                      class="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 transition-colors duration-200"
                    />
                  </div>
                  <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    name="password"
                    :placeholder="t('auth.login.passwordPlaceholder')"
                    autocomplete="current-password"
                    required
                    :disabled="userStore.isLoading"
                    class="block w-full pl-10 pr-12 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    :class="{ 'ring-2 ring-red-500 focus:ring-red-500': error }"
                  />
                  <button
                    type="button"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                    @click="showPassword = !showPassword"
                  >
                    <EyeIcon v-if="!showPassword" class="h-5 w-5" />
                    <EyeSlashIcon v-else class="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <!-- 现代化错误提示 -->
            <Transition name="fade">
              <div
                v-if="error"
                class="rounded-2xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 p-4 transition-all duration-200"
              >
                <div class="flex">
                  <div class="flex-shrink-0">
                    <XCircleIcon class="h-5 w-5 text-red-500 dark:text-red-400" />
                  </div>
                  <div class="ml-3">
                    <p
                      class="text-sm font-medium text-red-800 dark:text-red-200 transition-colors duration-200"
                    >
                      {{ error }}
                    </p>
                  </div>
                </div>
              </div>
            </Transition>

            <!-- 记住我选项 -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="relative">
                  <input
                    id="remember-me"
                    v-model="form.rememberMe"
                    name="remember-me"
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-600 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 transition-colors duration-200"
                  />
                </div>
                <label
                  for="remember-me"
                  class="ml-3 block text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200"
                >
                  {{ t('auth.login.rememberMe') }}
                </label>
              </div>

              <router-link
                to="/auth/forgot-password"
                class="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors duration-200"
              >
                {{ t('auth.login.forgotPassword') }}
              </router-link>
            </div>

            <!-- 现代化提交按钮 -->
            <div class="space-y-4">
              <button
                type="submit"
                :disabled="userStore.isLoading || !form.username || !form.password"
                class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-2xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
              >
                <span v-if="userStore.isLoading" class="flex items-center">
                  <LoadingSpinner class="-ml-1 mr-3" size="md" color="white" />
                  {{ t('auth.login.loggingIn') }}
                </span>
                <span v-else class="flex items-center">
                  <ArrowLeftEndOnRectangleIcon class="mr-2 h-5 w-5" />
                  {{ t('auth.login.loginButton') }}
                </span>
              </button>
            </div>
          </form>

          <!-- 注册链接 -->
          <div
            class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200"
          >
            <div class="text-center">
              <p class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                {{ t('auth.login.noAccount') }}
                <router-link
                  to="/auth/register"
                  class="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors duration-200"
                >
                  {{ t('auth.login.register') }}
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useLanguage } from '@/composables/useLanguage'
import {
  LockClosedIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  XCircleIcon,
  ArrowLeftEndOnRectangleIcon,
} from '@heroicons/vue/24/outline'
import { LoadingSpinner } from '@/components/icon'

const router = useRouter()
const userStore = useUserStore()
const { t } = useLanguage()

// 响应式数据
const form = reactive({
  username: '',
  password: '',
  rememberMe: false,
})

const showPassword = ref(false)
const error = ref('')

// 登录处理
const handleLogin = async () => {
  try {
    error.value = ''

    // 表单验证
    if (!form.username.trim()) {
      throw new Error(t('auth.login.validation.usernameRequired'))
    }
    if (!form.password.trim()) {
      throw new Error(t('auth.login.validation.passwordRequired'))
    }

    // 使用 store 登录
    await userStore.login({
      username: form.username,
      password: form.password,
    })

    // 登录成功后跳转到对应的仪表盘
    console.log('登录成功，跳转到:', userStore.dashboardPath)
    await router.push(userStore.dashboardPath)
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : t('auth.login.validation.loginFailed')
  }
}

// 页面标题
document.title = `${t('auth.login.title')} - ${t('app.name')}`
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}
</style>
