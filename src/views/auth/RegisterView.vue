<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-all duration-200"
  >
    <div class="w-full max-w-md space-y-8">
      <!-- 头部 -->
      <div class="text-center">
        <div
          class="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 flex items-center justify-center mb-6 shadow-lg"
        >
          <UserPlusIcon class="h-8 w-8 text-white" />
        </div>
        <h1
          class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent"
        >
          {{ t('auth.register.title') }}
        </h1>
        <p class="mt-3 text-lg text-gray-600 dark:text-gray-300 transition-colors duration-200">
          {{ t('auth.register.subtitle') }}
        </p>
      </div>

      <!-- 注册表单容器 -->
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
          <!-- 注册功能未开放提示 -->
          <div v-if="!isRegistrationEnabled" class="text-center">
            <div
              class="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <ExclamationTriangleIcon class="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200"
            >
              {{ t('auth.register.notAvailable') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-200">
              {{ t('auth.register.notAvailableMessage') }}
            </p>
          </div>

          <!-- 注册表单 (当功能开放时) -->
          <form v-else class="space-y-6" @submit.prevent="handleRegister">
            <div class="space-y-5">
              <div class="group">
                <label
                  for="username"
                  class="block text-sm font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200"
                >
                  {{ t('auth.register.username') }}
                </label>
                <input
                  id="username"
                  v-model="form.username"
                  type="text"
                  name="username"
                  required
                  :placeholder="t('auth.register.usernamePlaceholder')"
                  class="block w-full px-3 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200 text-sm"
                />
              </div>

              <div class="group">
                <label
                  for="realName"
                  class="block text-sm font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200"
                >
                  {{ t('auth.register.realName') }}
                </label>
                <input
                  id="realName"
                  v-model="form.realName"
                  type="text"
                  name="realName"
                  required
                  :placeholder="t('auth.register.realNamePlaceholder')"
                  class="block w-full px-3 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200 text-sm"
                />
              </div>

              <div class="group">
                <label
                  for="role"
                  class="block text-sm font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200"
                >
                  {{ t('auth.register.role') }}
                </label>
                <select
                  id="role"
                  v-model="form.role"
                  name="role"
                  required
                  class="block w-full px-3 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200 text-sm"
                >
                  <option value="">{{ t('auth.register.rolePlaceholder') }}</option>
                  <option value="student">{{ t('auth.register.roles.student') }}</option>
                  <option value="teacher">{{ t('auth.register.roles.teacher') }}</option>
                  <option value="monitor">{{ t('auth.register.roles.monitor') }}</option>
                </select>
              </div>

              <div class="group">
                <label
                  for="password"
                  class="block text-sm font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200"
                >
                  {{ t('auth.register.password') }}
                </label>
                <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  name="password"
                  required
                  :placeholder="t('auth.register.passwordPlaceholder')"
                  class="block w-full px-3 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200 text-sm"
                />
              </div>

              <div class="group">
                <label
                  for="confirmPassword"
                  class="block text-sm font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200"
                >
                  {{ t('auth.register.confirmPassword') }}
                </label>
                <input
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  type="password"
                  name="confirmPassword"
                  required
                  :placeholder="t('auth.register.confirmPasswordPlaceholder')"
                  class="block w-full px-3 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200 text-sm"
                />
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

            <!-- 现代化提交按钮 -->
            <div class="space-y-4">
              <button
                type="submit"
                :disabled="
                  pending ||
                  !form.username ||
                  !form.realName ||
                  !form.role ||
                  !form.password ||
                  !form.confirmPassword
                "
                class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-2xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
              >
                <span v-if="pending" class="flex items-center">
                  <LoadingSpinner class="-ml-1 mr-3" size="md" color="white" />
                  {{ t('auth.register.processing') }}
                </span>
                <span v-else class="flex items-center">
                  <UserPlusIcon class="mr-2 h-5 w-5" />
                  {{ t('auth.register.submitButton') }}
                </span>
              </button>
            </div>
          </form>

          <!-- 登录链接 -->
          <div
            class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200"
          >
            <div class="text-center">
              <p class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                {{ t('auth.register.hasAccount') }}
                <router-link
                  to="/auth/login"
                  class="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors duration-200"
                >
                  {{ t('auth.register.loginLink') }}
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
import { useLanguage } from '@/composables/useLanguage'
import { useEnvConfig } from '@/composables/useEnvConfig'
import { UserPlusIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import LoadingSpinner from '@/components/icon/LoadingSpinner.vue'

const router = useRouter()
const { t } = useLanguage()
const { isRegistrationEnabled } = useEnvConfig()

// 响应式数据
const form = reactive({
  username: '',
  realName: '',
  role: '',
  password: '',
  confirmPassword: '',
})

const pending = ref(false)
const error = ref('')

// 注册处理
const handleRegister = async () => {
  try {
    error.value = ''

    // 表单验证
    if (!form.username.trim()) {
      throw new Error(t('auth.register.validation.usernameRequired'))
    }
    if (!form.realName.trim()) {
      throw new Error(t('auth.register.validation.realNameRequired'))
    }
    if (!form.role) {
      throw new Error(t('auth.register.validation.roleRequired'))
    }
    if (!form.password) {
      throw new Error(t('auth.register.validation.passwordRequired'))
    }
    if (form.password !== form.confirmPassword) {
      throw new Error(t('auth.register.validation.passwordMismatch'))
    }

    pending.value = true

    // 模拟 API 调用
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 注册成功，跳转到登录页
    console.log('注册成功，跳转到登录页')
    await router.push('/auth/login')
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : t('auth.register.validation.registerFailed')
  } finally {
    pending.value = false
  }
}

// 页面标题
document.title = `${t('auth.register.title')} - ${t('app.name')}`
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
