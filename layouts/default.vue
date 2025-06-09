<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <!-- Header -->
    <AppHeader class="flex-none" />
    
    <!-- Main Content -->
    <div class="flex-1 overflow-auto">
      <NuxtPage />
    </div>

    <!-- Footer -->
    <AppFooter class="flex-none" />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
</script>
