import { useState } from 'react';
import {
  useJobPostings,
  useCreateJobPosting,
  useUpdateJobPosting,
  useDeleteJobPosting,
} from '../../hooks/useJobPostings';
import type { CreateJobPostingInput } from '../../hooks/useJobPostings';
import type { JobPosting, JobStatus } from '../../types/recruitment';
import { JobPostingsTable } from '../../components/recruitment/JobPostingsTable';
import { JobPostingModal } from '../../components/recruitment/JobPostingModal';
import './JobPostingsPage.css';

const STATUS_FILTERS: { label: string; value: JobStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Draft', value: 'draft' },
  { label: 'On Hold', value: 'on_hold' },
  { label: 'Closed', value: 'closed' },
];

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

export function JobPostingsPage() {
  const [activeFilter, setActiveFilter] = useState<JobStatus | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);

  const { data: jobs = [], isLoading } = useJobPostings(
    activeFilter === 'all' ? undefined : activeFilter
  );
  const createMutation = useCreateJobPosting();
  const updateMutation = useUpdateJobPosting();
  const deleteMutation = useDeleteJobPosting();

  const allJobs = useJobPostings(undefined).data ?? [];
  const stats = {
    total: allJobs.length,
    open: allJobs.filter((j) => j.status === 'open').length,
    draft: allJobs.filter((j) => j.status === 'draft').length,
    onHold: allJobs.filter((j) => j.status === 'on_hold').length,
    closed: allJobs.filter((j) => j.status === 'closed').length,
  };

  const handleOpenCreate = () => { setEditingJob(null); setIsModalOpen(true); };
  const handleOpenEdit = (job: JobPosting) => { setEditingJob(job); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setEditingJob(null); };

  const handleSubmit = (data: CreateJobPostingInput) => {
    if (editingJob) {
      updateMutation.mutate({ id: editingJob.id, data }, { onSuccess: handleCloseModal });
    } else {
      createMutation.mutate(data, { onSuccess: handleCloseModal });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    updateMutation.mutate({ id, data: { status: newStatus as JobStatus } });
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="job-postings-page">
      <div className="page-header">
        <div>
          <h1>Job Postings</h1>
          <p>Manage open positions and recruitment listings</p>
        </div>
        <button className="btn-create" onClick={handleOpenCreate}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Job Posting
        </button>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Postings" value={stats.total} accent="#6366f1"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>}
        />
        <StatCard label="Open" value={stats.open} accent="#10b981"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
        />
        <StatCard label="Draft" value={stats.draft} accent="#f59e0b"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>}
        />
        <StatCard label="On Hold" value={stats.onHold} accent="#8b5cf6"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="10" y1="15" x2="10" y2="9"/><line x1="14" y1="15" x2="14" y2="9"/></svg>}
        />
        <StatCard label="Closed" value={stats.closed} accent="#ef4444"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
        />
      </div>

      <div className="table-section">
        <div className="section-header">
          <div>
            <h2>All Postings</h2>
            <span className="record-count">{jobs.length} record{jobs.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="filter-tabs">
            {STATUS_FILTERS.map((f) => (
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

        <JobPostingsTable
          data={jobs}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      <JobPostingModal
        isOpen={isModalOpen}
        job={editingJob}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
