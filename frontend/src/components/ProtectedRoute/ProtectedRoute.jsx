import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, loading, hasRole } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: 'var(--bg-primary)',
        fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', fontSize: 14,
        flexDirection: 'column', gap: 16
      }}>
        <div className="spin-loader" />
        <span>Loading Across Assist...</span>
        <style>{`.spin-loader{width:32px;height:32px;border:3px solid var(--border-light);border-top-color:var(--brand-blue);border-radius:50%;animation:spin 0.7s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && !hasRole(roles)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
