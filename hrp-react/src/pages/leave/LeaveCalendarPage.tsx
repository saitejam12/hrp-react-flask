import { useState, useMemo } from 'react';
import { useLeaveRequests } from '../../hooks/useLeaveRequests';
import type { LeaveRequest } from '../../types/leave';
import './LeaveCalendarPage.css';

const LEAVE_COLOR: Record<string, string> = {
  annual: '#6366f1', sick: '#ef4444', casual: '#f59e0b',
  maternity: '#ec4899', paternity: '#3b82f6', unpaid: '#6b7280',
};

const MONTHS = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function dateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

export function LeaveCalendarPage() {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<LeaveRequest[]>([]);

  // Same hook as Approvals — reads from the same demoLeaveStore
  const { data: allRequests = [] } = useLeaveRequests();
  const approvedRequests = allRequests.filter(r => r.status === 'approved');

  const cells = useMemo(() => getCalendarDays(year, month), [year, month]);

  const thisMonthApproved = approvedRequests.filter(r => {
    const sm = new Date(r.startDate).getMonth();
    const em = new Date(r.endDate).getMonth();
    return sm === month || em === month;
  });

  function getRequestsForDay(day: number): LeaveRequest[] {
    const ds = dateStr(year, month, day);
    return approvedRequests.filter(r => r.startDate <= ds && ds <= r.endDate);
  }

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }

  const todayStr = dateStr(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="leave-calendar-page">
      <div className="page-header">
        <div>
          <h1>Leave Calendar</h1>
          <p>Overview of approved leaves across the team</p>
        </div>
      </div>

      <div className="cal-legend">
        {Object.entries(LEAVE_COLOR).map(([type, color]) => (
          <div key={type} className="legend-item">
            <span className="legend-dot" style={{ background: color }} />
            <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
          </div>
        ))}
      </div>

      <div className="cal-layout">
        <div className="cal-card">
          <div className="cal-nav">
            <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
            <span className="cal-month-label">{MONTHS[month]} {year}</span>
            <button className="cal-nav-btn" onClick={nextMonth}>›</button>
          </div>

          <div className="cal-grid">
            {DAYS.map(d => <div key={d} className="cal-day-header">{d}</div>)}
            {cells.map((day, i) => {
              if (!day) return <div key={i} className="cal-cell empty" />;
              const ds = dateStr(year, month, day);
              const dayRequests = getRequestsForDay(day);
              const isToday = ds === todayStr;
              const isWeekend = new Date(year, month, day).getDay() % 6 === 0;
              return (
                <div
                  key={i}
                  className={`cal-cell ${isToday ? 'today' : ''} ${isWeekend ? 'weekend' : ''} ${dayRequests.length ? 'has-events' : ''}`}
                  onClick={() => dayRequests.length && setSelected(dayRequests)}
                >
                  <span className="cal-day-num">{day}</span>
                  <div className="cal-dots">
                    {dayRequests.slice(0, 3).map((r, idx) => (
                      <span key={idx} className="cal-dot" style={{ background: LEAVE_COLOR[r.leaveType] ?? '#6b7280' }} />
                    ))}
                    {dayRequests.length > 3 && <span className="cal-dot-more">+{dayRequests.length - 3}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="cal-side">
          <h2>{selected.length ? 'Leaves on selected day' : 'This month'}</h2>
          {selected.length > 0 && (
            <button className="btn-clear-sel" onClick={() => setSelected([])}>← Back to month view</button>
          )}
          <ul className="cal-event-list">
            {(selected.length ? selected : thisMonthApproved).map(r => (
              <li key={r.id} className="cal-event-item">
                <span className="cal-event-bar" style={{ background: LEAVE_COLOR[r.leaveType] ?? '#6b7280' }} />
                <div className="cal-event-info">
                  <strong>{r.employeeName}</strong>
                  <span>{r.leaveType.charAt(0).toUpperCase() + r.leaveType.slice(1)} · {r.days}d</span>
                  <span className="cal-event-dates">{r.startDate} → {r.endDate}</span>
                </div>
              </li>
            ))}
            {selected.length === 0 && thisMonthApproved.length === 0 && (
              <li className="cal-empty">No approved leaves this month.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
