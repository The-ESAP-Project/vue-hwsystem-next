# Mock Backend API

这是一个基于 Flask 的模拟后端 API，为作业系统提供完整的认证和数据服务。

## 安装和运行

1. 安装依赖：
```bash
cd mock-backend
pip install -r requirements.txt
```

2. 运行服务：
```bash
python app.py
# 或者
python run.py
```

服务将在 `http://localhost:5000` 启动。

## API 接口

### 认证接口

- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册  
- `POST /api/auth/logout` - 用户退出
- `GET /api/auth/me` - 获取当前用户信息
- `POST /api/auth/refresh` - 刷新认证令牌

### 学生接口

- `GET /api/student/assignments` - 获取学生作业列表
- `GET /api/student/stats` - 获取学生统计数据

### 教师接口

- `GET /api/teacher/assignments` - 获取教师作业列表
- `GET /api/teacher/stats` - 获取教师统计数据

### 课代表接口

- `GET /api/monitor/assignments` - 获取课代表作业列表
- `GET /api/monitor/stats` - 获取课代表统计数据
- `GET /api/monitor/class-students` - 获取班级学生列表

## 测试账户

| 用户名 | 密码 | 角色 | 描述 |
|--------|------|------|------|
| student | 123456 | student | 学生账户 |
| teacher | 123456 | teacher | 教师账户 |
| monitor | 123456 | monitor | 课代表账户 |

## 特性

- ✅ JWT 认证
- ✅ HttpOnly Cookies
- ✅ CORS 支持
- ✅ 角色权限控制
- ✅ 错误处理
- ✅ 数据模拟

## 安全配置

- 使用 HttpOnly cookies 存储认证令牌
- 支持 CORS 跨域请求
- JWT 令牌过期时间为 24 小时
- 角色权限验证

## 开发说明

这是一个模拟后端，仅用于开发和测试。在生产环境中需要：

1. 使用真实的数据库
2. 加密用户密码
3. 使用 HTTPS
4. 配置安全的 Cookie 设置
5. 实现完整的错误处理和日志记录
