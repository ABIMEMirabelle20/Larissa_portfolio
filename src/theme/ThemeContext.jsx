import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

const STORAGE_KEY = 'portfolio-theme';

function detectInitialTheme() {
  if (typeof window === 'undefined') return 'light';

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') return stored;

  // L'identité du site est le papier ivoire : c'est le thème par défaut.
  // Le thème sombre (prune) reste à un clic dans la barre de navigation.
  return 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(detectInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setTheme = (next) => {
    setThemeState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark') }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme doit être utilisé dans <ThemeProvider>');
  return ctx;
}
