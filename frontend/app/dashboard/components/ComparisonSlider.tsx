"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { Layers, Sparkles, Eye, ArrowLeftRight, Activity, Flame, ShieldAlert, Info } from 'lucide-react';

export type SpectralMode = 'after' | 'delta' | 'cir' | 'ndvi';

interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  deltaImage: string;
  cirImage?: string | null;
  ndviImage?: string | null;
}

export default function ComparisonSlider({
  beforeImage,
  afterImage,
  deltaImage,
  cirImage,
  ndviImage,
}: ComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeLayer, setActiveLayer] = useState<SpectralMode>('delta');
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getActiveRightImage = () => {
    switch (activeLayer) {
      case 'after':
        return afterImage;
      case 'delta':
        return deltaImage;
      case 'cir':
        return cirImage || afterImage;
      case 'ndvi':
        return ndviImage || afterImage;
      default:
        return deltaImage;
    }
  };

  const getLayerMeta = (layer: SpectralMode) => {
    switch (layer) {
      case 'delta':
        return {
          title: "AI Delta Mask",
          badge: "Segmented Loss",
          color: "bg-[#dc2626] text-white",
          description: "Pixel-accurate AI overlay isolating cleared and degraded canopy in high-visibility crimson.",
        };
      case 'after':
        return {
          title: "True Color RGB",
          badge: "Current Orbit",
          color: "bg-[#111111] text-white",
          description: "Natural Sentinel-2 optical bands (B4, B3, B2) calibrated under cloud-penetrating QA60 masks.",
        };
      case 'cir':
        return {
          title: "False-Color Infrared",
          badge: "CIR Spectral",
          color: "bg-[#b91c1c] text-white",
          description: "Near-Infrared B8-B4-B3 composite. Chlorophyll-rich primary canopy reflects intense crimson; cleared zones appear cyan/grey.",
        };
      case 'ndvi':
        return {
          title: "NDVI Vegetation Density",
          badge: "Normalized Index",
          color: "bg-[#339966] text-white",
          description: "Normalized Difference Index (B8-B4)/(B8+B4). Direct proxy for biomass density and canopy transpiration.",
        };
    }
  };

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clamped = Math.max(0, Math.min(rect.width, x));
    const percentage = (clamped / rect.width) * 100;
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging && e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  const rightImageSrc = getActiveRightImage();
  const currentMeta = getLayerMeta(activeLayer);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Header & Layer Selection Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-[#111111] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#111111] text-white px-2.5 py-1">
              Curtain Split View
            </span>
            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 border-2 border-[#111111] ${currentMeta.color}`}>
              {currentMeta.badge}
            </span>
          </div>
          <h4 className="text-xl font-black uppercase tracking-tight text-[#111111] flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-[#339966]" />
            Temporal & Spectral Comparison
          </h4>
        </div>

        {/* Spectral Layer Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveLayer('delta')}
            className={`px-3 py-2 text-xs font-black uppercase tracking-wider border-2 border-[#111111] transition-all flex items-center gap-1.5 ${
              activeLayer === 'delta'
                ? 'bg-[#dc2626] text-white shadow-[3px_3px_0px_0px_#111111] -translate-y-0.5'
                : 'bg-white text-[#111111] hover:bg-[#F8F9FA]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            AI Delta
          </button>

          <button
            onClick={() => setActiveLayer('after')}
            className={`px-3 py-2 text-xs font-black uppercase tracking-wider border-2 border-[#111111] transition-all flex items-center gap-1.5 ${
              activeLayer === 'after'
                ? 'bg-[#111111] text-white shadow-[3px_3px_0px_0px_#339966] -translate-y-0.5'
                : 'bg-white text-[#111111] hover:bg-[#F8F9FA]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            True Color
          </button>

          <button
            onClick={() => setActiveLayer('cir')}
            className={`px-3 py-2 text-xs font-black uppercase tracking-wider border-2 border-[#111111] transition-all flex items-center gap-1.5 ${
              activeLayer === 'cir'
                ? 'bg-[#b91c1c] text-white shadow-[3px_3px_0px_0px_#111111] -translate-y-0.5'
                : 'bg-white text-[#111111] hover:bg-[#F8F9FA]'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Infrared (CIR)
          </button>

          <button
            onClick={() => setActiveLayer('ndvi')}
            className={`px-3 py-2 text-xs font-black uppercase tracking-wider border-2 border-[#111111] transition-all flex items-center gap-1.5 ${
              activeLayer === 'ndvi'
                ? 'bg-[#339966] text-white shadow-[3px_3px_0px_0px_#111111] -translate-y-0.5'
                : 'bg-white text-[#111111] hover:bg-[#F8F9FA]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            NDVI Index
          </button>
        </div>
      </div>

      {/* Main Interactive Split Curtain Container */}
      <div className="relative w-full border-2 border-[#111111] shadow-[8px_8px_0px_0px_#111111] bg-[#111111] select-none">
        <div
          ref={containerRef}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          className="relative w-full h-[400px] md:h-[520px] overflow-hidden cursor-ew-resize"
        >
          {/* Base Layer: RIGHT IMAGE (Current Orbit / Spectral) */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={rightImageSrc}
              alt="Comparison Target"
              className="w-full h-full object-cover pointer-events-none"
            />
            {/* Top Right Label */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm border-2 border-[#111111] px-3 py-1.5 shadow-[2px_2px_0px_0px_#111111]">
              <span className="w-2 h-2 rounded-full bg-[#339966] animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-widest text-[#111111]">
                {currentMeta.title}
              </p>
            </div>
          </div>

          {/* Top Layer: LEFT IMAGE (Historical T-1 Year) with Clip Path */}
          <div
            className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src={beforeImage}
              alt="Historical Baseline"
              className="w-full h-full object-cover"
            />
            {/* Top Left Label */}
            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm border-2 border-[#111111] px-3 py-1.5 shadow-[2px_2px_0px_0px_#111111]">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#111111]">
                BASELINE (T-MINUS 1 YR)
              </p>
            </div>
          </div>

          {/* Draggable Divider Line & Custom Neo-Brutalist Handle */}
          <div
            className="absolute top-0 bottom-0 z-30 pointer-events-none flex items-center justify-center"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          >
            {/* Vertical Bar */}
            <div className="w-[3px] h-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.8)] border-x border-[#111111]" />

            {/* Brutalist Center Grip */}
            <div className="absolute w-12 h-12 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_0px_#111111] flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-110 active:scale-95 transition-transform">
              <ArrowLeftRight className="w-5 h-5 text-[#339966]" />
            </div>

            {/* Ratio Float Pill */}
            <div className="absolute -bottom-1 bg-[#111111] text-white px-2 py-0.5 border border-white text-[9px] font-mono font-bold tracking-wider pointer-events-none">
              {Math.round(sliderPosition)}%
            </div>
          </div>
        </div>

        {/* Bottom Control Bar: Presets & Explanatory Drawer */}
        <div className="bg-white border-t-2 border-[#111111] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mr-1">
              Split Presets:
            </span>
            <button
              onClick={() => setSliderPosition(0)}
              className="px-2.5 py-1 text-[10px] font-black uppercase border border-[#111111] hover:bg-[#F8F9FA]"
            >
              100% {activeLayer.toUpperCase()}
            </button>
            <button
              onClick={() => setSliderPosition(50)}
              className="px-2.5 py-1 text-[10px] font-black uppercase border border-[#111111] bg-[#F8F9FA] hover:bg-white"
            >
              50 / 50 Split
            </button>
            <button
              onClick={() => setSliderPosition(100)}
              className="px-2.5 py-1 text-[10px] font-black uppercase border border-[#111111] hover:bg-[#F8F9FA]"
            >
              100% BASELINE
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#111111] max-w-xl">
            <Info className="w-4 h-4 text-[#339966] shrink-0" />
            <p className="text-[11px] font-medium text-slate-600 line-clamp-1">
              <strong className="text-[#111111] uppercase font-bold">{currentMeta.title}:</strong> {currentMeta.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
