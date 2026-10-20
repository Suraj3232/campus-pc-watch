import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Wifi, WifiOff, AlertTriangle, Bell, Activity, ArrowRight, Plus, RefreshCw, ShieldCheck } from 'lucide-react';
import AppShell     from '../../components/layout/AppShell';
import PageHeader   from '../../components/layout/PageHeader';
import StatCard     from '../../components/ui/StatCard';
import StatusBadge  from '../../components/ui/StatusBadge';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState   from '../../components/ui/ErrorState';
import ConnectDeviceModal from '../../components/devices/ConnectDeviceModal';
import DeviceConnectionBanner from '../../components/devices/DeviceConnectionBanner';
import { useDevices } from '../../hooks/useDevices';
import { useLabs }    from '../../hooks/useLabs';
import { useAlerts }  from '../../hooks/useAlerts';
import { useHistory } from '../../hooks/useHistory';
import { useMyDevice } from '../../hooks/useMyDevice';
import { timeAgo }    from '../../utils/formatters';
import { getSeverityColor, getSeverityBg } from '../../utils/statusUtils';
import { getMillis } from '../../services/deviceService';

const AdminDashboard = () => {
  const { devices, loading: dLoad, error: dErr, refetch } = useDevices();
  const { labs,    loading: lLoad }               = useLabs();
  const { alerts,  loading: aLoad }               = useAlerts();
  const { history, loading: hLoad }               = useHistory();
  const { device: myDevice }                      = useMyDevice();

  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [deviceFilter, setDeviceFilter] = useState('all'); // 'all' | 'online' | 'offline'

  const loading = dLoad || lLoad || aLoad || hLoad;

  if (loading) return <AppShell title="Dashboard"><LoadingState message="Loading dashboard…" /></AppShell>;
  if (dErr)    return <AppShell title="Dashboard"><ErrorState message={dErr} /></AppShell>;

  const total        = devices.length;
  const online       = devices.filter((d) => d.status === 'online').length;
  const offline      = devices.filter((d) => d.status === 'offline').length;
  const activeAlerts = alerts.filter((a) => !a.resolved);
  const recentAlerts = activeAlerts.slice(0, 5);
  const recentActivity = history.slice(0, 10);
  
  // Health percentage
  const healthPct = total > 0 ? Math.round((online / total) * 100) : 100;

  // Filtered devices for live view
  const displayDevices = [...devices]
    .filter((d) => deviceFilter === 'all' || d.status === deviceFilter)
    .sort((a, b) => getMillis(b.lastSeen) - getMillis(a.lastSeen))
    .slice(0, 8);

  return (
    <AppShell title="Dashboard">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Real-time campus network & workstation monitoring"
        breadcrumbs={['Admin', 'Dashboard']}
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button className="btn btn-secondary btn-sm" onClick={refetch}>
              <RefreshCw size={13} /> Refresh
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => setConnectModalOpen(true)}>
              <Plus size={14} /> Connect Device
            </button>
          </div>
        }
      />

      {/* Live Device Connection Status Banner */}
      <DeviceConnectionBanner
        myDevice={myDevice}
        onOpenConnect={() => setConnectModalOpen(true)}
      />

      {/* Summary Metrics ("Sum Stuff") */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <StatCard
          icon={<Monitor size={20} />}
          value={total}
          label="Total Monitored PCs"
          variant="accent"
        />
        <StatCard
          icon={<Wifi size={20} />}
          value={`${online} (${healthPct}%)`}
          label="Online & Active"
          variant="online"
        />
        <StatCard
          icon={<WifiOff size={20} />}
          value={offline}
          label="Offline Stations"
          variant="offline"
        />
        <StatCard
          icon={<ShieldCheck size={20} />}
          value={`${healthPct}%`}
          label="Network Health Score"
          variant="accent"
        />
        <StatCard
          icon={<AlertTriangle size={20} />}
          value={activeAlerts.length}
          label="Active Alerts"
          variant="warning"
        />
      </div>

      {/* Connect Device Modal */}
      <ConnectDeviceModal
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
        onDeviceConnected={refetch}
      />

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: 'var(--space-5)', alignItems: 'start' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Live Device Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{
              padding: 'var(--space-4) var(--space-5)',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 'var(--space-3)',
            }}>
              <div>
                <div className="card-title">Live Device Status</div>
                <div className="card-subtitle">Real-time status of monitored campus PCs</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                {/* Filter Pills */}
                <div style={{
                  display: 'inline-flex',
                  background: 'var(--color-surface-2)',
                  padding: 3,
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                }}>
                  {[
                    { id: 'all',     label: 'All',     count: total },
                    { id: 'online',  label: 'Online',  count: online },
                    { id: 'offline', label: 'Offline', count: offline },
                  ].map((filter) => {
                    const active = deviceFilter === filter.id;
                    return (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => setDeviceFilter(filter.id)}
                        style={{
                          padding: '3px 10px',
                          fontSize: 'var(--text-xs)',
                          fontWeight: active ? 600 : 500,
                          borderRadius: 'calc(var(--radius-md) - 2px)',
                          background: active ? 'var(--color-accent)' : 'transparent',
                          color: active ? '#ffffff' : 'var(--color-text-secondary)',
                          transition: 'all var(--transition-fast)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                        }}
                      >
                        {filter.label}
                        <span style={{
                          opacity: active ? 0.9 : 0.6,
                          fontSize: 10,
                          fontFamily: 'var(--font-mono)',
                        }}>
                          {filter.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <Link to="/admin/devices" className="btn btn-ghost btn-sm">
                  View all <ArrowRight size={13} />
                </Link>
              </div>
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
                  {displayDevices.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                        No {deviceFilter !== 'all' ? `${deviceFilter} ` : ''}devices found.
                      </td>
                    </tr>
                  ) : (
                    displayDevices.map((d) => (
                      <tr key={d.id}>
                        <td>
                          <Link to={`/admin/devices/${d.id}`} style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-accent)' }}>
                            {d.name}
                          </Link>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                          {d.ip || 'Not available'}
                        </td>
                        <td style={{ fontSize: 'var(--text-sm)' }}>
                          {d.lab || 'Not Assigned'}
                        </td>
                        <td><StatusBadge status={d.status} /></td>
                        <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{timeAgo(d.lastSeen)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lab Overview */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Lab Overview</div>
                <div className="card-subtitle">Health at a glance</div>
              </div>
              <Link to="/admin/labs" className="btn btn-ghost btn-sm">View all <ArrowRight size={13} /></Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {labs.length === 0 ? (
                <p style={{ textAlign: 'center', padding: 'var(--space-4)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                  No labs configured yet.
                </p>
              ) : (
                labs.map((lab) => {
                  const pct = lab.totalPCs > 0 ? Math.round((lab.online / lab.totalPCs) * 100) : 0;
                  return (
                    <div key={lab.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{lab.name}</span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{lab.online}/{lab.totalPCs} online ({pct}%)</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-bar-fill online" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Recent Alerts */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Bell size={16} /> Active Alerts
                {activeAlerts.length > 0 && <span className="badge badge-offline">{activeAlerts.length}</span>}
              </div>
              <Link to="/admin/alerts" className="btn btn-ghost btn-sm">All <ArrowRight size={13} /></Link>
            </div>
            <div style={{ padding: 'var(--space-3)' }}>
              {recentAlerts.length === 0 ? (
                <p style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>✅ No active alerts</p>
              ) : recentAlerts.map((a) => (
                <div key={a.id} style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-2)', background: getSeverityBg(a.severity), border: `1px solid ${getSeverityColor(a.severity)}22` }}>
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
            <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Activity size={16} /> Recent Activity
              </div>
              <Link to="/admin/history" className="btn btn-ghost btn-sm">All <ArrowRight size={13} /></Link>
            </div>
            <div style={{ padding: 'var(--space-4) var(--space-5)' }}>
              {recentActivity.length === 0 ? (
                <p style={{ textAlign: 'center', padding: 'var(--space-4)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                  No recent activity.
                </p>
              ) : (
                <div className="timeline">
                  {recentActivity.map((h) => (
                    <div key={h.id} className="timeline-item">
                      <span className={`timeline-dot ${h.status}`} />
                      <div className="timeline-time">{timeAgo(h.timestamp)}</div>
                      <div className="timeline-content">
                        <strong style={{ color: 'var(--color-text-primary)' }}>{h.device}</strong> — {h.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default AdminDashboard;
