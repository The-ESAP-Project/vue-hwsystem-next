<template>
  <Popover class="relative">
    <PopoverButton class="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 dark:text-white transition-colors duration-200 p-2 sm:p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 touch-manipulation">
      <span class="hidden sm:inline">{{ currentLocaleName }}</span>
      <span class="sm:hidden text-lg">{{ currentLocaleFlag }}</span>
      <ChevronDownIcon class="size-4 sm:size-5 flex-none text-gray-400 dark:text-gray-500" aria-hidden="true" />
    </PopoverButton>

    <transition 
      enter-active-class="transition ease-out duration-200" 
      enter-from-class="opacity-0 translate-y-1 scale-95" 
      enter-to-class="opacity-100 translate-y-0 scale-100" 
      leave-active-class="transition ease-in duration-150" 
      leave-from-class="opacity-100 translate-y-0 scale-100" 
      leave-to-class="opacity-0 translate-y-1 scale-95"
    >
      <PopoverPanel 
        :class="[
          'absolute z-10 mt-3 rounded-xl bg-white dark:bg-gray-800 p-2 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700/50 transition-colors duration-200',
          isMobile 
            ? 'right-0 w-48 max-h-60 overflow-y-auto' 
            : 'right-0 w-36 sm:w-40'
        ]"
      >
        <button 
          v-for="localeOption in availableLocales" 
          :key="localeOption.code"
          class="flex w-full items-center rounded-lg px-3 py-2.5 sm:py-2 text-sm/6 font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-manipulation"
          :class="{ 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400': locale === localeOption.code }"
          @click="switchLocale(localeOption.code)"
        >
          <span class="mr-3 text-lg flex-shrink-0">{{ localeOption.flag }}</span>
          <span class="flex-1 text-left">{{ localeOption.name }}</span>
          <CheckIcon 
            v-if="locale === localeOption.code" 
            class="ml-2 h-4 w-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" 
          />
        </button>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { ChevronDownIcon, CheckIcon } from '@heroicons/vue/20/solid'

const { locale, setLocale } = useI18n()

interface LocaleOption {
  code: string
  name: string
  flag: string
}

// 响应式数据
const isMobile = ref(false)

// 检测移动设备
onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 640
  }
  
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
  })
})

// 使用静态配置而不是响应式翻译，避免循环依赖
const getLocaleOptions = (): LocaleOption[] => [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
]

const currentLocaleName = computed(() => {
  const options = getLocaleOptions()
  return options.find(l => l.code === locale.value)?.name || '中文'
})

const currentLocaleFlag = computed(() => {
  const options = getLocaleOptions()
  return options.find(l => l.code === locale.value)?.flag || '🇨🇳'
})

const availableLocales = computed(() => {
  return getLocaleOptions()
})

const switchLocale = async (code: string) => {
  try {
    await setLocale(code)
    
    // 保存到本地存储
    if (import.meta.client) {
      localStorage.setItem('i18n_locale', code)
    }
    
    // 添加触觉反馈（如果支持）
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
  } catch (error) {
    console.error('Failed to switch locale:', error)
  }
}

// 在客户端初始化时从本地存储恢复语言设置
onMounted(() => {
  if (import.meta.client) {
    const savedLocale = localStorage.getItem('i18n_locale')
    if (savedLocale && savedLocale !== locale.value) {
      switchLocale(savedLocale)
    }
  }
})
</script>

<style scoped>
.touch-manipulation {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* 移动端优化 */
@media (max-width: 640px) {
  .max-h-60 {
    max-height: 15rem;
  }
  
  .overflow-y-auto::-webkit-scrollbar {
    width: 4px;
  }
  
  .overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 2px;
  }
  
  .dark .overflow-y-auto::-webkit-scrollbar-thumb {
    background: #4b5563;
  }
}

/* 活跃状态动画 */
.touch-manipulation:active {
  transform: scale(0.98);
}

/* 确保在移动端有足够的触摸目标大小 */
@media (max-width: 640px) {
  button {
    min-height: 44px; /* 符合iOS人机界面指南的最小触摸目标 */
  }
}
</style>