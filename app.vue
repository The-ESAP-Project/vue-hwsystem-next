<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { getStoredLocale, setLocale } from './utils/i18n'

const { locale } = useI18n()

onMounted(() => {
  const savedLocale = getStoredLocale()
  if (savedLocale && ['zh', 'en', 'ja'].includes(savedLocale)) {
    locale.value = savedLocale as 'zh' | 'en' | 'ja'
    setLocale(savedLocale)
  }
})
import { onMounted as vueOnMounted } from 'vue'

function onMounted(fn: () => void) {
  vueOnMounted(fn)
}
</script>