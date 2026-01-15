import { useState, useEffect } from "react";
import EventMap from "../../components/EventMap/EventMap";
import EventForm from "../../components/EventForm/EventForm";
import { useEvent } from "../../hooks/useEvent";
import Swal from "sweetalert2";

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
// 🔹 función FUERA del componente
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

export default function CreateEventPage() {
  const { createEventWithStops } = useEvent();

  const [selected, setSelected] = useState(null);
  const [stops, setStops] = useState([]);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  

  // 🧠 construir ruta automáticamente
  useEffect(() => {
    const buildRoute = async () => {
      if (stops.length < 2) {
        setRoute([]);
        setDistance(0);
        return;
      }

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
const onSubmit = async (data) => {
  // 🔐 Validaciones generales
  if (!data.title || data.title.trim().length < 3) {
    Swal.fire({
      icon: "error",
      title: "Título inválido",
      text: "El título debe tener al menos 3 caracteres.",
    });
    return;
  }

  if (!data.date) {
    Swal.fire({
      icon: "error",
      title: "Fecha requerida",
      text: "Debe indicar la fecha del evento.",
    });
    return;
  }

  if (!data.departTime) {
    Swal.fire({
      icon: "error",
      title: "Hora de salida requerida",
      text: "Debe indicar la hora de salida.",
    });
    return;
  }

  // 🛑 Paradas
  if (!stops || stops.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Paradas requeridas",
      text: "Debe agregar al menos una parada al evento.",
    });
    return;
  }

  // 🧭 Validar que todas las paradas tengan coordenadas
  const invalidStop = stops.find(
    (s) =>
      !s.location ||
      !Array.isArray(s.location.coordinates) ||
      s.location.coordinates.length !== 2
  );

  if (invalidStop) {
    Swal.fire({
      icon: "error",
      title: "Parada inválida",
      text: "Una o más paradas no tienen ubicación válida.",
    });
    return;
  }

  // 📝 Validar nombres de paradas
  const emptyStopName = stops.find(
    (s) => !s.name || s.name.trim().length < 2
  );

  if (emptyStopName) {
    Swal.fire({
      icon: "error",
      title: "Nombre de parada inválido",
      text: "Cada parada debe tener un nombre válido.",
    });
    return;
  }

  // 🖼️ Validar imagen (opcional)
  if (data.image && data.image[0]) {
    const file = data.image[0];

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Imagen inválida",
        text: "La imagen debe ser JPG, PNG o WEBP.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "Imagen demasiado grande",
        text: "La imagen no puede superar los 5MB.",
      });
      return;
    }
  }

  // 🚀 SUBMIT FINAL
  try {

    console.log("Creating event with data:", {
      eventData: {
        title: data.title.trim(), 
        description: data.description?.trim() || "",
        date: data.date,
        departTime: data.departTime,
        returnTime: data.returnTime || "",
        meetingAddress: data.meetingAddress?.trim() || "",
        startLocation: stops[0].location, // ✅ directo
      },
      stops: stops,                 // ✅ directo
      images: data.images?.[0] // ✅ archivo
    });
    const departDateTime = new Date(`${data.date}T${data.departTime}`);

    await createEventWithStops({
  eventData: {
    title: data.title.trim(),
    description: data.description?.trim() || "",
    date: data.date,
    departTime: departDateTime.toISOString(), 
    returnTime: data.returnTime || "",
    meetingAddress: data.meetingAddress?.trim() || "",
    startLocation: stops[0].location, // ✅ directo
  },
  stops: stops,                 // ✅ directo
  images: data.images?.[0] // ✅ archivo
});


    Swal.fire({
      icon: "success",
      title: "Evento creado",
      text: "El evento fue creado correctamente.",
    });

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ocurrió un error al crear el evento." + (error.message || ""),
    });
  }
};

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

  return (
    <section className="stops-wrapper">
      <EventMap
        stops={stops}
        route={route}
        selected={selected}    
        onSelect={setSelected}
      />

      <div className="stops-panel">
        <button
          className="btn-secondary"
          onClick={addStop}
          disabled={!selected}
        >
          Agregar parada
        </button>

        {distance > 0 && (
          <div className="stats-box">
            📏 {km(distance)} km · ⏱{" "}
            {time(calcMotoDuration(distance))}
          </div>
        )}

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

        <EventForm onSubmit={onSubmit} />
      </div>
    </section>
  );
}
