import projects from '../data/projects';
import { useLanguage } from '../i18n/LanguageContext';
import './Projects.css';

function splitTitle(title) {
  // "Numera : jeu de devinette" -> nom court en gros, précision en petit.
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

function ProjectCard({ project, index, t, lang }) {
  const { name, kicker } = splitTitle(project.title);
  const copy = t.projectsSection;

  return (
    <li className="projects__item">
      <article className={`project band band--${project.theme}`}>
        <div className="project__media">
          <img
            src={project.image}
            alt=""
            width="680"
            height="720"
            loading="lazy"
            decoding="async"
          />
          <span className="project__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <span className="project__year">{project.year}</span>
        </div>

        <div className="project__body">
          {kicker && <p className="project__kicker">{kicker}</p>}
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
              <a
                className="btn btn--solid"
                href={project.demo}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={copy.demoLabel(name)}
              >
                {copy.demo} <span aria-hidden="true">↗</span>
              </a>
            )}
            {project.github && (
              <a
                className="btn btn--line"
                href={project.github}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={copy.codeLabel(name)}
              >
                {copy.code}
              </a>
            )}
          </div>
        </div>
      </article>
    </li>
  );
}

export default function Projects() {
  const { t, lang } = useLanguage();

  return (
    <section id="projects" className="section projects band">
      <div className="container">
        <header className="projects__head">
          <p className="eyebrow">{t.projectsSection.eyebrow}</p>
          <h2>{t.projectsSection.title}</h2>
          <p className="lead">{projects.length ? t.projectsSection.lead : t.projectsSection.empty}</p>
        </header>

        {projects.length > 0 && (
          <ul className="projects__grid">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} t={t} lang={lang} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
