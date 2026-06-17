const Loader = ({ size = 40, text = 'Loading...' }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: '1rem', padding: '3rem',
  }}>
    <div style={{
      width: size, height: size,
      border: `3px solid var(--border)`,
      borderTop: `3px solid var(--primary)`,
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    {text && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{text}</p>}
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default Loader;
