import { useAuth } from '../contexts/AuthContext';
import './ProfilePage.css';

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <main className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
      </div>

      <div className="profile-container">
        <section className="profile-card">
          <div className="profile-avatar">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h2>{user?.name}</h2>
            <p className="role-badge">{user?.role.toUpperCase()}</p>
            <p className="email">{user?.email}</p>
            {user?.department && <p className="department">{user.department}</p>}
          </div>
        </section>

        <section className="profile-details">
          <h3>Account Information</h3>
          <div className="detail-row">
            <label>Full Name</label>
            <span>{user?.name}</span>
          </div>
          <div className="detail-row">
            <label>Email</label>
            <span>{user?.email}</span>
          </div>
          <div className="detail-row">
            <label>Role</label>
            <span>{user?.role}</span>
          </div>
          {user?.department && (
            <div className="detail-row">
              <label>Department</label>
              <span>{user.department}</span>
            </div>
          )}
          <div className="detail-row">
            <label>Member Since</label>
            <span>{new Date(user?.createdAt || '').toLocaleDateString()}</span>
          </div>
        </section>
      </div>
    </main>
  );
}
