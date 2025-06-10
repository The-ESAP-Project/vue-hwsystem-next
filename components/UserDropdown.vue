<template>
  <div class="relative" v-if="isAuthenticated">
    <!-- 用户头像按钮 -->
    <button
      @click="isOpen = !isOpen"
      @blur="handleBlur"
      class="flex items-center gap-2 p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
    >
      <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
        {{ user?.name.charAt(0).toUpperCase() }}
      </div>
      <span class="hidden sm:block text-sm font-medium">{{ user?.name }}</span>
      <ChevronDownIcon class="h-4 w-4" :class="{ 'rotate-180': isOpen }" />
    </button>

    <!-- 下拉菜单 -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200/50 dark:border-gray-700/50 py-2 z-50"
      >
        <!-- 用户信息 -->
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium">
              {{ user?.name.charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ user?.name }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ getRoleText(user?.role) }}</p>
            </div>
          </div>
        </div>

        <!-- 菜单项 -->
        <div class="py-1">
          <NuxtLink
            :to="localePath('/profile')"
            class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            @click="isOpen = false"
          >
            <UserIcon class="h-4 w-4" />
            {{ $t('common.profile') || '个人资料' }}
          </NuxtLink>

          <NuxtLink
            :to="localePath('/settings')"
            class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            @click="isOpen = false"
          >
            <CogIcon class="h-4 w-4" />
            {{ $t('common.settings') || '设置' }}
          </NuxtLink>

          <div class="my-1 border-t border-gray-200 dark:border-gray-700"></div>

          <button
            @click="handleLogout"
            class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
            :disabled="loading"
          >
            <ArrowRightOnRectangleIcon class="h-4 w-4" />
            <span v-if="loading">{{ $t('common.loading') || '加载中...' }}</span>
            <span v-else>{{ $t('common.logout') || '退出登录' }}</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { 
  ChevronDownIcon, 
  UserIcon, 
  CogIcon, 
  ArrowRightOnRectangleIcon 
} from '@heroicons/vue/24/outline'
import { useAuth } from '~/composables/useAuth'

const { t } = useI18n()
const localePath = useLocalePath()

// 使用认证 composable
const { user, isAuthenticated, logout, loading } = useAuth()

// 下拉菜单状态
const isOpen = ref(false)

// 获取角色文本
const getRoleText = (role?: string) => {
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

// 处理失去焦点
const handleBlur = (event: FocusEvent) => {
  // 延迟关闭，以便点击菜单项
  setTimeout(() => {
    if (!event.relatedTarget || !event.currentTarget?.contains(event.relatedTarget as Node)) {
      isOpen.value = false
    }
  }, 150)
}

// 处理退出登录
const handleLogout = async () => {
  isOpen.value = false
  
  try {
    await logout()
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// 点击外部关闭
onClickOutside(template, () => {
  isOpen.value = false
})
</script>
