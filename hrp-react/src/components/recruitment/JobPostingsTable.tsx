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
import type { JobPosting } from '../../types/recruitment';
import '../Tables/Table.css';

const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  contract: 'Contract',
  internship: 'Internship',
};

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  open: 'Open',
  closed: 'Closed',
  on_hold: 'On Hold',
};

interface JobPostingsTableProps {
  data: JobPosting[];
  isLoading: boolean;
  onEdit: (job: JobPosting) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
}

export function JobPostingsTable({
  data,
  isLoading,
  onEdit,
  onDelete,
  onToggleStatus,
}: JobPostingsTableProps) {
  const [sorting, setSorting] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns: ColumnDef<JobPosting>[] = [
    {
      accessorKey: 'title',
      header: 'Job Title',
      cell: (info) => <strong>{info.getValue() as string}</strong>,
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: (info) => <span className="badge">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'location',
      header: 'Location',
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: (info) => {
        const type = info.getValue() as string;
        return (
          <span className={`job-type-badge ${type}`}>
            {JOB_TYPE_LABELS[type] || type}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => {
        const status = info.getValue() as string;
        return (
          <span className={`status-badge job-status-${status.replace('_', '-')}`}>
            {STATUS_LABELS[status] || status}
          </span>
        );
      },
    },
    {
      accessorKey: 'applicantCount',
      header: 'Applicants',
      cell: (info) => (
        <span className="applicant-count">{info.getValue() as number}</span>
      ),
    },
    {
      accessorKey: 'postedDate',
      header: 'Posted',
      cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
    },
    {
      accessorKey: 'closingDate',
      header: 'Closes',
      cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const job = row.original;
        const isOpen = job.status === 'open';
        return (
          <div className="table-actions">
            <button
              className="action-btn edit"
              onClick={() => onEdit(job)}
              title="Edit"
            >
              ✏️
            </button>
            <button
              className={`action-btn ${isOpen ? 'close-job' : 'open-job'}`}
              onClick={() => onToggleStatus(job.id, job.status)}
              title={isOpen ? 'Close posting' : 'Reopen posting'}
            >
              {isOpen ? '🔒' : '🔓'}
            </button>
            <button
              className="action-btn delete"
              onClick={() => onDelete(job.id)}
              title="Delete"
            >
              🗑️
            </button>
          </div>
        );
      },
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
          placeholder="Search job postings..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="search-input"
        />
      </div>

      {isLoading ? (
        <div className="table-loading">Loading...</div>
      ) : data.length === 0 ? (
        <div className="table-empty">No job postings found.</div>
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
