"use client";

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock, TrendingDown, Flame, Calendar, ChevronRight, Activity } from 'lucide-react';

export interface TimelineSnapshot {
  year: number;
  image: string;
  canopy_ratio: number;
  cumulative_loss_ha?: number;
  loss_percent?: number;
  co2_tons?: number;
}

interface TimelinePlayerProps {
  snapshots: TimelineSnapshot[];
  lat: string;
  lng: string;
}

export default function TimelinePlayer({ snapshots, lat, lng }: TimelinePlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Playback timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= snapshots.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1400); // 1.4s per year frame
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, snapshots.length]);

  if (!snapshots || snapshots.length === 0) return null;

  const currentSnapshot = snapshots[currentIndex] || snapshots[0];
  const baseline = snapshots[0];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#111111] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#111111] text-white px-2.5 py-1">
              4D Multi-Year Orbit
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#339966] text-white px-2.5 py-1 border-2 border-[#111111]">
              Historical Regression
            </span>
          </div>
          <h4 className="text-xl font-black uppercase tracking-tight text-[#111111] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#339966]" />
            Multi-Year Time-Series & Canopy Loss Progression
          </h4>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (currentIndex >= snapshots.length - 1) {
                setCurrentIndex(0);
              }
              setIsPlaying(!isPlaying);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#111111] text-white text-xs font-black uppercase tracking-wider border-2 border-[#111111] shadow-[3px_3px_0px_0px_#339966] hover:bg-[#339966] transition-all active:translate-x-0.5 active:translate-y-0.5"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause Timelapse
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Play 4D Timelapse
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentIndex(0);
            }}
            title="Reset to 2020 Baseline"
            className="p-2 bg-white text-[#111111] border-2 border-[#111111] shadow-[2px_2px_0px_0px_#111111] hover:bg-[#F8F9FA] transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Display Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Satellite Frame Viewer */}
        <div className="lg:col-span-7 bg-[#111111] border-2 border-[#111111] shadow-[8px_8px_0px_0px_#111111] relative overflow-hidden flex flex-col">
          <div className="relative w-full h-[360px] md:h-[420px] bg-black">
            <img
              src={currentSnapshot.image}
              alt={`Sentinel-2 Orbit ${currentSnapshot.year}`}
              className="w-full h-full object-cover transition-opacity duration-500"
            />

            {/* Top Left Badge: Active Year */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border-2 border-[#111111] px-4 py-2 shadow-[3px_3px_0px_0px_#111111] flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-[#339966]" />
              <span className="text-lg font-black tracking-tight text-[#111111]">
                ORBIT // {currentSnapshot.year}
              </span>
            </div>

            {/* Top Right Live Coordinate & Sensor Stamp */}
            <div className="absolute top-4 right-4 bg-[#111111]/90 backdrop-blur-sm border border-white/20 text-white px-3 py-1 text-[10px] font-mono">
              ESA SENTINEL-2 MSI // {parseFloat(lat).toFixed(2)}°, {parseFloat(lng).toFixed(2)}°
            </div>

            {/* Bottom Progress Overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm border-2 border-[#111111] p-3 shadow-[3px_3px_0px_0px_#111111] flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                  Canopy Density Index
                </p>
                <p className="text-sm font-black text-[#111111]">
                  {currentSnapshot.canopy_ratio}% Vegetated
                </p>
              </div>

              <div className="text-right">
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                  Relative Forest Depletion
                </p>
                <p className={`text-sm font-black ${Number(currentSnapshot.cumulative_loss_ha || 0) > 0 ? 'text-[#dc2626]' : 'text-[#339966]'}`}>
                  {currentSnapshot.cumulative_loss_ha || 0} HA ({currentSnapshot.loss_percent || 0}%)
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Year Scrubber Slider */}
          <div className="bg-white border-t-2 border-[#111111] p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-[#111111]">
              <span>2020 BASELINE</span>
              <span className="bg-[#339966] text-white px-3 py-0.5 border border-[#111111]">
                {currentSnapshot.year}
              </span>
              <span>{snapshots[snapshots.length - 1].year} CURRENT</span>
            </div>

            <input
              type="range"
              min={0}
              max={snapshots.length - 1}
              step={1}
              value={currentIndex}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentIndex(parseInt(e.target.value));
              }}
              className="w-full h-3 bg-[#F8F9FA] rounded-none border-2 border-[#111111] appearance-none cursor-pointer accent-[#339966]"
            />

            {/* Year Tick Marks */}
            <div className="grid grid-cols-6 gap-1 pt-1">
              {snapshots.map((snap, idx) => (
                <button
                  key={snap.year}
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentIndex(idx);
                  }}
                  className={`py-1 text-[10px] font-black uppercase border transition-all ${
                    idx === currentIndex
                      ? 'bg-[#111111] text-white border-[#111111] shadow-[2px_2px_0px_0px_#339966]'
                      : 'bg-[#F8F9FA] text-[#111111] border-[#111111] hover:bg-white'
                  }`}
                >
                  {snap.year}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Cumulative Loss Curve & Annual Breakdown Table */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white border-2 border-[#111111] p-5 shadow-[6px_6px_0px_0px_#111111]">
            <h5 className="text-xs font-black uppercase tracking-widest text-[#111111] mb-4 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-[#dc2626]" />
              Historical Canopy Degradation Curve
            </h5>

            {/* Visual Loss Bar Chart */}
            <div className="flex flex-col gap-3">
              {snapshots.map((snap, idx) => {
                const lossRatio = snap.loss_percent || 0;
                const isSelected = idx === currentIndex;

                return (
                  <div
                    key={snap.year}
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentIndex(idx);
                    }}
                    className={`cursor-pointer p-2.5 border-2 transition-all ${
                      isSelected
                        ? 'border-[#111111] bg-[#F8F9FA] shadow-[3px_3px_0px_0px_#111111] -translate-y-0.5'
                        : 'border-transparent hover:border-[#111111]/30 hover:bg-[#F8F9FA]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-black text-[#111111] flex items-center gap-1.5">
                        <span className={`w-2 h-2 ${isSelected ? 'bg-[#339966]' : 'bg-[#111111]'}`} />
                        {snap.year}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-slate-600">
                        {snap.cumulative_loss_ha ? `-${snap.cumulative_loss_ha} HA` : 'BASELINE'}
                      </span>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="w-full h-3 bg-slate-100 border border-[#111111] overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          lossRatio > 10 ? 'bg-[#dc2626]' : lossRatio > 0 ? 'bg-[#ea580c]' : 'bg-[#339966]'
                        }`}
                        style={{ width: `${Math.max(4, Math.min(100, (snap.canopy_ratio / (baseline.canopy_ratio || 1)) * 100))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Cumulative Summary Pill */}
          <div className="bg-[#F8F9FA] border-2 border-[#111111] p-4 flex items-center justify-between shadow-[4px_4px_0px_0px_#111111]">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Total Net Degradation</p>
              <p className="text-xl font-black text-[#111111]">
                {snapshots[snapshots.length - 1].cumulative_loss_ha || 0} <span className="text-xs text-[#339966]">HA Cleared</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Emissions Released</p>
              <p className="text-xl font-black text-[#b91c1c]">
                {snapshots[snapshots.length - 1].co2_tons || 0} <span className="text-xs">tCO2e</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
