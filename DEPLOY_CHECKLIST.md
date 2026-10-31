# Checklist avant mise en ligne

Basée sur la vidéo "20 choses à faire avant de mettre ton site vibecodé en ligne".
Ton portfolio est un site statique (pas de base de données, pas d'API payante) :
certains points ne s'appliquent donc pas. Voici l'état de chacun.

Les points 10 et 20 sont coupés sur ta capture d'écran : relis la vidéo pour
vérifier qu'ils sont bien couverts par ce qui est indiqué ici.

| # | Point de la vidéo | État | Où |
|---|---|---|---|
| 1 | Nombre de requêtes | Fait | Un seul envoi à la fois, 3 par heure et par session (`Contact.jsx`) |
| 2 | Plafonner les appels API | Fait | Seule API : Formspree. Délai de 30 s entre deux envois |
| 3 | Plafonner les dépenses | À faire | Sur formspree.io, vérifie le quota du plan gratuit et active les alertes de quota |
| 4 | Message quand ça plante | Fait | `ErrorBoundary.jsx` : message au lieu d'une page blanche |
| 5 | Afficher un chargement | Fait | Bouton "Envoi...", scène 3D chargée à part (`Suspense`) |
| 6 | Prévoir le cas "affichage vide" | Fait | Message si la liste de projets est vide (`Projects.jsx`) |
| 7 | Requêtes qui échouent | Fait | Messages distincts : hors ligne, trop long, quota, erreur serveur |
| 8 | API qui ne répondent pas | Fait | Délai maximum de 10 s (`AbortController`) |
| 9 | Double clic sur "Envoyer" | Fait | Verrou immédiat (`inFlight`) en plus du bouton désactivé |
| 10 | (coupé sur la capture) | Probable : anti-spam | Champ piège invisible `_gotcha` + limites de longueur des champs |
| 11 | Données que tu affiches | Fait | Le site n'affiche que ses propres données, aucune donnée de visiteur |
| 12 | Index (base de données) | Sans objet | Pas de base de données |
| 13 | Découper les listes en pages | Sans objet | 6 projets, 8 certifications : pas besoin |
| 14 | Compresser les fichiers | Fait | Images projets converties en WebP : 2,2 Mo vers environ 110 Ko |
| 15 | Limiter le poids des fichiers | Fait / sans objet | Pas d'upload. Message limité à 2000 caractères |
| 16 | Garder en mémoire (cache) | Fait | `vercel.json` : cache d'un an sur les fichiers `/assets` (noms hachés par Vite) |
| 17 | Alerte si le site tombe | À faire | Crée un moniteur gratuit sur UptimeRobot ou Better Stack avec l'URL du site |
| 18 | Tracer chaque erreur | Partiel | `logError.js` capte toutes les erreurs. Branche Sentry (plan gratuit) dans ce fichier pour les recevoir en production |
| 19 | Plusieurs visiteurs en même temps | Fait | Site statique servi par CDN. La 3D est chargée à part |
| 20 | (coupé : "...restaure") | À faire | Le code est sur GitHub. Teste de cloner le dépôt dans un dossier vide et de lancer `npm install && npm run build` |

## Nettoyage restant

```bash
npm uninstall @emailjs/browser   # dépendance inutilisée, à retirer puis commit du package-lock.json
npm run build                    # doit passer sans erreur
npm run preview                  # vérifie le site en local avant de pousser
```
