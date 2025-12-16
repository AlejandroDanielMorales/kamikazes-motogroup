import { useState } from "react";
import StopsMap from "./StopsMap";

export default function CreateEvent() {
  const [stops, setStops] = useState([]);

  const handleSubmit = async () => {
    await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer TOKEN"
      },
      body: JSON.stringify({
        title: "Salida dominguera",
        date: "2025-02-01",
        departTime: "2025-02-01T08:00:00",
        stops
      })
    });
  };

  return (
    <>
      <StopsMap onChange={setStops} />
      <button onClick={handleSubmit}>Crear evento</button>
    </>
  );
}
