import { useAuth } from '../contexts/AuthContext';
import { useEmployees } from '../hooks/useEmployees';
import { useTasks } from '../hooks/useTasks';
import './DashboardPage.css';

export function DashboardPage() {
  const { user, hasRole } = useAuth();
  const { data: employees = [] } = useEmployees();
  const { data: tasks = [] } = useTasks();

  // Get role-specific stats
  const stats = hasRole('admin')
    ? {
        label: 'Administrator Dashboard',
        metrics: [
          { label: 'Total Employees', value: employees.length, icon: '👥' },
          { label: 'Active Employees', value: employees.filter(e => e.status === 'active').length, icon: '✅' },
          { label: 'Total Tasks', value: tasks.length, icon: '✅' },
          { label: 'Completed Tasks', value: tasks.filter(t => t.status === 'completed').length, icon: '✨' },
        ],
      }
    : hasRole('manager')
      ? {
          label: 'Manager Dashboard',
          metrics: [
            { label: 'Team Members', value: 12, icon: '👥' },
            { label: 'Tasks Assigned', value: tasks.length, icon: '✅' },
            { label: 'Pending Reviews', value: 5, icon: '📋' },
            { label: 'Team Utilization', value: '87%', icon: '📈' },
          ],
        }
      : {
          label: 'Employee Dashboard',
          metrics: [
            { label: 'My Tasks', value: tasks.length, icon: '✅' },
            { label: 'Completed', value: tasks.filter(t => t.status === 'completed').length, icon: '✨' },
            { label: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length, icon: '⟳' },
            { label: 'Pending', value: tasks.filter(t => t.status === 'pending').length, icon: '⏳' },
          ],
        };

  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}! 👋</h1>
        <p className="dashboard-date">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Dashboard Title */}
      <section className="dashboard-title">
        <h2>{stats.label}</h2>
      </section>

      {/* Metrics Cards */}
      <section className="dashboard-cards">
        {stats.metrics.map((metric, idx) => (
          <div key={idx} className="card">
            <div className="card-icon">{metric.icon}</div>
            <div className="card-content">
              <h3 className="card-title">{metric.label}</h3>
              <p className="card-value">{metric.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Employee Stats */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Employee Statistics</h2>
          </div>
          <div className="stats-list">
            <div className="stat-row">
              <span className="label">Total Employees:</span>
              <span className="value">{employees.length}</span>
            </div>
            <div className="stat-row">
              <span className="label">Active:</span>
              <span className="value active">
                {employees.filter((e) => e.status === 'active').length}
              </span>
            </div>
            <div className="stat-row">
              <span className="label">On Leave:</span>
              <span className="value pending">
                {employees.filter((e) => e.status === 'on_leave').length}
              </span>
            </div>
            <div className="stat-row">
              <span className="label">Inactive:</span>
              <span className="value inactive">
                {employees.filter((e) => e.status === 'inactive').length}
              </span>
            </div>
          </div>
        </section>

        {/* Task Stats */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Task Statistics</h2>
          </div>
          <div className="stats-list">
            <div className="stat-row">
              <span className="label">Total Tasks:</span>
              <span className="value">{tasks.length}</span>
            </div>
            <div className="stat-row">
              <span className="label">Pending:</span>
              <span className="value pending">
                {tasks.filter((t) => t.status === 'pending').length}
              </span>
            </div>
            <div className="stat-row">
              <span className="label">In Progress:</span>
              <span className="value in-progress">
                {tasks.filter((t) => t.status === 'in_progress').length}
              </span>
            </div>
            <div className="stat-row">
              <span className="label">Completed:</span>
              <span className="value completed">
                {tasks.filter((t) => t.status === 'completed').length}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Recent Tasks */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Recent Tasks</h2>
          <a href="/tasks" className="view-all">
            View All →
          </a>
        </div>
        <div className="tasks-preview">
          {tasks.slice(0, 5).map((task) => (
            <div key={task.id} className="task-item">
              <div className={`task-status ${task.status}`}>
                {task.status === 'completed' && '✓'}
                {task.status === 'in_progress' && '⟳'}
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
            <div className="no-tasks">No tasks assigned yet</div>
          )}
        </div>
      </section>

      {/* Role Access Info */}
      <section className="access-info">
        <h3>Your Access Level</h3>
        <div className="role-info">
          <p>
            You are logged in as <strong>{user?.role.toUpperCase()}</strong>
          </p>
          {hasRole('admin') && (
            <p>✓ Full access to all features and user management</p>
          )}
          {hasRole('manager') && (
            <p>✓ Access to employee management and team analytics</p>
          )}
          {hasRole('employee') && (
            <p>✓ Access to personal tasks and profile management</p>
          )}
        </div>
      </section>
    </main>
  );
}
