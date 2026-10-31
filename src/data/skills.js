// Section "Compétences" : carte d'exploration.
//
// Une technologie appartient à UN territoire (champ "territory") :
//   daily       Mon quotidien : le cœur de mon profil
//   practice    En pratique : je pratique, j'approfondis, je mobilise selon les projets
//   exploration En exploration : je l'explore de temps en temps, ce ne sont pas mes bases
// Rien n'est déplacé automatiquement : pour changer une technologie de
// territoire, modifie son champ "territory".
//
// Les liens avec les projets se calculent tout seuls :
//   match : mots de la "stack" de src/data/projects.js (sans tenir compte des
//           majuscules). Ajoute un projet avec "React" dans sa stack : il se
//           relie à React sans rien toucher ici.
//   also  : ids de projets à relier à la main (ex. 'portfolio' pour ce site).
//   allProjects : relie à tous les projets.
// Aucun niveau, aucun pourcentage : seul compte l'usage réel.

export const territories = [
  {
    id: 'daily',
    name: { fr: 'Mon quotidien', en: 'My everyday' },
    status: {
      fr: 'Ce que j’utilise à chaque projet. Le cœur de mon profil.',
      en: 'What I use in every project. The core of my profile.',
    },
  },
  {
    id: 'practice',
    name: { fr: 'En pratique', en: 'In practice' },
    status: {
      fr: 'Ce que je pratique, approfondis ou mobilise selon les projets.',
      en: 'What I practice, deepen or bring in depending on the project.',
    },
  },
  {
    id: 'exploration',
    name: { fr: 'En exploration', en: 'Exploring' },
    status: {
      fr: 'Ce que j’explore et sur quoi je reviens de temps en temps. Ce ne sont pas mes bases.',
      en: 'What I explore and come back to from time to time. These are not my foundations.',
    },
    caution: {
      fr: 'Je l’explore : ce n’est pas l’une de mes spécialités.',
      en: 'I am exploring it: it is not one of my specialties.',
    },
  },
];

// Ce site est un projet comme un autre sur la carte.
export const portfolioProject = {
  id: 'portfolio',
  title: { fr: 'Ce portfolio', en: 'This portfolio' },
  tagline: { fr: 'Le site que tu es en train de parcourir.', en: 'The site you are browsing right now.' },
  url: '#top',
  stack: ['React', 'Vite', 'Three.js', 'CSS', 'JS', 'Html'],
};

export const skills = [
  // ---------- Mon quotidien ----------
  {
    id: 'html',
    name: 'HTML',
    territory: 'daily',
    match: ['html'],
    usage: {
      fr: 'Le socle de mes pages et de mes projets web.',
      en: 'The foundation of my pages and web projects.',
    },
  },
  {
    id: 'css',
    name: 'CSS',
    territory: 'daily',
    match: ['css', 'css3'],
    usage: {
      fr: 'Mise en page, responsive, transitions et animations de mes interfaces.',
      en: 'Layout, responsive design, transitions and animations in my interfaces.',
    },
  },
  {
    id: 'js',
    name: 'JavaScript',
    territory: 'daily',
    match: ['js', 'javascript'],
    usage: {
      fr: 'La logique de mes projets : interactions, état de l’application, appels à des API.',
      en: 'The logic of my projects: interactions, application state, API calls.',
    },
  },
  {
    id: 'react',
    name: 'React',
    territory: 'daily',
    match: ['react'],
    usage: {
      fr: 'Mon outil principal pour construire des interfaces en composants.',
      en: 'My main tool for building component-based interfaces.',
    },
  },
  {
    id: 'git',
    name: 'Git & GitHub',
    territory: 'daily',
    allProjects: true,
    usage: {
      fr: 'Versionner et publier mon code : chaque projet a son dépôt GitHub.',
      en: 'Versioning and publishing my code: every project has its GitHub repository.',
    },
  },
  {
    id: 'vite',
    name: 'Vite',
    territory: 'daily',
    match: ['vite'],
    usage: {
      fr: 'L’outil de développement et de build de mes projets React.',
      en: 'The development and build tool for my React projects.',
    },
  },

  // ---------- En pratique ----------
  {
    id: 'threejs',
    name: 'Three.js',
    territory: 'practice',
    match: ['three.js'],
    usage: {
      fr: 'De la 3D dans le navigateur : scène météo animée, effets visuels, et l’introduction de ce portfolio.',
      en: '3D in the browser: an animated weather scene, visual effects, and this portfolio’s introduction.',
    },
  },
  {
    id: 'r3f',
    name: 'React Three Fiber',
    territory: 'practice',
    match: ['react three fiber'],
    usage: {
      fr: 'Three.js dans React : la scène 3D de Weather Companion.',
      en: 'Three.js inside React: the 3D scene of Weather Companion.',
    },
  },
  {
    id: 'webaudio',
    name: 'Web Audio API',
    territory: 'practice',
    match: ['web audio api'],
    usage: {
      fr: 'Des sons générés directement dans le navigateur, pour le jeu Numera.',
      en: 'Sounds generated directly in the browser, for the game Numera.',
    },
  },
  {
    id: 'python',
    name: 'Python',
    territory: 'practice',
    match: ['python'],
    usage: {
      fr: 'Le côté données de Personal Finance Manager.',
      en: 'The data side of Personal Finance Manager.',
    },
  },
  {
    id: 'pandas',
    name: 'Pandas',
    territory: 'practice',
    match: ['pandas'],
    usage: {
      fr: 'Manipuler et analyser les données financières de Personal Finance Manager.',
      en: 'Handling and analyzing the financial data of Personal Finance Manager.',
    },
  },
  {
    id: 'design-system',
    name: { fr: 'Design system', en: 'Design system' },
    territory: 'practice',
    also: ['portfolio'],
    usage: {
      fr: 'Couleurs, typographies et composants réutilisables : ce portfolio est construit ainsi.',
      en: 'Colors, typography and reusable components: this portfolio is built that way.',
    },
  },
  {
    id: 'ux',
    name: { fr: 'UX et responsive', en: 'UX and responsive' },
    territory: 'practice',
    also: ['portfolio'],
    usage: {
      fr: 'Des interfaces qui s’adaptent à l’ordinateur comme au mobile.',
      en: 'Interfaces that adapt to both desktop and mobile.',
    },
  },
  {
    id: 'a11y',
    name: { fr: 'Performance et accessibilité', en: 'Performance and accessibility' },
    territory: 'practice',
    also: ['portfolio'],
    usage: {
      fr: 'Images compressées, chargement différé, navigation au clavier, mouvement réduit : appliqués à ce portfolio.',
      en: 'Compressed images, lazy loading, keyboard navigation, reduced motion: applied to this portfolio.',
    },
  },

  // ---------- En exploration ----------
  {
    id: 'ai',
    name: { fr: 'Intelligence artificielle', en: 'Artificial intelligence' },
    territory: 'exploration',
    usage: {
      fr: 'Le cap de ma licence (option IA, à l’IFRI). Je commence par Python et Pandas. Aucun projet IA n’est encore publié dans ce portfolio.',
      en: 'The focus of my degree (AI track, at IFRI). I am starting with Python and Pandas. No AI project is published in this portfolio yet.',
    },
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    territory: 'exploration',
    match: ['mongodb'],
    usage: {
      fr: 'Des bases de données NoSQL, que je découvre de temps en temps.',
      en: 'NoSQL databases, which I discover from time to time.',
    },
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    territory: 'exploration',
    match: ['postgresql'],
    usage: {
      fr: 'Des bases de données relationnelles. Il figure dans la stack de Personal Finance Manager.',
      en: 'Relational databases. It appears in the stack of Personal Finance Manager.',
    },
  },
  {
    id: 'docker',
    name: 'Docker',
    territory: 'exploration',
    match: ['docker'],
    usage: {
      fr: 'La conteneurisation, que j’explore de temps en temps.',
      en: 'Containerization, which I explore from time to time.',
    },
  },
  {
    id: 'node',
    name: { fr: 'Node.js et API', en: 'Node.js and APIs' },
    territory: 'exploration',
    match: ['node.js', 'node'],
    usage: {
      fr: 'Mes premiers pas côté serveur et avec les API REST.',
      en: 'My first steps on the server side and with REST APIs.',
    },
  },
  {
    id: 'tests',
    name: { fr: 'Tests (Jest)', en: 'Testing (Jest)' },
    territory: 'exploration',
    match: ['jest'],
    usage: {
      fr: 'Mes premiers pas avec les tests unitaires.',
      en: 'My first steps with unit testing.',
    },
  },
];

// ---------- Utilitaires ----------
export const text = (value, lang) => (typeof value === 'string' ? value : value[lang]);

const normalize = (word) => String(word).trim().toLowerCase();

// Identifiants des projets reliés à une technologie.
export function projectIdsOf(skill, projectList) {
  if (skill.allProjects) return projectList.map((project) => project.id);
  const words = (skill.match || []).map(normalize);
  return projectList
    .filter(
      (project) =>
        (skill.also || []).includes(project.id) ||
        project.stack.some((tech) => words.includes(normalize(tech)))
    )
    .map((project) => project.id);
}