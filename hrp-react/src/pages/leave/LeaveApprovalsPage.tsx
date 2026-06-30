import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLeaveRequests, useUpdateLeaveStatus } from '../../hooks/useLeaveRequests';
import type { LeaveRequest, LeaveStatus } from '../../types/leave';
import './LeaveApprovalsPage.css';

const STATUS_FILTERS: { label: string; value: LeaveStatus | 'all' }[] = [
  { label: 'All',       value: 'all' },
  { label: 'Pending',   value: 'pending' },
  { label: 'Approved',  value: 'approved' },
  { label: 'Rejected',  value: 'rejected' },
  { label: 'Cancelled', value: 'cancelled' },
];

const LEAVE_TYPE_LABEL: Record<string, string> = {
  annual: 'Annual', sick: 'Sick', casual: 'Casual',
  maternity: 'Maternity', paternity: 'Paternity', unpaid: 'Unpaid',
};

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  pending:   { bg: '#fef3c7', color: '#b45309' },
  approved:  { bg: '#d1fae5', color: '#065f46' },
  rejected:  { bg: '#fee2e2', color: '#991b1b' },
  cancelled: { bg: '#f3f4f6', color: '#374151' },
};

function ApprovalModal({
  request,
  onClose,
  onSubmit,
  isPending,
}: {
  request: LeaveRequest;
  onClose: () => void;
  onSubmit: (status: 'approved' | 'rejected', note: string) => void;
  isPending: boolean;
}) {
  const [note, setNote] = useState('');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Review Leave Request</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="review-info-grid">
            <div className="review-info-item"><span>Employee</span><strong>{request.employeeName}</strong></div>
            <div className="review-info-item"><span>Department</span><strong>{request.department}</strong></div>
            <div className="review-info-item"><span>Leave Type</span><strong>{LEAVE_TYPE_LABEL[request.leaveType] ?? request.leaveType}</strong></div>
            <div className="review-info-item"><span>Duration</span><strong>{request.days} day{request.days !== 1 ? 's' : ''}</strong></div>
            <div className="review-info-item"><span>From</span><strong>{request.startDate}</strong></div>
            <div className="review-info-item"><span>To</span><strong>{request.endDate}</strong></div>
          </div>

          <div className="review-reason">
            <span>Reason</span>
            <p>{request.reason}</p>
          </div>

          <div className="form-group">
            <label>Review Note (optional)</label>
            <textarea
              rows={3}
              placeholder="Add a note for the employee…"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-reject" onClick={() => onSubmit('rejected', note)} disabled={isPending}>
            Reject
          </button>
          <button className="btn-approve" onClick={() => onSubmit('approved', note)} disabled={isPending}>
            {isPending ? 'Saving…' : 'Approve'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function LeaveApprovalsPage() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<LeaveStatus | 'all'>('pending');
  const [reviewing, setReviewing] = useState<LeaveRequest | null>(null);

  // Single query — all pages share the same demoLeaveStore via this hook
  const { data: allRequests = [], isLoading } = useLeaveRequests();
  const updateMutation = useUpdateLeaveStatus();

  // Filter in-component so stats always reflect the full dataset
  const filtered = activeFilter === 'all'
    ? allRequests
    : allRequests.filter(r => r.status === activeFilter);

  const counts = {
    pending:  allRequests.filter(r => r.status === 'pending').length,
    approved: allRequests.filter(r => r.status === 'approved').length,
    rejected: allRequests.filter(r => r.status === 'rejected').length,
  };

  function handleReview(status: 'approved' | 'rejected', note: string) {
    if (!reviewing) return;
    updateMutation.mutate(
      {
        id: reviewing.id,
        status,
        reviewNote: note || undefined,
        reviewedBy: user?.name ?? 'HR',
      },
      { onSuccess: () => setReviewing(null) }
    );
  }

  return (
    <div className="approvals-page">
      <div className="page-header">
        <div>
          <h1>Leave Approvals</h1>
          <p>Review and manage employee leave requests</p>
        </div>
      </div>

      {/* Stats */}
      <div className="approvals-stats">
        <div className="astat-card" style={{ borderTopColor: '#f59e0b' }}>
          <span className="astat-value">{counts.pending}</span>
          <span className="astat-label">Pending</span>
        </div>
        <div className="astat-card" style={{ borderTopColor: '#10b981' }}>
          <span className="astat-value">{counts.approved}</span>
          <span className="astat-label">Approved</span>
        </div>
        <div className="astat-card" style={{ borderTopColor: '#ef4444' }}>
          <span className="astat-value">{counts.rejected}</span>
          <span className="astat-label">Rejected</span>
        </div>
      </div>

      {/* Table */}
      <div className="table-section">
        <div className="section-header">
          <div>
            <h2>Leave Requests</h2>
            <span className="record-count">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="filter-tabs">
            {STATUS_FILTERS.map(f => (
              <button
                key={f.value}
                className={`filter-tab ${activeFilter === f.value ? 'active' : ''}`}
                onClick={() => setActiveFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="table-loading">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="table-empty">No {activeFilter !== 'all' ? activeFilter : ''} requests found.</div>
        ) : (
          <table className="approvals-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Applied</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(req => {
                const ss = STATUS_STYLE[req.status] ?? STATUS_STYLE.cancelled;
                return (
                  <tr key={req.id}>
                    <td className="td-name">{req.employeeName}</td>
                    <td>{req.department}</td>
                    <td>{LEAVE_TYPE_LABEL[req.leaveType] ?? req.leaveType}</td>
                    <td>{req.startDate}</td>
                    <td>{req.endDate}</td>
                    <td className="td-days">{req.days}</td>
                    <td>{req.appliedDate}</td>
                    <td>
                      <span className="status-badge" style={{ background: ss.bg, color: ss.color }}>
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      {req.status === 'pending' ? (
                        <button className="btn-review" onClick={() => setReviewing(req)}>
                          Review
                        </button>
                      ) : (
                        <span className="td-muted">{req.reviewedBy ?? '—'}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {reviewing && (
        <ApprovalModal
          request={reviewing}
          onClose={() => setReviewing(null)}
          onSubmit={handleReview}
          isPending={updateMutation.isPending}
        />
      )}
    </div>
  );
}
