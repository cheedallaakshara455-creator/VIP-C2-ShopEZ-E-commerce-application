import { FiStar } from 'react-icons/fi';

const StarRating = ({ rating, size = 18, interactive = false, onRate }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {stars.map((star) => (
        <FiStar
          key={star}
          size={size}
          style={{
            fill: star <= rating ? 'var(--accent)' : 'none',
            color: star <= rating ? 'var(--accent)' : 'var(--text-muted)',
            cursor: interactive ? 'pointer' : 'default',
            transition: 'all 0.2s',
          }}
          onClick={() => interactive && onRate && onRate(star)}
        />
      ))}
    </div>
  );
};

export default StarRating;
