import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { ThemeId } from '../types/site';

interface ThemeState {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark-matter',
      setTheme: (theme) => {
        document.documentElement.dataset.theme = theme;
        set({ theme });
      },
    }),
    {
      name: 'personalweb-theme',
    },
  ),
);
