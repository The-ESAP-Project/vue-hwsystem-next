<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200 flex flex-col">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200 sticky top-0 z-40">
      <nav class="mx-auto flex max-w-7xl items-center justify-between p-4 sm:p-6 lg:px-8" aria-label="Global">
        <div class="flex lg:flex-1">
          <NuxtLink :to="localePath('/')" class="-m-1.5 p-1.5">
            <span class="sr-only">{{ t('home.title') }}</span>
            <img class="h-7 sm:h-8 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" :alt="t('home.title')" >
          </NuxtLink>
        </div>
        
        <!-- 移动端菜单按钮 -->
        <div class="flex lg:hidden">
          <button 
            type="button" 
            class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300 transition-colors duration-200 touch-manipulation" 
            @click="mobileMenuOpen = true"
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon class="size-6" aria-hidden="true" />
          </button>
        </div>
        
        <!-- 桌面端导航 -->
        <PopoverGroup class="hidden lg:flex lg:gap-x-12">
          <Popover class="relative">
            <PopoverButton class="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 dark:text-white transition-colors duration-200">
              {{ $t('nav.product') }}
              <ChevronDownIcon class="size-5 flex-none text-gray-400 dark:text-gray-500" aria-hidden="true" />
            </PopoverButton>

            <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
              <PopoverPanel class="absolute top-full -left-8 z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700/50 transition-colors duration-200">
                <div class="p-4">
                  <div v-for="item in products" :key="item.name" class="group relative flex gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <div class="mt-1 flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600 transition-colors duration-200">
                      <component :is="item.icon" class="size-6 text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200" aria-hidden="true" />
                    </div>
                    <div class="flex-auto">
                      <a :href="item.href" class="block font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                        {{ $t(item.nameKey) }}
                        <span class="absolute inset-0" />
                      </a>
                      <p class="mt-1 text-gray-600 dark:text-gray-300 transition-colors duration-200">{{ $t(item.descKey) }}</p>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-2 divide-x divide-gray-900/5 dark:divide-gray-700/50 bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
                  <a v-for="item in callsToAction" :key="item.nameKey" :href="item.href" class="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                    <component :is="item.icon" class="size-5 flex-none text-gray-400 dark:text-gray-500" aria-hidden="true" />
                    {{ $t(item.nameKey) }}
                  </a>
                </div>
              </PopoverPanel>
            </transition>
          </Popover>

          <Popover class="relative">
            <PopoverButton class="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 dark:text-white transition-colors duration-200">
              {{ $t('nav.company') }}
              <ChevronDownIcon class="size-5 flex-none text-gray-400 dark:text-gray-500" aria-hidden="true" />
            </PopoverButton>

            <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
              <PopoverPanel class="absolute top-full -left-8 z-10 mt-3 w-56 rounded-xl bg-white dark:bg-gray-800 p-2 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700/50 transition-colors duration-200">
                <a v-for="item in company" :key="item.nameKey" :href="item.href" class="block rounded-lg px-3 py-2 text-sm/6 font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">{{ $t(item.nameKey) }}</a>
              </PopoverPanel>
            </transition>
          </Popover>
        </PopoverGroup>
        
        <!-- 桌面端控制区域 - 根据登录状态显示不同内容 -->
        <div class="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-4">
          <ThemeSwitcher />
          <LanguageSwitcher />
          <div class="w-px h-5 bg-gray-300 dark:bg-gray-600 transition-colors duration-200"/>
          
          <template v-if="isAuthenticated">
            <!-- 已登录：显示用户头像下拉菜单 -->
            <UserMenu />
          </template>
          <template v-else>
            <!-- 未登录：显示登录链接 -->
            <NuxtLink :to="localePath('/auth/login')" class="text-sm/6 font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
              {{ $t('common.login') }} <span aria-hidden="true">&rarr;</span>
            </NuxtLink>
          </template>
        </div>
      </nav>
      
      <!-- 移动端菜单 -->
      <Dialog class="lg:hidden" :open="mobileMenuOpen" @close="mobileMenuOpen = false">
        <div class="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" @click="mobileMenuOpen = false" />
        <DialogPanel class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-gray-800 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:ring-gray-700/50 transition-colors duration-200">
          <!-- 移动端菜单头部 -->
          <div class="flex items-center justify-between">
            <NuxtLink :to="localePath('/')" class="-m-1.5 p-1.5" @click="mobileMenuOpen = false">
              <span class="sr-only">{{ t('home.title') }}</span>
              <img class="h-8 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" :alt="t('home.title')" >
            </NuxtLink>
            <button 
              type="button" 
              class="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-300 transition-colors duration-200 touch-manipulation" 
              @click="mobileMenuOpen = false"
            >
              <span class="sr-only">{{ t('common.close') }}</span>
              <XMarkIcon class="size-6" aria-hidden="true" />
            </button>
          </div>
          
          <!-- 移动端菜单内容 -->
          <div class="mt-6 flow-root">
            <div class="-my-6 divide-y divide-gray-500/10 dark:divide-gray-700/50">
              <!-- 移动端用户信息（如果已登录） -->
              <template v-if="isAuthenticated && user">
                <div class="py-6 border-b border-gray-200 dark:border-gray-700">
                  <div class="flex items-center gap-3 px-3 py-3">
                    <div class="w-12 h-12 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-lg">
                      {{ user.name.charAt(0).toUpperCase() }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-base font-medium text-gray-900 dark:text-white truncate">{{ user.name }}</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ getRoleText(user.role) }}</p>
                    </div>
                  </div>
                </div>
              </template>

              <div class="space-y-2 py-6">
                <!-- 产品菜单 -->
                <Disclosure v-slot="{ open }" as="div" class="-mx-3">
                  <DisclosureButton class="flex w-full items-center justify-between rounded-lg py-3 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 touch-manipulation">
                    {{ $t('nav.product') }}
                    <ChevronDownIcon :class="[open ? 'rotate-180' : '', 'size-5 flex-none transition-transform duration-200']" aria-hidden="true" />
                  </DisclosureButton>
                  <DisclosurePanel class="mt-2 space-y-2">
                    <DisclosureButton 
                      v-for="item in [...products, ...callsToAction]" 
                      :key="item.nameKey" 
                      as="a" 
                      :href="item.href" 
                      class="block rounded-lg py-3 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 touch-manipulation"
                    >
                      {{ $t(item.nameKey) }}
                    </DisclosureButton>
                  </DisclosurePanel>
                </Disclosure>

                <!-- 公司菜单 -->
                <Disclosure v-slot="{ open }" as="div" class="-mx-3">
                  <DisclosureButton class="flex w-full items-center justify-between rounded-lg py-3 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 touch-manipulation">
                    {{ $t('nav.company') }}
                    <ChevronDownIcon :class="[open ? 'rotate-180' : '', 'size-5 flex-none transition-transform duration-200']" aria-hidden="true" />
                  </DisclosureButton>
                  <DisclosurePanel class="mt-2 space-y-2">
                    <DisclosureButton 
                      v-for="item in company" 
                      :key="item.nameKey" 
                      as="a" 
                      :href="item.href" 
                      class="block rounded-lg py-3 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 touch-manipulation"
                    >
                      {{ $t(item.nameKey) }}
                    </DisclosureButton>
                  </DisclosurePanel>
                </Disclosure>

                <!-- 移动端主题切换器 -->
                <div class="-mx-3 px-3 py-4 border-t border-gray-200 dark:border-gray-700 mt-6 pt-6 transition-colors duration-200">
                  <div class="flex items-center justify-between mb-4">
                    <span class="text-base font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                      {{ $t('theme.switchTheme') || '主题设置' }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
                    <div class="flex items-center gap-3">
                      <div class="p-2 rounded-lg bg-gray-100 dark:bg-gray-600">
                        <SunIcon v-if="isDark" class="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        <MoonIcon v-else class="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <span class="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200">
                        {{ isDark ? ($t('theme.darkMode') || '深色模式') : ($t('theme.lightMode') || '浅色模式') }}
                      </span>
                    </div>
                    <button
                      @click="toggleTheme"
                      class="flex items-center justify-center w-12 h-6 rounded-full transition-colors duration-200 touch-manipulation"
                      :class="isDark ? 'bg-indigo-600' : 'bg-gray-300'"
                    >
                      <div 
                        class="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200"
                        :class="isDark ? 'translate-x-3' : '-translate-x-3'"
                      ></div>
                    </button>
                  </div>
                </div>

                <!-- 移动端语言切换器 -->
                <div class="-mx-3 px-3 py-4 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
                  <div class="flex items-center justify-between mb-4">
                    <span class="text-base font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                      {{ $t('language.switchLanguage') || '语言设置' }}
                    </span>
                  </div>
                  <div class="space-y-2">
                    <button 
                      v-for="localeOption in availableLocales" 
                      :key="localeOption.code"
                      class="flex w-full items-center rounded-lg px-3 py-3 text-sm font-semibold transition-colors duration-200 touch-manipulation"
                      :class="localeOption.code === currentLocale 
                        ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700' 
                        : 'text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'"
                      @click="switchLocale(localeOption.code)"
                    >
                      <span class="mr-3 text-xl">{{ localeOption.flag }}</span>
                      <span class="flex-1 text-left">{{ localeOption.name }}</span>
                      <div v-if="localeOption.code === currentLocale" class="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    </button>
                  </div>
                </div>

                <!-- 移动端用户菜单（如果已登录） -->
                <template v-if="isAuthenticated">
                  <div class="-mx-3 px-3 py-4 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
                    <div class="space-y-2">
                      <NuxtLink 
                        :to="localePath('/profile')" 
                        @click="mobileMenuOpen = false"
                        class="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 touch-manipulation"
                      >
                        <UserIcon class="h-5 w-5" />
                        {{ $t('common.profile') || '个人资料' }}
                      </NuxtLink>

                      <NuxtLink 
                        :to="localePath('/settings')" 
                        @click="mobileMenuOpen = false"
                        class="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 touch-manipulation"
                      >
                        <CogIcon class="h-5 w-5" />
                        {{ $t('common.settings') || '设置' }}
                      </NuxtLink>

                      <NuxtLink 
                        :to="getDashboardPath()" 
                        @click="mobileMenuOpen = false"
                        class="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 touch-manipulation"
                      >
                        <HomeIcon class="h-5 w-5" />
                        {{ $t('common.dashboard') || '控制台' }}
                      </NuxtLink>

                      <button
                        @click="handleMobileLogout"
                        class="flex items-center gap-3 w-full rounded-lg px-3 py-3 text-base font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 touch-manipulation"
                        :disabled="authLoading"
                      >
                        <ArrowRightOnRectangleIcon class="h-5 w-5" />
                        <span v-if="authLoading">{{ $t('common.loading') || '退出中...' }}</span>
                        <span v-else>{{ $t('common.logout') || '退出登录' }}</span>
                      </button>
                    </div>
                  </div>
                </template>
              </div>
              
              <!-- 登录按钮（如果未登录） -->
              <template v-if="!isAuthenticated">
                <div class="py-6">
                  <NuxtLink 
                    :to="localePath('/auth/login')" 
                    class="flex items-center justify-center w-full rounded-lg bg-indigo-600 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200 touch-manipulation" 
                    @click="mobileMenuOpen = false"
                  >
                    {{ $t('common.login') }}
                  </NuxtLink>
                </div>
              </template>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
    
    <!-- Main Content - 移动端优化 -->
    <main class="flex-1 overflow-auto">
      <div class="min-h-full flex flex-col">
        <div class="flex-1">
          <NuxtPage />
        </div>
        
        <!-- Footer - 移动端优化 -->
        <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <!-- 移动端链接网格布局 -->
              <div class="order-2 md:order-2">
                <div class="grid grid-cols-2 sm:flex sm:justify-center gap-4 sm:gap-6 text-center">
                  <NuxtLink :to="localePath('/about')" class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 text-sm transition-colors duration-200 py-2 sm:py-0 touch-manipulation">
                    {{ $t('footer.about') }}
                  </NuxtLink>
                  <NuxtLink :to="localePath('/contact')" class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 text-sm transition-colors duration-200 py-2 sm:py-0 touch-manipulation">
                    {{ $t('footer.contact') }}
                  </NuxtLink>
                  <NuxtLink :to="localePath('/privacy')" class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 text-sm transition-colors duration-200 py-2 sm:py-0 touch-manipulation">
                    {{ $t('footer.privacy') }}
                  </NuxtLink>
                  <NuxtLink :to="localePath('/terms')" class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 text-sm transition-colors duration-200 py-2 sm:py-0 touch-manipulation">
                    {{ $t('footer.terms') }}
                  </NuxtLink>
                </div>
              </div>
              <div class="order-1 md:order-1">
                <p class="text-center text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200 leading-relaxed">
                  {{ $t('footer.copyright', { year: currentYear, company: $t('home.title') }) }}
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  </div>
</template>

<script setup>
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/vue'
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  UserIcon,
  CogIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/vue/20/solid'

const { t, locale, setLocale } = useI18n()
const localePath = useLocalePath()

// 使用认证 composable
const { user, isAuthenticated, logout, loading: authLoading } = useAuth()

const products = [
  { nameKey: 'product.analytics', descKey: 'product.analyticsDesc', href: '#', icon: ChartPieIcon },
  { nameKey: 'product.engagement', descKey: 'product.engagementDesc', href: '#', icon: CursorArrowRaysIcon },
  { nameKey: 'product.security', descKey: 'product.securityDesc', href: '#', icon: FingerPrintIcon },
  { nameKey: 'product.integrations', descKey: 'product.integrationsDesc', href: '#', icon: SquaresPlusIcon },
  { nameKey: 'product.automations', descKey: 'product.automationsDesc', href: '#', icon: ArrowPathIcon },
]

const callsToAction = [
  { nameKey: 'product.watchDemo', href: '#', icon: PlayCircleIcon },
  { nameKey: 'product.contactSales', href: '#', icon: PhoneIcon },
]

const company = [
  { nameKey: 'nav.about', href: '#' },
  { nameKey: 'nav.careers', href: '#' },
  { nameKey: 'nav.support', href: '#' },
  { nameKey: 'nav.press', href: '#' },
  { nameKey: 'nav.blog', href: '#' },
]

const currentLocale = computed(() => locale.value)
const currentYear = computed(() => new Date().getFullYear())

const availableLocales = computed(() => [
  { code: 'zh', name: t('language.chinese'), flag: '🇨🇳' },
  { code: 'en', name: t('language.english'), flag: '🇺🇸' },
  { code: 'ja', name: t('language.japanese'), flag: '🇯🇵' },
])

const switchLocale = async (code) => {
  await setLocale(code)
  if (import.meta.client) {
    localStorage.setItem('i18n_locale', code)
  }
  mobileMenuOpen.value = false
}

const mobileMenuOpen = ref(false)

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

// 处理移动端退出登录
const handleMobileLogout = async () => {
  mobileMenuOpen.value = false
  
  try {
    await logout()
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// 主题管理
const { isDark, toggleTheme, initTheme } = useTheme()

// 初始化主题
onMounted(() => {
  initTheme()
})
</script>

<style scoped>
/* 触摸优化 */
.touch-manipulation {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: none;
  user-select: none;
}

/* 移动端视口优化 */
@media (max-width: 768px) {
  .min-h-screen {
    min-height: 100vh;
    min-height: -webkit-fill-available;
  }
}

/* 安全区域支持 */
@supports (padding: max(0px)) {
  .min-h-screen {
    padding-left: max(0px, env(safe-area-inset-left));
    padding-right: max(0px, env(safe-area-inset-right));
  }
  
  header {
    padding-left: max(0px, env(safe-area-inset-left));
    padding-right: max(0px, env(safe-area-inset-right));
  }
}

/* 移动端菜单优化 */
@media (max-width: 640px) {
  .sm\:max-w-sm {
    max-width: 100%;
  }
}

/* 移动端开关按钮动画 */
.touch-manipulation:active {
  transform: scale(0.98);
}

/* 滚动条优化 */
@media (max-width: 768px) {
  .overflow-y-auto::-webkit-scrollbar {
    width: 4px;
  }
  
  .overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.5);
    border-radius: 2px;
  }
  
  .dark .overflow-y-auto::-webkit-scrollbar-thumb {
    background: rgba(75, 85, 99, 0.5);
  }
}

/* 确保菜单覆盖层不影响滚动 */
.fixed.inset-0 {
  touch-action: none;
}
</style>

