"use client";

import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

interface CenterTrackerProps {
  onCenterChange: (coords: { lat: string; lng: string }) => void;
}

function CenterTracker({ onCenterChange }: CenterTrackerProps) {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      onCenterChange({ lat: center.lat.toFixed(4), lng: center.lng.toFixed(4) });
    },
  });
  
  useEffect(() => {
    const center = map.getCenter();
    onCenterChange({ lat: center.lat.toFixed(4), lng: center.lng.toFixed(4) });
  }, [map, onCenterChange]);

  return null;
}

export default function InteractiveMap({ onCenterChange }: CenterTrackerProps) {
  return (
    <MapContainer 
      center={[-3.4653, -62.2159]} 
      zoom={5} 
      zoomControl={false}
      style={{ minHeight: '60vh', height: '100%', width: '100%', zIndex: 10 }} 
      className="absolute inset-0 grayscale-[20%] contrast-125 cursor-grab active:cursor-grabbing"
    >
      <TileLayer 
        url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" 
      />
      <CenterTracker onCenterChange={onCenterChange} />
    </MapContainer>
  );
}