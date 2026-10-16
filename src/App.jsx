import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider }  from './auth/AuthContext';
import { ThemeProvider } from './auth/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import PublicRoute    from './routes/PublicRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute      from './routes/RoleRoute';

// Public pages
import LandingPage        from './pages/public/LandingPage';
import LoginPage          from './pages/public/LoginPage';
import RegisterPage       from './pages/public/RegisterPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';

// Admin pages
import AdminDashboard    from './pages/admin/AdminDashboard';
import AdminDevices      from './pages/admin/AdminDevices';
import AdminDeviceDetail from './pages/admin/AdminDeviceDetail';
import AdminLabs         from './pages/admin/AdminLabs';
import AdminAlerts       from './pages/admin/AdminAlerts';
import AdminHistory      from './pages/admin/AdminHistory';
import AdminReports      from './pages/admin/AdminReports';
import AdminUsers        from './pages/admin/AdminUsers';
import AdminSettings     from './pages/admin/AdminSettings';
import AdminProfile      from './pages/admin/AdminProfile';

// User pages
import UserDashboard from './pages/user/UserDashboard';
import UserDevices   from './pages/user/UserDevices';
import UserLabs      from './pages/user/UserLabs';
import UserAlerts    from './pages/user/UserAlerts';
import UserHistory   from './pages/user/UserHistory';
import UserReports   from './pages/user/UserReports';
import UserProfile   from './pages/user/UserProfile';

// 404
const NotFound = () => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', gap:'var(--space-4)', textAlign:'center', padding:'var(--space-8)' }}>
    <div style={{ fontSize:64, fontWeight:800, color:'var(--color-accent)', fontFamily:'var(--font-mono)' }}>404</div>
    <h1 style={{ fontSize:'var(--text-2xl)' }}>Page Not Found</h1>
    <p style={{ color:'var(--color-text-muted)' }}>The page you're looking for doesn't exist.</p>
    <a href="/" className="btn btn-primary">Go Home</a>
  </div>
);

const App = () => (
  <ThemeProvider>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/login"           element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register"        element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

          {/* Admin routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <RoleRoute role="admin">
                <Routes>
                  <Route path="dashboard"    element={<AdminDashboard />} />
                  <Route path="devices"      element={<AdminDevices />} />
                  <Route path="devices/:id"  element={<AdminDeviceDetail />} />
                  <Route path="labs"         element={<AdminLabs />} />
                  <Route path="alerts"       element={<AdminAlerts />} />
                  <Route path="history"      element={<AdminHistory />} />
                  <Route path="reports"      element={<AdminReports />} />
                  <Route path="users"        element={<AdminUsers />} />
                  <Route path="settings"     element={<AdminSettings />} />
                  <Route path="profile"      element={<AdminProfile />} />
                  <Route index              element={<Navigate to="dashboard" replace />} />
                </Routes>
              </RoleRoute>
            </ProtectedRoute>
          } />

          {/* User routes */}
          <Route path="/user/*" element={
            <ProtectedRoute>
              <RoleRoute role="user">
                <Routes>
                  <Route path="dashboard"   element={<UserDashboard />} />
                  <Route path="devices"     element={<UserDevices />} />
                  <Route path="labs"        element={<UserLabs />} />
                  <Route path="alerts"      element={<UserAlerts />} />
                  <Route path="history"     element={<UserHistory />} />
                  <Route path="reports"     element={<UserReports />} />
                  <Route path="profile"     element={<UserProfile />} />
                  <Route index             element={<Navigate to="dashboard" replace />} />
                </Routes>
              </RoleRoute>
            </ProtectedRoute>
          } />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
