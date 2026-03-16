/**
 * COMMAND CENTER -- Cozy Dev Dashboard
 * A gamified IDE-style dashboard for CodeTyper RPG
 * Features dev jargon: LoC, Version, Daily Commits, Package Manager
 *
 * BUG-09 FIX: Replaced hardcoded mockData with real API calls
 * to /api/v1/auth/me and /api/v1/progression/me
 */

'use client';

import { SHOP_ITEMS } from '@repo/shared-types';
import { GlassCard, NeonButton, NeonProgress, StatCard } from '@repo/ui';
import { useEffect, useState } from 'react';


import styles from './dashboard.module.css';

// ── Types ───────────────────────────────────────────────────────────────────

interface IUserInfo {
  email: string;
  userId: string;
  username: string;
}

interface IProgressionData {
  clickMultiplier: number;
  criticalChance: number;
  criticalMultiplier: number;
  experience: string;
  level: number;
  linesOfCode: string;
  passiveMultiplier: number;
  userId: string;
}

// Daily commits are not yet backed by a real system -- placeholder quests
const DAILY_COMMITS = [
  { completed: false, id: 1, title: 'Push 1,000 lines of code', xp: 500 },
  { completed: false, id: 2, title: 'Maintain a 50x combo streak', xp: 300 },
  { completed: false, id: 3, title: 'Code for 30 minutes straight', xp: 400 },
  { completed: false, id: 4, title: 'Reach version milestone', xp: 1000 },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
}

function levelToVersion(level: number): string {
  const major = Math.floor(level / 10);
  const minor = level % 10;
  return `${major}.${minor}.0`;
}

function getTier(level: number): string {
  if (level >= 50) return 'SENIOR';
  if (level >= 30) return 'MID-LEVEL';
  if (level >= 15) return 'JUNIOR';
  if (level >= 5) return 'INTERN';
  return 'NOOB';
}

/**
 * Estimate experience-to-next from level (same formula as progression service).
 * This is a client-side approximation since IProgressionData does not include it.
 */
function experienceToNext(level: number): number {
  return Math.floor(100 * Math.pow(1.15, level - 1));
}

// ── Component ───────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [user, setUser] = useState<IUserInfo | null>(null);
  const [progression, setProgression] = useState<IProgressionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');

    if (!token) {
      setError('Not logged in. Please log in first.');
      setLoading(false);
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    // Fetch user info and progression in parallel
    Promise.all([
      fetch(`${API_BASE}/api/v1/auth/me`, { headers }).then((r) => {
        if (!r.ok) throw new Error('Failed to fetch user info');
        return r.json();
      }),
      fetch(`${API_BASE}/api/v1/progression/me`, { headers }).then((r) => {
        if (!r.ok) throw new Error('Failed to fetch progression');
        return r.json();
      }),
    ])
      .then(([userData, progressionData]) => {
        setUser(userData as IUserInfo);
        setProgression(progressionData as IProgressionData);
      })
      .catch((error_) => {
        setError(error_ instanceof Error ? error_.message : 'Unknown error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // ── Loading / Error states ──────────────────────────────────────────

  if (loading) {
    return (
      <div className={styles.commandCenter}>
        <div className={styles.bgCanvas}>
          <div className={`${styles.bgOrb} ${styles['bgOrb--cyan']}`} />
          <div className={`${styles.bgOrb} ${styles['bgOrb--lavender']}`} />
          <div className={`${styles.bgOrb} ${styles['bgOrb--pink']}`} />
          <div className={styles.circuitGrid} />
        </div>
        <main
          className={styles.main}
          style={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            minHeight: '60vh',
          }}
        >
          <p style={{ color: 'var(--color-cyan, #00e5ff)', fontSize: '1.2rem' }}>
            Loading dashboard...
          </p>
        </main>
      </div>
    );
  }

  if (error || !user || !progression) {
    return (
      <div className={styles.commandCenter}>
        <div className={styles.bgCanvas}>
          <div className={`${styles.bgOrb} ${styles['bgOrb--cyan']}`} />
          <div className={`${styles.bgOrb} ${styles['bgOrb--lavender']}`} />
          <div className={`${styles.bgOrb} ${styles['bgOrb--pink']}`} />
          <div className={styles.circuitGrid} />
        </div>
        <main
          className={styles.main}
          style={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            minHeight: '60vh',
          }}
        >
          <p style={{ color: '#ff5252', fontSize: '1.2rem' }}>
            {error || 'Failed to load data'}
          </p>
        </main>
      </div>
    );
  }

  // ── Derived values ──────────────────────────────────────────────────

  const linesOfCode = Number(progression.linesOfCode) || 0;
  const experience = Number(progression.experience) || 0;
  const expToNext = experienceToNext(progression.level);
  const buildProgress =
    expToNext > 0 ? Math.min((experience / expToNext) * 100, 100) : 0;
  const tier = getTier(progression.level);

  // Use first 4 shop items for the dashboard quick-buy section
  const shopItems = SHOP_ITEMS.slice(0, 4);

  return (
    <div className={styles.commandCenter}>
      {/* Animated Background */}
      <div className={styles.bgCanvas}>
        <div className={`${styles.bgOrb} ${styles['bgOrb--cyan']}`} />
        <div className={`${styles.bgOrb} ${styles['bgOrb--lavender']}`} />
        <div className={`${styles.bgOrb} ${styles['bgOrb--pink']}`} />
        <div className={styles.circuitGrid} />
      </div>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>🐱</div>
            <div className={styles.logoText}>
              Cyber<span>Cat</span> RPG
            </div>
          </div>

          <nav className={styles.nav}>
            <a
              href="#"
              className={`${styles.navLink} ${styles['navLink--active']}`}
            >
              ~/dashboard
            </a>
            <a href="/game" className={styles.navLink}>
              ~/game
            </a>
            <a href="#" className={styles.navLink}>
              ~/inventory
            </a>
            <a href="#" className={styles.navLink}>
              ~/achievements
            </a>
          </nav>

          <div className={styles.userPill}>
            <div className={styles.userAvatar}>😺</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.username}</span>
              <span className={styles.userVersion}>
                v{levelToVersion(progression.level)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Hero Section - Main Stats */}
        <section className={styles.heroSection}>
          {/* LoC Card */}
          <div className={styles.locCard}>
            <div className={styles.locHeader}>
              <span className={styles.locLabel}>
                {'// Total Lines of Code'}
              </span>
              <span className={styles.locTierBadge}>{tier}</span>
            </div>

            <div className={styles.locValue}>
              <span className={styles.locNumber}>
                {formatNumber(linesOfCode)}
              </span>
              <span className={styles.locUnit}>LoC</span>
            </div>

            <div className={styles.buildProgress}>
              <div className={styles.buildInfo}>
                <span className={styles.buildLabel}>
                  <span className={styles.buildIcon}>▶</span>
                  build:
                  <span className={styles.buildVersion}>
                    v{levelToVersion(progression.level)}
                  </span>
                </span>
                <span className={styles.buildPercent}>
                  {Math.floor(buildProgress)}%
                </span>
              </div>
              <NeonProgress
                value={buildProgress}
                max={100}
                variant="cyan"
                size="md"
                animated={true}
              />
            </div>
          </div>

          {/* Avatar Card */}
          <div className={styles.avatarCard}>
            <div className={styles.avatarFrame}>
              <div className={styles.avatarGlow} />
              <div className={styles.avatarImage}>🐱</div>
            </div>
            <div className={styles.avatarName}>{user.username}</div>
            <div className={styles.avatarTitle}>
              {'// '}
              {tier}
              {' DEVELOPER'}
            </div>
          </div>
        </section>

        {/* Stats Grid - System Monitor Style */}
        <section className={styles.statsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>📊 System Monitor</h2>
            <div className={styles.sectionLine} />
          </div>

          <div className={styles.statsGrid}>
            <StatCard
              icon="⚡"
              value={`×${progression.clickMultiplier.toFixed(1)}`}
              label="Click Multiplier"
              color="cyan"
            />

            <StatCard
              icon="◎"
              value={`+${progression.passiveMultiplier.toFixed(1)}`}
              label="Passive LoC/sec"
              color="lavender"
            />

            <StatCard
              icon="🎯"
              value={`${(progression.criticalChance * 100).toFixed(0)}%`}
              label="Crit Chance"
              color="pink"
            />

            <StatCard
              icon="🔥"
              value={`×${progression.criticalMultiplier.toFixed(1)}`}
              label="Crit Multiplier"
              color="mint"
            />
          </div>
        </section>

        {/* Two Column Layout */}
        <section className={styles.columnsSection}>
          {/* Daily Commits (Quests) */}
          <div className={styles.dailyCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>📋 Daily Commits</h3>
              <span className={styles.cardBadge}>
                {DAILY_COMMITS.filter((q) => q.completed).length}/
                {DAILY_COMMITS.length}
              </span>
            </div>

            <div className={styles.questList}>
              {DAILY_COMMITS.map((quest) => (
                <div
                  key={quest.id}
                  className={`${styles.questItem} ${quest.completed ? styles['questItem--completed'] : ''}`}
                >
                  <div
                    className={`${styles.questCheck} ${quest.completed ? styles['questCheck--done'] : ''}`}
                  >
                    {quest.completed && '✓'}
                  </div>
                  <div className={styles.questInfo}>
                    <div className={styles.questTitle}>{quest.title}</div>
                    <div className={styles.questXp}>+{quest.xp} LoC</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Package Manager (Shop) */}
          <div className={styles.shopCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>📦 Package Manager</h3>
              <span className={styles.cardBadge}>npm install</span>
            </div>

            <div className={styles.shopGrid}>
              {shopItems.map((item) => (
                <GlassCard
                  key={item.id}
                  variant="gold"
                  size="sm"
                  glow={true}
                  className={styles.shopItem}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div className={styles.shopItemIcon}>{item.icon}</div>
                    <div className={styles.shopItemName}>{item.name}</div>
                    <div className={styles.shopItemPrice}>
                      <span>LoC </span>
                      {formatNumber(item.baseCost)}
                    </div>
                    <NeonButton
                      variant="secondary"
                      color="gold"
                      size="sm"
                      fullWidth
                      style={{ marginTop: '8px' }}
                    >
                      Buy
                    </NeonButton>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
