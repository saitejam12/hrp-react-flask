import './UnauthorizedPage.css';

export function UnauthorizedPage() {
  return (
    <main className="unauthorized-page">
      <div className="unauthorized-container">
        <div className="error-code">403</div>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this resource.</p>
        <p className="error-details">
          Your current role does not grant access to this page. Please contact your administrator if you believe this is a mistake.
        </p>
        <a href="/dashboard" className="back-btn">
          ← Back to Dashboard
        </a>
      </div>
    </main>
  );
}
