<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col">
    <!-- Header -->
    <AppHeader />

    <!-- Main Content - 移动端优化 -->
    <main class="flex-1 overflow-auto">
      <div class="min-h-full">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup>
// 确保在布局中初始化认证状态
const { initAuth, isAuthenticated, user } = useAuth()

// 在客户端初始化认证，增加错误处理
onMounted(async () => {
  try {
    await initAuth()
    console.log('App layout - auth initialized, authenticated:', isAuthenticated.value)
  } catch (error) {
    console.error('App layout - auth initialization failed:', error)
  }
})
</script>

<style scoped>
/* 确保在移动端正确处理视口高度 */
@media (max-width: 768px) {
  .min-h-screen {
    min-height: 100vh;
    min-height: -webkit-fill-available;
  }
}

/* 支持安全区域（iPhone X 等设备的刘海屏） */
@supports (padding: max(0px)) {
  .min-h-screen {
    padding-left: max(0px, env(safe-area-inset-left));
    padding-right: max(0px, env(safe-area-inset-right));
  }
}
</style>
