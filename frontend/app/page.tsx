"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TreePine, 
  ArrowUpRight, 
  Crosshair, 
  Leaf,
  AlertTriangle,
  Flame,
  Globe2,
  TrendingDown
} from 'lucide-react';
import { Show, UserButton } from '@clerk/nextjs';

// Tightly packed, dense streak of leaves matching your original vertical spine style
function LeafStreakHorizontal({ count = 220, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`relative w-full h-4 overflow-visible pointer-events-none z-20 ${className}`}>
      {Array.from({ length: count }).map((_, i) => {
        const randomYOffset = (Math.sin(i * 13) * 3).toFixed(2);
        const leftPercent = ((i / count) * 100).toFixed(2);
        const randomRotation = (i * 77) % 360;
        const size = 15 + (i % 3) * 4;

        return (
          <Leaf
            key={i}
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
  );
}

function LeafStreakVertical({ count = 150, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`absolute top-0 bottom-0 w-4 -translate-x-1/2 pointer-events-none z-20 ${className}`}>
      {Array.from({ length: count }).map((_, i) => {
        const randomXOffset = (Math.sin(i * 13) * 3).toFixed(2);
        const topPercent = ((i / count) * 98).toFixed(2);
        const randomRotation = (i * 77) % 360;
        const size = 15 + (i % 3) * 4;

        return (
          <Leaf
            key={i}
            className="absolute text-[#339966] fill-[#339966] drop-shadow-sm opacity-90"
            style={{
              top: `${topPercent}%`,
              left: `calc(50% + ${randomXOffset}px)`,
              width: `${size}px`,
              height: `${size}px`,
              transform: `translateX(-50%) rotate(${randomRotation}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Globally critical forests, their stats, and real issues (no sliding stuff, clean editorial layout)
  const majorForests = [
    {
      id: "01",
      name: "The Amazon Basin",
      span: "South America (9 Nations)",
      area: "5.5 Million km²",
      carbonStored: "150–200 Billion Tons",
      lossRate: "10,200 km² / yr",
      threatLevel: "CRITICAL TIPPING POINT",
      threatType: "Cattle Ranching & Illegal Road Incursions",
      image: "/forests/Amazon.jpg",
      description: "Over 17% of the Amazon has been permanently cleared, with another 17% severely degraded. Scientists warn that reaching 20–25% deforestation will trigger an irreversible savanna dieback, shutting down the continental atmospheric river that regulates weather across the Americas."
    },
    {
      id: "02",
      name: "The Congo Basin",
      span: "Central Africa (6 Nations)",
      area: "3.7 Million km²",
      carbonStored: "30 Billion Tons",
      lossRate: "5,000 km² / yr",
      threatLevel: "ACCELERATING",
      threatType: "Artisanal Charcoal & Commercial Logging Concessions",
      image: "/forests/congo.jpg",
      description: "Often described as the world's most resilient carbon sink, the Congo absorbs more CO₂ than the Amazon today. However, expanding industrial logging concessions, weak spatial monitoring, and rapid rural fuelwood demand are fragmenting primary moist broadleaf canopy at historic highs."
    },
    {
      id: "03",
      name: "Southeast Asian Peatlands",
      span: "Indonesia & Malaysia",
      area: "2.5 Million km²",
      carbonStored: "68 Billion Tons (In Peat)",
      lossRate: "3,800 km² / yr",
      threatLevel: "EXTREME FIRE RISK",
      threatType: "Palm Oil Concessions & Peat Swamp Drainage",
      image: "/forests/peatlands.jpg",
      description: "More than half of the region's ancient tropical peatland forests have been drained via artificial canals for oil palm and timber plantations. When drained, prehistoric peat layers dry out, transforming planetary carbon vaults into combustible tinderboxes that erupt during dry seasons."
    },
    {
      id: "04",
      name: "The Boreal Taiga Shield",
      span: "Canada, Russia & Scandinavia",
      area: "14 Million km²",
      carbonStored: "703 Billion Tons (Soil & Permafrost)",
      lossRate: "26,000 km² / yr",
      threatLevel: "CLIMATE POSITIVE FEEDBACK",
      threatType: "Megafires, Industrial Clearcutting & Pest Outbreaks",
      image: "/forests/taiga.jpg",
      description: "The largest terrestrial biome on Earth stores twice as much carbon as all tropical forests combined. Rapid subpolar warming has amplified megafire seasons and bark beetle infestations, while commercial clearcutting removes natural permafrost insulation, accelerating methane thaw."
    }
  ];

  return (
    <main className="min-h-screen bg-[#F8F9FA] relative overflow-x-clip text-[#111111] font-sans selection:bg-[#339966] selection:text-white flex flex-col justify-between">
      
      {/* Noise Texture */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: flex; width: max-content; animation: marquee 35s linear infinite; }
        .noise-bg { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E"); }
      `}} />
      <div className="noise-bg pointer-events-none fixed inset-0 z-50 h-full w-full mix-blend-multiply" />

      {/* NAVBAR: EXACT 1:1 TO DASHBOARD */}
      <div className="fixed top-0 left-0 w-screen z-50 flex justify-center pt-5 pointer-events-none px-4">
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

          {/* Center: Live Orbit HUD Pill */}
          <div className="flex items-center justify-center justify-self-center">
            <Link
              href="/dashboard"
              title="Launch Console"
              className={`flex items-center gap-1.5 px-4 py-1 text-[11px] font-mono font-bold tracking-wider rounded-full border transition-all ${
                isScrolled
                  ? 'bg-white/15 text-white border-white/30 hover:bg-white hover:text-[#339966]'
                  : 'bg-[#F8F9FA] text-[#111111] border-[#111111] shadow-[2px_2px_0px_0px_#111111] hover:bg-white'
              }`}
            >
              <Crosshair className={`w-3.5 h-3.5 ${isScrolled ? 'text-white' : 'text-[#339966]'}`} />
              <span>ORBIT HUD: ACTIVE</span>
            </Link>
          </div>

          {/* Right: Auth / Dashboard link */}
          <div className="flex items-center gap-3 justify-self-end">
            <Link 
              href="/dashboard"
              className={`text-[11px] font-mono font-bold uppercase tracking-wider transition-opacity hover:opacity-60 mr-2 ${
                isScrolled ? 'text-white' : 'text-[#111111]'
              }`}
            >
              Dashboard
            </Link>

            <Show when="signed-out">
              <Link 
                href="/sign-in" 
                className={`text-[11px] font-mono font-bold uppercase tracking-wider hover:opacity-60 transition-opacity ${
                  isScrolled ? 'text-white' : 'text-[#111111]'
                }`}
              >
                Log In
              </Link>
            </Show>

            <Show when="signed-in">
              <UserButton 
                appearance={{
                  variables: {
                    colorPrimary: '#339966',
                    colorBackground: '#ffffff',
                    colorInputBackground: '#F8F9FA',
                    borderRadius: '0px', 
                  } as any,
                  elements: {
                    userButtonPopoverCard: "border-2 border-[#111111] shadow-[8px_8px_0px_0px_#339966,16px_16px_0px_0px_#111111] rounded-none",
                    userButtonPopoverActionButton: "hover:bg-[#F8F9FA] rounded-none transition-all px-4 py-3",
                    userButtonPopoverActionButtonText: "font-bold tracking-widest text-xs uppercase text-[#111111]",
                    userButtonPopoverActionButtonIcon: "text-[#339966]",
                    userButtonPopoverFooter: "border-t-2 border-[#111111] p-4 bg-[#F8F9FA]",
                    badge: "bg-[#339966] text-white rounded-none border border-[#111111]",
                    userPreviewSecondaryIdentifier: "font-medium text-slate-500",
                    userPreviewMainIdentifier: "font-black uppercase tracking-tight text-[#111111]",
                    avatarBox: `border-2 ${isScrolled ? 'border-white' : 'border-[#111111] shadow-[2px_2px_0px_0px_#339966]'} rounded-full bg-white transition-all`,
                    modalContent: "border-2 border-[#111111] shadow-[8px_8px_0px_0px_#339966,16px_16px_0px_0px_#111111] rounded-none bg-white",
                    modalBackdrop: "bg-[#111111]/80 backdrop-blur-sm",
                  }
                }}
                userProfileProps={{
                  appearance: {
                    variables: {
                      colorPrimary: '#339966',
                      colorBackground: '#ffffff',
                      colorInputBackground: '#F8F9FA',
                      borderRadius: '0px',
                    } as any,
                    elements: {
                      card: "shadow-none border-none rounded-none bg-transparent",
                      scrollBox: "bg-white",
                      navbar: "border-r-2 border-[#111111] bg-[#F8F9FA] p-4",
                      navbarButton: "hover:bg-[#111111] hover:text-white rounded-none text-xs font-bold uppercase tracking-widest text-[#111111] transition-all p-3 mb-1",
                      headerTitle: "text-2xl font-black tracking-tighter uppercase text-[#111111]",
                      headerSubtitle: "text-xs font-bold tracking-widest uppercase text-[#339966]",
                      profileSection: "border-2 border-[#111111] shadow-[4px_4px_0px_0px_#111111] rounded-none p-5 mb-6 bg-white",
                      profileSectionTitle: "text-xs font-black uppercase tracking-widest border-b-2 border-[#111111] pb-2 mb-4 text-[#111111]",
                      profileSectionPrimaryButton: "text-[#339966] hover:text-[#111111] font-bold uppercase text-xs tracking-widest transition-colors",
                      accordionTriggerButton: "text-xs font-bold uppercase tracking-widest text-[#111111] border-2 border-[#111111] rounded-none shadow-[2px_2px_0px_0px_#111111] hover:bg-[#339966] hover:text-white p-3",
                      formButtonPrimary: "bg-[#111111] border-2 border-[#111111] hover:bg-[#339966] hover:border-[#111111] text-white text-xs font-black uppercase tracking-widest py-3 px-6 transition-all rounded-none shadow-[4px_4px_0px_0px_#339966]",
                      formButtonReset: "bg-white border-2 border-[#111111] hover:bg-[#F8F9FA] text-[#111111] text-xs font-black uppercase tracking-widest py-3 px-6 rounded-none",
                      formFieldLabel: "text-xs font-bold tracking-widest uppercase text-[#111111]",
                      formFieldInput: "border-2 border-[#111111] py-2.5 px-3 focus:border-[#339966] focus:ring-0 transition-colors font-medium rounded-none bg-white",
                      badge: "bg-[#339966] text-white rounded-none border border-[#111111] text-[10px] font-bold tracking-widest uppercase px-2 py-0.5",
                      modalCloseButton: "border-2 border-[#111111] rounded-none hover:bg-[#339966] hover:text-white text-[#111111] shadow-[2px_2px_0px_0px_#111111]",
                      menuButton: "border-2 border-[#111111] rounded-none hover:bg-[#339966] hover:text-white text-[#111111]",
                      menuList: "border-2 border-[#111111] shadow-[4px_4px_0px_0px_#111111] rounded-none bg-white",
                      menuItem: "font-bold text-xs uppercase tracking-wider hover:bg-[#F8F9FA]",
                    }
                  }
                }}
              />
            </Show>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="pt-48 pb-16 flex flex-col justify-center">
        <div className="px-6 w-full text-center">
          <h1 className="text-[5.2vw] font-black tracking-tighter leading-none uppercase w-full whitespace-nowrap text-[#111111]">
            You have the key, <span className="text-[#339966]">keep it alive.</span>
          </h1>
          <p className="mt-8 text-sm md:text-base font-medium text-slate-600 max-w-xl mx-auto leading-relaxed">
            Real-time orbital telemetry and neural vision models engineered to identify canopy loss, evaluate biomass density, and support field operations.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="/dashboard"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#111111] text-white hover:bg-[#339966] text-xs font-black tracking-widest uppercase border-2 border-[#111111] shadow-[6px_6px_0px_0px_#339966] hover:shadow-[6px_6px_0px_0px_#111111] transition-all hover:-translate-y-0.5"
            >
              <Crosshair className="w-4 h-4 text-[#339966] group-hover:text-white transition-colors animate-pulse" />
              <span>Analyze Forest Canopy</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Iconic Green Marquee Ticker */}
      <div className="bg-[#339966] text-white py-3.5 overflow-hidden flex items-center relative">
        <div className="animate-marquee text-sm font-black tracking-widest uppercase">
          <div className="flex items-center gap-32 pr-32 whitespace-nowrap shrink-0">
            <span>15 BILLION TREES ERASED ANNUALLY</span>
            <span>ONLY 1.9 BILLION REPLANTED</span>
            <span>10 MILLION HECTARES OF CANOPY LOST EVERY YEAR</span>
            <span>EARTH HAS LOST 33% OF ITS FORESTS</span>
            <span>GLOBAL CO2 AT 420 PPM</span>
            <span>BIODIVERSITY IN CRITICAL DECLINE</span>
          </div>
          <div className="flex items-center gap-32 pr-32 whitespace-nowrap shrink-0" aria-hidden="true">
            <span>15 BILLION TREES ERASED ANNUALLY</span>
            <span>ONLY 1.9 BILLION REPLANTED</span>
            <span>10 MILLION HECTARES OF CANOPY LOST EVERY YEAR</span>
            <span>EARTH HAS LOST 33% OF ITS FORESTS</span>
            <span>GLOBAL CO2 AT 420 PPM</span>
            <span>BIODIVERSITY IN CRITICAL DECLINE</span>
          </div>
        </div>
      </div>

      {/* Single tight streak of leaves directly under the marquee */}
      <LeafStreakHorizontal count={240} className="-my-2" />

      {/* Original Core Planetary Section with Tight Leaf Streaks on Borders */}
      <section className="relative grid grid-cols-1 md:grid-cols-2">
        {/* Original Procedural Leaf Vertical Spine */}
        <LeafStreakVertical count={150} className="left-1/2 hidden md:block" />

        {/* Left Column: Planetary Context */}
        <div className="p-8 md:p-16 lg:p-24 flex flex-col gap-12 justify-start bg-white relative">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-6 border-b border-[#339966]/40 inline-block pb-1 text-[#339966]">The Planetary Toll</p>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tighter leading-none uppercase mb-4 text-[#111111]">Every minute, <br/> 27 football fields <br/> are erased.</h2>
            <p className="text-base font-medium leading-relaxed max-w-md text-slate-600">This isn't just lost timber—it's the collapse of planetary life support. Ripping out the canopy permanently alters the Earth's natural defense systems.</p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-6 border-b border-[#339966]/40 inline-block pb-1 text-[#339966]">The Carbon Timebomb</p>
            <p className="text-base font-medium leading-relaxed max-w-md text-slate-600">When the trees fall, centuries of stored carbon are weaponized directly back into our atmosphere. This accelerates the exact heatwaves and droughts that dry out the surviving roots, creating an unstoppable feedback loop.</p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-6 border-b border-[#339966]/40 inline-block pb-1 text-[#339966]">The Frontline Fight</p>
            <p className="text-base font-medium leading-relaxed max-w-md text-slate-600">EcoZilla exists to give rangers a massive tactical advantage. By analyzing spatial data through deep neural networks, we identify illegal logging operations from orbit before the chainsaws even finish the job.</p>
          </div>
        </div>

        {/* Right Column: Quotes, Conservation Links & CTA */}
        <div className="flex flex-col relative">
          <div className="p-8 md:p-16 bg-[#111111] text-white">
            <p className="text-2xl md:text-4xl font-bold tracking-tight leading-snug mb-6">"What we are doing to the forests of the world is but a mirror reflection of what we are doing to ourselves."</p>
            <p className="font-black tracking-widest uppercase text-xs text-[#339966]">— Mahatma Gandhi</p>
          </div>
          
          <div className="p-8 md:p-16 bg-white relative">
            {/* Tight streak of leaves between quotes and links */}
            <div className="absolute top-0 left-0 right-0 -translate-y-1/2 pointer-events-none">
              <LeafStreakHorizontal count={140} />
            </div>

            <p className="text-xs font-bold tracking-widest uppercase mb-8 text-[#339966]">Wanna know how to help the planet?</p>
            <div className="flex flex-col gap-2">
              {[ 
                { name: "Global Forest Watch", url: "https://www.globalforestwatch.org/" }, 
                { name: "World Wildlife Fund", url: "https://www.worldwildlife.org/" }, 
                { name: "Conservation International", url: "https://www.conservation.org/" } 
              ].map((link, idx) => (
                <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between py-4 hover:pl-6 transition-all duration-300">
                  <span className="text-2xl lg:text-3xl font-black tracking-tighter uppercase text-[#111111] group-hover:text-[#339966] transition-colors">{link.name}</span>
                  <ArrowUpRight className="w-8 h-8 opacity-0 group-hover:opacity-100 transform -translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 text-[#339966]" />
                </a>
              ))}
            </div>
          </div>

          {/* Join The Fight Section Packed with Single Tight Leaf Streak on Border */}
          <div className="flex-1 p-8 md:p-16 bg-[#339966] flex flex-col justify-end min-h-[260px] relative">
            {/* Top border tightly packed streak of leaves */}
            <div className="absolute top-0 left-0 right-0 -translate-y-1/2 pointer-events-none">
              <LeafStreakHorizontal count={150} />
            </div>

            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-white mb-8 leading-none">Join <br /> The <span className="text-[#111111]">Fight.</span></h2>
            <div className="flex flex-wrap gap-x-8 gap-y-4 text-xs font-bold tracking-widest uppercase text-[#111111]">
              <a href="https://x.com/Greenpeace" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">X (Twitter)</a>
              <a href="https://www.instagram.com/greenpeace/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a>
              <a href="https://www.greenpeace.org/international/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Greenpeace</a>
            </div>
          </div>
        </div>
      </section>

      {/* Single tight streak of leaves between sections */}
      <LeafStreakHorizontal count={240} className="-my-2" />

      {/* MAJOR FORESTS OF THE WORLD: STATS, CANOPY DATA & DIRECT ISSUE ANALYSIS */}
      <section className="bg-white py-24 px-6 md:px-16 lg:px-24 relative">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="pb-10 mb-14 border-b border-[#111111]/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#339966] block mb-2">
                // PLANETARY BIOSPHERE CENSUS
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#111111]">
                Major Forests of Earth
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-500 max-w-sm">
              Critical biomes storing the planet's carbon and buffering global climate stability.
            </p>
          </div>

          {/* Clean, Nonchalant Editorial Grid: Major Forests & Critical Issues */}
          <div className="flex flex-col divide-y divide-[#111111]/10">
            {majorForests.map((forest) => (
              <div 
                key={forest.id} 
                className="py-12 first:pt-0 last:pb-0 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
              >
                {/* Image & Geography Tag */}
                <div className="lg:col-span-5 relative group overflow-hidden">
                  <div className="h-[280px] md:h-[320px] w-full overflow-hidden bg-black">
                    <img 
                      src={forest.image} 
                      alt={forest.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute top-4 left-4 bg-[#111111] text-white text-[10px] font-mono px-3 py-1 uppercase tracking-wider">
                    {forest.span}
                  </div>
                </div>

                {/* Data, Context, and Issues */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold text-[#339966]">
                        [INDEX {forest.id}]
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 bg-[#F8F9FA] text-[#111111] border border-[#111111]/20 uppercase">
                        {forest.threatLevel}
                      </span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#111111] mb-4">
                      {forest.name}
                    </h3>

                    {/* Key Stats Bar */}
                    <div className="grid grid-cols-3 gap-4 bg-[#F8F9FA] p-4 border border-[#111111]/10 mb-6 text-xs font-mono">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Total Canopy</span>
                        <span className="font-bold text-[#111111] text-sm md:text-base">{forest.area}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Carbon Reserve</span>
                        <span className="font-bold text-[#339966] text-sm md:text-base">{forest.carbonStored}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Annual Loss</span>
                        <span className="font-bold text-[#111111] text-sm md:text-base">{forest.lossRate}</span>
                      </div>
                    </div>

                    {/* Threat Headline */}
                    <div className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#339966]" />
                      <span>Primary Threat: {forest.threatType}</span>
                    </div>

                    {/* Deep Issue Breakdown */}
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">
                      {forest.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Single tight streak of leaves above footer */}
      <LeafStreakHorizontal count={220} className="-my-2" />

      {/* Clean, Nonchalant Minimal Footer */}
      <footer className="bg-white py-10 px-6 md:px-16 text-xs font-mono uppercase tracking-wider flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500">
        <div className="flex items-center gap-2 text-[#111111]">
          <TreePine className="w-4 h-4 text-[#339966]" />
          <span className="font-bold">EcoZilla Observation System</span>
        </div>
        <div className="flex items-center gap-6 text-[11px]">
          <Link href="/dashboard" className="hover:text-[#111111] transition-colors">Dashboard</Link>
          <a href="https://www.globalforestwatch.org/" target="_blank" rel="noreferrer" className="hover:text-[#111111] transition-colors">GFW Data</a>
          <span className="text-[#339966]">Telemetry Nominal</span>
        </div>
      </footer>
    </main>
  );
}