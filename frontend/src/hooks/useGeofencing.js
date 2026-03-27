import { useEffect } from "react";
import api from "../services/api";

export function useGeofencing(enabled = true) {
  useEffect(() => {
    if (!enabled || !navigator.geolocation) return;

    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          await api.post("/risk-zones/geofence-check", { latitude, longitude });
        } catch {
          // Endpoint can be enabled later.
        }
      });
    }, 20000);

    return () => clearInterval(interval);
  }, [enabled]);
}
