import { useState } from 'react';
import { createUser } from '../../services/adminService';
import { AlertCircle, User, Mail, Lock, MapPin, UserCog } from 'lucide-react';

const AddUserForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setError('Please fill in all required fields');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(.{8,16})$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must be 8-16 characters with at least one uppercase letter and one special character');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    try {
      await createUser(formData);
      setFormData({
        name: '',
        email: '',
        password: '',
        address: '',
        role: 'user'
      });
      onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.message ||
        'Failed to add user'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-300 shadow-lg rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <UserCog className="w-6 h-6 mr-2" />
        Add New User
      </h2>
      
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
            <span className="label-text flex items-center">
              <User className="w-4 h-4 mr-2" />
              Name*
            </span>
          </label>
          <input
            type="text"
            name="name"
            className="input input-bordered w-full"
            value={formData.name}
            onChange={handleChange}
            required
            maxLength={60}
          />
        </div>

        {/* Email */}
        <div>
          <label className="label">
            <span className="label-text flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Email*
            </span>
          </label>
          <input
            type="email"
            name="email"
            className="input input-bordered w-full"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="label">
            <span className="label-text flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              Password*
            </span>
          </label>
          <input
            type="password"
            name="password"
            className="input input-bordered w-full"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
            maxLength={16}
          />
          <label className="label">
            <span className="label-text-alt text-gray-500">
              8-16 characters, 1 uppercase letter, 1 special character
            </span>
          </label>
        </div>

        {/* Address */}
        <div>
          <label className="label">
            <span className="label-text flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Address
            </span>
          </label>
          <textarea
            name="address"
            className="textarea textarea-bordered w-full"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            maxLength={400}
          />
        </div>

        {/* Role */}
        <div>
          <label className="label">
            <span className="label-text flex items-center">
              <UserCog className="w-4 h-4 mr-2" />
              Role*
            </span>
          </label>
          <select
            name="role"
            className="select select-bordered w-full"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="user">User</option>
            <option value="store_owner">Store Owner</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? 'Adding User...' : 'Add User'}
        </button>
      </form>
    </div>
  );
};

export default AddUserForm;
