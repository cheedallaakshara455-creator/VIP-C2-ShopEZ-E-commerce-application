import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar, FiEye } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to add items to cart'); return; }
    try {
      await addToCart(product._id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discount;

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-image-wrap">
        <img
          src={product.images?.[0] || `https://picsum.photos/seed/${product._id}/400/300`}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        {discount > 0 && (
          <span className="product-badge-discount">-{discount}%</span>
        )}
        <div className="product-overlay">
          <button className="overlay-btn" title="Quick View">
            <FiEye size={18} />
          </button>
        </div>
      </div>
      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          <FiStar className="star-icon" size={14} />
          <span>{product.rating?.toFixed(1) || '0.0'}</span>
          <span className="review-count">({product.numReviews || 0})</span>
        </div>
        <div className="product-footer">
          <div className="product-price">
            <span className="price-current">₹{product.price?.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="price-original">₹{product.originalPrice?.toLocaleString()}</span>
            )}
          </div>
          <button className="add-cart-btn" onClick={handleAddToCart} title="Add to Cart">
            <FiShoppingCart size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
