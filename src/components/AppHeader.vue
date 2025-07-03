<template>
  <header class="relative z-50 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <div
              class="h-8 w-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center"
            >
              <DocumentIcon class="h-5 w-5 text-white" />
            </div>
            <span
              class="ml-2 text-lg sm:text-xl font-bold text-gray-900 dark:text-white transition-colors duration-200 truncate"
            >
              {{ t('app.name') }}
            </span>
          </router-link>
        </div>

        <!-- Desktop Controls -->
        <div class="hidden sm:flex items-center space-x-4">
          <!-- 语言切换 -->
          <div class="relative language-menu-container">
            <button
              @click="toggleLanguageMenu"
              class="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
              :title="t('header.language')"
            >
              <LanguageIcon class="h-5 w-5" />
            </button>

            <!-- 语言选择下拉菜单 -->
            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div
                v-show="isLanguageMenuOpen"
                class="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
              >
                <button
                  v-for="lang in availableLocales"
                  :key="lang.code"
                  @click="selectLanguage(lang.code)"
                  class="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  :class="{
                    'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400':
                      locale === lang.code,
                  }"
                >
                  {{ lang.name }}
                  <CheckIcon
                    v-if="locale === lang.code"
                    class="h-4 w-4 text-indigo-600 dark:text-indigo-400"
                  />
                </button>
              </div>
            </Transition>
          </div>

          <!-- 主题切换按钮 -->
          <div class="relative theme-menu-container">
            <button
              @click="toggleThemeMenu"
              class="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
              :title="themeLabel"
            >
              <!-- 太阳图标 (浅色模式) -->
              <SunIcon v-if="themeIcon === 'sun'" class="h-5 w-5" />
              <!-- 月亮图标 (深色模式) -->
              <MoonIcon v-else-if="themeIcon === 'moon'" class="h-5 w-5" />
              <!-- 系统图标 (跟随系统) -->
              <ComputerDesktopIcon v-else class="h-5 w-5" />
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
                  :class="{
                    'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400':
                      theme === themeOption.value,
                  }"
                >
                  <component :is="themeOption.icon" class="h-4 w-4" />
                  {{ t(`header.theme.${themeOption.key}`) }}
                  <CheckIcon
                    v-if="theme === themeOption.value"
                    class="h-4 w-4 ml-auto text-indigo-600 dark:text-indigo-400"
                  />
                </button>
              </div>
            </Transition>
          </div>

          <template v-if="isAuthenticated">
            <!-- 已登录：显示用户信息和退出按钮 -->
            <div class="flex items-center gap-3">
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ currentUser?.profile?.name || '用户' }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ roleText }}</p>
              </div>
              <div
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm',
                  userAvatarColor,
                ]"
              >
                {{ userAvatar }}
              </div>
              <button
                @click="handleLogout"
                class="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                {{ t('header.logout') }}
              </button>
            </div>
          </template>
          <template v-else>
            <!-- 未登录：显示登录按钮 -->
            <router-link
              to="/auth/login"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200"
            >
              {{ t('header.login') }}
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
          class="sm:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <div class="px-2 pt-2 pb-3 space-y-1">
            <template v-if="isAuthenticated">
              <!-- 移动端用户信息 -->
              <div
                class="flex items-center gap-3 px-3 py-3 border-b border-gray-200 dark:border-gray-700 mb-2"
              >
                <div
                  :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center text-white font-medium text-lg',
                    userAvatarColor,
                  ]"
                >
                  {{ userAvatar }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ currentUser?.profile?.name || '用户' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ roleText }}</p>
                </div>
              </div>

              <router-link
                :to="dashboardPath"
                @click="closeMobileMenu"
                class="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
              >
                <HomeIcon class="h-5 w-5" />
                {{ t('header.dashboard') }}
              </router-link>
            </template>
            <template v-else>
              <!-- 未登录用户的移动端菜单 -->
              <router-link
                to="/auth/login"
                @click="closeMobileMenu"
                class="block px-3 py-3 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
              >
                {{ t('header.login') }}
              </router-link>
            </template>

            <div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>

            <!-- 移动端语言和主题切换 - 公共部分 -->
            <div class="px-3 py-2 space-y-4">
              <!-- 语言切换 -->
              <div>
                <p
                  class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2"
                >
                  {{ t('header.language') }}
                </p>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="lang in availableLocales"
                    :key="lang.code"
                    @click="selectLanguageMobile(lang.code)"
                    class="flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors duration-200"
                    :class="
                      locale === lang.code
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    "
                  >
                    {{ lang.shortName }}
                  </button>
                </div>
              </div>

              <!-- 主题切换 -->
              <div>
                <p
                  class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2"
                >
                  {{ t('header.theme.settings') }}
                </p>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="themeOption in themeOptions"
                    :key="themeOption.value"
                    @click="selectThemeMobile(themeOption.value)"
                    class="flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-colors duration-200"
                    :class="
                      theme === themeOption.value
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    "
                  >
                    <component :is="themeOption.icon" class="h-4 w-4" />
                    {{ t(`header.theme.${themeOption.key}Short`) }}
                  </button>
                </div>
              </div>
            </div>

            <!-- 退出登录按钮 - 仅已登录用户显示 -->
            <template v-if="isAuthenticated">
              <div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              <button
                @click="handleMobileLogout"
                class="flex items-center gap-3 w-full px-3 py-3 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-200"
              >
                <ArrowRightStartOnRectangleIcon class="h-5 w-5" />
                {{ t('header.logoutMobile') }}
              </button>
            </template>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useDarkMode } from '@/composables/useDarkMode'
import { useLanguage } from '@/composables/useLanguage'
import {
  DocumentIcon,
  LanguageIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ArrowRightStartOnRectangleIcon,
  CheckIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const userStore = useUserStore()

// 主题管理
const { theme, themeIcon, themeLabel, setTheme } = useDarkMode()

// 语言管理
const { locale, availableLocales, setLocale, t } = useLanguage()

// Mobile menu state
const isMobileMenuOpen = ref(false)
const isThemeMenuOpen = ref(false)
const isLanguageMenuOpen = ref(false)

// 主题选项配置
const themeOptions = [
  {
    value: 'light' as const,
    key: 'light',
    icon: SunIcon,
  },
  {
    value: 'dark' as const,
    key: 'dark',
    icon: MoonIcon,
  },
  {
    value: 'system' as const,
    key: 'system',
    icon: ComputerDesktopIcon,
  },
]

// 从 store 获取用户状态
const { currentUser, isAuthenticated, roleText, userAvatar, userAvatarColor, dashboardPath } =
  userStore

// Toggle mobile menu
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  // 关闭移动端菜单时也关闭其他菜单
  if (!isMobileMenuOpen.value) {
    isThemeMenuOpen.value = false
    isLanguageMenuOpen.value = false
  }
}

// Toggle theme menu
const toggleThemeMenu = () => {
  isThemeMenuOpen.value = !isThemeMenuOpen.value
}

// Toggle language menu
const toggleLanguageMenu = () => {
  isLanguageMenuOpen.value = !isLanguageMenuOpen.value
}

// Select theme
const selectTheme = (themeValue: 'light' | 'dark' | 'system') => {
  setTheme(themeValue)
  isThemeMenuOpen.value = false
}

// Select language
const selectLanguage = (langCode: string) => {
  setLocale(langCode)
  isLanguageMenuOpen.value = false
}

// Mobile specific functions - don't close mobile menu
const selectThemeMobile = (themeValue: 'light' | 'dark' | 'system') => {
  setTheme(themeValue)
}

const selectLanguageMobile = (langCode: string) => {
  setLocale(langCode)
}

// Close mobile menu
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  isThemeMenuOpen.value = false
  isLanguageMenuOpen.value = false
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
  if (!target.closest('.language-menu-container')) {
    isLanguageMenuOpen.value = false
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
