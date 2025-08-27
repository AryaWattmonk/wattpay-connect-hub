import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  userEmail: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, email: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userEmail: null,
      isAuthenticated: false,
      setAuth: (token: string, email: string) => 
        set({ token, userEmail: email, isAuthenticated: true }),
      clearAuth: () => 
        set({ token: null, userEmail: null, isAuthenticated: false }),
    }),
    {
      name: 'wattpay-auth',
    }
  )
);