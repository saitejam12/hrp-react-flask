import { useState, useMemo } from 'react';
import {
  useOffers,
  useCreateOffer,
  useUpdateOffer,
  useDeleteOffer,
} from '../../hooks/useOffers';
import type { CreateOfferInput } from '../../hooks/useOffers';
import { useApplicants } from '../../hooks/useApplicants';
import type { Offer } from '../../types/recruitment';
import { OffersTable } from '../../components/recruitment/OffersTable';
import { OfferModal } from '../../components/recruitment/OfferModal';
import './OffersPage.css';

type StatusFilter = Offer['status'] | 'all';

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: 'all',      label: 'All' },
  { value: 'pending',  label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'declined', label: 'Declined' },
  { value: 'expired',  label: 'Expired' },
];

export function OffersPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  const { data: offers = [], isLoading } = useOffers();
  const { data: applicants = [] } = useApplicants();

  const createMutation = useCreateOffer();
  const updateMutation = useUpdateOffer();
  const deleteMutation = useDeleteOffer();

  const stats = useMemo(() => ({
    pending:  offers.filter((o) => o.status === 'pending').length,
    accepted: offers.filter((o) => o.status === 'accepted').length,
    declined: offers.filter((o) => o.status === 'declined').length,
    expired:  offers.filter((o) => o.status === 'expired').length,
  }), [offers]);

  const acceptanceRate = useMemo(() => {
    const resolved = stats.accepted + stats.declined;
    return resolved > 0 ? Math.round((stats.accepted / resolved) * 100) : null;
  }, [stats]);

  const filtered = useMemo(() =>
    statusFilter === 'all' ? offers : offers.filter((o) => o.status === statusFilter),
  [offers, statusFilter]);

  const statusCounts = useMemo(() =>
    offers.reduce<Record<string, number>>((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {}),
  [offers]);

  const handleOpenCreate = () => { setEditingOffer(null); setIsModalOpen(true); };
  const handleOpenEdit = (o: Offer) => { setEditingOffer(o); setIsModalOpen(true); };
  const handleClose = () => { setIsModalOpen(false); setEditingOffer(null); };

  const handleSubmit = (data: CreateOfferInput) => {
    if (editingOffer) {
      updateMutation.mutate({ id: editingOffer.id, data }, { onSuccess: handleClose });
    } else {
      createMutation.mutate(data, { onSuccess: handleClose });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this offer?')) deleteMutation.mutate(id);
  };

  const handleStatusChange = (id: string, status: Offer['status']) => {
    updateMutation.mutate({ id, data: { status } });
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <main className="offers-page">
      <div className="page-header">
        <div>
          <h1>Offer Management</h1>
          <p>Track and manage job offers extended to candidates</p>
        </div>
        <button className="btn-create" onClick={handleOpenCreate}>
          + Create Offer
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-pending" onClick={() => setStatusFilter('pending')}>
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending</h3>
            <p className="stat-value">{stats.pending}</p>
          </div>
        </div>
        <div className="stat-card stat-accepted" onClick={() => setStatusFilter('accepted')}>
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Accepted</h3>
            <p className="stat-value">{stats.accepted}</p>
          </div>
        </div>
        <div className="stat-card stat-declined" onClick={() => setStatusFilter('declined')}>
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <h3>Declined</h3>
            <p className="stat-value">{stats.declined}</p>
          </div>
        </div>
        <div className="stat-card stat-rate" onClick={() => setStatusFilter('all')}>
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Acceptance Rate</h3>
            <p className="stat-value">
              {acceptanceRate !== null ? `${acceptanceRate}%` : '—'}
            </p>
          </div>
        </div>
      </div>

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
      </div>

      <div className="results-summary">
        Showing <strong>{filtered.length}</strong> of {offers.length} offers
      </div>

      <OffersTable
        data={filtered}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />

      <OfferModal
        isOpen={isModalOpen}
        offer={editingOffer}
        applicants={applicants}
        onClose={handleClose}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </main>
  );
}
