import { useEffect } from 'react';

import { useThemeStore } from '../../store/useThemeStore';

export const ThemeSync = () => {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return null;
};
