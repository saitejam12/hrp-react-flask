import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTE_PERMISSIONS } from '../../constants/rbac';
import './Sidebar.css';

interface MenuItem {
  label: string;
  path: string;
  icon: string;
  roles?: string[];
}

const MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: '📊' },
  { label: 'Profile', path: '/profile', icon: '👤' },
  { label: 'Tasks', path: '/tasks', icon: '✅', roles: ['admin', 'manager', 'employee'] },
  { label: 'Employees', path: '/employees', icon: '👥', roles: ['admin', 'manager'] },
  { label: 'Reports', path: '/reports', icon: '📈', roles: ['admin', 'manager', 'employee'] },
  { label: 'Team', path: '/team', icon: '🤝', roles: ['manager', 'admin'] },
  { label: 'Settings', path: '/settings', icon: '⚙️', roles: ['admin'] },
];

export function Sidebar() {
  const { user, hasRole } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('/dashboard');

  const visibleMenuItems = MENU_ITEMS.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role || 'guest');
  });

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '◀️' : '▶️'}
      </button>

      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-content">
          <nav className="sidebar-nav">
            <div className="nav-section">
              <h3 className="nav-title">Main</h3>
              <ul className="nav-list">
                {visibleMenuItems.map((item) => (
                  <li key={item.path}>
                    <a
                      href={item.path}
                      className={`nav-link ${activeItem === item.path ? 'active' : ''}`}
                      onClick={() => setActiveItem(item.path)}
                      title={item.label}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-label">{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {(hasRole('admin') || hasRole('manager')) && (
              <div className="nav-section">
                <h3 className="nav-title">Management</h3>
                <ul className="nav-list">
                  <li>
                    <a
                      href="/employees"
                      className="nav-link"
                      title="Manage Employees"
                    >
                      <span className="nav-icon">👨‍💼</span>
                      <span className="nav-label">Manage</span>
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </nav>

          <div className="sidebar-footer">
            <div className="user-role-badge">
              <div className="badge-label">Role</div>
              <div className="badge-value">{user?.role.toUpperCase()}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
