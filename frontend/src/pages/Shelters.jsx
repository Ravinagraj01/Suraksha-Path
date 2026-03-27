import { useEffect, useState } from "react";

import api from "../services/api";

export default function Shelters() {
  const [shelters, setShelters] = useState([]);

  useEffect(() => {
    api.get("/shelters").then((r) => setShelters(r.data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-4 fade-up">
      <div className="card-ui p-4">
        <h3 className="text-lg font-semibold text-slate-900">Shelter Locator</h3>
        <p className="mt-1 text-sm text-slate-500">Real-time shelter capacities for rapid assignment.</p>
      </div>

      <img
        src="https://images.unsplash.com/photo-1618477462146-050d2767eac4?auto=format&fit=crop&w=1200&q=80"
        alt="Shelter camp"
        className="card-ui h-44 w-full object-cover transition duration-500 hover:scale-[1.01]"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {shelters.map((shelter) => (
          <div key={shelter.id} className="card-ui p-4">
            <h4 className="text-base font-semibold text-slate-900">{shelter.name}</h4>
            <p className="mt-1 text-sm text-slate-500">{shelter.address}</p>
            <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
              <p>Available: {shelter.available_capacity}</p>
              <p>Total: {shelter.total_capacity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
