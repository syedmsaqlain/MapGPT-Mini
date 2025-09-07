const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // make sure node-fetch@2 is installed for CJS

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
                    { "action": "route", "from": {"lat": ..., "lng": ...}, "to": {"lat": ..., "lng": ...} }`
                    
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


app.post("/api/translate", async (req, res) => {
    try {
      const { text, sourceLang } = req.body;
  
      if (!text || !sourceLang) {
        return res.status(400).json({ error: "Text and sourceLang are required" });
      }
  
      // Validate sourceLang
      const validLangs = ["en", "ur", "fr", "de", "ar"];
      if (!validLangs.includes(sourceLang)) {
        return res.status(400).json({ error: "Invalid sourceLang. Must be en, ur, fr, de, ar" });
      }
  
      // Use MyMemory free API
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=${sourceLang}|en`;
  
      const response = await fetch(url);
      const data = await response.json();
  
      if (!data.responseData || !data.responseData.translatedText) {
        return res.status(500).json({ error: "Translation failed", details: data });
      }
  
      const translated = data.responseData.translatedText;
      res.json({ translated });
  
    } catch (err) {
      console.error("Translation error:", err.message || err);
      res.status(500).json({ error: "Translation failed", details: err.message });
    }
  });

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
