import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, RotateCcw, Zap } from 'lucide-react';
import AppShell     from '../../components/layout/AppShell';
import PageHeader   from '../../components/layout/PageHeader';
import StatusBadge  from '../../components/ui/StatusBadge';
import SearchInput  from '../../components/ui/SearchInput';
import FilterDropdown from '../../components/ui/FilterDropdown';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState   from '../../components/ui/EmptyState';
import ErrorState   from '../../components/ui/ErrorState';
import ConnectDeviceModal from '../../components/devices/ConnectDeviceModal';
import { useMyDevice } from '../../hooks/useMyDevice';
import { useLabs }     from '../../hooks/useLabs';
import { useToast }    from '../../components/ui/Toast';
import { timeAgo }     from '../../utils/formatters';
import { sendDevicePing } from '../../services/deviceService';

const UserDevices = () => {
  const { devices, loading, error } = useMyDevice();
  const { labs } = useLabs();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlLab = searchParams.get('lab') || 'all';

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [labFilter, setLabFilter] = useState(urlLab);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [pingingId, setPingingId] = useState(null);

  useEffect(() => {
    if (searchParams.get('lab')) {
      setLabFilter(searchParams.get('lab'));
    }
  }, [searchParams]);

  const labOptions = [
    { value: 'all', label: 'All Labs' },
    ...labs.map((l) => ({ value: String(l.id), label: l.name })),
  ];

  const filtered = useMemo(() => {
    let d = [...devices];
    if (search) {
      const q = search.toLowerCase();
      d = d.filter((x) =>
        (x.name || '').toLowerCase().includes(q) ||
        (x.ip || '').toLowerCase().includes(q) ||
        (x.lab || '').toLowerCase().includes(q) ||
        (x.labName || '').toLowerCase().includes(q)
      );
    }
    if (status !== 'all') d = d.filter((x) => x.status === status);
    if (labFilter !== 'all') {
      const selectedLab = labs.find((l) => String(l.id) === String(labFilter));
      d = d.filter((x) =>
        String(x.labId) === String(labFilter) ||
        (selectedLab && (x.lab === selectedLab.name || x.labName === selectedLab.name)) ||
        x.lab === labFilter ||
        x.labName === labFilter
      );
    }
    return d;
  }, [devices, search, status, labFilter, labs]);

  const handlePing = async (dev) => {
    setPingingId(dev.id);
    try {
      const ms = await sendDevicePing(dev.deviceId || dev.id);
      toast.success(`Ping signal verified for ${dev.name} (${ms}ms)`);
    } catch {
      toast.error('Ping failed');
    } finally {
      setPingingId(null);
    }
  };

  if (loading) return <AppShell title="Devices"><LoadingState message="Loading your device…" /></AppShell>;
  if (error)   return <AppShell title="Devices"><ErrorState message={error} /></AppShell>;

  return (
    <AppShell title="Devices">
      <PageHeader
        title="My Devices"
        subtitle="Your registered browser workstations & stations"
        breadcrumbs={['User', 'Devices']}
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => setConnectModalOpen(true)}>
            <Plus size={14} /> Connect / Edit Device
          </button>
        }
      />

      <ConnectDeviceModal
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
      />

      <div className="filter-row">
        <SearchInput id="udev-search" value={search} onChange={setSearch} placeholder="Search by name, IP or lab…" />
        <FilterDropdown id="udev-status" label="Status" value={status} onChange={setStatus}
          options={[{ value:'all',label:'All Statuses' },{ value:'online',label:'Online' },{ value:'offline',label:'Offline' }]} />
        {labs.length > 0 && (
          <FilterDropdown id="udev-lab" label="Lab" value={labFilter} onChange={setLabFilter} options={labOptions} />
        )}
        {(search || status !== 'all' || labFilter !== 'all') && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setSearch('');
              setStatus('all');
              setLabFilter('all');
              setSearchParams({});
            }}
            style={{ display: 'flex', alignItems: 'center', gap: 4, height: 38 }}
            title="Reset filters"
          >
            <RotateCcw size={13} /> Reset
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={devices.length === 0 ? "No devices connected yet" : "No matching devices found"}
          message={devices.length === 0 ? "Your active browser session will register and show your device here." : "Try adjusting your search query or filters."}
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
                  <th>Quick Action</th>
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
                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handlePing(d)}
                        disabled={pingingId === d.id}
                        style={{ gap: 4, fontSize: 'var(--text-xs)' }}
                      >
                        <Zap size={12} style={{ color: 'var(--color-warning)' }} />
                        {pingingId === d.id ? 'Pinging…' : 'Ping'}
                      </button>
                    </td>
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
