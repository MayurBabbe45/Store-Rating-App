import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AlertCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
     
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { user } = await login(formData);
      console.log('Login successful, user:', user);

      // Clear form data on success
      setFormData({ email: '', password: '' });

      // Redirect based on user role
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'user':
          navigate('/stores');
          break;
        case 'store_owner':
          navigate('/owner/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Clear only password on error
      setFormData(prev => ({ ...prev, password: '' }));
      
      // Set appropriate error message
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md shadow-lg bg-base-100 p-8">
        <h2 className="text-3xl font-bold text-center mb-2">Login</h2>
        <p className="text-center mb-6 text-gray-500">Access your account</p>

        {error && (
          <div className="alert alert-error flex items-center mb-4">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              className="input input-bordered w-full"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="input input-bordered w-full"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="divider my-6">OR</div>

        <p className="text-center">
          Don’t have an account?{' '}
          <Link to="/signup" className="link link-primary">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
