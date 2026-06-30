import { useState, useEffect } from 'react';
import type { JobPosting, JobType, JobStatus } from '../../types/recruitment';
import type { CreateJobPostingInput } from '../../hooks/useJobPostings';
import './JobPostingModal.css';

interface JobPostingModalProps {
  isOpen: boolean;
  job?: JobPosting | null;
  onClose: () => void;
  onSubmit: (data: CreateJobPostingInput) => void;
  isSubmitting: boolean;
}

const EMPTY_FORM: CreateJobPostingInput = {
  title: '',
  department: '',
  location: '',
  type: 'full_time',
  status: 'draft',
  description: '',
  requirements: '',
  salaryRange: '',
  closingDate: '',
  createdBy: 'HR Admin',
};

export function JobPostingModal({
  isOpen,
  job,
  onClose,
  onSubmit,
  isSubmitting,
}: JobPostingModalProps) {
  const [form, setForm] = useState<CreateJobPostingInput>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateJobPostingInput, string>>>({});

  useEffect(() => {
    if (job) {
      setForm({
        title: job.title,
        department: job.department,
        location: job.location,
        type: job.type,
        status: job.status,
        description: job.description,
        requirements: job.requirements,
        salaryRange: job.salaryRange,
        closingDate: job.closingDate.split('T')[0],
        createdBy: job.createdBy,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [job, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateJobPostingInput, string>> = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.department.trim()) newErrors.department = 'Department is required';
    if (!form.location.trim()) newErrors.location = 'Location is required';
    if (!form.closingDate) newErrors.closingDate = 'Closing date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    if (errors[name as keyof CreateJobPostingInput]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{job ? 'Edit Job Posting' : 'Create Job Posting'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="title">Job Title *</label>
              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Senior Software Engineer"
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="department">Department *</label>
              <input
                id="department"
                name="department"
                type="text"
                value={form.department}
                onChange={handleChange}
                placeholder="e.g. Engineering"
                className={errors.department ? 'error' : ''}
              />
              {errors.department && <span className="field-error">{errors.department}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                id="location"
                name="location"
                type="text"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Remote or City, State"
                className={errors.location ? 'error' : ''}
              />
              {errors.location && <span className="field-error">{errors.location}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="type">Job Type</label>
              <select id="type" name="type" value={form.type} onChange={handleChange}>
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange}>
                <option value="draft">Draft</option>
                <option value="open">Open</option>
                <option value="on_hold">On Hold</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="salaryRange">Salary Range</label>
              <input
                id="salaryRange"
                name="salaryRange"
                type="text"
                value={form.salaryRange}
                onChange={handleChange}
                placeholder="e.g. $70,000 - $90,000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="closingDate">Closing Date *</label>
              <input
                id="closingDate"
                name="closingDate"
                type="date"
                value={form.closingDate}
                onChange={handleChange}
                className={errors.closingDate ? 'error' : ''}
              />
              {errors.closingDate && <span className="field-error">{errors.closingDate}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Job Description</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="requirements">Requirements</label>
              <textarea
                id="requirements"
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                rows={4}
                placeholder="List qualifications, skills, and experience required..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : job ? 'Save Changes' : 'Create Posting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
