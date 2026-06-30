from flask import Blueprint, jsonify, request
from datetime import datetime, date
import uuid

bp = Blueprint('leave', __name__, url_prefix='/api/leave')

DEFAULT_BALANCE = {
    'annual':    {'total': 21,  'used': 5, 'remaining': 16},
    'sick':      {'total': 10,  'used': 2, 'remaining': 8},
    'casual':    {'total': 12,  'used': 1, 'remaining': 11},
    'maternity': {'total': 182, 'used': 0, 'remaining': 182},
    'paternity': {'total': 15,  'used': 0, 'remaining': 15},
    'unpaid':    {'total': 30,  'used': 0, 'remaining': 30},
}

# In-memory store seeded with demo data (matches frontend mockLeaveData.ts)
_requests = [
    {
        'id': 'lr-001', 'employeeId': 'demo-4', 'employeeName': 'Priya Sharma',
        'department': 'Engineering', 'leaveType': 'annual',
        'startDate': '2026-07-10', 'endDate': '2026-07-14', 'days': 5,
        'reason': 'Family vacation', 'status': 'approved', 'appliedDate': '2026-07-01',
        'reviewedBy': 'Sunita Rao', 'reviewedDate': '2026-07-02', 'reviewNote': 'Approved',
    },
    {
        'id': 'lr-002', 'employeeId': 'demo-4', 'employeeName': 'Priya Sharma',
        'department': 'Engineering', 'leaveType': 'sick',
        'startDate': '2026-07-03', 'endDate': '2026-07-04', 'days': 2,
        'reason': 'Fever and cold', 'status': 'pending', 'appliedDate': '2026-07-02',
    },
    {
        'id': 'lr-003', 'employeeId': 'demo-2', 'employeeName': 'Sunita Rao',
        'department': 'Human Resources', 'leaveType': 'casual',
        'startDate': '2026-07-08', 'endDate': '2026-07-08', 'days': 1,
        'reason': 'Personal work', 'status': 'pending', 'appliedDate': '2026-07-01',
    },
    {
        'id': 'lr-004', 'employeeId': 'demo-1', 'employeeName': 'Rajesh Mehta',
        'department': 'Management', 'leaveType': 'annual',
        'startDate': '2026-07-20', 'endDate': '2026-07-25', 'days': 6,
        'reason': 'Annual vacation', 'status': 'rejected', 'appliedDate': '2026-06-28',
        'reviewedBy': 'Sunita Rao', 'reviewedDate': '2026-06-30',
        'reviewNote': 'Insufficient leave balance',
    },
    {
        'id': 'lr-005', 'employeeId': 'demo-3', 'employeeName': 'Vikram Kapoor',
        'department': 'Executive', 'leaveType': 'casual',
        'startDate': '2026-08-01', 'endDate': '2026-08-02', 'days': 2,
        'reason': 'Personal appointment', 'status': 'approved', 'appliedDate': '2026-07-01',
        'reviewedBy': 'Sunita Rao', 'reviewedDate': '2026-07-02',
    },
]

_encashments = [
    {
        'id': 'enc-001', 'employeeId': 'demo-4', 'employeeName': 'Priya Sharma',
        'department': 'Engineering', 'leaveType': 'annual', 'days': 5,
        'ratePerDay': 5769, 'totalAmount': 28845, 'status': 'approved',
        'requestedDate': '2026-06-15', 'processedDate': '2026-06-20',
    },
    {
        'id': 'enc-002', 'employeeId': 'demo-1', 'employeeName': 'Rajesh Mehta',
        'department': 'Management', 'leaveType': 'annual', 'days': 3,
        'ratePerDay': 7692, 'totalAmount': 23076, 'status': 'pending',
        'requestedDate': '2026-07-01',
    },
    {
        'id': 'enc-003', 'employeeId': 'demo-2', 'employeeName': 'Sunita Rao',
        'department': 'Human Resources', 'leaveType': 'casual', 'days': 2,
        'ratePerDay': 4808, 'totalAmount': 9616, 'status': 'paid',
        'requestedDate': '2026-05-10', 'processedDate': '2026-05-18',
    },
]

_balances = {}  # populated on first access per employee


def _get_balance(employee_id):
    if employee_id not in _balances:
        import copy
        _balances[employee_id] = {'employeeId': employee_id, **copy.deepcopy(DEFAULT_BALANCE)}
    return _balances[employee_id]


# ── Leave Requests ──────────────────────────────────────────────────────────

@bp.route('/requests', methods=['GET'])
def get_requests():
    status = request.args.get('status')
    result = [r for r in _requests if r['status'] == status] if status else _requests
    return jsonify({'requests': result})


@bp.route('/requests/my', methods=['GET'])
def get_my_requests():
    employee_id = request.args.get('employeeId', 'current')
    result = [r for r in _requests if r['employeeId'] == employee_id]
    return jsonify({'requests': result})


@bp.route('/requests', methods=['POST'])
def create_request():
    data = request.get_json()
    required = ['employeeId', 'employeeName', 'leaveType', 'startDate', 'endDate', 'days', 'reason']
    if not all(k in data for k in required):
        return jsonify({'error': 'Missing required fields'}), 400

    leave_request = {
        'id': f'lr-{uuid.uuid4().hex[:8]}',
        'status': 'pending',
        'appliedDate': date.today().isoformat(),
        **{k: data[k] for k in required},
        'department': data.get('department', ''),
    }
    _requests.insert(0, leave_request)
    return jsonify(leave_request), 201


@bp.route('/requests/<request_id>/status', methods=['PUT'])
def update_request_status(request_id):
    data = request.get_json()
    req = next((r for r in _requests if r['id'] == request_id), None)
    if not req:
        return jsonify({'error': 'Leave request not found'}), 404

    req['status'] = data.get('status', req['status'])
    req['reviewNote'] = data.get('reviewNote', '')
    req['reviewedDate'] = date.today().isoformat()

    if req['status'] == 'approved':
        bal = _get_balance(req['employeeId'])
        lt = req['leaveType']
        if lt in bal:
            bal[lt]['used'] += req['days']
            bal[lt]['remaining'] = bal[lt]['total'] - bal[lt]['used']

    return jsonify(req)


@bp.route('/requests/<request_id>/cancel', methods=['PUT'])
def cancel_request(request_id):
    req = next((r for r in _requests if r['id'] == request_id), None)
    if not req:
        return jsonify({'error': 'Leave request not found'}), 404
    if req['status'] != 'pending':
        return jsonify({'error': 'Only pending requests can be cancelled'}), 400
    req['status'] = 'cancelled'
    return jsonify(req)


# ── Leave Balance ───────────────────────────────────────────────────────────

@bp.route('/balance/<employee_id>', methods=['GET'])
def get_balance(employee_id):
    return jsonify({'balance': _get_balance(employee_id)})


# ── Leave Encashment ────────────────────────────────────────────────────────

@bp.route('/encashments', methods=['GET'])
def get_encashments():
    return jsonify({'encashments': _encashments})


@bp.route('/encashments', methods=['POST'])
def create_encashment():
    data = request.get_json()
    required = ['employeeId', 'employeeName', 'leaveType', 'days', 'ratePerDay', 'totalAmount']
    if not all(k in data for k in required):
        return jsonify({'error': 'Missing required fields'}), 400

    encashment = {
        'id': f'enc-{uuid.uuid4().hex[:8]}',
        'status': 'pending',
        'requestedDate': date.today().isoformat(),
        **{k: data[k] for k in required},
        'department': data.get('department', ''),
    }
    _encashments.insert(0, encashment)
    return jsonify(encashment), 201


@bp.route('/encashments/<encashment_id>/status', methods=['PUT'])
def update_encashment_status(encashment_id):
    data = request.get_json()
    enc = next((e for e in _encashments if e['id'] == encashment_id), None)
    if not enc:
        return jsonify({'error': 'Encashment not found'}), 404
    enc['status'] = data.get('status', enc['status'])
    enc['processedDate'] = date.today().isoformat()
    return jsonify(enc)
