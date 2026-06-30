from flask import Blueprint, jsonify, request
import uuid
from datetime import datetime, timedelta

bp = Blueprint('recruitment', __name__, url_prefix='/api/recruitment')

# Fixed IDs — must match src/data/mockRecruitmentData.ts JOB_IDS
_JOB_IDS = {
    'senior_swe':       'jb-001',
    'product_manager':  'jb-002',
    'ux_designer':      'jb-003',
    'devops':           'jb-004',
    'marketing_intern': 'jb-005',
}

MOCK_JOB_POSTINGS = [
    {
        'id': _JOB_IDS['senior_swe'],
        'title': 'Senior Software Engineer',
        'department': 'Engineering',
        'location': 'Bengaluru, Karnataka',
        'type': 'full_time',
        'status': 'open',
        'description': 'We are looking for a Senior Software Engineer to join our engineering team in Bengaluru.',
        'requirements': '5+ years of experience, Python, React, strong system design skills.',
        'salaryRange': '₹15 LPA – ₹25 LPA',
        'postedDate': (datetime.now() - timedelta(days=10)).isoformat(),
        'closingDate': (datetime.now() + timedelta(days=20)).isoformat(),
        'createdBy': 'HR Manager',
        'applicantCount': 4,
    },
    {
        'id': _JOB_IDS['product_manager'],
        'title': 'Product Manager',
        'department': 'Product',
        'location': 'Mumbai, Maharashtra',
        'type': 'full_time',
        'status': 'open',
        'description': 'Seeking an experienced Product Manager to drive product strategy at our Mumbai office.',
        'requirements': '3+ years of PM experience, strong analytical skills, excellent communication.',
        'salaryRange': '₹18 LPA – ₹28 LPA',
        'postedDate': (datetime.now() - timedelta(days=5)).isoformat(),
        'closingDate': (datetime.now() + timedelta(days=25)).isoformat(),
        'createdBy': 'HR Manager',
        'applicantCount': 3,
    },
    {
        'id': _JOB_IDS['ux_designer'],
        'title': 'UX Designer',
        'department': 'Design',
        'location': 'Hyderabad, Telangana',
        'type': 'full_time',
        'status': 'draft',
        'description': 'Looking for a talented UX Designer to improve our user experience at our Hyderabad office.',
        'requirements': 'Figma, user research, prototyping, 2+ years experience.',
        'salaryRange': '₹8 LPA – ₹15 LPA',
        'postedDate': datetime.now().isoformat(),
        'closingDate': (datetime.now() + timedelta(days=30)).isoformat(),
        'createdBy': 'HR Manager',
        'applicantCount': 0,
    },
    {
        'id': _JOB_IDS['devops'],
        'title': 'DevOps Engineer',
        'department': 'Engineering',
        'location': 'Pune, Maharashtra',
        'type': 'contract',
        'status': 'closed',
        'description': 'Contract DevOps engineer needed for a 6-month infrastructure project at our Pune office.',
        'requirements': 'AWS, Terraform, Kubernetes, CI/CD pipelines.',
        'salaryRange': '₹800/hr – ₹1,200/hr',
        'postedDate': (datetime.now() - timedelta(days=45)).isoformat(),
        'closingDate': (datetime.now() - timedelta(days=5)).isoformat(),
        'createdBy': 'HR Manager',
        'applicantCount': 5,
    },
    {
        'id': _JOB_IDS['marketing_intern'],
        'title': 'Marketing Intern',
        'department': 'Marketing',
        'location': 'Chennai, Tamil Nadu',
        'type': 'internship',
        'status': 'open',
        'description': 'Summer internship opportunity for marketing students based in Chennai.',
        'requirements': 'Pursuing a degree in Marketing or Business, social media savvy.',
        'salaryRange': '₹15,000/month – ₹25,000/month',
        'postedDate': (datetime.now() - timedelta(days=3)).isoformat(),
        'closingDate': (datetime.now() + timedelta(days=15)).isoformat(),
        'createdBy': 'HR Manager',
        'applicantCount': 3,
    },
]

MOCK_APPLICANTS = [
    {
        'id': 'ap-001',
        'jobId': _JOB_IDS['senior_swe'],
        'jobTitle': 'Senior Software Engineer',
        'firstName': 'Ananya',
        'lastName': 'Sharma',
        'email': 'ananya.sharma@email.com',
        'phone': '+91 98201 11234',
        'status': 'interview',
        'appliedDate': (datetime.now() - timedelta(days=8)).isoformat(),
        'resumeUrl': '',
        'notes': 'Strong Python background. Scheduled for technical round.',
    },
    {
        'id': 'ap-002',
        'jobId': _JOB_IDS['senior_swe'],
        'jobTitle': 'Senior Software Engineer',
        'firstName': 'Rahul',
        'lastName': 'Verma',
        'email': 'rahul.verma@email.com',
        'phone': '+91 98202 55678',
        'status': 'screening',
        'appliedDate': (datetime.now() - timedelta(days=6)).isoformat(),
        'resumeUrl': '',
        'notes': '7 years experience at product companies. Portfolio looks promising.',
    },
    {
        'id': 'ap-003',
        'jobId': _JOB_IDS['senior_swe'],
        'jobTitle': 'Senior Software Engineer',
        'firstName': 'Kavya',
        'lastName': 'Reddy',
        'email': 'kavya.reddy@email.com',
        'phone': '+91 98203 99012',
        'status': 'applied',
        'appliedDate': (datetime.now() - timedelta(days=2)).isoformat(),
        'resumeUrl': '',
        'notes': '',
    },
    {
        'id': 'ap-004',
        'jobId': _JOB_IDS['senior_swe'],
        'jobTitle': 'Senior Software Engineer',
        'firstName': 'Arjun',
        'lastName': 'Singh',
        'email': 'arjun.singh@email.com',
        'phone': '+91 98204 33456',
        'status': 'rejected',
        'appliedDate': (datetime.now() - timedelta(days=12)).isoformat(),
        'resumeUrl': '',
        'notes': 'Did not meet minimum experience requirements.',
    },
    {
        'id': 'ap-005',
        'jobId': _JOB_IDS['product_manager'],
        'jobTitle': 'Product Manager',
        'firstName': 'Deepika',
        'lastName': 'Iyer',
        'email': 'deepika.iyer@email.com',
        'phone': '+91 98205 77890',
        'status': 'offer',
        'appliedDate': (datetime.now() - timedelta(days=20)).isoformat(),
        'resumeUrl': '',
        'notes': 'Excellent cultural fit. Offer extended.',
    },
    {
        'id': 'ap-006',
        'jobId': _JOB_IDS['product_manager'],
        'jobTitle': 'Product Manager',
        'firstName': 'Vikram',
        'lastName': 'Mehta',
        'email': 'vikram.mehta@email.com',
        'phone': '+91 98206 22345',
        'status': 'interview',
        'appliedDate': (datetime.now() - timedelta(days=10)).isoformat(),
        'resumeUrl': '',
        'notes': 'Second interview scheduled for next week.',
    },
    {
        'id': 'ap-007',
        'jobId': _JOB_IDS['product_manager'],
        'jobTitle': 'Product Manager',
        'firstName': 'Sneha',
        'lastName': 'Joshi',
        'email': 'sneha.joshi@email.com',
        'phone': '+91 98207 66789',
        'status': 'screening',
        'appliedDate': (datetime.now() - timedelta(days=4)).isoformat(),
        'resumeUrl': '',
        'notes': '',
    },
    {
        'id': 'ap-008',
        'jobId': _JOB_IDS['devops'],
        'jobTitle': 'DevOps Engineer',
        'firstName': 'Rohan',
        'lastName': 'Patel',
        'email': 'rohan.patel@email.com',
        'phone': '+91 98208 00123',
        'status': 'hired',
        'appliedDate': (datetime.now() - timedelta(days=40)).isoformat(),
        'resumeUrl': '',
        'notes': 'Accepted offer. Starting next month.',
    },
    {
        'id': 'ap-009',
        'jobId': _JOB_IDS['devops'],
        'jobTitle': 'DevOps Engineer',
        'firstName': 'Pooja',
        'lastName': 'Gupta',
        'email': 'pooja.gupta@email.com',
        'phone': '+91 98209 44567',
        'status': 'rejected',
        'appliedDate': (datetime.now() - timedelta(days=35)).isoformat(),
        'resumeUrl': '',
        'notes': 'Lacked Kubernetes experience.',
    },
    {
        'id': 'ap-010',
        'jobId': _JOB_IDS['marketing_intern'],
        'jobTitle': 'Marketing Intern',
        'firstName': 'Karan',
        'lastName': 'Malhotra',
        'email': 'karan.malhotra@email.com',
        'phone': '+91 98210 88901',
        'status': 'applied',
        'appliedDate': (datetime.now() - timedelta(days=1)).isoformat(),
        'resumeUrl': '',
        'notes': '',
    },
    {
        'id': 'ap-011',
        'jobId': _JOB_IDS['marketing_intern'],
        'jobTitle': 'Marketing Intern',
        'firstName': 'Neha',
        'lastName': 'Kulkarni',
        'email': 'neha.kulkarni@email.com',
        'phone': '+91 98211 22345',
        'status': 'screening',
        'appliedDate': (datetime.now() - timedelta(days=3)).isoformat(),
        'resumeUrl': '',
        'notes': 'Strong social media portfolio.',
    },
    {
        'id': 'ap-012',
        'jobId': _JOB_IDS['marketing_intern'],
        'jobTitle': 'Marketing Intern',
        'firstName': 'Aditya',
        'lastName': 'Kumar',
        'email': 'aditya.kumar@email.com',
        'phone': '+91 98212 66789',
        'status': 'interview',
        'appliedDate': (datetime.now() - timedelta(days=5)).isoformat(),
        'resumeUrl': '',
        'notes': 'Phone screen went well.',
    },
]

# ── Job Postings ──────────────────────────────────────────────────────────────

@bp.route('/jobs', methods=['GET'])
def get_jobs():
    status = request.args.get('status')
    jobs = MOCK_JOB_POSTINGS
    if status:
        jobs = [j for j in jobs if j['status'] == status]
    return jsonify({'jobs': jobs}), 200


@bp.route('/jobs/<job_id>', methods=['GET'])
def get_job(job_id):
    job = next((j for j in MOCK_JOB_POSTINGS if j['id'] == job_id), None)
    if not job:
        return jsonify({'error': 'Job posting not found'}), 404
    return jsonify(job), 200


@bp.route('/jobs', methods=['POST'])
def create_job():
    data = request.get_json()
    job = {
        'id': str(uuid.uuid4()),
        'title': data.get('title'),
        'department': data.get('department'),
        'location': data.get('location'),
        'type': data.get('type', 'full_time'),
        'status': data.get('status', 'draft'),
        'description': data.get('description', ''),
        'requirements': data.get('requirements', ''),
        'salaryRange': data.get('salaryRange', ''),
        'postedDate': datetime.now().isoformat(),
        'closingDate': data.get('closingDate', (datetime.now() + timedelta(days=30)).isoformat()),
        'createdBy': data.get('createdBy', 'HR Manager'),
        'applicantCount': 0,
    }
    MOCK_JOB_POSTINGS.append(job)
    return jsonify(job), 201


@bp.route('/jobs/<job_id>', methods=['PUT'])
def update_job(job_id):
    job = next((j for j in MOCK_JOB_POSTINGS if j['id'] == job_id), None)
    if not job:
        return jsonify({'error': 'Job posting not found'}), 404
    data = request.get_json()
    job.update({k: v for k, v in data.items() if k not in ('id', 'postedDate', 'applicantCount')})
    return jsonify(job), 200


@bp.route('/jobs/<job_id>', methods=['DELETE'])
def delete_job(job_id):
    global MOCK_JOB_POSTINGS
    MOCK_JOB_POSTINGS = [j for j in MOCK_JOB_POSTINGS if j['id'] != job_id]
    return jsonify({'success': True}), 200


# ── Applicants ────────────────────────────────────────────────────────────────

@bp.route('/applicants', methods=['GET'])
def get_applicants():
    job_id = request.args.get('jobId')
    status = request.args.get('status')
    applicants = MOCK_APPLICANTS
    if job_id:
        applicants = [a for a in applicants if a['jobId'] == job_id]
    if status:
        applicants = [a for a in applicants if a['status'] == status]
    return jsonify({'applicants': applicants}), 200


@bp.route('/applicants/<applicant_id>', methods=['GET'])
def get_applicant(applicant_id):
    applicant = next((a for a in MOCK_APPLICANTS if a['id'] == applicant_id), None)
    if not applicant:
        return jsonify({'error': 'Applicant not found'}), 404
    return jsonify(applicant), 200


@bp.route('/applicants', methods=['POST'])
def create_applicant():
    data = request.get_json()
    job = next((j for j in MOCK_JOB_POSTINGS if j['id'] == data.get('jobId')), None)
    applicant = {
        'id': str(uuid.uuid4()),
        'jobId': data.get('jobId', ''),
        'jobTitle': job['title'] if job else data.get('jobTitle', ''),
        'firstName': data.get('firstName', ''),
        'lastName': data.get('lastName', ''),
        'email': data.get('email', ''),
        'phone': data.get('phone', ''),
        'status': data.get('status', 'applied'),
        'appliedDate': datetime.now().isoformat(),
        'resumeUrl': data.get('resumeUrl', ''),
        'notes': data.get('notes', ''),
    }
    MOCK_APPLICANTS.append(applicant)
    if job:
        job['applicantCount'] = job.get('applicantCount', 0) + 1
    return jsonify(applicant), 201


@bp.route('/applicants/<applicant_id>', methods=['PUT'])
def update_applicant(applicant_id):
    applicant = next((a for a in MOCK_APPLICANTS if a['id'] == applicant_id), None)
    if not applicant:
        return jsonify({'error': 'Applicant not found'}), 404
    data = request.get_json()
    applicant.update({k: v for k, v in data.items() if k not in ('id', 'appliedDate')})
    return jsonify(applicant), 200


@bp.route('/applicants/<applicant_id>', methods=['DELETE'])
def delete_applicant(applicant_id):
    global MOCK_APPLICANTS
    applicant = next((a for a in MOCK_APPLICANTS if a['id'] == applicant_id), None)
    if applicant:
        job = next((j for j in MOCK_JOB_POSTINGS if j['id'] == applicant['jobId']), None)
        if job and job.get('applicantCount', 0) > 0:
            job['applicantCount'] -= 1
    MOCK_APPLICANTS = [a for a in MOCK_APPLICANTS if a['id'] != applicant_id]
    return jsonify({'success': True}), 200


# ── Interviews ────────────────────────────────────────────────────────────────

def _hours_from(h):
    return (datetime.now() + timedelta(hours=h)).isoformat()

MOCK_INTERVIEWS = [
    {
        'id': 'iv-001', 'applicantId': 'ap-001', 'applicantName': 'Ananya Sharma',
        'jobTitle': 'Senior Software Engineer', 'type': 'phone',
        'scheduledDate': (datetime.now() - timedelta(days=8)).isoformat(),
        'duration': 30, 'interviewers': ['Sunita Rao'], 'location': 'Phone call',
        'status': 'completed', 'notes': 'Great communication skills. Move to technical round.',
    },
    {
        'id': 'iv-002', 'applicantId': 'ap-001', 'applicantName': 'Ananya Sharma',
        'jobTitle': 'Senior Software Engineer', 'type': 'technical',
        'scheduledDate': (datetime.now() + timedelta(days=2)).isoformat(),
        'duration': 90, 'interviewers': ['Jayesh Kumar', 'Priya Nair'], 'location': 'Google Meet',
        'status': 'scheduled', 'notes': 'System design + coding challenge.',
    },
    {
        'id': 'iv-003', 'applicantId': 'ap-006', 'applicantName': 'Vikram Mehta',
        'jobTitle': 'Product Manager', 'type': 'video',
        'scheduledDate': (datetime.now() - timedelta(days=6)).isoformat(),
        'duration': 45, 'interviewers': ['Sunita Rao'], 'location': 'Zoom',
        'status': 'completed', 'notes': 'Strong product thinking. Proceed to panel.',
    },
    {
        'id': 'iv-004', 'applicantId': 'ap-006', 'applicantName': 'Vikram Mehta',
        'jobTitle': 'Product Manager', 'type': 'onsite',
        'scheduledDate': (datetime.now() + timedelta(days=4)).isoformat(),
        'duration': 120, 'interviewers': ['Sunita Rao', 'Manish Gupta', 'Divya Sharma'],
        'location': 'HQ — Room 3B', 'status': 'scheduled', 'notes': 'Panel interview with leadership.',
    },
    {
        'id': 'iv-005', 'applicantId': 'ap-012', 'applicantName': 'Aditya Kumar',
        'jobTitle': 'Marketing Intern', 'type': 'phone',
        'scheduledDate': _hours_from(2),
        'duration': 30, 'interviewers': ['Sunita Rao'], 'location': 'Phone call',
        'status': 'scheduled', 'notes': '',
    },
    {
        'id': 'iv-006', 'applicantId': 'ap-008', 'applicantName': 'Rohan Patel',
        'jobTitle': 'DevOps Engineer', 'type': 'technical',
        'scheduledDate': (datetime.now() - timedelta(days=35)).isoformat(),
        'duration': 90, 'interviewers': ['Jayesh Kumar'], 'location': 'Google Meet',
        'status': 'completed', 'notes': 'Excellent Kubernetes & AWS knowledge.',
    },
    {
        'id': 'iv-007', 'applicantId': 'ap-008', 'applicantName': 'Rohan Patel',
        'jobTitle': 'DevOps Engineer', 'type': 'onsite',
        'scheduledDate': (datetime.now() - timedelta(days=28)).isoformat(),
        'duration': 120, 'interviewers': ['Jayesh Kumar', 'Manish Gupta'], 'location': 'HQ — Room 2A',
        'status': 'completed', 'notes': 'Strong all-round. Recommend hire.',
    },
    {
        'id': 'iv-008', 'applicantId': 'ap-005', 'applicantName': 'Deepika Iyer',
        'jobTitle': 'Product Manager', 'type': 'video',
        'scheduledDate': (datetime.now() - timedelta(days=15)).isoformat(),
        'duration': 60, 'interviewers': ['Sunita Rao', 'Divya Sharma'], 'location': 'Zoom',
        'status': 'completed', 'notes': 'Excellent culture fit and strategic thinking.',
    },
    {
        'id': 'iv-009', 'applicantId': 'ap-005', 'applicantName': 'Deepika Iyer',
        'jobTitle': 'Product Manager', 'type': 'onsite',
        'scheduledDate': (datetime.now() - timedelta(days=10)).isoformat(),
        'duration': 90, 'interviewers': ['Sunita Rao', 'Manish Gupta', 'Divya Sharma'],
        'location': 'HQ — Room 1A', 'status': 'completed', 'notes': 'Unanimous — extend offer.',
    },
    {
        'id': 'iv-010', 'applicantId': 'ap-002', 'applicantName': 'Rahul Verma',
        'jobTitle': 'Senior Software Engineer', 'type': 'phone',
        'scheduledDate': (datetime.now() - timedelta(days=3)).isoformat(),
        'duration': 30, 'interviewers': ['Sunita Rao'], 'location': 'Phone call',
        'status': 'no_show', 'notes': 'Did not answer. Follow-up email sent.',
    },
]


@bp.route('/interviews', methods=['GET'])
def get_interviews():
    applicant_id = request.args.get('applicantId')
    status = request.args.get('status')
    interviews = MOCK_INTERVIEWS
    if applicant_id:
        interviews = [i for i in interviews if i['applicantId'] == applicant_id]
    if status:
        interviews = [i for i in interviews if i['status'] == status]
    return jsonify({'interviews': interviews}), 200


@bp.route('/interviews/<interview_id>', methods=['GET'])
def get_interview(interview_id):
    interview = next((i for i in MOCK_INTERVIEWS if i['id'] == interview_id), None)
    if not interview:
        return jsonify({'error': 'Interview not found'}), 404
    return jsonify(interview), 200


@bp.route('/interviews', methods=['POST'])
def create_interview():
    data = request.get_json()
    interview = {
        'id': str(uuid.uuid4()),
        'applicantId': data.get('applicantId', ''),
        'applicantName': data.get('applicantName', ''),
        'jobTitle': data.get('jobTitle', ''),
        'type': data.get('type', 'phone'),
        'scheduledDate': data.get('scheduledDate', datetime.now().isoformat()),
        'duration': data.get('duration', 30),
        'interviewers': data.get('interviewers', []),
        'location': data.get('location', ''),
        'status': data.get('status', 'scheduled'),
        'notes': data.get('notes', ''),
    }
    MOCK_INTERVIEWS.append(interview)
    return jsonify(interview), 201


@bp.route('/interviews/<interview_id>', methods=['PUT'])
def update_interview(interview_id):
    interview = next((i for i in MOCK_INTERVIEWS if i['id'] == interview_id), None)
    if not interview:
        return jsonify({'error': 'Interview not found'}), 404
    data = request.get_json()
    interview.update({k: v for k, v in data.items() if k != 'id'})
    return jsonify(interview), 200


@bp.route('/interviews/<interview_id>', methods=['DELETE'])
def delete_interview(interview_id):
    global MOCK_INTERVIEWS
    MOCK_INTERVIEWS = [i for i in MOCK_INTERVIEWS if i['id'] != interview_id]
    return jsonify({'success': True}), 200


# ── Offers ────────────────────────────────────────────────────────────────────

MOCK_OFFERS = [
    {
        'id': 'of-001',
        'applicantId': 'ap-005',
        'applicantName': 'Deepika Iyer',
        'jobTitle': 'Product Manager',
        'salary': 2200000,
        'currency': 'INR',
        'startDate': (datetime.now() + timedelta(days=30)).isoformat(),
        'expiryDate': (datetime.now() + timedelta(days=7)).isoformat(),
        'status': 'pending',
        'notes': 'Awaiting candidate response. Competitive package with variable pay included.',
        'createdAt': (datetime.now() - timedelta(days=5)).isoformat(),
    },
    {
        'id': 'of-002',
        'applicantId': 'ap-008',
        'applicantName': 'Rohan Patel',
        'jobTitle': 'DevOps Engineer',
        'salary': 1800000,
        'currency': 'INR',
        'startDate': (datetime.now() + timedelta(days=14)).isoformat(),
        'expiryDate': (datetime.now() - timedelta(days=10)).isoformat(),
        'status': 'accepted',
        'notes': 'Candidate accepted. Background verification in progress.',
        'createdAt': (datetime.now() - timedelta(days=25)).isoformat(),
    },
    {
        'id': 'of-003',
        'applicantId': 'ap-002',
        'applicantName': 'Rahul Verma',
        'jobTitle': 'Senior Software Engineer',
        'salary': 2500000,
        'currency': 'INR',
        'startDate': (datetime.now() + timedelta(days=21)).isoformat(),
        'expiryDate': (datetime.now() + timedelta(days=10)).isoformat(),
        'status': 'pending',
        'notes': 'First choice candidate. Fast-track if possible.',
        'createdAt': (datetime.now() - timedelta(days=2)).isoformat(),
    },
    {
        'id': 'of-004',
        'applicantId': 'ap-007',
        'applicantName': 'Sneha Joshi',
        'jobTitle': 'Product Manager',
        'salary': 1600000,
        'currency': 'INR',
        'startDate': (datetime.now() - timedelta(days=5)).isoformat(),
        'expiryDate': (datetime.now() - timedelta(days=15)).isoformat(),
        'status': 'declined',
        'notes': 'Candidate cited a competing offer with better compensation.',
        'createdAt': (datetime.now() - timedelta(days=20)).isoformat(),
    },
    {
        'id': 'of-005',
        'applicantId': 'ap-009',
        'applicantName': 'Pooja Gupta',
        'jobTitle': 'DevOps Engineer',
        'salary': 2000000,
        'currency': 'INR',
        'startDate': (datetime.now() - timedelta(days=2)).isoformat(),
        'expiryDate': (datetime.now() - timedelta(days=3)).isoformat(),
        'status': 'expired',
        'notes': 'Offer expired without response. Candidate unreachable.',
        'createdAt': (datetime.now() - timedelta(days=33)).isoformat(),
    },
]


@bp.route('/offers', methods=['GET'])
def get_offers():
    applicant_id = request.args.get('applicantId')
    status = request.args.get('status')
    offers = MOCK_OFFERS
    if applicant_id:
        offers = [o for o in offers if o['applicantId'] == applicant_id]
    if status:
        offers = [o for o in offers if o['status'] == status]
    return jsonify({'offers': offers}), 200


@bp.route('/offers/<offer_id>', methods=['GET'])
def get_offer(offer_id):
    offer = next((o for o in MOCK_OFFERS if o['id'] == offer_id), None)
    if not offer:
        return jsonify({'error': 'Offer not found'}), 404
    return jsonify(offer), 200


@bp.route('/offers', methods=['POST'])
def create_offer():
    data = request.get_json()
    offer = {
        'id': str(uuid.uuid4()),
        'applicantId': data.get('applicantId', ''),
        'applicantName': data.get('applicantName', ''),
        'jobTitle': data.get('jobTitle', ''),
        'salary': data.get('salary', 0),
        'currency': data.get('currency', 'INR'),
        'startDate': data.get('startDate', datetime.now().isoformat()),
        'expiryDate': data.get('expiryDate', (datetime.now() + timedelta(days=14)).isoformat()),
        'status': data.get('status', 'pending'),
        'notes': data.get('notes', ''),
        'createdAt': datetime.now().isoformat(),
    }
    MOCK_OFFERS.append(offer)
    return jsonify(offer), 201


@bp.route('/offers/<offer_id>', methods=['PUT'])
def update_offer(offer_id):
    offer = next((o for o in MOCK_OFFERS if o['id'] == offer_id), None)
    if not offer:
        return jsonify({'error': 'Offer not found'}), 404
    data = request.get_json()
    offer.update({k: v for k, v in data.items() if k not in ('id', 'createdAt')})
    return jsonify(offer), 200


@bp.route('/offers/<offer_id>', methods=['DELETE'])
def delete_offer(offer_id):
    global MOCK_OFFERS
    MOCK_OFFERS = [o for o in MOCK_OFFERS if o['id'] != offer_id]
    return jsonify({'success': True}), 200
