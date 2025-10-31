import { useState, useEffect, useCallback } from 'react';
import { getUsers } from '../../services/adminService';
import { Search, ArrowUp, ArrowDown, User } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getUsers(filters);
      setUsers(response.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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

  if (loading && !users.length) return <LoadingSpinner />;

  return (
    <div className="bg-base-300 shadow-lg rounded-lg overflow-hidden">
      {/* Search and Filters */}
      <div className="p-4 border-b">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email, or address..."
                className="input input-bordered w-full pl-10"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <select
            className="select select-bordered"
            value={filters.role}
            onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
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
                onClick={() => handleSort('role')}
                className="cursor-pointer hover:bg-base-200"
              >
                <div className="flex items-center gap-2">
                  Role {renderSortIcon('role')}
                </div>
              </th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="hover">
                <td className="whitespace-normal">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    {user.name}
                  </div>
                </td>
                <td>{user.email}</td>
                <td className="whitespace-normal max-w-xs">{user.address}</td>
                <td>
                  <span className={`badge ${
                    user.role === 'admin' ? 'badge-primary' :
                    user.role === 'store_owner' ? 'badge-secondary' :
                    'badge-ghost'
                  }`}>
                    {user.role.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  {user.role === 'store_owner' ? (
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{user.storeRating || 'N/A'}</span>
                      {user.storeRating && (
                        <span className="text-sm text-gray-500">
                          ({user.ratingCount} ratings)
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {!loading && users.length === 0 && (
        <div className="text-center py-8">
          <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default UserList;
