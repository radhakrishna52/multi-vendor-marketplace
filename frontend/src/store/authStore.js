import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('access_token') || null,
  isAuthenticated: !!localStorage.getItem('access_token'),

  login: (user, token) => {
    localStorage.setItem('access_token', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('access_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user }),
}));
