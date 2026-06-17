import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">🛍️ Shop<span style={{color:'var(--accent)'}}>EZ</span></div>
          <p className="footer-tagline">Your one-stop destination for effortless online shopping. Quality products, seamless experience.</p>
          <div className="footer-socials">
            <a href="#" className="social-icon"><FiTwitter size={18} /></a>
            <a href="#" className="social-icon"><FiInstagram size={18} /></a>
            <a href="#" className="social-icon"><FiGithub size={18} /></a>
            <a href="#" className="social-icon"><FiMail size={18} /></a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <Link to="/products">All Products</Link>
          <Link to="/products?category=Electronics">Electronics</Link>
          <Link to="/products?category=Fashion">Fashion</Link>
          <Link to="/products?category=Home">Home & Kitchen</Link>
        </div>
        <div className="footer-col">
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/profile">My Profile</Link>
          <Link to="/cart">My Cart</Link>
        </div>
        <div className="footer-col">
          <h4>Support</h4>
          <a href="#">Help Center</a>
          <a href="#">Track Order</a>
          <a href="#">Returns</a>
          <a href="#">Contact Us</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ShopEZ. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
