import { cities } from './cities.js'

const LAYER_SYNONYMS = {
  flood: ['flood', 'floods', 'flooding', 'flood-risk', 'flood risk', 'river overflow'],
  hospitals: ['hospital', 'hospitals', 'clinic', 'clinics', 'medical'],
  schools: ['school', 'schools', 'education', 'college'],
  roads: ['road', 'roads', 'highway', 'highways', 'streets']
}

function detectLayers(text) {
  const lower = text.toLowerCase()
  const selected = { flood: false, hospitals: false, schools: false, roads: false }
  Object.entries(LAYER_SYNONYMS).forEach(([key, synonyms]) => {
    if (synonyms.some(s => lower.includes(s))) selected[key] = true
  })
  // Default: if nothing matched, show hospitals (safe default for demo)
  if (!selected.flood && !selected.hospitals && !selected.schools && !selected.roads) {
    selected.hospitals = true
  }
  return selected
}

function detectCity(text, currentCity) {
  const lower = text.toLowerCase()
  for (const c of Object.keys(cities)) {
    if (lower.includes(c.toLowerCase())) return c
  }
  return currentCity
}

export function parseQuery(text, state) {
  const trace = []
  trace.push(`User query: "${text}"`)

  // 1) Detect city
  const city = detectCity(text, state.city)
  const center = cities[city]
  trace.push(`Detected city: ${city} → center coordinates: [${center.join(', ')}]`)

  // 2) Detect layers
  const layers = detectLayers(text)
  const onLayers = Object.keys(layers).filter(k => layers[k])
  trace.push(`Layer decision: ${onLayers.length ? onLayers.join(', ') : 'hospitals(default)'}`)

  // 3) Intent (simple classification for demo)
  let intent = 'visualize_layers'
  if (text.toLowerCase().includes('near') || text.toLowerCase().includes('around')) {
    intent = 'visualize_layers_near_city'
  }
  trace.push(`Intent: ${intent}`)

  // 4) Return new agent state
  return {
    ...state,
    intent,
    city,
    center,
    layers,
    trace: [...trace, 'Ready. Rendering on map.']
  }
}
