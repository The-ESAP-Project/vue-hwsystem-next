<template>
  <header class="bg-white shadow-sm">
    <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
      <div class="flex lg:flex-1">
        <NuxtLink :to="localePath('/')" class="-m-1.5 p-1.5">
          <span class="sr-only">{{ t('home.title') }}</span>
          <img class="h-8 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" :alt="t('home.title')" >
        </NuxtLink>
      </div>
      <div class="flex lg:hidden">
        <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = true">
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="size-6" aria-hidden="true" />
        </button>
      </div>
      <PopoverGroup class="hidden lg:flex lg:gap-x-12">
        <Popover class="relative">
          <PopoverButton class="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
            {{ $t('nav.product') }}
            <ChevronDownIcon class="size-5 flex-none text-gray-400" aria-hidden="true" />
          </PopoverButton>

          <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
            <PopoverPanel class="absolute top-full -left-8 z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
              <div class="p-4">
                <div v-for="item in products" :key="item.name" class="group relative flex gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50">
                  <div class="mt-1 flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                    <component :is="item.icon" class="size-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
                  </div>
                  <div class="flex-auto">
                    <a :href="item.href" class="block font-semibold text-gray-900">
                      {{ $t(item.nameKey) }}
                      <span class="absolute inset-0" />
                    </a>
                    <p class="mt-1 text-gray-600">{{ $t(item.descKey) }}</p>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                <a v-for="item in callsToAction" :key="item.nameKey" :href="item.href" class="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100">
                  <component :is="item.icon" class="size-5 flex-none text-gray-400" aria-hidden="true" />
                  {{ $t(item.nameKey) }}
                </a>
              </div>
            </PopoverPanel>
          </transition>
        </Popover>

        <NuxtLink :to="localePath('/features')" class="text-sm/6 font-semibold text-gray-900">{{ $t('nav.features') }}</NuxtLink>
        <NuxtLink :to="localePath('/marketplace')" class="text-sm/6 font-semibold text-gray-900">{{ $t('nav.marketplace') }}</NuxtLink>

        <Popover class="relative">
          <PopoverButton class="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
            {{ $t('nav.company') }}
            <ChevronDownIcon class="size-5 flex-none text-gray-400" aria-hidden="true" />
          </PopoverButton>

          <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
            <PopoverPanel class="absolute top-full -left-8 z-10 mt-3 w-56 rounded-xl bg-white p-2 shadow-lg ring-1 ring-gray-900/5">
              <a v-for="item in company" :key="item.nameKey" :href="item.href" class="block rounded-lg px-3 py-2 text-sm/6 font-semibold text-gray-900 hover:bg-gray-50">{{ $t(item.nameKey) }}</a>
            </PopoverPanel>
          </transition>
        </Popover>
      </PopoverGroup>
      
      <!-- 登录和语言切换区域 -->
      <div class="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-4">
        <!-- Language Switcher -->
        <LanguageSwitcher />
        
        <!-- 分隔线 -->
        <div class="w-px h-5 bg-gray-300"/>
        
        <!-- 登录按钮 -->
        <NuxtLink :to="localePath('/auth/login')" class="text-sm/6 font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
          {{ $t('common.login') }} <span aria-hidden="true">&rarr;</span>
        </NuxtLink>
      </div>
    </nav>
    
    <!-- Mobile Menu -->
    <Dialog class="lg:hidden" :open="mobileMenuOpen" @close="mobileMenuOpen = false">
      <div class="fixed inset-0 z-50" />
      <DialogPanel class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div class="flex items-center justify-between">
          <NuxtLink :to="localePath('/')" class="-m-1.5 p-1.5" @click="mobileMenuOpen = false">
            <span class="sr-only">{{ t('home.title') }}</span>
            <img class="h-8 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" :alt="t('home.title')" >
          </NuxtLink>
          <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = false">
            <span class="sr-only">{{ t('common.close') }}</span>
            <XMarkIcon class="size-6" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10">
            <div class="space-y-2 py-6">
              <Disclosure v-slot="{ open }" as="div" class="-mx-3">
                <DisclosureButton class="flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                  {{ $t('nav.product') }}
                  <ChevronDownIcon :class="[open ? 'rotate-180' : '', 'size-5 flex-none']" aria-hidden="true" />
                </DisclosureButton>
                <DisclosurePanel class="mt-2 space-y-2">
                  <DisclosureButton v-for="item in [...products, ...callsToAction]" :key="item.nameKey" as="a" :href="item.href" class="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50">{{ $t(item.nameKey) }}</DisclosureButton>
                </DisclosurePanel>
              </Disclosure>

              <NuxtLink :to="localePath('/features')" class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">{{ $t('nav.features') }}</NuxtLink>
              <NuxtLink :to="localePath('/marketplace')" class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">{{ $t('nav.marketplace') }}</NuxtLink>

              <Disclosure v-slot="{ open }" as="div" class="-mx-3">
                <DisclosureButton class="flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                  {{ $t('nav.company') }}
                  <ChevronDownIcon :class="[open ? 'rotate-180' : '', 'size-5 flex-none']" aria-hidden="true" />
                </DisclosureButton>
                <DisclosurePanel class="mt-2 space-y-2">
                  <DisclosureButton v-for="item in company" :key="item.nameKey" as="a" :href="item.href" class="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50">{{ $t(item.nameKey) }}</DisclosureButton>
                </DisclosurePanel>
              </Disclosure>

              <!-- Mobile Language Switcher -->
              <div class="-mx-3 px-3 py-2 border-t border-gray-200 mt-4 pt-4">
                <p class="text-sm font-medium text-gray-900 mb-3">{{ $t('language.switchLanguage') }}</p>
                <div class="space-y-2">
                  <button 
                    v-for="locale in availableLocales" 
                    :key="locale.code"
                    class="flex w-full items-center rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                    :class="{ 'bg-indigo-50 text-indigo-600': locale.code === currentLocale }"
                    @click="switchLocale(locale.code)"
                  >
                    <span class="mr-3 text-lg">{{ locale.flag }}</span>
                    {{ locale.name }}
                  </button>
                </div>
              </div>
            </div>
            <div class="py-6">
              <NuxtLink :to="localePath('/auth/login')" class="block text-sm/6 font-semibold text-gray-900" @click="mobileMenuOpen = false">
                {{ $t('common.login') }} <span aria-hidden="true">&rarr;</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </header>
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
} from '@heroicons/vue/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/vue/20/solid'

const { t, locale, setLocale } = useI18n()
const localePath = useLocalePath()

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

// 添加当前语言计算属性
const currentLocale = computed(() => locale.value)

// Mobile language switcher data - 优化显示
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
</script>