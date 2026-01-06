// assets/contexts/EventProvider.jsx
import { useState } from "react";
import axios from "axios";
import { EventContext } from "../context/EventContext";
import { useAuth } from "../hooks/useAuth";

const API_URL = import.meta.env.VITE_API_URL;

function EventProvider({ children }) {
  const { token } = useAuth();

  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // 🔹 TODOS LOS EVENTOS
  const getAllEvents = async () => {
    try {
      setLoadingEvents(true);

      const res = await axios.get(`${API_URL}/events`, {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      });

      setEvents(res.data);
    } catch (err) {
      console.error("Error al obtener eventos", err);
    } finally {
      setLoadingEvents(false);
    }
  };

  // 🔹 MIS EVENTOS
  const getMyEvents = async () => {
    if (!token) return;

    try {
      setLoadingEvents(true);
      const res = await axios.get(`${API_URL}/events/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMyEvents(res.data);
    } catch (err) {
      console.error("Error al obtener mis eventos", err);
    } finally {
      setLoadingEvents(false);
    }
  };

  // 🔹 CREAR EVENTO
  const createEvent = async (eventData) => {
    if (!token) throw new Error("No autenticado");

    try {
      const res = await axios.post(`${API_URL}/events`, eventData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 🔄 sync inmediato
      setEvents((prev) => [...prev, res.data]);
      setMyEvents((prev) => [...prev, res.data]);

      return res.data;
    } catch (err) {
      console.error("Error al crear evento", err);
      throw err;
    }
  };

  return (
    <EventContext.Provider
      value={{
        events,
        myEvents,
        loadingEvents,
        getAllEvents,
        getMyEvents,
        createEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export default EventProvider;
