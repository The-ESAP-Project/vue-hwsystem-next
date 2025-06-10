<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink :to="localePath('/')" class="flex items-center">
            <img 
              class="h-8 w-auto" 
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" 
              :alt="t('home.title')"
            >
            <span class="ml-2 text-lg sm:text-xl font-bold text-gray-900 dark:text-white transition-colors duration-200 truncate">
              {{ t('home.title') }}
            </span>
          </NuxtLink>
        </div>
        
        <!-- Desktop Controls - 根据登录状态显示不同内容 -->
        <div class="hidden sm:flex items-center space-x-4">
          <template v-if="isAuthenticated">
            <!-- 已登录：显示主题切换器、语言切换器和用户下拉菜单 -->
            <ThemeSwitcher />
            <LanguageSwitcher />
            <UserMenu />
          </template>
          <template v-else>
            <!-- 未登录：显示原有的控制区域 -->
            <ThemeSwitcher />
            <LanguageSwitcher />
            <NuxtLink 
              :to="localePath('/')" 
              class="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              {{ $t('common.backToHome') }}
            </NuxtLink>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <div class="sm:hidden">
          <button
            ref="mobileMenuButton"
            @click.stop="toggleMobileMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-200 touch-manipulation"
            :aria-expanded="isMobileMenuOpen"
            aria-label="Toggle menu"
          >
            <Bars3Icon v-if="!isMobileMenuOpen" class="block h-6 w-6" />
            <XMarkIcon v-else class="block h-6 w-6" />
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
          ref="mobileMenu"
          class="sm:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          @click.stop
        >
          <div class="px-2 pt-2 pb-3 space-y-1">
            <!-- 移动端用户信息（如果已登录） -->
            <template v-if="isAuthenticated && user">
              <div class="flex items-center gap-3 px-3 py-3 border-b border-gray-200 dark:border-gray-700 mb-2">
                <div class="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-lg">
                  {{ user.name.charAt(0).toUpperCase() }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ user.name }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ getRoleText(user.role) }}</p>
                </div>
              </div>
            </template>

            <!-- 主题切换 -->
            <div class="flex items-center justify-between px-3 py-3 touch-manipulation">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">主题</span>
              <ThemeSwitcher />
            </div>
            
            <!-- 语言切换 -->
            <div class="flex items-center justify-between px-3 py-3 touch-manipulation">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">语言</span>
              <LanguageSwitcher />
            </div>
            
            <!-- 导航链接 -->
            <template v-if="isAuthenticated">
              <!-- 已登录用户的移动端菜单 -->
              <NuxtLink 
                :to="localePath('/profile')" 
                @click="closeMobileMenu"
                class="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 rounded-md transition-colors duration-200 touch-manipulation"
              >
                <UserIcon class="h-5 w-5" />
                {{ $t('common.profile') || '个人资料' }}
              </NuxtLink>

              <NuxtLink 
                :to="localePath('/settings')" 
                @click="closeMobileMenu"
                class="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 rounded-md transition-colors duration-200 touch-manipulation"
              >
                <CogIcon class="h-5 w-5" />
                {{ $t('common.settings') || '设置' }}
              </NuxtLink>

              <NuxtLink 
                :to="getDashboardPath()" 
                @click="closeMobileMenu"
                class="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 rounded-md transition-colors duration-200 touch-manipulation"
              >
                <HomeIcon class="h-5 w-5" />
                {{ $t('common.dashboard') || '控制台' }}
              </NuxtLink>

              <div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>

              <button
                @click="handleMobileLogout"
                class="flex items-center gap-3 w-full px-3 py-3 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-200 touch-manipulation"
                :disabled="loading"
              >
                <ArrowRightOnRectangleIcon class="h-5 w-5" />
                <span v-if="loading">{{ $t('common.loading') || '加载中...' }}</span>
                <span v-else>{{ $t('common.logout') || '退出登录' }}</span>
              </button>
            </template>
            <template v-else>
              <!-- 未登录用户的移动端菜单 -->
              <NuxtLink 
                :to="localePath('/')" 
                @click="closeMobileMenu"
                class="block px-3 py-3 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 rounded-md transition-colors duration-200 touch-manipulation"
              >
                {{ $t('common.backToHome') }}
              </NuxtLink>
            </template>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup>
import { Bars3Icon, XMarkIcon, UserIcon, CogIcon, ArrowRightOnRectangleIcon, HomeIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

// 使用认证 composable
const { user, isAuthenticated, logout, loading } = useAuth()

// 只在客户端且开发环境下显示调试信息，避免 SSR 期间的误报
if (process.env.NODE_ENV === 'development' && import.meta.client) {
  // 延迟监听，确保认证初始化完成
  onMounted(() => {
    setTimeout(() => {
      watch(isAuthenticated, (newVal) => {
        console.log('AppHeader - isAuthenticated changed:', newVal, 'user:', user.value)
      })

      watch(user, (newVal) => {
        console.log('AppHeader - user changed:', newVal)
      })
    }, 100)
  })
}

// Mobile menu state and refs
const isMobileMenuOpen = ref(false)
const mobileMenuButton = ref(null)
const mobileMenu = ref(null)

// 获取角色文本
const getRoleText = (role) => {
  switch (role) {
    case 'monitor':
      return t('common.monitor') || '课代表'
    case 'teacher':
      return t('common.teacher') || '教师'
    case 'student':
      return t('common.student') || '学生'
    default:
      return ''
  }
}

// 获取用户对应的控制台路径
const getDashboardPath = () => {
  const role = user.value?.role
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

// Toggle mobile menu
const toggleMobileMenu = (event) => {
  event.stopPropagation()
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Close mobile menu
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// 处理移动端退出登录
const handleMobileLogout = async () => {
  closeMobileMenu()
  
  try {
    await logout()
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Handle click outside to close menu
const handleClickOutside = (event) => {
  if (!isMobileMenuOpen.value) return
  
  const button = mobileMenuButton.value
  const menu = mobileMenu.value
  
  // 检查点击是否在菜单按钮或菜单内容之外
  if (button && menu && 
      !button.contains(event.target) && 
      !menu.contains(event.target)) {
    closeMobileMenu()
  }
}

let clickOutsideHandler = null

onMounted(() => {
  // 使用setTimeout确保DOM完全渲染后再添加事件监听器
  setTimeout(() => {
    clickOutsideHandler = handleClickOutside
    document.addEventListener('click', clickOutsideHandler, true)
  }, 100)
  
  onUnmounted(() => {
    if (clickOutsideHandler) {
      document.removeEventListener('click', clickOutsideHandler, true)
    }
  })
})

// Close mobile menu on route change
watch(() => route.path, () => {
  closeMobileMenu()
})

// Handle escape key
const handleEscapeKey = (event) => {
  if (event.key === 'Escape' && isMobileMenuOpen.value) {
    closeMobileMenu()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscapeKey)
  })
})
</script>

<style scoped>
.touch-manipulation {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* 确保移动端有足够的触摸目标 */
@media (max-width: 640px) {
  .touch-manipulation {
    min-height: 44px;
  }
}
</style>
