<template>
  <!-- 通知容器 -->
  <Teleport to="body">
    <div
      v-if="notifications.length > 0"
      aria-live="assertive"
      class="pointer-events-none fixed top-16 left-0 right-0 bottom-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-40"
    >
      <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
        <TransitionGroup
          enter-active-class="transform ease-out duration-300 transition"
          enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
          leave-active-class="transition ease-in duration-100"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <NotificationItem
            v-for="notification in notifications"
            :key="notification.id"
            :notification="notification"
            @close="removeNotification(notification.id)"
          />
        </TransitionGroup>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useNotification } from '@/composables/useNotification'
import NotificationItem from '@/components/notification/NotificationItem.vue'

const { notifications, removeNotification } = useNotification()
</script>
