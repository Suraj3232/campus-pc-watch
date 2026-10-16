import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bell, User, ChevronDown, LogOut, Settings, Sun, Moon, Menu } from 'lucide-react';
import { useAuth } from '../../auth/useAuth';
import { useToast } from '../ui/Toast';
import { useAlerts } from '../../hooks/useAlerts';
import { useTheme } from '../../auth/ThemeContext';
import { timeAgo } from '../../utils/formatters';

const Topbar = ({ title, onMenuToggle }) => {
  const { user, userRole, logout } = useAuth();
  const toast    = useToast();
  const navigate = useNavigate();
  const { alerts } = useAlerts();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
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

  const initials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header style={{
      height: 'var(--topbar-height)',
      background: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--space-5)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(8px)',
    }}>
      {/* Left: hamburger (mobile) + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        {/* Mobile menu button */}
        {onMenuToggle && (
          <button
            className="btn btn-ghost btn-icon hide-desktop"
            onClick={onMenuToggle}
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
        )}
        <div>
          <h1 style={{
            fontSize: 'var(--text-base)', fontWeight: 700,
            color: 'var(--color-text-primary)', letterSpacing: '-0.01em',
          }}>
            {title}
          </h1>
        </div>
      </div>

      {/* Right: actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>

        {/* Theme Toggle */}
        <button
          className="btn btn-ghost btn-icon"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
          style={{ position: 'relative' }}
        >
          {theme === 'dark'
            ? <Sun size={18} style={{ color: 'var(--color-warning)' }} />
            : <Moon size={18} style={{ color: 'var(--color-accent)' }} />
          }
        </button>

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
                position: 'absolute', top: 6, right: 6,
                width: 7, height: 7, borderRadius: '50%',
                background: 'var(--color-offline)',
                border: '1.5px solid var(--color-surface)',
                animation: 'onlinePulse 1.5s ease infinite',
              }} />
            )}
          </button>
          {bellOpen && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 8px)',
              width: 320,
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)', zIndex: 200,
              animation: 'modalFadeIn 0.15s ease',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: 'var(--space-3) var(--space-4)',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Active Alerts</span>
                {activeAlerts.length > 0 && (
                  <span className="badge badge-offline">{activeAlerts.length}</span>
                )}
              </div>
              <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                {activeAlerts.length === 0 ? (
                  <p style={{ padding: 'var(--space-6)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', textAlign: 'center' }}>
                    ✅ No active alerts
                  </p>
                ) : activeAlerts.slice(0, 6).map((a) => (
                  <div key={a.id} style={{
                    padding: 'var(--space-3) var(--space-4)',
                    borderBottom: '1px solid var(--color-border)',
                    transition: 'background var(--transition-fast)',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-3)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{a.device}</span>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{timeAgo(a.timestamp)}</span>
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{a.message}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'center', borderTop: '1px solid var(--color-border)' }}>
                <Link
                  to={userRole === 'admin' ? '/admin/alerts' : '/user/alerts'}
                  style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent)', fontWeight: 500 }}
                  onClick={() => setBellOpen(false)}
                >
                  View all alerts →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: 'var(--color-border)', margin: '0 var(--space-1)' }} />

        {/* Profile */}
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button
            id="profile-menu-btn"
            className="btn btn-ghost"
            onClick={() => setMenuOpen((p) => !p)}
            style={{ gap: 'var(--space-2)', padding: '5px var(--space-2)' }}
          >
            {/* Avatar */}
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-accent), #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 12, fontWeight: 700,
              flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ textAlign: 'left' }} className="hide-mobile">
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
                {user?.displayName ?? 'User'}
              </div>
              <div style={{ fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'capitalize', lineHeight: 1 }}>
                {userRole}
              </div>
            </div>
            <ChevronDown size={13} className="hide-mobile" style={{ color: 'var(--color-text-muted)' }} />
          </button>

          {menuOpen && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 8px)',
              width: 200,
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)', zIndex: 200,
              overflow: 'hidden',
              animation: 'modalFadeIn 0.15s ease',
            }}>
              {/* User info header */}
              <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {user?.displayName ?? 'User'}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                  {user?.email ?? ''}
                </div>
              </div>

              <Link
                to={profilePath}
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                  padding: 'var(--space-3) var(--space-4)',
                  fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
                  textDecoration: 'none', transition: 'background var(--transition-fast)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                onClick={() => setMenuOpen(false)}
              >
                <User size={15} /> Profile
              </Link>
              {settingsPath && (
                <Link
                  to={settingsPath}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                    padding: 'var(--space-3) var(--space-4)',
                    fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
                    textDecoration: 'none', transition: 'background var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-3)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings size={15} /> Settings
                </Link>
              )}
              <div style={{ borderTop: '1px solid var(--color-border)' }} />
              <button
                className="btn btn-ghost"
                onClick={handleLogout}
                style={{
                  width: '100%', justifyContent: 'flex-start',
                  gap: 'var(--space-3)', color: 'var(--color-offline)',
                  padding: 'var(--space-3) var(--space-4)', borderRadius: 0,
                  fontSize: 'var(--text-sm)',
                }}
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
