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
const createEventWithStops = async ({ eventData, stops, images }) => {
  if (!token) throw new Error("No autenticado");
  let sended = null

  try {
    setLoadingEvents(true);

    // 1️⃣ CREAR PARADAS (JSON)
    const stopsRes = await axios.post(
      `${API_URL}/stops/bulk`,
      stops.map((s) => ({
        name: s.name,
        description: s.description || "Parada del recorrido",
        location: s.location,
      })),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const stopIds = stopsRes.data.map((s) => s._id);

    // 2️⃣ CREAR EVENTO (FormData EXACTO A POSTMAN)
    const formData = new FormData();

    formData.append("title", eventData.title);
    formData.append("description", eventData.description || "");
    formData.append("date", eventData.date);
    formData.append("departTime", eventData.departTime);
    formData.append("returnTime", eventData.returnTime || "");
    formData.append("meetingAddress", eventData.meetingAddress || "");

    formData.append(
      "startLocation",
      JSON.stringify(eventData.startLocation)
    );

    // 🔥 SOLO IDS
    formData.append("stops", JSON.stringify(stopIds));

    // 🖼️ IMAGEN (MISMO NOMBRE QUE POSTMAN)
    if (images) {
      formData.append("images", images);
    }
    sended = formData;
    const res = await axios.post(
      `${API_URL}/events`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setEvents((prev) => [...prev, res.data]);
    setMyEvents((prev) => [...prev, res.data]);

    return res.data;
  } catch (err) {
    console.error("Error al crear evento" + `${sended}`, err.response?.data || err);
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
