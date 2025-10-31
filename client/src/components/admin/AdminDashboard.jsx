import { useState, useEffect } from 'react';
import { getDashboard } from '../../services/adminService';
import { Users, Store, Star, Plus, Search } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import AddUserForm from './AddUserForm';
import AddStoreForm from './AddStoreForm';
import UserList from './UserList';
import StoreList from './StoreList';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await getDashboard();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    fetchDashboard();
    setShowAddUser(false);
    setShowAddStore(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <div className="flex gap-2">
          {activeTab === 'users' && (
            <button 
              className="btn btn-primary" 
              onClick={() => setShowAddUser(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </button>
          )}
          {activeTab === 'stores' && (
            <button 
              className="btn btn-primary" 
              onClick={() => setShowAddStore(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Store
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tabs tabs-boxed mb-6 flex justify-center gap-4">
        <button 
          className={`btn btn-soft btn-primary bg-base-300 p-4 ${activeTab === 'overview' ? 'btn-active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`btn btn-soft btn-primary bg-base-300 p-4 ${activeTab === 'users' ? 'btn-active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={`btn btn-soft btn-primary bg-base-300 p-4 ${activeTab === 'stores' ? 'btn-active' : ''}`}
          onClick={() => setActiveTab('stores')}
        >
          Stores
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Total Users */}
          <div className="bg-base-300 shadow rounded-xl p-5 flex flex-col items-center">
            <Users className="w-10 h-10 text-blue-600 mb-2" />
            <p className="text-gray-600 font-medium">Total Users</p>
            <h3 className="text-2xl font-bold mt-1">{stats?.totalUsers || 0}</h3>
          </div>

          {/* Total Stores */}
          <div className="bg-base-300  shadow rounded-xl p-5 flex flex-col items-center">
            <Store className="w-10 h-10 text-green-600 mb-2" />
            <p className="text-gray-600 font-medium">Total Stores</p>
            <h3 className="text-2xl font-bold mt-1">{stats?.totalStores || 0}</h3>
          </div>

          {/* Total Ratings */}
          <div className="bg-base-300  shadow rounded-xl p-5 flex flex-col items-center">
            <Star className="w-10 h-10 text-yellow-500 mb-2" />
            <p className="text-gray-600 font-medium">Total Ratings</p>
            <h3 className="text-2xl font-bold mt-1">{stats?.totalRatings || 0}</h3>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <>
          {showAddUser ? (
            <div className="mb-6">
              <AddUserForm onSuccess={handleSuccess} />
            </div>
          ) : (
            <UserList onRefresh={fetchDashboard} />
          )}
        </>
      )}

      {/* Stores Tab */}
      {activeTab === 'stores' && (
        <>
          {showAddStore ? (
            <div className="mb-6">
              <AddStoreForm onSuccess={handleSuccess} />
            </div>
          ) : (
            <StoreList onRefresh={fetchDashboard} />
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
