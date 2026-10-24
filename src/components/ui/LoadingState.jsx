import React from 'react';

/* Full-page spinner loader */
const SpinnerLoader = ({ message }) => (
  <div className="state-container">
    <div style={{ position: 'relative', width: 48, height: 48 }}>
      {/* Outer ring */}
      <div style={{
        position: 'absolute', inset: 0,
        border: '3px solid var(--color-border)',
        borderTopColor: 'var(--color-accent)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      {/* Inner dot */}
      <div style={{
        position: 'absolute', inset: 10,
        background: 'var(--color-accent-glow)',
        borderRadius: '50%',
        animation: 'pulse 1.5s ease infinite',
      }} />
    </div>
    {message && (
      <p className="state-message" style={{ marginTop: 'var(--space-3)' }}>{message}</p>
    )}
  </div>
);

/* Skeleton shimmer block */
const Sk = ({ h = 16, w = '100%', r = 'var(--radius-md)', style = {} }) => (
  <div className="skeleton" style={{ height: h, width: w, borderRadius: r, ...style }} />
);

/* Skeleton for stat cards row */
const StatCardsSkeleton = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
    {[...Array(4)].map((_, i) => (
      <div key={i} className="stat-card" style={{ opacity: 0.7 }}>
        <Sk h={44} w={44} r="var(--radius-md)" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Sk h={28} w="60%" />
          <Sk h={12} w="80%" />
        </div>
      </div>
    ))}
  </div>
);

/* Skeleton for a table card */
const TableSkeleton = ({ rows = 5 }) => (
  <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
    <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
      <Sk h={18} w={160} />
      <Sk h={18} w={80} />
    </div>
    <div style={{ padding: 'var(--space-4) var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {[...Array(rows)].map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
          <Sk h={14} w="25%" />
          <Sk h={14} w="20%" />
          <Sk h={14} w="20%" />
          <Sk h={22} w={64} r="var(--radius-full)" />
          <Sk h={14} w="15%" />
        </div>
      ))}
    </div>
  </div>
);

/* Skeleton for a simple card */
const CardSkeleton = ({ lines = 3 }) => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
    <Sk h={18} w={140} />
    {[...Array(lines)].map((_, i) => (
      <Sk key={i} h={13} w={i === lines - 1 ? '60%' : '100%'} />
    ))}
  </div>
);

/**
 * LoadingState
 *
 * Props:
 *   message   – text shown under spinner (spinner variant)
 *   variant   – 'spinner' | 'dashboard' | 'table' | 'card'
 *   rows      – number of skeleton rows (table variant)
 */
const LoadingState = ({ message = 'Loading…', variant = 'spinner', rows = 5 }) => {
  if (variant === 'dashboard') {
    return (
      <div style={{ animation: 'pageFadeIn 0.3s ease' }}>
        <StatCardsSkeleton />
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: 'var(--space-5)', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <TableSkeleton rows={rows} />
            <CardSkeleton lines={2} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <CardSkeleton lines={3} />
            <CardSkeleton lines={4} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'table') return <TableSkeleton rows={rows} />;
  if (variant === 'card')  return <CardSkeleton />;

  return <SpinnerLoader message={message} />;
};

export default LoadingState;
