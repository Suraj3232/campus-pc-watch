import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import AppShell     from '../../components/layout/AppShell';
import PageHeader   from '../../components/layout/PageHeader';
import StatCard     from '../../components/ui/StatCard';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState   from '../../components/ui/ErrorState';
import { useReports } from '../../hooks/useReports';
import { TrendingUp, CheckCircle, AlertTriangle, Activity } from 'lucide-react';

const chartTooltipStyle = { backgroundColor:'#1e2536', border:'1px solid #2a3147', borderRadius:8, color:'#e8ecf0', fontSize:12 };

const UserReports = () => {
  const { reports, loading, error } = useReports();
  if (loading) return <AppShell title="Reports"><LoadingState /></AppShell>;
  if (error)   return <AppShell title="Reports"><ErrorState message={error} /></AppShell>;
  if (!reports) return null;

  const { summary, labAvailability, weeklyOnline } = reports;

  return (
    <AppShell title="Reports">
      <PageHeader title="Reports & Analytics" subtitle="Read-only view" breadcrumbs={['User', 'Reports']} />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'var(--space-4)', marginBottom:'var(--space-6)' }}>
        <StatCard icon={<TrendingUp   size={20} />} value={`${summary.avgUptime}%`} label="Average Uptime"  variant="online" />
        <StatCard icon={<Activity     size={20} />} value={summary.peakOnline}       label="Peak Online"     variant="accent" />
        <StatCard icon={<CheckCircle  size={20} />} value={summary.resolvedAlerts}   label="Alerts Resolved" variant="online" />
        <StatCard icon={<AlertTriangle size={20} />} value={summary.activeAlerts}    label="Active Alerts"   variant="warning" />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-5)', marginBottom:'var(--space-5)' }}>
        <div className="card">
          <div className="card-title" style={{ marginBottom:'var(--space-5)' }}>Lab Availability %</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={labAvailability} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3147" />
              <XAxis dataKey="lab" tick={{ fill:'#8a9bb8', fontSize:11 }} />
              <YAxis domain={[0,100]} tick={{ fill:'#8a9bb8', fontSize:11 }} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => `${v}%`} />
              <Bar dataKey="availability" fill="#3b82f6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="card-title" style={{ marginBottom:'var(--space-5)' }}>Online Devices — 7 Days</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weeklyOnline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3147" />
              <XAxis dataKey="day" tick={{ fill:'#8a9bb8', fontSize:11 }} />
              <YAxis tick={{ fill:'#8a9bb8', fontSize:11 }} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Legend wrapperStyle={{ fontSize:11, color:'#8a9bb8' }} />
              <Line type="monotone" dataKey="online"  stroke="#22c55e" strokeWidth={2} dot={{ r:3 }} />
              <Line type="monotone" dataKey="offline" stroke="#ef4444" strokeWidth={2} dot={{ r:3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppShell>
  );
};

export default UserReports;
