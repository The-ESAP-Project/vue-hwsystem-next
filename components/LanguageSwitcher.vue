<template>
  <Popover class="relative">
    <PopoverButton class="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
      {{ currentLocaleName }}
      <ChevronDownIcon class="size-5 flex-none text-gray-400" aria-hidden="true" />
    </PopoverButton>

    <transition 
      enter-active-class="transition ease-out duration-200" 
      enter-from-class="opacity-0 translate-y-1" 
      enter-to-class="opacity-100 translate-y-0" 
      leave-active-class="transition ease-in duration-150" 
      leave-from-class="opacity-100 translate-y-0" 
      leave-to-class="opacity-0 translate-y-1"
    >
      <PopoverPanel class="absolute top-full right-0 z-10 mt-3 w-40 rounded-xl bg-white p-2 shadow-lg ring-1 ring-gray-900/5">
        <button 
          v-for="locale in availableLocales" 
          :key="locale.code"
          @click="switchLocale(locale.code)"
          class="flex w-full items-center rounded-lg px-3 py-2 text-sm/6 font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
        >
          <span class="mr-2 text-lg">{{ locale.flag }}</span>
          {{ locale.name }}
        </button>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'

const { locale, setLocale } = useI18n()
const { t } = useI18n()

interface LocaleOption {
  code: string
  name: string
  flag: string
}

// 使用静态配置而不是响应式翻译，避免循环依赖
const getLocaleOptions = (): LocaleOption[] => [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
]

const currentLocale = computed(() => locale.value)

const currentLocaleName = computed(() => {
  const options = getLocaleOptions()
  return options.find(l => l.code === locale.value)?.name || '中文'
})

const availableLocales = computed(() => {
  const options = getLocaleOptions()
  return options
})

const switchLocale = async (code: string) => {
  try {
    await setLocale(code)
    
    // 保存到本地存储
    if (process.client) {
      localStorage.setItem('i18n_locale', code)
    }
  } catch (error) {
    console.error('Failed to switch locale:', error)
  }
}

// 在客户端初始化时从本地存储恢复语言设置
onMounted(() => {
  if (process.client) {
    const savedLocale = localStorage.getItem('i18n_locale')
    if (savedLocale && savedLocale !== locale.value) {
      switchLocale(savedLocale)
    }
  }
})
</script>
