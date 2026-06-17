import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiTruck, FiHeadphones, FiRefreshCw } from 'react-icons/fi';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import './HomePage.css';

const CATEGORIES = [
  { name: 'Electronics', emoji: '📱', color: '#2563EB' },
  { name: 'Fashion', emoji: '👗', color: '#7C3AED' },
  { name: 'Home', emoji: '🏠', color: '#059669' },
  { name: 'Sports', emoji: '⚽', color: '#DC2626' },
  { name: 'Books', emoji: '📚', color: '#D97706' },
  { name: 'Beauty', emoji: '💄', color: '#DB2777' },
];

const FEATURES = [
  { icon: <FiTruck size={28} />, title: 'Free Delivery', desc: 'On orders above ₹499' },
  { icon: <FiShield size={28} />, title: 'Secure Payment', desc: '100% secure transactions' },
  { icon: <FiRefreshCw size={28} />, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: <FiHeadphones size={28} />, title: '24/7 Support', desc: 'Round-the-clock help' },
];

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/products/featured');
        setFeatured(data);
      } catch {
        // Fetch first 8 products as fallback
        try {
          const { data } = await api.get('/products?limit=8');
          setFeatured(data.products || []);
        } catch { /* empty */ }
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="home-page">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg-orbs">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <div className="container hero-content">
          <div className="hero-text animate-fadeUp">
            <span className="hero-badge">✨ New Arrivals Every Week</span>
            <h1>
              Shop Easy,<br />
              Live <span className="text-gradient">Happy</span>
            </h1>
            <p className="hero-subtitle">
              Discover thousands of products across every category. Unbeatable prices,
              lightning-fast delivery, and a shopping experience like no other.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                Shop Now <FiArrowRight size={20} />
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg">
                Join Free
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="stat-num">50K+</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="stat-divider" />
              <div className="hero-stat">
                <span className="stat-num">1M+</span>
                <span className="stat-label">Happy Shoppers</span>
              </div>
              <div className="stat-divider" />
              <div className="hero-stat">
                <span className="stat-num">4.9★</span>
                <span className="stat-label">Rating</span>
              </div>
            </div>
          </div>
          <div className="hero-visual animate-fadeUp">
            <div className="hero-image-card">
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=500&fit=crop"
                alt="Shopping"
                className="hero-image"
              />
              <div className="floating-card card-1">
                <span>🚀</span>
                <div>
                  <p className="fc-title">Fast Delivery</p>
                  <p className="fc-sub">2-3 days</p>
                </div>
              </div>
              <div className="floating-card card-2">
                <span>🎉</span>
                <div>
                  <p className="fc-title">New Order!</p>
                  <p className="fc-sub">₹2,499 saved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features-bar">
        <div className="container">
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-item">
                <div className="feature-icon">{f.icon}</div>
                <div>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Shop by <span className="text-gradient">Category</span></h2>
            <p>Find exactly what you're looking for across our curated collections</p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name}`}
                className="category-card"
                style={{ '--cat-color': cat.color }}
              >
                <span className="cat-emoji">{cat.emoji}</span>
                <h3>{cat.name}</h3>
                <span className="cat-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-heading">
            <h2>Featured <span className="text-gradient">Products</span></h2>
            <p>Handpicked deals and top-rated items just for you</p>
          </div>
          {loading ? (
            <Loader />
          ) : featured.length === 0 ? (
            <div className="empty-state">
              <p>No products yet. Add some via the Admin panel!</p>
              <Link to="/admin" className="btn btn-primary" style={{ marginTop: '1rem' }}>Go to Admin</Link>
            </div>
          ) : (
            <div className="grid-4">
              {featured.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/products" className="btn btn-outline btn-lg">
              View All Products <FiArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-content">
            <div>
              <h2>Ready to start shopping?</h2>
              <p>Create your free account and unlock exclusive deals today.</p>
            </div>
            <Link to="/register" className="btn btn-accent btn-lg">
              Get Started Free <FiArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
