import { useEffect, useRef, useState } from 'react';
import timeline from '../data/timeline';
import { totalCertifications, yearsCoding, linesOfCode } from '../data/certifications';
import { useLanguage } from '../i18n/LanguageContext';
import './Timeline.css';

// Chaque étape a sa propre composition : côté de l'année, panneau, couleur.
// Elles reviennent en boucle si tu ajoutes des étapes dans data/timeline.js.
const COMPOSITIONS = [
  { side: 'left', panel: 'plain', year: 'outline' },
  { side: 'right', panel: 'pink', year: 'solid' },
  { side: 'left', panel: 'dashed', year: 'solid' },
  { side: 'right', panel: 'wine', year: 'outline' },
  { side: 'left', panel: 'lemon', year: 'solid' },
];

// "2024 – 2025" -> année principale + fin de période en plus petit.
function splitYear(year) {
  const [start, end] = year.split(/\s*[–-]\s*/);
  return { start, end };
}

export default function Timeline() {
  const { t, lang } = useLanguage();
  const c = t.certifications;

  const listRef = useRef(null);
  const stepRefs = useRef([]);
  const [armed, setArmed] = useState(false);
  const [current, setCurrent] = useState(-1);
  const [revealed, setRevealed] = useState(() => new Set());

  // Révélation progressive : elle n'est armée qu'une fois la page chargée
  // (sans JavaScript, ou en mouvement réduit, tout reste visible).
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return undefined;

    setArmed(true);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setRevealed((previous) => new Set(previous).add(index));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    stepRefs.current.filter(Boolean).forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  // La ligne se remplit au fil du défilement ; l'étape "en cours" est celle
  // que la ligne vient de dépasser.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = list.getBoundingClientRect();
      const anchor = window.innerHeight * 0.55;
      const progress = Math.min(1, Math.max(0, (anchor - rect.top) / rect.height));
      list.style.setProperty('--progress', progress.toFixed(4));

      let index = -1;
      stepRefs.current.forEach((node, i) => {
        if (node && node.getBoundingClientRect().top < anchor) index = i;
      });
      setCurrent(index);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const numbers = [
    { value: totalCertifications, label: c.countLabel },
    { value: yearsCoding, label: c.yearsLabel },
    { value: linesOfCode.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-GB'), label: c.linesLabel },
  ];

  return (
    <section id="timeline" className={`section journey band ${armed ? 'journey--armed' : ''}`}>
      <div className="container">
        <header className="journey__head">
          <p className="eyebrow">{t.timelineSection.eyebrow}</p>
          <h2>{t.timelineSection.title}</h2>
          <p className="lead">{t.timelineSection.lead}</p>
        </header>

        <ol className="journey__list" ref={listRef}>
          <li className="journey__spine" aria-hidden="true">
            <span className="journey__spine-fill" />
          </li>

          {timeline.map((step, index) => {
            const composition = COMPOSITIONS[index % COMPOSITIONS.length];
            const { start, end } = splitYear(step.year);
            const isLast = index === timeline.length - 1;
            const panelClass = {
              plain: '',
              pink: 'band band--pink',
              dashed: 'step__body--dashed',
              wine: 'band band--wine',
              lemon: 'band band--lemon',
            }[composition.panel];

            return (
              <li
                key={`${step.year}-${step.title.fr}`}
                ref={(node) => {
                  stepRefs.current[index] = node;
                }}
                data-index={index}
                className={[
                  'step',
                  revealed.has(index) ? 'is-in' : '',
                  `step--${composition.side}`,
                  `step--year-${composition.year}`,
                  index <= current ? 'is-passed' : '',
                  index === current ? 'is-current' : '',
                  isLast ? 'is-ongoing' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="step__marker" aria-hidden="true" />

                <p className="step__year">
                  <span className="step__year-main">{start}</span>
                  {end && <span className="step__year-end">– {end}</span>}
                </p>

                <div className={`step__body ${panelClass}`}>
                  <h3>{step.title[lang]}</h3>
                  <p className="step__place">{step.place[lang]}</p>
                  <p className="step__text">{step.description[lang]}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="journey__learning">
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
      </div>
    </section>
  );
}