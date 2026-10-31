import { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { logError } from '../utils/logError';
import BowTieSvg from './intro/BowTieSvg';
import Welcome from './intro/Welcome';
import Signature from './Signature';
import './Intro.css';

// Séquence : une porte fermée par un nœud papillon.
//   1. closed   : la porte est fermée, le nœud est en place
//   2. untying  : le nœud se défait
//   3. opening  : les deux panneaux s'ouvrent
//   4. welcome  : la mascotte accueille le visiteur
//   5. leaving  : fondu de sortie (quand on passe l'intro)
//
// Deux rendus, choisis automatiquement :
//  - "three" : panneaux et nœud en 3D (Three.js), sur ordinateur avec WebGL.
//  - "css"   : mêmes éléments en CSS/SVG. Mobile, tablette, pas de WebGL, ou
//              si la 3D échoue ou met trop de temps (repli automatique).
// Pas d'intro si la personne préfère réduire les animations, si elle l'a déjà
// vue pendant la visite, ou si elle arrive par un lien direct vers une section.

const SEEN_KEY = 'portfolio-intro-seen';
const HOLD_MS = 800;
const UNTIE_MS = 1500;
const CSS_OPEN_MS = 1250;
const THREE_TIMEOUT_MS = 4000;
const LEAVE_MS = 380;

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export function canReplayIntro() {
  return typeof window !== 'undefined' && !prefersReducedMotion();
}

export function shouldPlayIntro() {
  if (typeof window === 'undefined') return false;
  if (prefersReducedMotion()) return false;
  if (window.location.hash) return false;
  try {
    if (window.sessionStorage.getItem(SEEN_KEY) === '1') return false;
  } catch {
    /* stockage indisponible : on joue l'intro */
  }
  return true;
}

export function resetIntroSeen() {
  try {
    window.sessionStorage.removeItem(SEEN_KEY);
  } catch {
    /* rien à faire */
  }
}

function markIntroSeen() {
  try {
    window.sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    /* rien à faire */
  }
}

function canUse3D() {
  if (window.matchMedia?.('(max-width: 820px)').matches) return false;
  if (window.matchMedia?.('(pointer: coarse)').matches) return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function Intro({ onDone }) {
  const { t } = useLanguage();
  const [mode, setMode] = useState(() => (canUse3D() ? 'three' : 'css'));
  const [sceneReady, setSceneReady] = useState(mode !== 'three');
  const [phase, setPhase] = useState('closed');
  const hostRef = useRef(null);
  const sceneRef = useRef(null);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    sceneRef.current?.dispose();
    sceneRef.current = null;
    markIntroSeen();
    onDone();
  }, [onDone]);

  const skip = useCallback(() => {
    if (doneRef.current) return;
    setPhase('leaving');
    window.setTimeout(finish, LEAVE_MS);
  }, [finish]);

  // Fin de l'accueil : on libère le site, puis on va où le visiteur l'a choisi.
  const closeWelcome = useCallback(
    (targetId) => {
      finish();
      if (targetId && targetId !== 'top') {
        window.setTimeout(() => {
          document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      }
    },
    [finish]
  );

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') skip();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [skip]);

  // Rendu CSS : enchaîne les phases avec des minuteries.
  useEffect(() => {
    if (mode !== 'css') return undefined;
    const timers = [
      window.setTimeout(() => setPhase('untying'), HOLD_MS),
      window.setTimeout(() => setPhase('opening'), HOLD_MS + UNTIE_MS),
      window.setTimeout(() => setPhase('welcome'), HOLD_MS + UNTIE_MS + CSS_OPEN_MS + 50),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [mode]);

  // Rendu 3D : Three.js est chargé à ce moment seulement.
  useEffect(() => {
    if (mode !== 'three') return undefined;

    let cancelled = false;
    let openTimer = 0;

    const fallbackToCss = (reason) => {
      if (cancelled) return;
      logError(reason, 'intro-3d');
      sceneRef.current?.dispose();
      sceneRef.current = null;
      setSceneReady(true);
      setMode('css');
    };

    const timeout = window.setTimeout(() => {
      if (!sceneRef.current) fallbackToCss(new Error('Scène 3D trop lente : repli CSS'));
    }, THREE_TIMEOUT_MS);

    import('./intro/panelsScene.js')
      .then(({ createPanelsScene }) => createPanelsScene(hostRef.current))
      .then((scene) => {
        if (cancelled) {
          scene.dispose();
          return;
        }
        window.clearTimeout(timeout);
        sceneRef.current = scene;
        setSceneReady(true);

        openTimer = window.setTimeout(async () => {
          if (cancelled) return;
          setPhase('untying');
          await scene.untie();
          if (cancelled) return;
          setPhase('opening');
          await scene.open();
          if (cancelled) return;
          scene.dispose();
          sceneRef.current = null;
          setPhase('welcome');
        }, HOLD_MS);
      })
      .catch(fallbackToCss);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      window.clearTimeout(openTimer);
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [mode]);

  const classes = [
    'intro',
    `intro--${mode}`,
    sceneReady ? 'is-ready' : '',
    phase === 'untying' ? 'is-untying' : '',
    phase === 'opening' ? 'is-untying is-open' : '',
    phase === 'welcome' ? 'is-untying is-open is-welcome' : '',
    phase === 'leaving' ? 'is-leaving' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} role="dialog" aria-modal="true" aria-label={t.intro.label}>
      {mode === 'css' && (
        <>
          <div className="intro__panel intro__panel--left" />
          <div className="intro__panel intro__panel--right" />
          <div className="intro__bow">
            <BowTieSvg />
          </div>
        </>
      )}

      {mode === 'three' && (
        <>
          <div className="intro__curtain" />
          <div className="intro__canvas" ref={hostRef} />
        </>
      )}

      <div className="intro__title">
        <Signature className="intro__sig" />
        <p className="intro__tag">{t.intro.tag}</p>
      </div>

      {phase !== 'welcome' && (
        <button type="button" className="intro__skip" onClick={skip} autoFocus>
          {t.intro.skip}
        </button>
      )}

      {phase === 'welcome' && <Welcome onClose={closeWelcome} />}
    </div>
  );
}
