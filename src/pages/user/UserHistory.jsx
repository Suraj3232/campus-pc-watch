import React from 'react';
import AppShell     from '../../components/layout/AppShell';
import PageHeader   from '../../components/layout/PageHeader';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState   from '../../components/ui/EmptyState';
import ErrorState   from '../../components/ui/ErrorState';
import { useHistory } from '../../hooks/useHistory';
import { formatDateTime } from '../../utils/formatters';

const UserHistory = () => {
  const { history, loading, error } = useHistory();

  if (loading) return <AppShell title="History"><LoadingState /></AppShell>;
  if (error)   return <AppShell title="History"><ErrorState message={error} /></AppShell>;

  const statusDot = (s) => ({
    display:'inline-block', width:8, height:8, borderRadius:'50%', marginRight:6,
    background: s==='online' ? 'var(--color-online)' : s==='offline' ? 'var(--color-offline)' : 'var(--color-warning)',
  });

  return (
    <AppShell title="History">
      <PageHeader title="Monitoring History" subtitle="Device event history" breadcrumbs={['User', 'History']} />
      {history.length === 0 ? <EmptyState title="No history available yet" message="Device connection and disconnection events will be recorded here." /> : (
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr><th>Timestamp</th><th>Device</th><th>Lab</th><th>Status</th><th>Event</th></tr>
              </thead>
              <tbody>
                {history.slice(0, 50).map((h) => (
                  <tr key={h.id}>
                    <td style={{ fontFamily:'var(--font-mono)', fontSize:'var(--text-xs)', color:'var(--color-text-muted)' }}>{formatDateTime(h.timestamp)}</td>
                    <td style={{ fontFamily:'var(--font-mono)', fontWeight:600 }}>{h.device}</td>
                    <td>{h.lab}</td>
                    <td>
                      <span style={{ display:'flex', alignItems:'center', fontSize:'var(--text-xs)', fontWeight:500, color: h.status==='online'?'var(--color-online)': h.status==='offline'?'var(--color-offline)':'var(--color-warning)' }}>
                        <span style={statusDot(h.status)} />{h.status.charAt(0).toUpperCase()+h.status.slice(1)}
                      </span>
                    </td>
                    <td>{h.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default UserHistory;
