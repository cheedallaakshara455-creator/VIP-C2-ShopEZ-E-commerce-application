import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiPackage, FiGrid } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container flex-between" style={{ height: '72px' }}>
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🛍️</span>
          <span className="logo-text">Shop<span className="logo-accent">EZ</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          {isAdmin && <Link to="/admin" className="nav-link nav-link-admin">Admin</Link>}
        </div>

        {/* Right actions */}
        <div className="navbar-actions">
          {user && (
            <Link to="/cart" className="cart-btn">
              <FiShoppingCart size={22} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          )}

          {user ? (
            <div className="user-dropdown" ref={dropRef}>
              <button className="user-avatar-btn" onClick={() => setDropOpen(!dropOpen)}>
                <div className="avatar-circle">{user.name?.charAt(0).toUpperCase()}</div>
                <span className="user-name-label">{user.name?.split(' ')[0]}</span>
              </button>
              {dropOpen && (
                <div className="dropdown-menu animate-fadeIn">
                  <div className="dropdown-header">
                    <p className="dropdown-name">{user.name}</p>
                    <p className="dropdown-email">{user.email}</p>
                  </div>
                  <div className="dropdown-divider" />
                  <Link to="/profile" className="dropdown-item" onClick={() => setDropOpen(false)}>
                    <FiUser size={16} /> My Profile
                  </Link>
                  <Link to="/profile" className="dropdown-item" onClick={() => setDropOpen(false)}>
                    <FiPackage size={16} /> My Orders
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="dropdown-item" onClick={() => setDropOpen(false)}>
                      <FiGrid size={16} /> Admin Panel
                    </Link>
                  )}
                  <div className="dropdown-divider" />
                  <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                    <FiLogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu animate-fadeIn">
          <Link to="/" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Products</Link>
          {user ? (
            <>
              <Link to="/cart" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Cart {cartCount > 0 && `(${cartCount})`}</Link>
              <Link to="/profile" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Profile</Link>
              {isAdmin && <Link to="/admin" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Admin</Link>}
              <button className="mobile-nav-link mobile-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
