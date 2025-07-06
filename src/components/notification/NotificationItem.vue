<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-show="true"
      :class="[
        'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700',
        typeClasses,
      ]"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <component :is="iconComponent" :class="['h-6 w-6', iconColorClass]" />
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p :class="['text-sm font-medium', titleColorClass]">
              {{ notification.title }}
            </p>
            <p v-if="notification.message" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ notification.message }}
            </p>
            <!-- 操作按钮 -->
            <div v-if="notification.actions && notification.actions.length > 0" class="mt-3">
              <div class="flex space-x-2">
                <button
                  v-for="action in notification.actions"
                  :key="action.label"
                  @click="action.action"
                  :class="[
                    'rounded-md px-2 py-1.5 text-xs font-medium transition-colors duration-200',
                    getActionButtonClass(action.style),
                  ]"
                >
                  {{ action.label }}
                </button>
              </div>
            </div>
          </div>
          <div v-if="notification.closable" class="ml-4 flex flex-shrink-0">
            <button
              @click="$emit('close')"
              class="inline-flex rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
            >
              <span class="sr-only">关闭</span>
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <!-- 进度条（如果有自动关闭时间） -->
      <div
        v-if="notification.duration && notification.duration > 0"
        class="h-1 bg-gray-200 dark:bg-gray-700"
      >
        <div
          :class="['h-full transition-all ease-linear', progressBarColorClass]"
          :style="{ width: progressWidth + '%' }"
        ></div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import type { Notification } from '@/types/notification'

interface Props {
  notification: Notification
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

// 进度条状态
const progressWidth = ref(100)
let progressInterval: number | null = null

// 图标映射
const iconMap = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
}

// 计算属性
const iconComponent = computed(() => iconMap[props.notification.type])

const typeClasses = computed(() => {
  const baseClasses = 'border-l-4'
  const typeSpecificClasses = {
    success: 'border-green-400',
    error: 'border-red-400',
    warning: 'border-yellow-400',
    info: 'border-blue-400',
  }
  return `${baseClasses} ${typeSpecificClasses[props.notification.type]}`
})

const iconColorClass = computed(() => {
  const colorClasses = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  }
  return colorClasses[props.notification.type]
})

const titleColorClass = computed(() => {
  return 'text-gray-900 dark:text-white'
})

const progressBarColorClass = computed(() => {
  const colorClasses = {
    success: 'bg-green-400',
    error: 'bg-red-400',
    warning: 'bg-yellow-400',
    info: 'bg-blue-400',
  }
  return colorClasses[props.notification.type]
})

// 操作按钮样式
const getActionButtonClass = (style?: string) => {
  const baseClass =
    'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800'

  switch (style) {
    case 'primary':
      return `${baseClass} bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500`
    case 'danger':
      return `${baseClass} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`
    case 'secondary':
    default:
      return `${baseClass} bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500`
  }
}

// 初始化进度条
onMounted(() => {
  if (props.notification.duration && props.notification.duration > 0) {
    const interval = 50 // 更新间隔（毫秒）
    const totalSteps = props.notification.duration / interval
    let currentStep = 0

    progressInterval = setInterval(() => {
      currentStep++
      progressWidth.value = Math.max(0, 100 - (currentStep / totalSteps) * 100)

      if (currentStep >= totalSteps) {
        if (progressInterval) {
          clearInterval(progressInterval)
          progressInterval = null
        }
      }
    }, interval)
  }
})

// 清理定时器
onUnmounted(() => {
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
})
</script>
