import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import projects from '../data/projects';
import { portfolioProject, projectIdsOf, skills, territories, text } from '../data/skills';
import { useLanguage } from '../i18n/LanguageContext';
import './Skills.css';

// Carte d'exploration. Données : src/data/skills.js. Libellés : translations.js,
// clé "skillsSection".
//
// Un seul "focus" à la fois, venu du survol ou de la sélection :
//   { kind: 'skill', id }    une technologie : ses projets s'allument
//   { kind: 'project', id }  un projet : ses technologies s'allument
// Des lignes fines relient les éléments allumés.

function shortTitle(title) {
  return title.split(' : ')[0];
}

const lineStyles = { under: 'skills-line__under', over: 'skills-line__over' };

export default function Skills() {
  const { t, lang } = useLanguage();
  const copy = t.skillsSection;

  const wrapRef = useRef(null);
  const tagRefs = useRef({});
  const chipRefs = useRef({});

  const [selected, setSelected] = useState({ kind: 'skill', id: 'react' });
  const [hovered, setHovered] = useState(null);
  const [lines, setLines] = useState([]);
  const [layoutTick, setLayoutTick] = useState(0);

  // Les projets de la carte : ceux de projects.js, plus ce portfolio.
  const labProjects = useMemo(
    () => [
      ...projects.map((project) => ({
        id: project.id,
        title: shortTitle(project.title),
        tagline: project.tagline,
        year: project.year,
        url: project.demo || project.github,
        external: true,
        stack: project.stack,
      })),
      { ...portfolioProject, title: portfolioProject.title, external: false },
    ],
    []
  );

  const projectTitle = (project) => text(project.title, lang);

  const skillLinks = useMemo(
    () => Object.fromEntries(skills.map((skill) => [skill.id, projectIdsOf(skill, labProjects)])),
    [labProjects]
  );

  const active = hovered || selected;

  // Ce qui est allumé selon le focus.
  const lit = useMemo(() => {
    if (!active) return { skillIds: [], projectIds: [] };
    if (active.kind === 'skill') return { skillIds: [active.id], projectIds: skillLinks[active.id] || [] };
    return {
      skillIds: skills.filter((skill) => (skillLinks[skill.id] || []).includes(active.id)).map((skill) => skill.id),
      projectIds: [active.id],
    };
  }, [active, skillLinks]);

  const pairs = useMemo(
    () => lit.skillIds.flatMap((skillId) => lit.projectIds.filter((id) => (skillLinks[skillId] || []).includes(id)).map((projectId) => [skillId, projectId])),
    [lit, skillLinks]
  );

  // Mesure des positions pour tracer les lignes (ordinateur seulement).
  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap || window.matchMedia('(max-width: 860px)').matches) {
      setLines([]);
      return;
    }
    const box = wrap.getBoundingClientRect();
    const next = pairs
      .map(([skillId, projectId]) => {
        const a = tagRefs.current[skillId]?.getBoundingClientRect();
        const b = chipRefs.current[projectId]?.getBoundingClientRect();
        if (!a || !b) return null;
        const x1 = a.left + a.width / 2 - box.left;
        const y1 = a.bottom - box.top;
        const x2 = b.left + b.width / 2 - box.left;
        const y2 = b.top - box.top - 5;
        const dy = Math.max(60, Math.abs(y2 - y1) * 0.5);
        return { key: `${skillId}-${projectId}`, x1, y1, x2, y2, d: `M${x1} ${y1} C${x1} ${y1 + dy} ${x2} ${y2 - dy} ${x2} ${y2}` };
      })
      .filter(Boolean);
    setLines(next);
  }, [pairs]);

  useLayoutEffect(() => {
    measure();
  }, [measure, layoutTick, lang]);

  // Re-mesure si la taille change ou quand les polices sont chargées.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return undefined;
    const bump = () => setLayoutTick((value) => value + 1);
    const observer = new ResizeObserver(bump);
    observer.observe(wrap);
    window.addEventListener('resize', bump);
    document.fonts?.ready.then(bump);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', bump);
    };
  }, []);

  const toggleSkill = (id) =>
    setSelected((current) => (current?.kind === 'skill' && current.id === id ? null : { kind: 'skill', id }));

  const focusSkill = (id) => setHovered({ kind: 'skill', id });
  const focusProject = (id) => setHovered({ kind: 'project', id });
  const clearHover = () => setHovered(null);

  // ---------- Fiche ----------
  const activeSkill = active?.kind === 'skill' ? skills.find((skill) => skill.id === active.id) : null;
  const activeProject = active?.kind === 'project' ? labProjects.find((project) => project.id === active.id) : null;
  const territoryOf = (id) => territories.find((territory) => territory.id === id);

  const renderProjectLink = (project) => (
    <li key={project.id}>
      <a
        href={project.url}
        {...(project.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
        aria-label={project.external ? `${projectTitle(project)} (${copy.newTab})` : projectTitle(project)}
      >
        {projectTitle(project)} <span aria-hidden="true">{project.external ? '↗' : '↑'}</span>
      </a>
    </li>
  );

  let fiche;
  if (activeSkill) {
    const territory = territoryOf(activeSkill.territory);
    const related = labProjects.filter((project) => (skillLinks[activeSkill.id] || []).includes(project.id));
    fiche = (
      <>
        <p className={`fiche__zone fiche__zone--${territory.id}`}>{text(territory.name, lang)}</p>
        <h3 className="fiche__title">{text(activeSkill.name, lang)}</h3>
        <p className="fiche__usage">{text(activeSkill.usage, lang)}</p>
        {territory.caution && <p className="fiche__caution">{text(territory.caution, lang)}</p>}
        <div className="fiche__block">
          <p className="fiche__label">{copy.presentIn}</p>
          {related.length > 0 ? <ul className="fiche__links">{related.map(renderProjectLink)}</ul> : <p className="fiche__none">{copy.noProject}</p>}
        </div>
      </>
    );
  } else if (activeProject) {
    const techs = skills.filter((skill) => (skillLinks[skill.id] || []).includes(activeProject.id));
    fiche = (
      <>
        <p className="fiche__zone">{copy.projectLabel}</p>
        <h3 className="fiche__title">{projectTitle(activeProject)}</h3>
        <p className="fiche__usage">{text(activeProject.tagline, lang)}</p>
        <div className="fiche__block">
          <p className="fiche__label">{copy.usedTechs}</p>
          <ul className="fiche__links">
            {techs.map((skill) => (
              <li key={skill.id}>
                <button type="button" onClick={() => setSelected({ kind: 'skill', id: skill.id })}>
                  {text(skill.name, lang)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  } else {
    fiche = (
      <>
        <p className="fiche__zone">{copy.idleZone}</p>
        <h3 className="fiche__title">{copy.idleTitle}</h3>
        <p className="fiche__usage">{copy.idleText}</p>
      </>
    );
  }

  const isLit = (kind, id) => (kind === 'skill' ? lit.skillIds.includes(id) : lit.projectIds.includes(id));
  const dimmed = (kind, id) => Boolean(active) && !isLit(kind, id);

  return (
    <section id="skills" className="section skills band">
      <div className="container">
        <header className="skills__head">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 className="skills__title">{copy.title}</h2>
          <p className="skills__stamp" aria-hidden="true">{copy.stamp}</p>
          <p className="lead skills__lead">{copy.lead}</p>
          <p className="skills__hint">{copy.hint}</p>
        </header>

        <div className="lab" ref={wrapRef}>
          <div className="lab__map" role="group" aria-label={copy.mapLabel}>
            {territories.map((territory, index) => (
              <section key={territory.id} className={`territory territory--${territory.id}`} aria-labelledby={`territory-${territory.id}`}>
                <header className="territory__head">
                  <span className="territory__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <h3 id={`territory-${territory.id}`} className="territory__name">{text(territory.name, lang)}</h3>
                  <p className="territory__status">{text(territory.status, lang)}</p>
                </header>

                <ul className="territory__tags">
                  {skills
                    .filter((skill) => skill.territory === territory.id)
                    .map((skill) => {
                      const count = (skillLinks[skill.id] || []).length;
                      const isSelected = selected?.kind === 'skill' && selected.id === skill.id;
                      const classes = ['tag', isLit('skill', skill.id) ? 'is-lit' : '', isSelected ? 'is-selected' : '', dimmed('skill', skill.id) ? 'is-dim' : '']
                        .filter(Boolean)
                        .join(' ');
                      return (
                        <li key={skill.id}>
                          <button
                            type="button"
                            className={classes}
                            ref={(node) => {
                              tagRefs.current[skill.id] = node;
                            }}
                            aria-pressed={isSelected}
                            onClick={() => toggleSkill(skill.id)}
                            onMouseEnter={() => focusSkill(skill.id)}
                            onMouseLeave={clearHover}
                            onFocus={() => focusSkill(skill.id)}
                            onBlur={clearHover}
                          >
                            {text(skill.name, lang)}
                            {count > 0 && (
                              <>
                                <sup className="tag__count" aria-hidden="true">
                                  {count}
                                  <span className="tag__more">{`\u00a0${copy.projectsWord(count)}`}</span>
                                </sup>
                                <span className="visually-hidden">, {count} {copy.projectsWord(count)}</span>
                              </>
                            )}
                          </button>
                        </li>
                      );
                    })}
                </ul>
              </section>
            ))}
          </div>

          <aside className="fiche" aria-live="polite">
            {fiche}
          </aside>

          <div className="notebook">
            <p className="notebook__label">{copy.notebook}</p>
              <ul className="notebook__list">
                {labProjects.map((project, index) => (
                  <li key={project.id}>
                    <a
                      href={project.url}
                      {...(project.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                      className={['chip', isLit('project', project.id) ? 'is-lit' : '', dimmed('project', project.id) ? 'is-dim' : ''].filter(Boolean).join(' ')}
                      ref={(node) => {
                        chipRefs.current[project.id] = node;
                      }}
                      onMouseEnter={() => focusProject(project.id)}
                      onMouseLeave={clearHover}
                      onFocus={() => focusProject(project.id)}
                      onBlur={clearHover}
                      aria-label={project.external ? `${projectTitle(project)} (${copy.newTab})` : projectTitle(project)}
                    >
                      <span className="chip__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                      <span className="chip__title">{projectTitle(project)}</span>
                      <span className="chip__arrow" aria-hidden="true">{project.external ? '↗' : '↑'}</span>
                    </a>
                  </li>
                ))}
              </ul>
          </div>

          <svg className="lab__lines" aria-hidden="true" focusable="false">
            {lines.map((line) => (
              <g key={line.key} className="skills-line">
                <path className={lineStyles.under} d={line.d} pathLength="1" />
                <path className={lineStyles.over} d={line.d} pathLength="1" />
                <circle className="skills-line__dot" cx={line.x1} cy={line.y1} r="5" />
                <circle className="skills-line__dot" cx={line.x2} cy={line.y2} r="5" />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}