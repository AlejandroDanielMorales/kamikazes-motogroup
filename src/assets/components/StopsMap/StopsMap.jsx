import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "./LeafletIcon.jsx";
import "./StopsMap.css";
import { useEvent } from "../../hooks/useEvent"; // ✅ IMPORTANTE

// 🏍️ velocidad promedio moto
const AVERAGE_SPEED_KMH = 55;

// helpers UI
const km = (meters) => (meters / 1000).toFixed(1);
const time = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
};

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
  const { createEventWithStops } = useEvent(); // ✅

  const [selected, setSelected] = useState(null);
  const [stops, setStops] = useState([]);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);

  const addStop = () => {
    if (!selected) return;

    setStops((prev) => [
      ...prev,
      {
        name: `Parada ${prev.length + 1}`,
        description: "Parada del recorrido",
        location: {
          type: "Point",
          coordinates: [selected.lng, selected.lat],
        },
      },
    ]);

    setSelected(null);
  };

  // ✅ CREACIÓN REAL DEL EVENTO
  const handleCreate = async () => {
    if (stops.length === 0) return alert("Agregá al menos una parada");

    await createEventWithStops({
      eventData: {
        title: "Salida en moto",
        description: "Ruta creada desde el mapa",
        date: new Date(),
        departTime: new Date(),
        startLocation: stops[0].location,
      },
      stops,
    });

    alert("Evento creado 🚀");
    setStops([]);
    setRoute([]);
    setDistance(0);
    setDuration(0);
  };

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

  return (
    <section className="stops-wrapper">
      <div className="map-container">
        <MapContainer
          center={[-34.6, -58.38]}
          zoom={10}
          className="leaflet-map"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ClickHandler onSelect={setSelected} />

          {selected && (
            <Marker position={[selected.lat, selected.lng]} icon={markerIcon} />
          )}

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

          {route.length > 0 && (
            <Polyline
              positions={route}
              pathOptions={{ color: "var(--color-secondary)", weight: 5 }}
            />
          )}
        </MapContainer>
      </div>

      <div className="stops-panel">
        <button
          className="btn-primary"
          onClick={addStop}
          disabled={!selected}
        >
          Agregar parada
        </button>

        <ul className="stops-list">
          {stops.map((s, i) => (
            <li key={i}>
              <span>{i + 1}</span> {s.name}
            </li>
          ))}
        </ul>

        {distance > 0 && (
          <div className="stats-box">
            <p>
              <strong>📏 Distancia:</strong> {km(distance)} km
            </p>
            <p>
              <strong>⏱ Duración:</strong> {time(duration)}
            </p>
          </div>
        )}

        <button className="btn-secondary" onClick={handleCreate}>
          Crear evento
        </button>
      </div>
    </section>
  );
}
