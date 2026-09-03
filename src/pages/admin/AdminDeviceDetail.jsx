import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Monitor, Clock } from 'lucide-react';
import AppShell     from '../../components/layout/AppShell';
import PageHeader   from '../../components/layout/PageHeader';
import StatusBadge  from '../../components/ui/StatusBadge';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState   from '../../components/ui/ErrorState';
import { useDevices } from '../../hooks/useDevices';
import { timeAgo, formatDate } from '../../utils/formatters';

const AdminDeviceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { devices, loading: dLoad, error: dErr } = useDevices();

  const device = devices.find((d) => d.id === id);

  if (dLoad) return <AppShell title="Device Detail"><LoadingState message="Loading device…" /></AppShell>;
  if (dErr)  return <AppShell title="Device Detail"><ErrorState message={dErr} /></AppShell>;
  if (!device) return (
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
                { label: 'Device ID',   value: device.deviceId || device.id, mono: true },
                { label: 'User Email',  value: device.userEmail || '—' },
                { label: 'IP Address',  value: device.ip || 'Not available', mono: true },
                { label: 'Lab',         value: device.lab || 'Not Assigned' },
                { label: 'Status',      value: device.status === 'online' ? 'Online' : 'Offline' },
                { label: 'Last Seen',   value: timeAgo(device.lastSeen) },
                { label: 'Registered',  value: formatDate(device.createdAt) },
                { label: 'Description', value: device.description || '—' },
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
            <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--color-border)' }}>
              <div className="card-title">Recent Alerts for this Device</div>
            </div>
            <div style={{ padding: 'var(--space-4)' }}>
              <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', padding: 'var(--space-4)' }}>
                ✅ No alerts for this device
              </p>
            </div>
          </div>
        </div>

        {/* Right: Timeline */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Clock size={16} /> Status Timeline
          </div>
          <div className="timeline">
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              No history available yet.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default AdminDeviceDetail;
