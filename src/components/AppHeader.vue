<template>
  <header class="relative z-50 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <div class="h-8 w-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span class="ml-2 text-lg sm:text-xl font-bold text-gray-900 dark:text-white transition-colors duration-200 truncate">
              作业管理系统
            </span>
          </router-link>
        </div>

        <!-- Desktop Controls -->
        <div class="hidden sm:flex items-center space-x-4">
          <!-- 主题切换按钮 -->
          <div class="relative theme-menu-container">
            <button
              @click="toggleThemeMenu"
              class="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
              :title="themeLabel"
            >
              <!-- 太阳图标 (浅色模式) -->
              <svg v-if="themeIcon === 'sun'" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <!-- 月亮图标 (深色模式) -->
              <svg v-else-if="themeIcon === 'moon'" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <!-- 系统图标 (跟随系统) -->
              <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>

            <!-- 主题选择下拉菜单 -->
            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div
                v-show="isThemeMenuOpen"
                class="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
              >
                <button
                  v-for="themeOption in themeOptions"
                  :key="themeOption.value"
                  @click="selectTheme(themeOption.value)"
                  class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  :class="{ 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400': theme === themeOption.value }"
                >
                  <component :is="themeOption.icon" class="h-4 w-4" />
                  {{ themeOption.label }}
                  <svg v-if="theme === themeOption.value" class="h-4 w-4 ml-auto text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </Transition>
          </div>

          <template v-if="isAuthenticated">
            <!-- 已登录：显示用户信息和退出按钮 -->
            <div class="flex items-center gap-3">
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ currentUser?.profile?.name || '用户' }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ roleText }}</p>
              </div>
              <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm', userAvatarColor]">
                {{ userAvatar }}
              </div>
              <button
                @click="handleLogout"
                class="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                退出
              </button>
            </div>
          </template>
          <template v-else>
            <!-- 未登录：显示登录按钮 -->
            <router-link
              to="/auth/login"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200"
            >
              登录
            </router-link>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <div class="sm:hidden">
          <button
            @click="toggleMobileMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-200"
            :aria-expanded="isMobileMenuOpen"
          >
            <svg v-if="!isMobileMenuOpen" class="block h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="block h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div
          v-show="isMobileMenuOpen"
          class="sm:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <div class="px-2 pt-2 pb-3 space-y-1">
            <template v-if="isAuthenticated">
              <!-- 移动端用户信息 -->
              <div class="flex items-center gap-3 px-3 py-3 border-b border-gray-200 dark:border-gray-700 mb-2">
                <div :class="['w-10 h-10 rounded-lg flex items-center justify-center text-white font-medium text-lg', userAvatarColor]">
                  {{ userAvatar }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ currentUser?.profile?.name || '用户' }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ roleText }}</p>
                </div>
              </div>

              <router-link
                :to="dashboardPath"
                @click="closeMobileMenu"
                class="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                控制台
              </router-link>

              <div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>

              <!-- 移动端主题切换 -->
              <div class="px-3 py-2">
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">主题设置</p>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="themeOption in themeOptions"
                    :key="themeOption.value"
                    @click="selectTheme(themeOption.value)"
                    class="flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-colors duration-200"
                    :class="theme === themeOption.value
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'"
                  >
                    <component :is="themeOption.icon" class="h-4 w-4" />
                    {{ themeOption.shortLabel }}
                  </button>
                </div>
              </div>

              <div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>

              <button
                @click="handleMobileLogout"
                class="flex items-center gap-3 w-full px-3 py-3 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-200"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                退出登录
              </button>
            </template>
            <template v-else>
              <!-- 未登录用户的移动端菜单 -->
              <router-link
                to="/auth/login"
                @click="closeMobileMenu"
                class="block px-3 py-3 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
              >
                登录
              </router-link>
            </template>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, h, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useDarkMode } from '@/composables/useDarkMode'

const router = useRouter()
const userStore = useUserStore()

// 主题管理
const { theme, themeIcon, themeLabel, setTheme } = useDarkMode()

// Mobile menu state
const isMobileMenuOpen = ref(false)
const isThemeMenuOpen = ref(false)

// 主题选项配置
const themeOptions = [
  {
    value: 'light' as const,
    label: '浅色模式',
    shortLabel: '浅色',
    icon: () => h('svg', {
      class: 'h-4 w-4',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
      })
    ])
  },
  {
    value: 'dark' as const,
    label: '深色模式',
    shortLabel: '深色',
    icon: () => h('svg', {
      class: 'h-4 w-4',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
      })
    ])
  },
  {
    value: 'system' as const,
    label: '跟随系统',
    shortLabel: '自动',
    icon: () => h('svg', {
      class: 'h-4 w-4',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
      })
    ])
  }
]

// 从 store 获取用户状态
const { currentUser, isAuthenticated, roleText, userAvatar, userAvatarColor, dashboardPath } = userStore

// Toggle mobile menu
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  // 关闭移动端菜单时也关闭主题菜单
  if (!isMobileMenuOpen.value) {
    isThemeMenuOpen.value = false
  }
}

// Toggle theme menu
const toggleThemeMenu = () => {
  isThemeMenuOpen.value = !isThemeMenuOpen.value
}

// Select theme
const selectTheme = (themeValue: 'light' | 'dark' | 'system') => {
  setTheme(themeValue)
  isThemeMenuOpen.value = false
}

// Close mobile menu
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  isThemeMenuOpen.value = false
}

// 处理退出登录
const handleLogout = async () => {
  try {
    await userStore.logout()
    router.push('/')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// 处理移动端退出登录
const handleMobileLogout = () => {
  closeMobileMenu()
  handleLogout()
}

// 点击外部区域关闭菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Element
  if (!target.closest('.theme-menu-container')) {
    isThemeMenuOpen.value = false
  }
}

// 监听路由变化来关闭移动端菜单
router.afterEach(() => {
  closeMobileMenu()
})

// 生命周期钩子
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
