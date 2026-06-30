import { useAuth } from '../contexts/AuthContext';
import { useEmployees } from '../hooks/useEmployees';
import { useTasks } from '../hooks/useTasks';
import './DashboardPage.css';

const METRIC_ICONS: Record<string, React.ReactNode> = {
  people: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  check: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  tasks: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 11l3 3L22 4"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
  progress: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 4 23 10 17 10"/>
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
    </svg>
  ),
  pending: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  chart: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  clipboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
};

const METRIC_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6'];
const METRIC_ICON_KEYS = ['people', 'check', 'tasks', 'pending'];
const ADMIN_ICON_KEYS = ['people', 'check', 'tasks', 'check'];

export function DashboardPage() {
  const { user, hasRole } = useAuth();
  const { data: employees = [] } = useEmployees();
  const { data: tasks = [] } = useTasks();

  const stats = hasRole('admin')
    ? {
        label: 'Administrator Dashboard',
        iconKeys: ADMIN_ICON_KEYS,
        metrics: [
          { label: 'Total Employees', value: employees.length },
          { label: 'Active Employees', value: employees.filter(e => e.status === 'active').length },
          { label: 'Total Tasks', value: tasks.length },
          { label: 'Completed Tasks', value: tasks.filter(t => t.status === 'completed').length },
        ],
      }
    : hasRole('manager')
      ? {
          label: 'Manager Dashboard',
          iconKeys: ['people', 'tasks', 'clipboard', 'chart'],
          metrics: [
            { label: 'Team Members', value: 12 },
            { label: 'Tasks Assigned', value: tasks.length },
            { label: 'Pending Reviews', value: 5 },
            { label: 'Team Utilization', value: '87%' },
          ],
        }
      : {
          label: 'Employee Dashboard',
          iconKeys: ['tasks', 'check', 'progress', 'pending'],
          metrics: [
            { label: 'My Tasks', value: tasks.length },
            { label: 'Completed', value: tasks.filter(t => t.status === 'completed').length },
            { label: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length },
            { label: 'Pending', value: tasks.filter(t => t.status === 'pending').length },
          ],
        };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name}</h1>
          <p className="dashboard-date">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="dashboard-label">{stats.label}</div>

      <div className="dashboard-cards">
        {stats.metrics.map((metric, idx) => (
          <div key={idx} className="card" style={{ borderTopColor: METRIC_COLORS[idx] }}>
            <div
              className="card-icon-wrap"
              style={{ background: `${METRIC_COLORS[idx]}18`, color: METRIC_COLORS[idx] }}
            >
              {METRIC_ICONS[(stats.iconKeys as string[])[idx]]}
            </div>
            <div className="card-content">
              <h3 className="card-title">{metric.label}</h3>
              <p className="card-value">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Employee Statistics</h2>
          </div>
          <div className="stats-list">
            <div className="stat-row">
              <span className="label">Total Employees</span>
              <span className="value">{employees.length}</span>
            </div>
            <div className="stat-row">
              <span className="label">Active</span>
              <span className="value active">{employees.filter(e => e.status === 'active').length}</span>
            </div>
            <div className="stat-row">
              <span className="label">On Leave</span>
              <span className="value pending">{employees.filter(e => e.status === 'on_leave').length}</span>
            </div>
            <div className="stat-row">
              <span className="label">Inactive</span>
              <span className="value inactive">{employees.filter(e => e.status === 'inactive').length}</span>
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h2>Task Statistics</h2>
          </div>
          <div className="stats-list">
            <div className="stat-row">
              <span className="label">Total Tasks</span>
              <span className="value">{tasks.length}</span>
            </div>
            <div className="stat-row">
              <span className="label">Pending</span>
              <span className="value pending">{tasks.filter(t => t.status === 'pending').length}</span>
            </div>
            <div className="stat-row">
              <span className="label">In Progress</span>
              <span className="value in-progress">{tasks.filter(t => t.status === 'in_progress').length}</span>
            </div>
            <div className="stat-row">
              <span className="label">Completed</span>
              <span className="value completed">{tasks.filter(t => t.status === 'completed').length}</span>
            </div>
          </div>
        </section>
      </div>

      <section className="dashboard-section">
        <div className="section-header">
          <h2>Recent Tasks</h2>
          <a href="/tasks" className="view-all">View All →</a>
        </div>
        <div className="tasks-preview">
          {tasks.slice(0, 5).map((task) => (
            <div key={task.id} className="task-item">
              <div className={`task-status ${task.status}`}>
                {task.status === 'completed' && '✓'}
                {task.status === 'in_progress' && '›'}
                {task.status === 'pending' && '○'}
              </div>
              <div className="task-info">
                <h4>{task.title}</h4>
                <p>{task.description}</p>
              </div>
              <span className={`priority ${task.priority}`}>{task.priority}</span>
            </div>
          ))}
          {tasks.length === 0 && (
            <p className="no-tasks">No tasks assigned yet</p>
          )}
        </div>
      </section>
    </div>
  );
}
