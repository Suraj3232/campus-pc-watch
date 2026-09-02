import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bell, User, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../auth/useAuth';
import { useToast } from '../ui/Toast';
import { useAlerts } from '../../hooks/useAlerts';

const Topbar = ({ title }) => {
  const { user, userRole, logout } = useAuth();
  const toast    = useToast();
  const navigate = useNavigate();
  const { alerts } = useAlerts();
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [bellOpen,  setBellOpen]  = useState(false);
  const menuRef = useRef(null);
  const bellRef = useRef(null);

  const activeAlerts = alerts?.filter((a) => !a.resolved) ?? [];
  const profilePath  = userRole === 'admin' ? '/admin/profile' : '/user/profile';
  const settingsPath = userRole === 'admin' ? '/admin/settings' : null;

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out.');
    navigate('/');
  };

  return (
    <header style={{
      height:       'var(--topbar-height)',
      background:   'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      display:      'flex',
      alignItems:   'center',
      justifyContent: 'space-between',
      padding:      '0 var(--space-6)',
      position:     'sticky',
      top:          0,
      zIndex:       100,
    }}>
      {/* Left: page title */}
      <h1 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
        {title}
      </h1>

      {/* Right: actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        {/* Bell */}
        <div style={{ position: 'relative' }} ref={bellRef}>
          <button
            id="notification-btn"
            className="btn btn-ghost btn-icon"
            onClick={() => setBellOpen((p) => !p)}
            aria-label={`${activeAlerts.length} active alerts`}
            style={{ position: 'relative' }}
          >
            <Bell size={18} />
            {activeAlerts.length > 0 && (
              <span style={{
                position: 'absolute', top: 4, right: 4,
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--color-offline)',
                border: '1.5px solid var(--color-surface)',
              }} />
            )}
          </button>
          {bellOpen && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 8px)',
              width: 320, background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)', zIndex: 200,
              animation: 'modalFadeIn 0.15s ease',
            }}>
              <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                Active Alerts
              </div>
              <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                {activeAlerts.length === 0 ? (
                  <p style={{ padding: 'var(--space-4)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', textAlign: 'center' }}>
                    No active alerts
                  </p>
                ) : activeAlerts.slice(0, 5).map((a) => (
                  <div key={a.id} style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-primary)' }}>{a.device}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>{a.message}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'center' }}>
                <Link
                  to={userRole === 'admin' ? '/admin/alerts' : '/user/alerts'}
                  style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent)' }}
                  onClick={() => setBellOpen(false)}
                >
                  View all alerts
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button
            id="profile-menu-btn"
            className="btn btn-ghost"
            onClick={() => setMenuOpen((p) => !p)}
            style={{ gap: 'var(--space-2)', padding: '6px var(--space-3)' }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--color-accent-glow)',
              border: '2px solid var(--color-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-accent)',
              fontSize: 'var(--text-sm)', fontWeight: 600,
            }}>
              {user?.displayName?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div style={{ textAlign: 'left' }} className="hide-mobile">
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                {user?.displayName ?? 'User'}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
                {userRole}
              </div>
            </div>
            <ChevronDown size={14} className="hide-mobile" />
          </button>

          {menuOpen && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 8px)',
              width: 200, background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)', zIndex: 200,
              overflow: 'hidden',
              animation: 'modalFadeIn 0.15s ease',
            }}>
              <Link
                to={profilePath}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', textDecoration: 'none' }}
                onClick={() => setMenuOpen(false)}
              >
                <User size={15} /> Profile
              </Link>
              {settingsPath && (
                <Link
                  to={settingsPath}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', textDecoration: 'none' }}
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings size={15} /> Settings
                </Link>
              )}
              <div style={{ borderTop: '1px solid var(--color-border)' }} />
              <button
                className="btn btn-ghost"
                onClick={handleLogout}
                style={{ width: '100%', justifyContent: 'flex-start', gap: 'var(--space-3)', color: 'var(--color-offline)', padding: 'var(--space-3) var(--space-4)', borderRadius: 0 }}
              >
                <LogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
