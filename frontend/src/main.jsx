import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { useGeofencing } from "./hooks/useGeofencing";
import "leaflet/dist/leaflet.css";
import "./index.css";

function GeofenceBridge() {
  useGeofencing(true);
  return null;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <GeofenceBridge />
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
