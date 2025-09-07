import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/translate", async (req, res) => {
  const { text, sourceLang } = req.body;

  try {
    const response = await fetch("https://translate.argosopentech.com/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({// translateServer.js
        import express from "express";
        import cors from "cors";
        import fetch from "node-fetch";
        
        const app = express();
        app.use(cors());
        app.use(express.json());
        
        // POST /api/translate
        app.post("/api/translate", async (req, res) => {
          try {
            const { text, sourceLang } = req.body;
        
            if (!text || !sourceLang) {
              return res.status(400).json({ error: "text and sourceLang are required" });
            }
        
            const response = await fetch("https://libretranslate.de/translate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                q: text,
                source: sourceLang,
                target: "en",
                format: "text"
              })
            });
        
            if (!response.ok) {
              const errText = await response.text();
              throw new Error(`LibreTranslate error: ${errText}`);
            }
        
            const data = await response.json();
            res.json({ translatedText: data.translatedText });
        
          } catch (err) {
            console.error("Translation error:", err.message);
            res.status(500).json({ error: "Translation failed", details: err.message });
          }
        });
        
        const PORT = 5000;
        app.listen(PORT, () => console.log(`✅ Translate server running on http://localhost:${PORT}`));
        
        q: text,
        source: sourceLang,
        target: "en",
        format: "text"
      })
    });

    // Ensure response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const html = await response.text();
      return res.status(500).json({ error: "Non-JSON response", details: html });
    }

    const data = await response.json();
    res.json({ translatedText: data.translatedText });

  } catch (err) {
    console.error("Translation error:", err);
    res.status(500).json({ error: "Translation failed", details: err.message });
  }
});

app.listen(5000, () => console.log("✅ Backend running on http://localhost:5000"));
