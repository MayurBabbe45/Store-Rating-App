import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { AlertCircle } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
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
      const response = await signup(formData);
      login(response.user, response.token);
      navigate('/stores');
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.message ||
        'Signup failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md shadow-lg bg-base-100 p-8">
        <h2 className="text-3xl font-bold text-center mb-2">Sign Up</h2>
        <p className="text-center mb-6 text-gray-500">Create your account</p>

        {error && (
          <div className="alert alert-error flex items-center mb-4">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="John Doe (20-60 characters)"
              className="input input-bordered w-full"
              value={formData.name}
              onChange={handleChange}
              required
              minLength={20}
              maxLength={60}
            />
          </div>

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
              placeholder="8-16 chars, 1 uppercase, 1 special"
              className="input input-bordered w-full"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              maxLength={16}
            />
          </div>

          {/* Address */}
          <div>
            <label className="label">
              <span className="label-text">Address (Optional)</span>
            </label>
            <textarea
              name="address"
              placeholder="Your address (max 400 characters)"
              className="textarea textarea-bordered w-full h-20"
              value={formData.address}
              onChange={handleChange}
              maxLength={400}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="divider my-6">OR</div>

        <p className="text-center">
          Already have an account?{' '}
          <Link to="/login" className="link link-primary">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
