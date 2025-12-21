import { useState } from "react";
import { EventContext } from "../context/EventContext.jsx";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const API_URL = import.meta.env.VITE_API_URL;

function EventProvider({ children }) {
  const { token } = useAuth();

  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const getAllEvents = async () => {
    try {
      setLoadingEvents(true);
      const res = await axios.get(`${API_URL}/events`);
      setEvents(res.data);
    } catch (err) {
      console.error("Error al obtener eventos", err);
    } finally {
      setLoadingEvents(false);
    }
  };

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

  const createEvent = async (eventData) => {
    try {
      const res = await axios.post(`${API_URL}/events`, eventData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvents((prev) => [...prev, res.data]);
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
