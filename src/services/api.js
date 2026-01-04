import axios from 'axios';

/**
 * API Service
 * Axios instance configured for BoyzClub API
 */

// Production API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://boyzvip-api.90k5up.easypanel.host/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request Interceptor - Add Authorization header
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('boyzclub_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor - Handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - logout user
            if (typeof window !== 'undefined') {
                localStorage.removeItem('boyzclub_token');
                localStorage.removeItem('boyzclub_user');

                // Redirect to login if not already there
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login?session=expired';
                }
            }
        }
        return Promise.reject(error);
    }
);

// Auth endpoints
export const authAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (data) => api.post('/auth/register', data),
    me: () => api.get('/auth/me'),
    updateGateway: (gateway, apiToken) => api.put('/auth/gateway', { gateway, apiToken })
};

// Bots endpoints
export const botsAPI = {
    list: () => api.get('/bots'),
    get: (id) => api.get(`/bots/${id}`),
    connect: (token, name) => api.post('/bots/connect', { token, name }),
    update: (id, data) => api.put(`/bots/${id}`, data),
    delete: (id) => api.delete(`/bots/${id}`)
};

// Plans endpoints
export const plansAPI = {
    list: (botId) => api.get('/plans', { params: { botId } }),
    get: (id) => api.get(`/plans/${id}`),
    create: (data) => api.post('/plans', data),
    update: (id, data) => api.put(`/plans/${id}`, data),
    delete: (id) => api.delete(`/plans/${id}`),
    getByUsername: (username) => api.get(`/plans/public/${username}`)
};

// Stats endpoints
export const statsAPI = {
    getCreatorStats: () => api.get('/stats'),
    getAdminStats: () => api.get('/admin/stats')
};

// Checkout endpoints
export const checkoutAPI = {
    generateLink: (planId, data) => api.post('/checkout/link', { planId, ...data }),
    checkStatus: (subscriptionId) => api.get(`/checkout/status/${subscriptionId}`)
};

// Admin endpoints
export const adminAPI = {
    listCreators: () => api.get('/admin/creators'),
    impersonate: (userId) => api.post(`/admin/impersonate/${userId}`),
    banCreator: (userId) => api.post(`/admin/creators/${userId}/ban`)
};

export default api;
