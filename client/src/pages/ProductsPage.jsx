import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import './ProductsPage.css';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const [search, setSearch] = useState(keyword);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    api.get('/products/categories').then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (keyword) params.set('keyword', keyword);
        if (category) params.set('category', category);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        params.set('page', page);
        params.set('limit', 12);
        const { data } = await api.get(`/products?${params.toString()}`);
        setProducts(data.products || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, category, page, minPrice, maxPrice]);

  const handleSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams(searchParams);
    if (search) p.set('keyword', search); else p.delete('keyword');
    p.set('page', '1');
    setSearchParams(p);
  };

  const setFilter = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    p.set('page', '1');
    setSearchParams(p);
  };

  const clearFilters = () => {
    setSearch(''); setMinPrice(''); setMaxPrice('');
    setSearchParams({});
  };

  const goToPage = (pg) => {
    const p = new URLSearchParams(searchParams);
    p.set('page', pg);
    setSearchParams(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="page products-page">
      <div className="container">
        <div className="products-header">
          <div>
            <h1>All <span className="text-gradient">Products</span></h1>
            <p className="products-count">{total} products found</p>
          </div>
          {/* Search */}
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-input-wrap">
              <FiSearch className="search-icon" size={18} />
              <input
                type="text" value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="form-input search-input"
              />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>

        <div className="products-layout">
          {/* Sidebar Filters */}
          <aside className={`filters-sidebar ${showFilters ? 'filters-open' : ''}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              <button className="btn-ghost btn btn-sm" onClick={clearFilters}>
                <FiX size={14} /> Clear
              </button>
            </div>

            <div className="filter-group">
              <label className="filter-label">Category</label>
              <div className="filter-options">
                <button
                  className={`filter-option ${!category ? 'active' : ''}`}
                  onClick={() => setFilter('category', '')}
                >All</button>
                {categories.map((c) => (
                  <button
                    key={c}
                    className={`filter-option ${category === c ? 'active' : ''}`}
                    onClick={() => setFilter('category', c)}
                  >{c}</button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Price Range (₹)</label>
              <div className="price-range">
                <input
                  type="number" placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="form-input"
                  onBlur={() => setFilter('minPrice', minPrice)}
                />
                <span>—</span>
                <input
                  type="number" placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="form-input"
                  onBlur={() => setFilter('maxPrice', maxPrice)}
                />
              </div>
            </div>
          </aside>

          {/* Products */}
          <div className="products-main">
            <div className="products-toolbar">
              <button
                className="btn btn-ghost btn-sm mobile-filter-btn"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FiFilter size={16} /> Filters <FiChevronDown size={14} />
              </button>
              {(keyword || category) && (
                <div className="active-filters">
                  {keyword && <span className="active-filter">🔍 "{keyword}" <button onClick={() => setFilter('keyword', '')}>×</button></span>}
                  {category && <span className="active-filter">📁 {category} <button onClick={() => setFilter('category', '')}>×</button></span>}
                </div>
              )}
            </div>

            {loading ? (
              <Loader />
            ) : products.length === 0 ? (
              <div className="empty-state" style={{ minHeight: '400px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                <p style={{ fontSize: '3rem' }}>😕</p>
                <h3 style={{ marginBottom: '0.5rem' }}>No products found</h3>
                <p>Try adjusting your filters or search term</p>
                <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={clearFilters}>Clear All Filters</button>
              </div>
            ) : (
              <div className="grid-4">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="pagination">
                {Array.from({ length: pages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    className={`page-btn ${pg === page ? 'active' : ''}`}
                    onClick={() => goToPage(pg)}
                  >{pg}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
