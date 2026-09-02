import React from 'react';

const PageHeader = ({ title, subtitle, actions, breadcrumbs }) => (
  <div style={{ marginBottom: 'var(--space-6)' }}>
    {breadcrumbs && (
      <nav aria-label="Breadcrumb" style={{ marginBottom: 'var(--space-2)' }}>
        <ol style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', listStyle: 'none' }}>
          {breadcrumbs.map((crumb, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              {i > 0 && <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>/</span>}
              <span style={{
                fontSize: 'var(--text-xs)',
                color: i === breadcrumbs.length - 1 ? 'var(--color-text-muted)' : 'var(--color-accent)',
              }}>
                {crumb}
              </span>
            </li>
          ))}
        </ol>
      </nav>
    )}
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
      <div>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>{title}</h2>
        {subtitle && <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>{subtitle}</p>}
      </div>
      {actions && (
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>{actions}</div>
      )}
    </div>
  </div>
);

export default PageHeader;
