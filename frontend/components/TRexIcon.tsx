import React from 'react';

export const TRexIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Massive Boxy Head, Thick Neck & Heavy Tail */}
    <path d="M10 4h9v5h-3v1h3v2h-4v2h-2v5c0 1.5-1 3-3 3H6c-1 0-2-1-2-2v-2c0-2 1-3 2-4l-3-2V9c3 0 5-2 6-5z" />
    
    {/* Tiny Apex Predator Arm */}
    <path d="M14 13h2v1" />
    
    {/* Menacing Eye */}
    <circle cx="15" cy="6" r="1" fill="currentColor" stroke="none" />
  </svg>
);