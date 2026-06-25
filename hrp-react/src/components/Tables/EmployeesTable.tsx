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
import type { Employee } from '../../hooks/useEmployees';
import './Table.css';

interface EmployeesTableProps {
  data: Employee[];
  isLoading: boolean;
}

export function EmployeesTable({ data, isLoading }: EmployeesTableProps) {
  const [sorting, setSorting] = useState<any[]>([]);
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: (info) => <strong>{info.getValue() as string}</strong>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: (info) => {
        const dept = info.getValue() as string;
        return <span className="badge">{dept}</span>;
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: (info) => {
        const role = info.getValue() as string;
        return <span className={`role-badge ${role.toLowerCase()}`}>{role}</span>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => {
        const status = info.getValue() as string;
        return (
          <span className={`status-badge ${status.replace('_', '-')}`}>
            {status.replace('_', ' ')}
          </span>
        );
      },
    },
    {
      accessorKey: 'joinDate',
      header: 'Join Date',
      cell: (info) => {
        const date = info.getValue() as string;
        return new Date(date).toLocaleDateString();
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
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
          placeholder="Search employees..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="search-input"
        />
      </div>

      {isLoading ? (
        <div className="table-loading">Loading...</div>
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
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
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
