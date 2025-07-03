<template>
  <div class="bg-white dark:bg-gray-900 transition-colors duration-200">
    <!-- Hero Section -->
    <div class="relative isolate px-6 pt-20 pb-16 lg:px-8">
      <div
        class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style="
            clip-path: polygon(
              74.1% 44.1%,
              100% 61.6%,
              97.5% 26.9%,
              85.5% 0.1%,
              80.7% 2%,
              72.5% 32.5%,
              60.2% 62.4%,
              52.4% 68.1%,
              47.5% 58.3%,
              45.2% 34.5%,
              27.5% 76.7%,
              0.1% 64.9%,
              17.9% 100%,
              27.6% 76.8%,
              76.1% 97.7%,
              74.1% 44.1%
            );
          "
        />
      </div>

      <div class="mx-auto max-w-4xl text-center">
        <div class="mb-8">
          <img
            src="/favicon.ico"
            alt="作业管理系统"
            class="mx-auto h-24 w-24 rounded-2xl shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-4"
          />
        </div>
        <h1
          class="text-balance text-5xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-6xl transition-colors duration-200"
        >
          {{ t('about.title') }}
        </h1>
        <p
          class="mt-8 text-pretty text-xl font-medium text-gray-600 dark:text-gray-300 transition-colors duration-200"
        >
          {{ t('about.subtitle') }}
        </p>

        <!-- 技术徽章 -->
        <div class="mt-10 flex flex-wrap justify-center gap-3">
          <span
            class="inline-flex items-center rounded-full bg-green-50 dark:bg-green-900/50 px-3 py-1 text-sm font-medium text-green-700 dark:text-green-300 ring-1 ring-inset ring-green-600/20 dark:ring-green-400/20"
          >
            Vue 3.5+
          </span>
          <span
            class="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/50 px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-600/20 dark:ring-blue-400/20"
          >
            TypeScript 5.8+
          </span>
          <span
            class="inline-flex items-center rounded-full bg-purple-50 dark:bg-purple-900/50 px-3 py-1 text-sm font-medium text-purple-700 dark:text-purple-300 ring-1 ring-inset ring-purple-600/20 dark:ring-purple-400/20"
          >
            Vite 7.0+
          </span>
          <span
            class="inline-flex items-center rounded-full bg-cyan-50 dark:bg-cyan-900/50 px-3 py-1 text-sm font-medium text-cyan-700 dark:text-cyan-300 ring-1 ring-inset ring-cyan-600/20 dark:ring-cyan-400/20"
          >
            Tailwind CSS 4.1+
          </span>
          <span
            class="inline-flex items-center rounded-full bg-yellow-50 dark:bg-yellow-900/50 px-3 py-1 text-sm font-medium text-yellow-700 dark:text-yellow-300 ring-1 ring-inset ring-yellow-600/20 dark:ring-yellow-400/20"
          >
            Pinia 3.0+
          </span>
        </div>
      </div>
    </div>

    <!-- 产品特色 -->
    <div class="py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:text-center">
          <h2
            class="text-base/7 font-semibold text-indigo-600 dark:text-indigo-400 transition-colors duration-200"
          >
            {{ t('about.features.title') }}
          </h2>
          <p
            class="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-balance transition-colors duration-200"
          >
            {{ t('about.features.subtitle') }}
          </p>
          <p class="mt-6 text-lg/8 text-gray-600 dark:text-gray-300 transition-colors duration-200">
            {{ t('about.features.description') }}
          </p>
        </div>

        <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <!-- 多角色支持 -->
            <div class="flex flex-col">
              <dt
                class="flex items-center gap-x-3 text-base/7 font-semibold text-gray-900 dark:text-white transition-colors duration-200"
              >
                <div
                  class="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500"
                >
                  <UsersIcon class="h-6 w-6 text-white" />
                </div>
                {{ t('about.features.items.multiRole.title') }}
              </dt>
              <dd
                class="mt-4 flex flex-auto flex-col text-base/7 text-gray-600 dark:text-gray-300 transition-colors duration-200"
              >
                <p class="flex-auto">{{ t('about.features.items.multiRole.description') }}</p>
              </dd>
            </div>

            <!-- 响应式设计 -->
            <div class="flex flex-col">
              <dt
                class="flex items-center gap-x-3 text-base/7 font-semibold text-gray-900 dark:text-white transition-colors duration-200"
              >
                <div
                  class="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500"
                >
                  <DevicePhoneMobileIcon class="h-6 w-6 text-white" />
                </div>
                {{ t('about.features.items.responsive.title') }}
              </dt>
              <dd
                class="mt-4 flex flex-auto flex-col text-base/7 text-gray-600 dark:text-gray-300 transition-colors duration-200"
              >
                <p class="flex-auto">{{ t('about.features.items.responsive.description') }}</p>
              </dd>
            </div>

            <!-- 现代化技术栈 -->
            <div class="flex flex-col">
              <dt
                class="flex items-center gap-x-3 text-base/7 font-semibold text-gray-900 dark:text-white transition-colors duration-200"
              >
                <div
                  class="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500"
                >
                  <SparklesIcon class="h-6 w-6 text-white" />
                </div>
                {{ t('about.features.items.modernTech.title') }}
              </dt>
              <dd
                class="mt-4 flex flex-auto flex-col text-base/7 text-gray-600 dark:text-gray-300 transition-colors duration-200"
              >
                <p class="flex-auto">{{ t('about.features.items.modernTech.description') }}</p>
              </dd>
            </div>

            <!-- 深色模式 -->
            <div class="flex flex-col">
              <dt
                class="flex items-center gap-x-3 text-base/7 font-semibold text-gray-900 dark:text-white transition-colors duration-200"
              >
                <div
                  class="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500"
                >
                  <MoonIcon class="h-6 w-6 text-white" />
                </div>
                {{ t('about.features.items.darkMode.title') }}
              </dt>
              <dd
                class="mt-4 flex flex-auto flex-col text-base/7 text-gray-600 dark:text-gray-300 transition-colors duration-200"
              >
                <p class="flex-auto">{{ t('about.features.items.darkMode.description') }}</p>
              </dd>
            </div>

            <!-- JWT 认证 -->
            <div class="flex flex-col">
              <dt
                class="flex items-center gap-x-3 text-base/7 font-semibold text-gray-900 dark:text-white transition-colors duration-200"
              >
                <div
                  class="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500"
                >
                  <ShieldCheckIcon class="h-6 w-6 text-white" />
                </div>
                {{ t('about.features.items.security.title') }}
              </dt>
              <dd
                class="mt-4 flex flex-auto flex-col text-base/7 text-gray-600 dark:text-gray-300 transition-colors duration-200"
              >
                <p class="flex-auto">{{ t('about.features.items.security.description') }}</p>
              </dd>
            </div>

            <!-- 数据可视化 -->
            <div class="flex flex-col">
              <dt
                class="flex items-center gap-x-3 text-base/7 font-semibold text-gray-900 dark:text-white transition-colors duration-200"
              >
                <div
                  class="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500"
                >
                  <ChartBarIcon class="h-6 w-6 text-white" />
                </div>
                {{ t('about.features.items.visualization.title') }}
              </dt>
              <dd
                class="mt-4 flex flex-auto flex-col text-base/7 text-gray-600 dark:text-gray-300 transition-colors duration-200"
              >
                <p class="flex-auto">{{ t('about.features.items.visualization.description') }}</p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <!-- 技术架构 -->
    <div class="bg-gray-50 dark:bg-gray-800 py-24 sm:py-32 transition-colors duration-200">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:text-center">
          <h2
            class="text-base/7 font-semibold text-indigo-600 dark:text-indigo-400 transition-colors duration-200"
          >
            {{ t('about.tech.title') }}
          </h2>
          <p
            class="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-balance transition-colors duration-200"
          >
            {{ t('about.tech.subtitle') }}
          </p>
          <p class="mt-6 text-lg/8 text-gray-600 dark:text-gray-300 transition-colors duration-200">
            {{ t('about.tech.description') }}
          </p>
        </div>

        <div
          class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2"
        >
          <!-- 前端架构 -->
          <div
            class="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:ring-gray-600 transition-colors duration-200"
          >
            <h3
              class="text-lg/6 font-semibold text-gray-900 dark:text-white mb-6 transition-colors duration-200"
            >
              {{ t('about.tech.frontend.title') }}
            </h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Vue 3</span>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{
                  t('about.tech.frontend.vue')
                }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">TypeScript</span>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{
                  t('about.tech.frontend.typescript')
                }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Vite</span>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{
                  t('about.tech.frontend.vite')
                }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Tailwind CSS</span
                >
                <span class="text-sm text-gray-500 dark:text-gray-400">{{
                  t('about.tech.frontend.tailwind')
                }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Pinia</span>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{
                  t('about.tech.frontend.pinia')
                }}</span>
              </div>
            </div>
          </div>

          <!-- 后端架构 -->
          <div
            class="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:ring-gray-600 transition-colors duration-200"
          >
            <h3
              class="text-lg/6 font-semibold text-gray-900 dark:text-white mb-6 transition-colors duration-200"
            >
              {{ t('about.tech.backend.title') }}
            </h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Rust</span>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{
                  t('about.tech.backend.rust')
                }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Actix Web</span>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{
                  t('about.tech.backend.actix')
                }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">PostgreSQL</span>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{
                  t('about.tech.backend.postgresql')
                }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">JWT</span>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{
                  t('about.tech.backend.jwt')
                }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Serde</span>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{
                  t('about.tech.backend.serde')
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 性能指标 -->
    <div class="py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:text-center">
          <h2
            class="text-base/7 font-semibold text-indigo-600 dark:text-indigo-400 transition-colors duration-200"
          >
            {{ t('about.performance.title') }}
          </h2>
          <p
            class="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-balance transition-colors duration-200"
          >
            {{ t('about.performance.subtitle') }}
          </p>
        </div>

        <div
          class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-4"
        >
          <div
            class="flex flex-col items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-800 p-8 transition-colors duration-200"
          >
            <dt
              class="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-200"
            >
              {{ t('about.performance.responseTime.title') }}
            </dt>
            <dd
              class="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white transition-colors duration-200"
            >
              {{ t('about.performance.responseTime.value') }}
            </dd>
            <dd class="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
              {{ t('about.performance.responseTime.description') }}
            </dd>
          </div>
          <div
            class="flex flex-col items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-800 p-8 transition-colors duration-200"
          >
            <dt
              class="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-200"
            >
              {{ t('about.performance.concurrency.title') }}
            </dt>
            <dd
              class="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white transition-colors duration-200"
            >
              {{ t('about.performance.concurrency.value') }}
            </dd>
            <dd class="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
              {{ t('about.performance.concurrency.description') }}
            </dd>
          </div>
          <div
            class="flex flex-col items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-800 p-8 transition-colors duration-200"
          >
            <dt
              class="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-200"
            >
              {{ t('about.performance.memory.title') }}
            </dt>
            <dd
              class="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white transition-colors duration-200"
            >
              {{ t('about.performance.memory.value') }}
            </dd>
            <dd class="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
              {{ t('about.performance.memory.description') }}
            </dd>
          </div>
          <div
            class="flex flex-col items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-800 p-8 transition-colors duration-200"
          >
            <dt
              class="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-200"
            >
              {{ t('about.performance.startup.title') }}
            </dt>
            <dd
              class="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white transition-colors duration-200"
            >
              {{ t('about.performance.startup.value') }}
            </dd>
            <dd class="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
              {{ t('about.performance.startup.description') }}
            </dd>
          </div>
        </div>
      </div>
    </div>

    <!-- 开源信息 -->
    <div class="bg-indigo-600 dark:bg-indigo-900/50 transition-colors duration-200">
      <div class="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {{ t('about.opensource.title') }}
          </h2>
          <p class="mx-auto mt-6 max-w-xl text-lg/8 text-indigo-200 dark:text-indigo-100">
            {{ t('about.opensource.subtitle') }}
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="https://github.com/The-ESAP-Project/vue-hwsystem-next"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-md bg-white dark:bg-gray-100 px-3.5 py-2.5 text-sm font-semibold text-indigo-600 dark:text-indigo-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors duration-200"
            >
              {{ t('about.opensource.frontend') }}
            </a>
            <a
              href="https://github.com/The-ESAP-Project/rust-hwsystem-next"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-md bg-white/10 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors duration-200"
            >
              {{ t('about.opensource.backend') }}
            </a>
          </div>

          <!-- 开发团队 -->
          <div class="mt-16">
            <h3 class="text-lg font-semibold text-white mb-4">
              {{ t('about.opensource.team.title') }}
            </h3>
            <div class="flex items-center justify-center">
              <div class="text-indigo-200 dark:text-indigo-100">
                <p class="font-medium">{{ t('about.opensource.team.name') }}</p>
                <p class="text-sm">{{ t('about.opensource.team.description') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLanguage } from '@/composables/useLanguage'
import {
  ChartBarIcon,
  DevicePhoneMobileIcon,
  MoonIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline'

// 使用 i18n
const { t } = useLanguage()

// 页面标题
document.title = `${t('about.title')} - ${t('app.name')}`
</script>
