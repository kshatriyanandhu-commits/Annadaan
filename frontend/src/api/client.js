import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config) => {
    try {
      const storedAuth = localStorage.getItem('annadaan_auth');
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        if (parsed?.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      }
    } catch (err) {
      console.error('[API Client] Error parsing auth state:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';

    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        const stored = localStorage.getItem('annadaan_auth');
        if (stored) {
          console.warn('[API Client] Unauthorized request - clearing invalid session');
          localStorage.removeItem('annadaan_auth');
          window.dispatchEvent(new Event('annadaan_auth_reset'));
        }
      }
    }

    return Promise.reject(new Error(message));
  }
);

export const authApi = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  getMe: () => apiClient.get('/auth/me'),
};

export const donationApi = {
  getFeed: (params) => apiClient.get('/donations', { params }),
  getById: (id) => apiClient.get(`/donations/${id}`),
  create: (data) => apiClient.post('/donations', data),
  update: (id, data) => apiClient.put(`/donations/${id}`, data),
  delete: (id) => apiClient.delete(`/donations/${id}`),
  getMyDonations: () => apiClient.get('/donations/my-donations'),
  getMyClaims: () => apiClient.get('/donations/my-claims'),
  claim: (id) => apiClient.patch(`/donations/${id}/claim`),
  complete: (id) => apiClient.patch(`/donations/${id}/complete`),
};

export const statsApi = {
  getSummary: () => apiClient.get('/stats/summary'),
};

export default apiClient;
