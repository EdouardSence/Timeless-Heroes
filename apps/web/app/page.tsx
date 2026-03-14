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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `${endpoint} failed`);
      }

      const data = await res.json();

      // Store the JWT token and redirect to dashboard
      localStorage.setItem('jwt_token', data.accessToken);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          maxWidth: '420px',
          width: '100%',
        }}>
          {/* Title */}
          <div style={{ textAlign: 'center' }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #00e5ff, #b388ff, #ff80ab)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.5rem',
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
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              width: '100%',
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            {/* Mode toggle */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setMode('login')}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: 'none',
                  borderRadius: '6px',
                  background: mode === 'login' ? 'rgba(0,229,255,0.15)' : 'transparent',
                  color: mode === 'login' ? '#00e5ff' : '#666',
                  cursor: 'pointer',
                  fontWeight: mode === 'login' ? 600 : 400,
                  transition: 'all 0.2s',
                }}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: 'none',
                  borderRadius: '6px',
                  background: mode === 'register' ? 'rgba(0,229,255,0.15)' : 'transparent',
                  color: mode === 'register' ? '#00e5ff' : '#666',
                  cursor: 'pointer',
                  fontWeight: mode === 'register' ? 600 : 400,
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
                onChange={(e) => setUsername(e.target.value)}
                required
                style={inputStyle}
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                padding: '0.75rem',
                border: 'none',
                borderRadius: '8px',
                background: loading
                  ? 'rgba(0,229,255,0.3)'
                  : 'linear-gradient(135deg, #00e5ff, #b388ff)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {loading
                ? 'Loading...'
                : mode === 'login'
                  ? 'Enter the Game'
                  : 'Create Account'}
            </button>
          </form>

          {/* Quick links */}
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
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
  padding: '0.75rem',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  background: 'rgba(255,255,255,0.05)',
  color: 'inherit',
  fontSize: '0.95rem',
  outline: 'none',
};
