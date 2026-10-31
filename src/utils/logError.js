// Point d'entrée unique pour tracer les erreurs du site.
// Aujourd'hui : console du navigateur.

const seen = new Set();

export function logError(error, context = 'app') {
  const message = error instanceof Error ? error.message : String(error);
  const key = `${context}:${message}`;

  // Évite de répéter 500 fois la même erreur si elle se déclenche en boucle.
  if (seen.has(key)) return;
  seen.add(key);

  console.error(`[${context}]`, error);

}

export function installGlobalErrorLogging() {
  window.addEventListener('error', (event) => {
    logError(event.error || event.message, 'window.error');
  });
  window.addEventListener('unhandledrejection', (event) => {
    logError(event.reason, 'unhandledrejection');
  });
}
