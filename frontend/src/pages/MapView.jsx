import { useEffect, useState } from "react";

import MapCard from "../components/Map/MapCard";
import api from "../services/api";

export default function MapView() {
  const [shelters, setShelters] = useState([]);
  const [sos, setSos] = useState([]);

  useEffect(() => {
    api.get("/shelters").then((r) => setShelters(r.data)).catch(() => {});
    api.get("/sos").then((r) => setSos(r.data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-4 fade-up">
      <div className="card-ui p-4">
        <h3 className="text-sm font-semibold text-slate-800">Map Filters</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-4">
          <select className="input-ui"><option>All States</option></select>
          <select className="input-ui"><option>All Districts</option></select>
          <select className="input-ui"><option>All Severity</option></select>
          <button className="btn-primary">Refresh Layer</button>
        </div>
      </div>

      <MapCard
        shelters={shelters}
        sos={sos}
        title="Geospatial Disaster Monitoring"
        riskZones={[
          { id: "m1", points: [[20.1, 78.3], [20.8, 79], [20.4, 79.4]] },
          { id: "m2", points: [[21.2, 77.5], [21.6, 78], [21.1, 78.4]] },
        ]}
      />
    </div>
  );
}
