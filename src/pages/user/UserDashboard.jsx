import React from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Wifi, WifiOff, AlertTriangle, Activity, ArrowRight, Bell } from 'lucide-react';
import AppShell     from '../../components/layout/AppShell';
import PageHeader   from '../../components/layout/PageHeader';
import StatCard     from '../../components/ui/StatCard';
import StatusBadge  from '../../components/ui/StatusBadge';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState   from '../../components/ui/ErrorState';
import { useMyDevice } from '../../hooks/useMyDevice';
import { timeAgo } from '../../utils/formatters';

const UserDashboard = () => {
  const { devices, loading, error } = useMyDevice();

  if (loading) return <AppShell title="Monitoring View"><LoadingState message="Loading your device…" /></AppShell>;
  if (error)   return <AppShell title="Monitoring View"><ErrorState message={error} /></AppShell>;

  const total   = devices.length;
  const online  = devices.filter((d) => d.status === 'online').length;
  const offline = devices.filter((d) => d.status === 'offline').length;

  return (
    <AppShell title="Monitoring View">
      <PageHeader title="Monitoring View" subtitle="Your active device presence status" breadcrumbs={['User', 'Dashboard']} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <StatCard icon={<Monitor       size={20} />} value={total}   label="My Devices"    variant="accent" />
        <StatCard icon={<Wifi          size={20} />} value={online}  label="Online"        variant="online" />
        <StatCard icon={<WifiOff       size={20} />} value={offline} label="Offline"       variant="offline" />
        <StatCard icon={<AlertTriangle size={20} />} value={0}       label="Active Alerts" variant="warning" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: 'var(--space-5)', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Device table (read-only) */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="card-title">My Device Status</div>
              <Link to="/user/devices" className="btn btn-ghost btn-sm">View all <ArrowRight size={13} /></Link>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Device Name</th>
                    <th>IP Address</th>
                    <th>Lab</th>
                    <th>Status</th>
                    <th>Last Seen</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                        No device registered yet. Your device presence will appear here.
                      </td>
                    </tr>
                  ) : (
                    devices.map((d) => (
                      <tr key={d.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{d.name}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{d.ip || 'Not available'}</td>
                        <td>{d.lab || 'Not Assigned'}</td>
                        <td><StatusBadge status={d.status} /></td>
                        <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{timeAgo(d.lastSeen)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Labs */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Assigned Lab</div>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              No lab assigned to this device yet.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Active Alerts (read-only) */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Bell size={16} /> Active Alerts
              </div>
            </div>
            <div style={{ padding: 'var(--space-3)' }}>
              <p style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                ✅ No active alerts
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--color-border)' }}>
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Activity size={16} /> Recent Activity
              </div>
            </div>
            <div style={{ padding: 'var(--space-4) var(--space-5)' }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', textAlign: 'center' }}>
                No recent activity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default UserDashboard;
