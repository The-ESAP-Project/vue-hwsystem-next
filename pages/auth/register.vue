<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
    <div class="w-full max-w-md space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors duration-200">
          {{ $t('register.title') }}
        </h1>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
          {{ $t('register.subtitle') }}
        </p>
      </div>

      <div class="bg-white dark:bg-gray-800 py-8 px-6 shadow-sm rounded-lg transition-colors duration-200">
        <!-- 注册表单 -->
        <form class="space-y-6" @submit.prevent="handleRegister">
          <div>
            <label for="username" class="block text-sm/6 font-medium text-gray-900 dark:text-white transition-colors duration-200">
              {{ $t('common.username') }}
            </label>
            <div class="mt-2">
              <input 
                id="username"
                v-model="form.username" 
                type="text" 
                name="username" 
                :placeholder="$t('register.usernamePlaceholder')"
                autocomplete="username" 
                required 
                :disabled="pending"
                class="border border-solid border-zinc-200 dark:border-gray-600 block w-full rounded-md bg-white dark:bg-gray-700 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200" 
                :class="{ 'border-red-500 focus:outline-red-500': errors.username }"
              >
            </div>
            <p v-if="errors.username" class="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{{ errors.username }}</p>
          </div>

          <div>
            <label for="email" class="block text-sm/6 font-medium text-gray-900 dark:text-white transition-colors duration-200">
              {{ $t('common.email') }}
            </label>
            <div class="mt-2">
              <input 
                id="email"
                v-model="form.email" 
                type="email" 
                name="email" 
                :placeholder="$t('register.emailPlaceholder')"
                autocomplete="email" 
                required 
                :disabled="pending"
                class="border border-solid border-zinc-200 dark:border-gray-600 block w-full rounded-md bg-white dark:bg-gray-700 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200" 
                :class="{ 'border-red-500 focus:outline-red-500': errors.email }"
              >
            </div>
            <p v-if="errors.email" class="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{{ errors.email }}</p>
          </div>

          <div>
            <label for="name" class="block text-sm/6 font-medium text-gray-900 dark:text-white transition-colors duration-200">
              {{ $t('common.name') }}
            </label>
            <div class="mt-2">
              <input 
                id="name"
                v-model="form.name" 
                type="text" 
                name="name" 
                :placeholder="$t('register.namePlaceholder')"
                autocomplete="name" 
                required 
                :disabled="pending"
                class="border border-solid border-zinc-200 dark:border-gray-600 block w-full rounded-md bg-white dark:bg-gray-700 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200" 
                :class="{ 'border-red-500 focus:outline-red-500': errors.name }"
              >
            </div>
            <p v-if="errors.name" class="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{{ errors.name }}</p>
          </div>

          <div>
            <label for="role" class="block text-sm/6 font-medium text-gray-900 dark:text-white transition-colors duration-200">
              {{ $t('common.role') }}
            </label>
            <div class="mt-2">
              <select 
                id="role"
                v-model="form.role" 
                name="role" 
                required 
                :disabled="pending"
                class="border border-solid border-zinc-200 dark:border-gray-600 block w-full rounded-md bg-white dark:bg-gray-700 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200" 
                :class="{ 'border-red-500 focus:outline-red-500': errors.role }"
              >
                <option value="" class="text-gray-400 dark:text-gray-500">{{ $t('register.selectRole') }}</option>
                <option value="student" class="text-gray-900 dark:text-white">{{ $t('common.student') }}</option>
                <option value="teacher" class="text-gray-900 dark:text-white">{{ $t('common.teacher') }}</option>
              </select>
            </div>
            <p v-if="errors.role" class="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{{ errors.role }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm/6 font-medium text-gray-900 dark:text-white transition-colors duration-200">
              {{ $t('common.password') }}
            </label>
            <div class="mt-2 relative">
              <input 
                id="password"
                v-model="form.password" 
                :type="showPassword ? 'text' : 'password'" 
                name="password" 
                :placeholder="$t('register.passwordPlaceholder')"
                autocomplete="new-password" 
                required 
                :disabled="pending"
                class="border border-solid border-zinc-200 dark:border-gray-600 block w-full rounded-md bg-white dark:bg-gray-700 px-3 py-1.5 pr-10 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                :class="{ 'border-red-500 focus:outline-red-500': errors.password }"
              >
              <button
                type="button"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                @click="showPassword = !showPassword"
              >
                <EyeIcon v-if="!showPassword" class="h-5 w-5" />
                <EyeSlashIcon v-else class="h-5 w-5" />
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{{ errors.password }}</p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm/6 font-medium text-gray-900 dark:text-white transition-colors duration-200">
              {{ $t('register.confirmPassword') }}
            </label>
            <div class="mt-2 relative">
              <input 
                id="confirmPassword"
                v-model="form.confirmPassword" 
                :type="showConfirmPassword ? 'text' : 'password'" 
                name="confirmPassword" 
                :placeholder="$t('register.confirmPasswordPlaceholder')"
                autocomplete="new-password" 
                required 
                :disabled="pending"
                class="border border-solid border-zinc-200 dark:border-gray-600 block w-full rounded-md bg-white dark:bg-gray-700 px-3 py-1.5 pr-10 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                :class="{ 'border-red-500 focus:outline-red-500': errors.confirmPassword }"
              >
              <button
                type="button"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <EyeIcon v-if="!showConfirmPassword" class="h-5 w-5" />
                <EyeSlashIcon v-else class="h-5 w-5" />
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{{ errors.confirmPassword }}</p>
          </div>

          <!-- 服务条款同意 -->
          <div class="flex items-start">
            <div class="flex h-6 shrink-0 items-center">
              <div class="group grid size-4 grid-cols-1">
                <input 
                  id="agree-terms" 
                  v-model="form.agreeTerms" 
                  name="agree-terms" 
                  type="checkbox" 
                  required
                  class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200"
                >
                <svg class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white" viewBox="0 0 14 14" fill="none">
                  <path class="opacity-0 group-has-checked:opacity-100" d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
            </div>
            <label for="agree-terms" class="ml-3 block text-sm/6 text-gray-900 dark:text-white transition-colors duration-200">
              {{ $t('register.agreeTerms') }}
              <NuxtLink :to="localePath('/terms')" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors duration-200">
                {{ $t('register.termsOfService') }}
              </NuxtLink>
              {{ $t('register.and') }}
              <NuxtLink :to="localePath('/privacy')" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors duration-200">
                {{ $t('register.privacyPolicy') }}
              </NuxtLink>
            </label>
          </div>

          <!-- 错误信息 -->
          <Transition name="fade">
            <div v-if="error" class="rounded-md bg-red-50 dark:bg-red-900/50 p-4 transition-colors duration-200">
              <div class="flex">
                <div class="flex-shrink-0">
                  <XCircleIcon class="h-5 w-5 text-red-400" />
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-800 dark:text-red-200 transition-colors duration-200">
                    {{ error }}
                  </p>
                </div>
              </div>
            </div>
          </Transition>

          <!-- 成功信息 -->
          <Transition name="fade">
            <div v-if="success" class="rounded-md bg-green-50 dark:bg-green-900/50 p-4 transition-colors duration-200">
              <div class="flex">
                <div class="flex-shrink-0">
                  <CheckCircleIcon class="h-5 w-5 text-green-400" />
                </div>
                <div class="ml-3">
                  <p class="text-sm text-green-800 dark:text-green-200 transition-colors duration-200">
                    {{ success }}
                  </p>
                </div>
              </div>
            </div>
          </Transition>

          <!-- 提交按钮 -->
          <div class="space-y-4">
            <button 
              type="submit" 
              :disabled="pending || !isFormValid"
              class="flex w-full justify-center rounded-md bg-indigo-600 dark:bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 dark:hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="pending" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                {{ $t('common.loading') }}
              </span>
              <span v-else>{{ $t('register.createAccount') }}</span>
            </button>
          </div>
        </form>

        <!-- 登录链接 -->
        <div class="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6 text-center transition-colors duration-200">
          <p class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
            {{ $t('register.alreadyHaveAccount') }}
            <NuxtLink
              :to="localePath('/auth/login')"
              class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium transition-colors duration-200"
            >
              {{ $t('register.signIn') }}
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EyeIcon, EyeSlashIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'

// i18n
const { t } = useI18n()
const localePath = useLocalePath()

// 页面元信息
useHead({
  title: t('register.title'),
  titleTemplate: '%s | ' + t('home.title'),
  meta: [
    { name: 'description', content: t('register.metaDescription') },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: t('register.title') + ' | ' + t('home.title') },
    { property: 'og:description', content: t('register.metaDescription') },
  ]
})

// 页面配置
definePageMeta({
  layout: 'app',
  auth: false,
  keepalive: false
})

// 响应式数据
const form = reactive({
  username: '',
  email: '',
  name: '',
  role: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const pending = ref(false)
const error = ref('')
const success = ref('')
const errors = reactive({
  username: '',
  email: '',
  name: '',
  role: '',
  password: '',
  confirmPassword: ''
})

// 表单验证
const validateForm = () => {
  // 清空之前的错误
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  let isValid = true

  // 用户名验证
  if (!form.username.trim()) {
    errors.username = t('register.errors.usernameRequired')
    isValid = false
  } else if (form.username.length < 3) {
    errors.username = t('register.errors.usernameTooShort')
    isValid = false
  } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
    errors.username = t('register.errors.usernameInvalid')
    isValid = false
  }

  // 邮箱验证
  if (!form.email.trim()) {
    errors.email = t('register.errors.emailRequired')
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = t('register.errors.emailInvalid')
    isValid = false
  }

  // 姓名验证
  if (!form.name.trim()) {
    errors.name = t('register.errors.nameRequired')
    isValid = false
  } else if (form.name.length < 2) {
    errors.name = t('register.errors.nameTooShort')
    isValid = false
  }

  // 角色验证
  if (!form.role) {
    errors.role = t('register.errors.roleRequired')
    isValid = false
  }

  // 密码验证
  if (!form.password) {
    errors.password = t('register.errors.passwordRequired')
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = t('register.errors.passwordTooShort')
    isValid = false
  }

  // 确认密码验证
  if (!form.confirmPassword) {
    errors.confirmPassword = t('register.errors.confirmPasswordRequired')
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = t('register.errors.passwordMismatch')
    isValid = false
  }

  return isValid
}

// 表单是否有效
const isFormValid = computed(() => {
  return form.username && 
         form.email && 
         form.name && 
         form.role && 
         form.password && 
         form.confirmPassword && 
         form.agreeTerms
})

// 注册处理
const handleRegister = async () => {
  try {
    error.value = ''
    success.value = ''

    // 表单验证
    if (!validateForm()) {
      return
    }

    if (!form.agreeTerms) {
      error.value = t('register.errors.termsRequired')
      return
    }

    pending.value = true

    // 模拟 API 延迟
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 模拟检查用户名是否已存在
    const existingUsers = ['admin', 'teacher', 'student']
    if (existingUsers.includes(form.username)) {
      throw new Error(t('register.errors.usernameExists'))
    }

    // 模拟注册成功
    success.value = t('register.success.accountCreated')

    // 3秒后跳转到登录页面
    setTimeout(() => {
      navigateTo('/auth/login')
    }, 3000)

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    error.value = message || t('register.errors.registrationFailed')
  } finally {
    pending.value = false
  }
}

// 清除错误信息当用户输入时
watch([() => form.username, () => form.email, () => form.name, () => form.role, () => form.password, () => form.confirmPassword], () => {
  if (error.value) {
    error.value = ''
  }
  if (success.value) {
    success.value = ''
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
