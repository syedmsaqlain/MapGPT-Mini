import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = "AIzaSyB1rGMsYOMerBkXoTNCtNZV9_wcnt63c14"; // replace with your real key

// Route to send user commands to Gemini
app.post("/api/interpret", async (req, res) => {
  try {
    const { command } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                    text: `You are a GIS assistant. Interpret this user command for a map: "${command}".
                    Reply ONLY in strict JSON with one of these actions:
                    { "action": "zoom", "lat": ..., "lng": ..., "level": ... }
                    { "action": "pan", "lat": ..., "lng": ... }
                    { "action": "marker", "lat": ..., "lng": ..., "label": "..." }
                    { "action": "search", "place": "..." }
                    { "action": "drawCircle", "lat": ..., "lng": ..., "radius": ... }
                    { "action": "drawPolygon", "coordinates": [[lat1, lng1], [lat2, lng2], ...] }
                    { "action": "layer", "layerName": "..." }
                    { "action": "route", "from": "placeA", "to": "placeB" }`
                    
                }
              ]
            }
          ]
        })
      }
    );

    console.log(" Raw Gemini response coming...");
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));

    // Extract text from Gemini
    let output = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // Clean output → remove ```json and ```
    output = output.replace(/```json/g, "").replace(/```/g, "").trim();

    // Try parsing safely
    let parsed;
    try {
      parsed = JSON.parse(output);
    } catch (e) {
      console.error("❌ JSON parse error. Output was:", output);
      return res.status(500).json({ error: "Invalid JSON from Gemini", raw: output });
    }

    res.json(parsed);
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Failed to interpret command" });
  }
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
