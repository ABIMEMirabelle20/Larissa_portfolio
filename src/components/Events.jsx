import events from '../data/events';
import { useLanguage } from '../i18n/LanguageContext';
import './Events.css';

function formatDate(iso, lang) {
  const date = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function EventRow({ event, t, lang }) {
  const copy = t.eventsSection;
  return (
    <li className="event">
      <div className="event__when">
        <time dateTime={event.date}>{formatDate(event.date, lang)}</time>
        <span className="event__type">{copy.types[event.type] || copy.types.other}</span>
      </div>

      <div className="event__main">
        <h3>{event.name}</h3>
        {event.place && <p className="event__place">{event.place[lang]}</p>}
        {event.learned && (
          <div className="event__learned">
            <p className="event__learned-label">{copy.learned}</p>
            <p>{event.learned[lang]}</p>
          </div>
        )}
        {event.url && (
          <a className="event__link" href={event.url} target="_blank" rel="noreferrer noopener">
            {copy.organizer} <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>

      {event.image && (
        <figure className="event__photo">
          <img src={event.image} alt={event.imageAlt?.[lang] ?? ''} loading="lazy" decoding="async" />
        </figure>
      )}
    </li>
  );
}

export default function Events() {
  const { t, lang } = useLanguage();
  const copy = t.eventsSection;

  return (
    <section id="events" className="section events band band--plum">
      <div className="container">
        <header className="events__head">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2>{copy.title}</h2>
          <p className="lead">{copy.lead}</p>
        </header>

        {events.length > 0 ? (
          <ol className="events__list">
            {events.map((event) => (
              <EventRow key={event.id} event={event} t={t} lang={lang} />
            ))}
          </ol>
        ) : (
          <div className="events__empty">
            <p className="events__empty-title">{copy.emptyTitle}</p>
            <p>{copy.empty}</p>
          </div>
        )}
      </div>
    </section>
  );
}
