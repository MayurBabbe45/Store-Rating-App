import { useState } from 'react';
import { createStore, createUser } from '../../services/adminService';
import { AlertCircle, Store, Mail, User, Lock, MapPin } from 'lucide-react';

const AddStoreForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerName: '',
    ownerEmail: '',
    ownerPassword: ''
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
    if (!formData.name || !formData.email || !formData.address || !formData.ownerName || !formData.ownerEmail || !formData.ownerPassword) {
      setError('Please fill in all required fields');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email) || !emailRegex.test(formData.ownerEmail)) {
      setError('Please enter valid email addresses');
      return false;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(.{8,16})$/;
    if (!passwordRegex.test(formData.ownerPassword)) {
      setError('Owner password must be 8-16 characters with at least one uppercase letter and one special character');
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
      // First create the store owner
      let ownerResponse;
      try {
        ownerResponse = await createUser({
          name: formData.ownerName,
          email: formData.ownerEmail,
          password: formData.ownerPassword,
          role: 'store_owner'
        });
      } catch (err) {
        if (err.response?.status === 409) {
          setError('An account with this email already exists');
        } else {
          setError(err.response?.data?.error || 'Failed to create store owner');
        }
        return;
      }

      // Then create the store with the owner's ID
      try {
        await createStore({
          name: formData.name,
          email: formData.email,
          address: formData.address,
          ownerId: ownerResponse.user.id
        });
      } catch (err) {
        // If store creation fails, we should inform the user that an owner was created
        // but store creation failed
        if (err.response?.status === 409) {
          setError('Store creation failed: Store email already exists or owner already has a store');
        } else {
          setError(
            'Store owner was created but store creation failed: ' +
            (err.response?.data?.error || 'Unknown error')
          );
        }
        return;
      }

      // Clear form and show success
      setFormData({
        name: '',
        email: '',
        address: '',
        ownerName: '',
        ownerEmail: '',
        ownerPassword: ''
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.message ||
        'Failed to create store'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-300 shadow-lg rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <Store className="w-6 h-6 mr-2" />
        Add New Store
      </h2>
      
      {error && (
        <div className="alert alert-error flex items-center mb-4">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Store Owner Information */}
        <div className="divider">Store Owner Information</div>

        <div>
          <label className="label">
            <span className="label-text flex items-center">
              <User className="w-4 h-4 mr-2" />
              Owner Name*
            </span>
          </label>
          <input
            type="text"
            name="ownerName"
            placeholder="Store owner's full name"
            className="input input-bordered w-full"
            value={formData.ownerName}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={60}
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Owner Email*
            </span>
          </label>
          <input
            type="email"
            name="ownerEmail"
            placeholder="owner@example.com"
            className="input input-bordered w-full"
            value={formData.ownerEmail}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              Owner Password*
            </span>
          </label>
          <input
            type="password"
            name="ownerPassword"
            placeholder="Password for store owner login"
            className="input input-bordered w-full"
            value={formData.ownerPassword}
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

        {/* Store Information */}
        <div className="divider">Store Information</div>

        <div>
          <label className="label">
            <span className="label-text flex items-center">
              <Store className="w-4 h-4 mr-2" />
              Store Name*
            </span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="Store name"
            className="input input-bordered w-full"
            value={formData.name}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={60}
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Store Email*
            </span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="store@example.com"
            className="input input-bordered w-full"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Store Address*
            </span>
          </label>
          <textarea
            name="address"
            placeholder="Store address"
            className="textarea textarea-bordered w-full h-24"
            value={formData.address}
            onChange={handleChange}
            required
            maxLength={400}
          />
        </div>

        <button
          type="submit"
          className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? 'Creating Store...' : 'Create Store'}
        </button>
      </form>
    </div>
  );
};

export default AddStoreForm;