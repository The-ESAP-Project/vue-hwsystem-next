<div align="center">
  <img src="https://vuejs.org/logo.svg" alt="Vue作业系统" width="120" height="120">
  
  <h1>作业管理系统 - 下一代</h1>
  
  <p align="center">
    <strong>现代化的教学作业管理平台</strong><br>
    基于 Vue 3 + TypeScript + Vite + Tailwind CSS 构建
  </p>

  <p align="center">
    <a href="#特性">特性</a> •
    <a href="#技术栈">技术栈</a> •
    <a href="#快速开始">快速开始</a> •
    <a href="#项目结构">项目结构</a> •
    <a href="#api文档">API文档</a> •
    <a href="#贡献">贡献</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Vue-3.5+-4FC08D?style=flat&logo=vue.js&logoColor=white" alt="Vue">
    <img src="https://img.shields.io/badge/TypeScript-5.8+-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Vite-7.0+-646CFF?style=flat&logo=vite&logoColor=white" alt="Vite">
    <img src="https://img.shields.io/badge/Tailwind_CSS-4.1+-38B2AC?style=flat&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/Pinia-3.0+-FFD43B?style=flat&logo=pinia&logoColor=black" alt="Pinia">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License">
  </p>
</div>

---

## ✨ 特性

<table>
  <tr>
    <td>🎯</td>
    <td><strong>多角色支持</strong><br>学生、教师、课代表的完整工作流程</td>
  </tr>
  <tr>
    <td>🌙</td>
    <td><strong>深色模式</strong><br>支持浅色/深色/跟随系统三种主题模式</td>
  </tr>
  <tr>
    <td>📱</td>
    <td><strong>响应式设计</strong><br>完美适配桌面端和移动端设备</td>
  </tr>
  <tr>
    <td>⚡</td>
    <td><strong>现代化技术栈</strong><br>Vue 3 + Composition API + TypeScript</td>
  </tr>
  <tr>
    <td>🎨</td>
    <td><strong>优雅 UI</strong><br>基于 Tailwind CSS 的现代化界面</td>
  </tr>
  <tr>
    <td>🔒</td>
    <td><strong>JWT 认证</strong><br>安全的用户认证和权限管理</td>
  </tr>
  <tr>
    <td>📊</td>
    <td><strong>数据可视化</strong><br>直观的统计图表和进度展示</td>
  </tr>
  <tr>
    <td>📁</td>
    <td><strong>文件管理</strong><br>支持作业附件上传和下载</td>
  </tr>
</table>

## 🛠 技术栈

### 前端框架
- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vite** - 下一代前端构建工具
- **Vue Router** - Vue.js 官方路由管理器
- **Pinia** - Vue.js 状态管理库

### UI 与样式
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Heroicons** - 精美的 SVG 图标库
- **现代响应式设计** - 移动端优先的设计理念

### 开发工具
- **ESLint** - 代码质量检查工具
- **Prettier** - 代码格式化工具
- **Oxlint** - 高性能的 JavaScript linter
- **Yarn 4** - 现代化的包管理器

### HTTP 客户端
- **Axios** - 基于 Promise 的 HTTP 客户端
- **完整的错误处理** - 统一的 API 错误处理机制
- **Token 自动刷新** - JWT token 自动更新

## 🚀 快速开始

### 环境要求

- Node.js 22+ 
- Yarn 4 (推荐) / npm / pnpm

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/The-ESAP-Project/vue-hwsystem-next.git
cd vue-hwsystem-next

# 安装依赖
yarn install
```

### 开发服务器

```bash
# 启动开发服务器
yarn dev

# 或使用 npm
npm run dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看应用。

### 构建项目

```bash
# 构建生产版本
yarn build

# 预览生产构建
yarn preview

# 类型检查
yarn type-check

# 代码规范检查
yarn lint
```

## 📁 项目结构

```
vue-hwsystem-next/
├── 📁 public/              # 静态资源
├── 📁 src/
│   ├── 📁 assets/          # 项目资源文件
│   ├── 📁 components/      # Vue 组件
│   │   ├── AppHeader.vue   # 应用头部导航
│   │   └── AppFooter.vue   # 应用底部
│   ├── 📁 composables/     # Vue 组合式函数
│   │   └── useDarkMode.ts  # 深色模式管理
│   ├── 📁 router/          # 路由配置
│   │   └── index.ts        # 路由定义
│   ├── 📁 services/        # API 服务层
│   │   ├── api.ts          # API 基础配置
│   │   ├── auth.ts         # 认证服务
│   │   ├── homework.ts     # 作业管理服务
│   │   ├── submission.ts   # 作业提交服务
│   │   ├── user.ts         # 用户管理服务
│   │   ├── file.ts         # 文件管理服务
│   │   ├── system.ts       # 系统管理服务
│   │   └── index.ts        # 服务统一导出
│   ├── 📁 stores/          # Pinia 状态管理
│   │   └── user.ts         # 用户状态管理
│   ├── 📁 types/           # TypeScript 类型定义
│   │   ├── api.ts          # API 响应类型
│   │   ├── auth.ts         # 认证相关类型
│   │   ├── homework.ts     # 作业相关类型
│   │   ├── user.ts         # 用户相关类型
│   │   └── ...            # 其他类型定义
│   ├── 📁 utils/           # 工具函数
│   │   └── error.ts        # 错误处理工具
│   ├── 📁 views/           # 页面组件
│   │   ├── HomeView.vue    # 首页
│   │   ├── 📁 auth/        # 认证页面
│   │   ├── 📁 student/     # 学生页面
│   │   ├── 📁 teacher/     # 教师页面
│   │   └── 📁 monitor/     # 课代表页面
│   ├── App.vue             # 根组件
│   └── main.ts             # 应用入口
├── 📄 api.md               # API 文档
├── 📄 vite.config.ts       # Vite 配置
├── 📄 tailwind.config.js   # Tailwind 配置
├── 📄 tsconfig.json        # TypeScript 配置
└── 📄 package.json         # 项目依赖
```

## 🔧 主要功能

### 🎯 用户角色管理

#### 学生 (Student)
- 📚 查看和提交作业
- 📊 跟踪学习进度和成绩
- 📋 管理个人资料
- 🔔 接收作业通知和提醒

#### 教师 (Teacher)
- 📝 创建和管理作业
- ✅ 批改作业和评分
- 👥 管理班级学生
- 📈 查看统计数据和分析报告

#### 课代表 (Monitor)
- 👀 监督班级作业提交情况
- 📢 发送提醒通知给同学
- 📊 查看班级整体进度
- 🤝 协助老师进行班级管理

### 🌙 主题系统
- **浅色模式**: 经典的明亮界面
- **深色模式**: 护眼的深色主题
- **跟随系统**: 自动匹配系统主题偏好
- **主题持久化**: 记住用户的主题选择

### 🔐 认证与安全
- JWT Token 认证机制
- 自动 Token 刷新
- 权限控制和路由守卫
- 安全的密码处理

### 📊 作业管理
- 创建和编辑作业
- 设置截止时间和评分标准
- 支持附件上传
- 批量导出作业统计

### 📁 文件管理
- 安全的文件上传
- 多格式文件支持
- 文件大小和类型限制
- 便捷的文件下载

## 📖 API 文档

本项目包含完整的后端 API 文档，详细说明了所有接口的使用方法：

- 📄 [API 文档](./api.md) - 完整的 RESTful API 文档
- 🔗 **Base URL**: `http://localhost:8080/api/v1`
- 🔑 **认证方式**: JWT Bearer Token
- 📦 **数据格式**: JSON

### 主要 API 模块

- **认证管理** - 用户登录、token 刷新、用户信息获取
- **作业管理** - 作业的增删改查、状态管理
- **提交管理** - 作业提交、批改、统计导出
- **用户管理** - 用户信息管理、权限控制
- **文件管理** - 文件上传下载、类型验证
- **系统管理** - 系统设置、操作日志

## 🌐 环境配置

### 环境变量

创建 `.env` 文件配置环境变量：

```env
# API 配置
VITE_API_BASE_URL=http://localhost:8080/api/v1

# 应用配置
VITE_APP_TITLE=作业管理系统
VITE_APP_VERSION=1.0.0

# 开发配置
VITE_DEV_PORT=5173
```

### 开发环境要求

- **Node.js**: 22.x 或更高版本
- **Yarn**: 4.x 版本
- **编辑器**: 推荐使用 VSCode
- **浏览器**: 支持 ES2020+ 的现代浏览器

## 🧪 测试

```bash
# 运行单元测试
yarn test:unit

# 运行端到端测试
yarn test:e2e

# 测试覆盖率
yarn test:coverage
```

## 📦 部署

### 构建优化

项目已配置了生产环境优化：

- 代码分割和懒加载
- 静态资源压缩
- Tree-shaking 优化
- 现代浏览器构建

### 部署方式

1. **静态部署** (推荐)
   ```bash
   yarn build
   # 将 dist 目录部署到静态服务器
   ```

2. **Docker 部署**
   ```bash
   docker build -t vue-hwsystem-next .
   docker run -p 80:80 vue-hwsystem-next
   ```

3. **Nginx 配置**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           root /var/www/vue-hwsystem-next;
           try_files $uri $uri/ /index.html;
       }
   }
   ```

## 🤝 贡献指南

我们欢迎所有形式的贡献！请遵循以下步骤：

### 贡献流程

1. **Fork** 项目到你的 GitHub 账户
2. **Clone** 你的 Fork 到本地
3. **创建分支** (`git checkout -b feature/amazing-feature`)
4. **提交更改** (`git commit -m 'feat: add amazing feature'`)
5. **推送分支** (`git push origin feature/amazing-feature`)
6. **创建 Pull Request**

### 代码规范

- 遵循 ESLint 和 Prettier 配置
- 使用 TypeScript 编写类型安全的代码
- 编写清晰的提交信息
- 为新功能添加适当的测试

### 提交信息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
feat: 添加用户认证功能
fix: 修复作业提交问题
docs: 更新 API 文档
style: 优化代码格式
refactor: 重构用户服务层
test: 添加单元测试
chore: 更新依赖包
```

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。详情请查看 LICENSE 文件。

## 🙏 致谢

感谢以下开源项目和贡献者：

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具  
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的类型超集
- [Pinia](https://pinia.vuejs.org/) - Vue.js 状态管理库

## 📞 联系我们

- 项目地址: [GitHub](https://github.com/The-ESAP-Project/vue-hwsystem-next)
- 问题反馈: [Issues](https://github.com/The-ESAP-Project/vue-hwsystem-next/issues)
- 功能建议: [Discussions](https://github.com/The-ESAP-Project/vue-hwsystem-next/discussions)

---

<div align="center">
  <p>⭐ 如果这个项目对你有帮助，请给我们一个星标！</p>
  
  <p>
    <a href="https://github.com/The-ESAP-Project/vue-hwsystem-next">
      <img src="https://img.shields.io/github/stars/The-ESAP-Project/vue-hwsystem-next?style=social" alt="GitHub stars">
    </a>
    <a href="https://github.com/The-ESAP-Project/vue-hwsystem-next/fork">
      <img src="https://img.shields.io/github/forks/The-ESAP-Project/vue-hwsystem-next?style=social" alt="GitHub forks">
    </a>
  </p>
  
  <p>
    <strong>让我们一起构建更好的教育技术！</strong>
  </p>
</div>
