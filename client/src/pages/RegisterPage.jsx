import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './AuthPage.css';

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/users/register', {
        name: form.name, email: form.email, password: form.password,
      });
      login(data);
      toast.success(`Welcome to ShopEZ, ${data.name}! 🎉`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
          <h1>Create account</h1>
          <p>Join thousands of happy shoppers</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-icon-wrap">
              <FiUser className="input-icon" size={18} />
              <input type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="John Doe" className="form-input input-with-icon" required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-icon-wrap">
              <FiMail className="input-icon" size={18} />
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" className="form-input input-with-icon" required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-icon-wrap">
              <FiLock className="input-icon" size={18} />
              <input type={showPass ? 'text' : 'password'} name="password"
                value={form.password} onChange={handleChange}
                placeholder="Min. 6 characters"
                className="form-input input-with-icon input-with-right-icon" required />
              <button type="button" className="input-right-icon" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-icon-wrap">
              <FiLock className="input-icon" size={18} />
              <input type="password" name="confirmPassword" value={form.confirmPassword}
                onChange={handleChange} placeholder="Repeat password"
                className="form-input input-with-icon" required />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
