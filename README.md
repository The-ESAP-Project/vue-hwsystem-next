<div align="center">
  <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Vue作业系统" width="120" height="120">
  
  <center>
    <h1>作业管理系统 - 下一代</h1>
  </center>
  
  <p align="center">
    <strong>现代化的作业管理系统</strong><br>
    基于 Vue 3 + Nuxt 3 + TypeScript + Tailwind CSS 构建
  </p>

  <p align="center">
    <a href="#特性">特性</a> •
    <a href="#技术栈">技术栈</a> •
    <a href="#快速开始">快速开始</a> •
    <a href="#项目结构">项目结构</a> •
    <a href="#贡献">贡献</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Vue-3.4+-4FC08D?style=flat&logo=vue.js&logoColor=white" alt="Vue">
    <img src="https://img.shields.io/badge/Nuxt-3.13+-00DC82?style=flat&logo=nuxt.js&logoColor=white" alt="Nuxt">
    <img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=flat&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License">
  </p>
</div>

---

## ✨ 特性

<table>
  <tr>
    <td>🎯</td>
    <td><strong>多角色支持</strong><br>学生、教师、班级监督员的完整工作流</td>
  </tr>
  <tr>
    <td>🌙</td>
    <td><strong>深色模式</strong><br>支持亮色/深色主题，保护视力</td>
  </tr>
  <tr>
    <td>🌍</td>
    <td><strong>多语言支持</strong><br>中文、英文、日文国际化</td>
  </tr>
  <tr>
    <td>📱</td>
    <td><strong>响应式设计</strong><br>完美适配桌面端和移动端</td>
  </tr>
  <tr>
    <td>⚡</td>
    <td><strong>现代化技术栈</strong><br>Vue 3 + Nuxt 3 + TypeScript</td>
  </tr>
  <tr>
    <td>🎨</td>
    <td><strong>优雅 UI</strong><br>基于 Tailwind CSS + Headless UI</td>
  </tr>
</table>

## 🛠 技术栈

- **前端框架**: [Vue 3](https://vuejs.org/) + [Nuxt 3](https://nuxt.com/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **UI 组件**: [Headless UI](https://headlessui.com/)
- **图标**: [Heroicons](https://heroicons.com/)
- **国际化**: [@nuxtjs/i18n](https://i18n.nuxtjs.org/)
- **代码规范**: ESLint + Prettier

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- pnpm (推荐) / npm / yarn

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/The-ESAP-Project/vue-hwsystem-next.git
cd vue-hwsystem-next

# 安装依赖
pnpm install
```

### 开发服务器

```bash
# 启动开发服务器
pnpm dev

# 或使用 npm
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建项目

```bash
# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

## 📁 项目结构

```
vue-hwsystem-next/
├── 📁 assets/          # 静态资源
├── 📁 components/      # Vue 组件
│   ├── AuthHeader.vue  # 认证页面头部
│   ├── AuthFooter.vue  # 认证页面底部
│   ├── LanguageSwitcher.vue # 语言切换器
│   └── ThemeSwitcher.vue    # 主题切换器
├── 📁 composables/     # Vue 组合式函数
│   └── useTheme.ts     # 主题管理
├── 📁 layouts/         # 布局组件
│   ├── default.vue     # 默认布局
│   └── auth.vue        # 认证布局
├── 📁 locales/         # 国际化文件
├── 📁 pages/           # 页面路由
│   ├── index.vue       # 首页
│   └── auth/           # 认证相关页面
├── 📁 public/          # 公共文件
├── 📄 nuxt.config.ts   # Nuxt 配置
├── 📄 tailwind.config.js # Tailwind 配置
└── 📄 package.json     # 项目依赖
```

## 🔧 主要功能

### 🎯 角色管理
- **学生**: 查看和提交作业，跟踪学习进度
- **教师**: 创建作业，批改和评分
- **监督员**: 监控班级整体学习情况

### 🌙 主题系统
- 自动检测系统偏好
- 支持手动切换亮色/深色主题
- 主题状态持久化存储

### 🌍 国际化
- 完整的中文、英文、日文支持
- 自动检测浏览器语言
- 实时语言切换

## 🤝 贡献

我们欢迎所有形式的贡献！

1. **Fork** 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 **Pull Request**

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Nuxt](https://nuxt.com/) - Vue.js 全栈框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Headless UI](https://headlessui.com/) - 无样式可访问 UI 组件

---

<div align="center">
  <p>⭐ 如果这个项目对你有帮助，请给我们一个星标！</p>
  
  <p>
    <a href="https://github.com/The-ESAP-Project/vue-hwsystem-next">
      <img src="https://img.shields.io/github/stars/The-ESAP-Project/vue-hwsystem-next?style=social" alt="GitHub stars">
    </a>
  </p>
</div>
