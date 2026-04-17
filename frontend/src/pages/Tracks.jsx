import React from 'react';

// Static comprehensive dataset for Tracks (independent of any specific year)
const trackDatabase = [
  {
    id: "monza",
    name: "Autodromo Nazionale Monza",
    location: "Monza, Italy",
    length: "5.793 km",
    corners: 11,
    type: "Race Circuit",
    first_prix: "1950",
    lap_record: "1:21.046 (Rubens Barrichello, 2004)",
    description: "Known as the 'Temple of Speed', Monza is the fastest circuit on the calendar. Its long straights demand the absolute minimum aerodynamic drag. The intense braking zones at the chicanes provide prime overtaking opportunities.",
    image: "https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Italy.jpg"
  },
  {
    id: "spa",
    name: "Circuit de Spa-Francorchamps",
    location: "Stavelot, Belgium",
    length: "7.004 km",
    corners: 19,
    type: "Race Circuit",
    first_prix: "1950",
    lap_record: "1:46.286 (Valtteri Bottas, 2018)",
    description: "The longest track on the calendar, Spa is revered by drivers for its mix of long straights and challenging fast corners, particularly the legendary Eau Rouge/Raidillon complex. Its microclimate means rain can affect parts of the track while others remain dry.",
    image: "https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Belgium.jpg"
  },
  {
    id: "silverstone",
    name: "Silverstone Circuit",
    location: "Silverstone, Great Britain",
    length: "5.891 km",
    corners: 18,
    type: "Race Circuit",
    first_prix: "1950",
    lap_record: "1:27.097 (Max Verstappen, 2020)",
    description: "The historic home of British motorsport and the site of the first ever F1 World Championship race. Silverstone is incredibly fast and flowing, with the Maggotts, Becketts and Chapel sequence standing as one of the ultimate tests of aerodynamic grip.",
    image: "https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Great%20Britain.jpg"
  },
  {
    id: "monaco",
    name: "Circuit de Monaco",
    location: "Monte Carlo, Monaco",
    length: "3.337 km",
    corners: 19,
    type: "Street Circuit",
    first_prix: "1950",
    lap_record: "1:12.909 (Lewis Hamilton, 2021)",
    description: "The crown jewel of the F1 calendar. Monaco is notoriously tight and twisting, demanding absolute precision. Qualifying is crucial here as overtaking during the race is exceptionally difficult. The margin for error is literally zero.",
    image: "https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Monaco.jpg"
  },
  {
    id: "suzuka",
    name: "Suzuka International Racing Course",
    location: "Suzuka, Japan",
    length: "5.807 km",
    corners: 18,
    type: "Race Circuit",
    first_prix: "1987",
    lap_record: "1:30.983 (Lewis Hamilton, 2019)",
    description: "Designed by John Hugenholtz, Suzuka is unique for its figure-eight layout. It features a massive variety of corners, including the famous 'S' Curves and the daunting 130R. It is widely considered one of the greatest driver's tracks in the world.",
    image: "https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Japan.jpg"
  },
  {
    id: "interlagos",
    name: "Autódromo José Carlos Pace",
    location: "São Paulo, Brazil",
    length: "4.309 km",
    corners: 15,
    type: "Race Circuit",
    first_prix: "1973",
    lap_record: "1:10.540 (Valtteri Bottas, 2018)",
    description: "A brilliant, undulating, anti-clockwise circuit. Interlagos is famous for producing chaotic, brilliant racing, especially when the unpredictable São Paulo weather rolls in. The Senna 'S' is a legendary sequence right after the start.",
    image: "https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Brazil.jpg"
  },
  {
    id: "cota",
    name: "Circuit of the Americas",
    location: "Austin, USA",
    length: "5.513 km",
    corners: 20,
    type: "Race Circuit",
    first_prix: "2012",
    lap_record: "1:36.169 (Charles Leclerc, 2019)",
    description: "COTA features a steep uphill run into Turn 1 and borrows inspiration from classic tracks—the Maggotts/Becketts sequence from Silverstone and the stadium section from Hockenheim. It provides excellent racing and overtaking spots.",
    image: "https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/USA.jpg"
  },
  {
    id: "marina_bay",
    name: "Marina Bay Street Circuit",
    location: "Singapore",
    length: "4.940 km",
    corners: 19,
    type: "Street Circuit",
    first_prix: "2008",
    lap_record: "1:35.867 (Lewis Hamilton, 2023)",
    description: "The original F1 night race. Marina Bay is a grueling physical challenge due to the extreme heat and humidity. The bumpy street surface and constant heavy braking zones make it one of the toughest races to finish.",
    image: "https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Singapore.jpg"
  }
];

export default function Tracks() {
  return (
    <div className="animate-in fade-in-up duration-1000 max-w-7xl mx-auto px-6">
      <div className="py-20 border-b-2 border-[#262626] mb-16">
        <h1 className="text-3xl md:text-5xl text-white pixel-font mb-6 leading-tight uppercase">
          CIRCUIT<br/><span className="text-[#e10600]">DATABASE</span>
        </h1>
        <p className="text-sm text-[#707070] font-bold uppercase tracking-widest">
          Global F1 Infrastructure
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {trackDatabase.map((track) => (
          <div key={track.id} className="clean-card flex flex-col group overflow-hidden">
            {/* Banner Image */}
            <div className="relative h-56 w-full border-b-2 border-[#262626] overflow-hidden">
              <img 
                src={track.image} 
                alt={track.name} 
                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <span className="text-[10px] font-bold text-white bg-[#e10600] px-3 py-1 uppercase tracking-widest border-2 border-white">
                  {track.type}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 flex-1 flex flex-col">
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-2 group-hover:text-[#e10600] transition-colors">
                {track.name}
              </h2>
              <p className="text-xs text-[#707070] font-bold uppercase tracking-widest mb-8">
                {track.location}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="border-l-2 border-[#e10600] pl-4">
                  <span className="block text-[10px] text-[#707070] font-bold uppercase tracking-widest">Length</span>
                  <span className="block text-lg text-white font-bold">{track.length}</span>
                </div>
                <div className="border-l-2 border-[#e10600] pl-4">
                  <span className="block text-[10px] text-[#707070] font-bold uppercase tracking-widest">Corners</span>
                  <span className="block text-lg text-white font-bold">{track.corners}</span>
                </div>
                <div className="border-l-2 border-[#e10600] pl-4">
                  <span className="block text-[10px] text-[#707070] font-bold uppercase tracking-widest">First Entry</span>
                  <span className="block text-lg text-white font-bold">{track.first_prix}</span>
                </div>
                <div className="border-l-2 border-[#e10600] pl-4">
                  <span className="block text-[10px] text-[#707070] font-bold uppercase tracking-widest">Lap Record</span>
                  <span className="block text-xs text-white font-bold mt-1 leading-tight">{track.lap_record}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mt-auto">
                <p className="text-sm text-[#aaaaaa] font-bold tracking-wider leading-relaxed border-t-2 border-[#262626] pt-6">
                  {track.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
