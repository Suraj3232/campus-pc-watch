import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Calendar, LogOut, Key } from 'lucide-react';
import AppShell   from '../../components/layout/AppShell';
import PageHeader from '../../components/layout/PageHeader';
import { useAuth } from '../../auth/useAuth';
import { useToast } from '../../components/ui/Toast';
import { formatDate } from '../../utils/formatters';

const UserProfile = () => {
  const { user, userRole, logout, resetPassword } = useAuth();
  const toast    = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out.');
    navigate('/');
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword(user.email);
      toast.success('Password reset email sent!');
    } catch {
      toast.error('Failed to send reset email.');
    }
  };

  return (
    <AppShell title="Profile">
      <PageHeader title="My Profile" breadcrumbs={['User', 'Profile']} />
      <div style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
          <div style={{ width:72, height:72, borderRadius:'50%', background:'var(--color-accent-glow)', border:'2px solid var(--color-accent)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, fontWeight:700, color:'var(--color-accent)', flexShrink:0 }}>
            {user?.displayName?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div>
            <div style={{ fontSize:'var(--text-xl)', fontWeight:700 }}>{user?.displayName ?? '—'}</div>
            <div style={{ fontSize:'var(--text-sm)', color:'var(--color-text-muted)' }}>{user?.email}</div>
            <span className="badge badge-user" style={{ marginTop:'var(--space-2)' }}>👤 User</span>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize:'var(--text-lg)', fontWeight:600, marginBottom:'var(--space-5)' }}>Account Details</h3>
          {[
            { icon:<User size={16} />,     label:'Full Name',       value: user?.displayName ?? '—' },
            { icon:<Mail size={16} />,     label:'Email Address',   value: user?.email ?? '—' },
            { icon:<Shield size={16} />,   label:'Role',            value: userRole ?? 'user' },
            { icon:<Calendar size={16} />, label:'Account Created', value: user?.metadata?.creationTime ? formatDate(user.metadata.creationTime) : '—' },
          ].map((item) => (
            <div key={item.label} style={{ display:'flex', alignItems:'center', gap:'var(--space-4)', paddingBottom:'var(--space-4)', marginBottom:'var(--space-4)', borderBottom:'1px solid var(--color-border)' }}>
              <span style={{ color:'var(--color-text-muted)', flexShrink:0 }}>{item.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'var(--text-xs)', color:'var(--color-text-muted)', marginBottom:2 }}>{item.label}</div>
                <div style={{ fontSize:'var(--text-sm)', color:'var(--color-text-primary)', fontWeight:500 }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 style={{ fontSize:'var(--text-lg)', fontWeight:600, marginBottom:'var(--space-5)' }}>Actions</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
            <button className="btn btn-secondary" onClick={handleResetPassword} id="user-reset-pass-btn" style={{ justifyContent:'flex-start', gap:'var(--space-3)' }}>
              <Key size={16} /> Send Password Reset Email
            </button>
            <button className="btn btn-danger" onClick={handleLogout} id="user-logout-btn" style={{ justifyContent:'flex-start', gap:'var(--space-3)' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default UserProfile;
