import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../utils/auth';
import './Auth.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await authService.signIn(email, password);

    if (result.success) {
      onLogin(result.user);
      navigate('/profiles');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="auth-logo">StreamFlix</Link>
          <h1>Sign In</h1>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

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

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <div className="auth-options">
            <label className="auth-checkbox">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="auth-footer">
            <p>
              New to StreamFlix? <Link to="/signup" className="auth-link">Sign up now</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

