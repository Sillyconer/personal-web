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
    <div className="login login--save-room">
      <form className="login__card t-frame t-frame--raised" onSubmit={handleSubmit}>
        <div className="t-header">
          <div className="t-header__dots">
            <span className="t-header__dot t-header__dot--r" />
            <span className="t-header__dot t-header__dot--y" />
            <span className="t-header__dot t-header__dot--g" />
          </div>
          <span>save room gateway</span>
        </div>

        <div className="login__body">
          <div className="login__scene" aria-hidden="true">
            <div className="login__scene-crystal" />
            <div className="login__scene-ring" />
            <div className="login__scene-ring login__scene-ring--two" />
            <div className="login__scene-door" />
            <div className="login__scene-lantern login__scene-lantern--left" />
            <div className="login__scene-lantern login__scene-lantern--right" />
          </div>

          <p className="eyebrow">private room access</p>
          <h2>enter the backstage workshop</h2>
          <p className="muted">The public world stays open to visitors. This gate only unlocks the maker room, private embeds, and studio tools.</p>

          <label>
            <span className="muted">traveler name</span>
            <input value={username} onChange={(event) => setUsername(event.target.value)} />
          </label>

          <label>
            <span className="muted">secret key</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          <button type="submit" className="px-btn px-btn--primary" style={{ width: '100%' }}>
            unlock workshop
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
