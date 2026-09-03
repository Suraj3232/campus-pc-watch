import React from 'react';
import AppShell     from '../../components/layout/AppShell';
import PageHeader   from '../../components/layout/PageHeader';
import StatCard     from '../../components/ui/StatCard';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState   from '../../components/ui/ErrorState';
import EmptyState   from '../../components/ui/EmptyState';
import { useReports } from '../../hooks/useReports';
import { TrendingUp, CheckCircle, AlertTriangle, Activity } from 'lucide-react';

const AdminReports = () => {
  const { reports, loading, error } = useReports();

  if (loading) return <AppShell title="Reports"><LoadingState message="Loading reports…" /></AppShell>;
  if (error)   return <AppShell title="Reports"><ErrorState message={error} /></AppShell>;
  if (!reports) return null;

  const { summary } = reports;

  return (
    <AppShell title="Reports">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Campus-wide monitoring statistics"
        breadcrumbs={['Admin', 'Reports']}
      />

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <StatCard icon={<TrendingUp  size={20} />} value={`${summary.avgUptime}%`}     label="Average Uptime"  variant="online" />
        <StatCard icon={<Activity    size={20} />} value={summary.peakOnline}           label="Online Devices"  variant="accent" />
        <StatCard icon={<CheckCircle size={20} />} value={summary.resolvedAlerts}       label="Alerts Resolved" variant="online" />
        <StatCard icon={<AlertTriangle size={20} />} value={summary.activeAlerts}       label="Active Alerts"   variant="warning" />
      </div>

      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <EmptyState
          title="No historical trend data yet"
          message="Detailed uptime charts and lab distribution will accumulate over time as active devices send heartbeats."
        />
      </div>
    </AppShell>
  );
};

export default AdminReports;
