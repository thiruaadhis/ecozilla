"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TreePine, UploadCloud, Activity, Map, Database, Server } from 'lucide-react';

export default function DashboardPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[#F8F9FA] relative overflow-x-hidden text-slate-900 font-sans selection:bg-[#339966] selection:text-white">
      
      {/* 1367 Studio Analog Noise Overlay */}
      <style dangerouslySetInnerHTML={{__html: `
        .noise-bg { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E"); }
      `}} />
      <div className="noise-bg pointer-events-none fixed inset-0 z-0 h-full w-full mix-blend-multiply" />

      {/* Flawless Static-Y Scrolling Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 flex justify-center pt-8 pointer-events-none">
        <nav className={`pointer-events-auto flex items-center justify-between px-8 py-4 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? "w-[85%] max-w-5xl bg-[#339966]/75 backdrop-blur-2xl rounded-full text-white shadow-[0_8px_30px_rgba(51,153,102,0.2)]" : "w-full max-w-[90rem] bg-transparent rounded-full text-[#111111]"}`}>
          <div className="flex items-center gap-2">
            <TreePine className={`w-6 h-6 transition-colors duration-1000 ${isScrolled ? 'text-white' : 'text-[#339966]'}`} />
            <span className="text-xl font-black tracking-tighter uppercase">EcoZilla // Command</span>
          </div>
          <div className="flex items-center gap-8 text-xs font-bold tracking-widest uppercase">
            <Link href="/" className="hover:opacity-50 transition-opacity">Exit Matrix</Link>
            <button className={`px-6 py-2.5 rounded-full transition-colors duration-1000 ${isScrolled ? 'bg-white text-[#339966] hover:bg-[#111111] hover:text-white' : 'bg-[#111111] text-white hover:bg-[#339966]'}`}>
              Export Log
            </button>
          </div>
        </nav>
      </div>

      {/* Hardware Status Ping Bar */}
      <div className="relative z-10 w-full bg-[#111111] text-[#339966] text-[10px] font-black tracking-widest uppercase flex justify-between px-8 py-3 mt-32">
        <div className="flex gap-6 max-w-[90rem] mx-auto w-full">
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#339966] animate-pulse"/> ENGINE: ACTIVE</span>
          <span className="hidden md:inline">LATENCY: 14MS</span>
          <span className="hidden md:inline">GPU: RTX 4060 ALLOCATED</span>
          <span className="ml-auto">SYS_TIME: 09:42:01</span>
        </div>
      </div>

      {/* Borderless Telemetry Matrix Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-160px)] max-w-[90rem] mx-auto w-full bg-white shadow-xl">
        
        {/* Left Sidebar */}
        <aside className="lg:col-span-3 bg-[#F8F9FA] flex flex-col">
          <div className="p-8 bg-white">
            <h3 className="text-sm font-black tracking-widest uppercase mb-4 text-[#339966]">Orbital Feed Input</h3>
            <div className="border-2 border-dashed border-[#111111]/20 p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#339966] hover:bg-[#339966]/5 transition-all group">
              <UploadCloud className="w-8 h-8 mb-3 text-[#111111] group-hover:text-[#339966] transition-colors" />
              <span className="text-xs font-bold uppercase tracking-widest text-center text-[#111111]">Drop Spatial GeoTIFF<br/>Or Browse</span>
            </div>
          </div>
          <div className="p-8 flex-1">
            <h3 className="text-sm font-black tracking-widest uppercase mb-4 text-[#111111] flex items-center gap-2"><Database className="w-4 h-4 text-[#339966]"/> Inference Logs</h3>
            <div className="space-y-2">
              {[ 'Sector 7G - Amazon', 'Sector 4B - Congo', 'Sector 9A - Sumatra' ].map((log, i) => (
                <div key={i} className="p-4 bg-white text-xs font-bold uppercase tracking-wider hover:pl-6 transition-all cursor-pointer flex justify-between shadow-sm">
                  <span className="text-[#111111]">{log}</span>
                  <span className={i === 0 ? "text-red-500 font-black" : "text-[#339966] font-black"}>{i === 0 ? "ALERT" : "CLEAR"}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Console */}
        <section className="lg:col-span-9 flex flex-col bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 flex-1">
            <div className="p-8 flex flex-col bg-[#111111]">

<Map className="w-4 h-4 text-[#339966]"/>
<h3 className="text-sm font-black tracking-widest uppercase mb-4 text-white flex items-center gap-2"> Raw Orbital Capture</h3>
              <div className="flex-1 bg-black flex items-center justify-center relative overflow-hidden group border border-white/10">
                <p className="text-[#339966] text-xs font-mono tracking-widest animate-pulse">AWAITING_COORDINATES...</p>
              </div>
            </div>
            <div className="p-8 flex flex-col bg-white">
              <h3 className="text-sm font-black tracking-widest uppercase mb-4 text-[#111111] flex items-center gap-2"><Server className="w-4 h-4 text-[#339966]"/> Spatial U-Net Mask</h3>
              <div className="flex-1 bg-[#F8F9FA] flex items-center justify-center relative overflow-hidden shadow-inner">
                <div className="absolute inset-0 bg-[#339966] opacity-[0.03]" />
                <p className="text-[#339966] text-xs font-mono tracking-widest">EXECUTING TENSORS...</p>
              </div>
            </div>
          </div>
          <div className="bg-[#339966] text-white p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col justify-center">
              <p className="text-[#111111] text-[10px] font-black tracking-widest uppercase mb-2">Canopy Loss Area</p>
              <p className="text-5xl font-black tracking-tighter">0.00 <span className="text-xl text-[#111111]">HA</span></p>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[#111111] text-[10px] font-black tracking-widest uppercase mb-2">Model Confidence</p>
              <p className="text-5xl font-black tracking-tighter">--.- <span className="text-xl text-[#111111]">%</span></p>
            </div>
            <div className="flex flex-col justify-center relative">
              <Activity className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 text-[#111111] opacity-20" />
              <p className="text-[#111111] text-[10px] font-black tracking-widest uppercase mb-2">System Status</p>
              <p className="text-xl font-bold tracking-widest text-white">STANDBY</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}