import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import markerIcon from "../StopsMap/LeafletIcon.jsx";
import "../StopsMap/StopsMap.css";


function ClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
}

export default function EventMap({ stops, route, selected, onSelect }) {
  return (
    <div className="map-container">
      <MapContainer
        center={[-34.6, -58.38]}
        zoom={10}
        className="leaflet-map"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <ClickHandler onSelect={onSelect} />

        {/* 📍 PIN TEMPORAL */}
        {selected && (
          <Marker
            position={[selected.lat, selected.lng]}
            icon={markerIcon}
          />
        )}

        {/* 📍 PARADAS CONFIRMADAS */}
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

        {/* 🧭 RUTA */}
        {route.length > 0 && (
          <Polyline positions={route} weight={5} />
        )}
      </MapContainer>
    </div>
  );
}
