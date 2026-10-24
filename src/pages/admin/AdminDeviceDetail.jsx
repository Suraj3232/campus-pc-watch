import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Monitor, Clock, AlertTriangle, CheckCircle, Info, Wifi, WifiOff } from 'lucide-react';
import AppShell     from '../../components/layout/AppShell';
import PageHeader   from '../../components/layout/PageHeader';
import StatusBadge  from '../../components/ui/StatusBadge';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState   from '../../components/ui/ErrorState';
import { useDevices } from '../../hooks/useDevices';
import { useHistory } from '../../hooks/useHistory';
import { useAlerts }  from '../../hooks/useAlerts';
import { timeAgo, formatDate } from '../../utils/formatters';
import { getSeverityColor, getSeverityBg } from '../../utils/statusUtils';

/* ── Severity icon helper ─────────────────────────────────────── */
const SevIcon = ({ s }) => {
  if (s === 'HIGH')    return <AlertTriangle size={14} style={{ color: 'var(--color-offline)' }} />;
  if (s === 'WARNING') return <AlertTriangle size={14} style={{ color: 'var(--color-warning)' }} />;
  return <Info size={14} style={{ color: 'var(--color-info)' }} />;
};

/* ── Timeline status icon ─────────────────────────────────────── */
const TimelineIcon = ({ status }) => {
  const bg = status === 'online'
    ? 'var(--color-online-bg)'
    : status === 'offline'
    ? 'var(--color-offline-bg)'
    : 'var(--color-warning-bg)';
  const color = status === 'online'
    ? 'var(--color-online)'
    : status === 'offline'
    ? 'var(--color-offline)'
    : 'var(--color-warning)';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', background: bg, flexShrink: 0 }}>
      {status === 'online'  ? <Wifi    size={13} style={{ color }} /> : null}
      {status === 'offline' ? <WifiOff size={13} style={{ color }} /> : null}
      {status === 'warning' ? <AlertTriangle size={13} style={{ color }} /> : null}
    </span>
  );
};

const AdminDeviceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { devices, loading: dLoad, error: dErr } = useDevices();
  const { history, loading: hLoad }              = useHistory();
  const { alerts,  loading: aLoad }              = useAlerts();

  const device = devices.find((d) => d.id === id);
  const loading = dLoad || hLoad || aLoad;

  if (loading) return <AppShell title="Device Detail"><LoadingState variant="card" /></AppShell>;
  if (dErr)    return <AppShell title="Device Detail"><ErrorState message={dErr} /></AppShell>;
  if (!device) return (
    <AppShell title="Device Detail">
      <ErrorState message="Device not found." onRetry={() => navigate('/admin/devices')} />
    </AppShell>
  );

  // Get history for this device (use deviceId or name match)
  const deviceHistory = history
    .filter((h) =>
      h.deviceId === id ||
      h.deviceId === device.deviceId ||
      h.device?.toUpperCase() === device.name?.toUpperCase()
    )
    .slice(0, 20);

  // Get alerts for this device
  const deviceAlerts = alerts
    .filter((a) =>
      a.device?.toUpperCase() === device.name?.toUpperCase() ||
      (device.ip && a.message?.includes(device.ip))
    )
    .slice(0, 5);

  return (
    <AppShell title={device.name}>
      <PageHeader
        title={device.name}
        breadcrumbs={['Admin', 'Devices', device.name]}
        actions={<Link to="/admin/devices" className="btn btn-secondary btn-sm"><ArrowLeft size={14} /> Back to Devices</Link>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: 'var(--space-5)', alignItems: 'start' }}>

        {/* ── Left: Device Info + Alerts ─────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

          {/* Device info card */}
          <div className="card">
            <div className="card-header">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <Monitor size={20} /> Device Information
              </div>
              <StatusBadge status={device.status} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              {[
                { label: 'PC Name',     value: device.name,                        mono: true  },
                { label: 'Device ID',   value: device.deviceId || device.id,       mono: true  },
                { label: 'User Email',  value: device.userEmail || '—',            mono: false },
                { label: 'IP Address',  value: device.ip || 'Not available',       mono: true  },
                { label: 'Lab',         value: device.lab || 'Not Assigned',       mono: false },
                { label: 'Status',      value: device.status === 'online' ? 'Online' : 'Offline', mono: false },
                { label: 'Last Seen',   value: timeAgo(device.lastSeen),           mono: false },
                { label: 'Registered',  value: formatDate(device.createdAt),       mono: false },
                { label: 'Description', value: device.description || '—',          mono: false },
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

          {/* Device Alerts */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <AlertTriangle size={16} style={{ color: 'var(--color-warning)' }} />
              <div className="card-title">Recent Alerts for This Device</div>
            </div>
            <div style={{ padding: 'var(--space-4)' }}>
              {deviceAlerts.length === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-online)', fontSize: 'var(--text-sm)', padding: 'var(--space-3)' }}>
                  <CheckCircle size={16} /> No alerts for this device
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {deviceAlerts.map((alert) => (
                    <div key={alert.id} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)',
                      padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                      background: getSeverityBg(alert.severity),
                      border: `1px solid ${getSeverityColor(alert.severity)}22`,
                    }}>
                      <SevIcon s={alert.severity} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 2 }}>{alert.message}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{timeAgo(alert.timestamp)}</div>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: getSeverityColor(alert.severity), background: getSeverityBg(alert.severity), border: `1px solid ${getSeverityColor(alert.severity)}44`, padding: '2px 6px', borderRadius: 4, flexShrink: 0 }}>
                        {alert.severity}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Monitoring Summary */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Monitoring Summary</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
              {[
                { label: 'Total Events',   value: deviceHistory.length, color: 'var(--color-text-primary)' },
                { label: 'Online Events',  value: deviceHistory.filter((h) => h.status === 'online').length,  color: 'var(--color-online)'  },
                { label: 'Offline Events', value: deviceHistory.filter((h) => h.status === 'offline').length, color: 'var(--color-offline)' },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: 'center', padding: 'var(--space-4)', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Status Timeline ─────────────────────────────── */}
        <div className="card" style={{ position: 'sticky', top: 'var(--space-5)' }}>
          <div className="card-title" style={{ marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Clock size={16} /> Status Timeline
            <span style={{ marginLeft: 'auto', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 400 }}>Last 24h</span>
          </div>

          {deviceHistory.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', textAlign: 'center', padding: 'var(--space-6) 0' }}>
              No history events found for this device.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {deviceHistory.map((ev, idx) => (
                <div key={ev.id} style={{ display: 'flex', gap: 'var(--space-3)', position: 'relative' }}>
                  {/* Line */}
                  {idx < deviceHistory.length - 1 && (
                    <div style={{ position: 'absolute', left: 13, top: 28, width: 2, bottom: -4, background: 'var(--color-border)' }} />
                  )}
                  <TimelineIcon status={ev.status} />
                  <div style={{ flex: 1, paddingBottom: 'var(--space-4)' }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 2 }}>
                      {ev.message}
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                      <span>{timeAgo(ev.timestamp)}</span>
                      {ev.duration && <span>· {ev.duration}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default AdminDeviceDetail;
