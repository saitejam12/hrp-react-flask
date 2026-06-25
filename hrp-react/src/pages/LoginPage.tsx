import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

export function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      window.location.href = '/dashboard';
    } catch (err) {
      setFormError(error || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>HRP</h1>
          <p>Human Resource Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          {(formError || error) && (
            <div className="error-message">
              {formError || error}
            </div>
          )}

          <button type="submit" disabled={isLoading} className="login-btn">
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p className="demo-info">
            <strong>Demo Accounts:</strong>
          </p>
          <div className="demo-accounts">
            <div className="account">
              <strong>Admin:</strong> admin@example.com
            </div>
            <div className="account">
              <strong>Manager:</strong> manager@example.com
            </div>
            <div className="account">
              <strong>Employee:</strong> employee@example.com
            </div>
          </div>
          <p className="password-note">Password: password123</p>
        </div>
      </div>
    </div>
  );
}
