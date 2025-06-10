#!/usr/bin/env python3
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from datetime import datetime, timedelta
import jwt
import hashlib
import uuid
from functools import wraps
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'

# 配置 CORS，允许发送 cookies
CORS(app, supports_credentials=True, origins=['http://localhost:3000'])

# 模拟用户数据
USERS = [
    {
        'id': 1,
        'username': 'monitor',
        'password': '123456',  # 实际应用中应该是加密的
        'email': 'monitor@example.com',
        'name': '课代表',
        'role': 'monitor'
    },
    {
        'id': 2,
        'username': 'teacher',
        'password': '123456',
        'email': 'teacher@example.com',
        'name': '张老师',
        'role': 'teacher'
    },
    {
        'id': 3,
        'username': 'student',
        'password': '123456',
        'email': 'student@example.com',
        'name': '小明同学',
        'role': 'student'
    }
]

# 模拟作业数据
ASSIGNMENTS = {
    'student': [
        {
            'id': 1,
            'title': '数学习题集第一章',
            'assignDate': '2025-05-29',
            'dueDate': '2025-06-07',
            'submitTime': '2025-06-02 14:30',
            'status': 'submitted',
            'attempts': 1,
            'description': '完成课本第1-20页的习题'
        },
        {
            'id': 2,
            'title': '英语口语作业',
            'assignDate': '2025-06-01',
            'dueDate': '2025-06-28',
            'submitTime': None,
            'status': 'pending',
            'attempts': 0,
            'description': '录制3分钟英语自我介绍视频'
        },
        {
            'id': 3,
            'title': '物理实验报告',
            'assignDate': '2025-06-03',
            'dueDate': '2025-06-12',
            'submitTime': None,
            'status': 'pending',
            'attempts': 0,
            'description': '完成光学实验报告'
        },
        {
            'id': 4,
            'title': '化学作业第二章',
            'assignDate': '2025-01-09',
            'dueDate': '2025-01-10',
            'submitTime': None,
            'status': 'pending',
            'attempts': 0,
            'description': '化学方程式练习'
        }
    ],
    'teacher': [
        {
            'id': 1,
            'title': '数学习题集第一章',
            'assignDate': '2025-05-29',
            'dueDate': '2025-06-07',
            'status': 'active',
            'totalStudents': 35,
            'submitted': 28,
            'description': '完成课本第1-20页的习题'
        },
        {
            'id': 2,
            'title': '英语口语作业',
            'assignDate': '2025-06-01',
            'dueDate': '2025-06-28',
            'status': 'active',
            'totalStudents': 35,
            'submitted': 15,
            'description': '录制3分钟英语自我介绍视频'
        },
        {
            'id': 3,
            'title': '物理实验报告',
            'assignDate': '2025-06-03',
            'dueDate': '2025-06-12',
            'status': 'draft',
            'totalStudents': 35,
            'submitted': 0,
            'description': '完成光学实验报告'
        },
        {
            'id': 4,
            'title': '化学作业第二章',
            'assignDate': '2025-06-05',
            'dueDate': '2025-06-15',
            'status': 'closed',
            'totalStudents': 35,
            'submitted': 35,
            'description': '化学方程式练习'
        }
    ],
    'monitor': [
        {
            'id': 1,
            'title': '数学习题集第一章',
            'assignDate': '2025-05-29',
            'dueDate': '2025-06-07',
            'status': 'submitted',
            'attempts': 1,
            'classSubmitted': 28,
            'classTotal': 35
        },
        {
            'id': 2,
            'title': '英语口语作业',
            'assignDate': '2025-06-01',
            'dueDate': '2025-06-28',
            'status': 'pending',
            'attempts': 0,
            'classSubmitted': 15,
            'classTotal': 35
        },
        {
            'id': 3,
            'title': '物理实验报告',
            'assignDate': '2025-06-03',
            'dueDate': '2025-06-12',
            'status': 'pending',
            'attempts': 0,
            'classSubmitted': 8,
            'classTotal': 35
        }
    ]
}

# 工具函数
def generate_token(user_id):
    """生成 JWT token"""
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=1)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

def verify_token(token):
    """验证 JWT token"""
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def get_user_by_id(user_id):
    """根据 ID 获取用户"""
    return next((user for user in USERS if user['id'] == user_id), None)

def get_user_by_username(username):
    """根据用户名获取用户"""
    return next((user for user in USERS if user['username'] == username), None)

# 认证装饰器
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # 从 cookies 中获取 token
        if 'auth-token' in request.cookies:
            token = request.cookies.get('auth-token')
        
        if not token:
            return jsonify({'message': '未登录'}), 401
        
        user_id = verify_token(token)
        if user_id is None:
            return jsonify({'message': 'token 无效或已过期'}), 401
        
        current_user = get_user_by_id(user_id)
        if current_user is None:
            return jsonify({'message': '用户不存在'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

# 认证路由
@app.route('/api/auth/login', methods=['POST'])
def login():
    """用户登录"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        remember_me = data.get('rememberMe', False)
        
        if not username or not password:
            return jsonify({'message': '用户名和密码不能为空'}), 400
        
        user = get_user_by_username(username)
        if not user or user['password'] != password:
            return jsonify({'message': '用户名或密码错误'}), 400
        
        # 生成 token
        token = generate_token(user['id'])
        
        # 创建响应
        response_data = {
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'name': user['name'],
                'role': user['role']
            },
            'message': '登录成功'
        }
        
        response = make_response(jsonify(response_data))
        
        # 设置 HttpOnly cookie
        max_age = 30 * 24 * 60 * 60 if remember_me else 24 * 60 * 60  # 30天或1天
        response.set_cookie(
            'auth-token',
            token,
            max_age=max_age,
            httponly=True,
            secure=False,  # 在生产环境中应该设置为 True
            samesite='Lax'
        )
        
        return response
        
    except Exception as e:
        return jsonify({'message': f'登录失败: {str(e)}'}), 500

@app.route('/api/auth/register', methods=['POST'])
def register():
    """用户注册"""
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        name = data.get('name')
        role = data.get('role')
        password = data.get('password')
        
        # 验证必填字段
        if not all([username, email, name, role, password]):
            return jsonify({'message': '所有字段都是必填的'}), 400
        
        # 检查用户名是否已存在
        if get_user_by_username(username):
            return jsonify({'message': '用户名已存在'}), 400
        
        # 创建新用户
        new_user = {
            'id': len(USERS) + 1,
            'username': username,
            'email': email,
            'name': name,
            'role': role,
            'password': password  # 实际应用中应该加密
        }
        
        USERS.append(new_user)
        
        # 生成 token
        token = generate_token(new_user['id'])
        
        response_data = {
            'user': {
                'id': new_user['id'],
                'username': new_user['username'],
                'email': new_user['email'],
                'name': new_user['name'],
                'role': new_user['role']
            },
            'message': '注册成功'
        }
        
        response = make_response(jsonify(response_data))
        response.set_cookie(
            'auth-token',
            token,
            max_age=24 * 60 * 60,
            httponly=True,
            secure=False,
            samesite='Lax'
        )
        
        return response
        
    except Exception as e:
        return jsonify({'message': f'注册失败: {str(e)}'}), 500

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """用户退出"""
    response = make_response(jsonify({'message': '退出成功'}))
    response.set_cookie('auth-token', '', expires=0)
    return response

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    """获取当前用户信息"""
    return jsonify({
        'user': {
            'id': current_user['id'],
            'username': current_user['username'],
            'email': current_user['email'],
            'name': current_user['name'],
            'role': current_user['role']
        }
    })

@app.route('/api/auth/refresh', methods=['POST'])
@token_required
def refresh_token(current_user):
    """刷新 token"""
    new_token = generate_token(current_user['id'])
    
    response = make_response(jsonify({'message': '刷新成功'}))
    response.set_cookie(
        'auth-token',
        new_token,
        max_age=24 * 60 * 60,
        httponly=True,
        secure=False,
        samesite='Lax'
    )
    
    return response

# Dashboard 数据路由
@app.route('/api/student/assignments', methods=['GET'])
@token_required
def get_student_assignments(current_user):
    """获取学生作业数据"""
    if current_user['role'] != 'student':
        return jsonify({'message': '无权限'}), 403
    
    return jsonify({
        'assignments': ASSIGNMENTS['student']
    })

@app.route('/api/student/stats', methods=['GET'])
@token_required
def get_student_stats(current_user):
    """获取学生统计数据"""
    if current_user['role'] != 'student':
        return jsonify({'message': '无权限'}), 403
    
    assignments = ASSIGNMENTS['student']
    total = len(assignments)
    completed = len([a for a in assignments if a['status'] == 'submitted'])
    pending = total - completed
    progress = round((completed / total) * 100) if total > 0 else 0
    
    stats = [
        {
            'label': '总作业',
            'value': total,
            'bgColor': 'bg-blue-100 dark:bg-blue-900/30',
            'iconColor': 'text-blue-600 dark:text-blue-400'
        },
        {
            'label': '已完成',
            'value': completed,
            'bgColor': 'bg-green-100 dark:bg-green-900/30',
            'iconColor': 'text-green-600 dark:text-green-400'
        },
        {
            'label': '待完成',
            'value': pending,
            'bgColor': 'bg-yellow-100 dark:bg-yellow-900/30',
            'iconColor': 'text-yellow-600 dark:text-yellow-400'
        },
        {
            'label': '完成率',
            'value': f'{progress}%',
            'bgColor': 'bg-purple-100 dark:bg-purple-900/30',
            'iconColor': 'text-purple-600 dark:text-purple-400'
        }
    ]
    
    return jsonify({'stats': stats})

@app.route('/api/teacher/assignments', methods=['GET'])
@token_required
def get_teacher_assignments(current_user):
    """获取教师作业数据"""
    if current_user['role'] != 'teacher':
        return jsonify({'message': '无权限'}), 403
    
    return jsonify({
        'assignments': ASSIGNMENTS['teacher']
    })

@app.route('/api/teacher/stats', methods=['GET'])
@token_required
def get_teacher_stats(current_user):
    """获取教师统计数据"""
    if current_user['role'] != 'teacher':
        return jsonify({'message': '无权限'}), 403
    
    assignments = ASSIGNMENTS['teacher']
    total = len(assignments)
    active = len([a for a in assignments if a['status'] == 'active'])
    avg_rate = round(sum(a['submitted'] / a['totalStudents'] for a in assignments) / total * 100) if total > 0 else 0
    
    stats = [
        {
            'label': '总作业数',
            'value': total,
            'bgColor': 'bg-blue-100 dark:bg-blue-900/30',
            'iconColor': 'text-blue-600 dark:text-blue-400'
        },
        {
            'label': '进行中',
            'value': active,
            'bgColor': 'bg-green-100 dark:bg-green-900/30',
            'iconColor': 'text-green-600 dark:text-green-400'
        },
        {
            'label': '学生总数',
            'value': 35,
            'bgColor': 'bg-purple-100 dark:bg-purple-900/30',
            'iconColor': 'text-purple-600 dark:text-purple-400'
        },
        {
            'label': '平均提交率',
            'value': f'{avg_rate}%',
            'bgColor': 'bg-orange-100 dark:bg-orange-900/30',
            'iconColor': 'text-orange-600 dark:text-orange-400'
        }
    ]
    
    return jsonify({'stats': stats})

@app.route('/api/monitor/assignments', methods=['GET'])
@token_required
def get_monitor_assignments(current_user):
    """获取课代表作业数据"""
    if current_user['role'] != 'monitor':
        return jsonify({'message': '无权限'}), 403
    
    return jsonify({
        'assignments': ASSIGNMENTS['monitor']
    })

@app.route('/api/monitor/stats', methods=['GET'])
@token_required
def get_monitor_stats(current_user):
    """获取课代表统计数据"""
    if current_user['role'] != 'monitor':
        return jsonify({'message': '无权限'}), 403
    
    assignments = ASSIGNMENTS['monitor']
    total = len(assignments)
    completed = len([a for a in assignments if a['status'] == 'submitted'])
    avg_progress = round(sum(a['classSubmitted'] / a['classTotal'] for a in assignments) / total * 100) if total > 0 else 0
    pending_students = sum(a['classTotal'] - a['classSubmitted'] for a in assignments)
    
    stats = [
        {
            'label': '总作业数',
            'value': total,
            'bgColor': 'bg-blue-100 dark:bg-blue-900/30',
            'iconColor': 'text-blue-600 dark:text-blue-400'
        },
        {
            'label': '我已完成',
            'value': completed,
            'bgColor': 'bg-green-100 dark:bg-green-900/30',
            'iconColor': 'text-green-600 dark:text-green-400'
        },
        {
            'label': '班级平均进度',
            'value': f'{avg_progress}%',
            'bgColor': 'bg-purple-100 dark:bg-purple-900/30',
            'iconColor': 'text-purple-600 dark:text-purple-400'
        },
        {
            'label': '待提醒同学',
            'value': pending_students,
            'bgColor': 'bg-orange-100 dark:bg-orange-900/30',
            'iconColor': 'text-orange-600 dark:text-orange-400'
        }
    ]
    
    return jsonify({'stats': stats})

@app.route('/api/monitor/class-students', methods=['GET'])
@token_required
def get_class_students(current_user):
    """获取班级学生数据"""
    if current_user['role'] != 'monitor':
        return jsonify({'message': '无权限'}), 403
    
    students = [
        {'id': 1, 'name': '张三', 'submitted': True, 'submitTime': '2025-06-02 14:30'},
        {'id': 2, 'name': '李四', 'submitted': True, 'submitTime': '2025-06-02 15:45'},
        {'id': 3, 'name': '王五', 'submitted': False, 'submitTime': None},
        {'id': 4, 'name': '赵六', 'submitted': True, 'submitTime': '2025-06-01 16:20'},
        {'id': 5, 'name': '孙七', 'submitted': False, 'submitTime': None}
    ]
    
    return jsonify({'students': students})

# 错误处理
@app.errorhandler(404)
def not_found(error):
    return jsonify({'message': '接口不存在'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'message': '服务器内部错误'}), 500

if __name__ == '__main__':
    print("Mock API Server 启动中...")
    print("服务地址: http://localhost:5000")
    print("API 文档:")
    print("  POST /api/auth/login - 用户登录")
    print("  POST /api/auth/register - 用户注册")
    print("  POST /api/auth/logout - 用户退出")
    print("  GET  /api/auth/me - 获取当前用户")
    print("  POST /api/auth/refresh - 刷新token")
    print("  GET  /api/student/* - 学生相关接口")
    print("  GET  /api/teacher/* - 教师相关接口")
    print("  GET  /api/monitor/* - 课代表相关接口")
    
    app.run(debug=True, host='0.0.0.0', port=5500)
