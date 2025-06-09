<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="w-full sm:max-w-[480px] p-6">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <img class="mx-auto h-10 w-auto" src="@/public/favicon.ico" alt="Login" />
        <h2 class="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">{{ $t('login.title') }}</h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full">
        <div class="bg-white px-6 py-12 shadow-md rounded-lg sm:px-12">
          <form class="space-y-6" @submit.prevent="handleLogin">
            <div>
              <label for="username" class="block text-sm/6 font-medium text-gray-900">{{ $t('common.username') }}</label>
              <div class="mt-2">
                <input 
                  v-model="username" 
                  type="text" 
                  name="username" 
                  id="username" 
                  :placeholder="$t('login.usernamePlaceholder')"
                  autocomplete="username" 
                  required 
                  class="border border-solid border-zinc-200 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" 
                  :class="{ 'border-red-500': loginError }"
                />
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm/6 font-medium text-gray-900">{{ $t('common.password') }}</label>
              <div class="mt-2">
                <input 
                  v-model="password" 
                  type="password" 
                  name="password" 
                  id="password" 
                  :placeholder="$t('login.passwordPlaceholder')"
                  autocomplete="current-password" 
                  required 
                  class="border border-solid border-zinc-200 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  :class="{ 'border-red-500': loginError }"
                />
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="loginError" class="text-red-500 text-sm">
              {{ $t('login.loginFailed') }}
            </div>

            <div class="flex items-center justify-between">
              <div class="flex gap-3">
                <div class="flex h-6 shrink-0 items-center">
                  <div class="group grid size-4 grid-cols-1">
                    <input v-model="rememberMe" id="remember-me" name="remember-me" type="checkbox" class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"/>
                    <svg class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white" viewBox="0 0 14 14" fill="none">
                      <path class="opacity-0 group-has-checked:opacity-100" d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                </div>
                <label for="remember-me" class="block text-sm/6 text-gray-900">{{ $t('login.rememberMe') }}</label>
              </div>
              
              <!-- Language Switcher -->
              <div class="flex items-center space-x-2">
                <button 
                  v-for="locale in availableLocales" 
                  :key="locale.code"
                  @click.prevent="switchLocale(locale.code as 'zh' | 'en' | 'ja')"
                  class="text-sm text-gray-500 hover:text-gray-700"
                  :class="{ 'font-bold': currentLocale === locale.code }"
                >
                  {{ locale.name }}
                </button>
              </div>
            </div>

            <div class="space-y-4">
              <button 
                type="submit" 
                class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                :disabled="isLoading"
              >
                <span v-if="isLoading">{{ $t('common.loading') }}</span>
                <span v-else>{{ $t('login.loginWithAccount') }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const loginError = ref(false)
const isLoading = ref(false)

// Mock user data
const mockUsers = [
  { username: 'admin', password: 'admin', role: 'admin' },
  { username: 'teacher', password: '123456', role: 'teacher' },
  { username: 'student', password: '123456', role: 'student' }
]

// Available locales
const availableLocales = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'EN' },
  { code: 'ja', name: '日本語' }
]

const currentLocale = computed(() => locale.value)

const switchLocale = (code: 'zh' | 'en' | 'ja') => {
  locale.value = code
  localStorage.setItem('i18n_locale', code)
}

const handleLogin = async () => {
  try {
    loginError.value = false
    isLoading.value = true

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const user = mockUsers.find(
      u => u.username === username.value && u.password === password.value
    )

    if (user) {
      const token = `mock-token-${Date.now()}`
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      if (rememberMe.value) {
        localStorage.setItem('rememberedUser', username.value)
      }

      navigateTo('/')
    } else {
      loginError.value = true
    }
  } catch (error) {
    console.error('Login error:', error)
    loginError.value = true
  } finally {
    isLoading.value = false
  }
}
import { useRouter } from 'vue-router'
const router = useRouter()

function navigateTo(path: string) {
  router.push(path)
}
</script>