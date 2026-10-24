import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell,
} from 'recharts';
import { TrendingUp, CheckCircle, AlertTriangle, Activity, Monitor, Wifi } from 'lucide-react';
import AppShell     from '../../components/layout/AppShell';
import PageHeader   from '../../components/layout/PageHeader';
import StatCard     from '../../components/ui/StatCard';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState   from '../../components/ui/ErrorState';
import { useReports } from '../../hooks/useReports';
import { useLabs }    from '../../hooks/useLabs';
import { mockReports } from '../../mock/mockReports';

/* ── Recharts tooltip styling ────────────────────────────────── */
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

const AdminReports = () => {
  const { reports, loading, error } = useReports();
  const { labs }                    = useLabs();
  const [activeChart, setActiveChart] = useState('bar'); // 'bar' | 'line'

  if (loading) return <AppShell title="Reports"><LoadingState variant="card" /></AppShell>;
  if (error)   return <AppShell title="Reports"><ErrorState message={error} /></AppShell>;
  if (!reports) return null;

  const { summary } = reports;

  // Use mock chart data (rich historical data)
  const labAvailability = mockReports.labAvailability;
  const weeklyOnline    = mockReports.weeklyOnline;
  const alertFrequency  = mockReports.alertFrequency;

  // Lab summary table from live labs (or mock fallback)
  const labRows = labs.length > 0
    ? labs.map((l) => ({
        name:       l.name,
        total:      l.totalPCs,
        online:     l.online,
        offline:    l.offline,
        uptime:     Math.round((l.online / l.totalPCs) * 100),
      }))
    : labAvailability.map((r) => ({
        name:    r.lab,
        total:   r.total,
        online:  r.online,
        offline: r.offline,
        uptime:  r.availability,
      }));

  return (
    <AppShell title="Reports">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Campus-wide monitoring statistics and trends"
        breadcrumbs={['Admin', 'Reports']}
      />

      {/* ── Summary Stat Cards ──────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <StatCard icon={<TrendingUp  size={20} />} value={`${summary.avgUptime}%`}    label="Average Uptime"  variant="online" />
        <StatCard icon={<Monitor     size={20} />} value={summary.totalPCs}            label="Total Devices"   variant="accent" />
        <StatCard icon={<Activity    size={20} />} value={summary.peakOnline}          label="Peak Online"     variant="accent" />
        <StatCard icon={<CheckCircle size={20} />} value={mockReports.summary.resolvedAlerts}  label="Alerts Resolved" variant="online" />
        <StatCard icon={<AlertTriangle size={20} />} value={mockReports.summary.activeAlerts}  label="Active Alerts"   variant="warning" />
        <StatCard icon={<Wifi        size={20} />} value={`${mockReports.summary.lowestOnline}`}  label={`Lowest (${mockReports.summary.lowestOnlineDay})`} variant="warning" />
      </div>

      {/* ── Chart Toggle ────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
        <button
          className={`btn btn-sm ${activeChart === 'bar' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveChart('bar')}
        >
          Lab Availability
        </button>
        <button
          className={`btn btn-sm ${activeChart === 'line' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveChart('line')}
        >
          Weekly Trend
        </button>
        <button
          className={`btn btn-sm ${activeChart === 'alert' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveChart('alert')}
        >
          Alert Frequency
        </button>
      </div>

      {/* ── Charts ─────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>

        {/* Bar chart — Lab availability */}
        {activeChart === 'bar' && (
          <div className="card">
            <div className="card-header">
              <div className="card-title">Lab-wise Device Availability (%)</div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Last 7 days average</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={labAvailability} margin={{ top: 8, right: 20, left: -10, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #2a3147)" vertical={false} />
                <XAxis dataKey="lab" tick={{ fill: '#8a9bb8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#8a9bb8', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`, 'Availability']} />
                <Bar dataKey="availability" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {labAvailability.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.availability >= 95 ? '#22c55e' : entry.availability >= 80 ? '#3b82f6' : '#f59e0b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Line chart — Weekly online count */}
        {activeChart === 'line' && (
          <div className="card">
            <div className="card-header">
              <div className="card-title">Device Online Count — Last 7 Days</div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Total devices: {summary.totalPCs || mockReports.summary.totalPCs}</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyOnline} margin={{ top: 8, right: 20, left: -10, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #2a3147)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#8a9bb8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8a9bb8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#8a9bb8' }} />
                <Line type="monotone" dataKey="online"  stroke="#22c55e" strokeWidth={2.5} dot={{ r: 4, fill: '#22c55e' }}  activeDot={{ r: 6 }} name="Online" />
                <Line type="monotone" dataKey="offline" stroke="#ef4444" strokeWidth={2}   dot={{ r: 3, fill: '#ef4444' }}  activeDot={{ r: 5 }} name="Offline" strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Stacked bar chart — Alert frequency */}
        {activeChart === 'alert' && (
          <div className="card">
            <div className="card-header">
              <div className="card-title">Alert Frequency — Last 7 Days</div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>By severity level</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={alertFrequency} margin={{ top: 8, right: 20, left: -10, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #2a3147)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#8a9bb8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8a9bb8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#8a9bb8' }} />
                <Bar dataKey="high"    name="HIGH"    fill="#ef4444" stackId="a" radius={[0,0,0,0]} />
                <Bar dataKey="warning" name="WARNING" fill="#f59e0b" stackId="a" />
                <Bar dataKey="info"    name="INFO"    fill="#3b82f6" stackId="a" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* ── Summary Table ───────────────────────────────────────── */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--color-border)' }}>
          <div className="card-title">Lab Summary Table</div>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Lab</th>
                <th style={{ textAlign: 'center' }}>Total</th>
                <th style={{ textAlign: 'center' }}>Online</th>
                <th style={{ textAlign: 'center' }}>Offline</th>
                <th style={{ textAlign: 'center' }}>Uptime %</th>
                <th style={{ textAlign: 'center' }}>Health</th>
              </tr>
            </thead>
            <tbody>
              {labRows.map((row) => {
                const color = row.uptime >= 95 ? 'var(--color-online)' : row.uptime >= 80 ? 'var(--color-info)' : row.uptime >= 60 ? 'var(--color-warning)' : 'var(--color-offline)';
                const label = row.uptime >= 95 ? 'Excellent' : row.uptime >= 80 ? 'Good' : row.uptime >= 60 ? 'Fair' : 'Poor';
                return (
                  <tr key={row.name}>
                    <td style={{ fontWeight: 600 }}>{row.name}</td>
                    <td style={{ textAlign: 'center' }}>{row.total}</td>
                    <td style={{ textAlign: 'center', color: 'var(--color-online)', fontWeight: 600 }}>{row.online}</td>
                    <td style={{ textAlign: 'center', color: 'var(--color-offline)', fontWeight: 600 }}>{row.offline}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontWeight: 700, color, fontSize: 'var(--text-sm)' }}>{row.uptime}%</span>
                        <div style={{ width: 80, height: 4, background: 'var(--color-border)', borderRadius: 9999, overflow: 'hidden' }}>
                          <div style={{ width: `${row.uptime}%`, height: '100%', background: color, borderRadius: 9999, transition: 'width 0.6s ease' }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color, background: `${color}18`, padding: '2px 10px', borderRadius: 'var(--radius-full)' }}>
                        {label}
                      </span>
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

export default AdminReports;
