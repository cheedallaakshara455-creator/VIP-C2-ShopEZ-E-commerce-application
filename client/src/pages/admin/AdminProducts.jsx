import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiCheck } from 'react-icons/fi';
import api from '../../utils/api';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';
import './AdminTable.css';

const EMPTY_FORM = {
  name: '', description: '', price: '', originalPrice: '',
  category: '', stock: '', brand: '', discount: '', featured: false,
  images: [''],
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products?limit=100');
      setProducts(data.products || []);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  const openAdd = () => { setEditProduct(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (p) => {
    setEditProduct(p);
    setForm({
      name: p.name, description: p.description, price: p.price,
      originalPrice: p.originalPrice || '', category: p.category,
      stock: p.stock, brand: p.brand || '', discount: p.discount || '',
      featured: p.featured, images: p.images?.length ? p.images : [''],
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category || !form.stock) {
      toast.error('Please fill required fields'); return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form, price: Number(form.price), originalPrice: Number(form.originalPrice) || 0,
        stock: Number(form.stock), discount: Number(form.discount) || 0,
        images: form.images.filter(Boolean),
      };
      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, payload);
        toast.success('Product updated!');
      } else {
        await api.post('/products', payload);
        toast.success('Product created!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Failed to delete product'); }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-section-header">
        <div>
          <h1>Products</h1>
          <p>{products.length} products in catalog</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <FiPlus size={18} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="table-toolbar">
        <div className="table-search">
          <FiSearch size={16} />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..." className="table-search-input"
          />
        </div>
      </div>

      {loading ? <Loader /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th><th>Name</th><th>Category</th>
                <th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img
                      src={p.images?.[0] || `https://picsum.photos/seed/${p._id}/50/50`}
                      alt={p.name} className="table-product-img"
                    />
                  </td>
                  <td>
                    <div className="table-product-name">{p.name}</div>
                    {p.featured && <span className="badge badge-accent" style={{fontSize:'0.65rem'}}>Featured</span>}
                  </td>
                  <td><span className="badge badge-primary">{p.category}</span></td>
                  <td>
                    <div className="price-cell">
                      <strong>₹{p.price?.toLocaleString()}</strong>
                      {p.originalPrice > p.price && (
                        <span className="orig-price">₹{p.originalPrice?.toLocaleString()}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${p.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
                      {p.stock > 0 ? p.stock : 'Out'}
                    </span>
                  </td>
                  <td>⭐ {p.rating?.toFixed(1)} ({p.numReviews})</td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn edit" onClick={() => openEdit(p)} title="Edit">
                        <FiEdit2 size={15} />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(p._id, p.name)} title="Delete">
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="table-empty">No products found</div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div className="modal-header">
              <h3>{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><FiX size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input className="form-input" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <input className="form-input" value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Electronics, Fashion…" />
                </div>
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input type="number" className="form-input" value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="999" />
                </div>
                <div className="form-group">
                  <label className="form-label">Original Price (₹)</label>
                  <input type="number" className="form-input" value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} placeholder="1499" />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock *</label>
                  <input type="number" className="form-input" value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="100" />
                </div>
                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input className="form-input" value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="Brand name" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="form-input" rows={3} value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Product description..." style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input className="form-input" value={form.images[0]}
                  onChange={(e) => setForm({ ...form, images: [e.target.value] })}
                  placeholder="https://example.com/image.jpg" />
              </div>
              <div className="form-group">
                <label className="featured-check">
                  <input type="checkbox" checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                  <span>Mark as Featured</span>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                <FiCheck size={16} /> {saving ? 'Saving...' : editProduct ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
