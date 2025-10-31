import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { submitRating } from '../../services/storeService';

const RatingModal = ({ storeId, currentRating, onClose, onSuccess }) => {
  const [rating, setRating] = useState(currentRating || 0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = async () => {
    if (!rating) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await submitRating({ storeId, ratingValue: rating });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">Rate this Store</h3>
            <p className="text-gray-600">Select 1 to 5 stars to rate</p>
          </div>

          {/* Stars */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                className="btn btn-ghost btn-lg p-2"
                onMouseEnter={() => setHover(value)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(value)}
              >
                <Star
                  className={`w-8 h-8 ${
                    value <= (hover || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>

          {error && (
            <div className="alert alert-error text-sm mb-4">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button 
              className="btn btn-ghost" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className={`btn btn-primary ${loading ? 'loading' : ''}`}
              onClick={handleSubmit}
              disabled={loading}
            >
              Submit Rating
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
