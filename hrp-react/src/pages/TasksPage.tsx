import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { TasksTable } from '../components/Tables/TasksTable';
import './TasksPage.css';

function StatCard({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: number;
  accent: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="stat-card" style={{ borderTopColor: accent }}>
      <div className="stat-icon-wrap" style={{ background: `${accent}18`, color: accent }}>
        {icon}
      </div>
      <div className="stat-content">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
    </div>
  );
}

const FILTERS = [
  { label: 'All Tasks', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
];

export function TasksPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const { data: tasks = [], isLoading } = useTasks(
    statusFilter ? { status: statusFilter } : undefined
  );

  const allTasks = useTasks(undefined).data ?? [];
  const stats = {
    total: allTasks.length,
    pending: allTasks.filter((t) => t.status === 'pending').length,
    inProgress: allTasks.filter((t) => t.status === 'in_progress').length,
    completed: allTasks.filter((t) => t.status === 'completed').length,
    highPriority: allTasks.filter((t) => t.priority === 'high').length,
  };

  return (
    <div className="tasks-page">
      <div className="page-header">
        <div>
          <h1>Tasks</h1>
          <p>Manage and track your team's tasks</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Tasks" value={stats.total} accent="#6366f1"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
        />
        <StatCard label="Pending" value={stats.pending} accent="#f59e0b"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
        />
        <StatCard label="In Progress" value={stats.inProgress} accent="#3b82f6"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>}
        />
        <StatCard label="Completed" value={stats.completed} accent="#10b981"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
        />
        <StatCard label="High Priority" value={stats.highPriority} accent="#ef4444"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
        />
      </div>

      <div className="table-section">
        <div className="section-header">
          <div>
            <h2>All Tasks</h2>
            <span className="record-count">{tasks.length} record{tasks.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="filter-tabs">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                className={`filter-tab ${statusFilter === f.value ? 'active' : ''}`}
                onClick={() => setStatusFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <TasksTable data={tasks} isLoading={isLoading} />
      </div>
    </div>
  );
}
