import React from 'react';
import AppShell   from '../../components/layout/AppShell';
import PageHeader from '../../components/layout/PageHeader';

const Section = ({ title, children }) => (
  <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-5)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--color-border)' }}>{title}</h3>
    {children}
  </div>
);

const SettingRow = ({ label, desc, control }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 'var(--space-4)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
    <div>
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)' }}>{label}</div>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{desc}</div>
    </div>
    {control}
  </div>
);

const Phase2Badge = () => (
  <span style={{ fontSize: 'var(--text-xs)', background: 'var(--color-warning-bg)', color: 'var(--color-warning)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 500 }}>
    Phase 2
  </span>
);

const AdminSettings = () => (
  <AppShell title="Settings">
    <PageHeader title="Settings" subtitle="Configure system preferences" breadcrumbs={['Admin', 'Settings']} />

    <Section title="⚙️ Monitoring Preferences">
      <SettingRow label="Poll Interval" desc="How often to refresh device status from the network." control={<Phase2Badge />} />
      <SettingRow label="Timeout Threshold" desc="Duration before marking a device as offline." control={<Phase2Badge />} />
      <SettingRow label="Auto-refresh Dashboard" desc="Automatically refresh the dashboard view." control={<Phase2Badge />} />
    </Section>

    <Section title="🔔 Notification Preferences">
      <SettingRow label="Email Alerts" desc="Send email notifications for HIGH severity alerts." control={<Phase2Badge />} />
      <SettingRow label="Alert Cooldown" desc="Minimum time between repeated alerts for the same device." control={<Phase2Badge />} />
    </Section>

    <Section title="🎨 Appearance">
      <SettingRow label="Theme" desc="Currently using dark theme. Light theme coming soon." control={
        <span className="badge badge-info">Dark Mode Active</span>
      } />
      <SettingRow label="Density" desc="Compact or comfortable table rows." control={<Phase2Badge />} />
    </Section>

    <Section title="🔐 Account">
      <SettingRow label="Change Password" desc="Update your account password via email reset." control={
        <button className="btn btn-secondary btn-sm" onClick={() => alert('Use Forgot Password on the login page.')}>
          Send Reset Email
        </button>
      } />
      <SettingRow label="Two-Factor Authentication" desc="Enhance account security with 2FA." control={<Phase2Badge />} />
    </Section>

    <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-4)' }}>
      ⚠️ Settings marked "Phase 2" are UI placeholders and will be fully functional in Phase 2.
    </p>
  </AppShell>
);

export default AdminSettings;
