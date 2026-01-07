import "./EventCard.css";

function EventCard({ event }) {
  const mainImage = event.images?.[0];

  return (
    <div className="event-card card">
      {mainImage && (
        <div className="event-card-image">
          <img src={mainImage} alt={event.title} />
        </div>
      )}

      <h3>{event.title}</h3>

      {event.description && <li key={event._id}>📍{event.description}</li>}
      

      <h4>Fecha</h4>

      <div className="event-card-meta">
        <span>📅 {new Date(event.date).toLocaleDateString()}</span>
        <span className={`event-status ${event.status}`}>
          {event.status}
        </span>

      </div>
      <h4>Primer lugar de encuentro</h4>
      {event.meetingAddress && (
        <div className="event-address">
          <li key={event._id}>📍{event.meetingAddress}</li>
        </div>
        
      )}

      <h4>Paradas y encuentros</h4>
      {event.stops?.length > 0 && (
        <ul className="event-stops">
          {event.stops.map((stop, i) => (
            <>
            <li key={stop._id || i}>🏁 {stop.name}</li>
            <li key={stop._id || i}>📝 {stop.description}</li>

            </>
          ))}
        </ul>
      )}
      <button className="btn primary">Ver detalles</button>
    </div>
  );
}

export default EventCard;
