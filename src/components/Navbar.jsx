import { useEffect, useState } from 'react';
import useActiveSection from '../hooks/useActiveSection';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import ArrowIcon from './ArrowIcon';
import Signature from './Signature';
import './Navbar.css';

const LINK_IDS = ['about', 'projects', 'skills', 'events', 'timeline'];
const MOBILE_IDS = [...LINK_IDS, 'contact'];

function BowIcon() {
  return (
    <svg className="nav__bow" viewBox="0 0 40 24" aria-hidden="true" focusable="false">
      <path d="M20 12L3 3v18Z" />
      <path d="M20 12l17-9v18Z" />
      <rect x="16" y="7" width="8" height="10" rx="3" />
    </svg>
  );
}

function ThemeIcon({ dark }) {
  return dark ? (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  // 'top' = l'accueil : tant qu'on y est, aucun lien du menu n'est actif.
  const active = useActiveSection(['top', ...MOBILE_IDS]);
  const isDark = theme === 'dark';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Menu mobile : pas de défilement derrière, Échap pour fermer, fermeture
  // automatique si la fenêtre devient large.
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event) => event.key === 'Escape' && setOpen(false);
    const onResize = () => window.innerWidth > 1100 && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="container nav__inner">
        <a className="nav__brand" href="#top" aria-label={t.nav.home} onClick={closeMenu}>
          <BowIcon />
          <Signature />
        </a>

        <nav className="nav__links" aria-label={t.nav.mainLabel}>
          {LINK_IDS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={`nav__link ${active === id ? 'is-active' : ''}`}
              aria-current={active === id ? 'location' : undefined}
            >
              {t.nav[id]}
            </a>
          ))}
        </nav>

        <div className="nav__tools">
          <button
            type="button"
            className="nav__tool nav__tool--lang"
            onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
            lang={lang === 'fr' ? 'en' : 'fr'}
            aria-label={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
          >
            {lang === 'fr' ? 'EN' : 'FR'}
          </button>
          <button
            type="button"
            className="nav__tool nav__tool--icon"
            onClick={toggleTheme}
            aria-label={isDark ? t.nav.toLight : t.nav.toDark}
          >
            <ThemeIcon dark={isDark} />
          </button>
          <a className="btn-arrow btn-arrow--small nav__cta" href="#contact">
            {t.nav.contactCta}
            <span className="btn-arrow__icon"><ArrowIcon /></span>
          </a>
          <button
            type="button"
            className="nav__burger"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            onClick={() => setOpen((value) => !value)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className="nav__mobile band band--wine" inert={!open}>
        <nav className="container nav__mobile-inner" aria-label={t.nav.mainLabel}>
          {MOBILE_IDS.map((id, index) => (
            <a key={id} href={`#${id}`} className="nav__mobile-link" onClick={closeMenu}>
              <span className="nav__mobile-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              {t.nav[id]}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
