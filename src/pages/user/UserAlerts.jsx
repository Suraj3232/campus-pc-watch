import React, { useState, useMemo } from 'react';
import AppShell     from '../../components/layout/AppShell';
import PageHeader   from '../../components/layout/PageHeader';
import SearchInput  from '../../components/ui/SearchInput';
import FilterDropdown from '../../components/ui/FilterDropdown';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState   from '../../components/ui/EmptyState';
import ErrorState   from '../../components/ui/ErrorState';
import { useAlerts } from '../../hooks/useAlerts';
import { useLabs }   from '../../hooks/useLabs';
import { timeAgo }   from '../../utils/formatters';
import { getSeverityColor, getSeverityBg } from '../../utils/statusUtils';

const UserAlerts = () => {
  const { alerts, loading, error } = useAlerts();
  const { labs } = useLabs();
  const [search,    setSearch]   = useState('');
  const [severity,  setSeverity] = useState('all');
  const [labFilter, setLabFilter]= useState('all');

  const filtered = useMemo(() => {
    let a = alerts.filter((x) => !x.resolved);
    if (search)        a = a.filter((x) => x.device.toLowerCase().includes(search.toLowerCase()) || x.message.toLowerCase().includes(search.toLowerCase()));
    if (severity !== 'all')  a = a.filter((x) => x.severity === severity);
    if (labFilter !== 'all') a = a.filter((x) => String(x.labId) === labFilter);
    return a;
  }, [alerts, search, severity, labFilter]);

  const labOptions = [{ value:'all',label:'All Labs' },...labs.map((l) => ({ value: String(l.id), label: l.name }))];

  if (loading) return <AppShell title="Alerts"><LoadingState /></AppShell>;
  if (error)   return <AppShell title="Alerts"><ErrorState message={error} /></AppShell>;

  return (
    <AppShell title="Alerts">
      <PageHeader title="Active Alerts" subtitle="Read-only view" breadcrumbs={['User', 'Alerts']} />
      <div className="filter-row">
        <SearchInput id="ua-search" value={search} onChange={setSearch} placeholder="Search…" />
        <FilterDropdown id="ua-sev" label="Severity" value={severity} onChange={setSeverity}
          options={[{ value:'all',label:'All' },{ value:'HIGH',label:'HIGH' },{ value:'WARNING',label:'WARNING' },{ value:'INFO',label:'INFO' }]} />
        <FilterDropdown id="ua-lab" label="Lab" value={labFilter} onChange={setLabFilter} options={labOptions} />
      </div>
      {filtered.length === 0 ? <EmptyState title="No active alerts" message="No active alerts match your filters." /> : (
        <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
          {filtered.map((a) => (
            <div key={a.id} className="alert-item" style={{ background: getSeverityBg(a.severity), border:`1px solid ${getSeverityColor(a.severity)}22` }}>
              <div className="alert-severity">
                <span className="badge" style={{ background: getSeverityBg(a.severity), color: getSeverityColor(a.severity), fontWeight:700 }}>{a.severity}</span>
              </div>
              <div className="alert-body">
                <div className="alert-device">{a.device}</div>
                <div className="alert-message">{a.message}</div>
                <div className="alert-meta"><span>{a.lab}</span></div>
              </div>
              <div className="alert-time">{timeAgo(a.timestamp)}</div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
};

export default UserAlerts;
