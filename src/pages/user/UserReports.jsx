import React from 'react';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell,
} from 'recharts';
import { TrendingUp, CheckCircle, AlertTriangle, Activity, Monitor } from 'lucide-react';
import AppShell     from '../../components/layout/AppShell';
import PageHeader   from '../../components/layout/PageHeader';
import StatCard     from '../../components/ui/StatCard';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState   from '../../components/ui/ErrorState';
import { useMyDevice } from '../../hooks/useMyDevice';
import { mockReports } from '../../mock/mockReports';

const tooltipStyle = {
  contentStyle: {
    background: 'var(--color-surface-2, #1e2536)',
    border: '1px solid var(--color-border, #2a3147)',
    borderRadius: 8,
    color: '#e8ecf0',
    fontSize: 13,
  },
  labelStyle: { color: '#8a9bb8', marginBottom: 4 },
  cursor: { fill: 'rgba(59,130,246,0.07)' },
};

const UserReports = () => {
  const { devices, loading, error } = useMyDevice();

  if (loading) return <AppShell title="Reports"><LoadingState /></AppShell>;
  if (error)   return <AppShell title="Reports"><ErrorState message={error} /></AppShell>;

  const total      = devices.length;
  const online     = devices.filter((d) => d.status === 'online').length;
  const avgUptime  = total > 0 ? Math.round((online / total) * 100) : mockReports.summary.avgUptime;
  const peakOnline = online || mockReports.summary.peakOnline;

  // Use mock historical chart data
  const { labAvailability, weeklyOnline } = mockReports;

  return (
    <AppShell title="Reports">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Campus monitoring overview — read-only"
        breadcrumbs={['User', 'Reports']}
      />

      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'var(--space-4)', marginBottom:'var(--space-6)' }}>
        <StatCard icon={<TrendingUp   size={20} />} value={`${avgUptime}%`}              label="Average Uptime"   variant="online" />
        <StatCard icon={<Activity     size={20} />} value={peakOnline}                   label="Peak Online"      variant="accent" />
        <StatCard icon={<Monitor      size={20} />} value={mockReports.summary.totalPCs} label="Campus Devices"   variant="accent" />
        <StatCard icon={<CheckCircle  size={20} />} value={mockReports.summary.resolvedAlerts} label="Alerts Resolved" variant="online" />
        <StatCard icon={<AlertTriangle size={20} />} value={mockReports.summary.activeAlerts}  label="Active Alerts"   variant="warning" />
      </div>

      {/* ── Charts ─────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>

        {/* Bar — Lab availability */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Lab-wise Availability (%)</div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={labAvailability} margin={{ top: 8, right: 16, left: -16, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #2a3147)" vertical={false} />
              <XAxis dataKey="lab" tick={{ fill: '#8a9bb8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0,100]} tick={{ fill: '#8a9bb8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`, 'Availability']} />
              <Bar dataKey="availability" radius={[6,6,0,0]} maxBarSize={55}>
                {labAvailability.map((e, i) => (
                  <Cell key={i} fill={e.availability >= 95 ? '#22c55e' : e.availability >= 80 ? '#3b82f6' : '#f59e0b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line — Weekly online count */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Weekly Device Trend</div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={weeklyOnline} margin={{ top: 8, right: 16, left: -16, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #2a3147)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#8a9bb8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8a9bb8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#8a9bb8' }} />
              <Line type="monotone" dataKey="online"  stroke="#22c55e" strokeWidth={2.5} dot={{ r: 4, fill:'#22c55e' }}  name="Online" />
              <Line type="monotone" dataKey="offline" stroke="#ef4444" strokeWidth={2}   dot={{ r: 3, fill:'#ef4444' }}  name="Offline" strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Lab Summary Table ────────────────────────────────────── */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--color-border)' }}>
          <div className="card-title">Lab Summary</div>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Lab</th>
                <th style={{ textAlign:'center' }}>Total</th>
                <th style={{ textAlign:'center' }}>Online</th>
                <th style={{ textAlign:'center' }}>Offline</th>
                <th style={{ textAlign:'center' }}>Uptime %</th>
              </tr>
            </thead>
            <tbody>
              {labAvailability.map((row) => {
                const color = row.availability >= 95 ? 'var(--color-online)' : row.availability >= 80 ? 'var(--color-info)' : 'var(--color-warning)';
                return (
                  <tr key={row.lab}>
                    <td style={{ fontWeight: 600 }}>{row.lab}</td>
                    <td style={{ textAlign:'center' }}>{row.total}</td>
                    <td style={{ textAlign:'center', color:'var(--color-online)', fontWeight:600 }}>{row.online}</td>
                    <td style={{ textAlign:'center', color:'var(--color-offline)', fontWeight:600 }}>{row.offline}</td>
                    <td style={{ textAlign:'center' }}>
                      <span style={{ fontWeight:700, color, fontSize:'var(--text-sm)' }}>{row.availability}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
};

export default UserReports;
