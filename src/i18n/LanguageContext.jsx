import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from './translations';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'portfolio-lang';

function detectInitialLang() {
  if (typeof window === 'undefined') return 'fr';

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'fr' || stored === 'en') return stored;

  // Détection selon la langue du navigateur / de l'origine de la personne :
  // anglais par défaut si le navigateur n'est pas configuré en français.
  const browserLang = window.navigator.language || 'fr';
  return browserLang.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (next) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  const value = useMemo(
    () => ({ lang, setLang, t: translations[lang] }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage doit être utilisé dans <LanguageProvider>');
  return ctx;
}
