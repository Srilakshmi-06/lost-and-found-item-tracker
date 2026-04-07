import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Loader2, ShieldAlert, Users, PackageSearch, BarChart3, Settings, Trash2, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

const TabButton = ({ active, onClick, icon: Icon, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border transition-colors ${
      active
        ? 'bg-primary-600 text-white border-primary-600'
        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
    }`}
  >
    <Icon size={18} />
    {children}
  </button>
);

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('users');

  // Users
  const [users, setUsers] = useState([]);
  const [userQuery, setUserQuery] = useState('');
  const [usersLoading, setUsersLoading] = useState(false);

  // Items
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemFilters, setItemFilters] = useState({ moderationStatus: '', type: '', q: '' });

  // Reports
  const [reports, setReports] = useState(null);
  const [reportsLoading, setReportsLoading] = useState(false);

  // Settings
  const [settings, setSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);

  const isAdmin = useMemo(() => user?.role === 'admin', [user]);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate('/login');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user || !isAdmin) return;
    if (tab === 'users') void fetchUsers();
    if (tab === 'items') void fetchItems();
    if (tab === 'reports') void fetchReports();
    if (tab === 'settings') void fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, user, isAdmin]);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const { data } = await API.get('/admin/users', { params: userQuery ? { q: userQuery } : {} });
      setUsers(data.users || []);
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || 'Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  const setRole = async (id, role) => {
    try {
      const { data } = await API.patch(`/admin/users/${id}/role`, { role });
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role: data.user.role } : u)));
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to update role');
    }
  };

  const fetchItems = async () => {
    setItemsLoading(true);
    try {
      const params = {};
      if (itemFilters.moderationStatus) params.moderationStatus = itemFilters.moderationStatus;
      if (itemFilters.type) params.type = itemFilters.type;
      if (itemFilters.q) params.q = itemFilters.q;
      const { data } = await API.get('/admin/items', { params });
      setItems(data.items || []);
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to load items');
    } finally {
      setItemsLoading(false);
    }
  };

  const setItemModeration = async (id, moderationStatus) => {
    try {
      const { data } = await API.patch(`/admin/items/${id}/moderation`, { moderationStatus });
      setItems((prev) => prev.map((it) => (it._id === id ? data.item : it)));
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to update moderation status');
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this item? This cannot be undone.')) return;
    try {
      await API.delete(`/admin/items/${id}`);
      setItems((prev) => prev.filter((it) => it._id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to delete item');
    }
  };

  const fetchReports = async () => {
    setReportsLoading(true);
    try {
      const { data } = await API.get('/admin/reports');
      setReports(data);
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to load reports');
    } finally {
      setReportsLoading(false);
    }
  };

  const fetchSettings = async () => {
    setSettingsLoading(true);
    try {
      const { data } = await API.get('/admin/settings');
      setSettings(data.settings);
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to load settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  const saveSettings = async () => {
    setSettingsSaving(true);
    try {
      const { data } = await API.put('/admin/settings', settings);
      setSettings(data.settings);
      alert('Settings saved');
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to save settings');
    } finally {
      setSettingsSaving(false);
    }
  };

  if (loading || (!user && !loading)) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-primary-600" size={40} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-14">
        <div className="bg-white border border-slate-100 rounded-3xl p-10 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
              <ShieldAlert className="text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Admin access required</h1>
              <p className="text-slate-500 mt-2">You’re signed in, but your account is not an admin.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage users, moderate items, view reports, and update settings.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <TabButton active={tab === 'users'} onClick={() => setTab('users')} icon={Users}>Users</TabButton>
          <TabButton active={tab === 'items'} onClick={() => setTab('items')} icon={PackageSearch}>Items</TabButton>
          <TabButton active={tab === 'reports'} onClick={() => setTab('reports')} icon={BarChart3}>Reports</TabButton>
          <TabButton active={tab === 'settings'} onClick={() => setTab('settings')} icon={Settings}>Settings</TabButton>
        </div>
      </div>

      {tab === 'users' && (
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between border-b border-slate-100">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Users</h2>
              <p className="text-slate-500 text-sm">Search users and change roles.</p>
            </div>
            <div className="flex gap-2">
              <input
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Search name/email…"
                className="px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
              <button onClick={fetchUsers} className="btn btn-secondary">
                <RefreshCw size={18} /> Refresh
              </button>
            </div>
          </div>

          {usersLoading ? (
            <div className="flex justify-center items-center h-56">
              <Loader2 className="animate-spin text-primary-600" size={36} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Email</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Role</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-5 font-bold text-slate-900">{u.name}</td>
                      <td className="px-6 py-5 text-slate-500">{u.email}</td>
                      <td className="px-6 py-5">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setRole(u._id, 'user')} className="btn btn-secondary">Make user</button>
                          <button onClick={() => setRole(u._id, 'admin')} className="btn btn-primary">Make admin</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-500">No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'items' && (
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 flex flex-col gap-4 border-b border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Items moderation</h2>
                <p className="text-slate-500 text-sm">Approve, reject, or delete reports.</p>
              </div>
              <button onClick={fetchItems} className="btn btn-secondary">
                <RefreshCw size={18} /> Refresh
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <input
                value={itemFilters.q}
                onChange={(e) => setItemFilters((p) => ({ ...p, q: e.target.value }))}
                placeholder="Search…"
                className="px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200 flex-1"
              />
              <select
                value={itemFilters.type}
                onChange={(e) => setItemFilters((p) => ({ ...p, type: e.target.value }))}
                className="px-4 py-2 rounded-xl border border-slate-200"
              >
                <option value="">All types</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
              <select
                value={itemFilters.moderationStatus}
                onChange={(e) => setItemFilters((p) => ({ ...p, moderationStatus: e.target.value }))}
                className="px-4 py-2 rounded-xl border border-slate-200"
              >
                <option value="">All moderation</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
              <button onClick={fetchItems} className="btn btn-primary">Apply</button>
            </div>
          </div>

          {itemsLoading ? (
            <div className="flex justify-center items-center h-56">
              <Loader2 className="animate-spin text-primary-600" size={36} />
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {items.map((it) => (
                <div key={it._id} className="p-6 flex flex-col md:flex-row md:items-center gap-5">
                  <div className="flex items-center gap-4 flex-1">
                    <img src={it.imageUrl} className="w-14 h-14 rounded-xl object-cover bg-slate-100" />
                    <div>
                      <div className="font-extrabold text-slate-900">{it.title}</div>
                      <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-2">
                        <span className="capitalize">{it.category}</span>
                        <span>•</span>
                        <span className="capitalize">{it.type}</span>
                        <span>•</span>
                        <span className="capitalize">{it.moderationStatus || 'approved'}</span>
                        <span>•</span>
                        <span>by {it.userId?.name || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-end">
                    <button onClick={() => setItemModeration(it._id, 'approved')} className="btn btn-secondary">
                      <CheckCircle2 size={18} /> Approve
                    </button>
                    <button onClick={() => setItemModeration(it._id, 'rejected')} className="btn btn-secondary">
                      <XCircle size={18} /> Reject
                    </button>
                    <button onClick={() => deleteItem(it._id)} className="btn btn-secondary">
                      <Trash2 size={18} /> Delete
                    </button>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="p-10 text-center text-slate-500">No items found.</div>
              )}
            </div>
          )}
        </div>
      )}

      {tab === 'reports' && (
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 flex items-center justify-between border-b border-slate-100">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Reports</h2>
              <p className="text-slate-500 text-sm">High-level platform metrics.</p>
            </div>
            <button onClick={fetchReports} className="btn btn-secondary">
              <RefreshCw size={18} /> Refresh
            </button>
          </div>

          {reportsLoading ? (
            <div className="flex justify-center items-center h-56">
              <Loader2 className="animate-spin text-primary-600" size={36} />
            </div>
          ) : reports ? (
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Users</div>
                <div className="text-3xl font-extrabold text-slate-900 mt-2">{reports.totals?.users ?? 0}</div>
              </div>
              <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Items</div>
                <div className="text-3xl font-extrabold text-slate-900 mt-2">{reports.totals?.items ?? 0}</div>
              </div>
              <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Matches</div>
                <div className="text-3xl font-extrabold text-slate-900 mt-2">{reports.totals?.matches ?? 0}</div>
              </div>

              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-6 rounded-2xl border border-slate-100">
                  <div className="font-extrabold text-slate-900">Items by type</div>
                  <div className="text-sm text-slate-500 mt-2">
                    {(reports.itemsByType || []).map((row) => (
                      <div key={row._id} className="flex justify-between py-1">
                        <span className="capitalize">{row._id}</span>
                        <span className="font-bold text-slate-900">{row.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-6 rounded-2xl border border-slate-100">
                  <div className="font-extrabold text-slate-900">Items by moderation</div>
                  <div className="text-sm text-slate-500 mt-2">
                    {(reports.itemsByModeration || []).map((row) => (
                      <div key={row._id} className="flex justify-between py-1">
                        <span className="capitalize">{row._id || 'unknown'}</span>
                        <span className="font-bold text-slate-900">{row.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-10 text-center text-slate-500">No data yet.</div>
          )}
        </div>
      )}

      {tab === 'settings' && (
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 flex items-center justify-between border-b border-slate-100">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Settings</h2>
              <p className="text-slate-500 text-sm">Feature flags and maintenance mode.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={fetchSettings} className="btn btn-secondary">
                <RefreshCw size={18} /> Refresh
              </button>
              <button onClick={saveSettings} disabled={settingsSaving || !settings} className="btn btn-primary">
                {settingsSaving ? <Loader2 className="animate-spin" size={18} /> : null}
                Save
              </button>
            </div>
          </div>

          {settingsLoading ? (
            <div className="flex justify-center items-center h-56">
              <Loader2 className="animate-spin text-primary-600" size={36} />
            </div>
          ) : settings ? (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="p-5 rounded-2xl border border-slate-100 flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={!!settings.requireItemApproval}
                  onChange={(e) => setSettings((p) => ({ ...p, requireItemApproval: e.target.checked }))}
                  className="mt-1"
                />
                <div>
                  <div className="font-extrabold text-slate-900">Require item approval</div>
                  <div className="text-sm text-slate-500 mt-1">New items can be held for moderation before being public.</div>
                </div>
              </label>

              <label className="p-5 rounded-2xl border border-slate-100 flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={!!settings.maintenanceMode}
                  onChange={(e) => setSettings((p) => ({ ...p, maintenanceMode: e.target.checked }))}
                  className="mt-1"
                />
                <div>
                  <div className="font-extrabold text-slate-900">Maintenance mode</div>
                  <div className="text-sm text-slate-500 mt-1">Toggle a site-wide maintenance state (UI wiring can be added next).</div>
                </div>
              </label>

              <div className="md:col-span-2 p-5 rounded-2xl border border-slate-100">
                <div className="font-extrabold text-slate-900">Maintenance message</div>
                <textarea
                  value={settings.maintenanceMessage || ''}
                  onChange={(e) => setSettings((p) => ({ ...p, maintenanceMessage: e.target.value }))}
                  className="mt-3 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  rows={4}
                  placeholder="Message to show during maintenance…"
                />
              </div>
            </div>
          ) : (
            <div className="p-10 text-center text-slate-500">No settings loaded.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

