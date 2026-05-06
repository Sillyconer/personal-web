import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { ownerCredentials, ownerProfile } from '../data/auth';
import type { Credentials } from '../types/site';
import type { OwnerProfile } from '../types/site';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  profile: OwnerProfile | null;
  mode: 'placeholder' | 'backend';
  login: (credentials: Credentials) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      username: null,
      profile: null,
      mode: 'placeholder',
      login: ({ username, password }) => {
        const success =
          username.trim().toLowerCase() === ownerCredentials.username && password === ownerCredentials.password;

        if (success) {
          set({
            isAuthenticated: true,
            username: ownerProfile.username,
            profile: ownerProfile,
            mode: 'placeholder',
          });
        }

        return success;
      },
      logout: () => set({ isAuthenticated: false, username: null, profile: null, mode: 'placeholder' }),
    }),
    {
      name: 'personalweb-auth',
    },
  ),
);
