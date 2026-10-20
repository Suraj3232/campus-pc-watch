import React, { useState, useMemo } from 'react';
import AppShell     from '../../components/layout/AppShell';
import PageHeader   from '../../components/layout/PageHeader';
import FilterDropdown from '../../components/ui/FilterDropdown';
import SearchInput  from '../../components/ui/SearchInput';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState   from '../../components/ui/EmptyState';
import ErrorState   from '../../components/ui/ErrorState';
import { useHistory } from '../../hooks/useHistory';
import { useLabs }    from '../../hooks/useLabs';
import { useDevices } from '../../hooks/useDevices';
import { formatDateTime } from '../../utils/formatters';

const AdminHistory = () => {
  const { history, loading, error } = useHistory();
  const { labs }    = useLabs();
  const { devices } = useDevices();
  const [search,    setSearch]    = useState('');
  const [labFilter, setLabFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deviceFilter, setDeviceFilter] = useState('all');

  const filtered = useMemo(() => {
    let h = [...history];
    if (search)              h = h.filter((x) => x.device.toLowerCase().includes(search.toLowerCase()));
    if (labFilter !== 'all') h = h.filter((x) => String(x.labId) === labFilter);
    if (statusFilter !== 'all') h = h.filter((x) => x.status === statusFilter);
    if (deviceFilter !== 'all') h = h.filter((x) => x.deviceId === deviceFilter);
    return h;
  }, [history, search, labFilter, statusFilter, deviceFilter]);

  const deviceOptions = [{ value: 'all', label: 'All Devices' }, ...devices.map((d) => ({ value: d.id, label: d.name }))];
  const labOptions    = [{ value: 'all', label: 'All Labs'    }, ...labs.map((l)    => ({ value: String(l.id), label: l.name }))];

  if (loading) return <AppShell title="History"><LoadingState message="Loading history…" /></AppShell>;
  if (error)   return <AppShell title="History"><ErrorState message={error} /></AppShell>;

  const statusDot = (s) => ({
    display: 'inline-block', width: 8, height: 8, borderRadius: '50%', marginRight: 6,
    background: s === 'online' ? 'var(--color-online)' : s === 'offline' ? 'var(--color-offline)' : 'var(--color-warning)',
  });

  return (
    <AppShell title="History">
      <PageHeader
        title="Monitoring History"
        subtitle={`${filtered.length} events`}
        breadcrumbs={['Admin', 'History']}
      />

      <div className="filter-row">
        <SearchInput id="history-search" value={search} onChange={setSearch} placeholder="Search device…" />
        <FilterDropdown id="history-lab"    label="Lab"    value={labFilter}    onChange={setLabFilter}    options={labOptions} />
        <FilterDropdown id="history-status" label="Status" value={statusFilter} onChange={setStatusFilter}
          options={[{ value:'all',label:'All' },{ value:'online',label:'Online' },{ value:'offline',label:'Offline' },{ value:'warning',label:'Warning' }]} />
        <FilterDropdown id="history-device" label="Device" value={deviceFilter} onChange={setDeviceFilter} options={deviceOptions} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No device history available yet" message="Device connection and disconnection events will be recorded here." />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Device</th>
                  <th>Lab</th>
                  <th>Status</th>
                  <th>Event</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((h) => (
                  <tr key={h.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{formatDateTime(h.timestamp)}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{h.device}</td>
                    <td>{h.lab}</td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', fontSize: 'var(--text-xs)', fontWeight: 500,
                        color: h.status === 'online' ? 'var(--color-online)' : h.status === 'offline' ? 'var(--color-offline)' : 'var(--color-warning)' }}>
                        <span style={statusDot(h.status)} />
                        {h.status.charAt(0).toUpperCase() + h.status.slice(1)}
                      </span>
                    </td>
                    <td>{h.message}</td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>{h.duration ?? '—'}</td>
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

export default AdminHistory;
