"use client";

import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

interface InteractiveMapProps {
  onCenterChange: (coords: { lat: string; lng: string }) => void;
  targetCoords?: { lat: number; lng: number; zoom?: number } | null;
}

function CenterTracker({ onCenterChange }: { onCenterChange: (coords: { lat: string; lng: string }) => void }) {
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

function MapController({ targetCoords }: { targetCoords?: { lat: number; lng: number; zoom?: number } | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (targetCoords) {
      map.flyTo([targetCoords.lat, targetCoords.lng], targetCoords.zoom || 11, {
        duration: 1.6,
        easeLinearity: 0.25,
      });
    }
  }, [targetCoords, map]);

  return null;
}

export default function InteractiveMap({ onCenterChange, targetCoords }: InteractiveMapProps) {
  const LeafletMap = MapContainer as any;

  return (
    <LeafletMap 
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
      <MapController targetCoords={targetCoords} />
    </LeafletMap>
  );
}