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
      setError('access denied. invalid credentials.');
      return;
    }

    navigate('/admin');
  };

  return (
    <div className="login">
      <form className="login__card t-frame" onSubmit={handleSubmit}>
        <div className="t-header">
          <div className="t-header__dots">
            <span className="t-header__dot t-header__dot--r" />
            <span className="t-header__dot t-header__dot--y" />
            <span className="t-header__dot t-header__dot--g" />
          </div>
          <span>login --studio</span>
        </div>

        <div className="login__body">
          <p className="eyebrow">&gt; authentication required</p>
          <h2>studio access</h2>

          <label>
            <span className="muted">username:</span>
            <input value={username} onChange={(event) => setUsername(event.target.value)} />
          </label>

          <label>
            <span className="muted">password:</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          <button type="submit" className="px-btn px-btn--primary" style={{ width: '100%' }}>
            &gt; authenticate
          </button>

          {error ? <p className="text-red">{error}</p> : null}

          <p className="login__hint t-frame t-frame--sunken">
            dev credentials: {ownerCredentials.username} / {ownerCredentials.password}
          </p>
        </div>
      </form>
    </div>
  );
};
