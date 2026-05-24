import api from '../api/axios'

export const vendorService = {
  getVendors: async (params = {}) => {
    const { data } = await api.get('/vendors', { params })
    return data
  },

  createVendor: async (vendorData) => {
    const { data } = await api.post('/vendors', vendorData)
    return data
  },

  getVendorById: async (id) => {
    const { data } = await api.get(`/vendors/${id}`)
    return data
  },

  updateVendor: async (id, vendorData) => {
    const { data } = await api.put(`/vendors/${id}`, vendorData)
    return data
  },

  deleteVendor: async (id) => {
    const { data } = await api.delete(`/vendors/${id}`)
    return data
  },
}
