import { useState, useEffect } from 'react';
import { FiUsers, FiShoppingBag, FiPackage, FiDollarSign, FiTrendingUp, FiActivity } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../../utils/api';
import Loader from '../../components/Loader';
import './AdminDashboard.css';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const PIE_COLORS = ['#2563EB','#10B981','#F59E0B','#EF4444','#7C3AED'];

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="stat-card" style={{ '--sc-color': color }}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-info">
      <p className="stat-label">{label}</p>
      <h3 className="stat-value">{value}</h3>
      {sub && <p className="stat-sub">{sub}</p>}
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const chartData = (stats?.monthlyRevenue || []).map((m) => ({
    name: MONTHS[m._id.month - 1],
    revenue: Math.round(m.revenue),
    orders: m.orders,
  }));

  const pieData = (stats?.orderStatusDist || []).map((s) => ({
    name: s._id, value: s.count,
  }));

  return (
    <div className="admin-dashboard">
      <div className="admin-section-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <StatCard
          icon={<FiDollarSign size={24} />}
          label="Total Revenue"
          value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`}
          sub="All time"
          color="#2563EB"
        />
        <StatCard
          icon={<FiPackage size={24} />}
          label="Total Orders"
          value={stats?.totalOrders || 0}
          sub="Across all users"
          color="#10B981"
        />
        <StatCard
          icon={<FiShoppingBag size={24} />}
          label="Total Products"
          value={stats?.totalProducts || 0}
          sub="In catalog"
          color="#F59E0B"
        />
        <StatCard
          icon={<FiUsers size={24} />}
          label="Total Users"
          value={stats?.totalUsers || 0}
          sub="Registered"
          color="#7C3AED"
        />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Revenue Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3><FiTrendingUp size={18} /> Monthly Revenue</h3>
            <span className="chart-period">Last 6 months</span>
          </div>
          {chartData.length === 0 ? (
            <div className="chart-empty">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#6B7280" tick={{ fontSize: 12 }} />
                <YAxis stroke="#6B7280" tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  labelStyle={{ color: '#F9FAFB' }}
                  formatter={(v) => [`₹${v.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Order Status Pie */}
        <div className="chart-card">
          <div className="chart-header">
            <h3><FiActivity size={18} /> Order Status</h3>
          </div>
          {pieData.length === 0 ? (
            <div className="chart-empty">No orders yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                  paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ fontSize: '0.8rem', color: '#9CA3AF' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
