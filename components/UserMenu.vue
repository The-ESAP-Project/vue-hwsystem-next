<template>
  <Menu as="div" class="relative ml-3">
    <div>
      <MenuButton class="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2">
        <span class="absolute -inset-1.5" />
        <span class="sr-only">{{ $t('common.openUserMenu') || '打开用户菜单' }}</span>
        <div class="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
          {{ userInitial }}
        </div>
      </MenuButton>
    </div>
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none transition-colors duration-200">
        <!-- 用户信息 -->
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <p class="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200">{{ user?.name }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">{{ getRoleText(user?.role) }}</p>
        </div>

        <!-- 菜单项 -->
        <MenuItem v-slot="{ active }">
          <NuxtLink
            :to="localePath('/profile')"
            :class="[active ? 'bg-gray-100 dark:bg-gray-700' : '', 'flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200']"
          >
            <UserIcon class="mr-3 h-4 w-4" />
            {{ $t('navbar.profile') }}
          </NuxtLink>
        </MenuItem>

        <MenuItem v-slot="{ active }">
          <NuxtLink
            :to="localePath('/settings')"
            :class="[active ? 'bg-gray-100 dark:bg-gray-700' : '', 'flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200']"
          >
            <CogIcon class="mr-3 h-4 w-4" />
            {{ $t('navbar.settings') }}
          </NuxtLink>
        </MenuItem>

        <MenuItem v-slot="{ active }">
          <NuxtLink
            :to="getDashboardPath()"
            :class="[active ? 'bg-gray-100 dark:bg-gray-700' : '', 'flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200']"
          >
            <HomeIcon class="mr-3 h-4 w-4" />
            {{ $t('navbar.dashboard') }}
          </NuxtLink>
        </MenuItem>

        <hr class="border-gray-200 dark:border-gray-700 transition-colors duration-200">

        <MenuItem v-slot="{ active }">
          <button
            @click="handleLogout"
            :class="[active ? 'bg-gray-100 dark:bg-gray-700' : '', 'flex w-full items-center px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 transition-colors duration-200']"
            :disabled="loading"
          >
            <ArrowRightOnRectangleIcon class="mr-3 h-4 w-4" />
            <span v-if="loading">{{ $t('common.loading') }}</span>
            <span v-else>{{ $t('common.logout') }}</span>
          </button>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { 
  UserIcon, 
  CogIcon, 
  HomeIcon, 
  ArrowRightOnRectangleIcon 
} from '@heroicons/vue/24/outline'

const { t } = useI18n()
const localePath = useLocalePath()

// 使用认证 composable
const { user, logout, loading, isAuthenticated } = useAuth()

// 如果用户未登录，不显示组件
if (!isAuthenticated.value || !user.value) {
  throw createError({
    statusCode: 401,
    statusMessage: 'Unauthorized'
  })
}

// 计算用户名首字母
const userInitial = computed(() => {
  return user.value?.name?.charAt(0)?.toUpperCase() || 'U'
})

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

// 处理退出登录
const handleLogout = async () => {
  try {
    await logout()
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>
