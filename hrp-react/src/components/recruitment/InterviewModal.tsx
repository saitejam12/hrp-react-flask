import { useState, useEffect } from 'react';
import type { Interview } from '../../types/recruitment';
import type { Applicant } from '../../types/recruitment';
import type { CreateInterviewInput } from '../../hooks/useInterviews';
import './JobPostingModal.css';

interface InterviewModalProps {
  isOpen: boolean;
  interview?: Interview | null;
  applicants: Applicant[];
  onClose: () => void;
  onSubmit: (data: CreateInterviewInput) => void;
  isSubmitting: boolean;
}

function toDateInput(iso: string) {
  return iso ? iso.split('T')[0] : '';
}
function toTimeInput(iso: string) {
  if (!iso) return '09:00';
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
function combineDatetime(date: string, time: string) {
  return date && time ? new Date(`${date}T${time}`).toISOString() : '';
}

const EMPTY_FORM = {
  applicantId: '',
  applicantName: '',
  jobTitle: '',
  type: 'phone' as Interview['type'],
  date: '',
  time: '09:00',
  duration: 30,
  interviewersText: '',
  location: '',
  status: 'scheduled' as Interview['status'],
  notes: '',
};

export function InterviewModal({
  isOpen,
  interview,
  applicants,
  onClose,
  onSubmit,
  isSubmitting,
}: InterviewModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof EMPTY_FORM, string>>>({});

  useEffect(() => {
    if (interview) {
      setForm({
        applicantId: interview.applicantId,
        applicantName: interview.applicantName,
        jobTitle: interview.jobTitle,
        type: interview.type,
        date: toDateInput(interview.scheduledDate),
        time: toTimeInput(interview.scheduledDate),
        duration: interview.duration,
        interviewersText: interview.interviewers.join(', '),
        location: interview.location,
        status: interview.status,
        notes: interview.notes ?? '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [interview, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const e: typeof errors = {};
    if (!form.applicantId) e.applicantId = 'Please select a candidate';
    if (!form.date) e.date = 'Date is required';
    if (!form.time) e.time = 'Time is required';
    if (!form.location.trim()) e.location = 'Location or link is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const interviewers = form.interviewersText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    onSubmit({
      applicantId: form.applicantId,
      applicantName: form.applicantName,
      jobTitle: form.jobTitle,
      type: form.type,
      scheduledDate: combineDatetime(form.date, form.time),
      duration: form.duration,
      interviewers,
      location: form.location,
      status: form.status,
      notes: form.notes,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof EMPTY_FORM])
      setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleApplicantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const applicant = applicants.find((a) => a.id === e.target.value);
    setForm((prev) => ({
      ...prev,
      applicantId: e.target.value,
      applicantName: applicant ? `${applicant.firstName} ${applicant.lastName}` : '',
      jobTitle: applicant?.jobTitle ?? '',
    }));
    if (errors.applicantId) setErrors((prev) => ({ ...prev, applicantId: undefined }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{interview ? 'Edit Interview' : 'Schedule Interview'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          <div className="form-grid">

            <div className="form-group full-width">
              <label htmlFor="applicantId">Candidate {!interview && '*'}</label>
              {interview ? (
                <input
                  id="applicantId"
                  type="text"
                  value={form.applicantName}
                  readOnly
                  className="readonly-field"
                />
              ) : (
                <select
                  id="applicantId" name="applicantId"
                  value={form.applicantId} onChange={handleApplicantChange}
                  className={errors.applicantId ? 'error' : ''}
                >
                  <option value="">— Select a candidate —</option>
                  {applicants.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.firstName} {a.lastName} — {a.jobTitle}
                    </option>
                  ))}
                </select>
              )}
              {errors.applicantId && <span className="field-error">{errors.applicantId}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="type">Interview Type</label>
              <select id="type" name="type" value={form.type} onChange={handleChange}>
                <option value="phone">📞 Phone Screen</option>
                <option value="video">🎥 Video</option>
                <option value="technical">💻 Technical</option>
                <option value="onsite">🏢 On-site</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange}>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No Show</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                id="date" name="date" type="date"
                value={form.date} onChange={handleChange}
                className={errors.date ? 'error' : ''}
              />
              {errors.date && <span className="field-error">{errors.date}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="time">Time *</label>
              <input
                id="time" name="time" type="time"
                value={form.time} onChange={handleChange}
                className={errors.time ? 'error' : ''}
              />
              {errors.time && <span className="field-error">{errors.time}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duration</label>
              <select id="duration" name="duration" value={form.duration} onChange={handleChange}>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
                <option value={120}>120 minutes</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location / Link *</label>
              <input
                id="location" name="location" type="text"
                value={form.location} onChange={handleChange}
                placeholder="e.g. Zoom, Google Meet, HQ Room 1A"
                className={errors.location ? 'error' : ''}
              />
              {errors.location && <span className="field-error">{errors.location}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="interviewersText">Interviewers</label>
              <input
                id="interviewersText" name="interviewersText" type="text"
                value={form.interviewersText} onChange={handleChange}
                placeholder="Names separated by commas, e.g. Sunita Rao, Jayesh Kumar"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes" name="notes"
                value={form.notes} onChange={handleChange}
                rows={3}
                placeholder="Topics to cover, special instructions..."
              />
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : interview ? 'Save Changes' : 'Schedule Interview'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
