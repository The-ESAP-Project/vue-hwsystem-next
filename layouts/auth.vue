<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header with Language Switcher -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center">
              <img 
                class="h-8 w-auto" 
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" 
                :alt="t('home.title')"
              >
              <span class="ml-2 text-xl font-bold text-gray-900">{{ t('home.title') }}</span>
            </NuxtLink>
          </div>
          
          <!-- Language Switcher -->
          <div class="flex items-center space-x-4">
            <LanguageSwitcher />
            <NuxtLink 
              to="/" 
              class="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              {{ $t('common.back') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <NuxtLink to="/privacy" class="hover:text-gray-900 transition-colors">
            {{ $t('footer.privacy') }}
          </NuxtLink>
          <span class="text-gray-300">|</span>
          <NuxtLink to="/terms" class="hover:text-gray-900 transition-colors">
            {{ $t('footer.terms') }}
          </NuxtLink>
          <span class="text-gray-300">|</span>
          <NuxtLink to="/help" class="hover:text-gray-900 transition-colors">
            {{ $t('footer.help') }}
          </NuxtLink>
        </div>
        <div class="mt-2 text-center text-xs text-gray-400">
          {{ $t('footer.copyright', { year: new Date().getFullYear(), company: $t('home.title') }) }}
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import LanguageSwitcher from '~/components/LanguageSwitcher.vue'

const { t } = useI18n()
</script>

<style scoped>
/* 确保页面最小高度为全屏 */
</style>
