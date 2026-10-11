import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next';
import './globals.css';
import 'leaflet/dist/leaflet.css';

export const metadata: Metadata = {
  title: 'EcoZilla',
  description: 'Deforestation Detection System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#339966',
          colorBackground: '#ffffff',
          colorInputBackground: '#F8F9FA',
          colorDanger: '#ef4444',
          borderRadius: '0px',
        } as any,
        elements: {
          card: "border-2 border-[#111111] shadow-[8px_8px_0px_0px_#339966,16px_16px_0px_0px_#111111] rounded-none bg-white",
          formButtonPrimary: "bg-[#111111] border-2 border-[#111111] hover:bg-[#339966] hover:border-[#339966] text-white font-black uppercase tracking-wider text-xs shadow-none transition-all rounded-none",
          socialButtonsBlockButton: "border-2 border-[#111111] bg-white hover:bg-[#F8F9FA] text-[#111111] font-bold uppercase tracking-wider text-xs rounded-none transition-colors",
          formFieldInput: "border-2 border-[#111111] focus:border-[#339966] focus:ring-0 outline-none rounded-none font-medium",
          footerActionLink: "text-[#339966] hover:text-[#111111] font-black uppercase text-xs tracking-wider",
          userButtonPopoverCard: "border-2 border-[#111111] shadow-[8px_8px_0px_0px_#339966,16px_16px_0px_0px_#111111] rounded-none bg-white",
        }
      }}
    >
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
} 