import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import type { Offer, OfferStatus } from '../../types/recruitment';
import '../Tables/Table.css';

export const OFFER_STATUS_META: Record<OfferStatus, { label: string; className: string }> = {
  pending:  { label: 'Pending',  className: 'ostatus-pending' },
  accepted: { label: 'Accepted', className: 'ostatus-accepted' },
  declined: { label: 'Declined', className: 'ostatus-declined' },
  expired:  { label: 'Expired',  className: 'ostatus-expired' },
};

const OFFER_STATUS_ORDER: OfferStatus[] = ['pending', 'accepted', 'declined', 'expired'];

function formatSalary(salary: number, currency: string) {
  if (currency === 'INR') {
    const lpa = salary / 100000;
    return `₹${lpa % 1 === 0 ? lpa.toFixed(0) : lpa.toFixed(1)} LPA`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(salary);
}

function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / 86_400_000);
}

interface OffersTableProps {
  data: Offer[];
  isLoading: boolean;
  onEdit: (offer: Offer) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: OfferStatus) => void;
}

export function OffersTable({ data, isLoading, onEdit, onDelete, onStatusChange }: OffersTableProps) {
  const [sorting, setSorting] = useState<any[]>([{ id: 'createdAt', desc: true }]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns: ColumnDef<Offer>[] = [
    {
      id: 'candidate',
      header: 'Candidate',
      accessorFn: (row) => row.applicantName,
      cell: ({ row }) => {
        const parts = row.original.applicantName.split(' ');
        const initials = parts.map((p) => p[0]).join('').slice(0, 2);
        return (
          <div className="applicant-name-cell">
            <div className="applicant-avatar">{initials}</div>
            <div>
              <div className="applicant-fullname">{row.original.applicantName}</div>
              <div className="applicant-email">{row.original.jobTitle}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'salary',
      header: 'Salary',
      cell: ({ row }) => (
        <span style={{ fontWeight: 600, fontSize: '0.92rem', color: '#16a34a' }}>
          {formatSalary(row.original.salary, row.original.currency)}
        </span>
      ),
    },
    {
      accessorKey: 'startDate',
      header: 'Start Date',
      cell: (info) => {
        const d = new Date(info.getValue() as string);
        return (
          <span style={{ fontSize: '0.88rem', color: '#555' }}>
            {d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        );
      },
    },
    {
      accessorKey: 'expiryDate',
      header: 'Expires',
      cell: ({ row }) => {
        const d = new Date(row.original.expiryDate);
        const days = daysUntil(row.original.expiryDate);
        const isPending = row.original.status === 'pending';
        const isUrgent = isPending && days <= 3 && days >= 0;
        const isOverdue = isPending && days < 0;
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '0.88rem', color: isOverdue ? '#dc2626' : '#555', fontWeight: isOverdue ? 600 : 400 }}>
              {d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            {isPending && (
              <span style={{
                fontSize: '0.74rem',
                fontWeight: 600,
                color: isOverdue ? '#dc2626' : isUrgent ? '#d97706' : '#6b7280',
              }}>
                {isOverdue ? `${Math.abs(days)}d overdue` : days === 0 ? 'Expires today' : `${days}d left`}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const current = row.original.status;
        return (
          <select
            className={`status-select ${OFFER_STATUS_META[current].className}`}
            value={current}
            onChange={(e) => onStatusChange(row.original.id, e.target.value as OfferStatus)}
          >
            {OFFER_STATUS_ORDER.map((s) => (
              <option key={s} value={s}>{OFFER_STATUS_META[s].label}</option>
            ))}
          </select>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="table-actions">
          <button className="action-btn edit" onClick={() => onEdit(row.original)} title="Edit">✏️</button>
          <button className="action-btn delete" onClick={() => onDelete(row.original.id)} title="Delete">🗑️</button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="table-container">
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search by candidate or job title..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="search-input"
        />
      </div>

      {isLoading ? (
        <div className="table-loading">Loading offers...</div>
      ) : data.length === 0 ? (
        <div className="table-empty">No offers found.</div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      onClick={h.column.getToggleSortingHandler()}
                      style={{ cursor: h.column.getCanSort() ? 'pointer' : 'default' }}
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getIsSorted() && (
                        <span className="sort-indicator">
                          {h.column.getIsSorted() === 'asc' ? ' ↑' : ' ↓'}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="table-pagination">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="pagination-btn"
            >
              ← Previous
            </button>
            <span className="pagination-info">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="pagination-btn"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
