import { useCallback, useEffect, useRef, useState } from 'react';
import Intro, { resetIntroSeen, shouldPlayIntro } from './components/Intro';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Events from './components/Events';
import Timeline from './components/Timeline';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import { useLanguage } from './i18n/LanguageContext';

export default function App() {
  const { t } = useLanguage();
  // L'intro ne se joue qu'une fois par visite, jamais en mouvement réduit.
  const [introDone, setIntroDone] = useState(() => !shouldPlayIntro());

  const introPlayed = useRef(false);

  const handleIntroDone = useCallback(() => {
    introPlayed.current = true;
    setIntroDone(true);
  }, []);

  // Une fois l'intro finie (et le site de nouveau actif), le clavier repart
  // du contenu principal. Le focus ne peut pas être posé avant : tant que
  // le site est "inert", il refuserait de le recevoir.
  useEffect(() => {
    if (introDone && introPlayed.current) {
      introPlayed.current = false;
      document.getElementById('main')?.focus({ preventScroll: true });
    }
  }, [introDone]);

  const replayIntro = useCallback(() => {
    resetIntroSeen();
    window.scrollTo({ top: 0 });
    setIntroDone(false);
  }, []);

  return (
    <>
      {!introDone && <Intro onDone={handleIntroDone} />}

      {/* Pendant l'intro, le site est présent mais inerte (ni clavier, ni
          lecteur d'écran) : l'attention reste sur l'introduction. */}
      <div className="site" inert={!introDone}>
        <a className="skip-link" href="#main">{t.skip}</a>
        <ScrollProgress />
        <Navbar />
        <main id="main" tabIndex={-1}>
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Events />
          <Timeline />
          <Contact />
        </main>
        <Footer onReplayIntro={replayIntro} />
      </div>
    </>
  );
}
