import React, { useState, useMemo } from 'react';
import AppShell     from '../../components/layout/AppShell';
import PageHeader   from '../../components/layout/PageHeader';
import StatusBadge  from '../../components/ui/StatusBadge';
import SearchInput  from '../../components/ui/SearchInput';
import FilterDropdown from '../../components/ui/FilterDropdown';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState   from '../../components/ui/EmptyState';
import ErrorState   from '../../components/ui/ErrorState';
import { useMyDevice } from '../../hooks/useMyDevice';
import { timeAgo }    from '../../utils/formatters';

const UserDevices = () => {
  const { devices, loading, error } = useMyDevice();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const filtered = useMemo(() => {
    let d = [...devices];
    if (search) d = d.filter((x) => (x.name || '').toLowerCase().includes(search.toLowerCase()));
    if (status !== 'all') d = d.filter((x) => x.status === status);
    return d;
  }, [devices, search, status]);

  if (loading) return <AppShell title="Devices"><LoadingState message="Loading your device…" /></AppShell>;
  if (error)   return <AppShell title="Devices"><ErrorState message={error} /></AppShell>;

  return (
    <AppShell title="Devices">
      <PageHeader title="My Devices" subtitle="Your registered browser devices" breadcrumbs={['User', 'Devices']} />
      <div className="filter-row">
        <SearchInput id="udev-search" value={search} onChange={setSearch} placeholder="Search by name…" />
        <FilterDropdown id="udev-status" label="Status" value={status} onChange={setStatus}
          options={[{ value:'all',label:'All' },{ value:'online',label:'Online' },{ value:'offline',label:'Offline' }]} />
      </div>
      {filtered.length === 0 ? (
        <EmptyState
          title={devices.length === 0 ? "No devices connected yet" : "No devices found"}
          message={devices.length === 0 ? "Your active browser session will register and show your device here." : "Adjust your search or filter."}
        />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>PC Name</th>
                  <th>IP Address</th>
                  <th>Lab</th>
                  <th>Status</th>
                  <th>Last Seen</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{d.name}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{d.ip || 'Not available'}</td>
                    <td>{d.lab || 'Not Assigned'}</td>
                    <td><StatusBadge status={d.status} /></td>
                    <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{timeAgo(d.lastSeen)}</td>
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

export default UserDevices;
