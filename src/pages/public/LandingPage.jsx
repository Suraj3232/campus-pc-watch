import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Network, Monitor, Bell, BarChart3, Shield, ArrowRight,
  Activity, Zap, CheckCircle2, Globe2, Lock, TrendingUp,
} from 'lucide-react';
import { useTheme } from '../../auth/ThemeContext';

/* ── Data ──────────────────────────────────────────────── */
const features = [
  {
    icon: <Monitor size={24} />, title: 'Real-time Monitoring',
    desc: 'Track every PC across all labs — online, offline, or warning — updated every 60 seconds.',
    color: '#4f8ef7',
  },
  {
    icon: <Bell size={24} />, title: 'Instant Alerts',
    desc: 'Get notified immediately when any device goes offline or shows abnormal behavior.',
    color: '#f43f5e',
  },
  {
    icon: <BarChart3 size={24} />, title: 'Analytics & Reports',
    desc: 'Visualize lab-wise availability, uptime percentages, and historical trends.',
    color: '#22c55e',
  },
  {
    icon: <Shield size={24} />, title: 'Role-Based Access',
    desc: 'Admins manage and configure; Users get a clean read-only monitoring view.',
    color: '#a855f7',
  },
  {
    icon: <TrendingUp size={24} />, title: 'Uptime Tracking',
    desc: 'Historical uptime data lets you spot unreliable devices before they become a problem.',
    color: '#f59e0b',
  },
  {
    icon: <Globe2 size={24} />, title: 'Multi-Lab Support',
    desc: 'Manage unlimited labs from one unified dashboard, no per-lab dashboards needed.',
    color: '#06b6d4',
  },
];

const steps = [
  { num: '01', title: 'Sign In', desc: 'Log in with your campus credentials to access your personalized dashboard.', icon: <Lock size={20} /> },
  { num: '02', title: 'View Lab Status', desc: 'Instantly see the health of all labs — total PCs, online count, and active alerts.', icon: <Globe2 size={20} /> },
  { num: '03', title: 'Manage Devices', desc: 'Admins can edit devices, assign them to labs, and view detailed history.', icon: <Monitor size={20} /> },
  { num: '04', title: 'Act on Alerts', desc: 'Respond to high-severity alerts and review the full monitoring timeline.', icon: <Zap size={20} /> },
];

const stats = [
  { label: 'Uptime', value: '99.9%' },
  { label: 'Labs Monitored', value: '12+' },
  { label: 'Devices Tracked', value: '100+' },
  { label: 'Alerts Resolved', value: '500+' },
];

/* ── Animated Number ─────────────────────────────────── */
const AnimatedStat = ({ label, value }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{
      fontSize: 'clamp(28px, 4vw, 40px)',
      fontWeight: 800,
      background: 'linear-gradient(135deg, var(--color-accent), #a78bfa)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      lineHeight: 1.1,
      marginBottom: 'var(--space-1)',
    }}>
      {value}
    </div>
    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{label}</div>
  </div>
);

/* ── Component ───────────────────────────────────────── */
const LandingPage = () => {
  const { theme, toggleTheme } = useTheme();
  const heroRef = useRef(null);

  // Parallax-style subtle mouse tracking on hero glow
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const handler = (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 20;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 20;
      el.style.setProperty('--glow-x', `${50 + x}%`);
      el.style.setProperty('--glow-y', `${50 + y}%`);
    };
    el.addEventListener('mousemove', handler);
    return () => el.removeEventListener('mousemove', handler);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text-primary)', overflowX: 'hidden' }}>

      {/* ── Navbar ──────────────────────────────────────── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: 'var(--space-4) var(--space-8)',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        position: 'sticky', top: 0, zIndex: 200,
        backdropFilter: 'blur(12px)',
        animation: 'slideInDown 0.4s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--color-accent), #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px var(--color-accent-glow)',
          }}>
            <Network size={20} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 'var(--text-lg)', letterSpacing: '-0.02em' }}>
            Campus <span style={{ color: 'var(--color-accent)' }}>PC Watch</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              width: 36, height: 36, borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 16,
              transition: 'all var(--transition-fast)',
            }}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <Link to="/login"    className="btn btn-secondary">Sign In</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: 'clamp(60px, 10vw, 120px) var(--space-8) clamp(40px, 6vw, 80px)',
          textAlign: 'center',
          position: 'relative', overflow: 'hidden',
          '--glow-x': '50%', '--glow-y': '50%',
        }}
      >
        {/* Animated grid background */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          animation: 'gridPulse 4s ease-in-out infinite',
        }} />

        {/* Radial glow that follows mouse */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse 60% 50% at var(--glow-x) var(--glow-y), rgba(79,142,247,0.12) 0%, transparent 70%)`,
          transition: 'background 0.1s linear',
        }} />

        {/* Purple glow bottom-left */}
        <div style={{
          position: 'absolute', bottom: -80, left: -80, width: 500, height: 500,
          borderRadius: '50%', zIndex: 0, pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)',
          animation: 'glowPulse 6s ease-in-out infinite',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
            background: 'var(--color-accent-glow)',
            border: '1px solid rgba(79,142,247,0.3)',
            borderRadius: 'var(--radius-full)', padding: '5px var(--space-4)',
            fontSize: 'var(--text-xs)', color: 'var(--color-accent)', fontWeight: 600,
            marginBottom: 'var(--space-6)',
            animation: 'scalePop 0.5s ease',
            letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-online)', display: 'inline-block', animation: 'onlinePulse 1.5s ease infinite' }} />
            Live Campus Monitoring
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 5.5vw, 64px)', fontWeight: 800,
            lineHeight: 1.1, marginBottom: 'var(--space-6)',
            letterSpacing: '-0.03em',
            animation: 'pageFadeIn 0.6s ease 0.1s both',
          }}>
            Smart Campus
            <br />
            <span style={{
              background: 'linear-gradient(135deg, var(--color-accent) 0%, #a78bfa 50%, #06b6d4 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 4s ease infinite',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Network Monitoring
            </span>
          </h1>

          <p style={{
            fontSize: 'var(--text-lg)', color: 'var(--color-text-secondary)',
            lineHeight: 1.7, maxWidth: 540, margin: '0 auto var(--space-10)',
            animation: 'pageFadeIn 0.6s ease 0.2s both',
          }}>
            Real-time visibility into every device across all computer labs — from one unified, beautiful dashboard.
          </p>

          <div style={{
            display: 'flex', gap: 'var(--space-4)', justifyContent: 'center',
            flexWrap: 'wrap', marginBottom: 'var(--space-12)',
            animation: 'pageFadeIn 0.6s ease 0.3s both',
          }}>
            <Link to="/register" className="btn btn-primary btn-lg" id="landing-cta-btn" style={{
              background: 'linear-gradient(135deg, var(--color-accent), #6366f1)',
              border: 'none',
              boxShadow: '0 4px 24px rgba(79,142,247,0.4)',
              fontWeight: 600,
            }}>
              Start Monitoring <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In
            </Link>
          </div>

          {/* Trust indicators */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 'var(--space-5)', flexWrap: 'wrap',
            animation: 'pageFadeIn 0.6s ease 0.4s both',
          }}>
            {['Free for Campus', 'Real-time Updates', 'Role-Based Access'].map((t) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                <CheckCircle2 size={13} style={{ color: 'var(--color-online)' }} />
                {t}
              </div>
            ))}
          </div>

          {/* Mini Dashboard Preview Card */}
          <div style={{
            marginTop: 'var(--space-12)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'var(--space-5)',
            boxShadow: '0 0 0 1px var(--color-border-light), var(--shadow-xl)',
            maxWidth: 680, margin: 'var(--space-12) auto 0',
            animation: 'floatUp 5s ease-in-out infinite',
            textAlign: 'left',
            position: 'relative',
          }}>
            {/* Glow border on top */}
            <div style={{
              position: 'absolute', top: -1, left: '10%', right: '10%', height: 1,
              background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)',
              borderRadius: 'var(--radius-full)',
            }} />

            {/* Mini topbar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)',
              paddingBottom: 'var(--space-3)',
            }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f43f5e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                <Activity size={10} style={{ color: 'var(--color-online)' }} />
                admin@dashboard
              </div>
            </div>

            {/* Stat row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              {[
                { label: 'Total PCs', val: '100', color: 'var(--color-accent)' },
                { label: 'Online',    val: '94',  color: 'var(--color-online)' },
                { label: 'Offline',   val: '6',   color: 'var(--color-offline)' },
                { label: 'Alerts',    val: '3',   color: 'var(--color-warning)' },
              ].map((s) => (
                <div key={s.label} style={{
                  background: 'var(--color-surface-2)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-3)', textAlign: 'center',
                  borderTop: `2px solid ${s.color}`,
                }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Mini device rows */}
            {[
              { name: 'PC-001', ip: '192.168.1.10', lab: 'Lab 1', status: 'online' },
              { name: 'PC-017', ip: '192.168.1.27', lab: 'Lab 1', status: 'offline' },
              { name: 'PC-033', ip: '192.168.2.17', lab: 'Lab 2', status: 'warning' },
            ].map((d) => (
              <div key={d.name} style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 80px',
                gap: 'var(--space-3)', padding: 'var(--space-2) 0',
                borderBottom: '1px solid var(--color-border)',
                fontSize: 'var(--text-xs)',
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)', fontWeight: 600 }}>{d.name}</span>
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

      {/* ── Stats Banner ─────────────────────────────────── */}
      <section style={{
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--space-10) var(--space-8)',
      }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 'var(--space-8)',
        }}>
          {stats.map((s) => <AnimatedStat key={s.label} {...s} />)}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section style={{ padding: 'clamp(48px,8vw,96px) var(--space-8)', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <div style={{
            display: 'inline-block', padding: '4px var(--space-3)',
            background: 'var(--color-accent-glow)', borderRadius: 'var(--radius-full)',
            fontSize: 'var(--text-xs)', color: 'var(--color-accent)', fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            marginBottom: 'var(--space-4)',
          }}>
            Features
          </div>
          <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, marginBottom: 'var(--space-4)', letterSpacing: '-0.02em' }}>
            Everything You Need
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-base)', maxWidth: 480, margin: '0 auto' }}>
            A complete campus network monitoring solution designed for IT administrators and faculty.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`card stagger-${(i % 4) + 1}`}
              style={{
                cursor: 'default',
                position: 'relative', overflow: 'hidden',
                animation: `pageFadeIn 0.5s ease ${i * 0.08}s both`,
                borderTop: `2px solid ${f.color}22`,
              }}
            >
              {/* Icon */}
              <div style={{
                width: 48, height: 48, borderRadius: 'var(--radius-md)',
                background: `${f.color}18`,
                border: `1px solid ${f.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: f.color, marginBottom: 'var(--space-4)',
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-2)', letterSpacing: '-0.01em' }}>{f.title}</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{f.desc}</p>

              {/* Decorative corner */}
              <div style={{
                position: 'absolute', top: -20, right: -20,
                width: 80, height: 80, borderRadius: '50%',
                background: `${f.color}08`,
                pointerEvents: 'none',
              }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section style={{
        padding: 'clamp(48px,8vw,96px) var(--space-8)',
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <div style={{
              display: 'inline-block', padding: '4px var(--space-3)',
              background: 'var(--color-accent-glow)', borderRadius: 'var(--radius-full)',
              fontSize: 'var(--text-xs)', color: 'var(--color-accent)', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-4)',
            }}>
              How It Works
            </div>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Up and Running in Minutes
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-8)', position: 'relative' }}>
            {steps.map((s, i) => (
              <div key={s.num} style={{ textAlign: 'center', animation: `pageFadeIn 0.5s ease ${i * 0.1}s both` }}>
                {/* Step circle */}
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'var(--color-accent-glow)',
                  border: '2px solid var(--color-accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto var(--space-4)',
                  color: 'var(--color-accent)',
                  boxShadow: '0 0 20px var(--color-accent-glow)',
                }}>
                  {s.icon}
                </div>
                <div style={{
                  fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)',
                  color: 'var(--color-accent)', fontWeight: 700,
                  letterSpacing: '0.08em', marginBottom: 'var(--space-2)',
                }}>
                  STEP {s.num}
                </div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)', letterSpacing: '-0.01em' }}>{s.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────────── */}
      <section style={{
        padding: 'clamp(64px,10vw,120px) var(--space-8)',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 600, height: 400, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(79,142,247,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800,
            letterSpacing: '-0.03em', marginBottom: 'var(--space-6)', lineHeight: 1.15,
          }}>
            Ready to Monitor Your <br />
            <span style={{ color: 'var(--color-accent)' }}>Campus Labs?</span>
          </h2>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-8)' }}>
            Join your institution&apos;s IT team on Campus PC Watch today.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg" style={{
              background: 'linear-gradient(135deg, var(--color-accent), #6366f1)',
              border: 'none', boxShadow: '0 4px 24px rgba(79,142,247,0.4)',
              fontWeight: 700,
            }}>
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">Sign In</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer style={{
        padding: 'var(--space-8) var(--space-8)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 'var(--space-4)',
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            width: 30, height: 30, borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, var(--color-accent), #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Network size={16} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Campus PC Watch</span>
        </div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
          © 2026 Campus PC Watch — Data Communication Project
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-5)', fontSize: 'var(--text-sm)', alignItems: 'center' }}>
          <Link to="/login">Sign In</Link>
          <Link to="/register">Register</Link>
          <button onClick={toggleTheme} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)',
          }}>
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
