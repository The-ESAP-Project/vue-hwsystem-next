<template>
  <!--
    This example requires updating your template:

    ```
    <html class="h-full">
    <body class="h-full">
    ```
  -->
  <div class="grid min-h-full grid-cols-1 grid-rows-[1fr_auto_1fr] bg-white lg:grid-cols-[max(50%,36rem)_1fr]">
    <header class="mx-auto w-full max-w-7xl px-6 pt-6 sm:pt-10 lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:px-8">
      <NuxtLink :to="localePath('/')">
        <span class="sr-only">{{ $t('home.title') }}</span>
        <img class="h-10 w-auto sm:h-12" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="" >
      </NuxtLink>
    </header>
    <main class="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:px-8">
      <div class="max-w-lg">
        <p class="text-base/8 font-semibold text-indigo-600">404</p>
        <h1 class="mt-4 text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-6xl">{{ $t('404.title') }}</h1>
        <p class="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">{{ $t('404.description') }}</p>
        <div class="mt-10">
          <NuxtLink :to="localePath('/')" class="text-sm/7 font-semibold text-indigo-600">
            <span aria-hidden="true">&larr;</span> {{ $t('404.backToHome') }}
          </NuxtLink>
        </div>
      </div>
    </main>
    <footer class="self-end lg:col-span-2 lg:col-start-1 lg:row-start-3">
      <div class="border-t border-gray-100 bg-gray-50 py-10">
        <nav class="mx-auto flex w-full max-w-7xl items-center gap-x-4 px-6 text-sm/7 text-gray-600 lg:px-8">
          <a href="/contact">{{ $t('404.contactSupport') }}</a>
          <svg viewBox="0 0 2 2" aria-hidden="true" class="size-0.5 fill-gray-300">
            <circle cx="1" cy="1" r="1" />
          </svg>
          <a href="/status">{{ $t('common.status') }}</a>
        </nav>
      </div>
    </footer>
    <div class="hidden lg:relative lg:col-start-2 lg:row-start-1 lg:row-end-4 lg:block">
      <img src="https://images.unsplash.com/photo-1470847355775-e0e3c35a9a2c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1825&q=80" alt="" class="absolute inset-0 size-full object-cover" >
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const localePath = useLocalePath()

// SEO Meta - 修复标题翻译问题
useHead({
  title: t('404.title'),
  titleTemplate: '%s | ' + t('home.title'),
  meta: [
    {
      name: 'description',
      content: t('404.description')
    },
    {
      name: 'robots',
      content: 'noindex, nofollow'
    }
  ]
})
</script>