import api from '../api/axios'

export const authService = {
  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials)
    return data
  },

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    } catch {
      return null
    }
  },

  getToken: () => localStorage.getItem('accessToken'),
}
