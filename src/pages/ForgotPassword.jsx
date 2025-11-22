import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    // Simulate password reset
    setTimeout(() => {
      setMessage('Password reset link has been sent to your email (demo mode)');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="auth-logo">StreamFlix</Link>
          <h1>Reset Password</h1>
          <p className="auth-subtitle">Enter your email to receive a password reset link</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {message && <div className="auth-success">{message}</div>}

          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div className="auth-footer">
            <Link to="/login" className="auth-link">Back to Sign In</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

