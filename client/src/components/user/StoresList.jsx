import { useState, useEffect, useCallback } from 'react';
import { getStores, submitRating } from '../../services/storeService';
import { Search, Star } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const StoresList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchStores = useCallback(async () => {
    try {
      const data = await getStores({ search, sortBy, sortOrder });
      setStores(data.stores);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, sortOrder]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleRating = async (storeId, ratingValue) => {
    try {
      await submitRating({ storeId, ratingValue });
      fetchStores(); // Refresh list after submitting rating
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const renderStars = (storeId, currentRating) => {
    return [1, 2, 3, 4, 5].map((value) => (
      <button
        key={value}
        onClick={() => handleRating(storeId, value)}
        className="btn btn-ghost btn-xs p-0"
      >
        <Star
          className={`w-5 h-5 ${
            value <= currentRating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          }`}
        />
      </button>
    ));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Browse Stores</h1>

      {/* Search & Sort Section */}
      <div className="flex flex-wrap items-center gap-4 mb-6 pl-4">
        <div className="flex items-center w-full sm:w-auto p-4">
          <input
            type="text"
            placeholder="Search by name or address..."
            className="input input-bordered w-full sm:w-80 bg-base-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-square ml-2 bg-base-300 " >
            <Search className="w-5 h-5" />
          </button>
        </div>

        <select
          className="select select-bordered bg-base-300 pl-4"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">Sort by Name</option>
          <option value="address">Sort by Address</option>
          <option value="rating">Sort by Rating</option>
        </select>

        <select
          className="select select-bordered bg-base-300 pl-4"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {stores.map((store) => (
          <div
            key={store.id}
            className="bg-base-300 shadow rounded-xl p-6 flex flex-col justify-between"
          >
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-1">{store.name}</h2>
              <p className="text-gray-600 mb-3">{store.address}</p>
            </div>

            {/* Average Rating */}
            <div className="flex items-center justify-between mb-3 p-4">
              <div>
                <p className="text-sm text-gray-500">Average Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{store.averageRating || 'N/A'}</span>
                  <span className="text-xs text-gray-500">
                    ({store.ratingCount} ratings)
                  </span>
                </div>
              </div>
            </div>

            {/* User Rating */}
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-1">Your Rating</p>
              <div className="flex">{renderStars(store.id, store.userRating)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* No Stores Found */}
      {stores.length === 0 && (
        <div className="text-center mt-10 p-6">
          <p className="text-gray-500 text-lg">No stores found</p>
        </div>
      )}
    </div>
  );
};

export default StoresList;