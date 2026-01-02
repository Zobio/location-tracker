import axios from 'axios';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  Checkin,
  CheckinCreate
} from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post<User>('/api/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },
};

export const checkinApi = {
  create: async (data: CheckinCreate): Promise<Checkin> => {
    const response = await api.post<Checkin>('/api/checkins', data);
    return response.data;
  },

  getAll: async (skip = 0, limit = 100): Promise<Checkin[]> => {
    const response = await api.get<Checkin[]>('/api/checkins', {
      params: { skip, limit },
    });
    return response.data;
  },

  getById: async (id: number): Promise<Checkin> => {
    const response = await api.get<Checkin>(`/api/checkins/${id}`);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/checkins/${id}`);
  },
};

export default api;
