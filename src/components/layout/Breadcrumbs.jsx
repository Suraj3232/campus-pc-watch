import React from 'react';

const Breadcrumbs = ({ items }) => (
  <nav aria-label="Breadcrumb">
    <ol style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', listStyle: 'none' }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {i > 0 && <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>/</span>}
          <span style={{ fontSize: 'var(--text-xs)', color: i === items.length - 1 ? 'var(--color-text-muted)' : 'var(--color-accent)' }}>
            {item}
          </span>
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumbs;
