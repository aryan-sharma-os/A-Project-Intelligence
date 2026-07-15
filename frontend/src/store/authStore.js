import { create } from 'zustand';
import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1') + '/auth';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${API_BASE}/register`, { name, email, password });
      const { user, token } = res.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token, loading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.error?.message || 'Registration failed', loading: false });
      return false;
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${API_BASE}/login`, { email, password });
      const { user, token } = res.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token, loading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.error?.message || 'Login failed', loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  clearError: () => set({ error: null })
}));
