"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Flame, MapPin, Compass, AlertTriangle, ChevronRight, X, Loader2 } from 'lucide-react';

export interface Hotspot {
  id: string;
  name: string;
  region: string;
  biome: string;
  driver: string;
  threatLevel: 'CRITICAL' | 'HIGH' | 'ALARMING';
  lossTrend: string;
  lat: number;
  lng: number;
  zoom: number;
}

export const CURATED_HOTSPOTS: Hotspot[] = [
  {
    id: 'rondonia-fishbone',
    name: 'Rondônia Fishbone Front',
    region: 'Amazon Basin, Brazil',
    biome: 'Tropical Rainforest',
    driver: 'Illegal logging corridors & agricultural encroachment',
    threatLevel: 'CRITICAL',
    lossTrend: 'Historic rapid fragmentation',
    lat: -10.2341,
    lng: -63.3421,
    zoom: 11,
  },
  {
    id: 'novo-progresso-br163',
    name: 'BR-163 Cattle Corridor',
    region: 'Pará, Brazil',
    biome: 'Dense Amazonian Canopy',
    driver: 'Highway-induced pasture expansion & slash-and-burn',
    threatLevel: 'CRITICAL',
    lossTrend: '+42% canopy degradation',
    lat: -7.0450,
    lng: -55.4420,
    zoom: 11,
  },
  {
    id: 'kalimantan-peat',
    name: 'Kalimantan Peatland',
    region: 'Borneo, Indonesia',
    biome: 'Peat Swamp Forest',
    driver: 'Industrial palm oil concessions & canal drainage',
    threatLevel: 'HIGH',
    lossTrend: 'High carbon density loss',
    lat: -2.2136,
    lng: 113.9108,
    zoom: 11,
  },
  {
    id: 'gran-chaco-salta',
    name: 'Gran Chaco Deforestation Front',
    region: 'Salta & Formosa, Argentina/Paraguay',
    biome: 'Dry Tropical Forest',
    driver: 'Large-scale soybean farming & intensive livestock',
    threatLevel: 'CRITICAL',
    lossTrend: 'World-leading clearance velocity',
    lat: -24.4512,
    lng: -62.5218,
    zoom: 11,
  },
  {
    id: 'mai-ndombe-congo',
    name: 'Mai-Ndombe Concession Zone',
    region: 'Congo Basin, DR Congo',
    biome: 'Equatorial Moist Forest',
    driver: 'Artisanal logging concessions & fuel harvesting',
    threatLevel: 'ALARMING',
    lossTrend: 'Accelerating edge erosion',
    lat: -1.9842,
    lng: 18.2715,
    zoom: 11,
  },
  {
    id: 'kinabatangan-sabah',
    name: 'Kinabatangan Corridor',
    region: 'Sabah, Malaysia',
    biome: 'Lowland Rainforest & Wetlands',
    driver: 'Intensive plantation buffer encroachment',
    threatLevel: 'HIGH',
    lossTrend: 'Severe ecological fragmentation',
    lat: 5.4215,
    lng: 118.0125,
    zoom: 11,
  },
  {
    id: 'cerrado-matopiba',
    name: 'MATOPIBA Agricultural Frontier',
    region: 'Maranhão/Tocantins, Brazil',
    biome: 'Cerrado Savanna-Forest Mosaic',
    driver: 'Global agribusiness grain cultivation conversion',
    threatLevel: 'CRITICAL',
    lossTrend: 'Massive biodiversity biome loss',
    lat: -9.5120,
    lng: -45.9230,
    zoom: 11,
  },
];

interface HotspotRadarProps {
  onSelectHotspot: (coords: { lat: number; lng: number; zoom?: number }) => void;
  activeCoords: { lat: string; lng: string };
}

export default function HotspotRadar({ onSelectHotspot, activeCoords }: HotspotRadarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const [isSearchingGeocode, setIsSearchingGeocode] = useState(false);
  const [geocodedResults, setGeocodedResults] = useState<Array<{ name: string; lat: number; lng: number }>>([]);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Filter curated hotspots based on query
  const filteredHotspots = useMemo(() => {
    if (!searchQuery.trim()) return CURATED_HOTSPOTS;
    const q = searchQuery.toLowerCase().trim();
    return CURATED_HOTSPOTS.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.region.toLowerCase().includes(q) ||
        h.biome.toLowerCase().includes(q) ||
        h.driver.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Geocoding handler (supports Nominatim for external places or raw lat/lng input)
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setGeocodedResults([]);

    // Check if user entered raw coordinates e.g., "-3.46, -62.21"
    const coordMatch = val.match(/^(-?\d+(\.\d+)?)[,\s]+(-?\d+(\.\d+)?)$/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[3]);
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        setGeocodedResults([
          {
            name: `Direct Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
            lat,
            lng,
          },
        ]);
        return;
      }
    }

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (val.trim().length > 3 && filteredHotspots.length === 0) {
      searchTimeoutRef.current = setTimeout(async () => {
        setIsSearchingGeocode(true);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              val.trim()
            )}&limit=4`,
            {
              headers: { 'Accept-Language': 'en' },
            }
          );
          if (res.ok) {
            const data = await res.json();
            const mapped = data.map((item: any) => ({
              name: item.display_name,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
            }));
            setGeocodedResults(mapped);
          }
        } catch (err) {
          console.error("Geocoding lookup notice:", err);
        } finally {
          setIsSearchingGeocode(false);
        }
      }, 500);
    }
  };

  const handleSelect = (lat: number, lng: number, zoom = 11, id?: string) => {
    if (id) setSelectedHotspotId(id);
    onSelectHotspot({ lat, lng, zoom });
  };

  const getThreatBadge = (level: Hotspot['threatLevel']) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-[#dc2626] text-white';
      case 'HIGH':
        return 'bg-[#ea580c] text-white';
      case 'ALARMING':
        return 'bg-[#eab308] text-[#111111]';
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="bg-[#111111] text-white px-3 py-1.5 flex items-center gap-2 border-2 border-[#111111]">
            <Compass className="w-4 h-4 text-[#339966] animate-spin" style={{ animationDuration: '10s' }} />
            <span className="text-xs font-black uppercase tracking-widest">Deforestation Threat Radar</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 hidden md:inline">
            Curated Satellite Targets ({CURATED_HOTSPOTS.length})
          </span>
        </div>

        {/* Search Input Box */}
        <div className="relative min-w-[280px] sm:min-w-[340px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search biome, country, or lat,lng..."
            className="w-full bg-white border-2 border-[#111111] pl-9 pr-8 py-1.5 text-xs font-bold text-[#111111] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#339966] shadow-[2px_2px_0px_0px_#111111]"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setGeocodedResults([]);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#111111]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* External Geocoded Suggestions Dropdown */}
          {geocodedResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_0px_#111111] z-50 divide-y-2 divide-[#111111]">
              <div className="px-3 py-1.5 bg-[#F8F9FA] text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>Global Geocoding Results</span>
                {isSearchingGeocode && <Loader2 className="w-3 h-3 animate-spin text-[#339966]" />}
              </div>
              {geocodedResults.map((geo, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleSelect(geo.lat, geo.lng, 10);
                    setGeocodedResults([]);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-[#339966]/10 flex items-center justify-between gap-2 text-xs transition-colors"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <MapPin className="w-3.5 h-3.5 text-[#339966] shrink-0" />
                    <span className="truncate font-bold text-[#111111]">{geo.name}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 shrink-0">
                    {geo.lat.toFixed(2)}, {geo.lng.toFixed(2)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Horizontal Hotspot Cards Carousel */}
      <div className="overflow-x-auto pb-2 -mx-1 px-1 flex gap-4 scrollbar-thin scrollbar-thumb-[#111111]">
        {filteredHotspots.map((hotspot) => {
          const isTargeted =
            selectedHotspotId === hotspot.id ||
            (Math.abs(parseFloat(activeCoords.lat) - hotspot.lat) < 0.05 &&
              Math.abs(parseFloat(activeCoords.lng) - hotspot.lng) < 0.05);

          return (
            <div
              key={hotspot.id}
              onClick={() => handleSelect(hotspot.lat, hotspot.lng, hotspot.zoom, hotspot.id)}
              className={`min-w-[280px] max-w-[280px] sm:min-w-[320px] sm:max-w-[320px] bg-white border-2 border-[#111111] p-4 flex flex-col justify-between cursor-pointer transition-all ${
                isTargeted
                  ? 'shadow-[5px_5px_0px_0px_#339966] border-[#339966] -translate-y-1 bg-[#339966]/5'
                  : 'shadow-[3px_3px_0px_0px_#111111] hover:shadow-[5px_5px_0px_0px_#111111] hover:-translate-y-0.5'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border border-[#111111] ${getThreatBadge(hotspot.threatLevel)}`}>
                    {hotspot.threatLevel}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    {hotspot.lat.toFixed(2)}°, {hotspot.lng.toFixed(2)}°
                  </span>
                </div>

                <h5 className="text-sm font-black uppercase tracking-tight text-[#111111] line-clamp-1">
                  {hotspot.name}
                </h5>
                <p className="text-[11px] font-bold text-[#339966] mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  {hotspot.region}
                </p>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                  {hotspot.driver}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#111111]/20 flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                  {hotspot.lossTrend}
                </span>
                <button
                  type="button"
                  className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider border-2 border-[#111111] transition-all flex items-center gap-1 ${
                    isTargeted
                      ? 'bg-[#339966] text-white shadow-[2px_2px_0px_0px_#111111]'
                      : 'bg-white text-[#111111] hover:bg-[#111111] hover:text-white'
                  }`}
                >
                  {isTargeted ? 'Sector Locked' : 'Target Sector'}
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredHotspots.length === 0 && geocodedResults.length === 0 && !isSearchingGeocode && (
          <div className="min-w-full py-8 border-2 border-dashed border-[#111111]/30 bg-[#F8F9FA] flex flex-col items-center justify-center text-center px-4">
            <AlertTriangle className="w-6 h-6 text-slate-400 mb-2" />
            <p className="text-xs font-black uppercase tracking-wider text-[#111111]">
              No Curated Hotspots Found
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Try searching a country, biome name, or enter coordinates directly like &quot;-10.23, -63.34&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
