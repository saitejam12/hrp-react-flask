import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  useLeaveEncashments,
  useCreateLeaveEncashment,
  useUpdateEncashmentStatus,
} from '../../hooks/useLeaveEncashment';
import { useLeaveBalance } from '../../hooks/useLeaveBalance';
import type { LeaveType, LeaveEncashment } from '../../types/leave';
import './LeaveEncashmentPage.css';

const ENCASHABLE_TYPES: { value: LeaveType; label: string }[] = [
  { value: 'annual',  label: 'Annual Leave' },
  { value: 'casual',  label: 'Casual Leave' },
];

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  pending:  { bg: '#fef3c7', color: '#b45309' },
  approved: { bg: '#dbeafe', color: '#1d4ed8' },
  paid:     { bg: '#d1fae5', color: '#065f46' },
  rejected: { bg: '#fee2e2', color: '#991b1b' },
};

const INITIAL_FORM = {
  leaveType: 'annual' as LeaveType,
  days: 1,
  ratePerDay: 0,
};

export function LeaveEncashmentPage() {
  const { user, hasRole } = useAuth();
  const isApprover = hasRole(['admin', 'hr', 'owner']);

  const { data: encashments = [], isLoading } = useLeaveEncashments();
  const { data: balance } = useLeaveBalance(user?.id ?? 'current');
  const createMutation = useCreateLeaveEncashment();
  const updateMutation = useUpdateEncashmentStatus();

  const [form, setForm] = useState(INITIAL_FORM);
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const totalAmount = form.days * form.ratePerDay;
  const selectedBalance = balance ? balance[form.leaveType] : null;
  const maxDays = selectedBalance ? Math.floor(selectedBalance.remaining * 0.5) : 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.days <= 0) { setErrorMsg('Days must be greater than 0.'); return; }
    if (form.ratePerDay <= 0) { setErrorMsg('Rate per day must be greater than 0.'); return; }
    if (form.days > maxDays) {
      setErrorMsg(`You can encash at most ${maxDays} days (50% of remaining balance).`);
      return;
    }

    createMutation.mutate(
      {
        employeeId: user?.id ?? 'current',
        employeeName: user?.name ?? 'Employee',
        department: user?.department ?? 'General',
        leaveType: form.leaveType,
        days: form.days,
        ratePerDay: form.ratePerDay,
        totalAmount,
      },
      {
        onSuccess: () => {
          setForm(INITIAL_FORM);
          setShowForm(false);
          setSuccessMsg('Encashment request submitted!');
          setErrorMsg('');
        },
        onError: () => setErrorMsg('Failed to submit. Please try again.'),
      }
    );
  }

  return (
    <div className="encashment-page">
      <div className="page-header">
        <div>
          <h1>Leave Encashment</h1>
          <p>Convert unused leave days into cash</p>
        </div>
        <button
          className="btn-create"
          onClick={() => { setShowForm(s => !s); setSuccessMsg(''); setErrorMsg(''); }}
        >
          {showForm ? 'Cancel' : '+ New Request'}
        </button>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {errorMsg   && <div className="alert alert-error">{errorMsg}</div>}

      {showForm && (
        <div className="enc-form-card">
          <h2>Encashment Request</h2>
          <form onSubmit={handleSubmit} className="enc-form">
            <div className="form-row">
              <div className="form-group">
                <label>Leave Type</label>
                <select
                  value={form.leaveType}
                  onChange={e => setForm(f => ({ ...f, leaveType: e.target.value as LeaveType }))}
                >
                  {ENCASHABLE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                {selectedBalance && (
                  <span className="field-hint">
                    {selectedBalance.remaining} days remaining · max {maxDays} encashable
                  </span>
                )}
              </div>
              <div className="form-group">
                <label>Days to Encash</label>
                <input
                  type="number" min={1} max={maxDays}
                  value={form.days}
                  onChange={e => setForm(f => ({ ...f, days: Number(e.target.value) }))}
                />
              </div>
              <div className="form-group">
                <label>Rate per Day (₹)</label>
                <input
                  type="number" min={0} step={0.01}
                  value={form.ratePerDay}
                  onChange={e => setForm(f => ({ ...f, ratePerDay: Number(e.target.value) }))}
                />
              </div>
            </div>

            {totalAmount > 0 && (
              <div className="enc-total-preview">
                Total Encashment Amount: <strong>₹{totalAmount.toLocaleString()}</strong>
              </div>
            )}

            <button type="submit" className="btn-submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Submitting…' : 'Submit Request'}
            </button>
          </form>
        </div>
      )}

      <div className="table-section">
        <div className="section-header">
          <h2>Encashment Requests</h2>
          <span className="record-count">{encashments.length} record{encashments.length !== 1 ? 's' : ''}</span>
        </div>

        {isLoading ? (
          <div className="table-loading">Loading…</div>
        ) : encashments.length === 0 ? (
          <div className="table-empty">No encashment requests yet.</div>
        ) : (
          <table className="enc-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Leave Type</th>
                <th>Days</th>
                <th>Rate/Day</th>
                <th>Total Amount</th>
                <th>Requested</th>
                <th>Status</th>
                {isApprover && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {encashments.map((enc: LeaveEncashment) => {
                const ss = STATUS_STYLE[enc.status] ?? STATUS_STYLE.pending;
                return (
                  <tr key={enc.id}>
                    <td className="td-name">{enc.employeeName}</td>
                    <td>{enc.department}</td>
                    <td>{enc.leaveType.charAt(0).toUpperCase() + enc.leaveType.slice(1)}</td>
                    <td className="td-days">{enc.days}</td>
                    <td>₹{enc.ratePerDay.toLocaleString()}</td>
                    <td className="td-amount">₹{enc.totalAmount.toLocaleString()}</td>
                    <td>{enc.requestedDate}</td>
                    <td>
                      <span className="status-badge" style={{ background: ss.bg, color: ss.color }}>
                        {enc.status.charAt(0).toUpperCase() + enc.status.slice(1)}
                      </span>
                    </td>
                    {isApprover && (
                      <td>
                        {enc.status === 'pending' && (
                          <div className="table-actions">
                            <button className="action-btn approve" onClick={() => updateMutation.mutate({ id: enc.id, status: 'approved' })}>Approve</button>
                            <button className="action-btn reject"  onClick={() => updateMutation.mutate({ id: enc.id, status: 'rejected' })}>Reject</button>
                          </div>
                        )}
                        {enc.status === 'approved' && (
                          <button className="action-btn pay" onClick={() => updateMutation.mutate({ id: enc.id, status: 'paid' })}>Mark Paid</button>
                        )}
                        {(enc.status === 'paid' || enc.status === 'rejected') && (
                          <span className="td-muted">—</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
