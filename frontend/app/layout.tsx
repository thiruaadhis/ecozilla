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
          colorPrimary: '#2563eb', // Tailwind blue-600 for all primary buttons and accents
          colorText: '#1e293b',    // Tailwind slate-800 for crisp, readable text
          colorBackground: '#ffffff',
          colorDanger: '#ef4444',  // Tailwind red-500 for error states or delete buttons
        },
        elements: {
          card: "bg-white shadow-sm border border-slate-200 rounded-xl",
          formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all",
          socialButtonsBlockButton: "border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors",
          formFieldInput: "border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none",
          footerActionLink: "text-blue-600 hover:text-blue-700 font-semibold",
          userButtonPopoverCard: "border border-slate-200 shadow-lg",
        }
      }}
    >
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}