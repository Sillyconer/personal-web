import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { ownerCredentials } from '../data/auth';
import { useAuthStore } from '../store/useAuthStore';
import './LoginPage.css';

export const LoginPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const success = login({ username, password });

    if (!success) {
      setError('Invalid owner credentials. Update the placeholder auth store before deployment.');
      return;
    }

    navigate('/admin');
  };

  return (
    <div className="login-page">
      <form className="login-card surface-panel" onSubmit={handleSubmit}>
        <p className="eyebrow">Owner access</p>
        <h2>Login to PersonalWeb</h2>
        <p>
          This is a temporary owner-only gate so you can unlock admin tools and private Mapper views
          while the real auth backend is still pending.
        </p>

        <label>
          Username
          <input value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        <button type="submit">Enter owner mode</button>
        {error ? <p className="login-error">{error}</p> : null}
        <p className="login-hint">
          Dev placeholder credentials: `{ownerCredentials.username}` / `{ownerCredentials.password}`
        </p>
      </form>
    </div>
  );
};
