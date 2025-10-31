import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User, ShoppingBag, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'user':
        return '/stores';
      case 'store_owner':
        return '/owner/dashboard';
      default:
        return '/';
    }
  };

  return (
    <div className="navbar bg-primary shadow-sm px-6">
      <div className="flex-1">
        <Link to="/stores" className=" normal-case text-xl flex items-center">
          <ShoppingBag className="w-6 h-6 mr-2" />
          Store Rating Platform
        </Link>
      </div>

      <div className="flex-none">
        {isAuthenticated ? (
          <>
            <Link to={getDashboardLink()} className="btn btn-ghost">
              <LayoutDashboard className="w-5 h-5 mr-2" />
              Dashboard
            </Link>

            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full flex items-center justify-center bg-gray-200">
                  <User className="w-6 h-6 text-gray-700" />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li className="mb-2 text-sm">
                  <span className="font-semibold">{user?.name}</span>
                  <span className="text-gray-500 capitalize">{user?.role.replace('_', ' ')}</span>
                </li>
                <li>
                  <Link to="/change-password">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Change Password
                    </span>
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="flex items-center">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
