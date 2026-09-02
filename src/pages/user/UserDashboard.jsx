import React from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Wifi, WifiOff, AlertTriangle, Activity, ArrowRight, Bell } from 'lucide-react';
import AppShell     from '../../components/layout/AppShell';
import PageHeader   from '../../components/layout/PageHeader';
import StatCard     from '../../components/ui/StatCard';
import StatusBadge  from '../../components/ui/StatusBadge';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState   from '../../components/ui/ErrorState';
import { useDevices } from '../../hooks/useDevices';
import { useLabs }    from '../../hooks/useLabs';
import { useAlerts }  from '../../hooks/useAlerts';
import { useHistory } from '../../hooks/useHistory';
import { timeAgo } from '../../utils/formatters';
import { getSeverityColor, getSeverityBg } from '../../utils/statusUtils';

const UserDashboard = () => {
  const { devices, loading: dLoad, error } = useDevices();
  const { labs,    loading: lLoad }        = useLabs();
  const { alerts,  loading: aLoad }        = useAlerts();
  const { history, loading: hLoad }        = useHistory();

  if (dLoad || lLoad || aLoad || hLoad) return <AppShell title="Monitoring View"><LoadingState message="Loading…" /></AppShell>;
  if (error) return <AppShell title="Monitoring View"><ErrorState message={error} /></AppShell>;

  const total        = devices.length;
  const online       = devices.filter((d) => d.status === 'online').length;
  const offline      = devices.filter((d) => d.status === 'offline').length;
  const activeAlerts = alerts.filter((a) => !a.resolved).slice(0, 5);
  const recentActivity = history.slice(0, 8);
  const recentDevices  = [...devices].sort((a,b) => new Date(b.lastSeen) - new Date(a.lastSeen)).slice(0, 8);

  return (
    <AppShell title="Monitoring View">
      <PageHeader title="Monitoring View" subtitle="Read-only campus network status" breadcrumbs={['User', 'Dashboard']} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <StatCard icon={<Monitor       size={20} />} value={total}            label="Total Devices"   variant="accent" />
        <StatCard icon={<Wifi          size={20} />} value={online}           label="Online"           variant="online" />
        <StatCard icon={<WifiOff       size={20} />} value={offline}          label="Offline"          variant="offline" />
        <StatCard icon={<AlertTriangle size={20} />} value={activeAlerts.length} label="Active Alerts" variant="warning" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: 'var(--space-5)', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Device table (read-only) */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="card-title">Device Status</div>
              <Link to="/user/devices" className="btn btn-ghost btn-sm">View all <ArrowRight size={13} /></Link>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>PC Name</th>
                    <th>IP Address</th>
                    <th>Lab</th>
                    <th>Status</th>
                    <th>Last Seen</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDevices.map((d) => (
                    <tr key={d.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{d.name}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{d.ip}</td>
                      <td>{d.lab}</td>
                      <td><StatusBadge status={d.status} /></td>
                      <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{timeAgo(d.lastSeen)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Labs */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Lab Health</div>
              <Link to="/user/labs" className="btn btn-ghost btn-sm">View all <ArrowRight size={13} /></Link>
            </div>
            {labs.map((lab) => {
              const pct = Math.round((lab.online / lab.totalPCs) * 100);
              return (
                <div key={lab.id} style={{ marginBottom: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{lab.name}</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{lab.online}/{lab.totalPCs} ({pct}%)</span>
                  </div>
                  <div className="progress-bar"><div className="progress-bar-fill online" style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Active Alerts (read-only) */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Bell size={16} /> Active Alerts
              </div>
              <Link to="/user/alerts" className="btn btn-ghost btn-sm">All <ArrowRight size={13} /></Link>
            </div>
            <div style={{ padding: 'var(--space-3)' }}>
              {activeAlerts.length === 0 ? (
                <p style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>✅ No active alerts</p>
              ) : activeAlerts.map((a) => (
                <div key={a.id} style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-2)', background: getSeverityBg(a.severity) }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: getSeverityColor(a.severity) }}>{a.severity}</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{timeAgo(a.timestamp)}</span>
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{a.device}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 2 }}>{a.message}</div>
                </div>
              ))}
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
              <div className="timeline">
                {recentActivity.map((h) => (
                  <div key={h.id} className="timeline-item">
                    <span className={`timeline-dot ${h.status}`} />
                    <div className="timeline-time">{timeAgo(h.timestamp)}</div>
                    <div className="timeline-content"><strong style={{ color: 'var(--color-text-primary)' }}>{h.device}</strong> — {h.message}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default UserDashboard;
