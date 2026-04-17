import React from 'react';
import { useLocation } from 'react-router-dom';

export default function PixelLoader() {
  const location = useLocation();
  const isTransitioning = true; // In this setup it controls rendering.

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0d0d0d] transition-opacity duration-500">
      <div className="text-[#e10600] pixel-font text-xs uppercase mb-8 tracking-widest animate-pulse">
        [ LOADING_TELEMETRY ]
      </div>
      
      <div className="w-full h-8 relative overflow-hidden bg-[#151515] border-y-2 border-[#262626]">
        {/* Pixel Car Container */}
        <div className="absolute top-1 animate-pixel-drive flex">
          {/* Motion trail / Ghost cars for smooth speed illusion */}
          <div className="absolute top-0 -left-6 w-16 h-6 bg-[#e10600]/20 rounded-none"></div>
          <div className="absolute top-0 -left-3 w-16 h-6 bg-[#e10600]/50 rounded-none"></div>
          
          {/* Main Car */}
          <div className="relative w-16 h-6 bg-[#e10600] rounded-none shadow-[2px_0_0_#fff,-2px_0_0_#fff]">
            {/* Extremely simple pixel representation of car */}
            <div className="absolute top-[-4px] left-4 w-6 h-2 bg-black"></div>
            <div className="absolute bottom-[-2px] left-2 w-3 h-3 bg-zinc-400 border-2 border-black"></div>
            <div className="absolute bottom-[-2px] right-2 w-3 h-3 bg-zinc-400 border-2 border-black"></div>
          </div>
        </div>
      </div>
      
      {/* Required CSS Override for slower animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pixel-drive {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(110vw); }
        }
        .animate-pixel-drive {
          animation: pixel-drive 2.5s ease-in-out infinite;
          image-rendering: pixelated;
        }
      `}} />
    </div>
  );
}
