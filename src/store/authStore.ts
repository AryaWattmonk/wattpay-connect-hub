import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  userEmail: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, email: string) => void;
  clearAuth: () => void;
}

// Custom storage for Chrome Extension
const chromeStorage = {
  getItem: async (name: string) => {
    const result = await chrome.storage.local.get(name);
    return result[name];
  },
  setItem: async (name: string, value: string) => {
    await chrome.storage.local.set({ [name]: value });
  },
  removeItem: async (name: string) => {
    await chrome.storage.local.remove(name);
  },
};

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
      storage: createJSONStorage(() => chromeStorage), // Use custom storage
    }
  )
);
