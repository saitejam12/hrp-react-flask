import { useState, useEffect } from 'react';
import type { Applicant, ApplicationStatus } from '../../types/recruitment';
import type { JobPosting } from '../../types/recruitment';
import type { CreateApplicantInput } from '../../hooks/useApplicants';
import './JobPostingModal.css';

interface ApplicantModalProps {
  isOpen: boolean;
  applicant?: Applicant | null;
  jobs: JobPosting[];
  onClose: () => void;
  onSubmit: (data: CreateApplicantInput) => void;
  isSubmitting: boolean;
}

const EMPTY_FORM: CreateApplicantInput = {
  jobId: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  status: 'applied',
  resumeUrl: '',
  notes: '',
};

export function ApplicantModal({
  isOpen,
  applicant,
  jobs,
  onClose,
  onSubmit,
  isSubmitting,
}: ApplicantModalProps) {
  const [form, setForm] = useState<CreateApplicantInput>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateApplicantInput, string>>>({});

  useEffect(() => {
    if (applicant) {
      setForm({
        jobId: applicant.jobId,
        firstName: applicant.firstName,
        lastName: applicant.lastName,
        email: applicant.email,
        phone: applicant.phone,
        status: applicant.status,
        resumeUrl: applicant.resumeUrl || '',
        notes: applicant.notes || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [applicant, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const e: Partial<Record<keyof CreateApplicantInput, string>> = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    if (!form.jobId) e.jobId = 'Please select a job';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CreateApplicantInput]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{applicant ? 'Edit Applicant' : 'Add Applicant'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                id="firstName" name="firstName" type="text"
                value={form.firstName} onChange={handleChange}
                placeholder="Jane"
                className={errors.firstName ? 'error' : ''}
              />
              {errors.firstName && <span className="field-error">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                id="lastName" name="lastName" type="text"
                value={form.lastName} onChange={handleChange}
                placeholder="Smith"
                className={errors.lastName ? 'error' : ''}
              />
              {errors.lastName && <span className="field-error">{errors.lastName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                id="email" name="email" type="text"
                value={form.email} onChange={handleChange}
                placeholder="jane@example.com"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone" name="phone" type="text"
                value={form.phone} onChange={handleChange}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="jobId">Job Posting *</label>
              <select
                id="jobId" name="jobId"
                value={form.jobId} onChange={handleChange}
                className={errors.jobId ? 'error' : ''}
              >
                <option value="">— Select a job —</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} — {job.department}
                  </option>
                ))}
              </select>
              {errors.jobId && <span className="field-error">{errors.jobId}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange}>
                <option value="applied">Applied</option>
                <option value="screening">Screening</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="resumeUrl">Resume URL</label>
              <input
                id="resumeUrl" name="resumeUrl" type="text"
                value={form.resumeUrl} onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes" name="notes"
                value={form.notes} onChange={handleChange}
                rows={3}
                placeholder="Any additional notes about this applicant..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : applicant ? 'Save Changes' : 'Add Applicant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
