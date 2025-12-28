import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || error.message || 'An error occurred';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

export const templateAPI = {
  getAll: () => api.get('/api/templates'),
  getByName: (name: string) => api.get(`/api/templates/${name}`),
};

export const detectorAPI = {
  detect: (text: string) => api.post('/api/detect', { text }),
  generateDisclosure: (aiTools: string[], sections: string[]) =>
    api.post('/api/generate-disclosure', { ai_tools: aiTools, sections_used: sections }),
};

export const brainstormAPI = {
  generate: (data: { topic: string; field: string; research_type: string }) =>
    api.post('/api/brainstorm', data),
};

export const writingAPI = {
  improve: (data: { text: string; action: string }) =>
    api.post('/api/writing/improve', data),
  generateSection: (data: { section_type: string; context: string }) =>
    api.post('/api/writing/generate-section', data),
};

export const chatAPI = {
  send: (data: { message: string; context?: string }) =>
    api.post('/api/chat', data),
};

export const exportAPI = {
  docx: (data: any) => api.post('/api/export/docx', data, { responseType: 'blob' }),
  file: (data: any) => api.post('/api/export/file', data, { responseType: 'blob' }),
};

export const fileAPI = {
  analyze: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/upload/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  humanize: (text: string) => api.post('/api/humanize', { text }),
};

export const modelAPI = {
  getSettings: () => api.get('/api/models/settings'),
};

export const citationAPI = {
  fetchFromDOI: (doi: string) => api.get(`/api/citations/doi/${encodeURIComponent(doi)}`),
  format: (citation: any, style: string) =>
    api.post('/api/citations/format', { citation, style }),
};

export default api;
