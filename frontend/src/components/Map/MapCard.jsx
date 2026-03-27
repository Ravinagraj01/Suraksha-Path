import L from "leaflet";
import { MapContainer, Marker, Polygon, Popup, TileLayer } from "react-leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function MapCard({ shelters = [], sos = [], riskZones = [], title = "Operational Map" }) {
  return (
    <div className="card-ui h-[420px] p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-800">{title}</h3>
      <MapContainer center={[20.5937, 78.9629]} zoom={5}>
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {shelters.map((s) => (
          <Marker key={s.id} position={[Number(s.latitude), Number(s.longitude)]}>
            <Popup>
              <p className="font-semibold">{s.name}</p>
              <p>Capacity: {s.available_capacity}/{s.total_capacity}</p>
            </Popup>
          </Marker>
        ))}

        {sos.map((x) => (
          <Marker key={x.id} position={[Number(x.latitude), Number(x.longitude)]}>
            <Popup>
              <p className="font-semibold">SOS</p>
              <p>{x.message}</p>
            </Popup>
          </Marker>
        ))}

        {riskZones.map((zone) => (
          <Polygon key={zone.id} positions={zone.points} pathOptions={{ color: "#ef4444", weight: 2 }} />
        ))}
      </MapContainer>
    </div>
  );
}