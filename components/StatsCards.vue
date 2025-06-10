<template>
  <div class="relative mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
    <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-600/50 transition-all duration-200 hover:scale-105 hover:shadow-lg"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ stat.label }}</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
        </div>
        <div :class="['p-3 rounded-xl', stat.bgColor]">
          <component :is="getIcon(stat.icon)" :class="['h-6 w-6', stat.iconColor]" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  AcademicCapIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'

interface StatItem {
  label: string
  value: string | number
  icon: any | string // 支持组件或字符串
  bgColor: string
  iconColor: string
}

interface Props {
  stats: StatItem[]
}

defineProps<Props>()

// 图标映射函数，支持字符串转组件
const getIcon = (icon: any) => {
  if (typeof icon === 'string') {
    const iconMap = {
      'AcademicCapIcon': AcademicCapIcon,
      'CheckCircleIcon': CheckCircleIcon,
      'ClockIcon': ClockIcon,
      'ExclamationTriangleIcon': ExclamationTriangleIcon,
      'ChartBarIcon': ChartBarIcon
    }
    return iconMap[icon] || AcademicCapIcon
  }
  return icon
}
</script>