/**
 * Landing Page - Timeless Heroes
 * TD-01 FIX: Replaced Turborepo template with a game-themed landing page
 * that provides login/register forms and links to the game.
 */

'use client';

import { FormEvent, useState } from 'react';

import styles from './page.module.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function Home() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? 'login' : 'register';
      const body: Record<string, string> = { email, password };
      if (mode === 'register') body.username = username;

      const res = await fetch(`${API_BASE}/api/v1/auth/${endpoint}`, {
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `${endpoint} failed`);
      }

      const data = await res.json();

      // Store the JWT token and redirect to dashboard
      localStorage.setItem('jwt_token', data.accessToken);
      globalThis.location.href = '/dashboard';
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div style={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          maxWidth: '420px',
          width: '100%',
        }}>
          {/* Title */}
          <div style={{ textAlign: 'center' }}>
            <h1 style={{
              background: 'linear-gradient(135deg, #00e5ff, #b388ff, #ff80ab)',
              fontSize: '2.5rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Timeless Heroes
            </h1>
            <p style={{ color: '#888', fontSize: '0.95rem' }}>
              An idle RPG where your keystrokes write history
            </p>
          </div>

          {/* Auth Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              padding: '2rem',
              width: '100%',
            }}
          >
            {/* Mode toggle */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <button
                type="button"
                onClick={() => { setMode('login'); }}
                style={{
                  background: mode === 'login' ? 'rgba(0,229,255,0.15)' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  color: mode === 'login' ? '#00e5ff' : '#666',
                  cursor: 'pointer',
                  flex: 1,
                  fontWeight: mode === 'login' ? 600 : 400,
                  padding: '0.5rem',
                  transition: 'all 0.2s',
                }}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); }}
                style={{
                  background: mode === 'register' ? 'rgba(0,229,255,0.15)' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  color: mode === 'register' ? '#00e5ff' : '#666',
                  cursor: 'pointer',
                  flex: 1,
                  fontWeight: mode === 'register' ? 600 : 400,
                  padding: '0.5rem',
                  transition: 'all 0.2s',
                }}
              >
                Register
              </button>
            </div>

            {mode === 'register' && (
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); }}
                required
                style={inputStyle}
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); }}
              required
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); }}
              required
              minLength={6}
              style={inputStyle}
            />

            {error && (
              <p style={{ color: '#ff5252', fontSize: '0.85rem', margin: 0 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading
                  ? 'rgba(0,229,255,0.3)'
                  : 'linear-gradient(135deg, #00e5ff, #b388ff)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: 600,
                padding: '0.75rem',
                transition: 'all 0.2s',
              }}
            >
              {loading
                ? 'Loading...'
                : (mode === 'login'
                  ? 'Enter the Game'
                  : 'Create Account')}
            </button>
          </form>

          {/* Quick links */}
          <div style={{ display: 'flex', fontSize: '0.85rem', gap: '1rem' }}>
            <a href="/game" style={{ color: '#b388ff', textDecoration: 'underline' }}>
              Play Now
            </a>
            <a href="/dashboard" style={{ color: '#00e5ff', textDecoration: 'underline' }}>
              Dashboard
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  color: 'inherit',
  fontSize: '0.95rem',
  outline: 'none',
  padding: '0.75rem',
};
