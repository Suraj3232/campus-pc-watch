import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar  from './Topbar';

const AppShell = ({ children, title }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((p) => !p)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Topbar title={title} />
        <main style={{ flex: 1, padding: 'var(--space-6)', animation: 'pageFadeIn 0.2s ease', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
