import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "./leafletIcon.jsx";

// 🏍️ velocidad promedio moto
const AVERAGE_SPEED_KMH =53 ;
// helpers UI
const km = (meters) => (meters / 1000).toFixed(1);
const time = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
};

// duración estimada moto
const calcMotoDuration = (meters) => {
  const km = meters / 1000;
  const hours = km / AVERAGE_SPEED_KMH;
  return Math.round(hours * 3600);
};

function ClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
}

export default function StopsMap() {
  const [selected, setSelected] = useState(null);
  const [stops, setStops] = useState([]);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);

  // 📍 agregar parada
  const addStop = () => {
    if (!selected) return;

    setStops((prev) => [
      ...prev,
      {
        name: `Parada ${prev.length + 1}`,
        location: {
          type: "Point",
          coordinates: [selected.lng, selected.lat],
        },
      },
    ]);

    setSelected(null);
  };

  // 🧭 pedir ruta real a OSRM
  const fetchRoute = async (points) => {
    if (points.length < 2) return null;

    const coords = points
      .map(([lat, lng]) => `${lng},${lat}`)
      .join(";");

    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`
    );

    const data = await res.json();
    const route = data.routes[0];

    return {
      geometry: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
      distance: route.distance,
    };
  };

  // 🔁 recalcular ruta y métricas
  useEffect(() => {
    const buildRoute = async () => {
      const points = stops.map((s) => [
        s.location.coordinates[1],
        s.location.coordinates[0],
      ]);

      const result = await fetchRoute(points);
      if (!result) return;

      setRoute(result.geometry);
      setDistance(result.distance);
      setDuration(calcMotoDuration(result.distance));
    };

    buildRoute();
  }, [stops]);

  // 🚀 crear evento
  const createEvent = async () => {
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Salida en moto",
        date: new Date(),
        departTime: new Date(),
        stops,
        distance,
        duration,
        averageSpeed: AVERAGE_SPEED_KMH,
      }),
    });
  };

  return (
    <>
      <MapContainer
        center={[-34.6, -58.38]}
        zoom={10}
        style={{ height: "400px", borderRadius: 12 }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <ClickHandler onSelect={setSelected} />

        {/* marcador temporal */}
        {selected && (
          <Marker
            position={[selected.lat, selected.lng]}
            icon={markerIcon}
          />
        )}

        {/* paradas */}
        {stops.map((s, i) => (
          <Marker
            key={i}
            icon={markerIcon}
            position={[
              s.location.coordinates[1],
              s.location.coordinates[0],
            ]}
          />
        ))}

        {/* ruta real por calles */}
        {route.length > 0 && (
          <Polyline
            positions={route}
            pathOptions={{ color: "red", weight: 4 }}
          />
        )}
      </MapContainer>

      <button onClick={addStop} disabled={!selected}>
        Agregar parada
      </button>

      <ul>
        {stops.map((s, i) => (
          <li key={i}>
            {i + 1}. {s.name}
          </li>
        ))}
      </ul>

      {distance > 0 && (
        <div style={{ marginTop: 10 }}>
          <strong>Distancia:</strong> {km(distance)} km <br />
          <strong>Tiempo estimado:</strong> {time(duration)} <br />
          <small>Velocidad promedio: {AVERAGE_SPEED_KMH} km/h</small>
        </div>
      )}

      <button onClick={createEvent}>
        Crear evento
      </button>
    </>
  );
}
