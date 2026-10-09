"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TreePine, ArrowUpRight, Leaf } from 'lucide-react';
import { Show, UserButton } from '@clerk/nextjs';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[#F8F9FA] relative overflow-x-clip text-slate-900 font-sans selection:bg-[#339966] selection:text-white">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: flex; width: max-content; animation: marquee 40s linear infinite; }
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
            <Link href="/dashboard" className="hover:opacity-50 transition-opacity">Dashboard</Link>
            <Show when="signed-out">
              <Link href="/sign-in" className="hover:opacity-50 transition-opacity">Log in</Link>
              <Link href="/sign-up" className={`px-6 py-2.5 rounded-full transition-colors duration-1000 ${isScrolled ? 'bg-white text-[#339966] hover:bg-[#111111] hover:text-white' : 'bg-[#339966] text-white hover:bg-[#111111]'}`}>
                Sign up
              </Link>
            </Show>
            <Show when="signed-in">
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
                    avatarBox: "border-2 border-[#111111] shadow-[2px_2px_0px_0px_#339966]",
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
            </Show>
          </div>
        </nav>
      </div>

      <section className="pt-48 pb-16 flex justify-center">
        <div className="px-6 w-full text-center">
          <h1 className="text-[6.5vw] font-black tracking-tighter leading-none uppercase w-full whitespace-nowrap text-[#111111]">
            For Home, <span className="text-[#339966]">For Earth.</span>
          </h1>
        </div>
      </section>

      <div className="bg-[#339966] text-white py-3 overflow-hidden flex items-center">
        <div className="animate-marquee text-sm font-black tracking-widest uppercase">
          <div className="flex items-center gap-32 pr-32 whitespace-nowrap shrink-0">
            <span>15 BILLION TREES ERASED ANNUALLY</span>
            <span>ONLY 1.9 BILLION REPLANTED</span>
            <span>10 MILLION HECTARES OF CANOPY LOST EVERY YEAR</span>
            <span>EARTH HAS LOST 33% OF ITS FORESTS</span>
            <span>GLOBAL CO2 AT 420 PPM</span>
            <span>BIODIVERSITY IN CRITICAL DECLINE</span>
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
            <span>15 BILLION TREES ERASED ANNUALLY</span>
            <span>ONLY 1.9 BILLION REPLANTED</span>
            <span>10 MILLION HECTARES OF CANOPY LOST EVERY YEAR</span>
            <span>EARTH HAS LOST 33% OF ITS FORESTS</span>
            <span>GLOBAL CO2 AT 420 PPM</span>
            <span>BIODIVERSITY IN CRITICAL DECLINE</span>
          </div>
        </div>
      </div>

      <section className="relative grid grid-cols-1 md:grid-cols-2 border-b border-[#111111]">
        <div className="absolute top-0 bottom-0 left-1/2 w-4 -translate-x-1/2 hidden md:block pointer-events-none z-20">
          {Array.from({ length: 120 }).map((_, i) => {
            const randomXOffset = (Math.sin(i * 13) * 3).toFixed(2);
            const topPercent = ((i / 120) * 98).toFixed(2);
            const randomRotation = (i * 77) % 360;
            const size = 14 + (i % 3) * 4;

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

        <div className="p-8 md:p-16 lg:p-24 flex flex-col gap-12 justify-start bg-white">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-6 border-b border-[#111111] inline-block pb-1 text-[#339966]">The Planetary Toll</p>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tighter leading-none uppercase mb-4 text-[#111111]">Every minute, <br/> 27 football fields <br/> are erased.</h2>
            <p className="text-base font-medium leading-relaxed max-w-md text-slate-600">This isn't just lost timber—it's the collapse of planetary life support. Ripping out the canopy permanently alters the Earth's natural defense systems.</p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-6 border-b border-[#111111] inline-block pb-1 text-[#339966]">The Carbon Timebomb</p>
            <p className="text-base font-medium leading-relaxed max-w-md text-slate-600">When the trees fall, centuries of stored carbon are weaponized directly back into our atmosphere. This accelerates the exact heatwaves and droughts that dry out the surviving roots, creating an unstoppable feedback loop.</p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-6 border-b border-[#111111] inline-block pb-1 text-[#339966]">The Frontline Fight</p>
            <p className="text-base font-medium leading-relaxed max-w-md text-slate-600">EcoZilla exists to give rangers a massive tactical advantage. By analyzing spatial data through deep neural networks, we identify illegal logging operations from orbit before the chainsaws even finish the job.</p>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="p-8 md:p-16 bg-[#111111] text-white">
            <p className="text-2xl md:text-4xl font-bold tracking-tight leading-snug mb-6">"What we are doing to the forests of the world is but a mirror reflection of what we are doing to ourselves."</p>
            <p className="font-black tracking-widest uppercase text-xs text-[#339966]">— Mahatma Gandhi</p>
          </div>
          <div className="p-8 md:p-16 bg-white">
            <p className="text-xs font-bold tracking-widest uppercase mb-8 text-[#339966]">Wanna know how to help the planet?</p>
            <div className="flex flex-col gap-2">
              {[ { name: "Global Forest Watch", url: "https://www.globalforestwatch.org/" }, { name: "World Wildlife Fund", url: "https://www.worldwildlife.org/" }, { name: "Conservation International", url: "https://www.conservation.org/" } ].map((link, idx) => (
                <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between py-4 hover:pl-6 transition-all duration-300">
                  <span className="text-2xl lg:text-3xl font-black tracking-tighter uppercase text-[#111111] group-hover:text-[#339966] transition-colors">{link.name}</span>
                  <ArrowUpRight className="w-8 h-8 opacity-0 group-hover:opacity-100 transform -translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 text-[#339966]" />
                </a>
              ))}
            </div>
          </div>
          <div className="flex-1 p-8 md:p-16 bg-[#339966] flex flex-col justify-end min-h-[250px]">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-white mb-8 leading-none">Join <br /> The <span className="text-[#111111]">Fight.</span></h2>
            <div className="flex flex-wrap gap-x-8 gap-y-4 text-xs font-bold tracking-widest uppercase text-[#111111]">
              <a href="https://x.com/Greenpeace" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">X (Twitter)</a>
              <a href="https://www.instagram.com/greenpeace/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a>
              <a href="https://www.greenpeace.org/international/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Greenpeace</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}