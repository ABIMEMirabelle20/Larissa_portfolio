# Portfolio de Mirabelle ABIME

React 19, Vite, Three.js (introduction uniquement). Français et anglais, thème clair (ivoire) et sombre (prune).

```bash
npm install
npm run dev       # développement
npm run build     # production
npm run preview   # tester le build
```

Avant une mise en ligne, suis `DEPLOY_CHECKLIST.md`.

## Identité visuelle

Cinq couleurs seulement, définies dans `src/styles/variables.css` :
bordeaux `#581C35`, rose poudré `#F4C2D7`, jaune citron `#E8FF54`, ivoire `#FFF9F0`, prune `#24131F`.
Chaque section choisit sa couleur de fond avec une classe (`band--wine`, `band--pink`, `band--plum`, `band--lemon`),
et les couleurs de texte, de lignes et d'accent se recalculent toutes seules.

## Où modifier quoi

| Je veux changer... | Fichier |
|---|---|
| Tous les textes (FR/EN) | `src/i18n/translations.js` |
| Les projets (et leur couleur) | `src/data/projects.js` |
| Les événements (section "Au-delà du code") | `src/data/events.js` |
| Les compétences et leur niveau | `src/data/skills.js` |
| Les étapes du parcours | `src/data/timeline.js` |
| Les chiffres (certifications, années, lignes de code) | `src/data/certifications.js` |
| Ma photo | déposer `portrait.jpg` (ou png, webp) dans `src/assets/` |
| Le formulaire de contact | `src/components/Contact.jsx` (Formspree) |

## L'introduction

Une porte fermée par un nœud papillon : le nœud se défait, les deux panneaux s'ouvrent, puis une mascotte accueille le visiteur
(`src/components/Intro.jsx`). Deux rendus, choisis automatiquement : 3D (Three.js) sur ordinateur avec WebGL ;
CSS/SVG sur mobile, sans WebGL, ou si la 3D échoue. Aucune intro si la personne préfère réduire les animations.
Bouton « Passer l'intro » et touche Échap dans tous les cas.

Les panneaux peuvent venir de Blender : `tools/blender/build_panels.py` génère `public/models/panels.glb`, que le site utilise s'il existe.
Le nœud papillon 3D est généré par le code (`src/components/intro/panelsScene.js`).

## La mascotte

Dessin 2D en SVG (`src/components/Mascot.jsx`), réglé dans `src/data/mascot.js` : teint, cheveux, coiffure, tenue, lunettes.
Une illustration déposée dans `src/assets/` sous le nom `mascot.png` (ou `.webp`, `.svg`, `.jpg`) remplace le dessin.

## Dépendances

Le site n'utilise plus que `react`, `react-dom` et `three`. Pour retirer les anciennes
dépendances devenues inutiles (et mettre à jour `package-lock.json`) :

```bash
npm uninstall @emailjs/browser @react-three/drei @react-three/fiber framer-motion gsap react-icons
```
