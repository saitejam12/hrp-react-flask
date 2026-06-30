import { useAuth } from '../../contexts/AuthContext';
import { useLeaveBalance } from '../../hooks/useLeaveBalance';
import type { LeaveType } from '../../types/leave';
import './LeaveBalancePage.css';

const LEAVE_CONFIG: { type: LeaveType; label: string; color: string; icon: React.ReactNode }[] = [
  {
    type: 'annual', label: 'Annual Leave', color: '#6366f1',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    type: 'sick', label: 'Sick Leave', color: '#ef4444',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  },
  {
    type: 'casual', label: 'Casual Leave', color: '#f59e0b',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  },
  {
    type: 'maternity', label: 'Maternity Leave', color: '#ec4899',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  },
  {
    type: 'paternity', label: 'Paternity Leave', color: '#3b82f6',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  {
    type: 'unpaid', label: 'Unpaid Leave', color: '#6b7280',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  },
];

function BalanceBar({ used, total, color }: { used: number; total: number; color: string }) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  return (
    <div className="balance-bar-track">
      <div className="balance-bar-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export function LeaveBalancePage() {
  const { user } = useAuth();
  const { data: balance, isLoading } = useLeaveBalance(user?.id ?? 'current');

  const totalUsed = balance
    ? LEAVE_CONFIG.reduce((s, { type }) => s + balance[type].used, 0)
    : 0;
  const totalDays = balance
    ? LEAVE_CONFIG.reduce((s, { type }) => s + balance[type].total, 0)
    : 0;

  return (
    <div className="leave-balance-page">
      <div className="page-header">
        <div>
          <h1>Leave Balance</h1>
          <p>Your current leave entitlements for {new Date().getFullYear()}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">Loading balance…</div>
      ) : !balance ? (
        <div className="loading-state">No balance data found.</div>
      ) : (
        <>
          <div className="summary-row">
            <div className="summary-card">
              <span className="summary-value">{totalDays}</span>
              <span className="summary-label">Total Entitled Days</span>
            </div>
            <div className="summary-card used">
              <span className="summary-value">{totalUsed}</span>
              <span className="summary-label">Days Used</span>
            </div>
            <div className="summary-card remaining">
              <span className="summary-value">{totalDays - totalUsed}</span>
              <span className="summary-label">Days Remaining</span>
            </div>
          </div>

          <div className="balance-grid">
            {LEAVE_CONFIG.map(({ type, label, color, icon }) => {
              const b = balance[type];
              return (
                <div key={type} className="balance-card" style={{ borderTopColor: color }}>
                  <div className="balance-card-header">
                    <div className="balance-icon" style={{ background: `${color}15`, color }}>
                      {icon}
                    </div>
                    <span className="balance-type-label">{label}</span>
                  </div>

                  <div className="balance-numbers">
                    <div className="balance-number">
                      <span className="num" style={{ color }}>{b.remaining}</span>
                      <span className="num-label">Remaining</span>
                    </div>
                    <div className="balance-divider" />
                    <div className="balance-number">
                      <span className="num">{b.used}</span>
                      <span className="num-label">Used</span>
                    </div>
                    <div className="balance-divider" />
                    <div className="balance-number">
                      <span className="num">{b.total}</span>
                      <span className="num-label">Total</span>
                    </div>
                  </div>

                  <BalanceBar used={b.used} total={b.total} color={color} />
                  <div className="balance-bar-labels">
                    <span>{Math.round((b.used / b.total) * 100)}% used</span>
                    <span>{b.remaining} left</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
