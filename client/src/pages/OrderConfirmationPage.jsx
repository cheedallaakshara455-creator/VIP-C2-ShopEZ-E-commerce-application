import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiTruck, FiHome } from 'react-icons/fi';
import './OrderConfirmationPage.css';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const order = location.state?.order;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (!order) {
    return (
      <div className="page" style={{ display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'1rem' }}>
        <h2>No order data found</h2>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="page confirmation-page">
      <div className="container">
        <div className="confirmation-card animate-fadeUp">
          {/* Success Icon */}
          <div className="success-icon-wrap">
            <div className="success-icon">
              <FiCheckCircle size={56} />
            </div>
            <div className="success-ripple" />
          </div>

          <h1 className="confirmation-title">Order Placed! 🎉</h1>
          <p className="confirmation-sub">
            Thank you for your purchase! Your order has been received and is being processed.
          </p>

          <div className="order-id-badge">
            Order ID: <strong>#{order._id?.slice(-10).toUpperCase()}</strong>
          </div>

          {/* Order Timeline */}
          <div className="order-timeline">
            <div className="timeline-step done">
              <div className="timeline-icon"><FiCheckCircle size={20} /></div>
              <div className="timeline-info">
                <strong>Order Confirmed</strong>
                <span>Just now</span>
              </div>
            </div>
            <div className="timeline-line" />
            <div className="timeline-step pending">
              <div className="timeline-icon"><FiPackage size={20} /></div>
              <div className="timeline-info">
                <strong>Processing</strong>
                <span>1-2 hours</span>
              </div>
            </div>
            <div className="timeline-line" />
            <div className="timeline-step pending">
              <div className="timeline-icon"><FiTruck size={20} /></div>
              <div className="timeline-info">
                <strong>Shipped</strong>
                <span>1-2 days</span>
              </div>
            </div>
            <div className="timeline-line" />
            <div className="timeline-step pending">
              <div className="timeline-icon"><FiHome size={20} /></div>
              <div className="timeline-info">
                <strong>Delivered</strong>
                <span>2-3 days</span>
              </div>
            </div>
          </div>

          {/* Order Details Grid */}
          <div className="confirmation-details">
            <div className="detail-box">
              <h4>📍 Shipping To</h4>
              <p><strong>{order.shippingAddress?.fullName}</strong></p>
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
              <p>{order.shippingAddress?.phone}</p>
            </div>
            <div className="detail-box">
              <h4>💳 Payment</h4>
              <p><strong>{order.paymentMethod}</strong></p>
              <p>Status: <span className="badge badge-warning">{order.paymentStatus}</span></p>
            </div>
            <div className="detail-box">
              <h4>💰 Order Total</h4>
              <div className="price-breakdown">
                <div><span>Items</span><span>₹{order.itemsPrice?.toLocaleString()}</span></div>
                <div><span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span></div>
                <div className="total-line"><span><strong>Total</strong></span><span><strong>₹{order.totalPrice?.toLocaleString()}</strong></span></div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="confirmation-items">
            <h3>Items Ordered ({order.items?.length})</h3>
            <div className="items-list">
              {order.items?.map((item, i) => (
                <div key={i} className="conf-item">
                  <img
                    src={item.image || `https://picsum.photos/seed/${item.product}/60/60`}
                    alt={item.name}
                  />
                  <div className="conf-item-info">
                    <p className="conf-item-name">{item.name}</p>
                    <p className="conf-item-qty">Qty: {item.quantity}</p>
                  </div>
                  <span className="conf-item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="confirmation-actions">
            <Link to="/profile" className="btn btn-primary btn-lg">
              <FiPackage size={20} /> View My Orders
            </Link>
            <Link to="/products" className="btn btn-outline btn-lg">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
