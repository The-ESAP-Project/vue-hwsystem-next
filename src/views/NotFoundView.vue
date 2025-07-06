<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-lg w-full text-center">
      <div class="relative mb-8">
        <div class="text-black text-6xl font-bold dark:text-white">404</div>
      </div>

      <!-- 主标题 -->
      <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        {{ t('error.notFound.title') }}
      </h1>

      <!-- 副标题 -->
      <p class="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
        {{ t('error.notFound.description') }}
      </p>

      <!-- 错误路径显示 -->
      <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-8 border-l-4 border-indigo-500">
        <p class="text-sm text-gray-600 dark:text-gray-400 font-mono">
          {{ t('error.notFound.path') }}:
          <span class="text-indigo-600 dark:text-indigo-400">{{ $route.fullPath }}</span>
        </p>
      </div>

      <!-- 操作按钮 -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="goBack"
          class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-200"
        >
          <ArrowLeftIcon class="w-5 h-5 mr-2" />
          {{ t('error.notFound.goBack') }}
        </button>

        <router-link
          to="/"
          class="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-base font-medium text-white hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          <HomeIcon class="w-5 h-5 mr-2" />
          {{ t('error.notFound.goHome') }}
        </router-link>
      </div>

      <!-- 建议链接 -->
      <div class="mt-12">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {{ t('error.notFound.suggestions') }}
        </p>
        <div class="flex flex-wrap justify-center gap-2">
          <router-link
            v-for="link in suggestedLinks"
            :key="link.name"
            :to="link.path"
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-800 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200"
          >
            {{ link.name }}
          </router-link>
        </div>
      </div>

      <!-- 装饰性波浪 -->
      <div class="absolute inset-x-0 bottom-0 -z-10">
        <svg
          class="w-full h-32 text-indigo-100 dark:text-gray-800 opacity-50"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ArrowLeftIcon, HomeIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const { t } = useI18n()
const router = useRouter()

// 建议的链接
const suggestedLinks = computed(() => [
  { name: t('nav.home'), path: '/' },
  { name: t('nav.about'), path: '/about' },
  { name: t('nav.contact'), path: '/contact' },
])

// 返回上一页
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>
