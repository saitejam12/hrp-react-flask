"""Main API blueprint for all project endpoints."""
from flask import Blueprint, jsonify, request
import uuid
from datetime import datetime, timedelta

bp = Blueprint('api', __name__, url_prefix='/api')


@bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'ok', 'service': 'hrp-server'}), 200


# Authentication endpoints
MOCK_USERS = {
    'admin@example.com': {
        'id': str(uuid.uuid4()),
        'email': 'admin@example.com',
        'password': 'password123',
        'name': 'Admin User',
        'role': 'admin',
        'department': 'Management',
        'createdAt': datetime.now().isoformat(),
    },
    'manager@example.com': {
        'id': str(uuid.uuid4()),
        'email': 'manager@example.com',
        'password': 'password123',
        'name': 'Manager User',
        'role': 'manager',
        'department': 'Operations',
        'createdAt': datetime.now().isoformat(),
    },
    'employee@example.com': {
        'id': str(uuid.uuid4()),
        'email': 'employee@example.com',
        'password': 'password123',
        'name': 'Employee User',
        'role': 'employee',
        'department': 'Engineering',
        'createdAt': datetime.now().isoformat(),
    },
}


@bp.route('/auth/login', methods=['POST'])
def login():
    """Login endpoint."""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = MOCK_USERS.get(email)
    if not user or user['password'] != password:
        return jsonify({'error': 'Invalid credentials'}), 401

    # Generate mock token
    token = f"mock_token_{user['id']}"

    return jsonify({
        'user': {
            'id': user['id'],
            'email': user['email'],
            'name': user['name'],
            'role': user['role'],
            'department': user['department'],
            'createdAt': user['createdAt'],
        },
        'token': token,
    }), 200


# Mock employees data
MOCK_EMPLOYEES = [
    {
        'id': str(uuid.uuid4()),
        'name': 'John Smith',
        'email': 'john.smith@example.com',
        'role': 'Senior Developer',
        'department': 'Engineering',
        'status': 'active',
        'joinDate': (datetime.now() - timedelta(days=365)).isoformat(),
    },
    {
        'id': str(uuid.uuid4()),
        'name': 'Sarah Johnson',
        'email': 'sarah.johnson@example.com',
        'role': 'Product Manager',
        'department': 'Product',
        'status': 'active',
        'joinDate': (datetime.now() - timedelta(days=180)).isoformat(),
    },
    {
        'id': str(uuid.uuid4()),
        'name': 'Mike Davis',
        'email': 'mike.davis@example.com',
        'role': 'Designer',
        'department': 'Design',
        'status': 'on_leave',
        'joinDate': (datetime.now() - timedelta(days=270)).isoformat(),
    },
    {
        'id': str(uuid.uuid4()),
        'name': 'Emily Brown',
        'email': 'emily.brown@example.com',
        'role': 'QA Engineer',
        'department': 'Quality Assurance',
        'status': 'active',
        'joinDate': (datetime.now() - timedelta(days=90)).isoformat(),
    },
    {
        'id': str(uuid.uuid4()),
        'name': 'Robert Wilson',
        'email': 'robert.wilson@example.com',
        'role': 'DevOps Engineer',
        'department': 'Engineering',
        'status': 'active',
        'joinDate': (datetime.now() - timedelta(days=200)).isoformat(),
    },
]


@bp.route('/employees', methods=['GET'])
def get_employees():
    """Get all employees."""
    return jsonify({'employees': MOCK_EMPLOYEES}), 200


@bp.route('/employees/<employee_id>', methods=['GET'])
def get_employee(employee_id):
    """Get a specific employee."""
    employee = next((e for e in MOCK_EMPLOYEES if e['id'] == employee_id), None)
    if not employee:
        return jsonify({'error': 'Employee not found'}), 404
    return jsonify(employee), 200


@bp.route('/employees', methods=['POST'])
def create_employee():
    """Create a new employee."""
    data = request.get_json()
    employee = {
        'id': str(uuid.uuid4()),
        'name': data.get('name'),
        'email': data.get('email'),
        'role': data.get('role'),
        'department': data.get('department'),
        'status': data.get('status', 'active'),
        'joinDate': datetime.now().isoformat(),
    }
    MOCK_EMPLOYEES.append(employee)
    return jsonify(employee), 201


@bp.route('/employees/<employee_id>', methods=['PUT'])
def update_employee(employee_id):
    """Update an employee."""
    employee = next((e for e in MOCK_EMPLOYEES if e['id'] == employee_id), None)
    if not employee:
        return jsonify({'error': 'Employee not found'}), 404

    data = request.get_json()
    employee.update(data)
    return jsonify(employee), 200


@bp.route('/employees/<employee_id>', methods=['DELETE'])
def delete_employee(employee_id):
    """Delete an employee."""
    global MOCK_EMPLOYEES
    MOCK_EMPLOYEES = [e for e in MOCK_EMPLOYEES if e['id'] != employee_id]
    return jsonify({'success': True}), 200


# Mock tasks data
MOCK_TASKS = [
    {
        'id': str(uuid.uuid4()),
        'title': 'Complete project proposal',
        'description': 'Finalize the Q3 project proposal document',
        'priority': 'high',
        'status': 'in_progress',
        'dueDate': (datetime.now() + timedelta(days=5)).isoformat(),
        'assignee': 'John Smith',
        'createdBy': 'Sarah Johnson',
        'createdAt': datetime.now().isoformat(),
    },
    {
        'id': str(uuid.uuid4()),
        'title': 'Team meeting preparation',
        'description': 'Prepare slides for weekly team sync',
        'priority': 'medium',
        'status': 'pending',
        'dueDate': (datetime.now() + timedelta(days=3)).isoformat(),
        'assignee': 'Emily Brown',
        'createdBy': 'Sarah Johnson',
        'createdAt': datetime.now().isoformat(),
    },
    {
        'id': str(uuid.uuid4()),
        'title': 'Code review',
        'description': 'Review PR #456 from the backend team',
        'priority': 'medium',
        'status': 'pending',
        'dueDate': (datetime.now() + timedelta(days=1)).isoformat(),
        'assignee': 'Robert Wilson',
        'createdBy': 'John Smith',
        'createdAt': datetime.now().isoformat(),
    },
    {
        'id': str(uuid.uuid4()),
        'title': 'Database optimization',
        'description': 'Optimize slow queries in production',
        'priority': 'high',
        'status': 'completed',
        'dueDate': (datetime.now() - timedelta(days=2)).isoformat(),
        'assignee': 'Robert Wilson',
        'createdBy': 'Sarah Johnson',
        'createdAt': (datetime.now() - timedelta(days=10)).isoformat(),
    },
]


@bp.route('/tasks', methods=['GET'])
def get_tasks():
    """Get all tasks."""
    status = request.args.get('status')
    assignee = request.args.get('assignee')

    tasks = MOCK_TASKS

    if status:
        tasks = [t for t in tasks if t['status'] == status]
    if assignee:
        tasks = [t for t in tasks if t['assignee'] == assignee]

    return jsonify({'tasks': tasks}), 200


@bp.route('/tasks/<task_id>', methods=['GET'])
def get_task(task_id):
    """Get a specific task."""
    task = next((t for t in MOCK_TASKS if t['id'] == task_id), None)
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    return jsonify(task), 200


@bp.route('/tasks', methods=['POST'])
def create_task():
    """Create a new task."""
    data = request.get_json()
    task = {
        'id': str(uuid.uuid4()),
        'title': data.get('title'),
        'description': data.get('description'),
        'priority': data.get('priority', 'medium'),
        'status': data.get('status', 'pending'),
        'dueDate': data.get('dueDate'),
        'assignee': data.get('assignee'),
        'createdBy': data.get('createdBy'),
        'createdAt': datetime.now().isoformat(),
    }
    MOCK_TASKS.append(task)
    return jsonify(task), 201


@bp.route('/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    """Update a task."""
    task = next((t for t in MOCK_TASKS if t['id'] == task_id), None)
    if not task:
        return jsonify({'error': 'Task not found'}), 404

    data = request.get_json()
    task.update(data)
    return jsonify(task), 200


@bp.route('/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Delete a task."""
    global MOCK_TASKS
    MOCK_TASKS = [t for t in MOCK_TASKS if t['id'] != task_id]
    return jsonify({'success': True}), 200
