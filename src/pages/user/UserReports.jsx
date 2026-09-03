import React, { useMemo } from 'react';
import AppShell     from '../../components/layout/AppShell';
import PageHeader   from '../../components/layout/PageHeader';
import StatCard     from '../../components/ui/StatCard';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState   from '../../components/ui/ErrorState';
import EmptyState   from '../../components/ui/EmptyState';
import { useMyDevice } from '../../hooks/useMyDevice';
import { TrendingUp, CheckCircle, AlertTriangle, Activity } from 'lucide-react';

const UserReports = () => {
  const { devices, loading, error } = useMyDevice();

  const summary = useMemo(() => {
    const total = devices.length;
    const online = devices.filter((d) => d.status === 'online').length;
    const avgUptime = total > 0 ? Math.round((online / total) * 100) : 0;
    return {
      totalPCs: total,
      avgUptime,
      peakOnline: online,
      resolvedAlerts: 0,
      activeAlerts: 0,
    };
  }, [devices]);

  if (loading) return <AppShell title="Reports"><LoadingState /></AppShell>;
  if (error)   return <AppShell title="Reports"><ErrorState message={error} /></AppShell>;

  return (
    <AppShell title="Reports">
      <PageHeader title="Reports & Analytics" subtitle="Read-only view" breadcrumbs={['User', 'Reports']} />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'var(--space-4)', marginBottom:'var(--space-6)' }}>
        <StatCard icon={<TrendingUp   size={20} />} value={`${summary.avgUptime}%`} label="Average Uptime"  variant="online" />
        <StatCard icon={<Activity     size={20} />} value={summary.peakOnline}       label="Online Devices"  variant="accent" />
        <StatCard icon={<CheckCircle  size={20} />} value={summary.resolvedAlerts}   label="Alerts Resolved" variant="online" />
        <StatCard icon={<AlertTriangle size={20} />} value={summary.activeAlerts}    label="Active Alerts"   variant="warning" />
      </div>
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <EmptyState
          title="No historical trend data yet"
          message="Analytics will populate as your device remains connected to the network."
        />
      </div>
    </AppShell>
  );
};

export default UserReports;
