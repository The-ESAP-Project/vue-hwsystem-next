<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink :to="localePath('/')" class="flex items-center">
            <img 
              class="h-8 w-auto" 
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" 
              :alt="t('home.title')"
            >
            <span class="ml-2 text-xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
              {{ t('home.title') }}
            </span>
          </NuxtLink>
        </div>
        
        <!-- Controls -->
        <div class="flex items-center space-x-4">
          <ThemeSwitcher />
          <LanguageSwitcher />
          <NuxtLink 
            :to="localePath('/')" 
            class="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            {{ $t('common.back') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import LanguageSwitcher from '~/components/LanguageSwitcher.vue'
import ThemeSwitcher from '~/components/ThemeSwitcher.vue'

const { t } = useI18n()
const localePath = useLocalePath()
</script>
