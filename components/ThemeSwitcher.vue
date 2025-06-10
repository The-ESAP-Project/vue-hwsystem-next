<template>
  <button
    @click="toggleTheme"
    class="flex items-center justify-center p-3 sm:p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 touch-manipulation"
    :title="isDark ? $t('theme.switchToLight') : $t('theme.switchToDark')"
  >
    <SunIcon v-if="isDark" class="h-6 w-6 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-300" />
    <MoonIcon v-else class="h-6 w-6 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-300" />
  </button>
</template>

<script setup lang="ts">
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'

const { isDark, toggleTheme, initTheme } = useTheme()

// 初始化主题
onMounted(() => {
  initTheme()
})
</script>
