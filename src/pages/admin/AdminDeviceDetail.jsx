import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Monitor, Clock, MapPin, Cpu, MemoryStick } from 'lucide-react';
import AppShell     from '../../components/layout/AppShell';
import PageHeader   from '../../components/layout/PageHeader';
import StatusBadge  from '../../components/ui/StatusBadge';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState   from '../../components/ui/ErrorState';
import { useDevices } from '../../hooks/useDevices';
import { useHistory } from '../../hooks/useHistory';
import { useAlerts  } from '../../hooks/useAlerts';
import { timeAgo, formatDateTime, formatDate } from '../../utils/formatters';
import { getSeverityColor, getSeverityBg } from '../../utils/statusUtils';

const AdminDeviceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { devices, loading: dLoad, error: dErr } = useDevices();
  const { history, loading: hLoad } = useHistory(id);
  const { alerts } = useAlerts();

  const device         = devices.find((d) => d.id === id);
  const deviceAlerts   = alerts.filter((a) => a.device.toLowerCase() === (device?.name?.toLowerCase() ?? ''));
  const deviceHistory  = history.slice(0, 20);

  if (dLoad || hLoad) return <AppShell title="Device Detail"><LoadingState message="Loading device…" /></AppShell>;
  if (dErr)           return <AppShell title="Device Detail"><ErrorState message={dErr} /></AppShell>;
  if (!device)        return (
    <AppShell title="Device Detail">
      <ErrorState message="Device not found." onRetry={() => navigate('/admin/devices')} />
    </AppShell>
  );

  return (
    <AppShell title={device.name}>
      <PageHeader
        title={device.name}
        breadcrumbs={['Admin', 'Devices', device.name]}
        actions={<Link to="/admin/devices" className="btn btn-secondary btn-sm"><ArrowLeft size={14} /> Back to Devices</Link>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: 'var(--space-5)', alignItems: 'start' }}>
        {/* Left: Device Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <Monitor size={20} /> Device Information
              </div>
              <StatusBadge status={device.status} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              {[
                { label: 'PC Name',     value: device.name,        mono: true },
                { label: 'IP Address',  value: device.ip,          mono: true },
                { label: 'Lab',         value: device.lab },
                { label: 'Location ID', value: `Lab ${device.labId}`, mono: true },
                { label: 'OS',          value: device.os ?? 'Windows 11 Pro' },
                { label: 'Last Seen',   value: timeAgo(device.lastSeen) },
                { label: 'Added',       value: formatDate(device.addedAt) },
                { label: 'Description', value: device.description ?? '—' },
              ].map((item) => (
                <div key={item.label}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontFamily: item.mono ? 'var(--font-mono)' : 'inherit' }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monitoring summary */}
          {device.status === 'online' && device.cpu != null && (
            <div className="card">
              <div className="card-title" style={{ marginBottom: 'var(--space-5)' }}>Monitoring Summary</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
                {[
                  { label: 'CPU Usage', value: device.cpu, icon: <Cpu size={16} />, color: device.cpu > 80 ? 'var(--color-offline)' : device.cpu > 60 ? 'var(--color-warning)' : 'var(--color-online)' },
                  { label: 'RAM Usage', value: device.ram, icon: <MemoryStick size={16} />, color: device.ram > 80 ? 'var(--color-offline)' : device.ram > 60 ? 'var(--color-warning)' : 'var(--color-online)' },
                ].map((m) => (
                  <div key={m.label}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                      {m.icon} {m.label}
                    </div>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: m.color }}>{m.value}%</div>
                    <div className="progress-bar" style={{ marginTop: 'var(--space-2)' }}>
                      <div className="progress-bar-fill" style={{ width: `${m.value}%`, background: m.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Device Alerts */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--color-border)' }}>
              <div className="card-title">Recent Alerts for this Device</div>
            </div>
            <div style={{ padding: 'var(--space-4)' }}>
              {deviceAlerts.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', padding: 'var(--space-4)' }}>✅ No alerts for this device</p>
              ) : deviceAlerts.map((a) => (
                <div key={a.id} className="alert-item" style={{ marginBottom: 'var(--space-2)', background: getSeverityBg(a.severity), border: `1px solid ${getSeverityColor(a.severity)}22` }}>
                  <span className="badge" style={{ background: getSeverityBg(a.severity), color: getSeverityColor(a.severity) }}>{a.severity}</span>
                  <div className="alert-body">
                    <div className="alert-message">{a.message}</div>
                    <div className="alert-meta">{timeAgo(a.timestamp)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Timeline */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Clock size={16} /> Status Timeline (24h)
          </div>
          <div className="timeline">
            {deviceHistory.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>No history available.</p>
            ) : deviceHistory.map((h) => (
              <div key={h.id} className="timeline-item">
                <span className={`timeline-dot ${h.status}`} />
                <div className="timeline-time">{formatDateTime(h.timestamp)}</div>
                <div className="timeline-content">{h.message}</div>
                {h.duration && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>Duration: {h.duration}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default AdminDeviceDetail;
