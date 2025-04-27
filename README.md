# 作业管理系统 - 下一代  (Homework Management System Next)

基于 Vue 3、Vite 和 TailwindCSS 构建的现代化作业管理系统。该系统提供了完整的学生作业上传、教师批改流程和用户权限管理功能。

## 功能特点

- 💼 **多角色支持**：学生、课代表、教师不同权限管理
- 📝 **作业管理**：学生上传作业、添加批注说明
- ✅ **教师评阅**：老师查看、评价学生作业
- 📊 **提交概览**：支持查看全班作业提交情况
- 📱 **响应式设计**：支持移动端和桌面端访问
- 🔐 **JWT 授权**：安全的用户认证机制

## 技术栈

- 🖼️ 前端框架：[Vue 3](https://vuejs.org/)
- 🛠️ 构建工具：[Vite](https://vitejs.dev/)
- 🎨 UI 设计：[TailwindCSS](https://tailwindcss.com/)
- 🧭 路由管理：[Vue Router](https://router.vuejs.org/)
- 🔄 HTTP 客户端：[Axios](https://axios-http.com/)

## 快速开始

### 前置要求

- Node.js 18.x 或更高版本
- Yarn 1.22.x 或更高版本

### 环境变量配置

复制示例环境变量文件并根据需要修改：

```bash
cp .env.example .env.local
```

### 安装依赖

```bash
yarn
```

### 开发模式运行

```bash
yarn dev
```

### 构建生产版本

```bash
yarn build
```

### 预览构建结果

```bash
yarn preview
```

## API 接口

重构中

## 状态码说明

- `0`: 操作成功
- `1`: 认证失败
- `2`: 权限不足
- `3`: 资源不存在
- `4`: 请求参数错误
- `5`: 服务器内部错误

## 用户角色权限

- **学生**: 查看个人作业、上传作业
- **课代表**: 学生权限 + 查看全班作业提交情况
- **教师**: 查看并评阅全部学生作业

## 浏览器兼容性

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 贡献指南

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 许可证

本项目基于 GPL-3.0 协议开源。

## 作者

The ESAP Project - [@AptS-1547](https://github.com/AptS-1547)

项目链接: [https://github.com/AptS-1547/vue-hwsystem-next](https://github.com/AptS-1547/vue-hwsystem-next)
