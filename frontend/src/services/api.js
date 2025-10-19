import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

const api = axios.create({ baseURL: API_BASE, timeout: 10000 });

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(r=>r, err => {
  if (err.response?.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(err);
});

// auth
export const login = (creds) => api.post('/auth/login', creds);
export const register = (data) => api.post('/auth/register', data);
export const sendOtp = (data) => api.post('/auth/send-otp', data);
export const resetPassword = (data) => api.post('/auth/reset-password', data);

// analytics
export const fetchKPIs = () => api.get('/analytics/kpis');
export const fetchTimeSeries = (params) => api.get('/analytics/timeseries', { params });

// products
export const getProducts = () => api.get('/products');
export const createProduct = (payload) => api.post('/products', payload);

// sales
export const createSale = (payload) => api.post('/sales', payload);

// staff
export const getStaff = () => api.get('/staff');

// helper
export default api;
