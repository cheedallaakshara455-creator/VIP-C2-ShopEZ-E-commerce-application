import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Admin
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';

const PublicLayout = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <main style={{ flex: 1 }}>{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1e293b',
                color: '#F9FAFB',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                fontSize: '0.875rem',
              },
              success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
              error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
            }}
          />
          <Routes>
            {/* Public routes with Navbar + Footer */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/products" element={<PublicLayout><ProductsPage /></PublicLayout>} />
            <Route path="/products/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected user routes */}
            <Route path="/cart" element={<PublicLayout><ProtectedRoute><CartPage /></ProtectedRoute></PublicLayout>} />
            <Route path="/checkout" element={<PublicLayout><ProtectedRoute><CheckoutPage /></ProtectedRoute></PublicLayout>} />
            <Route path="/order-confirmation" element={<PublicLayout><ProtectedRoute><OrderConfirmationPage /></ProtectedRoute></PublicLayout>} />
            <Route path="/profile" element={<PublicLayout><ProtectedRoute><ProfilePage /></ProtectedRoute></PublicLayout>} />

            {/* Admin routes — own layout, no public Navbar/Footer */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={
              <PublicLayout>
                <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', paddingTop: '72px' }}>
                  <h1 style={{ fontSize: '6rem', fontWeight: 900, opacity: 0.2 }}>404</h1>
                  <h2>Page Not Found</h2>
                  <a href="/" className="btn btn-primary">Go Home</a>
                </div>
              </PublicLayout>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
