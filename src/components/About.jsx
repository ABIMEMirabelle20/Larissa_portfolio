import { useLanguage } from '../i18n/LanguageContext';
import './About.css';

const portraitFiles = import.meta.glob('../assets/portrait.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
});
const portrait = Object.values(portraitFiles)[0];

export default function About() {
  const { t } = useLanguage();
  const { terrains } = t.about;

  return (
    <section id="about" className="section about band band--wine">
      <div className="container">
        <div className="about__grid">
          <div className="about__visual">
            <div className="about__frame">
              {portrait ? (
                <img
                  className="about__photo"
                  src={portrait}
                  alt={t.about.portraitAlt}
                  width="560"
                  height="560"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="about__placeholder" role="img" aria-label={t.about.portraitPlaceholder}>
                  <span className="about__initials" aria-hidden="true">MA</span>
                  <span className="about__placeholder-note" aria-hidden="true">{t.about.portraitPlaceholder}</span>
                </div>
              )}
            </div>
            <span className="about__ring" aria-hidden="true" />
          </div>

          <div className="about__content">
            <p className="eyebrow">{t.about.eyebrow}</p>
            <h2>{t.about.title}</h2>
            <p className="lead about__lead">{t.about.lead}</p>
            <p className="about__text">{t.about.p2}</p>
            <p className="about__text">{t.about.p3}</p>

            <dl className="about__facts">
              {t.about.facts.map((fact) => (
                <div key={fact.label} className="about__fact">
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="about__terrains">
          <h3 className="about__terrains-title">{terrains.title}</h3>
          <div className="about__terrain-cards">
            {[terrains.web, terrains.ai].map((terrain) => (
              <section key={terrain.label} className="about__terrain">
                <h4>{terrain.label}</h4>
                <ul>
                  {terrain.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
