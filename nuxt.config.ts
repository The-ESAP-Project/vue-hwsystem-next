// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import type { NuxtConfig } from '@nuxt/schema'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@nuxtjs/i18n'
  ],

  // @ts-ignore - Ignore type checking for UI config
  ui: {
    icons: ['heroicons'],
    fonts: false
  },

  i18n: {
    langDir: 'locales',
    defaultLocale: 'zh',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root',
    },
    locales: [
      {
        code: 'zh',
        iso: 'zh-CN',
        name: '简体中文',
        file: 'zh.ts'
      },
      {
        code: 'en',
        iso: 'en-US', 
        name: 'English',
        file: 'en.ts'
      },
      {
        code: 'ja',
        iso: 'ja-JP',
        name: '日本語',
        file: 'ja.ts'
      }
    ],
    strategy: 'no_prefix',
    vueI18n: './i18n/i18n.config.ts'
  },

  css: ['~/assets/css/main.css']
})