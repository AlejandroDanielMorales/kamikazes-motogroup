import "./EventsList.css";
import EventCard from "../EventCard/EventCard";

function EventList({ events }) {
  if (!events || events.length === 0) {
    return <p>No hay eventos disponibles</p>;
  }

  return (
    <div className="events-list">
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
}

export default EventList;
