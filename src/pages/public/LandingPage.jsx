import React from 'react';
import { Link } from 'react-router-dom';
import { Network, Monitor, Bell, BarChart3, Shield, ArrowRight, Activity } from 'lucide-react';

const features = [
  { icon: <Monitor size={22} />, title: 'Real-time Device Monitoring', desc: 'Track every PC across all labs — online, offline, or warning state — updated every minute.' },
  { icon: <Bell    size={22} />, title: 'Instant Alert System',         desc: 'Get notified immediately when any device goes offline or shows abnormal behavior.' },
  { icon: <BarChart3 size={22}/>, title: 'Lab Analytics & Reports',     desc: 'Visualize lab-wise availability, uptime percentages, and historical trends.' },
  { icon: <Shield  size={22} />, title: 'Role-Based Access Control',    desc: 'Admins manage and configure; Users get a clean read-only monitoring view.' },
];

const steps = [
  { num: '01', title: 'Sign In',            desc: 'Log in with your campus credentials to access your personalized dashboard.' },
  { num: '02', title: 'View Lab Status',    desc: 'Instantly see the health of all labs — total PCs, online count, and active alerts.' },
  { num: '03', title: 'Manage Devices',     desc: 'Admins can add, edit, or remove devices and view detailed device history.' },
  { num: '04', title: 'Act on Alerts',      desc: 'Respond to high-severity alerts and review the monitoring history timeline.' },
];

const LandingPage = () => (
  <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>
    {/* Navbar */}
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: 'var(--space-4) var(--space-8)',
      borderBottom: '1px solid var(--color-border)',
      background: 'var(--color-surface)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Network size={20} color="#fff" />
        </div>
        <span style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }}>Campus PC Watch</span>
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <Link to="/login"    className="btn btn-secondary">Sign In</Link>
        <Link to="/register" className="btn btn-primary">Get Started</Link>
      </div>
    </nav>

    {/* Hero */}
    <section style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 'var(--space-16) var(--space-8)',
      textAlign: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Grid bg */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
        backgroundSize: '60px 60px', opacity: 0.15,
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 720 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
          background: 'var(--color-accent-glow)', border: '1px solid rgba(59,130,246,0.25)',
          borderRadius: 'var(--radius-full)', padding: '4px var(--space-4)',
          fontSize: 'var(--text-xs)', color: 'var(--color-accent)',
          marginBottom: 'var(--space-6)',
        }}>
          <Activity size={12} /> Live Network Monitoring
        </div>

        <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, lineHeight: 1.15, marginBottom: 'var(--space-6)' }}>
          Smart Campus<br />
          <span style={{ color: 'var(--color-accent)' }}>Network Monitoring</span>
        </h1>

        <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-secondary)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto var(--space-8)' }}>
          Real-time visibility into every device across all computer labs — from one unified, beautiful dashboard.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-12)' }}>
          <Link to="/register" className="btn btn-primary btn-lg" id="landing-cta-btn">
            Start Monitoring <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg">Sign In</Link>
        </div>

        {/* Mini Dashboard Preview Card */}
        <div style={{
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)',
          boxShadow: 'var(--shadow-xl)', maxWidth: 640, margin: '0 auto',
          animation: 'floatUp 4s ease-in-out infinite',
          textAlign: 'left',
        }}>
          {/* Mini topbar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>Admin Dashboard</div>
          </div>

          {/* Stat row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            {[
              { label: 'Total PCs', val: '100', color: 'var(--color-accent)' },
              { label: 'Online',    val: '94',  color: 'var(--color-online)' },
              { label: 'Offline',   val: '6',   color: 'var(--color-offline)' },
              { label: 'Alerts',    val: '3',   color: 'var(--color-warning)' },
            ].map((s) => (
              <div key={s.label} style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', textAlign: 'center', borderTop: `2px solid ${s.color}` }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Mini device rows */}
          {[
            { name: 'PC-001', ip: '192.168.1.10', lab: 'Lab 1', status: 'online',  lastSeen: '2m ago' },
            { name: 'PC-017', ip: '192.168.1.27', lab: 'Lab 1', status: 'offline', lastSeen: '1h ago' },
            { name: 'PC-033', ip: '192.168.2.17', lab: 'Lab 2', status: 'warning', lastSeen: '12m ago' },
          ].map((d) => (
            <div key={d.name} style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 80px',
              gap: 'var(--space-3)', padding: 'var(--space-2) 0',
              borderBottom: '1px solid var(--color-border)',
              fontSize: 'var(--text-xs)',
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', fontWeight: 600 }}>{d.name}</span>
              <span style={{ color: 'var(--color-text-muted)' }}>{d.ip}</span>
              <span style={{ color: 'var(--color-text-muted)' }}>{d.lab}</span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                color: d.status === 'online' ? 'var(--color-online)' : d.status === 'offline' ? 'var(--color-offline)' : 'var(--color-warning)',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Features */}
    <section style={{ padding: 'var(--space-12) var(--space-8)', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Everything You Need</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-base)', maxWidth: 480, margin: '0 auto' }}>
          A complete campus network monitoring solution designed for IT administrators and faculty.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-5)' }}>
        {features.map((f) => (
          <div key={f.title} className="card" style={{ cursor: 'default' }}>
            <div style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-4)', width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {f.icon}
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>{f.title}</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* How It Works */}
    <section style={{ padding: 'var(--space-12) var(--space-8)', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>How It Works</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-6)' }}>
          {steps.map((s) => (
            <div key={s.num} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-accent)', fontFamily: 'var(--font-mono)', marginBottom: 'var(--space-3)', opacity: 0.7 }}>{s.num}</div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>{s.title}</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer style={{ padding: 'var(--space-8)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)', borderTop: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Network size={16} color="#fff" />
        </div>
        <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Campus PC Watch</span>
      </div>
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
        © 2026 Campus PC Watch — Data Communication Project, Phase 1
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-5)', fontSize: 'var(--text-sm)' }}>
        <Link to="/login">Sign In</Link>
        <Link to="/register">Register</Link>
      </div>
    </footer>
  </div>
);

export default LandingPage;
