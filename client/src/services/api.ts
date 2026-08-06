import axios from 'axios';

// Create central Axios instance
// Uses VITE_API_URL environment variable if set, falls back to relative /api
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to append JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('flowmind_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch HTML responses (when /api is proxied to index.html) and auth errors
api.interceptors.response.use(
  (response) => {
    if (typeof response.data === 'string' && response.data.trim().toLowerCase().startsWith('<!doctype')) {
      return Promise.reject({
        response: {
          data: {
            error: 'Backend API URL not connected. Please add VITE_API_URL in Vercel Environment Variables pointing to your Render backend (e.g. https://your-backend.onrender.com/api).'
          }
        }
      });
    }
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Token is invalid or expired, dispatch custom event to trigger React logout
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  }
);

// Auth Service Endpoints
export const authService = {
  login: async (credentials: any) => {
    try {
      const res = await api.post('/auth/login', credentials);
      return res.data;
    } catch (err: any) {
      if (err.code === 'ERR_NETWORK' || !err.response) {
        throw new Error('Backend server is unreachable. Please ensure your Render web service is live and VITE_API_URL is set in Vercel Environment Variables.');
      }
      throw err;
    }
  },
  signup: async (details: any) => {
    try {
      const res = await api.post('/auth/signup', details);
      return res.data;
    } catch (err: any) {
      if (err.code === 'ERR_NETWORK' || !err.response) {
        throw new Error('Backend server is unreachable. Please ensure your Render web service is live and VITE_API_URL is set in Vercel Environment Variables.');
      }
      throw err;
    }
  },
  me: async () => {
    try {
      const res = await api.get('/auth/me');
      return res.data;
    } catch (err: any) {
      if (err.code === 'ERR_NETWORK' || !err.response) {
        throw new Error('Backend server is unreachable.');
      }
      throw err;
    }
  },
};

// Projects & Execution Endpoints
export const projectService = {
  create: async (data: { name: string; goal: string; description?: string; researchMode?: 'detailed' | 'flash' }) => {
    const res = await api.post('/projects', data);
    return res.data;
  },
  getAll: async () => {
    const res = await api.get('/projects');
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get(`/projects/${id}`);
    return res.data;
  },
  getLogs: async (projectId: string) => {
    const res = await api.get(`/projects/${projectId}/logs`);
    return res.data;
  },
  getReport: async (projectId: string) => {
    const res = await api.get(`/projects/${projectId}/report`);
    return res.data;
  },
};

// Agents Endpoints
export const agentService = {
  getAll: async () => {
    const res = await api.get('/agents');
    return res.data;
  },
  create: async (data: { name: string; role: string; avatar?: string }) => {
    const res = await api.post('/agents', data);
    return res.data;
  },
  update: async (id: string, data: any) => {
    const res = await api.put(`/agents/${id}`, data);
    return res.data;
  },
};

// Knowledge Base Endpoints
export const kbService = {
  getAll: async () => {
    const res = await api.get('/kb');
    return res.data;
  },
  upload: async (fileData: { name: string; size: number; type: string; contentSummary?: string }) => {
    const res = await api.post('/kb/upload', fileData);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/kb/${id}`);
    return res.data;
  },
};

// Visual Workflows Endpoints
export const workflowService = {
  getAll: async () => {
    const res = await api.get('/workflows');
    return res.data;
  },
  save: async (data: { name: string; description?: string; nodes: any[]; edges: any[] }) => {
    const res = await api.post('/workflows', data);
    return res.data;
  },
};

// Analytics Endpoint
export const analyticsService = {
  get: async () => {
    const res = await api.get('/analytics');
    return res.data;
  },
};

// Memory Endpoint
export const memoryService = {
  getByProject: async (projectId: string) => {
    const res = await api.get(`/memory/${projectId}`);
    return res.data;
  },
};

export default api;
