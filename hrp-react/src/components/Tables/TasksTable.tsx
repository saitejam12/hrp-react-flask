import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import type { Task } from "../../hooks/useTasks";
import "./Table.css";

interface TasksTableProps {
  data: Task[];
  isLoading: boolean;
}

export function TasksTable({ data, isLoading }: TasksTableProps) {
  const [sorting, setSorting] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: (info) => <strong>{info.getValue() as string}</strong>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: (info) => {
        const desc = info.getValue() as string;
        return (
          <span style={{ fontSize: "0.9rem", color: "#666" }}>{desc}</span>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: (info) => {
        const priority = info.getValue() as string;
        return (
          <span className={`priority ${priority}`}>
            {priority.toUpperCase()}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const status = info.getValue() as string;
        return (
          <span className={`status-badge ${status.replace("_", "-")}`}>
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "assignee",
      header: "Assignee",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
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
      globalFilter,
    },
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
          placeholder="Search tasks..."
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
                      style={{
                        cursor: header.column.getCanSort()
                          ? "pointer"
                          : "default",
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {header.column.getIsSorted() && (
                        <span className="sort-indicator">
                          {header.column.getIsSorted() === "asc" ? " ↑" : " ↓"}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="table-empty">
                    No tasks found
                  </td>
                </tr>
              )}
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
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount() || 1}
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
