import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

export function Navbar() {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>HRP</h1>
        <span>Human Resource Portal</span>
      </div>

      <div className="navbar-content">
        <div className="navbar-notifications">
          <button className="notification-btn" title="Notifications">
            🔔
            <span className="badge">3</span>
          </button>
        </div>

        <div className="navbar-user">
          <button
            className="user-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <span className="user-avatar">
              {user?.name.charAt(0).toUpperCase()}
            </span>
            <span className="user-info">
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.role}</div>
            </span>
          </button>

          {showUserMenu && (
            <div className="user-menu">
              <a href="/profile" className="menu-item">
                👤 Profile
              </a>
              <a href="/settings" className="menu-item">
                ⚙️ Settings
              </a>
              <button
                className="menu-item logout"
                onClick={() => {
                  logout();
                  window.location.href = '/login';
                }}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
