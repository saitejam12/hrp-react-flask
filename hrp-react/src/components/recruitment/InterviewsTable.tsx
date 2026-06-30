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
import type { Interview } from '../../types/recruitment';
import '../Tables/Table.css';

export const INTERVIEW_STATUS_META: Record<
  Interview['status'],
  { label: string; className: string }
> = {
  scheduled:  { label: 'Scheduled',  className: 'istatus-scheduled' },
  completed:  { label: 'Completed',  className: 'istatus-completed' },
  cancelled:  { label: 'Cancelled',  className: 'istatus-cancelled' },
  no_show:    { label: 'No Show',    className: 'istatus-no-show' },
};

export const INTERVIEW_TYPE_META: Record<
  Interview['type'],
  { label: string; icon: string }
> = {
  phone:     { label: 'Phone',     icon: '📞' },
  video:     { label: 'Video',     icon: '🎥' },
  onsite:    { label: 'On-site',   icon: '🏢' },
  technical: { label: 'Technical', icon: '💻' },
};

const INTERVIEW_STATUS_ORDER: Interview['status'][] = [
  'scheduled', 'completed', 'cancelled', 'no_show',
];

function isToday(dateStr: string) {
  const d = new Date(dateStr);
  const t = new Date();
  return d.getFullYear() === t.getFullYear()
    && d.getMonth() === t.getMonth()
    && d.getDate() === t.getDate();
}

interface InterviewsTableProps {
  data: Interview[];
  isLoading: boolean;
  onEdit: (interview: Interview) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Interview['status']) => void;
}

export function InterviewsTable({
  data,
  isLoading,
  onEdit,
  onDelete,
  onStatusChange,
}: InterviewsTableProps) {
  const [sorting, setSorting] = useState<any[]>([{ id: 'scheduledDate', desc: false }]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns: ColumnDef<Interview>[] = [
    {
      id: 'candidate',
      header: 'Candidate',
      accessorFn: (row) => row.applicantName,
      cell: ({ row }) => {
        const today = isToday(row.original.scheduledDate);
        const parts = row.original.applicantName.split(' ');
        const initials = parts.map((p) => p[0]).join('').slice(0, 2);
        return (
          <div className="applicant-name-cell">
            <div className={`applicant-avatar ${today ? 'today-avatar' : ''}`}>{initials}</div>
            <div>
              <div className="applicant-fullname">
                {row.original.applicantName}
                {today && <span className="today-badge">Today</span>}
              </div>
              <div className="applicant-email">{row.original.jobTitle}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: (info) => {
        const type = info.getValue() as Interview['type'];
        const meta = INTERVIEW_TYPE_META[type];
        return (
          <span className={`interview-type-badge itype-${type}`}>
            {meta.icon} {meta.label}
          </span>
        );
      },
    },
    {
      accessorKey: 'scheduledDate',
      header: 'Date & Time',
      cell: (info) => {
        const d = new Date(info.getValue() as string);
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#333' }}>
              {d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span style={{ fontSize: '0.78rem', color: '#888' }}>
              {d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'duration',
      header: 'Duration',
      cell: (info) => <span className="duration-cell">{info.getValue() as number} min</span>,
    },
    {
      accessorKey: 'interviewers',
      header: 'Interviewers',
      cell: (info) => {
        const list = info.getValue() as string[];
        return (
          <div className="interviewers-cell">
            {list.map((name) => (
              <span key={name} className="interviewer-chip">{name}</span>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: (info) => <span className="location-cell">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const current = row.original.status;
        return (
          <select
            className={`status-select ${INTERVIEW_STATUS_META[current].className}`}
            value={current}
            onChange={(e) =>
              onStatusChange(row.original.id, e.target.value as Interview['status'])
            }
          >
            {INTERVIEW_STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {INTERVIEW_STATUS_META[s].label}
              </option>
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
          <button className="action-btn edit" onClick={() => onEdit(row.original)} title="Edit">
            ✏️
          </button>
          <button className="action-btn delete" onClick={() => onDelete(row.original.id)} title="Delete">
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
          placeholder="Search by candidate, job, or interviewer..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="search-input"
        />
      </div>

      {isLoading ? (
        <div className="table-loading">Loading interviews...</div>
      ) : data.length === 0 ? (
        <div className="table-empty">No interviews found.</div>
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
                <tr
                  key={row.id}
                  className={isToday(row.original.scheduledDate) && row.original.status === 'scheduled' ? 'today-row' : ''}
                >
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
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="pagination-btn">
              ← Previous
            </button>
            <span className="pagination-info">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="pagination-btn">
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
