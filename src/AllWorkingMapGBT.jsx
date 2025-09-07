import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polygon, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapActions({ action, setCurrentLayer }) {
  const map = useMap();
  if (!action) return null;

  // Zoom
  if (action.action === "zoom") map.setView([action.lat, action.lng], action.level);

  // Pan
  if (action.action === "pan") map.panTo([action.lat, action.lng]);

  // Marker
  if (action.action === "marker") {
    return (
      <Marker position={[action.lat, action.lng]}>
        <Popup>{action.label}</Popup>
      </Marker>
    );
  }

  // Circle
  if (action.action === "circle") {
    return (
      <Circle
        center={[action.lat, action.lng]}
        radius={action.radius || 500}
        pathOptions={{ color: action.color || "blue" }}
      >
        <Popup>{action.label || "Circle Area"}</Popup>
      </Circle>
    );
  }

  // Polygon
  if (action.action === "polygon") {
    return (
      <Polygon positions={action.points} pathOptions={{ color: action.color || "green" }}>
        <Popup>{action.label || "Polygon Area"}</Popup>
      </Polygon>
    );
  }

  // Polyline
  if (action.action === "polyline") {
    return (
      <Polyline positions={action.points} pathOptions={{ color: action.color || "red" }}>
        <Popup>{action.label || "Route"}</Popup>
      </Polyline>
    );
  }

  // Fit bounds
  if (action.action === "fitBounds" && Array.isArray(action.bounds)) map.fitBounds(action.bounds);

  // Search
  if (action.action === "search") {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${action.place}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          map.setView([parseFloat(lat), parseFloat(lon)], 13);
        }
      });
  }

  // Layer switch
  if (action.action === "layer" && setCurrentLayer) {
    const layer = action.layerName.toLowerCase();
    console.log("Switching to layer:", layer);
    setCurrentLayer(layer);
  }

  return null;
}

export default function App() {
  const [command, setCommand] = useState("");
  const [currentAction, setCurrentAction] = useState(null);
  const [currentLayer, setCurrentLayer] = useState("osm");

  const baseLayers = {
    osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    topo: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    watercolor: "https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg",
    toner: "https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  };

  const handleCommand = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command })
      });

      const data = await res.json();
      console.log("Gemini interpreted action:", data);

      // Update current action so MapActions can react
      setCurrentAction(data);

    } catch (err) {
      console.error("Command handling failed:", err);
    }
  };

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
       <div
  style={{
    position: "absolute",
    top: 20,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 1000,
    display: "flex",
    gap: "10px",
  }}
>
  <input
    type="text"
    value={command}
    onChange={(e) => setCommand(e.target.value)}
    placeholder="Type a command (e.g., Zoom to Lahore, Add marker at Karachi)"
    style={{
      width: "500px",   // bigger input
      padding: "10px",
      fontSize: "16px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    }}
  />
  <button
    onClick={handleCommand}
    style={{
      padding: "10px 20px",
      fontSize: "16px",
      borderRadius: "5px",
      border: "none",
      backgroundColor: "#1d4ed8",
      color: "white",
      cursor: "pointer",
    }}
  >
    Go
  </button>
</div>


      <MapContainer center={[20, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
        <TileLayer url={baseLayers[currentLayer]} attribution="&copy; OpenStreetMap contributors" />
        <MapActions action={currentAction} setCurrentLayer={setCurrentLayer} />
      </MapContainer>
    </div>
  );
}
