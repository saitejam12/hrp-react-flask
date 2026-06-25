import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { TasksTable } from '../components/Tables/TasksTable';
import './TasksPage.css';

export function TasksPage() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const { data: tasks = [], isLoading } = useTasks(
    statusFilter ? { status: statusFilter } : undefined
  );

  // Calculate task statistics
  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    highPriority: tasks.filter((t) => t.priority === 'high').length,
  };

  return (
    <main className="tasks-page">
      <div className="page-header">
        <h1>Tasks</h1>
        <p>Manage and track tasks</p>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>Total Tasks</h3>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending</h3>
            <p className="stat-value">{stats.pending}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⟳</div>
          <div className="stat-content">
            <h3>In Progress</h3>
            <p className="stat-value">{stats.inProgress}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <h3>Completed</h3>
            <p className="stat-value">{stats.completed}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>High Priority</h3>
            <p className="stat-value">{stats.highPriority}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <h2>Filter by Status</h2>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${statusFilter === '' ? 'active' : ''}`}
            onClick={() => setStatusFilter('')}
          >
            All Tasks
          </button>
          <button
            className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${statusFilter === 'in_progress' ? 'active' : ''}`}
            onClick={() => setStatusFilter('in_progress')}
          >
            In Progress
          </button>
          <button
            className={`filter-btn ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="table-section">
        <h2>
          Tasks {statusFilter ? `(${statusFilter.replace('_', ' ')})` : ''}
        </h2>
        <TasksTable data={tasks} isLoading={isLoading} />
      </div>
    </main>
  );
}
