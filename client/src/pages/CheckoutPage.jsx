import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiMapPin, FiCreditCard, FiPackage } from 'react-icons/fi';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

const PAYMENT_METHODS = [
  { id: 'COD', label: 'Cash on Delivery', icon: '💵' },
  { id: 'Card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'UPI', label: 'UPI Payment', icon: '📱' },
  { id: 'NetBanking', label: 'Net Banking', icon: '🏦' },
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, cartTotal, clearCart } = useCart();

  const passedState = location.state || {};
  const items = passedState.cartItems || cartItems;
  const subtotal = passedState.subtotal || cartTotal;
  const shipping = passedState.shipping ?? (subtotal > 499 ? 0 : 49);
  const total = passedState.total || subtotal + shipping;

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    fullName: '', street: '', city: '', state: '', zipCode: '', country: 'India', phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placing, setPlacing] = useState(false);

  const handleAddressChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const orderItems = items.map((item) => ({
        product: item.product,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      }));
      const { data } = await api.post('/orders', {
        items: orderItems,
        shippingAddress: address,
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        totalPrice: total,
      });
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate('/order-confirmation', { state: { order: data } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  const isAddressValid = address.fullName && address.street && address.city && address.state && address.zipCode && address.phone;

  return (
    <div className="page checkout-page">
      <div className="container">
        <div className="page-header">
          <h1>Secure <span className="text-gradient">Checkout</span></h1>
        </div>

        {/* Progress steps */}
        <div className="checkout-steps">
          {[{ n: 1, label: 'Shipping', icon: <FiMapPin size={16} /> },
            { n: 2, label: 'Payment', icon: <FiCreditCard size={16} /> },
            { n: 3, label: 'Review', icon: <FiPackage size={16} /> }].map((s) => (
            <div key={s.n} className={`step-item ${step >= s.n ? 'active' : ''} ${step > s.n ? 'done' : ''}`}>
              <div className="step-circle">{step > s.n ? '✓' : s.n}</div>
              <span>{s.label}</span>
              {s.n < 3 && <div className={`step-line ${step > s.n ? 'done' : ''}`} />}
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          <div className="checkout-main">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="card animate-fadeIn">
                <h3 style={{ marginBottom: '1.5rem' }}><FiMapPin /> Shipping Address</h3>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input name="fullName" value={address.fullName} onChange={handleAddressChange}
                      className="form-input" placeholder="John Doe" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input name="phone" value={address.phone} onChange={handleAddressChange}
                      className="form-input" placeholder="+91 98765 43210" required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Street Address *</label>
                  <input name="street" value={address.street} onChange={handleAddressChange}
                    className="form-input" placeholder="123 Main Street, Apt 4B" required />
                </div>
                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input name="city" value={address.city} onChange={handleAddressChange}
                      className="form-input" placeholder="Hyderabad" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <input name="state" value={address.state} onChange={handleAddressChange}
                      className="form-input" placeholder="Telangana" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ZIP Code *</label>
                    <input name="zipCode" value={address.zipCode} onChange={handleAddressChange}
                      className="form-input" placeholder="500001" required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <select name="country" value={address.country} onChange={handleAddressChange} className="form-select">
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
                <button
                  className="btn btn-primary btn-lg"
                  disabled={!isAddressValid}
                  onClick={() => setStep(2)}
                  style={{ marginTop: '0.5rem' }}
                >Continue to Payment</button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="card animate-fadeIn">
                <h3 style={{ marginBottom: '1.5rem' }}><FiCreditCard /> Payment Method</h3>
                <div className="payment-options">
                  {PAYMENT_METHODS.map((pm) => (
                    <label key={pm.id} className={`payment-option ${paymentMethod === pm.id ? 'selected' : ''}`}>
                      <input
                        type="radio" name="payment" value={pm.id}
                        checked={paymentMethod === pm.id}
                        onChange={() => setPaymentMethod(pm.id)}
                      />
                      <span className="pm-icon">{pm.icon}</span>
                      <span className="pm-label">{pm.label}</span>
                      <span className="pm-check">{paymentMethod === pm.id ? '✓' : ''}</span>
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn btn-primary btn-lg" onClick={() => setStep(3)}>Review Order</button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="card animate-fadeIn">
                <h3 style={{ marginBottom: '1.5rem' }}><FiPackage /> Review Your Order</h3>
                <div className="review-section">
                  <div className="review-block">
                    <div className="review-block-header">
                      <span>📍 Shipping To</span>
                      <button className="btn btn-ghost btn-sm" onClick={() => setStep(1)}>Edit</button>
                    </div>
                    <p>{address.fullName} • {address.phone}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      {address.street}, {address.city}, {address.state} {address.zipCode}, {address.country}
                    </p>
                  </div>
                  <div className="review-block">
                    <div className="review-block-header">
                      <span>💳 Payment</span>
                      <button className="btn btn-ghost btn-sm" onClick={() => setStep(2)}>Edit</button>
                    </div>
                    <p>{PAYMENT_METHODS.find(p => p.id === paymentMethod)?.label}</p>
                  </div>
                </div>
                <div className="review-items">
                  {items.map((item) => (
                    <div key={item.product} className="review-item">
                      <img
                        src={item.image || `https://picsum.photos/seed/${item.product}/60/60`}
                        alt={item.name}
                      />
                      <div className="review-item-info">
                        <p className="review-item-name">{item.name}</p>
                        <p className="review-item-qty">Qty: {item.quantity}</p>
                      </div>
                      <span className="review-item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
                  <button
                    className="btn btn-accent btn-lg"
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    style={{ flex: 1 }}
                  >
                    {placing ? 'Placing Order...' : '🎉 Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="checkout-summary card">
            <h3 style={{ marginBottom: '1rem' }}>Order Summary</h3>
            <div className="divider" />
            {items.slice(0, 3).map((item) => (
              <div key={item.product} className="summary-mini-item">
                <span className="mini-item-name">{item.name} × {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            {items.length > 3 && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>+{items.length - 3} more items</p>}
            <div className="divider" />
            <div className="summary-row-sm"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
            <div className="summary-row-sm"><span>Shipping</span><span style={{ color: shipping === 0 ? 'var(--success)' : '' }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
            <div className="divider" />
            <div className="summary-total-sm"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
