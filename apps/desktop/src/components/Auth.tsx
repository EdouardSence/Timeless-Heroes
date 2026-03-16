/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║   AUTH WINDOW — Cozy Cyberpunk Login / Register                           ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║  Shown at app startup when no saved session is found.                     ║
 * ║  On success, sends `launch-game` IPC to main process.                    ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { useState } from 'react';
import './Auth.css';

type Mode = 'login' | 'register';

export default function Auth() {
  const [mode, setMode] = useState<Mode>('login');

  // Form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setError(null);
    setUsername('');
    setEmail('');
    setPassword('');
  };

  const switchMode = (next: Mode) => {
    reset();
    setMode(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let result: { success: boolean; error?: string };

      if (mode === 'login') {
        result = await window.electronAPI.backendLogin(email, password);
      } else {
        result = await window.electronAPI.backendRegister(username, email, password);
      }

      if (result.success) {
        window.electronAPI.launchGame();
      } else {
        setError(result.error ?? 'Unknown error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Circuit border */}
      <div className="auth__circuit-border" />

      {/* Glass background */}
      <div className="auth__glass" />

      {/* Header */}
      <div className="auth__header">
        <div className="auth__terminal-dots">
          <span className="auth__dot auth__dot--close" />
          <span className="auth__dot auth__dot--minimize" />
          <span className="auth__dot auth__dot--maximize" />
        </div>
        <div className="auth__title">
          <span className="auth__title-prefix">~/</span>
          <span className="auth__title-text">timeless-heroes</span>
        </div>
      </div>

      {/* Body */}
      <div className="auth__body">
        {/* Logo / hero area */}
        <div className="auth__hero">
          <div className="auth__logo-icon">⬡</div>
          <h1 className="auth__logo-text">Timeless Heroes</h1>
          <p className="auth__tagline">
            {mode === 'login' ? '// Authenticate to continue' : '// Create your account'}
          </p>
        </div>

        {/* Mode tabs */}
        <div className="auth__tabs">
          <button
            className={`auth__tab ${mode === 'login' ? 'auth__tab--active' : ''}`}
            onClick={() => switchMode('login')}
          >
            login
          </button>
          <button
            className={`auth__tab ${mode === 'register' ? 'auth__tab--active' : ''}`}
            onClick={() => switchMode('register')}
          >
            register
          </button>
        </div>

        {/* Form */}
        <form className="auth__form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="auth__field">
              <label className="auth__label" htmlFor="auth-username">
                username
              </label>
              <input
                id="auth-username"
                className="auth__input"
                type="text"
                autoComplete="username"
                placeholder="cyber_cat_42"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                disabled={loading}
              />
            </div>
          )}

          <div className="auth__field">
            <label className="auth__label" htmlFor="auth-email">
              email
            </label>
            <input
              id="auth-email"
              className="auth__input"
              type="email"
              autoComplete="email"
              placeholder="dev@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="auth__field">
            <label className="auth__label" htmlFor="auth-password">
              password
            </label>
            <input
              id="auth-password"
              className="auth__input"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="auth__error">
              <span className="auth__error-icon">✖</span>
              {error}
            </div>
          )}

          <button
            className={`auth__submit ${loading ? 'auth__submit--loading' : ''}`}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="auth__spinner" />
            ) : mode === 'login' ? (
              'git pull origin session'
            ) : (
              'git init new-hero'
            )}
          </button>
        </form>
      </div>

      {/* Scan lines overlay */}
      <div className="auth__scanlines" />
    </div>
  );
}
