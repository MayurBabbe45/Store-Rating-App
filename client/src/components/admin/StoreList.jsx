import { useState, useEffect, useCallback } from 'react';
import { getStores } from '../../services/adminService';
import { Search, ArrowUp, ArrowDown, Store as StoreIcon } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getStores(filters);
      setStores(response.stores);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleSort = (field) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const renderSortIcon = (field) => {
    if (filters.sortBy !== field) return null;
    return filters.sortOrder === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  if (loading && !stores.length) return <LoadingSpinner />;

  return (
    <div className="bg-base-300 shadow-lg rounded-lg overflow-hidden">
      {/* Search and Filters */}
      <div className="p-4 border-b">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative ">
              <input
                type="text"
                placeholder="Search by name, email, or address..."
                className="input input-bordered w-full pl-10 bg-base-300"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Stores Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th 
                onClick={() => handleSort('name')}
                className="cursor-pointer hover:bg-base-200"
              >
                <div className="flex items-center gap-2">
                  Name {renderSortIcon('name')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('email')}
                className="cursor-pointer hover:bg-base-200"
              >
                <div className="flex items-center gap-2">
                  Email {renderSortIcon('email')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('address')}
                className="cursor-pointer hover:bg-base-200"
              >
                <div className="flex items-center gap-2">
                  Address {renderSortIcon('address')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('rating')}
                className="cursor-pointer hover:bg-base-200"
              >
                <div className="flex items-center gap-2">
                  Rating {renderSortIcon('rating')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {stores.map(store => (
              <tr key={store.id} className="hover">
                <td className="whitespace-normal">
                  <div className="flex items-center gap-2">
                    <StoreIcon className="w-5 h-5 text-primary" />
                    {store.name}
                  </div>
                </td>
                <td>{store.email}</td>
                <td className="whitespace-normal max-w-xs">{store.address}</td>
                <td>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{store.averageRating || 'N/A'}</span>
                    {store.averageRating && (
                      <span className="text-sm text-gray-500">
                        ({store.ratingCount} ratings)
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {!loading && stores.length === 0 && (
        <div className="text-center py-8">
          <StoreIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No stores found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default StoreList;
