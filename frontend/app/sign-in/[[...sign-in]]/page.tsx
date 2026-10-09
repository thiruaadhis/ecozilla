"use client";

import { useState, useEffect } from 'react';
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { TreePine } from "lucide-react";

export default function SignInPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[#F8F9FA] relative overflow-x-clip flex flex-col items-center justify-center text-[#111111] font-sans selection:bg-[#339966] selection:text-white">
      <style dangerouslySetInnerHTML={{__html: `
        .noise-bg { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E"); }
      `}} />
      <div className="noise-bg pointer-events-none fixed inset-0 z-0 h-full w-full mix-blend-multiply" />

      <div className="fixed top-0 left-0 w-screen z-50 flex justify-center pt-8 pointer-events-none">
        <nav className={`pointer-events-auto flex items-center justify-between px-8 py-4 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? "w-[85%] max-w-5xl bg-[#339966]/75 backdrop-blur-2xl rounded-full text-white shadow-[0_8px_30px_rgba(51,153,102,0.2)]" : "w-full max-w-[90rem] bg-transparent rounded-full text-[#111111]"}`}>
          <div className="flex items-center gap-2">
            <TreePine className={`w-6 h-6 transition-colors duration-1000 ${isScrolled ? 'text-white' : 'text-[#339966]'}`} />
            <span className="text-xl font-black tracking-tighter uppercase">EcoZilla</span>
          </div>
          <div className="flex items-center gap-8 text-xs font-bold tracking-widest uppercase">
            <Link href="/" className={`px-6 py-2.5 rounded-full transition-colors duration-1000 ${isScrolled ? 'bg-white text-[#339966] hover:bg-[#111111] hover:text-white' : 'bg-[#339966] text-white hover:bg-[#111111]'}`}>
              Return
            </Link>
          </div>
        </nav>
      </div>

      <div className="relative z-10 w-full max-w-md mx-6 mt-20">
        <SignIn 
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
              card: "border-2 border-[#111111] shadow-[8px_8px_0px_0px_#339966,16px_16px_0px_0px_#111111] p-8",
              headerTitle: "text-3xl font-black tracking-tighter uppercase text-[#111111]",
              headerSubtitle: "text-xs font-bold tracking-widest uppercase text-[#339966] mb-4",
              formFieldLabel: "text-xs font-bold tracking-widest uppercase text-[#111111]",
              formFieldInput: "border-2 border-[#111111] py-3 px-4 focus:border-[#339966] focus:ring-0 transition-colors font-medium rounded-none",
              formButtonPrimary: "bg-[#111111] border-2 border-[#111111] hover:bg-[#339966] hover:border-[#339966] text-white text-xs font-black uppercase tracking-widest py-4 transition-all",
              socialButtonsBlockButton: "border-2 border-[#111111] hover:bg-[#339966] hover:text-white hover:border-[#339966] transition-all rounded-none",
              socialButtonsBlockButtonText: "font-bold uppercase tracking-widest text-xs",
              dividerLine: "bg-[#111111]/20",
              dividerText: "text-[10px] font-black uppercase tracking-widest text-slate-400",
              footerActionText: "text-xs font-bold uppercase",
              footerActionLink: "text-[#339966] hover:text-[#111111] font-black uppercase",
              formFieldWarningText: "text-xs font-bold uppercase text-red-500",
              formFieldErrorText: "text-xs font-bold uppercase text-red-500",
            }
          }}
        />
      </div>
    </main>
  );
}