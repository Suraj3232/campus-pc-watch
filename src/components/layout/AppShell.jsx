import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar  from './Topbar';

const AppShell = ({ children, title }) => {
  const [collapsed,    setCollapsed]    = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [isMobile,     setIsMobile]     = useState(window.innerWidth <= 768);

  // Detect mobile
  useEffect(() => {
    const handler = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Close mobile sidebar on route change (children update)
  useEffect(() => {
    setMobileOpen(false);
  }, [title]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)', position: 'relative' }}>

      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: isMobile ? 'fixed' : 'sticky',
        top: 0,
        left: isMobile ? (mobileOpen ? 0 : '-280px') : 0,
        height: isMobile ? '100vh' : 'auto',
        zIndex: isMobile ? 200 : 1,
        transition: 'left var(--transition-normal)',
        flexShrink: 0,
        alignSelf: 'flex-start',
      }}>
        <Sidebar
          collapsed={isMobile ? false : collapsed}
          onToggle={() => setCollapsed((p) => !p)}
          onClose={() => setMobileOpen(false)}
          isMobile={isMobile}
        />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Topbar
          title={title}
          onMenuToggle={isMobile ? () => setMobileOpen((p) => !p) : undefined}
        />
        <main style={{
          flex: 1,
          padding: 'var(--space-6)',
          animation: 'pageFadeIn 0.2s ease',
          overflowY: 'auto',
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
