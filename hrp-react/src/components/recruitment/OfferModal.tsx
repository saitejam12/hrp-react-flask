import { useState, useEffect } from 'react';
import type { Offer, Applicant } from '../../types/recruitment';
import type { CreateOfferInput } from '../../hooks/useOffers';
import './JobPostingModal.css';

interface OfferModalProps {
  isOpen: boolean;
  offer?: Offer | null;
  applicants: Applicant[];
  onClose: () => void;
  onSubmit: (data: CreateOfferInput) => void;
  isSubmitting: boolean;
}

const EMPTY_FORM = {
  applicantId: '',
  applicantName: '',
  jobTitle: '',
  salary: '',
  currency: 'INR',
  startDate: '',
  expiryDate: '',
  status: 'pending' as Offer['status'],
  notes: '',
};

export function OfferModal({
  isOpen,
  offer,
  applicants,
  onClose,
  onSubmit,
  isSubmitting,
}: OfferModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof EMPTY_FORM, string>>>({});

  useEffect(() => {
    if (offer) {
      setForm({
        applicantId: offer.applicantId,
        applicantName: offer.applicantName,
        jobTitle: offer.jobTitle,
        salary: String(offer.salary),
        currency: offer.currency,
        startDate: offer.startDate.split('T')[0],
        expiryDate: offer.expiryDate.split('T')[0],
        status: offer.status,
        notes: offer.notes ?? '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [offer, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const e: typeof errors = {};
    if (!form.applicantId) e.applicantId = 'Please select a candidate';
    if (!form.salary || isNaN(Number(form.salary)) || Number(form.salary) <= 0)
      e.salary = 'Enter a valid salary amount';
    if (!form.startDate) e.startDate = 'Start date is required';
    if (!form.expiryDate) e.expiryDate = 'Expiry date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      applicantId: form.applicantId,
      applicantName: form.applicantName,
      jobTitle: form.jobTitle,
      salary: Number(form.salary),
      currency: form.currency,
      startDate: new Date(form.startDate).toISOString(),
      expiryDate: new Date(form.expiryDate).toISOString(),
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
          <h2>{offer ? 'Edit Offer' : 'Create Offer'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="applicantId">Candidate {!offer && '*'}</label>
              {offer ? (
                <input
                  id="applicantId"
                  type="text"
                  value={form.applicantName}
                  readOnly
                  className="readonly-field"
                />
              ) : (
                <select
                  id="applicantId"
                  name="applicantId"
                  value={form.applicantId}
                  onChange={handleApplicantChange}
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
              <label htmlFor="salary">Annual CTC (₹) *</label>
              <input
                id="salary"
                name="salary"
                type="number"
                min="0"
                step="100000"
                value={form.salary}
                onChange={handleChange}
                placeholder="e.g. 1500000 (₹15 LPA)"
                className={errors.salary ? 'error' : ''}
              />
              {form.salary && !isNaN(Number(form.salary)) && Number(form.salary) > 0 && (
                <span className="field-hint">= ₹{(Number(form.salary) / 100000).toFixed(1)} LPA</span>
              )}
              {errors.salary && <span className="field-error">{errors.salary}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="currency">Currency</label>
              <select id="currency" name="currency" value={form.currency} onChange={handleChange}>
                <option value="INR">INR — Indian Rupee</option>
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="GBP">GBP — British Pound</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="startDate">Start Date *</label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                className={errors.startDate ? 'error' : ''}
              />
              {errors.startDate && <span className="field-error">{errors.startDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="expiryDate">Offer Expires *</label>
              <input
                id="expiryDate"
                name="expiryDate"
                type="date"
                value={form.expiryDate}
                onChange={handleChange}
                className={errors.expiryDate ? 'error' : ''}
              />
              {errors.expiryDate && <span className="field-error">{errors.expiryDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Additional notes about this offer..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : offer ? 'Save Changes' : 'Create Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
