import { useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { logError } from '../utils/logError';
import './Contact.css';

const FORMSPREE_URL = 'https://formspree.io/f/maqrjvqq';

// Garde-fous contre les abus et les pannes (le formulaire est la seule
// "API" du site, et Formspree limite le nombre d'envois du plan gratuit) :
// - 10 s maximum d'attente, puis message d'erreur clair
// - un seul envoi à la fois (même en cas de double clic)
// - 30 s minimum entre deux envois, 3 envois maximum par session
// - un champ piège invisible (_gotcha) que seuls les robots remplissent
const REQUEST_TIMEOUT_MS = 10000;
const COOLDOWN_MS = 30000;
const MAX_PER_SESSION = 3;
const SENT_KEY = 'contact-sent-log';

function readSentLog() {
  try {
    const raw = window.sessionStorage.getItem(SENT_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeSentLog(list) {
  try {
    window.sessionStorage.setItem(SENT_KEY, JSON.stringify(list));
  } catch {
    /* stockage indisponible (navigation privée...) : on continue sans */
  }
}

const EMPTY_FORM = { name: '', email: '', subject: '', message: '', _gotcha: '' };

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorKey, setErrorKey] = useState('error');
  const inFlight = useRef(false);

  const fail = (key) => {
    setErrorKey(key);
    setStatus('error');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Double clic : le state React est asynchrone, on bloque donc aussi
    // avec une référence, mise à jour immédiatement.
    if (inFlight.current) return;

    // Robot : on fait semblant d'avoir réussi, sans rien envoyer.
    if (form._gotcha) {
      setStatus('success');
      setForm(EMPTY_FORM);
      return;
    }

    if (!navigator.onLine) {
      fail('errorOffline');
      return;
    }

    const now = Date.now();
    const log = readSentLog().filter((time) => now - time < 60 * 60 * 1000);
    if (log.length >= MAX_PER_SESSION) {
      fail('errorTooMany');
      return;
    }
    if (log.length && now - log[log.length - 1] < COOLDOWN_MS) {
      fail('errorCooldown');
      return;
    }

    inFlight.current = true;
    setStatus('sending');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
        signal: controller.signal,
      });

      if (response.ok) {
        writeSentLog([...log, now]);
        setStatus('success');
        setForm(EMPTY_FORM);
      } else {
        logError(new Error(`Formspree a répondu ${response.status}`), 'contact-form');
        fail('error');
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        fail('errorTimeout');
      } else {
        logError(err, 'contact-form');
        fail(navigator.onLine ? 'error' : 'errorOffline');
      }
    } finally {
      clearTimeout(timer);
      inFlight.current = false;
    }
  };

  return (
    <section id="contact" className="section contact band band--wine">
      <div className="container contact__grid">
        <div className="contact__intro">
          <p className="eyebrow">{t.contact.eyebrow}</p>
          <h2>{t.contact.title}</h2>
          <p className="lead contact__lead">{t.contact.lead}</p>
          <a className="contact__mail" href="mailto:mirabelleabime@gmail.com">mirabelleabime@gmail.com</a>
        </div>

        <form className="contact__form" onSubmit={handleSubmit}>
          <div className="contact__trap" aria-hidden="true">
            <label>
              Ne pas remplir
              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                value={form._gotcha}
                onChange={(e) => setForm({ ...form, _gotcha: e.target.value })}
              />
            </label>
          </div>
          <label>
            <span>{t.contact.name}</span>
            <input
              required
              type="text"
              name="name"
              autoComplete="name"
              maxLength={80}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t.contact.namePlaceholder}
            />
          </label>
          <label>
            <span>{t.contact.email}</span>
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              maxLength={120}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder={t.contact.emailPlaceholder}
            />
          </label>
          <label>
            <span>{t.contact.subject}</span>
            <input
              required
              type="text"
              name="subject"
              maxLength={120}
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder={t.contact.subjectPlaceholder}
            />
          </label>
          <label>
            <span>{t.contact.message}</span>
            <textarea
              required
              rows={5}
              name="message"
              maxLength={2000}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder={t.contact.messagePlaceholder}
            />
          </label>
          <button type="submit" className="btn btn--solid" disabled={status === 'sending'}>
            {status === 'sending' ? t.contact.sending : status === 'success' ? t.contact.sent : t.contact.send}
          </button>

          <p className="contact__form-error" role="alert" aria-live="polite">
            {status === 'error' ? t.contact[errorKey] || t.contact.error : ''}
          </p>
        </form>
      </div>
    </section>
  );
}
