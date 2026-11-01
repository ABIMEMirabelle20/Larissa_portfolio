import { useCallback, useEffect, useRef, useState } from 'react';
import projects from '../data/projects';
import { useLanguage } from '../i18n/LanguageContext';
import './Projects.css';

const pad = (value) => String(value).padStart(2, '0');

// "Numera : jeu de devinette" -> nom court en grand, précision en petit.
function splitTitle(title) {
  const [name, ...rest] = title.split(' : ');
  return { name, kicker: rest.join(' : ') };
}

function Fact({ label, children }) {
  if (!children) return null;
  return (
    <div className="project__fact">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function ProjectCard({ project, index, total, variant, isMain, copy, lang, itemRef }) {
  const { name, kicker } = splitTitle(project.title);

  return (
    <li
      ref={itemRef}
      className={`projects__item projects__item--${variant}`}
      role="group"
      aria-roledescription="slide"
      aria-label={copy.slide(index + 1, total)}
    >
      <div className="projects__tilt">
        <article className={`project project--${variant} band band--${project.theme}`}>
          <div className="project__media">
            <img src={project.image} alt="" width="680" height="720" loading="lazy" decoding="async" />
            <span className="project__year">{project.year}</span>
            {isMain && <span className="project__main">{copy.main}</span>}
          </div>

          <div className="project__body">
            <p className="project__top">
              <span className="project__num" aria-hidden="true">{pad(index + 1)}</span>
              {kicker && <span className="project__kicker">{kicker}</span>}
            </p>
            <h3 className="project__title">{name}</h3>
            <p className="project__tagline">{project.tagline[lang]}</p>

            <dl className="project__facts">
              <Fact label={copy.problem}>{project.problem?.[lang]}</Fact>
              <Fact label={copy.project}>{project.description[lang]}</Fact>
              <Fact label={copy.role}>{project.role?.[lang]}</Fact>
              <Fact label={copy.result}>{project.result?.[lang]}</Fact>
            </dl>

            <ul className="project__stack" aria-label={copy.stack}>
              {project.stack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>

            <div className="project__links">
              {project.demo && (
                <a className="btn btn--solid" href={project.demo} target="_blank" rel="noreferrer noopener" aria-label={copy.demoLabel(name)}>
                  {copy.demo} <span aria-hidden="true">↗</span>
                </a>
              )}
              {project.github && (
                <a className="btn btn--line" href={project.github} target="_blank" rel="noreferrer noopener" aria-label={copy.codeLabel(name)}>
                  {copy.code}
                </a>
              )}
            </div>
          </div>
        </article>
      </div>
    </li>
  );
}

function Arrow({ direction }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={direction === 'prev' ? 'M19 12H5M11 6l-6 6 6 6' : 'M5 12h14M13 6l6 6-6 6'} />
    </svg>
  );
}

export default function Projects() {
  const { t, lang } = useLanguage();
  const copy = t.projectsSection;
  const total = projects.length;

  const trackRef = useRef(null);
  const itemRefs = useRef([]);
  const [active, setActive] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Projet principal : celui marqué "featured: true" dans projects.js, sinon le premier.
  const mainIndex = Math.max(
    0,
    projects.findIndex((project) => project.featured)
  );

  // Les cartes alternent trois formats : principale (large), haute (en arche), large.
  const variantFor = (index) => (index === mainIndex ? 'feature' : index % 2 === 1 ? 'tall' : 'wide');

  // Position du carrousel : projet actif, et "profondeur" de chaque carte
  // (--d : écart signé au centre, --a : écart absolu), utilisés par le CSS.
  const update = useCallback(() => {
    const track = trackRef.current;
    const items = itemRefs.current.filter(Boolean);
    if (!track || items.length === 0) return;

    const edge = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    const half = track.clientWidth / 2;
    let best = 0;
    let bestDistance = Infinity;

    items.forEach((item, index) => {
      const left = item.offsetLeft - track.scrollLeft;
      const distance = Math.abs(left - edge);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = index;
      }
      const d = Math.max(-1.5, Math.min(1.5, (left + item.offsetWidth / 2 - half) / half));
      item.style.setProperty('--d', d.toFixed(3));
      item.style.setProperty('--a', Math.min(Math.abs(d), 1).toFixed(3));
    });

    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    setActive(atEnd ? items.length - 1 : best);
    if (track.scrollLeft > 12) setHasScrolled(true);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    let frame = 0;
    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          update();
        });
      }
    };

    update();
    track.addEventListener('scroll', onScroll, { passive: true });
    const observer = new ResizeObserver(onScroll);
    observer.observe(track);
    document.fonts?.ready.then(onScroll);

    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, [update]);

  const goTo = useCallback((index) => {
    const track = trackRef.current;
    const items = itemRefs.current.filter(Boolean);
    if (!track || items.length === 0) return;
    const target = items[Math.max(0, Math.min(items.length - 1, index))];
    const edge = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollTo({ left: target.offsetLeft - edge, behavior: reduce ? 'auto' : 'smooth' });
  }, []);

  const onKeyDown = (event) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(active + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(active - 1);
    }
  };

  return (
    <section id="projects" className="section projects band">
      <div className="container">
        <header className="projects__head">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2>{copy.title}</h2>
          <p className="lead">{total ? copy.lead : copy.empty}</p>
        </header>

        {total > 0 && (
          <div className="projects__controls">
            <p className="projects__counter" aria-live="polite">
              <span className="projects__current" key={active}>{pad(active + 1)}</span>
              <span className="projects__total"> / {pad(total)}</span>
            </p>

            <div className="projects__progress" aria-hidden="true">
              <span style={{ transform: `scaleX(${(active + 1) / total})` }} />
            </div>

            <div className="projects__arrows">
              <button type="button" className="projects__arrow" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label={copy.prev}>
                <Arrow direction="prev" />
              </button>
              <button type="button" className="projects__arrow" onClick={() => goTo(active + 1)} disabled={active === total - 1} aria-label={copy.next}>
                <Arrow direction="next" />
              </button>
            </div>
          </div>
        )}
      </div>

      {total > 0 && (
        <div className="projects__stage">
          <p className={`projects__hint ${hasScrolled ? 'is-gone' : ''}`} aria-hidden="true">
            {copy.swipe} <span>→</span>
          </p>
          <ul
            className="projects__track"
            ref={trackRef}
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label={copy.carousel}
            onKeyDown={onKeyDown}
          >
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                total={total}
                variant={variantFor(index)}
                isMain={index === mainIndex}
                copy={copy}
                lang={lang}
                itemRef={(node) => {
                  itemRefs.current[index] = node;
                }}
              />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}