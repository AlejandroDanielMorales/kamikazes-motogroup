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
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

  // 🔹 CREAR EVENTO + STOPS (escalonado)
 const createEventWithStops = async ({ eventData, stops }) => {
  if (!token) throw new Error("No autenticado");

  try {
    setLoadingEvents(true);
    console.log("Token en createEventWithStops:", token);

    // 1️⃣ Crear paradas (PROTEGIDO)
    const stopsRes = await axios.post(
      `${API_URL}/stops/bulk`,
      stops.map((stop) => ({
        name: stop.name,
        description: stop.description || "Parada del recorrido",
        location: stop.location,
      })),
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ CLAVE
        },
      }
    );

    const stopIds = stopsRes.data.map((s) => s._id);

    // 2️⃣ Crear evento con IDs de paradas
    const eventRes = await axios.post(
      `${API_URL}/events`,
      {
        ...eventData,
        stops: stopIds,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ CLAVE
        },
      }
    );

    setEvents((prev) => [...prev, eventRes.data]);
    setMyEvents((prev) => [...prev, eventRes.data]);

    return eventRes.data;
  } catch (err) {
    console.error("Error al crear evento con paradas", err);
    throw err;
  } finally {
    setLoadingEvents(false);
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
        createEventWithStops,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export default EventProvider;
