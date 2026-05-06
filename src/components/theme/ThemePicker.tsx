import { themes } from '../../config/themes';
import { useThemeStore } from '../../store/useThemeStore';
import './ThemePicker.css';

export const ThemePicker = () => {
  const activeTheme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  return (
    <div className="theme-picker">
      {themes.map((theme) => (
        <button
          key={theme.id}
          type="button"
          className={`theme-chip ${activeTheme === theme.id ? 'is-active' : ''}`}
          onClick={() => setTheme(theme.id)}
          aria-label={`Switch to ${theme.label}`}
        >
          <span className="theme-chip__meta">
            <strong>{theme.label}</strong>
            <small>{theme.vibe}</small>
          </span>
          <span className="theme-chip__swatches" aria-hidden="true">
            {theme.colors.map((color) => (
              <span key={color} style={{ background: color }} />
            ))}
          </span>
        </button>
      ))}
    </div>
  );
};
