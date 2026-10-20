import { useState } from 'react';
import { Moon, Sun, Bell, Monitor, Shield, Key } from 'lucide-react';
import AppShell   from '../../components/layout/AppShell';
import PageHeader from '../../components/layout/PageHeader';
import { useTheme } from '../../auth/ThemeContext';
import { useAuth }  from '../../auth/useAuth';
import { useToast } from '../../components/ui/Toast';

/* ── Helper sub-components ──────────────────────────────────── */
const Section = ({ icon, title, children }) => (
  <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
    <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-5)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--color-border)' }}>
      <span style={{ color: 'var(--color-accent)' }}>{icon}</span>
      {title}
    </h3>
    {children}
  </div>
);

const SettingRow = ({ label, desc, control, last = false }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: 'var(--space-4)',
    paddingBottom: last ? 0 : 'var(--space-4)',
    marginBottom: last ? 0 : 'var(--space-4)',
    borderBottom: last ? 'none' : '1px solid var(--color-border)',
  }}>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)' }}>{label}</div>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{desc}</div>
    </div>
    {control}
  </div>
);

const Phase2Badge = () => (
  <span style={{ fontSize: 'var(--text-xs)', background: 'var(--color-warning-bg)', color: 'var(--color-warning)', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontWeight: 500, flexShrink: 0 }}>
    Phase 2
  </span>
);

/* ── Toggle Switch ───────────────────────────────────────────── */
const Toggle = ({ checked, onChange, id }) => (
  <label htmlFor={id} style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', gap: 'var(--space-2)', userSelect: 'none' }}>
    <div style={{
      width: 40, height: 22, borderRadius: 11, position: 'relative',
      background: checked ? 'var(--color-accent)' : 'var(--color-surface-3)',
      border: `1px solid ${checked ? 'var(--color-accent)' : 'var(--color-border-light)'}`,
      transition: 'background var(--transition-fast)',
    }}>
      <div style={{
        position: 'absolute', top: 2, left: checked ? 20 : 2, width: 16, height: 16,
        borderRadius: '50%', background: '#fff',
        transition: 'left var(--transition-fast)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }} />
    </div>
    <input id={id} type="checkbox" checked={checked} onChange={onChange} style={{ display: 'none' }} />
    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{checked ? 'On' : 'Off'}</span>
  </label>
);

/* ── Main Component ──────────────────────────────────────────── */
const AdminSettings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, resetPassword } = useAuth();
  const toast = useToast();

  const [emailAlerts,    setEmailAlerts]    = useState(false);
  const [autoRefresh,    setAutoRefresh]    = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleResetPassword = async () => {
    if (!user?.email) return;
    try {
      await resetPassword(user.email);
      toast.success('Password reset email sent to ' + user.email);
      setShowResetConfirm(false);
    } catch {
      toast.error('Failed to send reset email.');
    }
  };

  return (
    <AppShell title="Settings">
      <PageHeader
        title="Settings"
        subtitle="Configure your system and account preferences"
        breadcrumbs={['Admin', 'Settings']}
      />

      {/* ── Appearance ─────────────────────────────────────────── */}
      <Section icon={<Sun size={18} />} title="Appearance">
        <SettingRow
          label="Theme"
          desc={`Currently using ${theme === 'dark' ? 'dark' : 'light'} theme. Toggle to switch.`}
          control={
            <button
              className="btn btn-secondary btn-sm"
              onClick={toggleTheme}
              id="theme-toggle-btn"
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 120, justifyContent: 'center' }}
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          }
        />
        <SettingRow label="Density" desc="Compact or comfortable table rows." control={<Phase2Badge />} last />
      </Section>

      {/* ── Monitoring ─────────────────────────────────────────── */}
      <Section icon={<Monitor size={18} />} title="Monitoring Preferences">
        <SettingRow
          label="Auto-refresh Dashboard"
          desc="Automatically refresh the dashboard every 30 seconds."
          control={<Toggle id="auto-refresh" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />}
        />
        <SettingRow label="Poll Interval" desc="How often to refresh device status from the network." control={<Phase2Badge />} />
        <SettingRow label="Timeout Threshold" desc="Duration before marking a device as offline." control={<Phase2Badge />} last />
      </Section>

      {/* ── Notifications ──────────────────────────────────────── */}
      <Section icon={<Bell size={18} />} title="Notification Preferences">
        <SettingRow
          label="Email Alerts"
          desc="Send email notifications for HIGH severity alerts."
          control={<Toggle id="email-alerts" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} />}
        />
        <SettingRow label="Alert Cooldown" desc="Minimum time between repeated alerts for the same device." control={<Phase2Badge />} last />
      </Section>

      {/* ── Account / Security ─────────────────────────────────── */}
      <Section icon={<Shield size={18} />} title="Account & Security">
        <SettingRow
          label="Logged-in Account"
          desc={user?.email ?? 'Not logged in'}
          control={<span className="badge badge-online" style={{ fontSize: 10 }}>Active</span>}
        />
        <SettingRow
          label="Change Password"
          desc="Update your account password via a Firebase reset email."
          control={
            showResetConfirm ? (
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button className="btn btn-danger btn-sm" onClick={handleResetPassword}>Confirm Send</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowResetConfirm(false)}>Cancel</button>
              </div>
            ) : (
              <button className="btn btn-secondary btn-sm" onClick={() => setShowResetConfirm(true)} id="reset-pw-btn">
                <Key size={13} /> Send Reset Email
              </button>
            )
          }
        />
        <SettingRow label="Two-Factor Authentication" desc="Enhance account security with 2FA." control={<Phase2Badge />} last />
      </Section>

      <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-4)' }}>
        ⚠️ Settings marked <strong>Phase 2</strong> are UI placeholders and will be fully functional in Phase 2 (Flask backend integration).
      </p>
    </AppShell>
  );
};

export default AdminSettings;
