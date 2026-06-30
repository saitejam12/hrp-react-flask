import { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  useMyLeaveRequests,
  useCreateLeaveRequest,
  useCancelLeaveRequest,
} from '../../hooks/useLeaveRequests';
import { useLeaveBalance } from '../../hooks/useLeaveBalance';
import type { LeaveType, LeaveRequest } from '../../types/leave';
import './ApplyLeavePage.css';

const LEAVE_TYPES: { value: LeaveType; label: string; color: string }[] = [
  { value: 'annual',    label: 'Annual Leave',    color: '#6366f1' },
  { value: 'sick',      label: 'Sick Leave',      color: '#ef4444' },
  { value: 'casual',    label: 'Casual Leave',    color: '#f59e0b' },
  { value: 'maternity', label: 'Maternity Leave', color: '#ec4899' },
  { value: 'paternity', label: 'Paternity Leave', color: '#3b82f6' },
  { value: 'unpaid',    label: 'Unpaid Leave',    color: '#6b7280' },
];

const STATUS_COLOR: Record<string, string> = {
  pending:   '#f59e0b',
  approved:  '#10b981',
  rejected:  '#ef4444',
  cancelled: '#6b7280',
};

function calcBusinessDays(start: string, end: string): number {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  if (e < s) return 0;
  let count = 0;
  const cur = new Date(s);
  while (cur <= e) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

const INITIAL_FORM = {
  leaveType: 'annual' as LeaveType,
  startDate: '',
  endDate: '',
  reason: '',
};

export function ApplyLeavePage() {
  const { user } = useAuth();
  const employeeId = user?.id ?? 'current';

  const { data: balance } = useLeaveBalance(employeeId);
  const { data: myRequests = [] } = useMyLeaveRequests(employeeId);
  const createMutation = useCreateLeaveRequest();
  const cancelMutation = useCancelLeaveRequest();

  const [form, setForm] = useState(INITIAL_FORM);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const days = useMemo(() => calcBusinessDays(form.startDate, form.endDate), [form.startDate, form.endDate]);
  const selectedBalance = balance ? balance[form.leaveType] : null;
  const insufficient = !!selectedBalance && days > 0 && days > selectedBalance.remaining;

  const sortedRequests = [...myRequests].sort(
    (a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
  );

  function handleChange(field: keyof typeof INITIAL_FORM, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    setErrorMsg('');
    setSuccessMsg('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.startDate || !form.endDate) { setErrorMsg('Please select start and end dates.'); return; }
    if (days === 0) { setErrorMsg('End date must be on or after start date.'); return; }
    if (!form.reason.trim()) { setErrorMsg('Please provide a reason.'); return; }
    if (insufficient) { setErrorMsg('Insufficient leave balance for selected dates.'); return; }

    createMutation.mutate(
      {
        employeeId,
        employeeName: user?.name ?? 'Employee',
        department: user?.department ?? 'General',
        leaveType: form.leaveType,
        startDate: form.startDate,
        endDate: form.endDate,
        days,
        reason: form.reason,
      },
      {
        onSuccess: () => {
          setForm(INITIAL_FORM);
          setSuccessMsg('Leave request submitted successfully!');
        },
        onError: () => setErrorMsg('Failed to submit. Please try again.'),
      }
    );
  }

  function handleCancel(id: string) {
    if (window.confirm('Cancel this leave request?')) {
      cancelMutation.mutate(id);
    }
  }

  return (
    <div className="apply-leave-page">
      <div className="page-header">
        <div>
          <h1>Apply for Leave</h1>
          <p>Submit a new leave request</p>
        </div>
      </div>

      <div className="apply-leave-layout">
        {/* Left — form */}
        <div className="apply-leave-main">
          {/* Balance strip */}
          {balance && (
            <div className="balance-strip">
              {LEAVE_TYPES.map(lt => {
                const bal = balance[lt.value];
                return (
                  <div
                    key={lt.value}
                    className={`balance-chip ${form.leaveType === lt.value ? 'active' : ''}`}
                    style={form.leaveType === lt.value ? { borderColor: lt.color, background: `${lt.color}10` } : {}}
                    onClick={() => handleChange('leaveType', lt.value)}
                  >
                    <span className="balance-chip-label">{lt.label}</span>
                    <span className="balance-chip-value" style={{ color: lt.color }}>
                      {bal.remaining}/{bal.total}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="form-card">
            <h2>Leave Request Form</h2>

            {successMsg && <div className="alert alert-success">{successMsg}</div>}
            {errorMsg   && <div className="alert alert-error">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="leave-form">
              <div className="form-group">
                <label>Leave Type</label>
                <select value={form.leaveType} onChange={e => handleChange('leaveType', e.target.value)}>
                  {LEAVE_TYPES.map(lt => (
                    <option key={lt.value} value={lt.value}>{lt.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => handleChange('startDate', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={form.endDate}
                    min={form.startDate || new Date().toISOString().split('T')[0]}
                    onChange={e => handleChange('endDate', e.target.value)}
                  />
                </div>
              </div>

              {days > 0 && (
                <div className={`days-summary ${insufficient ? 'insufficient' : ''}`}>
                  <span className="days-count">{days}</span>
                  <span className="days-label">
                    working day{days !== 1 ? 's' : ''} selected
                    {selectedBalance && (
                      <> &nbsp;·&nbsp; {selectedBalance.remaining} day{selectedBalance.remaining !== 1 ? 's' : ''} remaining</>
                    )}
                  </span>
                  {insufficient && <span className="days-warn">Insufficient balance</span>}
                </div>
              )}

              <div className="form-group">
                <label>Reason <span className="required">*</span></label>
                <textarea
                  rows={4}
                  placeholder="Briefly describe the reason for your leave..."
                  value={form.reason}
                  onChange={e => handleChange('reason', e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn-submit"
                disabled={createMutation.isPending || insufficient}
              >
                {createMutation.isPending ? 'Submitting…' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>

        {/* Right — my requests */}
        <div className="my-requests-panel">
          <h2>My Requests</h2>

          {sortedRequests.length === 0 ? (
            <div className="panel-empty">No leave requests yet.</div>
          ) : (
            <ul className="requests-list">
              {sortedRequests.map((req: LeaveRequest) => {
                const lt = LEAVE_TYPES.find(l => l.value === req.leaveType);
                return (
                  <li key={req.id} className="request-item">
                    <div className="request-item-top">
                      <span className="request-type" style={{ color: lt?.color }}>
                        {lt?.label}
                      </span>
                      <span
                        className="request-status"
                        style={{ background: `${STATUS_COLOR[req.status]}18`, color: STATUS_COLOR[req.status] }}
                      >
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                    </div>
                    <div className="request-dates">
                      {req.startDate} → {req.endDate}
                      <span className="request-days">{req.days}d</span>
                    </div>
                    <div className="request-reason">{req.reason}</div>
                    {req.reviewNote && (
                      <div className="request-note">Note: {req.reviewNote}</div>
                    )}
                    {req.status === 'pending' && (
                      <button
                        className="btn-cancel-request"
                        onClick={() => handleCancel(req.id)}
                        disabled={cancelMutation.isPending}
                      >
                        Cancel
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
