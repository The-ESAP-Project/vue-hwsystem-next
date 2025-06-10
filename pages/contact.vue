<template>
  <div class="contact-page">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-center mb-8">{{ $t('pages.contact.title') }}</h1>
      
      <div class="max-w-6xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-12">
          <!-- 联系信息 -->
          <div>
            <h2 class="text-2xl font-semibold mb-6">{{ $t('pages.contact.contactInfo') }}</h2>
            
            <div class="space-y-6">
              <div class="flex items-start">
                <div class="w-6 h-6 text-blue-600 mr-4 mt-1">📍</div>
                <div>
                  <h3 class="font-semibold mb-1">{{ $t('pages.contact.address.title') }}</h3>
                  <p class="text-gray-700">{{ $t('pages.contact.address.value') }}</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="w-6 h-6 text-blue-600 mr-4 mt-1">📞</div>
                <div>
                  <h3 class="font-semibold mb-1">{{ $t('pages.contact.phone.title') }}</h3>
                  <p class="text-gray-700">{{ $t('pages.contact.phone.value') }}</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="w-6 h-6 text-blue-600 mr-4 mt-1">✉️</div>
                <div>
                  <h3 class="font-semibold mb-1">{{ $t('pages.contact.email.title') }}</h3>
                  <p class="text-gray-700">{{ $t('pages.contact.email.value') }}</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="w-6 h-6 text-blue-600 mr-4 mt-1">🕒</div>
                <div>
                  <h3 class="font-semibold mb-1">{{ $t('pages.contact.workingHours.title') }}</h3>
                  <p class="text-gray-700">{{ $t('pages.contact.workingHours.weekdays') }}</p>
                  <p class="text-gray-700">{{ $t('pages.contact.workingHours.saturday') }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 联系表单 -->
          <div>
            <h2 class="text-2xl font-semibold mb-6">{{ $t('pages.contact.sendMessage') }}</h2>
            
            <form @submit.prevent="submitForm" class="space-y-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">{{ $t('pages.contact.form.name') }} *</label>
                <input
                  type="text"
                  id="name"
                  v-model="form.name"
                  required
                  :placeholder="$t('pages.contact.form.nameRequired')"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">{{ $t('pages.contact.form.email') }} *</label>
                <input
                  type="email"
                  id="email"
                  v-model="form.email"
                  required
                  :placeholder="$t('pages.contact.form.emailRequired')"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">{{ $t('pages.contact.form.phone') }}</label>
                <input
                  type="tel"
                  id="phone"
                  v-model="form.phone"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              
              <div>
                <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">{{ $t('pages.contact.form.subject') }} *</label>
                <input
                  type="text"
                  id="subject"
                  v-model="form.subject"
                  required
                  :placeholder="$t('pages.contact.form.subjectRequired')"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              
              <div>
                <label for="message" class="block text-sm font-medium text-gray-700 mb-2">{{ $t('pages.contact.form.message') }} *</label>
                <textarea
                  id="message"
                  v-model="form.message"
                  required
                  rows="5"
                  :placeholder="$t('pages.contact.form.messageRequired')"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              
              <button
                type="submit"
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
              >
                {{ $t('pages.contact.form.submit') }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const { t } = useI18n()

const form = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const submitForm = () => {
  // 这里可以添加表单提交逻辑
  console.log('表单提交:', form.value)
  alert(t('pages.contact.form.successMessage'))
  
  // 重置表单
  form.value = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  }
}

// SEO meta tags
useSeoMeta({
  title: () => t('pages.contact.title'),
  description: () => t('pages.contact.contactInfo')
})
</script>