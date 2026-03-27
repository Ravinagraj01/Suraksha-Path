import { useEffect, useMemo, useState } from "react";

import KPIcard from "../components/KPIcard";
import TrendChart from "../components/Charts/TrendChart";
import DistributionChart from "../components/Charts/DistributionChart";
import CapacityBarChart from "../components/Charts/CapacityBarChart";
import DataTable from "../components/Tables/DataTable";
import MapCard from "../components/Map/MapCard";
import api from "../services/api";
import { connectSocket } from "../services/websocket";

export default function AdminDashboard() {
  const [sos, setSos] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api.get("/sos").then((r) => setSos(r.data)).catch(() => {});
    api.get("/shelters").then((r) => setShelters(r.data)).catch(() => {});
    api.get("/damage-reports").then((r) => setReports(r.data)).catch(() => {});

    const sosSocket = connectSocket("/ws/sos-feed", (msg) => {
      if (msg.event === "sos_created") setSos((prev) => [msg.data, ...prev].slice(0, 200));
    });

    const shelterSocket = connectSocket("/ws/shelter-updates", (msg) => {
      if (msg.event === "capacity_updated") {
        setShelters((prev) => prev.map((s) => (s.id === msg.data.id ? msg.data : s)));
      }
    });

    return () => {
      sosSocket.close();
      shelterSocket.close();
    };
  }, []);

  const trendData = useMemo(
    () => [
      { name: "Mon", sos: 12, resolved: 7 },
      { name: "Tue", sos: 19, resolved: 11 },
      { name: "Wed", sos: 17, resolved: 13 },
      { name: "Thu", sos: 26, resolved: 17 },
      { name: "Fri", sos: 31, resolved: 22 },
    ],
    []
  );

  const severityData = useMemo(
    () => [
      { name: "Low", value: 18 },
      { name: "Medium", value: 28 },
      { name: "High", value: 34 },
      { name: "Critical", value: 20 },
    ],
    []
  );

  const capacityData = useMemo(
    () => shelters.slice(0, 5).map((s) => ({ name: s.name?.slice(0, 8) || "Shelter", available: s.available_capacity || 0, occupied: Math.max(0, (s.total_capacity || 0) - (s.available_capacity || 0)) })),
    [shelters]
  );

  const riskZones = [{ id: "zone-1", points: [[20.2, 78.1], [20.9, 78.6], [20.4, 79.2]] }];

  return (
    <div className="space-y-5 fade-up">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPIcard label="Active SOS" value={sos.filter((x) => x.status === "open").length} tone="red" delta="+8%" />
        <KPIcard label="Damage Reports" value={reports.length} tone="orange" delta="+5%" />
        <KPIcard label="Open Shelters" value={shelters.length} tone="blue" delta="Stable" />
        <KPIcard label="Resolved Today" value={sos.filter((x) => x.status !== "open").length} tone="green" delta="Improving" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TrendChart data={trendData} />
        </div>
        <DistributionChart data={severityData} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <MapCard shelters={shelters} sos={sos} riskZones={riskZones} title="Live Risk and SOS Map" />
        </div>
        <div className="space-y-4">
          <CapacityBarChart data={capacityData} />
          <img
            src="https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80"
            alt="Flood analytics"
            className="card-ui h-36 w-full object-cover transition duration-500 hover:scale-[1.02]"
          />
        </div>
      </div>

      <DataTable rows={sos} />
    </div>
  );
}
