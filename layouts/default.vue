<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <!-- Header -->
    <AppHeader class="flex-none" />
    
    <!-- Main Content -->
    <div class="flex-1 overflow-auto">
      <div class="min-h-full flex flex-col">
        <!-- Page Content -->
        <div class="flex-1">
          <NuxtPage />
        </div>
        
        <!-- Footer -->
        <AppFooter class="flex-none" />
      </div>
    </div>
  </div>
</template>

