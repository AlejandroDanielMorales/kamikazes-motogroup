// src/assets/components/events/EventCard.jsx
import "./EventCard.css";

export default function EventCard({ event }) {
  return (
    <article className="event-card">
      {event.images?.length > 0 && (
        <img
          src={event.images[0]}
          alt={event.title}
          className="event-image"
        />
      )}

      <div className="event-content">
        <h3 className="event-title">{event.title}</h3>

        <p className="event-date">
          📅 {new Date(event.date).toLocaleDateString("es-AR")}
        </p>

        {event.meetingAddress && (
          <p className="event-address">📍 {event.meetingAddress}</p>
        )}

        <p className="event-status status-{event.status}">
          Estado: {event.status}
        </p>
      </div>
    </article>
  );
}
