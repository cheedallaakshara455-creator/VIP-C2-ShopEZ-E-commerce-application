import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiShoppingCart, FiArrowLeft, FiCheck, FiPackage } from 'react-icons/fi';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import StarRating from '../components/StarRating';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [tab, setTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please login first'); navigate('/login'); return; }
    setAddingToCart(true);
    try {
      await addToCart(product._id, quantity);
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleShopNow = async () => {
    if (!user) { navigate('/login'); return; }
    setAddingToCart(true);
    try {
      await addToCart(product._id, quantity);
      navigate('/checkout');
    } catch {
      toast.error('Failed to proceed');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.rating) { toast.error('Please select a rating'); return; }
    setSubmittingReview(true);
    try {
      await api.post(`/products/${id}/reviews`, reviewForm);
      toast.success('Review submitted!');
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      setReviewForm({ rating: 0, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="page"><Loader /></div>;
  if (!product) return null;

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const images = product.images?.length > 0
    ? product.images
    : [`https://picsum.photos/seed/${product._id}/600/500`];

  return (
    <div className="page product-detail-page">
      <div className="container">
        <Link to="/products" className="back-link">
          <FiArrowLeft size={16} /> Back to Products
        </Link>

        <div className="product-detail-grid">
          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="main-image-wrap">
              <img src={images[selectedImg]} alt={product.name} className="main-image" />
              {discount > 0 && <span className="detail-badge-discount">-{discount}%</span>}
            </div>
            {images.length > 1 && (
              <div className="thumbnail-row">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`thumbnail ${selectedImg === i ? 'active' : ''}`}
                    onClick={() => setSelectedImg(i)}
                  >
                    <img src={img} alt={`View ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-detail-info">
            <div className="detail-category">{product.category}</div>
            <h1 className="detail-title">{product.name}</h1>

            <div className="detail-rating">
              <StarRating rating={Math.round(product.rating)} />
              <span className="rating-text">{product.rating?.toFixed(1)} ({product.numReviews} reviews)</span>
            </div>

            <div className="detail-price-row">
              <span className="detail-price">₹{product.price?.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="detail-original">₹{product.originalPrice?.toLocaleString()}</span>
                  <span className="detail-savings badge badge-success">Save {discount}%</span>
                </>
              )}
            </div>

            <div className="detail-stock">
              {product.stock > 0 ? (
                <span className="stock-in"><FiCheck size={14} /> In Stock ({product.stock} available)</span>
              ) : (
                <span className="stock-out">Out of Stock</span>
              )}
            </div>

            {/* Quantity */}
            <div className="quantity-row">
              <label className="form-label">Quantity</label>
              <div className="quantity-control">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="detail-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
              >
                <FiShoppingCart size={20} />
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
              <button
                className="btn btn-accent btn-lg"
                onClick={handleShopNow}
                disabled={addingToCart || product.stock === 0}
              >
                <FiPackage size={20} />
                Shop Now
              </button>
            </div>

            {/* Meta */}
            <div className="detail-meta">
              {product.brand && <div className="meta-row"><span>Brand</span><strong>{product.brand}</strong></div>}
              <div className="meta-row"><span>Category</span><strong>{product.category}</strong></div>
              <div className="meta-row"><span>SKU</span><strong>{product._id?.slice(-8).toUpperCase()}</strong></div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="product-tabs">
          <div className="tab-buttons">
            {['description', 'reviews'].map((t) => (
              <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
                {t === 'reviews' && ` (${product.numReviews})`}
              </button>
            ))}
          </div>

          {tab === 'description' && (
            <div className="tab-content">
              <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)' }}>{product.description}</p>
            </div>
          )}

          {tab === 'reviews' && (
            <div className="tab-content">
              {product.reviews?.length === 0 && (
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>No reviews yet. Be the first to review!</p>
              )}
              <div className="reviews-list">
                {product.reviews?.map((r) => (
                  <div key={r._id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-avatar">{r.name?.charAt(0).toUpperCase()}</div>
                      <div>
                        <strong>{r.name}</strong>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {new Date(r.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div style={{ marginLeft: 'auto' }}>
                        <StarRating rating={r.rating} size={14} />
                      </div>
                    </div>
                    <p className="review-comment">{r.comment}</p>
                  </div>
                ))}
              </div>

              {user && (
                <div className="review-form-wrap">
                  <h3>Write a Review</h3>
                  <form onSubmit={handleReviewSubmit} className="review-form">
                    <div className="form-group">
                      <label className="form-label">Your Rating</label>
                      <StarRating
                        rating={reviewForm.rating}
                        size={24}
                        interactive
                        onRate={(r) => setReviewForm({ ...reviewForm, rating: r })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Comment</label>
                      <textarea
                        className="form-input"
                        rows={4}
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        placeholder="Share your experience with this product..."
                        required
                        style={{ resize: 'vertical' }}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
