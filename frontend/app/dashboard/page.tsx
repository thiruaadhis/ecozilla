"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { TreePine, Activity, Map, Target, ChevronDown, Leaf, Crosshair, SlidersHorizontal, LayoutGrid, Flame, DollarSign, FileDown, Clock, Loader2 } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import ComparisonSlider from './components/ComparisonSlider';
import HotspotRadar from './components/HotspotRadar';
import TimelinePlayer, { TimelineSnapshot } from './components/TimelinePlayer';
import { generateSovereignAuditPDF } from './components/AuditPdfExporter';

const InteractiveMap = dynamic(() => import('./components/InteractiveMap'), { ssr: false });

export default function DashboardPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [aimCoords, setAimCoords] = useState({ lat: "-3.4653", lng: "-62.2159" });
  const [lockedCoords, setLockedCoords] = useState<{lat: string, lng: string} | null>(null);
  const [targetMapCoords, setTargetMapCoords] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'slider' | 'tiles' | 'timeline'>('slider');
  const [timelineData, setTimelineData] = useState<TimelineSnapshot[] | null>(null);
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(false);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSelectHotspot = (coords: { lat: number; lng: number; zoom?: number }) => {
    setAimCoords({ lat: coords.lat.toFixed(4), lng: coords.lng.toFixed(4) });
    setTargetMapCoords(coords);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchTimeline = async (coords: { lat: number; lng: number }) => {
    setIsLoadingTimeline(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coords)
      });
      if (res.ok) {
        const data = await res.json();
        setTimelineData(data.snapshots);
      }
    } catch (err) {
      console.error("Timeline fetch error:", err);
    } finally {
      setIsLoadingTimeline(false);
    }
  };

  const handleConfirmScan = async () => {
    setLockedCoords(aimCoords);
    setIsComputing(true);
    setResults(null);
    setTimelineData(null);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    const scanCoords = { lat: parseFloat(aimCoords.lat), lng: parseFloat(aimCoords.lng) };

    // Asynchronously fetch timeline frames in background
    fetchTimeline(scanCoords);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scanCoords)
      });
      
      const data = await response.json();
      
      setResults({
        lat: aimCoords.lat,
        lng: aimCoords.lng,
        loss: data.hectares_lost || data.loss || "0.00",
        lossPercent: data.loss_percent || "0.0",
        co2Tons: data.co2_tons || "0.0",
        creditLossUsd: data.credit_loss_usd || "0.00",
        confidence: data.confidence || "98.7",
        deltaImage: data.delta_image,
        beforeImage: data.before_image,
        afterImage: data.after_image,
        cirImage: data.cir_image,
        ndviImage: data.ndvi_image,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsComputing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] relative overflow-x-clip text-[#111111] font-sans selection:bg-[#339966] selection:text-white flex flex-col pb-24">
      
      <style dangerouslySetInnerHTML={{__html: `
        .noise-bg { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E"); }
      `}} />
      <div className="noise-bg pointer-events-none fixed inset-0 z-50 h-full w-full mix-blend-multiply" />

      <div className="fixed top-0 left-0 w-screen z-50 flex justify-center pt-5 pointer-events-none">
        <nav
          className={`pointer-events-auto grid grid-cols-3 items-center px-6 py-3 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled
              ? "w-[90%] max-w-6xl bg-[#339966]/80 backdrop-blur-2xl rounded-full text-white border-2 border-white/30 shadow-[0_12px_36px_rgba(51,153,102,0.35)]"
              : "w-[96%] max-w-[95rem] bg-white/95 backdrop-blur-md rounded-full text-[#111111] border-2 border-[#111111] shadow-[4px_4px_0px_0px_#111111]"
          }`}
        >
          {/* Left: Brand */}
          <div className="flex items-center gap-3 justify-self-start">
            <Link href="/" className="flex items-center gap-2 group">
              <div className={`p-1.5 rounded-full transition-colors ${isScrolled ? 'bg-white text-[#339966]' : 'bg-[#111111] text-white'}`}>
                <TreePine className="w-4 h-4" />
              </div>
              <span className="text-base font-black tracking-tighter uppercase transition-colors">
                <span className={isScrolled ? 'text-white' : 'text-[#111111]'}>EcoZilla</span>
              </span>
            </Link>
          </div>

          {/* Center: AIM Coordinates HUD Pill (Centrally Aligned) */}
          <div className="flex items-center justify-center justify-self-center">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              title="Click to focus on Map"
              className={`flex items-center gap-1.5 px-4 py-1 text-[11px] font-mono font-bold tracking-wider rounded-full border transition-all ${
                isScrolled
                  ? 'bg-white/15 text-white border-white/30 hover:bg-white hover:text-[#339966]'
                  : 'bg-[#F8F9FA] text-[#111111] border-[#111111] shadow-[2px_2px_0px_0px_#111111] hover:bg-white'
              }`}
            >
              <Crosshair className={`w-3.5 h-3.5 ${isScrolled ? 'text-white' : 'text-[#339966]'}`} />
              <span>AIM: {aimCoords.lat}°, {aimCoords.lng}°</span>
            </button>
          </div>

          {/* Right: UserButton Profile */}
          <div className="flex items-center justify-self-end">
            <UserButton 
              appearance={{
                variables: {
                  colorPrimary: '#339966',
                  colorBackground: '#ffffff',
                  colorText: '#111111',
                  colorInputBackground: '#F8F9FA',
                  colorInputText: '#111111',
                  borderRadius: '0px', 
                } as any,
                elements: {
                  userButtonPopoverCard: "border-2 border-[#111111] shadow-[8px_8px_0px_0px_#339966,16px_16px_0px_0px_#111111] rounded-none",
                  userButtonPopoverActionButton: "hover:bg-[#F8F9FA] rounded-none transition-all px-4 py-3",
                  userButtonPopoverActionButtonText: "font-bold tracking-widest text-xs uppercase text-[#111111]",
                  userButtonPopoverActionButtonIcon: "text-[#339966]",
                  userButtonPopoverFooter: "border-t-2 border-[#111111] p-4 bg-[#F8F9FA]",
                  badge: "bg-[#339966] text-white rounded-none border-2 border-[#111111]",
                  userPreviewSecondaryIdentifier: "font-medium text-slate-500",
                  userPreviewMainIdentifier: "font-black uppercase tracking-tight text-[#111111]",
                  avatarBox: `border-2 ${isScrolled ? 'border-white' : 'border-[#111111] shadow-[2px_2px_0px_0px_#339966]'} rounded-full bg-white transition-all`,
                  modalContent: "border-2 border-[#111111] shadow-[8px_8px_0px_0px_#339966,16px_16px_0px_0px_#111111] rounded-none bg-white",
                  modalBackdrop: "bg-[#111111]/80 backdrop-blur-sm",
                }
              }}
            />
          </div>
        </nav>
      </div>

      <div className="w-full max-w-[95rem] mx-auto mt-36 px-8 z-10 flex flex-col mb-8 gap-8">
        {/* Global Deforestation Threat Radar & Hotspot Selector */}
        <HotspotRadar onSelectHotspot={handleSelectHotspot} activeCoords={aimCoords} />

        {/* Orbital Sector Map Container */}
        <div className="bg-white border-2 border-[#111111] shadow-[12px_12px_0px_0px_#111111] flex flex-col h-[80vh] relative">
          <div className="px-8 py-5 border-b-2 border-[#111111] flex justify-between items-center bg-white z-20">
            <h3 className="text-sm font-black tracking-widest uppercase text-[#111111] flex items-center gap-3">
              <Map className="w-5 h-5 text-[#339966]"/>
              Orbital Sector Map
            </h3>
            <span className="text-[#111111] text-xs font-black tracking-widest uppercase bg-[#F8F9FA] px-4 py-2 border-2 border-[#111111]">
              Awaiting Coordinate Lock
            </span>
          </div>

          <div className="relative flex-1 w-full bg-[#F8F9FA]">
            <InteractiveMap onCenterChange={setAimCoords} targetCoords={targetMapCoords} />
            
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
              <div className="relative flex items-center justify-center">
                <Crosshair className="w-20 h-20 text-[#339966] drop-shadow-[0_0_12px_rgba(255,255,255,1)]" />
                <div className="absolute w-2 h-2 bg-white border-2 border-[#111111] animate-ping" />
              </div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-4">
              <div className="bg-white border-2 border-[#111111] px-4 py-2 shadow-[4px_4px_0px_0px_#111111]">
                <p className="text-xs font-black tracking-widest text-[#111111] uppercase">AIM: {aimCoords.lat}, {aimCoords.lng}</p>
              </div>
              <button 
                onClick={handleConfirmScan}
                disabled={isComputing}
                className="flex items-center gap-3 px-12 py-6 bg-[#339966] text-[#111111] text-sm font-black uppercase tracking-widest border-2 border-[#111111] shadow-[4px_4px_0px_0px_#111111] hover:bg-white hover:translate-x-1 hover:translate-y-1 hover:shadow-[0px_0px_0px_0px_#111111] active:bg-[#F8F9FA] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Target className="w-6 h-6" />
                {isComputing ? 'Executing Matrix...' : 'Lock Sector & Scan'}
              </button>
              {results && (
                <button 
                  onClick={() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-2 text-xs font-black text-[#111111] uppercase tracking-widest bg-white px-8 py-4 border-2 border-[#111111] shadow-[4px_4px_0px_0px_#111111] hover:bg-[#F8F9FA] hover:translate-x-1 hover:translate-y-1 hover:shadow-[0px_0px_0px_0px_#111111] transition-all"
                >
                  View Results <ChevronDown className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div ref={resultsRef} className="w-full max-w-[95rem] mx-auto px-8 relative z-10 mt-12 mb-24">
        <div className="bg-white p-8 md:p-14 border-2 border-[#111111] shadow-[12px_12px_0px_0px_#111111]">
          {/* Section Header with View Mode Switcher */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b-2 border-[#111111] pb-6">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-2 text-[#339966]">
                Copernicus Sentinel-2 & U-Net AI Output
              </p>
              <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase text-[#111111] flex items-center gap-3">
                Geospatial Deforestation & Spectral Analysis
              </h3>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {results && (
                <>
                  <div className="flex items-center border-2 border-[#111111] bg-[#F8F9FA] p-1 shadow-[3px_3px_0px_0px_#111111]">
                    <button
                      onClick={() => setViewMode('slider')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all ${
                        viewMode === 'slider'
                          ? 'bg-[#111111] text-white'
                          : 'text-[#111111] hover:bg-white'
                      }`}
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      Curtain Slider
                    </button>
                    <button
                      onClick={() => setViewMode('tiles')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all ${
                        viewMode === 'tiles'
                          ? 'bg-[#111111] text-white'
                          : 'text-[#111111] hover:bg-white'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      Tile Matrix
                    </button>
                    <button
                      onClick={() => setViewMode('timeline')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all ${
                        viewMode === 'timeline'
                          ? 'bg-[#339966] text-white'
                          : 'text-[#111111] hover:bg-white'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      4D Timeline
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      generateSovereignAuditPDF({
                        sectorId: `${lockedCoords?.lat}_${lockedCoords?.lng}`,
                        lat: lockedCoords?.lat || aimCoords.lat,
                        lng: lockedCoords?.lng || aimCoords.lng,
                        hectaresLost: results.loss || results.hectares_lost,
                        lossPercent: results.lossPercent || results.loss_percent || "0.0",
                        co2Tons: results.co2Tons || results.co2_tons || "0.0",
                        creditLossUsd: results.creditLossUsd || results.credit_loss_usd || "0.00",
                        confidence: results.confidence || "98.7",
                        beforeImage: results.beforeImage,
                        afterImage: results.afterImage,
                        deltaImage: results.deltaImage,
                        cirImage: results.cirImage,
                        ndviImage: results.ndviImage,
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#339966] text-white text-xs font-black uppercase tracking-wider border-2 border-[#111111] shadow-[3px_3px_0px_0px_#111111] hover:bg-[#111111] hover:text-white transition-all active:translate-x-0.5 active:translate-y-0.5"
                  >
                    <FileDown className="w-4 h-4" />
                    Download Sovereign Audit (PDF)
                  </button>
                </>
              )}

              {lockedCoords && (
                <div className="text-right">
                  <span className="text-[#111111] text-xs font-black tracking-widest border-2 border-[#111111] px-4 py-2 bg-[#F8F9FA] shadow-[3px_3px_0px_0px_#111111] inline-block">
                    LOCK: {lockedCoords.lat}, {lockedCoords.lng}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Visual Analysis Display (Curtain Slider vs Tile Matrix vs 4D Timeline) */}
          {isComputing ? (
            <div className="h-96 bg-[#F8F9FA] border-2 border-[#111111] shadow-[6px_6px_0px_0px_#111111] flex flex-col items-center justify-center gap-4 mb-10">
              <Activity className="w-12 h-12 text-[#339966] animate-spin" />
              <div className="text-center">
                <p className="text-sm font-black tracking-widest uppercase text-[#111111]">
                  Streaming Sentinel-2 Bands & Inferencing U-Net...
                </p>
                <p className="text-xs font-mono text-slate-500 mt-1">
                  Synthesizing Spectral Vegetation Delta & IPCC Carbon Biomass
                </p>
              </div>
            </div>
          ) : results ? (
            <div className="mb-10">
              {viewMode === 'timeline' ? (
                timelineData ? (
                  <TimelinePlayer
                    snapshots={timelineData}
                    lat={lockedCoords?.lat || aimCoords.lat}
                    lng={lockedCoords?.lng || aimCoords.lng}
                  />
                ) : (
                  <div className="h-80 bg-[#F8F9FA] border-2 border-[#111111] shadow-[6px_6px_0px_0px_#111111] flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 text-[#339966] animate-spin" />
                    <p className="text-xs font-black uppercase tracking-wider text-[#111111]">
                      {isLoadingTimeline ? 'Synthesizing Multi-Year Historical Satellite Frames...' : 'Loading 4D Historical Archive...'}
                    </p>
                  </div>
                )
              ) : viewMode === 'slider' ? (
                <ComparisonSlider
                  beforeImage={results.beforeImage}
                  afterImage={results.afterImage}
                  deltaImage={results.deltaImage}
                  cirImage={results.cirImage}
                  ndviImage={results.ndviImage}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-80">
                  <div className="bg-[#F8F9FA] border-2 border-[#111111] relative flex flex-col items-center justify-center shadow-[6px_6px_0px_0px_#111111] overflow-hidden">
                    <img src={results.beforeImage} alt="Before" className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 bg-white text-[#111111] text-[10px] font-black tracking-widest px-3 py-1.5 border-2 border-[#111111] shadow-[2px_2px_0px_0px_#111111]">
                      BASELINE (T-1 YR)
                    </div>
                  </div>
                  
                  <div className="bg-[#F8F9FA] border-2 border-[#111111] relative flex flex-col items-center justify-center shadow-[6px_6px_0px_0px_#111111] overflow-hidden">
                    <img src={results.afterImage} alt="After" className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 bg-white text-[#111111] text-[10px] font-black tracking-widest px-3 py-1.5 border-2 border-[#111111] shadow-[2px_2px_0px_0px_#111111]">
                      CURRENT ORBIT
                    </div>
                  </div>

                  <div className="bg-white border-4 border-[#339966] relative flex flex-col items-center justify-center shadow-[6px_6px_0px_0px_#339966] overflow-hidden">
                    <img src={results.deltaImage} alt="Deforestation Delta Mask" className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 bg-[#339966] text-white text-[10px] font-black tracking-widest px-3 py-1.5 border-2 border-[#111111] shadow-[2px_2px_0px_0px_#111111]">
                      AI DELTA MASK
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-72 bg-[#F8F9FA] border-2 border-dashed border-[#111111]/40 flex flex-col items-center justify-center mb-10 text-center px-4">
              <Crosshair className="w-12 h-12 text-slate-400 mb-3" />
              <p className="text-sm font-black uppercase tracking-widest text-[#111111]">
                Awaiting Target Sector Lock
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Aim the crosshair on the map above and click &quot;Lock Sector &amp; Scan&quot; to begin AI analysis.
              </p>
            </div>
          )}

          {/* Expanded Impact Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border-2 border-[#111111] p-6 flex flex-col justify-between shadow-[6px_6px_0px_0px_#111111]">
              <div>
                <p className="text-[#111111] text-[10px] font-black tracking-widest uppercase mb-2">Canopy Loss Area</p>
                <p className="text-4xl font-black tracking-tighter text-[#111111]">
                  {results ? results.loss : "0.00"} <span className="text-xl text-[#339966]">HA</span>
                </p>
              </div>
              <p className="text-[11px] font-mono text-slate-500 mt-3">
                {results ? `${results.lossPercent}% of sector cleared` : 'Sector: 1,600 HA'}
              </p>
            </div>

            <div className="bg-white border-2 border-[#111111] p-6 flex flex-col justify-between shadow-[6px_6px_0px_0px_#111111]">
              <div>
                <p className="text-[#111111] text-[10px] font-black tracking-widest uppercase mb-2 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#b91c1c]" />
                  CO₂ Biomass Release
                </p>
                <p className="text-4xl font-black tracking-tighter text-[#111111]">
                  {results ? results.co2Tons : "0.0"} <span className="text-xl text-[#b91c1c]">tCO₂e</span>
                </p>
              </div>
              <p className="text-[11px] font-mono text-slate-500 mt-3">
                IPCC standard: 260 tCO₂e/HA
              </p>
            </div>

            <div className="bg-white border-2 border-[#111111] p-6 flex flex-col justify-between shadow-[6px_6px_0px_0px_#111111]">
              <div>
                <p className="text-[#111111] text-[10px] font-black tracking-widest uppercase mb-2 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-[#339966]" />
                  Carbon Credit Loss
                </p>
                <p className="text-4xl font-black tracking-tighter text-[#111111]">
                  ${results ? Number(results.creditLossUsd).toLocaleString() : "0.00"}
                </p>
              </div>
              <p className="text-[11px] font-mono text-slate-500 mt-3">
                VCM benchmark: $25.00/tCO₂e
              </p>
            </div>

            <div className="bg-[#339966] text-white p-6 flex flex-col justify-between relative overflow-hidden border-2 border-[#111111] shadow-[6px_6px_0px_0px_#111111]">
              <Activity className={`absolute -right-4 -bottom-4 w-28 h-28 text-white opacity-20 ${isComputing ? 'animate-pulse' : ''}`} />
              <div>
                <p className="text-white text-[10px] font-black tracking-widest uppercase mb-2">Model Confidence</p>
                <p className="text-4xl font-black tracking-tight text-white">
                  {results ? `${results.confidence}%` : "--.-%"}
                </p>
              </div>
              <p className="text-[11px] font-black uppercase tracking-wider text-white/90 mt-3">
                {isComputing ? 'COMPUTING...' : results ? 'ANALYSIS COMPLETE' : 'SYSTEM STANDBY'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}