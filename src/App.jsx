import React, { useState, useEffect } from "react";

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
  if (action.action === "drawCircle") {

    console.log("Circle data:", action.lat, action.lng, action.radius);
    return (
   
  

    <Circle
        center={[action.lat, action.lng]}
        radius={action.radius || 150}
        pathOptions={{ color: action.color || "blue" }}
      >
      
        <Popup>{action.label || "Circle Area"}</Popup>
      </Circle>
    );
  }
//route

if (action.action === "route") {
  console.log("Route points:", action.from, action.to);
  
  const positions = [
    [action.from.lat, action.from.lng],
    [action.to.lat, action.to.lng]
  ];

    // Center map on the route
    map.fitBounds(positions, { padding: [50, 50] });

  return (
    //<Polyline positions={[[action.from.lat, action.from.lng], [action.to.lat, action.to.lng]]} pathOptions={{ color: "red" }}>
    <Polyline positions={positions} pathOptions={{ color: "red" }}>
      <Popup>Route</Popup>
    </Polyline>
  );
}


 // Polygon
  if (action.action === "drawPolygon") {
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

//for map gbt
  const [command, setCommand] = useState("");
  const [currentAction, setCurrentAction] = useState(null);
  const [currentLayer, setCurrentLayer] = useState("osm");

  const [isVoiceInput, setIsVoiceInput] = useState(false);

  // Automatically run handleCommand whenever command updates (from voice input)
// 👇 watch for command changes, but only if it came from voice
useEffect(() => {
  if (isVoiceInput && command.trim() !== "") {
    handleCommand();        // run once for voice input
    setIsVoiceInput(false); // reset so typing won’t trigger
  }
}, [command, isVoiceInput]);


// map input field

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

//for voice
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [translated, setTranslated] = useState("");
  const [sourceLang, setSourceLang] = useState("en");

  let recognition;

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition API not supported in this browser.");
      return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = sourceLang;

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      //setTranscript(spokenText);
      translateText(spokenText, sourceLang);
    };

    recognition.onend = () => setListening(false);

    window.startListening = () => {
      setListening(true);
      recognition.start();
    };

    window.stopListening = () => {
      recognition.stop();
    };
  }, [sourceLang]);

  const translateText = async (text, lang) => {
    try {
      const res = await fetch("http://localhost:5000/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, sourceLang: lang }),
      });

      const data = await res.json();
      //setTranslated(data.translated || "");
      setCommand(data.translated || "");
      setIsVoiceInput(true);   // ✅ add this
      
     } catch (err) {
      console.error("Translation error:", err);
    }
  };

 

  return (
    <div style={{ height: "100vh", width: "100vw", padding: 20, boxSizing: "border-box" }}>
      
      {/* Title */}
      <h1 style={{ textAlign: "center", fontWeight: "bold", marginBottom: 30 }}>
        Welcome to MapGPTMini
      </h1>
  
      {/* Top row: Hints (left) + Voice controls (center) + Command input (right) */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>


          {/* LEFT: Usage hints */}
        <div style={{ fontSize: 14, color: "#374151", maxWidth: 400 }}>
          <strong>Try commands:</strong>
          <ul style={{ margin: "8px 0 0 18px", padding: 0 }}>
            <li>Zoom to Lahore,Pan London</li>
            <li>Add marker at Karachi,Draw circle in Islamabad</li>
            <li>Draw Circle on Tokyo, Route from Lahore to Multan</li>
            <li>Switch to Satellite, Osm, Topo, WaterColor, Toner, Dark</li>
          </ul>
        </div>
  
        {/* CENTER: Language + Start Listening */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <label>
            Select Language:
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              style={{ marginLeft: 10, padding: 5, fontSize: 16 }}
            >
              <option value="en">English</option>
              <option value="ur">Urdu</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="ar">Arabic</option>
            </select>
          </label>
          <button
            onClick={() => window.startListening()}
            disabled={listening}
            style={{
              padding: "10px 20px",
              fontSize: 16,
              borderRadius: 5,
              border: "none",
              backgroundColor: listening ? "#6b7280" : "#1d4ed8",
              color: "white",
              cursor: "pointer",
            }}
          >
            {listening ? "Listening..." : "Start Listening"}
          </button>
        </div>
  
        {/* RIGHT: Command input + Go button */}
        <div style={{ display: "flex", gap: 10 }}>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Type a command (e.g., Zoom to Lahore, Add marker at Karachi)"
            style={{
              width: 300,
              padding: 10,
              fontSize: 16,
              borderRadius: 5,
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={handleCommand}
            style={{
              padding: "10px 20px",
              fontSize: 16,
              borderRadius: 5,
              border: "none",
              backgroundColor: "#1d4ed8",
              color: "white",
              cursor: "pointer",
            }}
          >
            Go
          </button>
        </div>
      </div>
  
      {/* Map */}
      <MapContainer center={[20, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
        <TileLayer url={baseLayers[currentLayer]} attribution="&copy; OpenStreetMap contributors" />
        <MapActions action={currentAction} setCurrentLayer={setCurrentLayer} />
      </MapContainer>
    </div>
  );
  
  
  
}
