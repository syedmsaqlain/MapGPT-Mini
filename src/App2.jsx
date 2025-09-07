import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Polygon,
  Circle,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function App() {
  const [markers, setMarkers] = useState([]);
  const [polylines, setPolylines] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [circles, setCircles] = useState([]);
  const [mapLayer, setMapLayer] = useState("streets");

  // Centering map dynamically
  function ChangeView({ coords }) {
    const map = useMap();
    if (coords && coords.length > 0) {
      map.setView(coords[coords.length - 1], 5);
    }
    return null;
  }

  // Geocode using OpenStreetMap Nominatim
  async function geocode(place) {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${place}`
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    return null;
  }

  // Distance calculation using Haversine
  function haversineDistance(coords1, coords2) {
    function toRad(x) {
      return (x * Math.PI) / 180;
    }
    const R = 6371; // km
    const dLat = toRad(coords2[0] - coords1[0]);
    const dLon = toRad(coords2[1] - coords1[1]);
    const lat1 = toRad(coords1[0]);
    const lat2 = toRad(coords2[0]);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Command handler
  async function handleCommand(command) {
    const cmd = command.toLowerCase();

    if (cmd.startsWith("zoom to")) {
      const place = command.replace("zoom to", "").trim();
      const coords = await geocode(place);
      if (coords) setMarkers([...markers, coords]);
    } else if (cmd.startsWith("add marker at")) {
      const place = command.replace("add marker at", "").trim();
      const coords = await geocode(place);
      if (coords) setMarkers([...markers, coords]);
    } else if (cmd.startsWith("draw route from")) {
      const parts = command.replace("draw route from", "").split("to");
      const from = parts[0].trim();
      const to = parts[1].trim();
      const fromCoords = await geocode(from);
      const toCoords = await geocode(to);
      if (fromCoords && toCoords) {
        setPolylines([...polylines, [fromCoords, toCoords]]);
      }
    } else if (cmd === "clear map") {
      setMarkers([]);
      setPolylines([]);
      setPolygons([]);
      setCircles([]);
    } else if (cmd.startsWith("measure distance from")) {
      const parts = command.replace("measure distance from", "").split("to");
      const from = parts[0].trim();
      const to = parts[1].trim();
      const fromCoords = await geocode(from);
      const toCoords = await geocode(to);
      if (fromCoords && toCoords) {
        const dist = haversineDistance(fromCoords, toCoords);
        alert(`Distance between ${from} and ${to}: ${dist.toFixed(2)} km`);
      }
    } else if (cmd.startsWith("draw circle at")) {
      const parts = command.replace("draw circle at", "").split("radius");
      const place = parts[0].trim();
      const radius = parseInt(parts[1]) * 1000; // convert to meters
      const coords = await geocode(place);
      if (coords) setCircles([...circles, { coords, radius }]);
    } else if (cmd.startsWith("draw polygon around")) {
      const places = command.replace("draw polygon around", "").split(",");
      const coordsArray = [];
      for (let p of places) {
        const coords = await geocode(p.trim());
        if (coords) coordsArray.push(coords);
      }
      if (coordsArray.length > 2) setPolygons([...polygons, coordsArray]);
    } else if (cmd.includes("satellite")) {
      setMapLayer("satellite");
    } else if (cmd.includes("streets")) {
      setMapLayer("streets");
    } else if (cmd.startsWith("search address")) {
      const place = command.replace("search address", "").trim();
      const coords = await geocode(place);
      if (coords) setMarkers([...markers, coords]);
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="p-2 bg-gray-200 shadow flex">
        <input
          id="commandInput"
          type="text"
          placeholder="Enter command (e.g., draw route from Lahore to Karachi)"
          className="flex-grow p-2 border rounded"
        />
        <button
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => {
            const input = document.getElementById("commandInput");
            handleCommand(input.value);
            input.value = "";
          }}
        >
          Run
        </button>
      </div>
      <div className="flex-grow">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: "100%", width: "100%" }}
        >
          {mapLayer === "streets" ? (
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
          ) : (
            <TileLayer
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenTopoMap contributors"
            />
          )}

          {markers.map((pos, i) => (
            <Marker key={i} position={pos}></Marker>
          ))}

          {polylines.map((line, i) => (
            <Polyline key={i} positions={line} color="blue" />
          ))}

          {polygons.map((poly, i) => (
            <Polygon key={i} positions={poly} color="green" />
          ))}

          {circles.map((circle, i) => (
            <Circle
              key={i}
              center={circle.coords}
              radius={circle.radius}
              color="red"
            />
          ))}

          <ChangeView coords={markers} />
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
