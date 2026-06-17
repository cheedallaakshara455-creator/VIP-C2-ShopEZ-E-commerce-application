import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './AuthPage.css';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/users/login', form);
      login(data);
      toast.success(`Welcome back, ${data.name}! 🎉`);
      navigate(data.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-pattern" />
      <div className="auth-container animate-fadeUp">
        <div className="auth-header">
          <Link to="/" className="auth-logo">🛍️ Shop<span>EZ</span></Link>
          <h1>Welcome back</h1>
          <p>Sign in to your account to continue</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-icon-wrap">
              <FiMail className="input-icon" size={18} />
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="you@example.com"
                className="form-input input-with-icon" required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-icon-wrap">
              <FiLock className="input-icon" size={18} />
              <input
                type={showPass ? 'text' : 'password'} name="password"
                value={form.password} onChange={handleChange}
                placeholder="Enter your password"
                className="form-input input-with-icon input-with-right-icon" required
              />
              <button type="button" className="input-right-icon" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Create one</Link></p>
        </div>

        {/* Demo credentials hint */}
        {/* <div className="demo-hint">
          <p>🔐 Demo Admin: <code>admin@shopez.com</code> / <code>admin123</code></p>
        </div> */}
      </div>
    </div>
  );
};

export default LoginPage;
