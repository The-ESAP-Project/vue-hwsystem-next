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
          {{ t('terms.title') }}
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          {{ t('terms.subtitle') }}
        </p>
      </div>

      <!-- 内容 -->
      <div
        class="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-8 sm:p-12"
      >
        <div class="prose prose-gray dark:prose-invert max-w-none">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-8">
            {{ t('terms.lastUpdated') }}
          </p>

          <!-- 服务说明 -->
          <section class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              1. {{ t('terms.sections.service.title') }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              {{ t('terms.sections.service.content') }}
            </p>
          </section>

          <!-- 用户注册与账户 -->
          <section class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              2. {{ t('terms.sections.account.title') }}
            </h2>
            <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-8">
              <li v-for="(item, index) in $tm('terms.sections.account.items')" :key="index">
                {{ item }}
              </li>
            </ul>
          </section>

          <!-- 用户行为规范 -->
          <section class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              3. {{ t('terms.sections.conduct.title') }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              {{ t('terms.sections.conduct.intro') }}
            </p>
            <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-8">
              <li v-for="(item, index) in $tm('terms.sections.conduct.items')" :key="index">
                {{ item }}
              </li>
            </ul>
          </section>

          <!-- 学术诚信 -->
          <section class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              4. {{ t('terms.sections.integrity.title') }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              {{ t('terms.sections.integrity.intro') }}
            </p>
            <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-8">
              <li v-for="(item, index) in $tm('terms.sections.integrity.items')" :key="index">
                {{ item }}
              </li>
            </ul>
          </section>

          <!-- 知识产权 -->
          <section class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              5. {{ t('terms.sections.ip.title') }}
            </h2>
            <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-8">
              <li v-for="(item, index) in $tm('terms.sections.ip.items')" :key="index">
                {{ item }}
              </li>
            </ul>
          </section>

          <!-- 服务可用性 -->
          <section class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              6. {{ t('terms.sections.availability.title') }}
            </h2>
            <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-8">
              <li v-for="(item, index) in $tm('terms.sections.availability.items')" :key="index">
                {{ item }}
              </li>
            </ul>
          </section>

          <!-- 数据备份与恢复 -->
          <section class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              7. {{ t('terms.sections.backup.title') }}
            </h2>
            <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-8">
              <li v-for="(item, index) in $tm('terms.sections.backup.items')" :key="index">
                {{ item }}
              </li>
            </ul>
          </section>

          <!-- 费用与付款 -->
          <section class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              8. {{ t('terms.sections.payment.title') }}
            </h2>
            <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-8">
              <li v-for="(item, index) in $tm('terms.sections.payment.items')" :key="index">
                {{ item }}
              </li>
            </ul>
          </section>

          <!-- 责任限制 -->
          <section class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              9. {{ t('terms.sections.liability.title') }}
            </h2>
            <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-8">
              <li v-for="(item, index) in $tm('terms.sections.liability.items')" :key="index">
                {{ item }}
              </li>
            </ul>
          </section>

          <!-- 服务终止 -->
          <section class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              10. {{ t('terms.sections.termination.title') }}
            </h2>
            <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-8">
              <li v-for="(item, index) in $tm('terms.sections.termination.items')" :key="index">
                {{ item }}
              </li>
            </ul>
          </section>

          <!-- 法律适用与争议解决 -->
          <section class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              11. {{ t('terms.sections.legal.title') }}
            </h2>
            <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-8">
              <li v-for="(item, index) in $tm('terms.sections.legal.items')" :key="index">
                {{ item }}
              </li>
            </ul>
          </section>

          <!-- 条款修改 -->
          <section class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              12. {{ t('terms.sections.modifications.title') }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300 mb-8">
              {{ t('terms.sections.modifications.content') }}
            </p>
          </section>

          <!-- 联系信息 -->
          <section class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              13. {{ t('terms.sections.contact.title') }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              {{ t('terms.sections.contact.intro') }}
            </p>
            <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-8">
              <li v-for="(item, index) in $tm('terms.sections.contact.items')" :key="index">
                {{ item }}
              </li>
            </ul>
          </section>

          <!-- 重要提醒 -->
          <div
            class="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl border border-amber-200 dark:border-amber-800"
          >
            <p class="text-sm text-amber-800 dark:text-amber-200">
              <strong>{{ t('terms.notice.title') }}</strong> {{ t('terms.notice.content') }}
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
          {{ t('terms.backHome') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()

// 页面标题
document.title = `${t('terms.title')} - ${t('app.name')}`
</script>
