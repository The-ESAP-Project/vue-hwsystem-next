<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-all duration-200">
    <div class="w-full max-w-md space-y-8">
      <!-- 现代化头部 -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 flex items-center justify-center mb-6 shadow-lg">
          <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
          {{ $t('register.title') }}
        </h1>
        <p class="mt-3 text-lg text-gray-600 dark:text-gray-300 transition-colors duration-200">
          {{ $t('register.subtitle') }}
        </p>
      </div>

      <!-- 现代化卡片容器 -->
      <div class="relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 transition-all duration-200 hover:shadow-2xl">
        <!-- 背景装饰 -->
        <div class="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 dark:from-indigo-400/10 dark:to-purple-400/10 rounded-3xl"></div>
        <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-800 dark:to-purple-800 rounded-full opacity-20 transform translate-x-10 -translate-y-10"></div>
        
        <div class="relative">
          <!-- 注册表单 -->
          <form class="space-y-6" @submit.prevent="handleRegister">
            <div class="space-y-5">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="group">
                  <label for="username" class="block text-sm font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                    {{ $t('common.username') }}
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input 
                      id="username"
                      v-model="form.username" 
                      type="text" 
                      name="username" 
                      :placeholder="$t('register.usernamePlaceholder')"
                      autocomplete="username" 
                      required 
                      :disabled="pending"
                      class="block w-full pl-10 pr-3 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm" 
                      :class="{ 'ring-2 ring-red-500 focus:ring-red-500': errors.username }"
                    >
                  </div>
                  <p v-if="errors.username" class="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{{ errors.username }}</p>
                </div>

                <div class="group">
                  <label for="name" class="block text-sm font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                    {{ $t('common.name') }}
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <input 
                      id="name"
                      v-model="form.name" 
                      type="text" 
                      name="name" 
                      :placeholder="$t('register.namePlaceholder')"
                      autocomplete="name" 
                      required 
                      :disabled="pending"
                      class="block w-full pl-10 pr-3 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm" 
                      :class="{ 'ring-2 ring-red-500 focus:ring-red-500': errors.name }"
                    >
                  </div>
                  <p v-if="errors.name" class="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{{ errors.name }}</p>
                </div>
              </div>

              <div class="group">
                <label for="email" class="block text-sm font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                  {{ $t('common.email') }}
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input 
                    id="email"
                    v-model="form.email" 
                    type="email" 
                    name="email" 
                    :placeholder="$t('register.emailPlaceholder')"
                    autocomplete="email" 
                    required 
                    :disabled="pending"
                    class="block w-full pl-10 pr-3 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm" 
                    :class="{ 'ring-2 ring-red-500 focus:ring-red-500': errors.email }"
                  >
                </div>
                <p v-if="errors.email" class="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{{ errors.email }}</p>
              </div>

              <div class="group">
                <label for="role" class="block text-sm font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                  {{ $t('common.role') }}
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <select 
                    id="role"
                    v-model="form.role" 
                    name="role" 
                    required 
                    :disabled="pending"
                    class="block w-full pl-10 pr-3 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm" 
                    :class="{ 'ring-2 ring-red-500 focus:ring-red-500': errors.role }"
                  >
                    <option value="" class="text-gray-400 dark:text-gray-500">{{ $t('register.selectRole') }}</option>
                    <option value="student" class="text-gray-900 dark:text-white">{{ $t('common.student') }}</option>
                    <option value="teacher" class="text-gray-900 dark:text-white">{{ $t('common.teacher') }}</option>
                  </select>
                </div>
                <p v-if="errors.role" class="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{{ errors.role }}</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="group">
                  <label for="password" class="block text-sm font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                    {{ $t('common.password') }}
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input 
                      id="password"
                      v-model="form.password" 
                      :type="showPassword ? 'text' : 'password'" 
                      name="password" 
                      :placeholder="$t('register.passwordPlaceholder')"
                      autocomplete="new-password" 
                      required 
                      :disabled="pending"
                      class="block w-full pl-10 pr-12 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      :class="{ 'ring-2 ring-red-500 focus:ring-red-500': errors.password }"
                    >
                    <button
                      type="button"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                      @click="showPassword = !showPassword"
                    >
                      <EyeIcon v-if="!showPassword" class="h-5 w-5" />
                      <EyeSlashIcon v-else class="h-5 w-5" />
                    </button>
                  </div>
                  <p v-if="errors.password" class="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{{ errors.password }}</p>
                </div>

                <div class="group">
                  <label for="confirmPassword" class="block text-sm font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                    {{ $t('register.confirmPassword') }}
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <input 
                      id="confirmPassword"
                      v-model="form.confirmPassword" 
                      :type="showConfirmPassword ? 'text' : 'password'" 
                      name="confirmPassword" 
                      :placeholder="$t('register.confirmPasswordPlaceholder')"
                      autocomplete="new-password" 
                      required 
                      :disabled="pending"
                      class="block w-full pl-10 pr-12 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      :class="{ 'ring-2 ring-red-500 focus:ring-red-500': errors.confirmPassword }"
                    >
                    <button
                      type="button"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                      @click="showConfirmPassword = !showConfirmPassword"
                    >
                      <EyeIcon v-if="!showConfirmPassword" class="h-5 w-5" />
                      <EyeSlashIcon v-else class="h-5 w-5" />
                    </button>
                  </div>
                  <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{{ errors.confirmPassword }}</p>
                </div>
              </div>
            </div>

            <!-- 服务条款同意 -->
            <div class="flex items-start p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 transition-colors duration-200">
              <div class="flex h-6 shrink-0 items-center">
                <input 
                  id="agree-terms" 
                  v-model="form.agreeTerms" 
                  name="agree-terms" 
                  type="checkbox" 
                  required
                  class="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-600 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 transition-colors duration-200"
                >
              </div>
              <label for="agree-terms" class="ml-3 block text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">
                {{ $t('register.agreeTerms') }}
                <NuxtLink :to="localePath('/terms')" class="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors duration-200">
                  {{ $t('register.termsOfService') }}
                </NuxtLink>
                {{ $t('register.and') }}
                <NuxtLink :to="localePath('/privacy')" class="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors duration-200">
                  {{ $t('register.privacyPolicy') }}
                </NuxtLink>
              </label>
            </div>

            <!-- 现代化错误和成功提示 -->
            <Transition name="fade">
              <div v-if="error" class="rounded-2xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 p-4 transition-all duration-200">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <XCircleIcon class="h-5 w-5 text-red-500 dark:text-red-400" />
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-red-800 dark:text-red-200 transition-colors duration-200">
                      {{ error }}
                    </p>
                  </div>
                </div>
              </div>
            </Transition>

            <Transition name="fade">
              <div v-if="success" class="rounded-2xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800/50 p-4 transition-all duration-200">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <CheckCircleIcon class="h-5 w-5 text-green-500 dark:text-green-400" />
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-green-800 dark:text-green-200 transition-colors duration-200">
                      {{ success }}
                    </p>
                  </div>
                </div>
              </div>
            </Transition>

            <!-- 现代化提交按钮 -->
            <div class="space-y-4">
              <button 
                type="submit" 
                :disabled="pending || !isFormValid"
                class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-2xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
              >
                <span v-if="pending" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  {{ $t('common.loading') }}
                </span>
                <span v-else class="flex items-center">
                  <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  {{ $t('register.createAccount') }}
                </span>
              </button>
            </div>
          </form>

          <!-- 登录链接 -->
          <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <div class="text-center">
              <p class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                {{ $t('register.alreadyHaveAccount') }}
                <NuxtLink
                  :to="localePath('/auth/login')"
                  class="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors duration-200"
                >
                  {{ $t('register.signIn') }}
                </NuxtLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EyeIcon, EyeSlashIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import { useAuth } from '~/composables/useAuth'

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
  middleware: 'guest', // 添加 guest 中间件
  keepalive: false
})

// 使用认证 composable  
const { register, loading, error } = useAuth()

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
const success = ref('')
const errors = reactive({
  username: '',
  email: '',
  name: '',
  role: '',
  password: '',
  confirmPassword: ''
})

// 使用 loading 作为 pending 状态
const pending = computed(() => loading.value)

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
    success.value = ''

    // 表单验证
    if (!validateForm()) {
      return
    }

    if (!form.agreeTerms) {
      throw new Error(t('register.errors.termsRequired'))
    }

    // 调用注册 API
    const response = await register({
      username: form.username,
      email: form.email,
      name: form.name,
      role: form.role as 'student' | 'teacher',
      password: form.password,
      confirmPassword: form.confirmPassword
    })

    // 注册成功，显示消息
    success.value = t('register.success.accountCreated')
    
    console.log('Registration successful, response:', response)
    
    // 等待状态更新
    await nextTick()
    await nextTick()
    
    // 2秒后跳转到对应的面板
    setTimeout(() => {
      const redirectPath = getRoleRedirectPath(response.user.role)
      console.log('Redirecting to:', redirectPath)
      navigateTo(redirectPath, { replace: true })
    }, 2000)

  } catch (err: unknown) {
    // 错误已经在 useAuth 中处理了
    console.error('Register error:', err)
  }
}

// 获取角色重定向路径
const getRoleRedirectPath = (role: string) => {
  switch (role) {
    case 'monitor':
      return '/monitor/dashboard'
    case 'teacher':
      return '/teacher/dashboard'
    case 'student':
      return '/student/dashboard'
    default:
      return '/'
  }
}

// 清除错误信息当用户输入时
watch([() => form.username, () => form.email, () => form.name, () => form.role, () => form.password, () => form.confirmPassword], () => {
  if (success.value) {
    success.value = ''
  }
  // 清除对应字段的错误信息
  Object.keys(errors).forEach(key => {
    if (errors[key]) {
      errors[key] = ''
    }
  })
}, { deep: true })
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

/* 自定义选择框样式 */
select {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.dark select {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
}

/* 确保移动端有足够的触摸目标 */
@media (max-width: 640px) {
  .touch-manipulation {
    min-height: 44px;
  }
}
</style>
