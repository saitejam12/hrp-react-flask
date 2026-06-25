import { useEmployees } from '../hooks/useEmployees';
import { EmployeesTable } from '../components/Tables/EmployeesTable';
import './EmployeesPage.css';

export function EmployeesPage() {
  const { data: employees = [], isLoading } = useEmployees();

  // Calculate department statistics
  const departmentStats = employees.reduce(
    (acc, emp) => {
      const dept = emp.department;
      if (acc[dept]) {
        acc[dept]++;
      } else {
        acc[dept] = 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  const departmentList = Object.entries(departmentStats).map(([name, count]) => ({
    name,
    count: count as number,
  }));

  // Calculate statistics
  const stats = {
    total: employees.length,
    active: employees.filter((e) => e.status === 'active').length,
    onLeave: employees.filter((e) => e.status === 'on_leave').length,
    inactive: employees.filter((e) => e.status === 'inactive').length,
  };

  return (
    <main className="employees-page">
      <div className="page-header">
        <h1>Employees</h1>
        <p>Manage and view all employees</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Employees</h3>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Active</h3>
            <p className="stat-value">{stats.active}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏖️</div>
          <div className="stat-content">
            <h3>On Leave</h3>
            <p className="stat-value">{stats.onLeave}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏸️</div>
          <div className="stat-content">
            <h3>Inactive</h3>
            <p className="stat-value">{stats.inactive}</p>
          </div>
        </div>
      </div>

      {/* Department Distribution */}
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

      {/* Employees Table */}
      <div className="table-section">
        <h2>All Employees</h2>
        <EmployeesTable data={employees} isLoading={isLoading} />
      </div>
    </main>
  );
}
