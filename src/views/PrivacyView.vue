<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 transition-all duration-200"
  >
    <div class="max-w-4xl mx-auto">
      <!-- 头部 -->
      <div class="text-center mb-12">
        <h1
          class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-4"
        >
          {{ t('privacy.title') }}
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          {{ t('privacy.subtitle') }}
        </p>
      </div>

      <!-- 内容 -->
      <div
        class="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-8 sm:p-12"
      >
        <div class="prose prose-gray dark:prose-invert max-w-none">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-8">
            {{ t('privacy.lastUpdated') }}
          </p>

          <!-- 信息收集 -->
          <section class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              1. {{ t('privacy.sections.collection.title') }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              {{ t('privacy.sections.collection.intro') }}
            </p>
            <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-8">
              <li v-for="(item, index) in $tm('privacy.sections.collection.items')" :key="index">
                {{ item }}
              </li>
            </ul>
          </section>

          <!-- 信息使用 -->
          <section class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              2. {{ t('privacy.sections.usage.title') }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              {{ t('privacy.sections.usage.intro') }}
            </p>
            <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-8">
              <li v-for="(item, index) in $tm('privacy.sections.usage.items')" :key="index">
                {{ item }}
              </li>
            </ul>
          </section>

          <!-- 信息共享 -->
          <section class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              3. {{ t('privacy.sections.sharing.title') }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              {{ t('privacy.sections.sharing.intro') }}
            </p>
            <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-8">
              <li v-for="(item, index) in $tm('privacy.sections.sharing.items')" :key="index">
                {{ item }}
              </li>
            </ul>
          </section>

          <!-- 数据安全 -->
          <section class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              4. {{ t('privacy.sections.security.title') }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              {{ t('privacy.sections.security.intro') }}
            </p>
            <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-8">
              <li v-for="(item, index) in $tm('privacy.sections.security.items')" :key="index">
                {{ item }}
              </li>
            </ul>
          </section>

          <!-- 您的权利 -->
          <section class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              5. {{ t('privacy.sections.rights.title') }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              {{ t('privacy.sections.rights.intro') }}
            </p>
            <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-8">
              <li v-for="(item, index) in $tm('privacy.sections.rights.items')" :key="index">
                {{ item }}
              </li>
            </ul>
          </section>

          <!-- Cookie使用 -->
          <section class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              6. {{ t('privacy.sections.cookies.title') }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300 mb-8">
              {{ t('privacy.sections.cookies.content') }}
            </p>
          </section>

          <!-- 政策更新 -->
          <section class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              7. {{ t('privacy.sections.updates.title') }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300 mb-8">
              {{ t('privacy.sections.updates.content') }}
            </p>
          </section>

          <!-- 联系我们 -->
          <section class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              8. {{ t('privacy.sections.contact.title') }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              {{ t('privacy.sections.contact.intro') }}
            </p>
            <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-8">
              <li v-for="(item, index) in $tm('privacy.sections.contact.items')" :key="index">
                {{ item }}
              </li>
            </ul>
          </section>

          <!-- 重要提醒 -->
          <div
            class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-800"
          >
            <p class="text-sm text-blue-800 dark:text-blue-200">
              <strong>{{ t('privacy.notice.title') }}</strong> {{ t('privacy.notice.content') }}
            </p>
          </div>
        </div>
      </div>

      <!-- 返回首页 -->
      <div class="text-center mt-12">
        <router-link
          to="/"
          class="inline-flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {{ t('privacy.backHome') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()

// 页面标题
document.title = `${t('privacy.title')} - ${t('app.name')}`
</script>
