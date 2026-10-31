// Chaque projet : titre, accroche et description bilingues ({ fr, en }), stack,
// image, liens et couleur de carte (wine, pink, plum ou lemon).
// problem, role et result sont optionnels ({ fr, en } ou null) : un champ à
// null n'est pas affiché.

import smartCalculatorImg from '../assets/projects/smart-calculator.webp';
import WeatherApp from '../assets/projects/weather.webp';
import numera from '../assets/projects/numera.webp';
import niceCreation from '../assets/projects/nice-creation.webp';
import pokedex from '../assets/projects/pokedex.webp';
import personalFinance from '../assets/projects/personal-finance.webp';


const projects = [
  {
    id: 'perso-1',
    theme: 'wine',
    problem: null,
    role: null,
    result: null,
    title: 'Smart-Calculator',
    tagline: {
      fr: "Plus qu'une calculatrice, un outil intelligent.",
      en: 'More than a calculator: an intelligent tool.',
    },
    description: {
      fr: "Une calculatrice moderne développée avec HTML, CSS et JavaScript. Ce projet va bien au-delà d'une calculatrice classique en proposant une interface élégante, une expérience utilisateur fluide et de nombreuses fonctionnalités avancées.",
      en: 'A modern calculator built with HTML, CSS and JavaScript. It goes far beyond a classic calculator, with an elegant interface, a smooth user experience and many advanced features.',
    },
    year: '2025 · 2026',
    stack: ['Html', 'CSS', 'JS'],
    image: smartCalculatorImg,
    github: 'https://github.com/ABIMEMirabelle20/Calculatrice_JS.git',
    demo: 'https://abimemirabelle20.github.io/Calculatrice_JS/',
  },

  {
    id: 'perso-2',
    theme: 'pink',
    problem: null,
    role: null,
    result: null,
    title: 'Weather_app',
    tagline: {
      fr: 'La météo prend vie en 3D, en temps réel.',
      en: 'Weather comes alive in 3D, in real time.',
    },
    description: {
      fr: "Application météo React couplée à une scène 3D (react-three-fiber) qui réagit aux conditions réelles : soleil animé par ciel clair, nuages qui dérivent, pluie ou neige qui tombent selon la météo du moment. Géolocalisation automatique, prévisions horaires et journalières, sans clé API.",
      en: 'A React weather app paired with a live 3D scene (react-three-fiber) that reacts to real conditions: an animated sun on clear skies, drifting clouds, falling rain or snow depending on the weather. Automatic geolocation, hourly and daily forecasts, no API key required.',
    },
    year: '2026',
    stack: ['React', 'Three.js', 'React Three Fiber', 'Vite'],
    image: WeatherApp,
    github: 'https://github.com/ABIMEMirabelle20/weather_app',
    demo: 'https://weatherapp-indol-nine.vercel.app/',
  },

  {
    id: 'perso-3',
    theme: 'plum',
    problem: null,
    role: null,
    result: null,
    title: 'Numera : jeu de devinette',
    tagline: {
      fr: 'Plus vous approchez, plus ça chauffe.',
      en: 'The closer you get, the hotter it gets.',
    },
    description: {
      fr: "Mini-jeu de devinette avec un radar de proximité animé (du cyan froid à l'or brûlant), 4 niveaux de difficulté, sons générés via Web Audio API et score persistant en local.",
      en: 'A number-guessing game with an animated proximity radar (cold cyan to hot gold), 4 difficulty levels, sounds generated via the Web Audio API, and a locally persisted score.',
    },
    year: '2026',
    stack: ['React', 'Vite', 'Web Audio API', 'CSS3'],
    image: numera,
    github: 'https://github.com/ABIMEMirabelle20/number-guess-game',
    demo: 'https://number-guess-game-green-sigma.vercel.app/',
  },

 

  {
    id: 'perso-4',
    theme: 'lemon',
    problem: null,
    role: null,
    result: null,
    title: 'Nice Crochet : site vitrine',
    tagline: {
      fr: 'Chaque maille a son mot à dire.',
      en: 'Every stitch has something to say.',
    },
    description: {
      fr: "Site vitrine conçu pour une marque de crochet artisanal, où chaque collection raconte une histoire : pièces en édition limitée, commandes sur-mesure suivies pas à pas, et un parcours de formation en ligne pensé pour transmettre le geste, pas seulement le vendre.",
      en: 'A showcase site built for a handmade crochet brand, where every collection tells a story: limited-edition pieces, made-to-order commissions tracked step by step, and an online training path designed to pass on the craft, not just sell it.',
    },
    year: '2026',
    stack: ['React', 'Vite', 'JS', 'CSS'],
    image: niceCreation,
    github: 'https://github.com/ABIMEMirabelle20/Site_Nice_Crochet.git',
    demo: 'https://site-nice-crochet.vercel.app/',
  },

    {
    id: 'perso-5',
    theme: 'wine',
    problem: null,
    role: null,
    result: null,
    title: 'Pokédex : encyclopédie interactive des Pokémon',
    tagline: {
      fr: 'Attrapez-les tous… mais commencez par les trouver.',
      en: 'Find them all… but start by finding them.',
    },
    description: {
      fr: "Une expérience interactive qui transforme l’univers des Pokémon en une exploration dynamique, intuitive et ludique. Les utilisateurs peuvent rechercher des Pokémon par nom, type ou génération, découvrir leurs caractéristiques, évolutions et capacités, et même interagir avec des animations et des effets visuels qui rendent la navigation captivante.",
      en: 'An interactive experience that transforms the world of Pokémon into a dynamic, intuitive, and fun exploration. Users can search for Pokémon by name, type, or generation, discover their characteristics, evolutions, and abilities, and even interact with animations and visual effects that make navigation captivating.',
    },
    year: '2026',
    stack: ['React', 'Vite', 'Three.js'],
    image: pokedex,
    github: 'https://github.com/ABIMEMirabelle20/pokedex_game.git',
    demo: 'https://pokedexgame-alpha.vercel.app/',
  },

   {
    id: 'perso-6',
    theme: 'pink',
    problem: null,
    role: null,
    result: null,
    title: 'Personal Finance Manager : gestionnaire de finances personnelles',
    tagline: {
      fr: 'Chaque centime compte, chaque dépense a son histoire.',
      en: 'Every penny counts, every expense has its story.',
    },
    description: {
      fr: "Une application de gestion financière personnelle qui permet aux utilisateurs de suivre leurs revenus, dépenses et investissements de manière intuitive et efficace. Les utilisateurs peuvent visualiser leurs finances à travers des graphiques interactifs, définir des budgets, recevoir des alertes de dépenses et obtenir des conseils personnalisés pour améliorer leur santé financière.",
      en: 'A personal finance management application that allows users to track their income, expenses, and investments in an intuitive and efficient manner. Users can visualize their finances through interactive charts, set budgets, receive expense alerts, and get personalized advice to improve their financial health.',
    },
    year: '2026',
    stack: ['JS', 'Python', 'PostgreSQL', 'Pandas'],
    image: personalFinance,
    github: 'https://github.com/ABIMEMirabelle20/Personal_finance_manager.git',
    demo: 'https://personal-finance-manager-weld-phi.vercel.app/',
  },

  
];

export default projects;