import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Monitor, ArrowRight } from 'lucide-react';
import AppShell     from '../../components/layout/AppShell';
import PageHeader   from '../../components/layout/PageHeader';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState   from '../../components/ui/ErrorState';
import StatusBadge  from '../../components/ui/StatusBadge';
import { useLabs }  from '../../hooks/useLabs';
import { getHealthLabel } from '../../utils/statusUtils';

const AdminLabs = () => {
  const { labs, loading, error } = useLabs();

  if (loading) return <AppShell title="Labs"><LoadingState message="Loading labs…" /></AppShell>;
  if (error)   return <AppShell title="Labs"><ErrorState message={error} /></AppShell>;

  return (
    <AppShell title="Labs">
      <PageHeader
        title="Lab Overview"
        subtitle={`${labs.length} labs monitored`}
        breadcrumbs={['Admin', 'Labs']}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-5)' }}>
        {labs.map((lab) => {
          const pct    = Math.round((lab.online / lab.totalPCs) * 100);
          const health = getHealthLabel(pct);
          return (
            <div key={lab.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)' }}>
                    {lab.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    <MapPin size={11} /> {lab.location}
                  </div>
                </div>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: health.color, background: `${health.color}18`, padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                  {health.label}
                </span>
              </div>

              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>{lab.description}</p>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                {[
                  { label: 'Total',   value: lab.totalPCs, color: 'var(--color-text-primary)' },
                  { label: 'Online',  value: lab.online,   color: 'var(--color-online)' },
                  { label: 'Offline', value: lab.offline,  color: 'var(--color-offline)' },
                ].map((s) => (
                  <div key={s.label} style={{ textAlign: 'center', padding: 'var(--space-3)', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)' }}>
                  <span>Availability</span>
                  <span style={{ color: health.color, fontWeight: 600 }}>{pct}%</span>
                </div>
                <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${pct}%`, background: health.color }} /></div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="badge badge-info" style={{ fontSize: 10 }}>{lab.category}</span>
                <Link to={`/admin/devices?lab=${lab.id}`} className="btn btn-ghost btn-sm">
                  View Devices <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
};

export default AdminLabs;
