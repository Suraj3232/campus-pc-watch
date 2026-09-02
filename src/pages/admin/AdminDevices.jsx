import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Wifi, WifiOff, AlertTriangle, Plus, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';
import AppShell     from '../../components/layout/AppShell';
import PageHeader   from '../../components/layout/PageHeader';
import StatCard     from '../../components/ui/StatCard';
import StatusBadge  from '../../components/ui/StatusBadge';
import SearchInput  from '../../components/ui/SearchInput';
import FilterDropdown from '../../components/ui/FilterDropdown';
import EmptyState   from '../../components/ui/EmptyState';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState   from '../../components/ui/ErrorState';
import Modal        from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { useDevices } from '../../hooks/useDevices';
import { useLabs }    from '../../hooks/useLabs';
import { useToast }   from '../../components/ui/Toast';
import { timeAgo }    from '../../utils/formatters';
import { validators } from '../../utils/validators';

const PAGE_SIZE = 10;

const AdminDevices = () => {
  const { devices, loading, error, refetch, addDevice, updateDevice, deleteDevice } = useDevices();
  const { labs } = useLabs();
  const toast    = useToast();

  const [search,   setSearch]   = useState('');
  const [status,   setStatus]   = useState('all');
  const [labFilter,setLabFilter]= useState('all');
  const [sortKey,  setSortKey]  = useState('name');
  const [sortDir,  setSortDir]  = useState('asc');
  const [page,     setPage]     = useState(1);

  const [modalOpen,   setModalOpen]   = useState(false);
  const [editDevice,  setEditDevice]  = useState(null);
  const [deleteTarget,setDeleteTarget]= useState(null);
  const [deleting,    setDeleting]    = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [form,        setForm]        = useState({ name: '', ip: '', labId: '1', description: '' });
  const [formErrors,  setFormErrors]  = useState({});

  const filtered = useMemo(() => {
    let d = [...devices];
    if (search)              d = d.filter((x) => x.name.toLowerCase().includes(search.toLowerCase()) || x.ip.includes(search));
    if (status !== 'all')    d = d.filter((x) => x.status === status);
    if (labFilter !== 'all') d = d.filter((x) => String(x.labId) === labFilter);
    d.sort((a,b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return d;
  }, [devices, search, status, labFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  const sort = (key) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ col }) => sortKey === col
    ? (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)
    : null;

  const openAdd = () => {
    setEditDevice(null);
    setForm({ name: '', ip: '', labId: String(labs[0]?.id ?? '1'), description: '' });
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (d) => {
    setEditDevice(d);
    setForm({ name: d.name, ip: d.ip, labId: String(d.labId), description: d.description ?? '' });
    setFormErrors({});
    setModalOpen(true);
  };

  const validateForm = () => {
    const e = {
      name: validators.deviceName(form.name),
      ip:   validators.ipAddress(form.ip),
    };
    setFormErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);
    const lab = labs.find((l) => String(l.id) === form.labId);
    const payload = { ...form, labId: Number(form.labId), lab: lab?.name ?? '' };
    try {
      if (editDevice) {
        await updateDevice(editDevice.id, payload);
        toast.success('Device updated.');
      } else {
        await addDevice({ ...payload, status: 'online', lastSeen: new Date().toISOString() });
        toast.success('Device added.');
      }
      setModalOpen(false);
    } catch {
      toast.error('Failed to save device.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDevice(deleteTarget.id);
      toast.success(`${deleteTarget.name} deleted.`);
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete device.');
    } finally {
      setDeleting(false);
    }
  };

  const total   = devices.length;
  const online  = devices.filter((d) => d.status === 'online').length;
  const offline = devices.filter((d) => d.status === 'offline').length;
  const warning = devices.filter((d) => d.status === 'warning').length;

  const labOptions = [{ value: 'all', label: 'All Labs' }, ...labs.map((l) => ({ value: String(l.id), label: l.name }))];

  if (loading) return <AppShell title="Devices"><LoadingState message="Loading devices…" /></AppShell>;
  if (error)   return <AppShell title="Devices"><ErrorState message={error} onRetry={refetch} /></AppShell>;

  return (
    <AppShell title="Devices">
      <PageHeader
        title="Device Management"
        subtitle={`${total} devices across ${labs.length} labs`}
        breadcrumbs={['Admin', 'Devices']}
        actions={<>
          <button className="btn btn-secondary btn-sm" onClick={refetch}><RefreshCw size={14} /> Refresh</button>
          <button className="btn btn-primary" onClick={openAdd} id="add-device-btn"><Plus size={16} /> Add Device</button>
        </>}
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <StatCard icon={<Monitor size={20} />} value={total}   label="Total Devices" variant="accent" />
        <StatCard icon={<Wifi    size={20} />} value={online}  label="Online"         variant="online" />
        <StatCard icon={<WifiOff size={20} />} value={offline} label="Offline"        variant="offline" />
        <StatCard icon={<AlertTriangle size={20} />} value={warning} label="Warning"  variant="warning" />
      </div>

      {/* Filters */}
      <div className="filter-row">
        <SearchInput id="device-search" value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by name or IP…" />
        <FilterDropdown id="status-filter" label="Status" value={status} onChange={(v) => { setStatus(v); setPage(1); }}
          options={[{ value:'all',label:'All Statuses' },{ value:'online',label:'Online' },{ value:'offline',label:'Offline' },{ value:'warning',label:'Warning' }]} />
        <FilterDropdown id="lab-filter" label="Lab" value={labFilter} onChange={(v) => { setLabFilter(v); setPage(1); }} options={labOptions} />
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {paginated.length === 0 ? (
          <EmptyState title="No devices found" message="Try adjusting your search or filters." />
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th onClick={() => sort('name')} tabIndex={0}>PC Name <SortIcon col="name" /></th>
                  <th onClick={() => sort('ip')}   tabIndex={0}>IP Address <SortIcon col="ip" /></th>
                  <th onClick={() => sort('lab')}  tabIndex={0}>Lab <SortIcon col="lab" /></th>
                  <th onClick={() => sort('status')} tabIndex={0}>Status <SortIcon col="status" /></th>
                  <th onClick={() => sort('lastSeen')} tabIndex={0}>Last Seen <SortIcon col="lastSeen" /></th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((d) => (
                  <tr key={d.id}>
                    <td><Link to={`/admin/devices/${d.id}`} style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-accent)' }}>{d.name}</Link></td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{d.ip}</td>
                    <td>{d.lab}</td>
                    <td><StatusBadge status={d.status} /></td>
                    <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{timeAgo(d.lastSeen)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <Link to={`/admin/devices/${d.id}`} className="btn btn-ghost btn-sm">View</Link>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(d)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(d)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filtered.length > PAGE_SIZE && (
          <div className="pagination" style={{ padding: 'var(--space-3) var(--space-4)' }}>
            <span className="pagination-info">Showing {(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}</span>
            <button className="page-btn" onClick={() => setPage((p) => Math.max(1,p-1))} disabled={page===1}>&lt;</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} className={`page-btn${page === i+1 ? ' active' : ''}`} onClick={() => setPage(i+1)}>{i+1}</button>
            )).slice(Math.max(0,page-3), Math.min(totalPages, page+2))}
            <button className="page-btn" onClick={() => setPage((p) => Math.min(totalPages,p+1))} disabled={page===totalPages}>&gt;</button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editDevice ? 'Edit Device' : 'Add Device'}>
        <div className="modal-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label htmlFor="dev-name" className="form-label">Device Name</label>
              <input id="dev-name" type="text" className={`form-input${formErrors.name ? ' error' : ''}`}
                value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="PC-001" />
              {formErrors.name && <span className="form-error" role="alert">{formErrors.name}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="dev-ip" className="form-label">IP Address</label>
              <input id="dev-ip" type="text" className={`form-input${formErrors.ip ? ' error' : ''}`}
                value={form.ip} onChange={(e) => setForm((p) => ({ ...p, ip: e.target.value }))} placeholder="192.168.1.10" />
              {formErrors.ip && <span className="form-error" role="alert">{formErrors.ip}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="dev-lab" className="form-label">Lab</label>
              <select id="dev-lab" className="form-select" value={form.labId} onChange={(e) => setForm((p) => ({ ...p, labId: e.target.value }))}>
                {labs.map((l) => <option key={l.id} value={String(l.id)}>{l.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="dev-desc" className="form-label">Description (optional)</label>
              <input id="dev-desc" type="text" className="form-input"
                value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Workstation description" />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <><span className="spinner spinner-sm" /> Saving…</> : (editDevice ? 'Save Changes' : 'Add Device')}
          </button>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Device"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Device"
      />
    </AppShell>
  );
};

export default AdminDevices;
