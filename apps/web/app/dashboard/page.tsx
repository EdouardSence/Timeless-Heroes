/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║      🎮 COMMAND CENTER — Cozy Dev Dashboard                               ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║  A gamified IDE-style dashboard for CodeTyper RPG                         ║
 * ║  Features dev jargon: LoC, Version, Daily Commits, Package Manager        ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

'use client';

import { GlassCard, NeonProgress, NeonButton, StatCard } from '@repo/ui';

import styles from './dashboard.module.css';

// Mock data - in production, this would come from your API
const mockData = {
  dailyCommits: [
    { completed: true, id: 1, title: 'Push 1,000 lines of code', xp: 500 },
    { completed: true, id: 2, title: 'Maintain a 50x combo streak', xp: 300 },
    { completed: false, id: 3, title: 'Code for 30 minutes straight', xp: 400 },
    { completed: false, id: 4, title: 'Reach version milestone', xp: 1000 },
  ],
  shopItems: [
    { icon: '⌨️', id: 1, name: 'RGB Keyboard', price: 5000 },
    { icon: '🥽', id: 2, name: 'VR Upgrade', price: 12_000 },
    { icon: '🧥', id: 3, name: 'Neon Hoodie', price: 3500 },
    { icon: '😺', id: 4, name: 'Hacker Cat', price: 25_000 },
  ],
  user: {
    experience: 7420,
    experienceToNext: 10_000,
    level: 23,
    linesOfCode: 1_847_293,
    multiplier: 2.4,
    name: 'CyberDev42',
    passiveRate: 12.5,
    streak: 14,
    tier: 'MID-LEVEL',
    totalKeyPresses: 892_451,
  },
};

// Helper functions
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

export default function DashboardPage() {
  const { dailyCommits, shopItems, user } = mockData;
  const buildProgress = (user.experience / user.experienceToNext) * 100;

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
            <a href="#" className={styles.navLink}>
              ~/inventory
            </a>
            <a href="#" className={styles.navLink}>
              ~/marketplace
            </a>
            <a href="#" className={styles.navLink}>
              ~/achievements
            </a>
          </nav>

          <div className={styles.userPill}>
            <div className={styles.userAvatar}>😺</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userVersion}>
                v{levelToVersion(user.level)}
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
              <span className={styles.locTierBadge}>{user.tier}</span>
            </div>

            <div className={styles.locValue}>
              <span className={styles.locNumber}>
                {formatNumber(user.linesOfCode)}
              </span>
              <span className={styles.locUnit}>LoC</span>
            </div>

            <div className={styles.buildProgress}>
              <div className={styles.buildInfo}>
                <span className={styles.buildLabel}>
                  <span className={styles.buildIcon}>▶</span>
                  build:
                  <span className={styles.buildVersion}>
                    v{levelToVersion(user.level)}
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
            <div className={styles.avatarName}>{user.name}</div>
            <div className={styles.avatarTitle}>
              {'// '}
              {user.tier}
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
              value={`×${user.multiplier.toFixed(1)}`}
              label="Boost Multiplier"
              color="cyan"
            />

            <StatCard
              icon="◎"
              value={`+${user.passiveRate.toFixed(1)}`}
              label="Passive LoC/sec"
              color="lavender"
            />

            <StatCard
              icon="⌨"
              value={formatNumber(user.totalKeyPresses)}
              label="Total Keystrokes"
              color="pink"
            />

            <StatCard
              icon="🔥"
              value={user.streak}
              label="Day Streak"
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
                {dailyCommits.filter((q) => q.completed).length}/
                {dailyCommits.length}
              </span>
            </div>

            <div className={styles.questList}>
              {dailyCommits.map((quest) => (
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
                      <span>💎</span>
                      {formatNumber(item.price)}
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
