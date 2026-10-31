import { useLanguage } from '../i18n/LanguageContext';
import { canReplayIntro } from './Intro';
import './Footer.css';

const WHATSAPP_PLACEHOLDER = 'https://wa.me/22962424122';

const SOCIALS = [
  {
    label: 'GitHub',
    href: 'https://github.com/ABIMEMirabelle20',
    icon: (
      <path d="M9.5 0C4.25 0 0 4.25 0 9.5c0 4.2 2.72 7.76 6.5 9.02.47.09.65-.2.65-.45 0-.22-.01-.96-.01-1.75-2.42.44-3.05-.59-3.25-1.13-.11-.28-.58-1.13-1-1.36-.34-.18-.82-.63-.01-.64.76-.01 1.3.7 1.48.99.87 1.46 2.25 1.05 2.8.8.09-.62.34-1.05.62-1.29-2.15-.24-4.4-1.08-4.4-4.79 0-1.06.38-1.93.99-2.6-.1-.24-.43-1.23.1-2.57 0 0 .81-.26 2.65.99a9 9 0 0 1 2.42-.33c.82 0 1.64.11 2.42.33 1.84-1.26 2.65-.99 2.65-.99.53 1.34.2 2.33.1 2.57.61.67.98 1.53.98 2.6 0 3.72-2.26 4.54-4.42 4.78.35.3.65.88.65 1.78 0 1.29-.01 2.33-.01 2.65 0 .25.18.55.66.45C16.28 17.26 19 13.7 19 9.5 19 4.25 14.75 0 9.5 0Z" />
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/mirabelle-larissa-abime-847972337',
    icon: (
      <path d="M4.15 6.02H.62V18.3h3.53Zm.22-3.86A2.04 2.04 0 1 1 .27 2.14a2.04 2.04 0 0 1 4.1.02ZM18.62 18.3h-3.52v-6.44c0-1.53-.03-3.5-2.13-3.5-2.14 0-2.47 1.67-2.47 3.39v6.55H6.99V6.02h3.38v1.68h.05c.47-.89 1.62-1.83 3.33-1.83 3.56 0 4.22 2.34 4.22 5.39Z" />
    ),
  },
  {
    label: 'Email',
    href: 'mailto:mirabelleabime@gmail.com',
    icon: (
      <path d="M1.6 3h15.8c.6 0 1 .5 1 1v11c0 .6-.4 1-1 1H1.6c-.6 0-1-.4-1-1V4c0-.5.4-1 1-1Zm.6 2.1V13h14.6V5.1L9.5 10.4Zm.9-1L9.5 8.6l6.4-4.5Z" />
    ),
  },
  {
    label: 'WhatsApp',
    href: WHATSAPP_PLACEHOLDER,
    icon: (
      <path d="M9.5.5C4.5.5.5 4.5.5 9.5c0 1.66.45 3.22 1.23 4.56L.5 18.5l4.56-1.2A9 9 0 0 0 9.5 18.5c5 0 9-4 9-9s-4-9-9-9Zm0 16.36a7.3 7.3 0 0 1-3.73-1.02l-.27-.16-2.77.73.74-2.7-.18-.28A7.35 7.35 0 1 1 16.86 9.5 7.36 7.36 0 0 1 9.5 16.86Zm4.03-5.5c-.22-.11-1.3-.64-1.5-.72-.2-.07-.35-.11-.5.11s-.57.72-.7.86-.26.16-.48.05a6.05 6.05 0 0 1-1.78-1.1 6.7 6.7 0 0 1-1.24-1.54c-.13-.22 0-.34.1-.45.1-.1.22-.26.33-.4.11-.12.15-.21.22-.35.07-.15.04-.28-.02-.4-.06-.11-.5-1.2-.68-1.65-.18-.43-.36-.37-.5-.38h-.43c-.15 0-.4.06-.6.28-.2.22-.8.78-.8 1.9s.82 2.2.93 2.35c.11.16 1.6 2.44 3.87 3.42.54.23.96.37 1.29.48.54.17 1.03.15 1.42.09.43-.06 1.3-.53 1.49-1.04.18-.51.18-.95.13-1.04-.05-.1-.2-.15-.42-.26Z" />
    ),
  },
];

// Chaque lettre est un élément à part : elle réagit seule au survol.
const letters = (word) =>
  [...word].map((char, index) => (
    <span key={index} className="footer__letter">
      {char}
    </span>
  ));

// Nœud papillon abstrait : le dernier nœud du site. L'aile droite s'est
// légèrement détachée, comme dans l'introduction quand il se défait.
function BowTie() {
  return (
    <svg className="footer__bow" viewBox="0 0 300 200" aria-hidden="true" focusable="false">
      <path className="footer__bow-tail" d="M138 122L108 190l22-7 14 12 6-73Z" />
      <path className="footer__bow-tail" d="M162 122l30 68-22-7-14 12-6-73Z" />
      <path className="footer__bow-wing" d="M124 98C88 54 42 42 8 60v76c34 18 78 8 116-39Z" />
      <path className="footer__bow-wing footer__bow-wing--loose" d="M180 98c36-44 82-56 116-38v76c-34 18-78 8-116-39Z" />
      <rect className="footer__bow-knot" x="122" y="70" width="56" height="56" rx="22" />
    </svg>
  );
}

export default function Footer({ onReplayIntro }) {
  const { t } = useLanguage();

  return (
    <footer className="footer band band--plum">
      <div className="container footer__inner">
        <div className="footer__rule" aria-hidden="true" />

        <div className="footer__stage">
          <p className="footer__name">
            <span className="visually-hidden">Mirabelle ABIME</span>
            <span className="footer__line footer__line--first" aria-hidden="true">
              {letters('Mirabelle')}
            </span>
            <span className="footer__line footer__line--second" aria-hidden="true">
              {letters('ABIME')}
              <span className="footer__dot" />
            </span>
          </p>

          <ul className="footer__socials">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a className="footer__social" href={s.href} target="_blank" rel="noreferrer noopener" aria-label={s.label} title={s.label}>
                  <svg viewBox="0 0 19 19" width="18" height="18" fill="currentColor" aria-hidden="true">
                    {s.icon}
                  </svg>
                </a>
              </li>
            ))}
          </ul>

          <BowTie />
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            © {new Date().getFullYear()} Mirabelle ABIME. {t.footer.rights}.
          </p>

          <div className="footer__actions">
            {onReplayIntro && canReplayIntro() && (
              <button type="button" className="footer__action footer__action--replay" onClick={onReplayIntro}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 12a9 9 0 1 0 3-6.7" />
                  <path d="M3 4v5h5" />
                </svg>
                <span>{t.footer.replayIntro}</span>
              </button>
            )}
            <button type="button" className="footer__action footer__action--top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <span>{t.footer.top}</span>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}