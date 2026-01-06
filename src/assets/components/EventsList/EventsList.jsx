import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

const API_URL = import.meta.env.VITE_API_URL;

function EventList() {
  const { token } = useAuth(); // 👈 viene del AuthProvider
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_URL}/events`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEvents(res.data);
      } catch (err) {
        console.error("Error cargando eventos", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token]);

  if (loading) return <p>Cargando eventos...</p>;

  return (
    <div>
      <h2>Eventos disponibles</h2>

      {events.length === 0 && <p>No hay eventos</p>}

      {events.map((event) => (
        <div key={event._id}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <small>{new Date(event.date).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
}

export default EventList;
