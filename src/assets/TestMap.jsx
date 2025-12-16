import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "./leafletIcon.jsx";

export default function TestMap() {
  return (
    <MapContainer
      center={[-34.6, -58.38]}
      zoom={10}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={[-34.6, -58.38]} icon={markerIcon} />
    </MapContainer>
  );
}
