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
              class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent"
            >
              课代表控制台
            </h1>
            <p class="mt-2 text-gray-600 dark:text-gray-300 text-lg">监督班级进度，协助管理</p>
          </div>

          <!-- 用户信息 -->
          <div class="flex items-center gap-4">
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900 dark:text-white">课代表</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">班级管理员</p>
            </div>
            <div
              class="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium"
            >
              管
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
                <p class="text-blue-100">班级人数</p>
                <p class="text-2xl font-bold">{{ stats.totalStudents }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-400/30 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100">已提交</p>
                <p class="text-2xl font-bold">{{ stats.submitted }}</p>
              </div>
              <div class="w-12 h-12 bg-green-400/30 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-orange-100">未提交</p>
                <p class="text-2xl font-bold">{{ stats.notSubmitted }}</p>
              </div>
              <div class="w-12 h-12 bg-orange-400/30 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-red-100">提交率</p>
                <p class="text-2xl font-bold">
                  {{ Math.round((stats.submitted / stats.totalStudents) * 100) }}%
                </p>
              </div>
              <div class="w-12 h-12 bg-red-400/30 rounded-lg flex items-center justify-center">
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

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 未提交学生列表 -->
        <div
          class="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
        >
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">未提交学生</h3>
              <span
                class="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full text-xs font-medium"
              >
                {{ notSubmittedStudents.length }} 人
              </span>
            </div>
          </div>
          <div class="max-h-96 overflow-y-auto">
            <div class="divide-y divide-gray-100 dark:divide-gray-700">
              <div
                v-for="student in notSubmittedStudents"
                :key="student.id"
                class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div
                      :class="[
                        'w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium',
                        student.bgColor,
                      ]"
                    >
                      {{ student.avatar }}
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ student.name }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        学号：{{ student.studentId }}
                      </p>
                    </div>
                  </div>
                  <button
                    @click="remindStudent(student)"
                    class="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-full text-xs font-medium hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors duration-200"
                  >
                    提醒
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 快速操作 -->
        <div
          class="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6"
        >
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">快速操作</h3>
          <div class="space-y-4">
            <button
              class="w-full flex items-center gap-3 p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200 text-left"
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
                    d="M15 17h5l-5 5v-5zM11 19H6a2 2 0 01-2-2V7a2 2 0 012-2h6m5 2v6M9 9h6m-6 4h6m-6 4h3"
                  />
                </svg>
              </div>
              <div>
                <p class="font-semibold text-gray-900 dark:text-white">群发提醒</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">提醒所有未提交学生</p>
              </div>
            </button>

            <button
              class="w-full flex items-center gap-3 p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200 text-left"
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <p class="font-semibold text-gray-900 dark:text-white">统计报告</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">生成班级进度报告</p>
              </div>
            </button>

            <button
              class="w-full flex items-center gap-3 p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200 text-left"
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p class="font-semibold text-gray-900 dark:text-white">学生管理</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">查看学生详细信息</p>
              </div>
            </button>
          </div>

          <!-- 提醒历史 -->
          <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">最近提醒</h4>
            <div class="space-y-2">
              <div
                v-for="reminder in recentReminders"
                :key="reminder.id"
                class="flex items-center justify-between text-xs"
              >
                <span class="text-gray-600 dark:text-gray-400">提醒了 {{ reminder.student }}</span>
                <span class="text-gray-500 dark:text-gray-500">{{ reminder.time }}</span>
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
  totalStudents: 35,
  submitted: 28,
  notSubmitted: 7,
})

// 未提交学生列表
const notSubmittedStudents = ref([
  {
    id: 1,
    name: '张小明',
    studentId: '20240001',
    avatar: '张',
    bgColor: 'bg-red-500',
  },
  {
    id: 2,
    name: '李小红',
    studentId: '20240002',
    avatar: '李',
    bgColor: 'bg-orange-500',
  },
  {
    id: 3,
    name: '王小刚',
    studentId: '20240003',
    avatar: '王',
    bgColor: 'bg-yellow-500',
  },
  {
    id: 4,
    name: '赵小华',
    studentId: '20240004',
    avatar: '赵',
    bgColor: 'bg-green-500',
  },
  {
    id: 5,
    name: '刘小丽',
    studentId: '20240005',
    avatar: '刘',
    bgColor: 'bg-blue-500',
  },
  {
    id: 6,
    name: '陈小军',
    studentId: '20240006',
    avatar: '陈',
    bgColor: 'bg-indigo-500',
  },
  {
    id: 7,
    name: '杨小敏',
    studentId: '20240007',
    avatar: '杨',
    bgColor: 'bg-purple-500',
  },
])

// 最近提醒记录
const recentReminders = ref([
  {
    id: 1,
    student: '张小明',
    time: '10分钟前',
  },
  {
    id: 2,
    student: '李小红',
    time: '1小时前',
  },
  {
    id: 3,
    student: '王小刚',
    time: '2小时前',
  },
])

// 提醒学生
const remindStudent = (student: any) => {
  console.log('提醒学生:', student.name)
  // 这里可以实现具体的提醒逻辑
  alert(`已提醒 ${student.name} 尽快提交作业`)
}

// 退出登录
const logout = () => {
  router.push('/')
}
</script>
