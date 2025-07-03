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
          <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
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
                    <svg
                      class="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 transition-colors duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
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
                    <svg
                      class="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 transition-colors duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
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
                    <svg
                      v-if="!showPassword"
                      class="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <svg
                      v-else
                      class="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
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
                    <svg
                      class="h-5 w-5 text-red-500 dark:text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clip-rule="evenodd"
                      />
                    </svg>
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
                  <svg
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    />
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {{ t('auth.login.loggingIn') }}
                </span>
                <span v-else class="flex items-center">
                  <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
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
