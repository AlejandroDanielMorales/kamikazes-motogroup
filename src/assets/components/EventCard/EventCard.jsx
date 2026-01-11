import "./EventCard.css";

function EventCard({ event }) {
  const mainImage = event.images?.[0];

  return (
    <article className="event-card card">
      {mainImage && (
        <div className="event-card-image">
          <img src={mainImage} alt={event.title} />
        </div>
      )}

      <header className="event-card-header">
        <h3>{event.title}</h3>
      </header>

      {event.description && (
        <p className="event-description">
          📝 {event.description}
        </p>
      )}

      <section className="event-section">
        <h4>📅 Fecha</h4>
        <div className="event-card-meta">
          <span>
            {new Date(event.date).toLocaleDateString()}
          </span>

          {event.status && (
            <span className={`event-status ${event.status}`}>
              {event.status}
            </span>
          )}
        </div>
      </section>

      {event.meetingAddress && (
        <section className="event-section">
          <h4>📍 Primer punto de encuentro</h4>
          <p className="event-address">
            {event.meetingAddress}
          </p>
        </section>
      )}

      {event.stops?.length > 0 && (
        <section className="event-section">
          <h4>🏁 Paradas del recorrido</h4>

          <ul className="event-stops">
            {event.stops.map((stop, i) => (
              <li key={stop._id || i} className="event-stop">
                <strong>{i + 1}. {stop.name}</strong>
                <span className="stop-description">
                  📝 {stop.description}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <button className="btn primary">
        Ver detalles
      </button>
    </article>
  );
}

export default EventCard;
