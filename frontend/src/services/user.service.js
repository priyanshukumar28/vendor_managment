import api from '../api/axios'

export const userService = {
  getUsers: async (params = {}) => {
    const { data } = await api.get('/users', { params })
    return data
  },

  createUser: async (userData) => {
    const { data } = await api.post('/users', userData)
    return data
  },

  getUserById: async (id) => {
    const { data } = await api.get(`/users/${id}`)
    return data
  },

  updateUser: async (id, userData) => {
    const { data } = await api.put(`/users/${id}`, userData)
    return data
  },

  deleteUser: async (id) => {
    const { data } = await api.delete(`/users/${id}`)
    return data
  },
}
