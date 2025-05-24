# 🎓 作业管理系统前端 - 现代化教育平台

> 基于 Nuxt 3 + TypeScript 构建的现代化作业管理系统前端应用

[![Nuxt](https://img.shields.io/badge/nuxt-3.x-00DC82.svg)](https://nuxt.com/)
[![TypeScript](https://img.shields.io/badge/typescript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/vite-5.x-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/tailwind-4.x-06B6D4.svg)](https://tailwindcss.com/)
[![Tailwind UI](https://img.shields.io/badge/tailwind_ui-components-0EA5E9.svg)](https://tailwindui.com/)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## ✨ 产品特色

- 🎨 **现代化 UI** - 基于 Material Design 3.0 设计语言
- 📱 **响应式设计** - 完美适配桌面端、平板和移动设备
- ⚡ **极速体验** - Nuxt 3 + Vite 构建，毫秒级热更新
- 🎯 **角色导向** - 为学生、课代表、教师定制专属界面
- 🚀 **SSR/SSG** - 服务端渲染和静态生成，SEO 友好
- 🔄 **实时更新** - WebSocket 实时消息推送
- 🎪 **丰富交互** - 拖拽上传、进度条、动画过渡
- 🌙 **深色模式** - 支持亮色/暗色主题切换
- ♿ **无障碍友好** - 遵循 WCAG 2.1 AA 标准

## 🛠 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| 🟢 **Nuxt 3** | 3.x | 全栈 Vue.js 框架 |
| 🔷 **TypeScript** | 5.x | 类型安全的 JavaScript |
| ⚡ **Vite** | 5.x | 现代化构建工具 |
| 🎨 **Tailwind CSS** | 3.x | 原子化 CSS 框架 |
| 💎 **Tailwind UI** | - | 专业级 UI 组件库 |
| 🌟 **Vue 3** | 3.x | 渐进式 JavaScript 框架 |
| 🧭 **Vue Router** | 4.x | Vue.js 官方路由 |
| 📡 **Nuxt/HTTP** | - | HTTP 客户端模块 |
| 🏪 **Pinia** | 2.x | Vue 状态管理 |
| 🎭 **VueUse** | 10.x | Vue Composition 工具集 |
| 📊 **Chart.js** | 4.x | 数据可视化图表 |

## 📱 功能模块

### 🎓 学生端功能
- 📚 **作业中心** - 查看待完成和已提交的作业
- 📤 **智能提交** - 支持多种文件格式，拖拽上传
- 📊 **成绩查看** - 个人成绩统计和历史记录
- 🔔 **消息通知** - 作业通知、成绩发布提醒
- 👤 **个人中心** - 个人信息管理和设置

### 👑 课代表端功能
- 📋 **班级概览** - 作业提交情况统计面板
- 📈 **数据分析** - 可视化图表展示班级数据
- 📢 **催交管理** - 一键催交未提交作业的同学
- 📊 **进度监控** - 实时监控班级作业完成进度
- 💬 **班级通讯** - 班级群组消息和公告

### 👨‍🏫 教师端功能
- 🏗️ **作业管理** - 创建、编辑、发布作业
- ✅ **批改中心** - 在线批改，支持语音、文字评语
- 👥 **学生管理** - 学生信息管理和班级管理
- 📊 **数据报表** - 多维度数据分析和导出
- ⚙️ **系统设置** - 用户权限和系统配置管理

## 🚀 快速开始

### 📋 环境要求

```bash
# Node.js 版本
node --version  # >= 18.0.0
yarn --version  # >= 1.22.0

# 推荐使用 Yarn Berry (>= 3.0.0)
yarn --version  # >= 3.0.0
```

### ⚙️ 安装配置

1. **克隆项目**
```bash
git clone https://github.com/The-ESAP-Project/hwsystem-frontend.git
cd hwsystem-frontend
```

2. **安装依赖**
```bash
# 使用 Yarn 安装依赖
yarn install

# 或使用 Yarn Berry
yarn
```

3. **环境配置**
```bash
# 复制环境变量文件
cp .env.example .env

# 编辑环境变量
# NUXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
# NUXT_PUBLIC_WS_URL=ws://localhost:8080/ws
# NUXT_SECRET_KEY=your-secret-key
```

### 🏃‍♂️ 开发运行

```bash
# 启动开发服务器
yarn dev

# 类型检查
yarn type-check

# 代码检查
yarn lint

# 格式化代码
yarn format

# 运行测试
yarn test

# 测试覆盖率
yarn test:coverage

# 预览 SSR 模式
yarn preview
```

访问 `http://localhost:3000` 查看应用

### 🏗️ 构建部署

```bash
# 构建生产版本
yarn build

# 预览构建结果
yarn preview

# 生成静态站点
yarn generate

# 分析构建产物
yarn analyze
```

## 📂 项目结构

```
├── 📁 components/          # Vue 组件
│   ├── ui/                # Tailwind UI 基础组件
│   ├── forms/             # 表单组件
│   └── layout/            # 布局组件
├── 📁 pages/              # 页面组件（自动路由）
│   ├── auth/              # 认证相关页面
│   ├── student/           # 学生端页面
│   ├── monitor/           # 课代表端页面
│   └── teacher/           # 教师端页面
├── 📁 layouts/            # Nuxt 布局
├── 📁 middleware/         # 路由中间件
├── 📁 plugins/            # Nuxt 插件
├── 📁 composables/        # Vue Composables
├── 📁 stores/             # Pinia 状态管理
├── 📁 utils/              # 工具函数
├── 📁 types/              # TypeScript 类型定义
├── 📁 assets/             # 样式和静态资源
├── 📁 public/             # 公共静态文件
├── 📁 server/             # 服务端 API（可选）
└── nuxt.config.ts         # Nuxt 配置文件
```

## 🎨 设计系统

### 🎨 颜色主题

```css
/* 主色调 */
--primary: #3b82f6;      /* 蓝色 - 主要操作 */
--secondary: #f59e0b;    /* 橙色 - 次要信息 */
--success: #10b981;      /* 绿色 - 成功状态 */
--warning: #f59e0b;      /* 黄色 - 警告信息 */
--error: #ef4444;        /* 红色 - 错误状态 */

/* 中性色 */
--gray-50: #f9fafb;
--gray-900: #111827;
```

### 📏 间距规范

```css
/* Tailwind CSS 间距系统 */
space-1: 0.25rem;  /* 4px */
space-2: 0.5rem;   /* 8px */
space-4: 1rem;     /* 16px */
space-6: 1.5rem;   /* 24px */
space-8: 2rem;     /* 32px */
```

### 🔤 字体系统

```css
/* 字体大小 */
text-xs: 0.75rem;    /* 12px */
text-sm: 0.875rem;   /* 14px */
text-base: 1rem;     /* 16px */
text-lg: 1.125rem;   /* 18px */
text-xl: 1.25rem;    /* 20px */
text-2xl: 1.5rem;    /* 24px */
```

## 🔧 开发指南

### 📝 代码规范

```vue
<!-- 组件命名：PascalCase -->
<template>
  <div class="student-dashboard">
    <!-- Tailwind UI 组件使用 -->
    <HeadlessDisclosure v-slot="{ open }">
      <!-- ... -->
    </HeadlessDisclosure>
  </div>
</template>

<script setup lang="ts">
// 接口命名：PascalCase + I 前缀
interface IUser {
  id: string;
  name: string;
}

// 类型命名：PascalCase + T 前缀
type TUserRole = 'student' | 'monitor' | 'teacher';

// 枚举命名：PascalCase + E 前缀
enum ESubmissionStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  GRADED = 'graded'
}

// Composables 使用
const { data: user } = await useFetch('/api/user');
const router = useRouter();
</script>
```

### 🎣 Composables

```typescript
// composables/useHomework.ts
export const useHomework = (id: string) => {
  return useFetch(`/api/homework/${id}`, {
    key: `homework-${id}`,
    server: true,
    default: () => null,
  });
};

// composables/useAuth.ts
export const useAuth = () => {
  const { user, login, logout } = useAuthStore();
  
  const isAuthenticated = computed(() => !!user.value);
  
  return {
    user: readonly(user),
    isAuthenticated,
    login,
    logout,
  };
};
```

### 🏪 状态管理 (Pinia)

```typescript
// stores/auth.ts
export const useAuthStore = defineStore('auth', () => {
  const user = ref<IUser | null>(null);
  const token = ref<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    const { data } = await $fetch('/api/auth/login', {
      method: 'POST',
      body: credentials,
    });
    
    user.value = data.user;
    token.value = data.token;
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    navigateTo('/auth/login');
  };

  return {
    user: readonly(user),
    token: readonly(token),
    login,
    logout,
  };
});
```

## 🧪 测试策略

### 单元测试
```typescript
// components/__tests__/Button.nuxt.test.ts
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { Button } from '../Button.vue';

describe('Button Component', () => {
  test('renders button with text', async () => {
    const component = await mountSuspended(Button, {
      props: { text: 'Click me' }
    });
    expect(component.text()).toBe('Click me');
  });
});
```

### 集成测试
```typescript
// pages/__tests__/StudentDashboard.nuxt.test.ts
import { mountSuspended } from '@nuxt/test-utils/runtime';
import StudentDashboard from '../student/index.vue';

describe('Student Dashboard', () => {
  test('displays homework list', async () => {
    const page = await mountSuspended(StudentDashboard);
    // 测试逻辑
  });
});
```

## 📱 响应式设计

```typescript
// 断点系统 (Tailwind CSS)
const breakpoints = {
  sm: '640px',   // 手机横屏
  md: '768px',   // 平板
  lg: '1024px',  // 笔记本
  xl: '1280px',  // 桌面
  '2xl': '1536px' // 大屏幕
};

// 使用示例
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    <!-- 响应式网格布局 -->
  </div>
</template>
```

## 🚀 性能优化

### 代码分割
```typescript
// pages/student/dashboard.vue - 自动代码分割
<template>
  <div>
    <!-- 懒加载组件 -->
    <LazyHeavyChart v-if="showChart" />
  </div>
</template>

<script setup lang="ts">
// 动态导入
const { data: chartData } = await useLazyFetch('/api/chart-data');
</script>
```

### 缓存策略
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      // 首页预渲染
      '/': { prerender: true },
      // 静态页面长期缓存
      '/about': { headers: { 'cache-control': 's-maxage=31536000' } },
      // API 路由短期缓存
      '/api/**': { headers: { 'cache-control': 's-maxage=60' } },
    }
  }
});
```

## 🐳 Docker 部署

```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/.output ./

EXPOSE 3000
CMD ["node", "server/index.mjs"]
```

```bash
# 构建和运行
docker build -t hwsystem-frontend .
docker run -p 3000:3000 hwsystem-frontend
```

## 🤝 贡献指南

### Git 工作流

```bash
# 1. 创建功能分支
git checkout -b feature/student-dashboard

# 2. 提交代码
git add .
git commit -m "feat: 添加学生端仪表板页面"

# 3. 推送分支
git push origin feature/student-dashboard

# 4. 创建 Pull Request
```

### 提交信息规范

| 类型 | 描述 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档更新 |
| `style` | 代码格式（不影响功能） |
| `refactor` | 重构（不是新功能或修复） |
| `test` | 添加测试 |
| `chore` | 构建过程或辅助工具变动 |

## 📊 性能指标

| 指标 | 目标值 | 当前值 |
|------|--------|--------|
| 🚀 **首屏加载 (SSR)** | < 1.5s | 1.2s |
| 🎯 **FCP** | < 1.0s | 0.8s |
| ⚡ **LCP** | < 2.0s | 1.6s |
| 🎪 **CLS** | < 0.1 | 0.03 |
| 📦 **Bundle Size** | < 300KB | 240KB |
| 🔄 **TTI** | < 2.5s | 2.1s |

## 🌐 浏览器支持

| 浏览器 | 版本 |
|--------|------|
| Chrome | >= 90 |
| Firefox | >= 88 |
| Safari | >= 14 |
| Edge | >= 90 |
| 移动端 | iOS 14+, Android 10+ |

## 📄 许可证

本项目采用 [GPL-3.0](LICENSE) 许可证开源。

## 👥 团队

**The ESAP Project Frontend Team**
- 🔗 GitHub: [@The-ESAP-Project](https://github.com/The-ESAP-Project)
- 📧 Email: frontend@esap-project.org
- 🌐 项目主页: [https://github.com/The-ESAP-Project/hwsystem-frontend](https://github.com/The-ESAP-Project/hwsystem-frontend)

## 🔗 相关链接

- 📚 [后端项目](https://github.com/The-ESAP-Project/rust-hwsystem-next)
- 📖 [API 文档](https://api-docs.esap-project.org)
- 🎨 [设计规范](https://design.esap-project.org)
- 📱 [移动端 App](https://github.com/The-ESAP-Project/hwsystem-mobile)

---

<div align="center">

**感谢使用作业管理系统！如果对你有帮助，请给我们一个 ⭐️ Star！**

[🐛 报告 Bug](https://github.com/The-ESAP-Project/hwsystem-frontend/issues) · 
[💡 功能建议](https://github.com/The-ESAP-Project/hwsystem-frontend/issues) · 
[💬 讨论交流](https://github.com/The-ESAP-Project/hwsystem-frontend/discussions)

</div>
