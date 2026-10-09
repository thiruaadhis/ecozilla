"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { TreePine, Activity, Map, Server, Crosshair, Target, ChevronDown, Leaf } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

export default function DashboardPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lockedCoords, setLockedCoords] = useState(null);
  const [isComputing, setIsComputing] = useState(false);
  const [results, setResults] = useState(null);
  
  const resultsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleConfirmScan = () => {
    const lat = (Math.random() * 180 - 90).toFixed(4);
    const lng = (Math.random() * 360 - 180).toFixed(4);
    const newCoords = { lat, lng };
    
    setLockedCoords(newCoords);
    setIsComputing(true);
    setResults(null);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    setTimeout(() => {
      const newResult = {
        lat: newCoords.lat,
        lng: newCoords.lng,
        loss: (Math.random() * 10 + 2).toFixed(2),
        confidence: (Math.random() * 10 + 89).toFixed(1)
      };
      setResults(newResult);
      setIsComputing(false);
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] relative overflow-x-clip text-[#111111] font-sans selection:bg-[#339966] selection:text-white flex flex-col pb-24">
      
      <style dangerouslySetInnerHTML={{__html: `
        .noise-bg { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E"); }
      `}} />
      <div className="noise-bg pointer-events-none fixed inset-0 z-50 h-full w-full mix-blend-multiply" />

      <div className="fixed top-0 left-0 w-screen z-50 flex justify-center pt-8 pointer-events-none">
        <nav className={`pointer-events-auto flex items-center justify-between px-8 py-4 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? "w-[85%] max-w-5xl bg-[#339966]/75 backdrop-blur-2xl rounded-full text-white shadow-[0_8px_30px_rgba(51,153,102,0.2)]" : "w-full max-w-[90rem] bg-transparent rounded-full text-[#111111]"}`}>
          <div className="flex items-center gap-2">
            <TreePine className={`w-6 h-6 transition-colors duration-1000 ${isScrolled ? 'text-white' : 'text-[#339966]'}`} />
            <span className="text-xl font-black tracking-tighter uppercase">EcoZilla</span>
          </div>
          <div className="flex items-center gap-6 text-xs font-bold tracking-widest uppercase">
            <Link href="/" className="hover:opacity-50 transition-opacity">Home</Link>
            <Link href="/history" className="hover:opacity-50 transition-opacity">History</Link>
            
            <UserButton 
              appearance={{
                variables: {
                  colorPrimary: '#339966',
                  colorBackground: '#ffffff',
                  colorText: '#111111',
                  colorInputBackground: '#F8F9FA',
                  colorInputText: '#111111',
                  borderRadius: '0px', 
                },
                elements: {
                  userButtonPopoverCard: "border-2 border-[#111111] shadow-[8px_8px_0px_0px_#339966,16px_16px_0px_0px_#111111] rounded-none",
                  userButtonPopoverActionButton: "hover:bg-[#F8F9FA] rounded-none transition-all px-4 py-3",
                  userButtonPopoverActionButtonText: "font-bold tracking-widest text-xs uppercase text-[#111111]",
                  userButtonPopoverActionButtonIcon: "text-[#339966]",
                  userButtonPopoverFooter: "border-t-2 border-[#111111] p-4 bg-[#F8F9FA]",
                  badge: "bg-[#339966] text-white rounded-none border-2 border-[#111111]",
                  userPreviewSecondaryIdentifier: "font-medium text-slate-500",
                  userPreviewMainIdentifier: "font-black uppercase tracking-tight text-[#111111]",
                  avatarBox: `border-2 ${isScrolled ? 'border-white' : 'border-[#111111] shadow-[2px_2px_0px_0px_#339966]'} rounded-none bg-white transition-all`,
                  modalContent: "border-2 border-[#111111] shadow-[8px_8px_0px_0px_#339966,16px_16px_0px_0px_#111111] rounded-none bg-white",
                  modalBackdrop: "bg-[#111111]/80 backdrop-blur-sm",
                }
              }}
              userProfileProps={{
                appearance: {
                  variables: {
                    colorPrimary: '#339966',
                    colorBackground: '#ffffff',
                    colorText: '#111111',
                    colorInputBackground: '#F8F9FA',
                    colorInputText: '#111111',
                    borderRadius: '0px', 
                  },
                  elements: {
                    card: "shadow-none border-none rounded-none bg-transparent",
                    navbar: "border-r-2 border-[#111111] bg-[#F8F9FA]",
                    navbarButton: "hover:bg-[#339966] hover:text-white rounded-none text-xs font-bold uppercase tracking-widest text-[#111111] transition-colors",
                    headerTitle: "text-2xl font-black tracking-tighter uppercase text-[#111111]",
                    headerSubtitle: "text-xs font-bold tracking-widest uppercase text-[#339966]",
                    profileSectionTitle: "text-sm font-black uppercase tracking-widest border-b-2 border-[#111111] pb-2 text-[#111111]",
                    profileSectionPrimaryButton: "text-[#339966] hover:text-[#111111] font-bold uppercase text-xs tracking-widest transition-colors",
                    accordionTriggerButton: "text-xs font-bold uppercase tracking-widest text-[#111111]",
                    formButtonPrimary: "bg-[#111111] border-2 border-[#111111] hover:bg-[#339966] hover:border-[#339966] text-white text-xs font-black uppercase tracking-widest py-3 transition-all rounded-none",
                    formFieldLabel: "text-xs font-bold tracking-widest uppercase text-[#111111]",
                    formFieldInput: "border-2 border-[#111111] py-2 px-3 focus:border-[#339966] focus:ring-0 transition-colors font-medium rounded-none",
                    badge: "bg-[#339966] text-white rounded-none border-2 border-[#111111]",
                  }
                }
              }}
            />
          </div>
        </nav>
      </div>

      <div className="w-full max-w-[95rem] mx-auto mt-36 px-8 z-10 flex flex-col mb-4">
        <div className="bg-white border-2 border-[#111111] shadow-[12px_12px_0px_0px_#111111] flex flex-col h-[85vh] relative">
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
            <iframe 
              className="w-full h-full grayscale-[20%] contrast-125"
              style={{ border: 0 }} 
              src="https://maps.google.com/maps?ll=-3.4653,-62.2159&t=k&z=5&ie=UTF8&iwloc=&output=embed" 
            />
            
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                <Crosshair className="w-20 h-20 text-[#339966] drop-shadow-[0_0_12px_rgba(255,255,255,1)]" />
                <div className="absolute w-2 h-2 bg-white border-2 border-[#111111] animate-ping" />
              </div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
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

      <div className="relative w-full h-32 my-12 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 150 }).map((_, i) => {
          const randomYOffset = (Math.sin(i * 17) * 18).toFixed(2);
          const leftPercent = ((i / 150) * 104 - 2).toFixed(2);
          const randomRotation = (i * 83) % 360;
          const size = 18 + (i % 5) * 6;

          return (
            <Leaf 
              key={`bottom-${i}`}
              className="absolute text-[#339966] fill-[#339966] drop-shadow-sm opacity-90"
              style={{
                left: `${leftPercent}%`,
                top: `calc(50% + ${randomYOffset}px)`,
                width: `${size}px`,
                height: `${size}px`,
                transform: `translate(-50%, -50%) rotate(${randomRotation}deg)`,
              }}
            />
          );
        })}
      </div>

      <div ref={resultsRef} className="w-full max-w-[95rem] mx-auto px-8 relative z-10">
        <div className="bg-white p-8 md:p-16 border-2 border-[#111111] shadow-[12px_12px_0px_0px_#111111]">
          <div className="flex justify-between items-end mb-12 border-b-2 border-[#111111] pb-6">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-4 text-[#339966]">U-Net Architecture Output</p>
              <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase text-[#111111] flex items-center gap-3">
                Geospatial Deforestation Analysis
              </h3>
            </div>
            {lockedCoords && (
              <div className="text-right">
                <span className="text-[#111111] text-xs font-black tracking-widest border-2 border-[#111111] px-4 py-2 bg-[#F8F9FA] shadow-[4px_4px_0px_0px_#111111]">
                  LOCKED: {lockedCoords.lat}, {lockedCoords.lng}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-80 mb-12">
            <div className="bg-[#F8F9FA] border-2 border-[#111111] relative flex flex-col items-center justify-center shadow-[6px_6px_0px_0px_#111111]">
              {isComputing ? (
                <Activity className="w-10 h-10 text-[#339966] animate-spin" />
              ) : results ? (
                <div className="w-full h-full bg-zinc-300" /> 
              ) : (
                <span className="text-xs font-black text-[#111111] tracking-widest uppercase text-center px-4">T-Minus 6 Months</span>
              )}
              {results && <div className="absolute top-4 left-4 bg-white text-[#111111] text-[10px] font-black tracking-widest px-3 py-1.5 border-2 border-[#111111] shadow-[2px_2px_0px_0px_#111111]">BEFORE</div>}
            </div>
            
            <div className="bg-[#F8F9FA] border-2 border-[#111111] relative flex flex-col items-center justify-center shadow-[6px_6px_0px_0px_#111111]">
              {isComputing ? (
                <Activity className="w-10 h-10 text-[#339966] animate-spin" />
              ) : results ? (
                <div className="w-full h-full bg-zinc-400" />
              ) : (
                <span className="text-xs font-black text-[#111111] tracking-widest uppercase text-center px-4">Current Orbit</span>
              )}
              {results && <div className="absolute top-4 left-4 bg-white text-[#111111] text-[10px] font-black tracking-widest px-3 py-1.5 border-2 border-[#111111] shadow-[2px_2px_0px_0px_#111111]">AFTER</div>}
            </div>

            <div className="bg-white border-4 border-[#339966] relative flex flex-col items-center justify-center shadow-[6px_6px_0px_0px_#339966]">
              {isComputing ? (
                <p className="text-[#111111] text-xs font-black tracking-widest animate-pulse">PROCESSING TENSORS...</p>
              ) : results ? (
                <div className="w-full h-full bg-[#339966]/10 flex items-center justify-center text-[#111111] font-black tracking-widest text-lg">MASK RENDERED</div>
              ) : (
                <span className="text-xs font-black text-[#111111] tracking-widest uppercase opacity-40">AI Mask</span>
              )}
              {results && <div className="absolute top-4 left-4 bg-[#339966] text-white text-[10px] font-black tracking-widest px-3 py-1.5 border-2 border-[#111111] shadow-[2px_2px_0px_0px_#111111]">DELTA</div>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border-2 border-[#111111] p-8 flex flex-col justify-center shadow-[6px_6px_0px_0px_#111111]">
              <p className="text-[#111111] text-[10px] font-black tracking-widest uppercase mb-3">Canopy Loss Area</p>
              <p className="text-5xl font-black tracking-tighter text-[#111111]">
                {results ? results.loss : "0.00"} <span className="text-2xl text-[#339966]">HA</span>
              </p>
            </div>
            <div className="bg-white border-2 border-[#111111] p-8 flex flex-col justify-center shadow-[6px_6px_0px_0px_#111111]">
              <p className="text-[#111111] text-[10px] font-black tracking-widest uppercase mb-3">Model Confidence</p>
              <p className="text-5xl font-black tracking-tighter text-[#111111]">
                {results ? results.confidence : "--.-"} <span className="text-2xl text-[#339966]">%</span>
              </p>
            </div>
            <div className="bg-[#339966] text-white p-8 flex flex-col justify-center relative overflow-hidden border-2 border-[#111111] shadow-[6px_6px_0px_0px_#111111]">
              <Activity className={`absolute right-4 top-1/2 -translate-y-1/2 w-32 h-32 text-white opacity-20 ${isComputing ? 'animate-pulse' : ''}`} />
              <p className="text-white text-[10px] font-black tracking-widest uppercase mb-3">System Status</p>
              <p className="text-2xl font-black tracking-widest text-white">
                {isComputing ? 'COMPUTING...' : results ? 'ANALYSIS COMPLETE' : 'STANDBY'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}