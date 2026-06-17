import { useState, useEffect } from 'react';
import { FiSearch, FiTrash2, FiUser, FiShield } from 'react-icons/fi';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';
import './AdminTable.css';

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id, name) => {
    if (id === currentUser._id) { toast.error("You can't delete yourself!"); return; }
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch { toast.error('Failed to delete user'); }
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const adminCount = users.filter((u) => u.role === 'admin').length;
  const userCount = users.filter((u) => u.role === 'user').length;

  return (
    <div className="admin-page">
      <div className="admin-section-header">
        <div>
          <h1>Users</h1>
          <p>{users.length} registered users • {adminCount} admin{adminCount !== 1 ? 's' : ''} • {userCount} shopper{userCount !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="users-stats" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="user-stat-chip">
          <FiUser size={16} /> {userCount} Shoppers
        </div>
        <div className="user-stat-chip admin-chip">
          <FiShield size={16} /> {adminCount} Admins
        </div>
      </div>

      <div className="table-toolbar">
        <div className="table-search">
          <FiSearch size={16} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…" className="table-search-input" />
        </div>
      </div>

      {loading ? <Loader /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: u.role === 'admin'
                          ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                          : 'linear-gradient(135deg, #2563EB, #1d4ed8)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '0.875rem', flexShrink: 0,
                      }}>
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{u.name}</div>
                        {u._id === currentUser._id && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--primary-light)' }}>You</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'badge-accent' : 'badge-primary'}`}>
                      {u.role === 'admin' ? '👑 Admin' : '🛍️ Shopper'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(u._id, u.name)}
                        disabled={u._id === currentUser._id}
                        title={u._id === currentUser._id ? "Can't delete yourself" : "Delete user"}
                        style={{ opacity: u._id === currentUser._id ? 0.3 : 1 }}
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="table-empty">No users found</div>}
        </div>
      )}

      <style>{`
        .user-stat-chip {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: rgba(37,99,235,0.12); color: var(--primary-light);
          border: 1px solid rgba(37,99,235,0.25); border-radius: 100px;
          padding: 0.35rem 0.875rem; font-size: 0.82rem; font-weight: 600;
        }
        .admin-chip {
          background: rgba(245,158,11,0.12); color: var(--accent);
          border-color: rgba(245,158,11,0.25);
        }
      `}</style>
    </div>
  );
};

export default AdminUsers;
