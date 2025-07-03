<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 transition-all duration-200"
  >
    <div class="max-w-7xl mx-auto">
      <!-- 现代化头部区域 -->
      <div
        class="relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8 mb-8 transition-all duration-200"
      >
        <div class="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1
              class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent"
            >
              教师控制台
            </h1>
            <p class="mt-2 text-gray-600 dark:text-gray-300 text-lg">管理班级作业和学生进度</p>
          </div>

          <!-- 用户信息 -->
          <div class="flex items-center gap-4">
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900 dark:text-white">张老师</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">教师身份</p>
            </div>
            <div
              class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium"
            >
              师
            </div>
            <button
              @click="logout"
              class="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              退出
            </button>
          </div>
        </div>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100">班级学生</p>
                <p class="text-2xl font-bold">{{ stats.students }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-400/30 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100">布置作业</p>
                <p class="text-2xl font-bold">{{ stats.assignments }}</p>
              </div>
              <div class="w-12 h-12 bg-green-400/30 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-100">待批改</p>
                <p class="text-2xl font-bold">{{ stats.pending }}</p>
              </div>
              <div class="w-12 h-12 bg-purple-400/30 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-orange-100">平均分</p>
                <p class="text-2xl font-bold">{{ stats.averageScore }}</p>
              </div>
              <div class="w-12 h-12 bg-orange-400/30 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 功能区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 快速操作 -->
        <div
          class="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6"
        >
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">快速操作</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              class="flex items-center gap-3 p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200 text-left"
            >
              <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div>
                <p class="font-semibold text-gray-900 dark:text-white">布置新作业</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">创建作业任务</p>
              </div>
            </button>

            <button
              class="flex items-center gap-3 p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200 text-left"
            >
              <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <p class="font-semibold text-gray-900 dark:text-white">批改作业</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">查看学生提交</p>
              </div>
            </button>

            <button
              class="flex items-center gap-3 p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200 text-left"
            >
              <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <p class="font-semibold text-gray-900 dark:text-white">成绩统计</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">查看班级表现</p>
              </div>
            </button>

            <button
              class="flex items-center gap-3 p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors duration-200 text-left"
            >
              <div class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <div>
                <p class="font-semibold text-gray-900 dark:text-white">学生管理</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">管理班级学生</p>
              </div>
            </button>
          </div>
        </div>

        <!-- 最近活动 -->
        <div
          class="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6"
        >
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">最近活动</h3>
          <div class="space-y-4">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
            >
              <div
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium',
                  activity.bgColor,
                ]"
              >
                {{ activity.avatar }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ activity.title }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 统计数据
const stats = ref({
  students: 35,
  assignments: 8,
  pending: 12,
  averageScore: 85,
})

// 最近活动
const recentActivities = ref([
  {
    id: 1,
    title: '小明提交了数学作业',
    time: '5分钟前',
    avatar: '明',
    bgColor: 'bg-blue-500',
  },
  {
    id: 2,
    title: '小红提交了英语作业',
    time: '10分钟前',
    avatar: '红',
    bgColor: 'bg-green-500',
  },
  {
    id: 3,
    title: '小李提交了物理作业',
    time: '15分钟前',
    avatar: '李',
    bgColor: 'bg-purple-500',
  },
  {
    id: 4,
    title: '小王提交了化学作业',
    time: '20分钟前',
    avatar: '王',
    bgColor: 'bg-orange-500',
  },
])

// 退出登录
const logout = () => {
  router.push('/')
}
</script>
