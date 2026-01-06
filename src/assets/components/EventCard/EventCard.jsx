import "./EventCard.css";

function EventCard({ event }) {
  return (
    <div className="event-card card">
      <h3>{event.title}</h3>

      {event.description && <p>{event.description}</p>}

      <div className="event-card-meta">
        <span>📅 {new Date(event.date).toLocaleDateString()}</span>
        <span className={`event-status ${event.status}`}>
          {event.status}
        </span>
      </div>

      {event.meetingAddress && (
        <div className="event-address">
          📍 {event.meetingAddress}
        </div>
      )}

      {event.stops?.length > 0 && (
        <ul className="event-stops">
          {event.stops.map((stop, i) => (
            <li key={i}>🏁 {stop.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EventCard;
