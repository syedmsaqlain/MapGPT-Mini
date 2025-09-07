const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // make sure node-fetch@2 is installed for CJS

const app = express();
app.use(cors());
app.use(express.json());

// Translate endpoint
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

app.listen(5000, () => console.log("✅ Translation server running on http://localhost:5000"));
