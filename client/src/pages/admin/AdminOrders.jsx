import { useState, useEffect } from 'react';
import { FiSearch, FiEye } from 'react-icons/fi';
import api from '../../utils/api';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';
import './AdminTable.css';

const STATUS_OPTIONS = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_BADGE = {
  Processing: 'badge-warning', Confirmed: 'badge-primary',
  Shipped: 'badge-primary', Delivered: 'badge-success', Cancelled: 'badge-danger',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/orders');
      setOrders(data);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?._id === orderId) setSelectedOrder((o) => ({ ...o, status: newStatus }));
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = orders.filter((o) => {
    const matchSearch = o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus ? o.status === filterStatus : true;
    return matchSearch && matchStatus;
  });

  return (
    <div className="admin-page">
      <div className="admin-section-header">
        <div>
          <h1>Orders</h1>
          <p>{orders.length} total orders</p>
        </div>
      </div>

      <div className="table-toolbar" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div className="table-search">
          <FiSearch size={16} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID or customer…" className="table-search-input" />
        </div>
        <select
          className="form-select" style={{ width: 'auto', minWidth: '160px' }}
          value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <Loader /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th><th>Customer</th><th>Items</th>
                <th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o._id}>
                  <td><code style={{ fontSize: '0.78rem', color: 'var(--primary-light)' }}>#{o._id?.slice(-8).toUpperCase()}</code></td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{o.user?.name || 'N/A'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.user?.email}</div>
                  </td>
                  <td>{o.items?.length} item{o.items?.length !== 1 ? 's' : ''}</td>
                  <td><strong>₹{o.totalPrice?.toLocaleString()}</strong></td>
                  <td><span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>{o.paymentMethod}</span></td>
                  <td>
                    <select
                      className="status-select"
                      value={o.status}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn view" onClick={() => setSelectedOrder(o)} title="View Details">
                        <FiEye size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="table-empty">No orders found</div>}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setSelectedOrder(null)}>
          <div className="modal-box">
            <div className="modal-header">
              <h3>Order #{selectedOrder._id?.slice(-8).toUpperCase()}</h3>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="detail-box" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem' }}>
                  <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Customer</h4>
                  <p style={{ fontWeight: 600 }}>{selectedOrder.user?.name}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{selectedOrder.user?.email}</p>
                </div>
                <div className="detail-box" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem' }}>
                  <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Status</h4>
                  <span className={`badge ${STATUS_BADGE[selectedOrder.status]}`}>{selectedOrder.status}</span>
                  <div style={{ marginTop: '0.5rem' }}>
                    <select className="status-select" value={selectedOrder.status}
                      onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}>
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Shipping Address</h4>
                <p style={{ fontSize: '0.875rem' }}>{selectedOrder.shippingAddress?.fullName} • {selectedOrder.shippingAddress?.phone}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
                </p>
              </div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem' }}>Items ({selectedOrder.items?.length})</h4>
              {selectedOrder.items?.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid var(--border)' }}>
                  <img src={item.image || `https://picsum.photos/seed/${item.product}/40/40`} alt={item.name}
                    style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} />
                  <span style={{ flex: 1, fontSize: '0.875rem' }}>{item.name} × {item.quantity}</span>
                  <span style={{ fontWeight: 700 }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Subtotal: ₹{selectedOrder.itemsPrice?.toLocaleString()}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Shipping: {selectedOrder.shippingPrice === 0 ? 'FREE' : `₹${selectedOrder.shippingPrice}`}</p>
                <p style={{ fontWeight: 800, fontSize: '1.05rem', marginTop: '0.4rem' }}>Total: ₹{selectedOrder.totalPrice?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
