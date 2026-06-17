import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers,
  FiLogOut, FiHome, FiMenu, FiX
} from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const NAV_ITEMS = [
  { to: '/admin', icon: <FiGrid size={18} />, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: <FiShoppingBag size={18} />, label: 'Products' },
  { to: '/admin/orders', icon: <FiPackage size={18} />, label: 'Orders' },
  { to: '/admin/users', icon: <FiUsers size={18} />, label: 'Users' },
];

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <span>🛍️</span>
            <span>Shop<span className="logo-ez">EZ</span> <span className="admin-tag">Admin</span></span>
          </div>
          <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
            <FiX size={20} />
          </button>
        </div>

        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <NavLink to="/" className="admin-nav-item">
            <FiHome size={18} /> <span>View Store</span>
          </NavLink>
          <button className="admin-nav-item admin-logout" onClick={handleLogout}>
            <FiLogOut size={18} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="admin-main">
        <header className="admin-topbar">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>
            <FiMenu size={22} />
          </button>
          <h2 className="admin-page-title">Admin Panel</h2>
          <div className="admin-user-badge">
            <div className="admin-avatar">A</div>
          </div>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
