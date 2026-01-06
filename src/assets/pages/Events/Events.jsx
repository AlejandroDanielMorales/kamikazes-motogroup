import { useEffect } from "react";
import  {useEvent}  from "../../hooks/useEvent.jsx";

import EventList from "../../components/EventsList/EventsList";

function Events() {
  const { events, loadingEvents, getAllEvents } = useEvent();

  useEffect(() => {
    getAllEvents();
  }, []);
  if (loadingEvents) return <p>Cargando eventos...</p>;

  return (
    <>
      <h1>Eventos</h1>
      <EventList events={events} />
    </>
  );
}

export default Events;
