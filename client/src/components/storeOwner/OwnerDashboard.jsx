import { useState, useEffect } from 'react';
import { getOwnerDashboard } from '../../services/storeService';
import { Star, Users } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const OwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await getOwnerDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const { store, ratings } = dashboardData || {};

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Store Owner Dashboard</h1>

      {/* Store Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-base-300 p-5 shadow rounded-xl flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Average Rating</p>
            <h2 className="text-2xl font-semibold">
              {store?.averageRating || 'N/A'}
            </h2>
          </div>
          <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
        </div>

        <div className="bg-base-300 p-5 shadow rounded-xl flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Total Ratings</p>
            <h2 className="text-2xl font-semibold">{store?.ratingCount || 0}</h2>
          </div>
          <Users className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      {/* Ratings Table Section */}
      <div className="bg-base-300 shadow rounded-xl p-5">
        <h2 className="text-2xl font-semibold mb-4">Customer Ratings</h2>

        {ratings && ratings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Rating</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map((rating) => (
                  <tr key={rating.id}>
                    <td>{rating.userName}</td>
                    <td>{rating.userEmail}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{rating.ratingValue}</span>
                      </div>
                    </td>
                    <td>{new Date(rating.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center mt-4">
            <p className="text-gray-500 text-lg">No ratings yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
