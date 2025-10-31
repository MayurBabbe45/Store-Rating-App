import { useState } from 'react';
import { changePassword } from '../../services/authService';
import { AlertCircle } from 'lucide-react';

const ChangePasswordForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return false;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(.{8,16})$/;
    if (!passwordRegex.test(formData.newPassword)) {
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
    setSuccess(false);

    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      setSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.message ||
        'Failed to change password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-300 shadow-lg rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
      
      {error && (
        <div className="alert alert-error flex items-center mb-4">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success mb-4">
          Password changed successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password */}
        <div>
          <label className="label">
            <span className="label-text">Current Password</span>
          </label>
          <input
            type="password"
            name="currentPassword"
            className="input input-bordered w-full"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />
        </div>

        {/* New Password */}
        <div>
          <label className="label">
            <span className="label-text">New Password</span>
          </label>
          <input
            type="password"
            name="newPassword"
            className="input input-bordered w-full"
            value={formData.newPassword}
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

        {/* Confirm New Password */}
        <div>
          <label className="label">
            <span className="label-text">Confirm New Password</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            className="input input-bordered w-full"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={8}
            maxLength={16}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? 'Changing Password...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;