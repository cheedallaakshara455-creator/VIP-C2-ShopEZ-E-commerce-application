import { useState, useEffect } from 'react';
import { FiUser, FiPackage, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import './ProfilePage.css';

const STATUS_COLORS = {
  Processing: 'badge-warning', Confirmed: 'badge-primary',
  Shipped: 'badge-primary', Delivered: 'badge-success', Cancelled: 'badge-danger',
};

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (tab === 'orders') fetchOrders();
  }, [tab]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data } = await api.get('/orders/my');
      setOrders(data);
    } catch { toast.error('Failed to load orders'); }
    finally { setOrdersLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', form);
      updateUser(data);
      toast.success('Profile updated!');
      setEditMode(false);
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  return (
    <div className="page profile-page">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-hero card">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-hero-info">
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
            <span className={`badge ${user?.role === 'admin' ? 'badge-accent' : 'badge-primary'}`}>
              {user?.role === 'admin' ? '👑 Admin' : '🛍️ Shopper'}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button className={`profile-tab ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>
            <FiUser size={16} /> My Profile
          </button>
          <button className={`profile-tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
            <FiPackage size={16} /> My Orders
          </button>
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div className="profile-content animate-fadeIn">
            <div className="card">
              <div className="card-section-header">
                <h3>Personal Information</h3>
                {!editMode ? (
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditMode(true)}>
                    <FiEdit2 size={14} /> Edit
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditMode(false)}>
                      <FiX size={14} /> Cancel
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                      <FiCheck size={14} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                )}
              </div>
              <div className="profile-fields">
                <div className="profile-field">
                  <span className="field-label">Full Name</span>
                  {editMode ? (
                    <input className="form-input" value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  ) : (
                    <span className="field-value">{user?.name}</span>
                  )}
                </div>
                <div className="profile-field">
                  <span className="field-label">Email</span>
                  <span className="field-value">{user?.email}</span>
                </div>
                <div className="profile-field">
                  <span className="field-label">Phone</span>
                  {editMode ? (
                    <input className="form-input" value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210" />
                  ) : (
                    <span className="field-value">{user?.phone || '—'}</span>
                  )}
                </div>
                <div className="profile-field">
                  <span className="field-label">Member Since</span>
                  <span className="field-value">{new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div className="profile-content animate-fadeIn">
            {ordersLoading ? (
              <Loader />
            ) : orders.length === 0 ? (
              <div className="empty-orders">
                <div style={{ fontSize: '4rem' }}>📦</div>
                <h3>No orders yet</h3>
                <p>Your orders will appear here once you make a purchase.</p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order._id} className="order-card card">
                    <div className="order-card-header">
                      <div>
                        <p className="order-id">Order #{order._id?.slice(-8).toUpperCase()}</p>
                        <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                      </div>
                      <span className={`badge ${STATUS_COLORS[order.status] || 'badge-primary'}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="order-items-preview">
                      {order.items?.slice(0, 3).map((item, i) => (
                        <div key={i} className="order-preview-item">
                          <img
                            src={item.image || `https://picsum.photos/seed/${item.product}/50/50`}
                            alt={item.name}
                          />
                          <span>{item.name} × {item.quantity}</span>
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <span className="more-items">+{order.items.length - 3} more</span>
                      )}
                    </div>
                    <div className="order-card-footer">
                      <div className="order-details-mini">
                        <span>Payment: <strong>{order.paymentMethod}</strong></span>
                        <span>•</span>
                        <span>{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="order-total">
                        Total: <strong>₹{order.totalPrice?.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
