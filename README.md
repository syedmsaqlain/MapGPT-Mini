# MapGPT Mini — Showcase Project

A presentable, demo-ready AI + GIS mini app. Users can type natural language queries like
“Show flood risk zones near Lahore and hospitals” and the **agent** interprets the request into
map actions (toggle layers, recenter map).

This is a **services showcase**: you can brand it, demo it live, and hand clients a clear scope
for custom GIS copilots.

## ✨ Features
- Natural-language → map intent (rule-based agent for demo reliability)
- Toggle layers: flood zones (polygons), hospitals & schools (points), roads (lines)
- Recenter map to cities in Pakistan (Lahore, Karachi, Islamabad, Multan, Peshawar)
- Agent Trace panel shows the decision process (looks agentic and transparent)
- Clean UI (Tailwind), smooth animations (Framer Motion), fast dev (Vite)

## 🏗️ Tech Stack
- React 18 + Vite 5
- TailwindCSS
- Leaflet + React-Leaflet
- Framer Motion

## 📦 Quick Start
```bash
# 1) Extract & install
npm i

# 2) Run locally
npm run dev
# open the printed local URL
```

If you created this from the ZIP I provided, first unzip then run the commands above.

## 🧠 How the Agent Works (Demo-Safe)
- A small rule-based parser maps synonyms to layers (e.g., “flood”, “flood risk” → flood layer)
- Detects a city name and recenters map (Lahore/Karachi/Islamabad/Multan/Peshawar)
- Sets an “intent” (display layers) and app state
- Shows **Agent Trace** entries so stakeholders understand the reasoning

> Optional: Replace `src/lib/nlp.js` with an LLM service for deeper NLU once you’re ready.

## 🗺️ Data
- `src/data/*.geojson` contains small sample layers for demo. Replace these with client data for POCs.
- All coordinates are approximate for public demo purposes only.

## 🧪 Demo Script (2–3 minutes)
1. “Show flood risk zones near Lahore.” → Flood polygons appear; map recenters to Lahore; trace shows decisions.
2. “Show hospitals in Lahore.” → Hospital markers appear.
3. “Show schools in Karachi.” → Recenter to Karachi; schools appear.
4. “Display major roads around Islamabad.” → Roads lines appear.

**Pitch line:** *“In a full build, this agent connects to your live GIS layers, understands complex requests,
and generates reports or alerts in minutes.”*

## 🧰 File Structure
```
mapgpt-mini/
  index.html
  package.json
  postcss.config.js
  tailwind.config.js
  vite.config.js
  src/
    App.jsx
    main.jsx
    styles.css
    components/
      ControlPanel.jsx
      MapView.jsx
    lib/
      nlp.js
      cities.js
    data/
      flood_zones.geojson
      hospitals.geojson
      schools.geojson
      roads.geojson
```

## 🎨 Make It Presentation-Ready (Checklist)
- [ ] Add your logo & brand colors (replace the title & tweak Tailwind classes)
- [ ] Replace sample GeoJSON with a client’s area (they’ll love seeing familiar places)
- [ ] Record a 60–90 sec screen-capture demo (with captions)
- [ ] Publish a live link (Netlify/Vercel) + include in your website/portfolio
- [ ] Prepare a one-page PDF describing: Problem → Solution → Timeline → Pricing → Next Steps

## 🌐 Deploy (Netlify example)
1. Create a new site from your Git repo or drag-and-drop the folder in Netlify UI.
2. Build command: `npm run build` — Publish directory: `dist/`.
3. Share the URL in your pitch deck and LinkedIn posts.

## 🔒 Privacy & Scope Notes
- This demo is purely front-end; no data leaves the browser.
- For enterprise clients, plan on SSO, RBAC, audit logs, and a small Node/Express backend.

## 🚀 Next Up (Upsell Ideas)
- Upload shapefiles/GeoJSON dynamically and store in a backend
- Connect to PostGIS / GeoServer / Mapbox tiles
- LLM-powered natural-language parsing with safety rails
- “Generate report” button to export a PDF with map and insights

---

**Author:** Your Company — Custom AI & GIS Solutions
