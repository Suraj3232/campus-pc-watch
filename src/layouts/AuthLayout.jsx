import React from 'react';
import { Link } from 'react-router-dom';
import { Network } from 'lucide-react';
import { useTheme } from '../auth/ThemeContext';

const AuthLayout = ({ children }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)', position: 'relative' }}>

      {/* Theme toggle — top right */}
      <button
        onClick={toggleTheme}
        title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        style={{
          position: 'fixed', top: 'var(--space-4)', right: 'var(--space-4)',
          width: 36, height: 36, borderRadius: 'var(--radius-md)',
          background: 'var(--color-surface-2)',
          border: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: 16, zIndex: 100,
          transition: 'all var(--transition-fast)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      {/* Left panel */}
      <div style={{
        flex: '0 0 420px',
        background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'var(--space-12)',
        position: 'relative',
        overflow: 'hidden',
      }} className="hide-mobile">

        {/* Grid pattern background */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `
            linear-gradient(var(--color-border) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-border) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.3,
          animation: 'gridPulse 4s ease-in-out infinite',
        }} />

        {/* Glow orbs */}
        <div style={{
          position: 'absolute', top: '25%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.14) 0%, transparent 70%)',
          pointerEvents: 'none', animation: 'glowPulse 5s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '-10%',
          width: 250, height: 250, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20,184,166,0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-10)' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #10b981, #0d9488)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(16,185,129,0.30)',
            }}>
              <Network size={24} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 'var(--text-xl)', color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
                Campus PC Watch
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Network Monitoring System</div>
            </div>
          </div>

          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-3)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            Smart Campus<br />
            <span style={{ background: 'linear-gradient(90deg, #10b981, #0d9488)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Network Monitoring</span>
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.7, marginBottom: 'var(--space-8)' }}>
            Real-time visibility into every device across all computer labs — from one unified dashboard.
          </p>

          {/* Feature bullets */}
          {[
            { icon: '📡', text: 'Monitor 100+ devices in real time' },
            { icon: '🔔', text: 'Instant alerts for offline/warning events' },
            { icon: '📊', text: 'Lab-wise health analytics & reports' },
            { icon: '🔐', text: 'Role-based access control' },
          ].map((item) => (
            <div key={item.text} style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
              padding: 'var(--space-3) 0',
              fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
              borderBottom: '1px solid var(--color-border)',
            }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.text}
            </div>
          ))}

          {/* Back to home */}
          <Link
            to="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
              marginTop: 'var(--space-6)', fontSize: 'var(--text-sm)',
              color: 'var(--color-text-muted)',
            }}
          >
            ← Back to home
          </Link>
        </div>
      </div>

      {/* Right panel: form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-8)',
        minHeight: '100vh',
      }}>
        <div style={{ width: '100%', maxWidth: 420, animation: 'pageFadeIn 0.25s ease' }}>
          {/* Mobile-only logo */}
          <div className="hide-desktop" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #10b981, #0d9488)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Network size={20} color="#fff" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 'var(--text-lg)', letterSpacing: '-0.02em' }}>Campus PC Watch</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
