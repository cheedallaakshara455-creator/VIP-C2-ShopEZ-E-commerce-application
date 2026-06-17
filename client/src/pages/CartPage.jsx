import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleRemove = async (productId, name) => {
    try {
      await removeFromCart(productId);
      toast.success(`${name} removed from cart`);
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleQuantity = async (productId, newQty) => {
    if (newQty < 1) return;
    try { await updateQuantity(productId, newQty); }
    catch { toast.error('Failed to update quantity'); }
  };

  const shipping = cartTotal > 499 ? 0 : 49;
  const total = cartTotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="page cart-empty-page">
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet. Start shopping!</p>
          <Link to="/products" className="btn btn-primary btn-lg" style={{ marginTop: '1.5rem' }}>
            <FiShoppingBag size={20} /> Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page cart-page">
      <div className="container">
        <div className="page-header">
          <h1>Shopping <span className="text-gradient">Cart</span></h1>
          <p>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.product} className="cart-item animate-fadeUp">
                <div className="cart-item-image">
                  <img
                    src={item.image || `https://picsum.photos/seed/${item.product}/120/120`}
                    alt={item.name}
                  />
                </div>
                <div className="cart-item-info">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-price">₹{item.price?.toLocaleString()} each</p>
                </div>
                <div className="cart-item-qty">
                  <button
                    className="qty-btn"
                    onClick={() => handleQuantity(item.product, item.quantity - 1)}
                  ><FiMinus size={14} /></button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => handleQuantity(item.product, item.quantity + 1)}
                  ><FiPlus size={14} /></button>
                </div>
                <div className="cart-item-subtotal">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </div>
                <button
                  className="cart-remove-btn"
                  onClick={() => handleRemove(item.product, item.name)}
                  title="Remove"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="cart-summary card">
            <h3 className="summary-title">Order Summary</h3>
            <div className="divider" />
            <div className="summary-row">
              <span>Subtotal ({cartItems.reduce((a, i) => a + i.quantity, 0)} items)</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className={shipping === 0 ? 'text-success' : ''}>
                {shipping === 0 ? 'FREE' : `₹${shipping}`}
              </span>
            </div>
            {shipping > 0 && (
              <p className="free-shipping-hint">
                Add ₹{(499 - cartTotal).toLocaleString()} more for free shipping!
              </p>
            )}
            <div className="divider" />
            <div className="summary-total">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <button
              className="btn btn-primary btn-block btn-lg"
              style={{ marginTop: '1.25rem' }}
              onClick={() => navigate('/checkout', { state: { cartItems, subtotal: cartTotal, shipping, total } })}
            >
              Proceed to Checkout <FiArrowRight size={20} />
            </button>
            <Link to="/products" className="btn btn-ghost btn-block" style={{ marginTop: '0.75rem' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
