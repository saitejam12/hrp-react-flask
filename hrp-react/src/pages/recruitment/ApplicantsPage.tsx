import { useState } from 'react';
import { useApplicants, useCreateApplicant, useUpdateApplicant, useDeleteApplicant } from '../../hooks/useApplicants';
import type { CreateApplicantInput } from '../../hooks/useApplicants';
import { useJobPostings } from '../../hooks/useJobPostings';
import type { Applicant, ApplicationStatus } from '../../types/recruitment';
import { ApplicantsTable, STATUS_META } from '../../components/recruitment/ApplicantsTable';
import { ApplicantModal } from '../../components/recruitment/ApplicantModal';
import './ApplicantsPage.css';

const PIPELINE_STAGES: ApplicationStatus[] = [
  'applied', 'screening', 'interview', 'offer', 'hired',
];

type FilterStatus = ApplicationStatus | 'all';

const STATUS_FILTER_LABELS: { value: FilterStatus; label: string }[] = [
  { value: 'all',       label: 'All' },
  { value: 'applied',   label: 'Applied' },
  { value: 'screening', label: 'Screening' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer',     label: 'Offer' },
  { value: 'hired',     label: 'Hired' },
  { value: 'rejected',  label: 'Rejected' },
];

export function ApplicantsPage() {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [jobFilter, setJobFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(null);

  const { data: allApplicants = [], isLoading } = useApplicants();
  const { data: jobs = [] } = useJobPostings();

  const createMutation = useCreateApplicant();
  const updateMutation = useUpdateApplicant();
  const deleteMutation = useDeleteApplicant();

  // Client-side filtering (faster UX than separate queries per filter)
  const filtered = allApplicants.filter((a) => {
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesJob = !jobFilter || a.jobId === jobFilter;
    return matchesStatus && matchesJob;
  });

  // Pipeline counts across all applicants (unaffected by filter)
  const counts = allApplicants.reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  const handleOpenCreate = () => {
    setEditingApplicant(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (applicant: Applicant) => {
    setEditingApplicant(applicant);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingApplicant(null);
  };

  const handleSubmit = (data: CreateApplicantInput) => {
    if (editingApplicant) {
      updateMutation.mutate(
        { id: editingApplicant.id, data },
        { onSuccess: handleCloseModal }
      );
    } else {
      createMutation.mutate(data, { onSuccess: handleCloseModal });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Remove this applicant?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleStatusChange = (id: string, status: ApplicationStatus) => {
    updateMutation.mutate({ id, data: { status } });
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <main className="applicants-page">
      <div className="page-header">
        <div>
          <h1>Applicants</h1>
          <p>Track candidates across all open positions</p>
        </div>
        <button className="btn-create" onClick={handleOpenCreate}>
          + Add Applicant
        </button>
      </div>

      {/* Pipeline overview */}
      <div className="pipeline-bar">
        {PIPELINE_STAGES.map((stage, i) => (
          <div key={stage} className="pipeline-stage">
            <div className={`pipeline-dot ${STATUS_META[stage].className}`} />
            <div className="pipeline-info">
              <span className="pipeline-label">{STATUS_META[stage].label}</span>
              <span className="pipeline-count">{counts[stage] || 0}</span>
            </div>
            {i < PIPELINE_STAGES.length - 1 && <div className="pipeline-arrow">›</div>}
          </div>
        ))}
        <div className="pipeline-rejected">
          <div className={`pipeline-dot ${STATUS_META.rejected.className}`} />
          <div className="pipeline-info">
            <span className="pipeline-label">Rejected</span>
            <span className="pipeline-count">{counts['rejected'] || 0}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-row">
        <div className="filter-tabs">
          {STATUS_FILTER_LABELS.map((f) => (
            <button
              key={f.value}
              className={`filter-tab ${statusFilter === f.value ? 'active' : ''}`}
              onClick={() => setStatusFilter(f.value)}
            >
              {f.label}
              {f.value !== 'all' && (
                <span className="filter-count">{counts[f.value] || 0}</span>
              )}
            </button>
          ))}
        </div>

        <select
          className="job-filter-select"
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
        >
          <option value="">All Positions</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>
      </div>

      {/* Summary line */}
      <div className="results-summary">
        Showing <strong>{filtered.length}</strong> of {allApplicants.length} applicants
      </div>

      <ApplicantsTable
        data={filtered}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />

      <ApplicantModal
        isOpen={isModalOpen}
        applicant={editingApplicant}
        jobs={jobs}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </main>
  );
}
