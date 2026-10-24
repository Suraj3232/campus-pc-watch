import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import AppShell     from '../../components/layout/AppShell';
import PageHeader   from '../../components/layout/PageHeader';
import SearchInput  from '../../components/ui/SearchInput';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState   from '../../components/ui/ErrorState';
import EmptyState   from '../../components/ui/EmptyState';
import { formatDate } from '../../utils/formatters';

const AdminUsers = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [search, setSearch]   = useState('');

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const list = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setUsers(list);
        setLoading(false);
      },
      (err) => {
        console.error('Failed to load users:', err);
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        (u.displayName || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q)
    );
  }, [users, search]);

  if (loading) return <AppShell title="Users"><LoadingState variant="table" /></AppShell>;
  if (error)   return <AppShell title="Users"><ErrorState message={error} /></AppShell>;

  return (
    <AppShell title="Users">
      <PageHeader
        title="User Management"
        subtitle={`${users.length} registered accounts`}
        breadcrumbs={['Admin', 'Users']}
      />

      <div className="filter-row">
        <SearchInput id="user-search" value={search} onChange={setSearch} placeholder="Search by name or email…" />
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <EmptyState
            title={users.length === 0 ? "No registered users" : "No matching users"}
            message={users.length === 0 ? "Users will appear here once they register an account." : "Try adjusting your search."}
          />
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const initial = (u.displayName || u.email || 'U')[0].toUpperCase();
                  const role = u.role || 'user';
                  const status = u.status || 'active';
                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: role === 'admin' ? 'rgba(168,85,247,0.15)' : 'var(--color-accent-glow)',
                            color: role === 'admin' ? '#a855f7' : 'var(--color-accent)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 600, fontSize: 'var(--text-sm)',
                          }}>
                            {initial}
                          </div>
                          <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
                            {u.displayName || 'Unnamed User'}
                          </span>
                        </div>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{u.email}</td>
                      <td><span className={`badge badge-${role}`}>{role === 'admin' ? '⚡ Admin' : '👤 User'}</span></td>
                      <td><span className={`badge badge-${status === 'active' ? 'online' : 'offline'}`}>{status}</span></td>
                      <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{formatDate(u.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-4)' }}>
        ℹ️ Live user accounts from Firebase Authentication and Firestore.
      </p>
    </AppShell>
  );
};

export default AdminUsers;
