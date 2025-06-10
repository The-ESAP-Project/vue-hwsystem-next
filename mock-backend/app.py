#!/usr/bin/env python3
from flask import Flask, request, jsonify, make_response, send_from_directory
from flask_cors import CORS
from datetime import datetime, timedelta
import jwt
import hashlib
import uuid
from functools import wraps
import json
import os
from werkzeug.utils import secure_filename
import threading
import atexit
import shutil

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['DATA_FOLDER'] = 'data'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# 确保目录存在
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['DATA_FOLDER'], exist_ok=True)

# 配置 CORS
CORS(app, supports_credentials=True, origins=['http://localhost:3000'])

# 允许的文件类型
ALLOWED_EXTENSIONS = {
    'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx', 
    'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'rar', '7z'
}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# 数据持久化管理类
class DataManager:
    def __init__(self, data_folder):
        self.data_folder = data_folder
        self.data_files = {
            'users': 'users.json',
            'assignments': 'assignments.json',
            'homework_details': 'homework_details.json',
            'homework_submissions': 'homework_submissions.json'
        }
        self.lock = threading.Lock()
        
    def get_file_path(self, data_type):
        return os.path.join(self.data_folder, self.data_files[data_type])
    
    def load_data(self, data_type, default_data):
        """从文件加载数据"""
        file_path = self.get_file_path(data_type)
        try:
            if os.path.exists(file_path):
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    print(f"✓ 已加载 {data_type} 数据: {len(data) if isinstance(data, (list, dict)) else 'N/A'} 条记录")
                    return data
            else:
                print(f"⚠ {data_type} 数据文件不存在，使用默认数据")
                self.save_data(data_type, default_data)
                return default_data
        except Exception as e:
            print(f"✗ 加载 {data_type} 数据失败: {e}")
            print(f"  使用默认数据并备份损坏文件")
            if os.path.exists(file_path):
                backup_path = f"{file_path}.backup.{int(datetime.now().timestamp())}"
                shutil.copy2(file_path, backup_path)
            self.save_data(data_type, default_data)
            return default_data
    
    def save_data(self, data_type, data):
        """保存数据到文件"""
        with self.lock:
            file_path = self.get_file_path(data_type)
            temp_path = file_path + '.tmp'
            try:
                with open(temp_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                
                # 原子性替换文件
                if os.path.exists(file_path):
                    os.replace(temp_path, file_path)
                else:
                    os.rename(temp_path, file_path)
                    
            except Exception as e:
                print(f"✗ 保存 {data_type} 数据失败: {e}")
                if os.path.exists(temp_path):
                    os.remove(temp_path)
    
    def auto_save(self, data_type, data):
        """异步自动保存"""
        def save_task():
            self.save_data(data_type, data)
        
        thread = threading.Thread(target=save_task)
        thread.daemon = True
        thread.start()
    
    def backup_all_data(self):
        """备份所有数据"""
        backup_folder = os.path.join(self.data_folder, f"backup_{int(datetime.now().timestamp())}")
        os.makedirs(backup_folder, exist_ok=True)
        
        for data_type, filename in self.data_files.items():
            src_path = self.get_file_path(data_type)
            if os.path.exists(src_path):
                dst_path = os.path.join(backup_folder, filename)
                shutil.copy2(src_path, dst_path)
        
        print(f"✓ 数据备份完成: {backup_folder}")
        return backup_folder

# 初始化数据管理器
data_manager = DataManager(app.config['DATA_FOLDER'])

# 默认数据
DEFAULT_USERS = [
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

DEFAULT_ASSIGNMENTS = {
    'student': [
        {
            'id': 1,
            'title': '数学习题集第一章',
            'assignDate': '2025-05-29',
            'dueDate': '2025-06-07',
            'submitTime': '2025-06-02 14:30',
            'status': 'submitted',
            'attempts': 1,
            'description': '完成课本第1-20页的习题',
            'detailedDescription': '''请完成课本第1-20页的练习题，并提交解题过程。注意：
1. 需要详细说明每个步骤的计算方法和理由
2. 可以手写后拍照上传，也可以直接在文本框中输入
3. 如有疑问请及时联系老师
4. 截止时间前可以多次修改提交''',
            'maxScore': 100,
            'subject': '数学',
            'teacher': '李老师',
            'attachments': [
                {
                    'id': 1,
                    'name': '数学习题集参考资料.pdf',
                    'size': 2048000,
                    'type': 'application/pdf',
                    'url': '/api/files/math_reference.pdf'
                }
            ]
        },
        {
            'id': 2,
            'title': '英语口语作业',
            'assignDate': '2025-06-01',
            'dueDate': '2025-06-28',
            'submitTime': None,
            'status': 'pending',
            'attempts': 0,
            'description': '录制3分钟英语自我介绍视频',
            'detailedDescription': '''录制一段3分钟的英语自我介绍视频，要求：
1. 发音清晰，语速适中
2. 内容包括：姓名、年龄、兴趣爱好、未来计划
3. 使用至少5个不同的时态
4. 可以使用手机或摄像头录制
5. 文件格式：MP4、AVI或MOV''',
            'maxScore': 100,
            'subject': '英语',
            'teacher': '王老师',
            'attachments': [
                {
                    'id': 1,
                    'name': '英语自我介绍示例.mp4',
                    'size': 15360000,
                    'type': 'video/mp4',
                    'url': '/api/files/english_example.mp4'
                }
            ]
        },
        {
            'id': 3,
            'title': '物理实验报告',
            'assignDate': '2025-06-03',
            'dueDate': '2025-06-12',
            'submitTime': None,
            'status': 'pending',
            'attempts': 0,
            'description': '完成光学实验报告',
            'detailedDescription': '''完成光学实验：凸透镜成像规律的探究实验报告，要求：
1. 实验目的和原理清楚
2. 实验器材和步骤详细
3. 实验数据记录完整
4. 实验现象描述准确
5. 实验结论和误差分析
6. 字数要求：2000字以上''',
            'maxScore': 100,
            'subject': '物理',
            'teacher': '赵老师',
            'attachments': [
                {
                    'id': 1,
                    'name': '实验报告模板.docx',
                    'size': 512000,
                    'type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'url': '/api/files/physics_template.docx'
                }
            ]
        },
        {
            'id': 4,
            'title': '化学作业第二章',
            'assignDate': '2025-01-09',
            'dueDate': '2025-01-10',
            'submitTime': None,
            'status': 'pending',
            'attempts': 0,
            'description': '化学方程式练习',
            'detailedDescription': '''完成化学第二章的方程式配平练习，要求：
1. 配平所有化学方程式
2. 标注反应类型（化合、分解、置换、复分解）
3. 写出离子方程式（适用的反应）
4. 计算相关的摩尔质量和化学计量数
5. 解释反应的实际应用''',
            'maxScore': 100,
            'subject': '化学',
            'teacher': '刘老师',
            'attachments': [
                {
                    'id': 1,
                    'name': '化学方程式练习题.pdf',
                    'size': 1024000,
                    'type': 'application/pdf',
                    'url': '/api/files/chemistry_exercises.pdf'
                }
            ]
        },
        {
            'id': 5,
            'title': '生物实验记录',
            'assignDate': '2025-06-05',
            'dueDate': '2025-06-15',
            'submitTime': '2025-06-10 16:45',
            'status': 'submitted',
            'attempts': 2,
            'description': '细胞观察实验报告',
            'detailedDescription': '''完成细胞观察实验并提交实验记录，要求：
1. 观察植物细胞（洋葱表皮）和动物细胞（口腔上皮）
2. 绘制细胞结构图并标注各部分名称
3. 比较植物细胞和动物细胞的异同
4. 记录显微镜的使用步骤和注意事项
5. 拍摄显微镜下的细胞照片''',
            'maxScore': 100,
            'subject': '生物',
            'teacher': '陈老师',
            'attachments': [
                {
                    'id': 1,
                    'name': '细胞结构图参考.jpg',
                    'size': 768000,
                    'type': 'image/jpeg',
                    'url': '/api/files/cell_structure.jpg'
                }
            ]
        },
        {
            'id': 6,
            'title': '地理课题研究',
            'assignDate': '2025-06-08',
            'dueDate': '2025-06-22',
            'submitTime': None,
            'status': 'pending',
            'attempts': 0,
            'description': '城市化进程调查报告',
            'detailedDescription': '''选择一个城市，研究其城市化进程，要求：
1. 分析该城市近20年的人口变化
2. 研究城市化对环境的影响
3. 调查城市交通、住房、就业等问题
4. 提出城市可持续发展的建议
5. 制作PPT进行汇报展示
6. 字数要求：3000字以上''',
            'maxScore': 100,
            'subject': '地理',
            'teacher': '孙老师',
            'attachments': [
                {
                    'id': 1,
                    'name': '城市化研究指南.pdf',
                    'size': 1536000,
                    'type': 'application/pdf',
                    'url': '/api/files/urbanization_guide.pdf'
                }
            ]
        },
        {
            'id': 7,
            'title': '历史论文',
            'assignDate': '2025-06-10',
            'dueDate': '2025-06-30',
            'submitTime': None,
            'status': 'pending',
            'attempts': 0,
            'description': '近代史重要事件分析',
            'detailedDescription': '''选择一个近代史重要事件进行深入分析，要求：
1. 事件背景和起因分析
2. 事件发展过程的详细描述
3. 重要人物的作用和影响
4. 事件的历史意义和深远影响
5. 引用至少5个可靠的史料来源
6. 字数要求：2500字以上''',
            'maxScore': 100,
            'subject': '历史',
            'teacher': '周老师',
            'attachments': [
                {
                    'id': 1,
                    'name': '史料引用规范.pdf',
                    'size': 256000,
                    'type': 'application/pdf',
                    'url': '/api/files/history_citation.pdf'
                }
            ]
        },
        {
            'id': 8,
            'title': '计算机编程作业',
            'assignDate': '2025-06-12',
            'dueDate': '2025-06-19',
            'submitTime': '2025-06-15 09:20',
            'status': 'submitted',
            'attempts': 1,
            'description': 'Python基础程序设计',
            'detailedDescription': '''使用Python编写程序解决以下问题：
1. 设计一个学生成绩管理系统
2. 实现学生信息的增删改查功能
3. 计算班级平均分、最高分、最低分
4. 生成成绩统计图表
5. 代码要有详细的注释说明
6. 提交.py文件和运行截图''',
            'maxScore': 100,
            'subject': '信息技术',
            'teacher': '吴老师',
            'attachments': [
                {
                    'id': 1,
                    'name': 'Python基础教程.pdf',
                    'size': 3072000,
                    'type': 'application/pdf',
                    'url': '/api/files/python_tutorial.pdf'
                }
            ]
        },
        {
            'id': 9,
            'title': '美术创作',
            'assignDate': '2025-06-15',
            'dueDate': '2025-06-25',
            'submitTime': None,
            'status': 'pending',
            'attempts': 0,
            'description': '水彩画创作与说明',
            'detailedDescription': '''完成一幅水彩画作品并提交创作说明，要求：
1. 主题：风景、静物或人物任选其一
2. 尺寸：A4纸大小
3. 运用至少3种水彩技法
4. 色彩搭配协调，构图完整
5. 撰写300字的创作说明
6. 拍摄作品高清照片提交''',
            'maxScore': 100,
            'subject': '美术',
            'teacher': '郑老师',
            'attachments': [
                {
                    'id': 1,
                    'name': '水彩技法示例.jpg',
                    'size': 2048000,
                    'type': 'image/jpeg',
                    'url': '/api/files/watercolor_techniques.jpg'
                }
            ]
        },
        {
            'id': 10,
            'title': '音乐欣赏报告',
            'assignDate': '2025-06-18',
            'dueDate': '2025-07-02',
            'submitTime': None,
            'status': 'pending',
            'attempts': 0,
            'description': '古典音乐赏析与评论',
            'detailedDescription': '''选择一首古典音乐作品进行深入赏析，要求：
1. 介绍作曲家的生平和创作背景
2. 分析作品的音乐结构和特点
3. 描述音乐的情感表达和艺术价值
4. 比较不同演奏版本的差异
5. 撰写个人听后感和评价
6. 字数要求：1500字以上''',
            'maxScore': 100,
            'subject': '音乐',
            'teacher': '冯老师',
            'attachments': [
                {
                    'id': 1,
                    'name': '贝多芬第九交响曲.mp3',
                    'size': 51200000,
                    'type': 'audio/mpeg',
                    'url': '/api/files/beethoven_symphony9.mp3'
                }
            ]
        },
        {
            'id': 11,
            'title': '体育技能测评',
            'assignDate': '2025-06-20',
            'dueDate': '2025-06-27',
            'submitTime': None,
            'status': 'pending',
            'attempts': 0,
            'description': '篮球运动技能视频记录',
            'detailedDescription': '''录制篮球技能展示视频，要求：
1. 基本功：运球、传球、投篮各30秒
2. 技术动作：三步上篮5次连续
3. 体能测试：1分钟投篮次数记录
4. 比赛片段：3对3实战5分钟
5. 动作规范，技术要领正确
6. 视频清晰，时长控制在10分钟内''',
            'maxScore': 100,
            'subject': '体育',
            'teacher': '林老师',
            'attachments': [
                {
                    'id': 1,
                    'name': '篮球技术要领.mp4',
                    'size': 25600000,
                    'type': 'video/mp4',
                    'url': '/api/files/basketball_skills.mp4'
                }
            ]
        },
        {
            'id': 12,
            'title': '数学建模实践',
            'assignDate': '2025-06-22',
            'dueDate': '2025-07-06',
            'submitTime': None,
            'status': 'pending',
            'attempts': 0,
            'description': '生活中的数学建模案例',
            'detailedDescription': '''选择生活中的实际问题建立数学模型，要求：
1. 问题描述清晰，具有实际意义
2. 建立合理的数学模型
3. 使用适当的数学方法求解
4. 验证模型的合理性和准确性
5. 分析结果并提出改进建议
6. 使用数学软件辅助计算和绘图''',
            'maxScore': 100,
            'subject': '数学',
            'teacher': '李老师',
            'attachments': [
                {
                    'id': 1,
                    'name': '数学建模案例集.pdf',
                    'size': 4096000,
                    'type': 'application/pdf',
                    'url': '/api/files/math_modeling_cases.pdf'
                }
            ]
        },
        {
            'id': 13,
            'title': '英语写作',
            'assignDate': '2025-06-25',
            'dueDate': '2025-07-09',
            'submitTime': None,
            'status': 'pending',
            'attempts': 0,
            'description': '议论文写作练习',
            'detailedDescription': '''撰写一篇英语议论文，要求：
1. 主题：科技对教育的影响
2. 结构：引言、主体段落、结论
3. 字数：500-800词
4. 使用恰当的连接词和过渡句
5. 论据充分，逻辑清晰
6. 语法正确，词汇丰富''',
            'maxScore': 100,
            'subject': '英语',
            'teacher': '王老师',
            'attachments': [
                {
                    'id': 1,
                    'name': '英语写作指南.pdf',
                    'size': 1024000,
                    'type': 'application/pdf',
                    'url': '/api/files/english_writing_guide.pdf'
                }
            ]
        },
        {
            'id': 14,
            'title': '物理竞赛题',
            'assignDate': '2025-06-28',
            'dueDate': '2025-07-12',
            'submitTime': None,
            'status': 'pending',
            'attempts': 0,
            'description': '力学难题集训',
            'detailedDescription': '''解答高难度力学竞赛题，要求：
1. 完成10道力学综合题
2. 详细写出解题思路和步骤
3. 画出必要的受力分析图
4. 检验答案的合理性
5. 总结解题方法和技巧
6. 对错题进行反思和改正''',
            'maxScore': 100,
            'subject': '物理',
            'teacher': '赵老师',
            'attachments': [
                {
                    'id': 1,
                    'name': '力学竞赛题集.pdf',
                    'size': 2048000,
                    'type': 'application/pdf',
                    'url': '/api/files/physics_competition.pdf'
                }
            ]
        },
        {
            'id': 15,
            'title': '化学实验设计',
            'assignDate': '2025-07-01',
            'dueDate': '2025-07-15',
            'submitTime': None,
            'status': 'pending',
            'attempts': 0,
            'description': '设计一个验证实验',
            'detailedDescription': '''设计一个化学验证实验，要求：
1. 选择一个化学反应进行验证
2. 设计完整的实验方案
3. 列出所需的实验器材和试剂
4. 描述详细的实验步骤
5. 预测实验现象和结果
6. 分析可能的实验误差和改进方法''',
            'maxScore': 100,
            'subject': '化学',
            'teacher': '刘老师',
            'attachments': [
                {
                    'id': 1,
                    'name': '实验设计模板.docx',
                    'size': 512000,
                    'type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'url': '/api/files/experiment_design_template.docx'
                }
            ]
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

# 加载持久化数据
USERS = data_manager.load_data('users', DEFAULT_USERS)
ASSIGNMENTS = data_manager.load_data('assignments', DEFAULT_ASSIGNMENTS)
HOMEWORK_DETAILS = data_manager.load_data('homework_details', {})
HOMEWORK_SUBMISSIONS = data_manager.load_data('homework_submissions', {})

# 数据变更时自动保存的装饰器
def auto_save_data(data_type):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            result = func(*args, **kwargs)
            
            # 获取对应的全局数据
            if data_type == 'users':
                data_manager.auto_save('users', USERS)
            elif data_type == 'assignments':
                data_manager.auto_save('assignments', ASSIGNMENTS)
            elif data_type == 'homework_details':
                data_manager.auto_save('homework_details', HOMEWORK_DETAILS)
            elif data_type == 'homework_submissions':
                data_manager.auto_save('homework_submissions', HOMEWORK_SUBMISSIONS)
            
            return result
        return wrapper
    return decorator

# 工具函数
def generate_token(user_id):
    """生成 JWT token"""
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=7)  # 7天过期
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

# 认证装饰器 - 改回使用 Http-Only Cookie
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

# 数据管理 API
@app.route('/api/admin/backup', methods=['POST'])
def backup_data():
    """手动备份数据"""
    try:
        backup_folder = data_manager.backup_all_data()
        return jsonify({
            'success': True,
            'message': '数据备份成功',
            'backup_folder': backup_folder
        })
    except Exception as e:
        return jsonify({'message': f'备份失败: {str(e)}'}), 500

@app.route('/api/admin/reset', methods=['POST'])
def reset_data():
    """重置为默认数据"""
    try:
        # 先备份当前数据
        data_manager.backup_all_data()
        
        # 重置为默认数据
        global USERS, ASSIGNMENTS, HOMEWORK_DETAILS, HOMEWORK_SUBMISSIONS
        USERS = DEFAULT_USERS.copy()
        ASSIGNMENTS = DEFAULT_ASSIGNMENTS.copy()
        HOMEWORK_DETAILS = {}
        HOMEWORK_SUBMISSIONS = {}
        
        # 保存到文件
        data_manager.save_data('users', USERS)
        data_manager.save_data('assignments', ASSIGNMENTS)
        data_manager.save_data('homework_details', HOMEWORK_DETAILS)
        data_manager.save_data('homework_submissions', HOMEWORK_SUBMISSIONS)
        
        return jsonify({
            'success': True,
            'message': '数据重置成功'
        })
    except Exception as e:
        return jsonify({'message': f'重置失败: {str(e)}'}), 500

@app.route('/api/admin/stats', methods=['GET'])
def get_data_stats():
    """获取数据统计"""
    stats = {
        'users': len(USERS),
        'assignments': {
            'student': len(ASSIGNMENTS.get('student', [])),
            'teacher': len(ASSIGNMENTS.get('teacher', [])),
            'monitor': len(ASSIGNMENTS.get('monitor', []))
        },
        'homework_details': len(HOMEWORK_DETAILS),
        'homework_submissions': len(HOMEWORK_SUBMISSIONS),
        'last_backup': None
    }
    
    # 查找最新备份
    backup_dirs = []
    if os.path.exists(app.config['DATA_FOLDER']):
        for item in os.listdir(app.config['DATA_FOLDER']):
            if item.startswith('backup_'):
                backup_dirs.append(item)
    
    if backup_dirs:
        latest_backup = max(backup_dirs)
        stats['last_backup'] = latest_backup
    
    return jsonify(stats)

# 认证路由
@app.route('/api/auth/login', methods=['POST'])
@auto_save_data('users')
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
        max_age = 30 * 24 * 60 * 60 if remember_me else 7 * 24 * 60 * 60  # 30天或7天
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
@auto_save_data('users')
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
            'id': max([u['id'] for u in USERS]) + 1 if USERS else 1,
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
            max_age=7 * 24 * 60 * 60,
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
        max_age=7 * 24 * 60 * 60,
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
    
    # 使用真实的作业数据，并更新提交状态
    assignments = []
    for assignment in ASSIGNMENTS['student']:
        submission_key = f"{current_user['id']}_{assignment['id']}"
        submission = HOMEWORK_SUBMISSIONS.get(submission_key)
        
        # 复制基本作业信息
        homework_item = assignment.copy()
        
        # 根据提交记录更新状态
        if submission:
            homework_item['status'] = 'submitted' if submission.get('submitted') else 'pending'
            homework_item['submitTime'] = submission.get('submitTime')
            homework_item['attempts'] = 1 if submission.get('submitted') else 0
        
        # 检查是否过期
        from datetime import datetime
        try:
            due_date = datetime.strptime(assignment['dueDate'], '%Y-%m-%d')
            current_date = datetime.now()
            if current_date > due_date and homework_item['status'] == 'pending':
                homework_item['status'] = 'overdue'
        except ValueError:
            # 如果日期格式不正确，保持原状态
            pass
        
        assignments.append(homework_item)
    
    return jsonify({
        'assignments': assignments
    })

@app.route('/api/student/stats', methods=['GET'])
@token_required
def get_student_stats(current_user):
    """获取学生统计数据"""
    if current_user['role'] != 'student':
        return jsonify({'message': '无权限'}), 403
    
    # 获取当前学生的真实作业数据
    assignments = ASSIGNMENTS['student']
    total = len(assignments)
    
    # 统计已完成作业数
    completed = 0
    overdue = 0
    
    from datetime import datetime
    
    for assignment in assignments:
        submission_key = f"{current_user['id']}_{assignment['id']}"
        submission = HOMEWORK_SUBMISSIONS.get(submission_key)
        
        # 检查提交状态
        if submission and submission.get('submitted'):
            completed += 1
        else:
            # 检查是否过期
            try:
                due_date = datetime.strptime(assignment['dueDate'], '%Y-%m-%d')
                current_date = datetime.now()
                if current_date > due_date:
                    overdue += 1
            except ValueError:
                # 日期格式错误，跳过过期检查
                pass
    
    pending = total - completed - overdue
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
            'label': '已过期',
            'value': overdue,
            'bgColor': 'bg-red-100 dark:bg-red-900/30',
            'iconColor': 'text-red-600 dark:text-red-400'
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

# 作业详情 API
@app.route('/api/student/homework/view', methods=['GET'])
@token_required
def get_homework_detail(current_user):
    """获取作业详情"""
    if current_user['role'] != 'student':
        return jsonify({'message': '无权限'}), 403
    
    homework_id = request.args.get('id')
    if not homework_id:
        return jsonify({'message': '作业ID不能为空'}), 400
    
    try:
        homework_id = int(homework_id)
    except ValueError:
        return jsonify({'message': '作业ID格式错误'}), 400
    
    # 从学生作业列表中查找对应的作业
    assignment = None
    for hw in ASSIGNMENTS['student']:
        if hw['id'] == homework_id:
            assignment = hw
            break
    
    if not assignment:
        return jsonify({'message': '作业不存在'}), 404
    
    # 获取学生提交记录
    submission_key = f"{current_user['id']}_{homework_id}"
    submission = HOMEWORK_SUBMISSIONS.get(submission_key)
    
    # 构建返回的作业详情
    homework = {
        'id': assignment['id'],
        'title': assignment['title'],
        'description': assignment.get('detailedDescription', assignment['description']),
        'assignedDate': assignment['assignDate'],
        'dueDate': assignment['dueDate'],
        'maxScore': assignment.get('maxScore', 100),
        'subject': assignment.get('subject', '未分类'),
        'teacher': assignment.get('teacher', '老师'),
        'attachments': assignment.get('attachments', [])
    }
    
    # 根据提交状态确定作业状态和是否可编辑
    if submission:
        homework['status'] = 'submitted' if submission.get('submitted') else 'pending'
        homework['editable'] = not submission.get('submitted', False)
    else:
        homework['status'] = 'pending'
        homework['editable'] = True
    
    # 检查是否过期
    from datetime import datetime
    try:
        due_date = datetime.strptime(assignment['dueDate'], '%Y-%m-%d')
        current_date = datetime.now()
        if current_date > due_date and not submission:
            homework['status'] = 'overdue'
            homework['editable'] = False
        elif current_date > due_date and submission and not submission.get('submitted'):
            homework['status'] = 'overdue'
            homework['editable'] = False
    except ValueError:
        # 如果日期格式不正确，仍然允许编辑
        pass
    
    response_data = {
        'homework': homework,
        'submission': submission,
        'editable': homework['editable']
    }
    
    return jsonify(response_data)

@app.route('/api/student/homework/save-draft', methods=['POST'])
@token_required
@auto_save_data('homework_submissions')
def save_homework_draft(current_user):
    """保存作业草稿"""
    if current_user['role'] != 'student':
        return jsonify({'message': '无权限'}), 403
    
    try:
        data = request.get_json()
        homework_id = data.get('homeworkId')
        content = data.get('content', '')
        files = data.get('files', [])
        
        if not homework_id:
            return jsonify({'message': '作业ID不能为空'}), 400
        
        submission_key = f"{current_user['id']}_{homework_id}"
        save_time = datetime.now().isoformat()
        
        # 保存草稿数据
        HOMEWORK_SUBMISSIONS[submission_key] = {
            'id': len(HOMEWORK_SUBMISSIONS) + 1,
            'homeworkId': homework_id,
            'content': content,
            'files': files,
            'submitTime': None,
            'isDraft': True,
            'submitted': False,
            'saveTime': save_time,
            'userId': current_user['id']
        }
        
        return jsonify({
            'success': True,
            'message': '草稿保存成功',
            'saveTime': save_time
        })
        
    except Exception as e:
        return jsonify({'message': f'保存草稿失败: {str(e)}'}), 500

@app.route('/api/student/homework/submit', methods=['POST'])
@token_required
@auto_save_data('homework_submissions')
def submit_homework(current_user):
    """提交作业"""
    if current_user['role'] != 'student':
        return jsonify({'message': '无权限'}), 403
    
    try:
        data = request.get_json()
        homework_id = data.get('homeworkId')
        content = data.get('content', '')
        files = data.get('files', [])
        
        if not homework_id:
            return jsonify({'message': '作业ID不能为空'}), 400
        
        if not content.strip() and not files:
            return jsonify({'message': '作业内容不能为空'}), 400
        
        submission_key = f"{current_user['id']}_{homework_id}"
        submit_time = datetime.now().isoformat()
        
        # 保存提交数据
        HOMEWORK_SUBMISSIONS[submission_key] = {
            'id': len(HOMEWORK_SUBMISSIONS) + 1,
            'homeworkId': homework_id,
            'content': content,
            'files': files,
            'submitTime': submit_time,
            'isDraft': False,
            'submitted': True,
            'userId': current_user['id']
        }
        
        return jsonify({
            'success': True,
            'message': '作业提交成功',
            'submission': {
                'id': HOMEWORK_SUBMISSIONS[submission_key]['id'],
                'homeworkId': homework_id,
                'submitTime': submit_time
            }
        })
        
    except Exception as e:
        return jsonify({'message': f'提交作业失败: {str(e)}'}), 500

@app.route('/api/student/homework/upload', methods=['POST'])
@token_required
def upload_homework_files(current_user):
    """上传作业文件"""
    if current_user['role'] != 'student':
        return jsonify({'message': '无权限'}), 403
    
    try:
        if 'files' not in request.files:
            return jsonify({'message': '没有文件被上传'}), 400
        
        files = request.files.getlist('files')
        if not files or files[0].filename == '':
            return jsonify({'message': '没有选择文件'}), 400
        
        uploaded_files = []
        
        for file in files:
            if file and allowed_file(file.filename):
                # 生成安全的文件名
                filename = secure_filename(file.filename)
                unique_filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:8]}_{filename}"
                
                # 保存文件
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
                file.save(file_path)
                
                # 获取文件信息
                file_size = os.path.getsize(file_path)
                
                uploaded_files.append({
                    'id': len(uploaded_files) + 1,
                    'name': filename,
                    'size': file_size,
                    'type': file.content_type or 'application/octet-stream',
                    'url': f'/api/files/{unique_filename}'
                })
            else:
                return jsonify({'message': f'不支持的文件类型: {file.filename}'}), 400
        
        return jsonify({
            'success': True,
            'files': uploaded_files
        })
        
    except Exception as e:
        return jsonify({'message': f'文件上传失败: {str(e)}'}), 500

@app.route('/api/files/<filename>')
def download_file(filename):
    """下载文件"""
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    except FileNotFoundError:
        return jsonify({'message': '文件不存在'}), 404

# 教师创建新作业 API
@app.route('/api/teacher/homework/create', methods=['POST'])
@token_required
@auto_save_data('assignments')
def create_homework(current_user):
    """教师创建新作业"""
    if current_user['role'] != 'teacher':
        return jsonify({'message': '无权限'}), 403
    
    try:
        data = request.get_json()
        
        # 验证必填字段
        required_fields = ['title', 'description', 'dueDate', 'subject']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'message': f'{field} 不能为空'}), 400
        
        # 生成新的作业ID
        max_id = max([hw['id'] for hw in ASSIGNMENTS['student']], default=0)
        new_id = max_id + 1
        
        # 创建新作业
        new_assignment = {
            'id': new_id,
            'title': data['title'],
            'assignDate': data.get('assignDate', datetime.now().strftime('%Y-%m-%d')),
            'dueDate': data['dueDate'],
            'submitTime': None,
            'status': 'pending',
            'attempts': 0,
            'description': data['description'],
            'detailedDescription': data.get('detailedDescription', data['description']),
            'maxScore': data.get('maxScore', 100),
            'subject': data['subject'],
            'teacher': current_user['name'],
            'attachments': data.get('attachments', [])
        }
        
        # 添加到学生作业列表
        ASSIGNMENTS['student'].append(new_assignment)
        
        # 添加到教师作业列表
        teacher_assignment = {
            'id': new_id,
            'title': data['title'],
            'assignDate': new_assignment['assignDate'],
            'dueDate': data['dueDate'],
            'status': 'active',
            'totalStudents': 35,  # 默认班级人数
            'submitted': 0,
            'description': data['description']
        }
        ASSIGNMENTS['teacher'].append(teacher_assignment)
        
        # 添加到课代表作业列表
        monitor_assignment = {
            'id': new_id,
            'title': data['title'],
            'assignDate': new_assignment['assignDate'],
            'dueDate': data['dueDate'],
            'status': 'pending',
            'attempts': 0,
            'classSubmitted': 0,
            'classTotal': 35
        }
        ASSIGNMENTS['monitor'].append(monitor_assignment)
        
        return jsonify({
            'success': True,
            'message': '作业创建成功',
            'assignment': new_assignment
        })
        
    except Exception as e:
        return jsonify({'message': f'创建作业失败: {str(e)}'}), 500

# 教师更新作业状态 API
@app.route('/api/teacher/homework/update', methods=['PUT'])
@token_required
@auto_save_data('assignments')
def update_homework_status(current_user):
    """教师更新作业状态"""
    if current_user['role'] != 'teacher':
        return jsonify({'message': '无权限'}), 403
    
    try:
        data = request.get_json()
        homework_id = data.get('id')
        new_status = data.get('status')
        
        if not homework_id or not new_status:
            return jsonify({'message': '作业ID和状态不能为空'}), 400
        
        # 更新教师作业列表中的状态
        for assignment in ASSIGNMENTS['teacher']:
            if assignment['id'] == homework_id:
                assignment['status'] = new_status
                break
        else:
            return jsonify({'message': '作业不存在'}), 404
        
        return jsonify({
            'success': True,
            'message': '作业状态更新成功'
        })
        
    except Exception as e:
        return jsonify({'message': f'更新失败: {str(e)}'}), 500

# 课代表查看班级作业详情 API
@app.route('/api/monitor/homework/class-detail', methods=['GET'])
@token_required
def get_class_homework_detail(current_user):
    """课代表查看班级作业详情"""
    if current_user['role'] != 'monitor':
        return jsonify({'message': '无权限'}), 403
    
    homework_id = request.args.get('id')
    if not homework_id:
        return jsonify({'message': '作业ID不能为空'}), 400
    
    try:
        homework_id = int(homework_id)
    except ValueError:
        return jsonify({'message': '作业ID格式错误'}), 400
    
    # 查找作业信息
    assignment = None
    for hw in ASSIGNMENTS['student']:
        if hw['id'] == homework_id:
            assignment = hw
            break
    
    if not assignment:
        return jsonify({'message': '作业不存在'}), 404
    
    # 模拟班级学生数据和提交情况
    students = []
    for i in range(1, 36):  # 35个学生
        student_id = i
        submission_key = f"{student_id}_{homework_id}"
        submission = HOMEWORK_SUBMISSIONS.get(submission_key)
        
        student_data = {
            'id': student_id,
            'name': f'学生{i:02d}',
            'studentNo': f'2024{i:04d}',
            'submitted': bool(submission and submission.get('submitted')),
            'submitTime': submission.get('submitTime') if submission else None,
            'status': 'submitted' if (submission and submission.get('submitted')) else 'pending'
        }
        
        # 检查是否过期
        if not student_data['submitted']:
            from datetime import datetime
            try:
                due_date = datetime.strptime(assignment['dueDate'], '%Y-%m-%d')
                current_date = datetime.now()
                if current_date > due_date:
                    student_data['status'] = 'overdue'
            except ValueError:
                pass
        
        students.append(student_data)
    
    # 统计信息
    submitted_count = len([s for s in students if s['submitted']])
    pending_count = len([s for s in students if s['status'] == 'pending'])
    overdue_count = len([s for s in students if s['status'] == 'overdue'])
    
    homework_detail = {
        'id': assignment['id'],
        'title': assignment['title'],
        'subject': assignment.get('subject', '未分类'),
        'teacher': assignment.get('teacher', '老师'),
        'assignDate': assignment['assignDate'],
        'dueDate': assignment['dueDate'],
        'description': assignment['description'],
        'totalStudents': len(students),
        'submittedCount': submitted_count,
        'pendingCount': pending_count,
        'overdueCount': overdue_count,
        'submitRate': round((submitted_count / len(students)) * 100) if students else 0
    }
    
    return jsonify({
        'homework': homework_detail,
        'students': students
    })

# 课代表提醒功能 API
@app.route('/api/monitor/homework/remind', methods=['POST'])
@token_required
def remind_students(current_user):
    """课代表提醒同学提交作业"""
    if current_user['role'] != 'monitor':
        return jsonify({'message': '无权限'}), 403
    
    try:
        data = request.get_json()
        homework_id = data.get('homeworkId')
        student_ids = data.get('studentIds', [])
        message = data.get('message', '请及时提交作业')
        
        if not homework_id:
            return jsonify({'message': '作业ID不能为空'}), 400
        
        if not student_ids:
            return jsonify({'message': '请选择要提醒的同学'}), 400
        
        # 这里可以实现实际的提醒功能（如发送消息、邮件等）
        # 目前只是模拟记录
        remind_record = {
            'id': len(HOMEWORK_SUBMISSIONS) + 1,
            'homeworkId': homework_id,
            'monitorId': current_user['id'],
            'studentIds': student_ids,
            'message': message,
            'remindTime': datetime.now().isoformat(),
            'type': 'homework_reminder'
        }
        
        # 可以将提醒记录保存到数据库
        # HOMEWORK_SUBMISSIONS[f"remind_{remind_record['id']}"] = remind_record
        
        return jsonify({
            'success': True,
            'message': f'成功提醒了 {len(student_ids)} 位同学',
            'remindCount': len(student_ids)
        })
        
    except Exception as e:
        return jsonify({'message': f'提醒失败: {str(e)}'}), 500

# 获取学生作业列表
@app.route('/api/student/homework/list', methods=['GET'])
@token_required
def get_student_homework_list(current_user):
    """获取学生作业列表"""
    if current_user['role'] != 'student':
        return jsonify({'message': '无权限'}), 403
    
    # 使用真实的作业数据，并更新提交状态
    homework_list = []
    for assignment in ASSIGNMENTS['student']:
        submission_key = f"{current_user['id']}_{assignment['id']}"
        submission = HOMEWORK_SUBMISSIONS.get(submission_key)
        
        # 复制基本作业信息
        homework_item = {
            'id': assignment['id'],
            'title': assignment['title'],
            'assignDate': assignment['assignDate'],
            'dueDate': assignment['dueDate'],
            'description': assignment['description'],
            'subject': assignment.get('subject', '未分类'),
            'teacher': assignment.get('teacher', '老师'),
            'maxScore': assignment.get('maxScore', 100)
        }
        
        # 根据提交记录更新状态
        if submission:
            homework_item['status'] = 'submitted' if submission.get('submitted') else 'pending'
            homework_item['submitTime'] = submission.get('submitTime')
            homework_item['attempts'] = 1 if submission.get('submitted') else 0
        else:
            # 如果没有提交记录，检查默认状态
            homework_item['status'] = assignment.get('status', 'pending')
            homework_item['submitTime'] = assignment.get('submitTime')
            homework_item['attempts'] = assignment.get('attempts', 0)
        
        # 检查是否过期
        from datetime import datetime
        try:
            due_date = datetime.strptime(assignment['dueDate'], '%Y-%m-%d')
            current_date = datetime.now()
            if current_date > due_date and homework_item['status'] == 'pending':
                homework_item['status'] = 'overdue'
        except ValueError:
            # 如果日期格式不正确，保持原状态
            pass
        
        homework_list.append(homework_item)
    
    # 按ID排序
    homework_list.sort(key=lambda x: x['id'])
    
    return jsonify({'assignments': homework_list})

# 数据导出 API
@app.route('/api/admin/export', methods=['GET'])
def export_data():
    """导出所有数据为JSON"""
    try:
        export_data = {
            'exportTime': datetime.now().isoformat(),
            'version': '1.0',
            'users': USERS,
            'assignments': ASSIGNMENTS,
            'homework_details': HOMEWORK_DETAILS,
            'homework_submissions': HOMEWORK_SUBMISSIONS
        }
        
        response = make_response(jsonify(export_data))
        response.headers['Content-Disposition'] = f'attachment; filename=homework_data_{int(datetime.now().timestamp())}.json'
        response.headers['Content-Type'] = 'application/json'
        
        return response
        
    except Exception as e:
        return jsonify({'message': f'导出失败: {str(e)}'}), 500

# 数据导入 API
@app.route('/api/admin/import', methods=['POST'])
@auto_save_data('users')
@auto_save_data('assignments')
@auto_save_data('homework_details')
@auto_save_data('homework_submissions')
def import_data():
    """从JSON文件导入数据"""
    try:
        if 'file' not in request.files:
            return jsonify({'message': '没有上传文件'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'message': '没有选择文件'}), 400
        
        if not file.filename.endswith('.json'):
            return jsonify({'message': '只支持JSON格式文件'}), 400
        
        # 先备份当前数据
        data_manager.backup_all_data()
        
        # 读取上传的JSON数据
        import_data = json.load(file)
        
        # 验证数据格式
        required_keys = ['users', 'assignments', 'homework_details', 'homework_submissions']
        for key in required_keys:
            if key not in import_data:
                return jsonify({'message': f'数据格式错误，缺少 {key} 字段'}), 400
        
        # 更新全局数据
        global USERS, ASSIGNMENTS, HOMEWORK_DETAILS, HOMEWORK_SUBMISSIONS
        USERS = import_data['users']
        ASSIGNMENTS = import_data['assignments']
        HOMEWORK_DETAILS = import_data['homework_details']
        HOMEWORK_SUBMISSIONS = import_data['homework_submissions']
        
        return jsonify({
            'success': True,
            'message': '数据导入成功',
            'importTime': datetime.now().isoformat()
        })
        
    except json.JSONDecodeError:
        return jsonify({'message': '文件格式错误，不是有效的JSON文件'}), 400
    except Exception as e:
        return jsonify({'message': f'导入失败: {str(e)}'}), 500

# 应用关闭时保存数据
def save_all_data():
    """保存所有数据"""
    print("正在保存数据...")
    data_manager.save_data('users', USERS)
    data_manager.save_data('assignments', ASSIGNMENTS)
    data_manager.save_data('homework_details', HOMEWORK_DETAILS)
    data_manager.save_data('homework_submissions', HOMEWORK_SUBMISSIONS)
    print("✓ 数据保存完成")

atexit.register(save_all_data)

# 错误处理
@app.errorhandler(404)
def not_found(error):
    return jsonify({'message': '接口不存在'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'message': '服务器内部错误'}), 500

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 Mock API Server with Data Persistence")
    print("=" * 60)
    print(f"✓ 服务地址: http://localhost:5500")
    print(f"✓ 数据存储: {app.config['DATA_FOLDER']}/")
    print(f"✓ 文件上传: {app.config['UPLOAD_FOLDER']}/")
    print(f"✓ 认证方式: Http-Only Cookie")
    print("")
    print("📊 数据统计:")
    print(f"  • 用户数量: {len(USERS)}")
    print(f"  • 作业数量: {sum(len(assignments) for assignments in ASSIGNMENTS.values())}")
    print(f"  • 提交记录: {len(HOMEWORK_SUBMISSIONS)}")
    print("")
    print("🔧 管理接口:")
    print("  • POST /api/admin/backup - 手动备份数据")
    print("  • POST /api/admin/reset - 重置为默认数据")
    print("  • GET  /api/admin/stats - 获取数据统计")
    print("  • GET  /api/admin/export - 导出所有数据")
    print("  • POST /api/admin/import - 从文件导入数据")
    print("")
    print("🌐 主要 API:")
    print("  • POST /api/auth/login - 用户登录")
    print("  • POST /api/auth/register - 用户注册")
    print("  • POST /api/auth/logout - 用户退出")
    print("  • GET  /api/auth/me - 获取当前用户")
    print("  • POST /api/auth/refresh - 刷新token")
    print("  • GET  /api/student/* - 学生相关接口")
    print("  • GET  /api/teacher/* - 教师相关接口")
    print("  • GET  /api/monitor/* - 课代表相关接口")
    print("")
    print("📚 作业管理 API:")
    print("  • GET  /api/student/homework/view - 查看作业详情")
    print("  • POST /api/student/homework/submit - 提交作业")
    print("  • POST /api/student/homework/save-draft - 保存草稿")
    print("  • POST /api/teacher/homework/create - 创建新作业")
    print("  • PUT  /api/teacher/homework/update - 更新作业状态")
    print("  • GET  /api/monitor/homework/class-detail - 查看班级作业详情")
    print("  • POST /api/monitor/homework/remind - 提醒同学提交作业")
    print("=" * 60)
    
    app.run(debug=True, host='0.0.0.0', port=5500)