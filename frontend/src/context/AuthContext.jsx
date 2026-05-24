import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/auth.service'

const AuthContext = createContext(null)

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  VENDOR_ADMIN: 'VENDOR_ADMIN',
  DEVELOPER: 'DEVELOPER',
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (credentials) => {
  const response = await authService.login(credentials);

  // Backend response structure
  const { accessToken, user: userData } = response.data;

  localStorage.setItem(
    'accessToken',
    accessToken
  );

  localStorage.setItem(
    'user',
    JSON.stringify(userData)
  );

  setToken(accessToken);
  setUser(userData);

  return userData;
}, []);

  const logout = useCallback(() => {
    authService.logout()
    setToken(null)
    setUser(null)
  }, [])

  const hasRole = useCallback((role) => {
    if (!user) return false
    if (Array.isArray(role)) return role.includes(user.role)
    return user.role === role
  }, [user])

  const isAuthenticated = !!token && !!user

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, logout, hasRole, ROLES }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
