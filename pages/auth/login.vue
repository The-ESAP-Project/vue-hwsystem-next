<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">
          {{ $t('login.title') }}
        </h1>
        <p class="mt-2 text-sm text-gray-600">
          {{ $t('login.subtitle', { 
            student: $t('common.student'),
            teacher: $t('common.teacher'),
            monitor: $t('common.monitor')
          }) }}
        </p>
      </div>

      <div class="bg-white py-8 px-6 shadow-sm rounded-lg">
        <!-- 登录表单 -->
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="username" class="block text-sm/6 font-medium text-gray-900">
              {{ $t('common.username') }}
            </label>
            <div class="mt-2">
              <input 
                id="username"
                v-model="form.username" 
                type="text" 
                name="username" 
                :placeholder="$t('login.usernamePlaceholder')"
                autocomplete="username" 
                required 
                :disabled="pending"
                class="border border-solid border-zinc-200 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled:opacity-50 disabled:cursor-not-allowed" 
                :class="{ 'border-red-500 focus:outline-red-500': error }"
              >
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm/6 font-medium text-gray-900">
              {{ $t('common.password') }}
            </label>
            <div class="mt-2 relative">
              <input 
                id="password"
                v-model="form.password" 
                :type="showPassword ? 'text' : 'password'" 
                name="password" 
                :placeholder="$t('login.passwordPlaceholder')"
                autocomplete="current-password" 
                required 
                :disabled="pending"
                class="border border-solid border-zinc-200 block w-full rounded-md bg-white px-3 py-1.5 pr-10 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled:opacity-50 disabled:cursor-not-allowed"
                :class="{ 'border-red-500 focus:outline-red-500': error }"
              >
              <button
                type="button"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                @click="showPassword = !showPassword"
              >
                <EyeIcon v-if="!showPassword" class="h-5 w-5" />
                <EyeSlashIcon v-else class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- 错误信息 -->
          <Transition name="fade">
            <div v-if="error" class="rounded-md bg-red-50 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <XCircleIcon class="h-5 w-5 text-red-400" />
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-800">
                    {{ error }}
                  </p>
                </div>
              </div>
            </div>
          </Transition>

          <!-- 记住我选项 -->
          <div class="flex items-center justify-between">
            <div class="flex gap-3">
              <div class="flex h-6 shrink-0 items-center">
                <div class="group grid size-4 grid-cols-1">
                  <input 
                    id="remember-me" 
                    v-model="form.rememberMe" 
                    name="remember-me" 
                    type="checkbox" 
                    class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                  <svg class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white" viewBox="0 0 14 14" fill="none">
                    <path class="opacity-0 group-has-checked:opacity-100" d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
              </div>
              <label for="remember-me" class="block text-sm/6 text-gray-900">
                {{ $t('login.rememberMe') }}
              </label>
            </div>
            
            <NuxtLink 
              to="/forgot-password" 
              class="text-sm text-indigo-600 hover:text-indigo-500"
            >
              {{ $t('login.forgotPassword') }}
            </NuxtLink>
          </div>

          <!-- 提交按钮 -->
          <div class="space-y-4">
            <button 
              type="submit" 
              :disabled="pending || !form.username || !form.password"
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="pending" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                {{ $t('common.loading') }}
              </span>
              <span v-else>{{ $t('login.loginWithAccount') }}</span>
            </button>
          </div>
        </form>

        <!-- 演示账号提示 -->
        <div class="mt-6 border-t border-gray-200 pt-6">
          <p class="text-center text-sm text-gray-600 mb-3">
            {{ $t('login.demoAccounts') }}
          </p>
          <div class="grid grid-cols-1 gap-2 sm:grid-cols-3 text-xs">
            <div class="bg-gray-50 p-2 rounded text-center">
              <div class="font-medium">{{ $t('common.student') }}</div>
              <div class="text-gray-500">student / 123456</div>
            </div>
            <div class="bg-gray-50 p-2 rounded text-center">
              <div class="font-medium">{{ $t('common.teacher') }}</div>
              <div class="text-gray-500">teacher / 123456</div>
            </div>
            <div class="bg-gray-50 p-2 rounded text-center">
              <div class="font-medium">{{ $t('common.admin') }}</div>
              <div class="text-gray-500">admin / admin</div>
            </div>
          </div>
        </div>

        <!-- 注册链接 -->
        <div class="mt-6 border-t border-gray-200 pt-6 text-center">
          <p class="text-sm text-gray-600">
            {{ $t('login.noAccount') }}
            <NuxtLink 
              to="/auth/register" 
              class="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              {{ $t('login.signUp') }}
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EyeIcon, EyeSlashIcon, XCircleIcon } from '@heroicons/vue/24/outline'

// i18n
const { t } = useI18n()

// 页面元信息 - 修复标题翻译问题
useHead({
  title: t('login.title'),
  titleTemplate: '%s | ' + t('home.title'),
  meta: [
    { name: 'description', content: t('login.metaDescription') },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: t('login.title') + ' | ' + t('home.title') },
    { property: 'og:description', content: t('login.metaDescription') },
  ]
})

// 页面配置
definePageMeta({
  layout: 'auth',
  auth: false,
  keepalive: false
})

// 响应式数据
const form = reactive({
  username: '',
  password: '',
  rememberMe: false
})

const showPassword = ref(false)
const pending = ref(false)
const error = ref('')

// Mock 用户数据
const mockUsers = [
  { username: 'admin', password: 'admin', role: 'admin', name: '系统管理员' },
  { username: 'teacher', password: '123456', role: 'teacher', name: '张老师' },
  { username: 'student', password: '123456', role: 'student', name: '小明同学' }
]

// 登录处理
const handleLogin = async () => {
  try {
    error.value = ''
    pending.value = true

    // 表单验证
    if (!form.username.trim()) {
      throw new Error(t('login.errors.usernameRequired'))
    }
    if (!form.password.trim()) {
      throw new Error(t('login.errors.passwordRequired'))
    }

    // 模拟 API 延迟
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 用户验证
    const user = mockUsers.find(
      u => u.username === form.username && u.password === form.password
    )

    if (!user) {
      throw new Error(t('login.errors.invalidCredentials'))
    }

    // 存储用户信息
    const token = `mock-token-${Date.now()}`
    const userData = { ...user, token }
    
    if (import.meta.client) {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      
      if (form.rememberMe) {
        localStorage.setItem('rememberedUser', form.username)
      }
    }

    // 根据角色跳转
    const redirectPath = getRoleRedirectPath(user.role)
    await navigateTo(redirectPath)

  } catch (err: any) {
    error.value = err.message || t('login.errors.loginFailed')
  } finally {
    pending.value = false
  }
}

// 根据角色获取重定向路径
const getRoleRedirectPath = (role: string) => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard'
    case 'teacher':
      return '/teacher/dashboard'
    case 'student':
      return '/student/dashboard'
    default:
      return '/'
  }
}

// 自动填充记住的用户名
onMounted(() => {
  if (import.meta.client) {
    const rememberedUser = localStorage.getItem('rememberedUser')
    if (rememberedUser) {
      form.username = rememberedUser
      form.rememberMe = true
    }
  }
})

// 清除错误信息当用户输入时
watch([() => form.username, () => form.password], () => {
  if (error.value) {
    error.value = ''
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