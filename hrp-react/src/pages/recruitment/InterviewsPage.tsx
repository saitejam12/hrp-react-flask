import { useState, useMemo } from 'react';
import {
  useInterviews,
  useCreateInterview,
  useUpdateInterview,
  useDeleteInterview,
} from '../../hooks/useInterviews';
import type { CreateInterviewInput } from '../../hooks/useInterviews';
import { useApplicants } from '../../hooks/useApplicants';
import type { Interview } from '../../types/recruitment';
import {
  InterviewsTable,
  INTERVIEW_STATUS_META,
  INTERVIEW_TYPE_META,
} from '../../components/recruitment/InterviewsTable';
import { InterviewModal } from '../../components/recruitment/InterviewModal';
import './InterviewsPage.css';

type StatusFilter = Interview['status'] | 'all';
type DateFilter = 'all' | 'today' | 'week' | 'upcoming';

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: 'all',       label: 'All' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no_show',   label: 'No Show' },
];

const DATE_TABS: { value: DateFilter; label: string }[] = [
  { value: 'all',      label: 'All Time' },
  { value: 'today',    label: 'Today' },
  { value: 'week',     label: 'This Week' },
  { value: 'upcoming', label: 'Upcoming' },
];

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function endOfWeek(d: Date) {
  const end = new Date(d);
  end.setDate(d.getDate() + (6 - d.getDay()));
  end.setHours(23, 59, 59, 999);
  return end;
}

export function InterviewsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);

  const { data: interviews = [], isLoading } = useInterviews();
  const { data: applicants = [] } = useApplicants();

  const createMutation = useCreateInterview();
  const updateMutation = useUpdateInterview();
  const deleteMutation = useDeleteInterview();

  const now = new Date();
  const todayStart = startOfDay(now);
  const weekEnd = endOfWeek(now);

  // Stats (always over all interviews)
  const stats = useMemo(() => ({
    today: interviews.filter(
      (i) => i.status === 'scheduled' && sameDay(new Date(i.scheduledDate), now)
    ).length,
    upcoming: interviews.filter(
      (i) => i.status === 'scheduled' && new Date(i.scheduledDate) > now
    ).length,
    completed: interviews.filter((i) => i.status === 'completed').length,
    cancelled: interviews.filter((i) => i.status === 'cancelled' || i.status === 'no_show').length,
  }), [interviews]);

  // Type breakdown for the summary row
  const typeCounts = useMemo(() =>
    interviews.reduce<Record<string, number>>((acc, i) => {
      acc[i.type] = (acc[i.type] || 0) + 1;
      return acc;
    }, {}),
  [interviews]);

  const filtered = useMemo(() => {
    return interviews.filter((i) => {
      if (statusFilter !== 'all' && i.status !== statusFilter) return false;
      const d = new Date(i.scheduledDate);
      if (dateFilter === 'today') return sameDay(d, now);
      if (dateFilter === 'week') return d >= todayStart && d <= weekEnd;
      if (dateFilter === 'upcoming') return d > now && i.status === 'scheduled';
      return true;
    });
  }, [interviews, statusFilter, dateFilter]);

  const statusCounts = useMemo(() =>
    interviews.reduce<Record<string, number>>((acc, i) => {
      acc[i.status] = (acc[i.status] || 0) + 1;
      return acc;
    }, {}),
  [interviews]);

  const handleOpenCreate = () => { setEditingInterview(null); setIsModalOpen(true); };
  const handleOpenEdit = (i: Interview) => { setEditingInterview(i); setIsModalOpen(true); };
  const handleClose = () => { setIsModalOpen(false); setEditingInterview(null); };

  const handleSubmit = (data: CreateInterviewInput) => {
    if (editingInterview) {
      updateMutation.mutate({ id: editingInterview.id, data }, { onSuccess: handleClose });
    } else {
      createMutation.mutate(data, { onSuccess: handleClose });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this interview?')) deleteMutation.mutate(id);
  };

  const handleStatusChange = (id: string, status: Interview['status']) => {
    updateMutation.mutate({ id, data: { status } });
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <main className="interviews-page">
      <div className="page-header">
        <div>
          <h1>Interviews</h1>
          <p>Schedule and track candidate interviews</p>
        </div>
        <button className="btn-create" onClick={handleOpenCreate}>
          + Schedule Interview
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card stat-today" onClick={() => { setStatusFilter('scheduled'); setDateFilter('today'); }}>
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>Today</h3>
            <p className="stat-value">{stats.today}</p>
          </div>
        </div>
        <div className="stat-card" onClick={() => { setStatusFilter('scheduled'); setDateFilter('upcoming'); }}>
          <div className="stat-icon">🔜</div>
          <div className="stat-content">
            <h3>Upcoming</h3>
            <p className="stat-value">{stats.upcoming}</p>
          </div>
        </div>
        <div className="stat-card" onClick={() => { setStatusFilter('completed'); setDateFilter('all'); }}>
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Completed</h3>
            <p className="stat-value">{stats.completed}</p>
          </div>
        </div>
        <div className="stat-card" onClick={() => { setStatusFilter('cancelled'); setDateFilter('all'); }}>
          <div className="stat-icon">⛔</div>
          <div className="stat-content">
            <h3>Cancelled / No-Show</h3>
            <p className="stat-value">{stats.cancelled}</p>
          </div>
        </div>
      </div>

      {/* Type breakdown */}
      <div className="type-breakdown">
        {Object.entries(INTERVIEW_TYPE_META).map(([type, meta]) => (
          <div key={type} className="type-chip">
            <span>{meta.icon}</span>
            <span className="type-chip-label">{meta.label}</span>
            <span className="type-chip-count">{typeCounts[type] || 0}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filters-row">
        <div className="filter-tabs">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              className={`filter-tab ${statusFilter === tab.value ? 'active' : ''}`}
              onClick={() => setStatusFilter(tab.value)}
            >
              {tab.label}
              {tab.value !== 'all' && (
                <span className="filter-count">{statusCounts[tab.value] || 0}</span>
              )}
            </button>
          ))}
        </div>

        <div className="filter-tabs date-filter-tabs">
          {DATE_TABS.map((tab) => (
            <button
              key={tab.value}
              className={`filter-tab ${dateFilter === tab.value ? 'active' : ''}`}
              onClick={() => setDateFilter(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="results-summary">
        Showing <strong>{filtered.length}</strong> of {interviews.length} interviews
      </div>

      <InterviewsTable
        data={filtered}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />

      <InterviewModal
        isOpen={isModalOpen}
        interview={editingInterview}
        applicants={applicants}
        onClose={handleClose}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </main>
  );
}
