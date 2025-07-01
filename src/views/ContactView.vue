<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 transition-all duration-200">
    <div class="max-w-4xl mx-auto">
      <!-- 头部 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
          {{ t('contact.title') }}
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          {{ t('contact.subtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 联系信息 -->
        <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">{{ t('contact.info.title') }}</h2>

          <div class="space-y-6">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">{{ t('contact.info.email.title') }}</h3>
                <p class="text-gray-600 dark:text-gray-400">{{ t('contact.info.email.support') }}</p>
                <p class="text-gray-600 dark:text-gray-400">{{ t('contact.info.email.admin') }}</p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">{{ t('contact.info.phone.title') }}</h3>
                <p class="text-gray-600 dark:text-gray-400">{{ t('contact.info.phone.number') }}</p>
                <p class="text-gray-600 dark:text-gray-400">{{ t('contact.info.phone.hours') }}</p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">{{ t('contact.info.address.title') }}</h3>
                <p class="text-gray-600 dark:text-gray-400">{{ t('contact.info.address.street') }}</p>
                <p class="text-gray-600 dark:text-gray-400">{{ t('contact.info.address.building') }}</p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">{{ t('contact.info.online.title') }}</h3>
                <p class="text-gray-600 dark:text-gray-400">{{ t('contact.info.online.wechat') }}</p>
                <p class="text-gray-600 dark:text-gray-400">{{ t('contact.info.online.qq') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 联系表单 -->
        <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">{{ t('contact.form.title') }}</h2>

          <form @submit.prevent="submitForm" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                {{ t('contact.form.name.label') }}
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="block w-full px-4 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 transition-all duration-200"
                :placeholder="t('contact.form.name.placeholder')"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                {{ t('contact.form.email.label') }}
              </label>
              <input
                v-model="form.email"
                type="email"
                required
                class="block w-full px-4 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 transition-all duration-200"
                :placeholder="t('contact.form.email.placeholder')"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                {{ t('contact.form.subject.label') }}
              </label>
              <select
                v-model="form.subject"
                required
                class="block w-full px-4 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 transition-all duration-200"
              >
                <option value="">{{ t('contact.form.subject.placeholder') }}</option>
                <option value="bug">{{ t('contact.form.subject.options.bug') }}</option>
                <option value="feature">{{ t('contact.form.subject.options.feature') }}</option>
                <option value="support">{{ t('contact.form.subject.options.support') }}</option>
                <option value="other">{{ t('contact.form.subject.options.other') }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                {{ t('contact.form.message.label') }}
              </label>
              <textarea
                v-model="form.message"
                rows="6"
                required
                class="block w-full px-4 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 transition-all duration-200 resize-none"
                :placeholder="t('contact.form.message.placeholder')"
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="submitting"
              class="w-full py-3 px-4 text-base font-semibold rounded-2xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
            >
              <span v-if="submitting">{{ t('contact.form.submitting') }}</span>
              <span v-else>{{ t('contact.form.submit') }}</span>
            </button>
          </form>
        </div>
      </div>

      <!-- 返回首页 -->
      <div class="text-center mt-12">
        <router-link
          to="/"
          class="inline-flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          {{ t('contact.backHome') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()

// 页面标题
document.title = `${t('contact.title')} - ${t('app.name')}`

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const submitting = ref(false)

const submitForm = async () => {
  try {
    submitting.value = true

    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    alert(t('contact.form.success'))

    // 重置表单
    Object.assign(form, {
      name: '',
      email: '',
      subject: '',
      message: ''
    })

  } catch {
    alert(t('contact.form.error'))
  } finally {
    submitting.value = false
  }
}
</script>
