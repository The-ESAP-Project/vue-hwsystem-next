<template>
  <div class="bg-white dark:bg-gray-900 transition-colors duration-200">
    <!-- Hero Section -->
    <div class="relative isolate px-6 pt-20 lg:px-8">
      <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"/>
      </div>

      <div class="mx-auto max-w-2xl py-16 sm:py-24 lg:py-32">
        <div class="hidden sm:mb-8 sm:flex sm:justify-center">
          <div class="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 dark:text-gray-300 ring-1 ring-gray-900/10 dark:ring-gray-700/50 hover:ring-gray-900/20 dark:hover:ring-gray-700 transition-colors duration-200">
            {{ t('home.hero.badge') }}
            <a href="#features" class="font-semibold text-indigo-600 dark:text-indigo-400">
              <span class="absolute inset-0" aria-hidden="true"/>
              {{ t('home.hero.learnMore') }} <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>

        <div class="text-center">
          <h1 class="text-balance text-5xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-7xl transition-colors duration-200">
            {{ t('home.hero.title') }}
          </h1>
          <p class="mt-8 text-pretty text-lg font-medium text-gray-500 dark:text-gray-400 sm:text-xl/8 transition-colors duration-200">
            {{ t('home.hero.subtitle') }}
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <template v-if="isAuthenticated">
              <!-- 已登录：显示前往控制台 -->
              <router-link
                :to="dashboardPath"
                class="rounded-md bg-indigo-600 dark:bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-500 transition-colors duration-200"
              >
                {{ t('home.hero.dashboard') }}
              </router-link>
            </template>
            <template v-else>
              <!-- 未登录：显示立即登录 -->
              <router-link
                to="/auth/login"
                class="rounded-md bg-indigo-600 dark:bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-500 transition-colors duration-200"
              >
                {{ t('home.hero.login') }}
              </router-link>
            </template>
            <a href="#roles" class="text-sm/6 font-semibold text-gray-900 dark:text-white transition-colors duration-200">
              {{ t('home.hero.learnRoles') }} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>

      <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"/>
      </div>
    </div>

    <!-- Features Section -->
    <div id="features" class="py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:text-center">
          <h2 class="text-base/7 font-semibold text-indigo-600 dark:text-indigo-400 transition-colors duration-200">{{ t('home.features.title') }}</h2>
          <p class="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-balance transition-colors duration-200">
            {{ t('home.features.subtitle') }}
          </p>
          <p class="mt-6 text-lg/8 text-gray-600 dark:text-gray-300 transition-colors duration-200">
            {{ t('home.features.description') }}
          </p>
        </div>

        <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            <div v-for="feature in features" :key="feature.name" class="relative pl-16">
              <dt class="text-base/7 font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                <div class="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500">
                  <component :is="feature.icon" class="size-6 text-white" aria-hidden="true" />
                </div>
                {{ feature.name }}
              </dt>
              <dd class="mt-2 text-base/7 text-gray-600 dark:text-gray-300 transition-colors duration-200">{{ feature.description }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <!-- Roles Section -->
    <div id="roles" class="bg-gray-50 dark:bg-gray-800 py-24 sm:py-32 transition-colors duration-200">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-base/7 font-semibold text-indigo-600 dark:text-indigo-400 transition-colors duration-200">{{ t('home.roles.title') }}</h2>
          <p class="mt-2 text-balance text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl transition-colors duration-200">
            {{ t('home.roles.subtitle') }}
          </p>
          <p class="mt-6 text-lg/8 text-gray-600 dark:text-gray-300 transition-colors duration-200">
            {{ t('home.roles.description') }}
          </p>
        </div>

        <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <div v-for="role in roles" :key="role.name" class="flex h-full flex-col items-start justify-between bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-600 transition-colors duration-200">
            <div class="flex-1 w-full">
              <div class="flex items-center gap-x-4">
                <div class="flex size-12 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/50">
                  <component :is="role.icon" class="size-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                </div>
                <h3 class="text-lg/6 font-semibold text-gray-900 dark:text-white transition-colors duration-200">{{ role.name }}</h3>
              </div>
              <p class="mt-4 text-sm/6 text-gray-600 dark:text-gray-300 transition-colors duration-200">{{ role.description }}</p>
              <div class="mt-6">
                <ul class="space-y-2">
                  <li v-for="feature in role.features" :key="feature" class="flex items-center text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200">
                    <svg class="mr-2 size-4 text-green-500 dark:text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    {{ feature }}
                  </li>
                </ul>
              </div>
            </div>
            <div class="mt-6 w-full">
              <template v-if="isAuthenticated && currentUser?.role === role.roleKey">
                <!-- 用户已登录且角色匹配：显示前往控制台 -->
                <router-link
                  :to="dashboardPath"
                  class="block w-full rounded-md bg-green-50 dark:bg-green-900/50 px-3 py-2 text-sm font-semibold text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/75 text-center transition-colors duration-200"
                >
                  {{ t('home.roles.dashboard') }}
                </router-link>
              </template>
              <template v-else>
                <!-- 未登录或角色不匹配：显示登录链接 -->
                <router-link
                  to="/auth/login"
                  class="block w-full rounded-md bg-indigo-50 dark:bg-indigo-900/50 px-3 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/75 text-center transition-colors duration-200"
                >
                  {{ t('home.roles.loginAs', { role: role.name }) }}
                </router-link>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-indigo-600 dark:bg-indigo-900/50 transition-colors duration-200">
      <div class="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {{ t('home.cta.title') }}
          </h2>
          <p class="mx-auto mt-6 max-w-xl text-lg/8 text-indigo-200 dark:text-indigo-100">
            {{ t('home.cta.subtitle') }}
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <template v-if="isAuthenticated">
              <!-- 已登录：显示前往控制台 -->
              <router-link
                :to="dashboardPath"
                class="rounded-md bg-white dark:bg-gray-100 px-3.5 py-2.5 text-sm font-semibold text-indigo-600 dark:text-indigo-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors duration-200"
              >
                {{ t('home.cta.dashboard') }}
              </router-link>
            </template>
            <template v-else>
              <!-- 未登录：显示立即体验 -->
              <router-link
                to="/auth/login"
                class="rounded-md bg-white dark:bg-gray-100 px-3.5 py-2.5 text-sm font-semibold text-indigo-600 dark:text-indigo-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors duration-200"
              >
                {{ t('home.cta.start') }}
              </router-link>
            </template>
            <a href="https://github.com/The-ESAP-Project/vue-hwsystem-next" class="text-sm/6 font-semibold text-white">
              {{ t('home.cta.source') }} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useLanguage } from '@/composables/useLanguage'

// 使用 i18n
const { t } = useLanguage()

// 图标组件 - 简化版本，暂时使用 div 替代
const DevicePhoneMobileIcon = 'div'
const BellIcon = 'div'
const ChartBarIcon = 'div'
const PencilSquareIcon = 'div'
const ShieldCheckIcon = 'div'
const LightBulbIcon = 'div'
const AcademicCapIcon = 'div'
const UserGroupIcon = 'div'
const PresentationChartBarIcon = 'div'

// 使用 user store
const userStore = useUserStore()
const { currentUser, isAuthenticated, dashboardPath } = userStore

const features = computed(() => [
  {
    name: t('home.features.items.responsive.name'),
    description: t('home.features.items.responsive.description'),
    icon: DevicePhoneMobileIcon,
  },
  {
    name: t('home.features.items.notification.name'),
    description: t('home.features.items.notification.description'),
    icon: BellIcon,
  },
  {
    name: t('home.features.items.visualization.name'),
    description: t('home.features.items.visualization.description'),
    icon: ChartBarIcon,
  },
  {
    name: t('home.features.items.grading.name'),
    description: t('home.features.items.grading.description'),
    icon: PencilSquareIcon,
  },
  {
    name: t('home.features.items.security.name'),
    description: t('home.features.items.security.description'),
    icon: ShieldCheckIcon,
  },
  {
    name: t('home.features.items.performance.name'),
    description: t('home.features.items.performance.description'),
    icon: LightBulbIcon,
  },
])

const roles = computed(() => [
  {
    name: t('home.roles.items.student.name'),
    description: t('home.roles.items.student.description'),
    icon: AcademicCapIcon,
    roleKey: 'student',
    features: [
      t('home.roles.items.student.features.0'),
      t('home.roles.items.student.features.1'),
      t('home.roles.items.student.features.2'),
      t('home.roles.items.student.features.3'),
      t('home.roles.items.student.features.4')
    ]
  },
  {
    name: t('home.roles.items.monitor.name'),
    description: t('home.roles.items.monitor.description'),
    icon: UserGroupIcon,
    roleKey: 'monitor',
    features: [
      t('home.roles.items.monitor.features.0'),
      t('home.roles.items.monitor.features.1'),
      t('home.roles.items.monitor.features.2'),
      t('home.roles.items.monitor.features.3'),
      t('home.roles.items.monitor.features.4')
    ]
  },
  {
    name: t('home.roles.items.teacher.name'),
    description: t('home.roles.items.teacher.description'),
    icon: PresentationChartBarIcon,
    roleKey: 'teacher',
    features: [
      t('home.roles.items.teacher.features.0'),
      t('home.roles.items.teacher.features.1'),
      t('home.roles.items.teacher.features.2'),
      t('home.roles.items.teacher.features.3'),
      t('home.roles.items.teacher.features.4')
    ]
  }
])

// 页面标题
document.title = `${t('home.title')} - ${t('app.name')}`
</script>
