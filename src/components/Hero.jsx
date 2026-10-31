import projects from '../data/projects';
import { totalCertifications, yearsCoding } from '../data/certifications';
import useInView from '../hooks/useInView';
import { useLanguage } from '../i18n/LanguageContext';
import ArrowIcon from './ArrowIcon';
import Lockup from './Lockup';
import Mascot from './Mascot';
import './Hero.css';

export default function Hero() {
  const { t } = useLanguage();
  const ref = useInView(0.2);
  const [hookBuild, hookLearn, hookExplore] = t.hero.hook;

  const stamps = [
    { value: projects.length, label: t.hero.stats.projects, tone: 'pink' },
    { value: totalCertifications, label: t.hero.stats.certifications, tone: 'lemon' },
    { value: yearsCoding, label: t.hero.stats.years, tone: 'ivory' },
  ];

  return (
    <section id="top" className="hero band" ref={ref}>
      <div className="container hero__grid">
        <div className="hero__copy">
          <h1 className="hero__hook">
            <span className="hero__line hero__line--solid">{hookBuild}</span>
            <span className="hero__line"><span className="mark">{hookLearn}</span></span>
            <span className="hero__line hero__line--outline">{hookExplore}</span>
          </h1>

          <p className="lead hero__deck">
            {t.hero.deck} <span className="mark">{t.hero.deckMark}</span>
          </p>

          <div className="hero__cta">
            <a className="btn-arrow" href="#projects">
              {t.hero.ctaProjects}
              <span className="btn-arrow__icon"><ArrowIcon /></span>
            </a>
            <a className="hero__link" href="#timeline">{t.hero.ctaJourney}</a>
          </div>
        </div>

        <div className="hero__stage">
          <div className="hero__blob">
            <div className="hero__mascot">
              <Mascot waving alt={t.hero.mascotAlt} />
            </div>
          </div>

          <svg className="hero__badge" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
            <defs>
              <path id="hero-badge-circle" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" />
            </defs>
            <circle cx="60" cy="60" r="58" className="hero__badge-bg" />
            <text className="hero__badge-text">
              <textPath href="#hero-badge-circle" textLength="268" lengthAdjust="spacing">{t.hero.badge}</textPath>
            </text>
            <path d="M52 52l16 16M68 52L52 68" className="hero__badge-x" />
          </svg>

          <ul className="hero__stamps">
            {stamps.map((stamp) => (
              <li key={stamp.label} className={`stamp stamp--${stamp.tone}`}>
                <span className="stamp__value">{stamp.value}</span>
                <span className="stamp__label">{stamp.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container hero__lockup">
        <Lockup />
      </div>
    </section>
  );
}
