import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import AppShell     from '../../components/layout/AppShell';
import PageHeader   from '../../components/layout/PageHeader';
import StatCard     from '../../components/ui/StatCard';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState   from '../../components/ui/ErrorState';
import { useReports } from '../../hooks/useReports';
import { TrendingUp, CheckCircle, AlertTriangle, Activity } from 'lucide-react';

const CHART_COLORS = { online: '#22c55e', offline: '#ef4444', warning: '#f59e0b', accent: '#3b82f6' };

const chartTooltipStyle = {
  backgroundColor: '#1e2536', border: '1px solid #2a3147',
  borderRadius: 8, color: '#e8ecf0', fontSize: 12,
};

const AdminReports = () => {
  const { reports, loading, error } = useReports();

  if (loading) return <AppShell title="Reports"><LoadingState message="Loading reports…" /></AppShell>;
  if (error)   return <AppShell title="Reports"><ErrorState message={error} /></AppShell>;
  if (!reports) return null;

  const { summary, labAvailability, weeklyOnline, alertFrequency } = reports;

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
        <StatCard icon={<Activity    size={20} />} value={summary.peakOnline}           label="Peak Online"     variant="accent" />
        <StatCard icon={<CheckCircle size={20} />} value={summary.resolvedAlerts}       label="Alerts Resolved" variant="online" />
        <StatCard icon={<AlertTriangle size={20} />} value={summary.activeAlerts}       label="Active Alerts"   variant="warning" />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>
        {/* Bar: Lab Availability */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 'var(--space-5)' }}>Lab-wise Availability %</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={labAvailability} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3147" />
              <XAxis dataKey="lab" tick={{ fill: '#8a9bb8', fontSize: 11 }} />
              <YAxis domain={[0,100]} tick={{ fill: '#8a9bb8', fontSize: 11 }} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => `${v}%`} />
              <Bar dataKey="availability" fill={CHART_COLORS.accent} radius={[4,4,0,0]} label={{ position: 'top', fill: '#8a9bb8', fontSize: 10 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line: Weekly Online */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 'var(--space-5)' }}>Device Online Count — Last 7 Days</div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={weeklyOnline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3147" />
              <XAxis dataKey="day" tick={{ fill: '#8a9bb8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#8a9bb8', fontSize: 11 }} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#8a9bb8' }} />
              <Line type="monotone" dataKey="online"  stroke={CHART_COLORS.online}  strokeWidth={2} dot={{ r:3 }} />
              <Line type="monotone" dataKey="offline" stroke={CHART_COLORS.offline} strokeWidth={2} dot={{ r:3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--color-border)' }}>
          <div className="card-title">Lab Summary Table</div>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Lab</th>
                <th>Total PCs</th>
                <th>Online</th>
                <th>Offline</th>
                <th>Uptime %</th>
              </tr>
            </thead>
            <tbody>
              {labAvailability.map((row) => (
                <tr key={row.lab}>
                  <td style={{ fontWeight: 500 }}>{row.lab}</td>
                  <td>{row.total}</td>
                  <td style={{ color: 'var(--color-online)', fontWeight: 600 }}>{row.online}</td>
                  <td style={{ color: 'var(--color-offline)', fontWeight: 600 }}>{row.offline}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <div className="progress-bar" style={{ width: 80 }}>
                        <div className="progress-bar-fill" style={{ width: `${row.availability}%`, background: row.availability >= 95 ? 'var(--color-online)' : row.availability >= 80 ? 'var(--color-info)' : 'var(--color-warning)' }} />
                      </div>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: row.availability >= 95 ? 'var(--color-online)' : 'var(--color-warning)' }}>{row.availability}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Phase 2 note */}
      <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-4)' }}>
        📊 Data shown is mock. Phase 2 will connect to real-time Firestore analytics.
      </p>
    </AppShell>
  );
};

export default AdminReports;
