import timeline from '../data/timeline';
import { totalCertifications, yearsCoding, linesOfCode } from '../data/certifications';
import { useLanguage } from '../i18n/LanguageContext';
import './Timeline.css';

export default function Timeline() {
  const { t, lang } = useLanguage();
  const c = t.certifications;

  const numbers = [
    { value: totalCertifications, label: c.countLabel },
    { value: yearsCoding, label: c.yearsLabel },
    { value: linesOfCode.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-GB'), label: c.linesLabel },
  ];

  return (
    <section id="timeline" className="section journey band">
      <div className="container journey__grid">
        <header className="journey__head">
          <p className="eyebrow">{t.timelineSection.eyebrow}</p>
          <h2>{t.timelineSection.title}</h2>
          <p className="lead">{t.timelineSection.lead}</p>
        </header>

        <ol className="journey__steps">
          {timeline.map((step) => (
            <li key={`${step.year}-${step.title.fr}`} className="step">
              <p className="step__year">{step.year}</p>
              <div className="step__body">
                <h3>{step.title[lang]}</h3>
                <p className="step__place">{step.place[lang]}</p>
                <p className="step__text">{step.description[lang]}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="container journey__learning">
        <p className="eyebrow">{c.eyebrow}</p>

        <dl className="journey__numbers">
          {numbers.map((n) => (
            <div key={n.label} className="journey__number">
              <dt>{n.label}</dt>
              <dd>{n.value}</dd>
            </div>
          ))}
        </dl>

        <p className="journey__note">{c.note}</p>

        <ul className="journey__highlights">
          {c.highlights.map((item) => (
            <li key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
