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
import type { Applicant, ApplicationStatus } from '../../types/recruitment';
import '../Tables/Table.css';

export const STATUS_META: Record<ApplicationStatus, { label: string; className: string }> = {
  applied:   { label: 'Applied',    className: 'status-applied' },
  screening: { label: 'Screening',  className: 'status-screening' },
  interview: { label: 'Interview',  className: 'status-interview' },
  offer:     { label: 'Offer',      className: 'status-offer' },
  hired:     { label: 'Hired',      className: 'status-hired' },
  rejected:  { label: 'Rejected',   className: 'status-rejected' },
};

const STATUS_ORDER: ApplicationStatus[] = [
  'applied', 'screening', 'interview', 'offer', 'hired', 'rejected',
];

interface ApplicantsTableProps {
  data: Applicant[];
  isLoading: boolean;
  onEdit: (applicant: Applicant) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
}

export function ApplicantsTable({
  data,
  isLoading,
  onEdit,
  onDelete,
  onStatusChange,
}: ApplicantsTableProps) {
  const [sorting, setSorting] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns: ColumnDef<Applicant>[] = [
    {
      id: 'name',
      header: 'Applicant',
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      cell: ({ row }) => (
        <div className="applicant-name-cell">
          <div className="applicant-avatar">
            {row.original.firstName[0]}{row.original.lastName[0]}
          </div>
          <div>
            <div className="applicant-fullname">
              {row.original.firstName} {row.original.lastName}
            </div>
            <div className="applicant-email">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: (info) => <span className="applicant-phone">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'jobTitle',
      header: 'Applied For',
      cell: (info) => <span className="badge">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const current = row.original.status;
        return (
          <select
            className={`status-select ${STATUS_META[current].className}`}
            value={current}
            onChange={(e) =>
              onStatusChange(row.original.id, e.target.value as ApplicationStatus)
            }
          >
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_META[s].label}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      accessorKey: 'appliedDate',
      header: 'Applied',
      cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="table-actions">
          <button
            className="action-btn edit"
            onClick={() => onEdit(row.original)}
            title="Edit"
          >
            ✏️
          </button>
          <button
            className="action-btn delete"
            onClick={() => onDelete(row.original.id)}
            title="Delete"
          >
            🗑️
          </button>
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
          placeholder="Search by name, email, or job..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="search-input"
        />
      </div>

      {isLoading ? (
        <div className="table-loading">Loading applicants...</div>
      ) : data.length === 0 ? (
        <div className="table-empty">No applicants found.</div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() && (
                        <span className="sort-indicator">
                          {header.column.getIsSorted() === 'asc' ? ' ↑' : ' ↓'}
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
