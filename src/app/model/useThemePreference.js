import {useEffect, useState} from 'react';

const THEME_KEY = 'kotonoha_theme';
const ALLOWED_THEMES = new Set(['light', 'dark', 'system']);

/**
 * App-wide theme preference.
 * Keep the existing storage key and theme-color values to preserve PWA behavior.
 */
export function useThemePreference() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      return ALLOWED_THEMES.has(saved) ? saved : 'system';
    } catch {
      return 'system';
    }
  });

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && media.matches);
      document.documentElement.dataset.theme = dark ? 'dark' : 'light';
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', dark ? '#111714' : '#ffffff');
    };
    apply();
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* Storage is optional for theme. */ }
    media.addEventListener?.('change', apply);
    return () => media.removeEventListener?.('change', apply);
  }, [theme]);

  return [theme, setTheme];
}
