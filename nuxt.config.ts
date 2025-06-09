// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2025-06-09",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  imports: {
    autoImport: true,
  },

  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxtjs/tailwindcss",
    ["@nuxt/ui", { icons: ["heroicons"], fonts: false }],
    "@nuxtjs/i18n",
  ],

  i18n: {
    locales: [
      {
        code: "zh",
        iso: "zh-CN",
        name: "简体中文",
        file: "zh.json",
      },
      {
        code: "en",
        iso: "en-US",
        name: "English",
        file: "en.json",
      },
      {
        code: "ja",
        iso: "ja-JP",
        name: "日本語",
        file: "ja.json",
      },
    ],
    lazy: true,
    langDir: "./",
    defaultLocale: "zh",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
    strategy: 'prefix_except_default', // 添加路由策略
  },
});