<template>
  <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex justify-center space-x-6 md:order-2">
          <NuxtLink :to="localePath('/about')" class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 text-sm transition-colors duration-200">
            {{ $t('footer.about') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/contact')" class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 text-sm transition-colors duration-200">
            {{ $t('footer.contact') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/privacy')" class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 text-sm transition-colors duration-200">
            {{ $t('footer.privacy') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/terms')" class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 text-sm transition-colors duration-200">
            {{ $t('footer.terms') }}
          </NuxtLink>
        </div>
        <div class="mt-8 md:mt-0 md:order-1">
          <p class="text-center text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200">
            {{ $t('footer.copyright', { year: currentYear, company: $t('home.title') }) }}
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const { t } = useI18n()
const localePath = useLocalePath()

// 使用计算属性避免每次渲染时创建新的 Date 对象
const currentYear = computed(() => new Date().getFullYear())
</script>