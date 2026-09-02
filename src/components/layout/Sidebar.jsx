import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Monitor, FlaskConical, Bell, Clock, BarChart3,
  Users, Settings, ChevronLeft, ChevronRight, Network, LogOut,
} from 'lucide-react';
import { useAuth } from '../../auth/useAuth';
import { useToast } from '../ui/Toast';

const adminNav = [
  { to: '/admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/admin/devices',   icon: <Monitor          size={18} />, label: 'Devices'   },
  { to: '/admin/labs',      icon: <FlaskConical     size={18} />, label: 'Labs'      },
  { to: '/admin/alerts',    icon: <Bell             size={18} />, label: 'Alerts'    },
  { to: '/admin/history',   icon: <Clock            size={18} />, label: 'History'   },
  { to: '/admin/reports',   icon: <BarChart3        size={18} />, label: 'Reports'   },
  { to: '/admin/users',     icon: <Users            size={18} />, label: 'Users'     },
  { to: '/admin/settings',  icon: <Settings         size={18} />, label: 'Settings'  },
];

const userNav = [
  { to: '/user/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/user/devices',   icon: <Monitor          size={18} />, label: 'Devices'   },
  { to: '/user/labs',      icon: <FlaskConical     size={18} />, label: 'Labs'      },
  { to: '/user/alerts',    icon: <Bell             size={18} />, label: 'Alerts'    },
  { to: '/user/history',   icon: <Clock            size={18} />, label: 'History'   },
  { to: '/user/reports',   icon: <BarChart3        size={18} />, label: 'Reports'   },
];

const Sidebar = ({ collapsed, onToggle }) => {
  const { userRole, logout } = useAuth();
  const toast    = useToast();
  const navigate = useNavigate();
  const nav      = userRole === 'admin' ? adminNav : userNav;

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully.');
    navigate('/');
  };

  return (
    <aside
      style={{
        width:      collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        minHeight:  '100vh',
        background: 'var(--color-surface)',
        borderRight:'1px solid var(--color-border)',
        display:    'flex',
        flexDirection: 'column',
        transition: 'width var(--transition-normal)',
        overflow:   'hidden',
        position:   'relative',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center',
        gap: 'var(--space-3)',
        padding: collapsed ? 'var(--space-4) var(--space-3)' : 'var(--space-4) var(--space-5)',
        borderBottom: '1px solid var(--color-border)',
        height: 'var(--topbar-height)',
        overflow: 'hidden',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 'var(--radius-md)',
          background: 'var(--color-accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Network size={18} color="#fff" />
        </div>
        {!collapsed && (
          <div style={{ animation: 'fadeInFromLeft 0.2s ease' }}>
            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', lineHeight: 1.1 }}>Campus PC</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', lineHeight: 1 }}>Watch</div>
          </div>
        )}
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div style={{ padding: 'var(--space-3) var(--space-5)' }}>
          <span className={`badge badge-${userRole}`} style={{ fontSize: 10 }}>
            {userRole === 'admin' ? '⚡ Admin' : '👤 User'}
          </span>
        </div>
      )}

      {/* Nav links */}
      <nav style={{ flex: 1, padding: 'var(--space-2) var(--space-2)' }} aria-label="Main navigation">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={collapsed ? item.label : undefined}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: collapsed ? 'var(--space-3)' : 'var(--space-3) var(--space-3)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--space-1)',
              fontWeight: 500,
              fontSize: 'var(--text-sm)',
              color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              background: isActive ? 'var(--color-accent-glow)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--color-accent)' : '3px solid transparent',
              transition: 'all var(--transition-fast)',
              textDecoration: 'none',
              justifyContent: collapsed ? 'center' : 'flex-start',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            })}
          >
            <span style={{ flexShrink: 0 }}>{item.icon}</span>
            {!collapsed && <span style={{ animation: 'fadeInFromLeft 0.15s ease' }}>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: 'var(--space-4) var(--space-2)', borderTop: '1px solid var(--color-border)' }}>
        <button
          className="btn btn-ghost"
          onClick={handleLogout}
          style={{
            width: '100%',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 'var(--space-3)',
            color: 'var(--color-text-secondary)',
          }}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        style={{
          position: 'absolute',
          right: -12,
          top: 'calc(var(--topbar-height) + var(--space-8))',
          width: 24, height: 24,
          borderRadius: '50%',
          background: 'var(--color-surface-2)',
          border: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--color-text-secondary)',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'all var(--transition-fast)',
        }}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
};

export default Sidebar;
