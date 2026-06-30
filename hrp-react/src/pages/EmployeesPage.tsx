import { useEmployees } from '../hooks/useEmployees';
import { EmployeesTable } from '../components/Tables/EmployeesTable';
import './EmployeesPage.css';

function StatCard({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: number;
  accent: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="stat-card" style={{ borderTopColor: accent }}>
      <div className="stat-icon-wrap" style={{ background: `${accent}18`, color: accent }}>
        {icon}
      </div>
      <div className="stat-content">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
    </div>
  );
}

export function EmployeesPage() {
  const { data: employees = [], isLoading } = useEmployees();

  const departmentStats = employees.reduce(
    (acc, emp) => {
      acc[emp.department] = (acc[emp.department] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const departmentList = Object.entries(departmentStats).map(([name, count]) => ({
    name,
    count: count as number,
  }));

  const stats = {
    total: employees.length,
    active: employees.filter((e) => e.status === 'active').length,
    onLeave: employees.filter((e) => e.status === 'on_leave').length,
    inactive: employees.filter((e) => e.status === 'inactive').length,
  };

  return (
    <div className="employees-page">
      <div className="page-header">
        <div>
          <h1>Employees</h1>
          <p>Manage and view all personnel records</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Employees" value={stats.total} accent="#6366f1"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
        <StatCard label="Active" value={stats.active} accent="#10b981"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
        />
        <StatCard label="On Leave" value={stats.onLeave} accent="#f59e0b"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
        />
        <StatCard label="Inactive" value={stats.inactive} accent="#9ca3af"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="10" y1="15" x2="10" y2="9"/><line x1="14" y1="15" x2="14" y2="9"/></svg>}
        />
      </div>

      {departmentList.length > 0 && (
        <div className="distribution-section">
          <h2>Department Distribution</h2>
          <div className="department-list">
            {departmentList.map((dept) => (
              <div key={dept.name} className="department-item">
                <span className="dept-name">{dept.name}</span>
                <div className="dept-bar-container">
                  <div
                    className="dept-bar"
                    style={{ width: `${(dept.count / stats.total) * 100}%` }}
                  />
                </div>
                <span className="dept-count">{dept.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="table-section">
        <div className="table-section-header">
          <h2>All Employees</h2>
          <span className="record-count">{employees.length} record{employees.length !== 1 ? 's' : ''}</span>
        </div>
        <EmployeesTable data={employees} isLoading={isLoading} />
      </div>
    </div>
  );
}
