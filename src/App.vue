<script setup lang="ts">
import { RouterView } from 'vue-router'
import NotificationContainer from './components/notification/NotificationContainer.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <main class="flex-1">
      <RouterView />
    </main>
    <!-- 通知容器 -->
    <NotificationContainer />
  </div>
</template>
