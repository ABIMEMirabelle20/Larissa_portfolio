import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import Mascot from '../Mascot';

const TYPE_SPEED_MS = 22;

// Le texte s'écrit lettre par lettre. Un clic sur la bulle l'affiche en entier.
function useTypewriter(text) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    const timer = window.setInterval(() => {
      setCount((value) => {
        if (value >= text.length) {
          window.clearInterval(timer);
          return value;
        }
        return value + 1;
      });
    }, TYPE_SPEED_MS);
    return () => window.clearInterval(timer);
  }, [text]);

  return { shown: text.slice(0, count), done: count >= text.length, finish: () => setCount(text.length) };
}

// Accueil par la mascotte : trois phrases, puis le choix d'un point de départ.
export default function Welcome({ onClose }) {
  const { t } = useLanguage();
  const copy = t.welcome;
  const [step, setStep] = useState(0);
  const isEnding = step >= copy.steps.length;
  const text = isEnding ? copy.ending : copy.steps[step];
  const { shown, done, finish } = useTypewriter(text);
  const nextRef = useRef(null);

  useEffect(() => {
    nextRef.current?.focus();
  }, [step, done]);

  return (
    <div className="welcome" role="region" aria-label={copy.name}>
      <div className="welcome__stage">
        <div className="welcome__mascot">
          <Mascot talking={!done} waving={step === 0} />
        </div>

        <div className="welcome__bubble" onClick={finish}>
          <p className="welcome__name">{copy.name}</p>
          <p className="welcome__text" aria-live="polite">
            <span className="visually-hidden">{text}</span>
            {/* Le texte complet, invisible, réserve la hauteur : la bulle ne saute pas pendant l'écriture. */}
            <span className="welcome__ghost" aria-hidden="true">{text}</span>
            <span className="welcome__live" aria-hidden="true">{shown}</span>
          </p>

          {isEnding ? (
            <div className="welcome__choices">
              {copy.choices.map((choice, index) => (
                <button
                  key={choice.id}
                  type="button"
                  className={`btn ${index === 0 ? 'btn--solid' : 'btn--line'}`}
                  ref={index === 0 ? nextRef : undefined}
                  onClick={() => onClose(choice.id)}
                >
                  {choice.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="welcome__actions">
              <ol className="welcome__dots" aria-hidden="true">
                {copy.steps.map((_, index) => (
                  <li key={index} className={index === step ? 'is-current' : ''} />
                ))}
              </ol>
              <button type="button" className="welcome__skip" onClick={() => onClose(null)}>
                {copy.skip}
              </button>
              <button type="button" className="btn btn--solid" ref={nextRef} onClick={() => (done ? setStep(step + 1) : finish())}>
                {copy.next}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
