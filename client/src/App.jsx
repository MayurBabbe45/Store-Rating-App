import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import ErrorBoundary from './components/common/ErrorBoundary';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Unauthorized from './pages/Unauthorized';

// Common Components
import ChangePasswordForm from './components/common/ChangePasswordForm';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';

// User Components
import StoresList from './components/user/StoresList';

// Store Owner Components
import OwnerDashboard from './components/storeOwner/OwnerDashboard';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <div>
            <Navbar />
            <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* User routes */}
            <Route
              path="/stores"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <StoresList />
                </ProtectedRoute>
              }
            />

            {/* Store Owner routes */}
            <Route
              path="/owner/dashboard"
              element={
                <ProtectedRoute allowedRoles={['store_owner']}>
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Common protected routes */}
            <Route
              path="/change-password"
              element={
                <ProtectedRoute allowedRoles={['admin', 'user', 'store_owner']}>
                  <ChangePasswordForm />
                </ProtectedRoute>
              }
            />

            {/* Unauthorized access */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* 404 fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
