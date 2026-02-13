<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const mapContainer = ref<HTMLDivElement | null>(null)
const hours = ref(2)

let map: L.Map
let polygonLayer: L.Polygon | null = null
let center: L.LatLng = new L.LatLng(48.8566, 2.3522)

const generateFakeIsochrone = (lat: number, lng: number, hours: number) => {
  const radius = hours * 0.5 // facteur arbitraire pour preview

  return [
    [lat + radius, lng],
    [lat + radius / 2, lng + radius],
    [lat - radius / 2, lng + radius],
    [lat - radius, lng],
    [lat - radius / 2, lng - radius],
    [lat + radius / 2, lng - radius]
  ]
}

const updateIsochrone = () => {
  if (polygonLayer) {
    polygonLayer.remove()
  }

  const coords = generateFakeIsochrone(center.lat, center.lng, hours.value)

  polygonLayer = L.polygon(coords as any, {
    color: '#2563eb',
    fillColor: '#3b82f6',
    fillOpacity: 0.3
  }).addTo(map)
}

onMounted(() => {
  if (!mapContainer.value) return

  map = L.map(mapContainer.value).setView(center, 8)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  map.on('click', (e: L.LeafletMouseEvent) => {
    center = e.latlng
    updateIsochrone()
  })

  updateIsochrone()
})

watch(hours, () => {
  updateIsochrone()
})
</script>

<template>
  <div class="container">
    <div class="controls">
      <label>Temps max : {{ hours }}h</label>
      <input type="range" min="1" max="5" v-model="hours" />
    </div>

    <div id="map" ref="mapContainer"></div>
  </div>
</template>

<style scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.controls {
  padding: 10px;
  background: white;
  z-index: 1000;
}

#map {
  flex: 1;
}
</style>