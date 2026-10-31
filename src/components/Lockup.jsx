import { useLanguage } from '../i18n/LanguageContext';

// Signature graphique "WEB × IA", sur une seule ligne. Deux polices en
// contraste (serif en capitales / sans-serif gras), une pastille citron pour
// le ×, une forme rose organique pour IA.
export default function Lockup() {
  const { t } = useLanguage();

  return (
    <p className="lockup" aria-label={t.hero.lockupLabel}>
      <span className="lockup__web" aria-hidden="true">{t.hero.lockupWeb}</span>
      <span className="lockup__x" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </span>
      <span className="lockup__ia" aria-hidden="true">{t.hero.lockupIa}</span>
    </p>
  );
}
