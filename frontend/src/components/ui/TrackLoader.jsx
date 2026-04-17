import React from 'react';

export default function TrackLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-64 h-64">
        {/* Track Silhouette */}
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M 20 80 Q 10 80 10 70 L 10 30 Q 10 20 20 20 L 50 20 Q 60 20 60 30 L 60 40 Q 60 50 70 50 L 80 50 Q 90 50 90 60 L 90 70 Q 90 80 80 80 Z" />
        </svg>
        
        {/* Animated Glowing Line */}
        <svg viewBox="0 0 100 100" className="absolute top-0 left-0 w-full h-full drop-shadow-[0_0_8px_currentColor]" fill="none" strokeWidth="2">
          <path 
            className="animate-track-trace"
            d="M 20 80 Q 10 80 10 70 L 10 30 Q 10 20 20 20 L 50 20 Q 60 20 60 30 L 60 40 Q 60 50 70 50 L 80 50 Q 90 50 90 60 L 90 70 Q 90 80 80 80 Z" 
          />
        </svg>
      </div>
      <p className="mt-4 text-xs font-bold tracking-widest text-zinc-500 uppercase animate-pulse">
        Loading Sector Data...
      </p>
    </div>
  );
}
