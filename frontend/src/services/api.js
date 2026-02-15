import axios from 'axios';

// In production, use relative URL (same domain). In development, use localhost.
const API_URL = process.env.REACT_APP_API_URL || (
  window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : '/api'
);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tutor API
export const tutorAPI = {
  getAll: () => api.get('/tutors'),
  getActive: () => api.get('/tutors/active'),
  getById: (id) => api.get(`/tutors/${id}`),
  create: (data) => api.post('/tutors', data),
  update: (id, data) => api.put(`/tutors/${id}`, data),
  delete: (id) => api.delete(`/tutors/${id}`),
};

// Student API
export const studentAPI = {
  getAll: () => api.get('/students'),
  getActive: () => api.get('/students/active'),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

// Matching API
export const matchingAPI = {
  findMatch: (studentId, subject) => api.post('/matching/find-match', { studentId, subject }),
  getRecommendations: () => api.get('/matching/recommendations'),
  getProjectedRevenue: () => api.get('/matching/projected-revenue'),
};

// Config API
export const configAPI = {
  getWeights: () => api.get('/config/weights'),
  updateWeights: (weights, chargePercentage, updatedBy) => api.put('/config/weights', { weights, chargePercentage, updatedBy }),
  resetWeights: () => api.post('/config/weights/reset'),
  getHistory: () => api.get('/config/weights/history'),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
