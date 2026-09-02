import React, { useState } from 'react';
import AppShell     from '../../components/layout/AppShell';
import PageHeader   from '../../components/layout/PageHeader';
import SearchInput  from '../../components/ui/SearchInput';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState   from '../../components/ui/ErrorState';
import { useDevices } from '../../hooks/useDevices';
import { useMemo } from 'react';
import { mockUsers } from '../../mock/mockUsers';
import { formatDate, timeAgo } from '../../utils/formatters';

const AdminUsers = () => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return mockUsers;
    return mockUsers.filter((u) => u.displayName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  return (
    <AppShell title="Users">
      <PageHeader
        title="User Management"
        subtitle={`${mockUsers.length} registered users`}
        breadcrumbs={['Admin', 'Users']}
      />

      <div className="filter-row">
        <SearchInput id="user-search" value={search} onChange={setSearch} placeholder="Search by name or email…" />
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Last Login</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: u.role === 'admin' ? 'rgba(168,85,247,0.15)' : 'var(--color-accent-glow)',
                        color: u.role === 'admin' ? '#a855f7' : 'var(--color-accent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 600, fontSize: 'var(--text-sm)',
                      }}>
                        {u.displayName[0]}
                      </div>
                      <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{u.displayName}</span>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{u.email}</td>
                  <td><span className={`badge badge-${u.role}`}>{u.role === 'admin' ? '⚡ Admin' : '👤 User'}</span></td>
                  <td><span className={`badge badge-${u.status === 'active' ? 'online' : 'offline'}`}>{u.status}</span></td>
                  <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{formatDate(u.createdAt)}</td>
                  <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{timeAgo(u.lastLogin)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-4)' }}>
        ℹ️ User management operations (promote, deactivate) will be available in Phase 2.
      </p>
    </AppShell>
  );
};

export default AdminUsers;
