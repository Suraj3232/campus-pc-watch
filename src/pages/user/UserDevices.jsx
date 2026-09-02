import React, { useState, useMemo } from 'react';
import AppShell     from '../../components/layout/AppShell';
import PageHeader   from '../../components/layout/PageHeader';
import StatusBadge  from '../../components/ui/StatusBadge';
import SearchInput  from '../../components/ui/SearchInput';
import FilterDropdown from '../../components/ui/FilterDropdown';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState   from '../../components/ui/EmptyState';
import ErrorState   from '../../components/ui/ErrorState';
import { useDevices } from '../../hooks/useDevices';
import { useLabs }    from '../../hooks/useLabs';
import { timeAgo }    from '../../utils/formatters';

const UserDevices = () => {
  const { devices, loading, error } = useDevices();
  const { labs }                    = useLabs();
  const [search,    setSearch]    = useState('');
  const [status,    setStatus]    = useState('all');
  const [labFilter, setLabFilter] = useState('all');

  const filtered = useMemo(() => {
    let d = [...devices];
    if (search)              d = d.filter((x) => x.name.toLowerCase().includes(search.toLowerCase()) || x.ip.includes(search));
    if (status !== 'all')    d = d.filter((x) => x.status === status);
    if (labFilter !== 'all') d = d.filter((x) => String(x.labId) === labFilter);
    return d;
  }, [devices, search, status, labFilter]);

  const labOptions = [{ value: 'all', label: 'All Labs' }, ...labs.map((l) => ({ value: String(l.id), label: l.name }))];

  if (loading) return <AppShell title="Devices"><LoadingState message="Loading…" /></AppShell>;
  if (error)   return <AppShell title="Devices"><ErrorState message={error} /></AppShell>;

  return (
    <AppShell title="Devices">
      <PageHeader title="Device Status" subtitle="Read-only view of all campus devices" breadcrumbs={['User', 'Devices']} />
      <div className="filter-row">
        <SearchInput id="udev-search" value={search} onChange={setSearch} placeholder="Search by name or IP…" />
        <FilterDropdown id="udev-status" label="Status" value={status} onChange={setStatus}
          options={[{ value:'all',label:'All' },{ value:'online',label:'Online' },{ value:'offline',label:'Offline' },{ value:'warning',label:'Warning' }]} />
        <FilterDropdown id="udev-lab" label="Lab" value={labFilter} onChange={setLabFilter} options={labOptions} />
      </div>
      {filtered.length === 0 ? <EmptyState title="No devices found" message="Adjust your filters." /> : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr><th>PC Name</th><th>IP Address</th><th>Lab</th><th>Status</th><th>Last Seen</th></tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{d.name}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{d.ip}</td>
                    <td>{d.lab}</td>
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
