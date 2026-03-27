import L from "leaflet";
import { MapContainer, Marker, Polygon, Popup, TileLayer } from "react-leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Home, AlertTriangle, Navigation } from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function PremiumMapCard({ shelters = [], sos = [], riskZones = [], title = "Operational Map" }) {
  // Create custom icons
  const shelterIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="#10b981" stroke="#10b981"/>
        <polyline points="9 22 9 12 15 12 15 22" fill="#065f46" stroke="#065f46"/>
      </svg>
    `),
    iconSize: [25, 25],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
    shadowUrl: markerShadow,
    shadowSize: [25, 25],
    shadowAnchor: [12, 24]
  });

  const sosIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="#ef4444" stroke="#ef4444"/>
        <line x1="12" y1="9" x2="12" y2="13" stroke="white" stroke-width="3"/>
        <line x1="12" y1="17" x2="12.01" y2="17" stroke="white" stroke-width="3"/>
      </svg>
    `),
    iconSize: [25, 25],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
    shadowUrl: markerShadow,
    shadowSize: [25, 25],
    shadowAnchor: [12, 24]
  });

  return (
    <div className="w-full h-full">
      <MapContainer 
        center={[20.5937, 78.9629]} 
        zoom={5} 
        className="w-full h-full"
        style={{ background: '#1e293b' }}
      >
        <TileLayer 
          attribution='&copy; OpenStreetMap contributors' 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="dark-tiles"
        />

        {/* Shelter Markers */}
        {shelters.map((s) => (
          <Marker 
            key={s.id} 
            position={[Number(s.latitude), Number(s.longitude)]}
            icon={shelterIcon}
          >
            <Popup className="dark-popup">
              <div className="p-3 bg-slate-800 rounded-lg border border-slate-600">
                <div className="flex items-center space-x-2 mb-2">
                  <Home className="w-4 h-4 text-green-400" />
                  <h4 className="font-semibold text-white">{s.name}</h4>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-blue-200">
                    <span className="text-green-400">Available:</span> {s.available_capacity || 0}
                  </p>
                  <p className="text-blue-200">
                    <span className="text-blue-400">Total:</span> {s.total_capacity || 0}
                  </p>
                  <p className="text-blue-200">
                    <span className="text-purple-400">Status:</span> {s.status || 'Active'}
                  </p>
                </div>
                {s.address && (
                  <p className="text-xs text-blue-300 mt-2 pt-2 border-t border-slate-600">
                    {s.address}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* SOS Markers */}
        {sos.map((x) => (
          <Marker 
            key={x.id} 
            position={[Number(x.latitude), Number(x.longitude)]}
            icon={sosIcon}
          >
            <Popup className="dark-popup">
              <div className="p-3 bg-slate-800 rounded-lg border border-slate-600">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <h4 className="font-semibold text-white">SOS Request</h4>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-blue-200">{x.message}</p>
                  <p className="text-blue-200">
                    <span className="text-orange-400">Severity:</span> {x.severity}
                  </p>
                  <p className="text-blue-200">
                    <span className="text-yellow-400">Status:</span> {x.status || 'Open'}
                  </p>
                  {x.meta?.people && (
                    <p className="text-blue-200">
                      <span className="text-purple-400">People affected:</span> {x.meta.people}
                    </p>
                  )}
                </div>
                <div className="flex items-center text-xs text-blue-300 mt-2 pt-2 border-t border-slate-600">
                  <Navigation className="w-3 h-3 mr-1" />
                  {x.latitude?.toFixed(4)}, {x.longitude?.toFixed(4)}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Risk Zones */}
        {riskZones.map((zone) => (
          <Polygon 
            key={zone.id} 
            positions={zone.points} 
            pathOptions={{ 
              color: "#ef4444", 
              weight: 2,
              fillColor: "#ef4444",
              fillOpacity: 0.2
            }} 
          />
        ))}
      </MapContainer>

      <style jsx>{`
        .dark-popup .leaflet-popup-content-wrapper {
          background: #1e293b !important;
          border: 1px solid #475569 !important;
          border-radius: 0.5rem !important;
        }
        
        .dark-popup .leaflet-popup-content {
          background: #1e293b !important;
          color: #f8fafc !important;
          margin: 0 !important;
        }
        
        .dark-popup .leaflet-popup-tip {
          background: #1e293b !important;
        }
        
        .dark-tiles {
          filter: invert(1) hue-rotate(180deg);
        }
      `}</style>
    </div>
  );
}
