import React from 'react';
import { Network } from 'lucide-react';

const AuthLayout = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
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

      {/* Glow orb */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-10)' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 'var(--radius-lg)',
            background: 'var(--color-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Network size={24} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 'var(--text-xl)', color: 'var(--color-text-primary)' }}>Campus PC Watch</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Network Monitoring System</div>
          </div>
        </div>

        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
          Smart Campus<br />Network Monitoring
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.7, marginBottom: 'var(--space-8)' }}>
          Real-time visibility into every device across all computer labs — from one unified dashboard.
        </p>

        {/* Feature bullets */}
        {[
          '📡  Monitor 100+ devices in real time',
          '🔔  Instant alerts for offline/warning events',
          '📊  Lab-wise health analytics & reports',
          '🔐  Role-based access control',
        ].map((item) => (
          <div key={item} style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
            padding: 'var(--space-3) 0',
            fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
            borderBottom: '1px solid var(--color-border)',
          }}>
            {item}
          </div>
        ))}
      </div>
    </div>

    {/* Right panel: form */}
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-8)',
    }}>
      <div style={{ width: '100%', maxWidth: 420, animation: 'pageFadeIn 0.25s ease' }}>
        {children}
      </div>
    </div>
  </div>
);

export default AuthLayout;
