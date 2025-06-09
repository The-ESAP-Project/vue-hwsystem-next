<template>
  <footer class="bg-white border-t border-gray-200">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex justify-center space-x-6 md:order-2">
          <NuxtLink to="/about" class="text-gray-400 hover:text-gray-500 text-sm">
            {{ $t('footer.about') }}
          </NuxtLink>
          <NuxtLink to="/contact" class="text-gray-400 hover:text-gray-500 text-sm">
            {{ $t('footer.contact') }}
          </NuxtLink>
          <NuxtLink to="/privacy" class="text-gray-400 hover:text-gray-500 text-sm">
            {{ $t('footer.privacy') }}
          </NuxtLink>
          <NuxtLink to="/terms" class="text-gray-400 hover:text-gray-500 text-sm">
            {{ $t('footer.terms') }}
          </NuxtLink>
        </div>
        <div class="mt-8 md:mt-0 md:order-1">
          <p class="text-center text-gray-500 text-sm">
            {{ $t('footer.copyright', { year: currentYear, company: $t('home.title') }) }}
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { t } = useI18n()

// 使用计算属性避免每次渲染时创建新的 Date 对象
const currentYear = computed(() => new Date().getFullYear())
</script>