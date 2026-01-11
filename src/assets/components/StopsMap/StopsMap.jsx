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
import { useEvent } from "../../hooks/useEvent";
import { useForm, useFieldArray } from "react-hook-form";

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
  const { createEventWithStops } = useEvent();

  // 📋 React Hook Form
  const {
    register,
    handleSubmit,
    control,
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      date: "",
      departTime: "",
      returnTime: "",
      meetingAddress: "",
      images: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  // 🗺️ Mapa / paradas
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
        description: "",
        location: {
          type: "Point",
          coordinates: [selected.lng, selected.lat],
        },
      },
    ]);

    setSelected(null);
  };

  // 🚀 Submit evento
  const onSubmit = async (data) => {
    if (stops.length === 0) {
      alert("Agregá al menos una parada");
      return;
    }

    await createEventWithStops({
      eventData: {
        ...data,
        startLocation: stops[0].location,
      },
      stops,
    });

    alert("Evento creado 🚀");
    reset();
    setStops([]);
    setRoute([]);
    setDistance(0);
    setDuration(0);
  };

  // 🗺️ Ruta OSRM
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
      {/* 🗺️ MAPA */}
      <div className="map-container">
        <MapContainer
          center={[-34.6, -58.38]}
          zoom={10}
          className="leaflet-map"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ClickHandler onSelect={setSelected} />

          {selected && (
            <Marker
              position={[selected.lat, selected.lng]}
              icon={markerIcon}
            />
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
            <Polyline positions={route} weight={5} />
          )}
        </MapContainer>
      </div>

      {/* 📋 PANEL */}
      <div className="stops-panel">
        {/* FORM EVENTO */}
        <form onSubmit={handleSubmit(onSubmit)} className="event-form card">
          <h3 className="form-title">📍 Datos del evento</h3>

          <div className="form-group">
            <label>Título</label>
            <input
              placeholder="Salida dominical en moto"
              {...register("title", { required: true })}
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              placeholder="Ruta tranquila, mate y buena compañía"
              {...register("description")}
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Fecha</label>
              <input type="date" {...register("date", { required: true })} />
            </div>

            <div className="form-group">
              <label>Hora de salida</label>
              <input
                type="datetime-local"
                {...register("departTime", { required: true })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Hora estimada de regreso</label>
            <input type="datetime-local" {...register("returnTime")} />
          </div>

          <div className="form-group">
            <label>Punto de encuentro</label>
            <input
              placeholder="YPF Panamericana km 32"
              {...register("meetingAddress")}
            />
          </div>

          {/* IMÁGENES */}
          <div className="form-group">
            <label>Imagen del evento (URL)</label>
            <input
              type="text"
              placeholder="https://imagen.jpg"
              {...register("images")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (!e.target.value.trim()) return;
                  append(e.target.value);
                  e.target.value = "";
                }
              }}
            />
          </div>

          {fields.length > 0 && (
            <ul className="images-preview">
              {fields.map((img, i) => (
                <li key={img.id}>
                  <img src={img} alt="evento" />
                  <button
                    type="button"
                    onClick={() => remove(i)}
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button type="submit" className="btn primary">
            Crear evento
          </button>
        </form>

        {/* PARADAS */}
        <button onClick={addStop} disabled={!selected}>
          Agregar parada
        </button>

        {stops.map((stop, i) => (
          <div key={i} className="stop-edit">
            <input
              value={stop.name}
              onChange={(e) => {
                const copy = [...stops];
                copy[i].name = e.target.value;
                setStops(copy);
              }}
            />

            <textarea
              value={stop.description}
              onChange={(e) => {
                const copy = [...stops];
                copy[i].description = e.target.value;
                setStops(copy);
              }}
            />
          </div>
        ))}

        {distance > 0 && (
          <div className="stats-box">
            <p>📏 {km(distance)} km</p>
            <p>⏱ {time(duration)}</p>
          </div>
        )}
      </div>
    </section>
  );
}
