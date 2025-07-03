<template>
  <footer
    class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200"
  >
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <!-- Mobile: Links first, Desktop: Links second -->
        <div class="order-2 md:order-2">
          <div class="grid grid-cols-2 sm:flex sm:justify-center gap-4 sm:gap-6 text-center">
            <router-link
              to="/about"
              class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 text-sm transition-colors duration-200 py-2 sm:py-0"
            >
              {{ t('footer.about') }}
            </router-link>
            <router-link
              to="/contact"
              class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 text-sm transition-colors duration-200 py-2 sm:py-0"
            >
              {{ t('footer.contact') }}
            </router-link>
            <router-link
              to="/privacy"
              class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 text-sm transition-colors duration-200 py-2 sm:py-0"
            >
              {{ t('footer.privacy') }}
            </router-link>
            <router-link
              to="/terms"
              class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 text-sm transition-colors duration-200 py-2 sm:py-0"
            >
              {{ t('footer.terms') }}
            </router-link>
          </div>
        </div>

        <!-- Mobile: Copyright second, Desktop: Copyright first -->
        <div class="order-1 md:order-1">
          <p
            class="text-center text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200 leading-relaxed"
          >
            {{ t('footer.copyright', { year: currentYear }) }}
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()

// 使用计算属性避免每次渲染时创建新的 Date 对象
const currentYear = computed(() => new Date().getFullYear())
</script>
