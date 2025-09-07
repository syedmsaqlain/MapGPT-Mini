import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import hospitals from '../data/hospitals.geojson'
import flood from '../data/flood_zones.geojson'
import roads from '../data/roads.geojson'
import schools from '../data/schools.geojson'

// Fix marker icons in Vite
import marker2x from 'leaflet/dist/images/marker-icon-2x.png'
import marker from 'leaflet/dist/images/marker-icon.png'
import shadow from 'leaflet/dist/images/marker-shadow.png'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl: marker2x, iconUrl: marker, shadowUrl: shadow })

function Recenter({ center }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, 12, { animate: true })
  }, [center])
  return null
}

export default function MapView({ agentState }) {
  const { center, layers } = agentState

  const hospitalPoints = (feature = {}, latlng) => L.marker(latlng)
  const schoolPoints = (feature = {}, latlng) => L.marker(latlng)

  return (
    <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
      <Recenter center={center} />

      {layers.flood && (
        <GeoJSON data={flood} style={{ color: '#2563eb', weight: 2, fillOpacity: 0.2 }} />
      )}

      {layers.hospitals && (
        <GeoJSON data={hospitals} pointToLayer={hospitalPoints} />
      )}

      {layers.schools && (
        <GeoJSON data={schools} pointToLayer={schoolPoints} />
      )}

      {layers.roads && (
        <GeoJSON data={roads} style={{ color: '#f59e0b', weight: 3 }} />
      )}
    </MapContainer>
  )
}
