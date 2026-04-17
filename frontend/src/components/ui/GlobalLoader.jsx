import React, { useState, useEffect } from 'react';

export default function GlobalLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      
      {/* Motion blurred car element */}
      <div className="relative w-full h-32">
        <div className="absolute top-1/2 left-0 w-32 h-8 -mt-4 animate-f1-drive">
          {/* Abstract F1 Car Shape */}
          <div className="w-full h-full bg-gradient-to-r from-transparent via-primary to-primary rounded-r-full shadow-[0_0_30px_rgba(225,6,0,0.8)] flex items-center justify-end pr-2">
             <div className="w-4 h-full bg-white rounded-r-full opacity-80"></div>
          </div>
          {/* Speed lines trailing */}
          <div className="absolute top-0 right-full w-64 h-full bg-gradient-to-l from-primary/50 to-transparent"></div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs font-bold tracking-widest uppercase text-zinc-500 animate-pulse">
        Initializing Telemetry...
      </div>
    </div>
  );
}
