<template>
  <div class="relative mt-6 sm:mt-8">
    <!-- 移动端滑动容器 -->
    <div 
      v-if="isMobile && stats.length > 2"
      class="flex gap-4 overflow-x-auto pb-4 px-1 -mx-1 scrollbar-hide"
      @scroll="handleScroll"
      ref="scrollContainer"
    >
      <div 
        v-for="stat in stats" 
        :key="stat.label"
        class="flex-shrink-0 w-40 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-600/50 transition-all duration-200 hover:scale-105 hover:shadow-lg touch-manipulation"
        @click="handleStatClick(stat)"
      >
        <div class="flex flex-col items-center text-center">
          <div :class="['p-3 rounded-xl mb-3', stat.bgColor]">
            <component :is="stat.icon" :class="['h-6 w-6', stat.iconColor]" />
          </div>
          <p class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{{ stat.label }}</p>
          <p class="text-lg font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <!-- 桌面端网格布局 -->
    <div 
      v-else
      class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
    >
      <div 
        v-for="stat in stats" 
        :key="stat.label"
        class="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-gray-200/50 dark:border-gray-600/50 transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer touch-manipulation"
        @click="handleStatClick(stat)"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{{ stat.label }}</p>
            <p class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stat.value }}</p>
          </div>
          <div :class="['p-2 sm:p-3 rounded-xl flex-shrink-0 ml-2', stat.bgColor]">
            <component :is="stat.icon" :class="['h-5 w-5 sm:h-6 sm:w-6', stat.iconColor]" />
          </div>
        </div>
      </div>
    </div>

    <!-- 移动端滚动指示器 -->
    <div 
      v-if="isMobile && stats.length > 2 && showScrollIndicator" 
      class="flex justify-center mt-3 gap-1"
    >
      <div 
        v-for="(_, index) in Math.ceil(stats.length / 2)" 
        :key="index"
        :class="[
          'w-2 h-2 rounded-full transition-all duration-200',
          currentScrollIndex === index 
            ? 'bg-indigo-500' 
            : 'bg-gray-300 dark:bg-gray-600'
        ]"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface StatItem {
  label: string
  value: string | number
  icon: any
  bgColor: string
  iconColor: string
}

interface Props {
  stats: StatItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  statClick: [stat: StatItem]
}>()

// 响应式数据
const isMobile = ref(false)
const showScrollIndicator = ref(true)
const currentScrollIndex = ref(0)
const scrollContainer = ref<HTMLElement>()

// 检测移动设备
onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 640
  }
  
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
  })
})

// 处理统计卡片点击
const handleStatClick = (stat: StatItem) => {
  emit('statClick', stat)
}

// 处理滚动
const handleScroll = (event: Event) => {
  if (!scrollContainer.value) return
  
  const container = event.target as HTMLElement
  const scrollLeft = container.scrollLeft
  const itemWidth = 160 + 16 // 卡片宽度 + gap
  const index = Math.round(scrollLeft / itemWidth / 2)
  
  currentScrollIndex.value = Math.max(0, Math.min(index, Math.ceil(props.stats.length / 2) - 1))
}

// 监听统计数据变化，重置滚动位置
watch(() => props.stats, () => {
  currentScrollIndex.value = 0
  if (scrollContainer.value) {
    scrollContainer.value.scrollLeft = 0
  }
})
</script>

<style scoped>
.touch-manipulation {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* 隐藏滚动条但保持滚动功能 */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* 移动端卡片动画优化 */
@media (max-width: 640px) {
  .touch-manipulation:active {
    transform: scale(0.98);
  }
}

/* 平板端优化 */
@media (min-width: 640px) and (max-width: 1024px) {
  .grid {
    gap: 1rem;
  }
}

/* 大屏优化 */
@media (min-width: 1024px) {
  .hover\:scale-105:hover {
    transform: scale(1.05);
  }
  
  .hover\:shadow-lg:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
}

/* 滚动容器样式 */
@media (max-width: 640px) {
  .flex.overflow-x-auto {
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
  }
  
  .flex.overflow-x-auto > div {
    scroll-snap-align: start;
  }
}
</style>
