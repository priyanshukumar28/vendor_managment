import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'

// Pages
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import VendorList from './pages/vendors/VendorList'
import UserList from './pages/users/UserList'
import PlaceholderPage from './pages/PlaceholderPage'

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Shell */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Vendors — SUPER_ADMIN only */}
          <Route
            path="vendors"
            element={
              <ProtectedRoute roles={['SUPER_ADMIN', 'VENDOR_ADMIN']}>
                <VendorList />
              </ProtectedRoute>
            }
          />

          {/* Users — SUPER_ADMIN only */}
          <Route
            path="users"
            element={
              <ProtectedRoute roles={['SUPER_ADMIN']}>
                <UserList />
              </ProtectedRoute>
            }
          />

          {/* Placeholder routes */}
          <Route path="projects" element={<PlaceholderPage />} />
          <Route path="tasks" element={<PlaceholderPage />} />
          <Route path="developers" element={<PlaceholderPage />} />
          <Route path="teams" element={<PlaceholderPage />} />
          <Route path="reports" element={<PlaceholderPage />} />
          <Route path="approvals" element={<PlaceholderPage />} />
          <Route path="escalations" element={<PlaceholderPage />} />
          <Route path="invoices" element={<PlaceholderPage />} />
          <Route path="settings" element={<PlaceholderPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
)

export default App
