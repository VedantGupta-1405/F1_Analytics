import React, { useContext, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SeasonContext } from '../App';
import PixelLoader from '../components/ui/PixelLoader';

const getRaceImage = (raceName) => {
  const images = {
    'bahrain': 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Bahrain.jpg',
    'saudi': 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Saudi%20Arabia.jpg',
    'australian': 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Australia.jpg',
    'azerbaijan': 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Azerbaijan.jpg',
    'miami': 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Miami.jpg',
    'monaco': 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Monaco.jpg',
    'spanish': 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Spain.jpg',
    'spain': 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Spain.jpg',
    'canadian': 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Canada.jpg',
    'austrian': 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Austria.jpg',
    'british': 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Great%20Britain.jpg',
    'hungarian': 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Hungary.jpg',
    'belgian': 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Belgium.jpg',
    'dutch': 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Netherlands.jpg',
    'italian': 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Italy.jpg',
    'singapore': 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Singapore.jpg',
    'japanese': 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Japan.jpg',
    'japan': 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Japan.jpg',
    'qatar': 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Qatar.jpg',
    'united states': 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/USA.jpg',
    'mexico': 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Mexico.jpg',
    'brazil': 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Brazil.jpg',
    'são paulo': 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Brazil.jpg',
    'las vegas': 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Las%20Vegas.jpg',
    'abu dhabi': 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Abu%20Dhabi.jpg',
    'emilia': 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Emilia%20Romagna.jpg',
    'chinese': 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/China.jpg',
    'china': 'https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/China.jpg'
  };
  
  const searchName = raceName.toLowerCase();
  for (const [key, url] of Object.entries(images)) {
    if (searchName.includes(key)) return url;
  }
  return 'https://images.unsplash.com/photo-1541446071853-271d4ce8c772?auto=format&fit=crop&q=80&w=800';
};

export default function RaceView() {
  const { raceId } = useParams(); // Using round number as raceId now
  const { season, seasonData, loading } = useContext(SeasonContext);

  const data = useMemo(() => {
    if (!seasonData || !seasonData.races) return null;
    const race = seasonData.races.find(r => r.round.toString() === raceId);
    if (!race || !race.results) return null;

    let resData = race.results.map(r => ({
      ...r,
      pos_gain: r.grid_position > 0 ? (r.grid_position - r.finish_position) : 0
    }));

    const sortedGains = [...resData].sort((a,b) => b.pos_gain - a.pos_gain);
    
    return {
      race_name: race.race_name,
      date: race.date,
      results: resData,
      gainers: sortedGains.slice(0, 1),
      losers: sortedGains.slice(-1)
    };
  }, [seasonData, raceId]);

  if (loading) return <PixelLoader />;

  return (
    <div className="animate-in fade-in-up duration-1000 max-w-7xl mx-auto px-6">
      
      {!data ? (
        <div className="py-20 text-center text-[#707070] font-bold uppercase tracking-widest text-sm">
          No telemetry exists for round {raceId} in {season}.
        </div>
      ) : (
        <div className="space-y-16">
          
          <div className="relative w-full h-[400px] clean-card overflow-hidden group">
            <img 
              src={getRaceImage(data.race_name)} 
              alt={data.race_name} 
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/80 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10">
              <h1 className="text-xl sm:text-2xl md:text-6xl text-white pixel-font mb-4 leading-tight uppercase break-words">
                {data.race_name}
              </h1>
              <p className="text-[10px] md:text-sm text-[#e10600] font-bold uppercase tracking-widest bg-[#151515] inline-block px-4 py-2 border-2 border-[#262626]">
                RND_{raceId} // {data.date}
              </p>
            </div>
          </div>

          {/* HIGHLIGHTS */}
          <section className="grid md:grid-cols-2 gap-6 md:gap-12">
            <div className="clean-card p-6 md:p-10">
               <p className="text-[10px] font-bold text-[#e10600] uppercase tracking-widest mb-6">[ MAX_GAINER ]</p>
               {data.gainers.length > 0 ? (
                 <div>
                   <div className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">{data.gainers[0].driver}</div>
                   <div className="text-lg md:text-xl text-[#707070] mt-2 md:mt-4 font-bold tracking-widest">+{data.gainers[0].pos_gain} PLACES</div>
                 </div>
               ) : <p className="text-[#555555]">N/A</p>}
            </div>
            
            <div className="clean-card p-6 md:p-10">
               <p className="text-[10px] font-bold text-[#e10600] uppercase tracking-widest mb-6">[ MAX_DROPPER ]</p>
               {data.losers.length > 0 ? (
                 <div>
                   <div className="text-3xl font-bold text-white uppercase tracking-wider">{data.losers[0].driver}</div>
                   <div className="text-xl text-[#707070] mt-4 font-bold tracking-widest">{data.losers[0].pos_gain} PLACES</div>
                 </div>
               ) : <p className="text-[#555555]">N/A</p>}
            </div>
          </section>

          {/* TRACK INFO & HISTORY */}
          <section className="clean-card p-6 md:p-10 space-y-8">
            <h2 className="text-sm text-white pixel-font uppercase border-b-2 border-[#262626] pb-4">
              [ CIRCUIT_DATABASE ]
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <p className="text-[10px] font-bold text-[#e10600] uppercase tracking-widest">[ HISTORICAL_LOG ]</p>
                <p className="text-sm text-[#707070] font-bold leading-relaxed tracking-wider uppercase">
                  The {data.race_name} is a cornerstone of the championship. Known for its high-speed straights and demanding braking zones, it places immense pressure on both aerodynamic efficiency and driver stamina. Historical telemetry indicates a high probability of safety car deployments, making strategic pit stops critical to securing a podium.
                </p>
              </div>
              <div className="space-y-6">
                <p className="text-[10px] font-bold text-[#e10600] uppercase tracking-widest">[ TRACK_STATS ]</p>
                <ul className="space-y-4 text-sm font-bold text-white uppercase tracking-wider">
                  <li className="flex justify-between border-b-2 border-[#262626] pb-2">
                    <span className="text-[#707070]">CIRCUIT</span>
                    <span className="text-right ml-4 truncate">{seasonData.races.find(r => r.round.toString() === raceId)?.circuit_name || "UNKNOWN"}</span>
                  </li>
                  <li className="flex justify-between border-b-2 border-[#262626] pb-2">
                    <span className="text-[#707070]">TYPICAL STRATEGY</span>
                    <span>1-2 STOPS</span>
                  </li>
                  <li className="flex justify-between border-b-2 border-[#262626] pb-2">
                    <span className="text-[#707070]">OVERTAKING DIFFICULTY</span>
                    <span>HIGH</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* CHART */}
          <section className="space-y-12">
            <h2 className="text-sm text-white pixel-font uppercase border-b-2 border-[#262626] pb-4">
              [ GRID_VARIANCE ]
            </h2>
            <div className="clean-card p-4 md:p-8 h-[400px] overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.results} margin={{ top: 20, right: 10, left: -20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#262626" />
                  <XAxis dataKey="driver" stroke="#555555" tickLine={false} axisLine={{ stroke: '#262626' }} fontSize={10} interval={0} angle={-45} textAnchor="end" />
                  <YAxis stroke="#555555" tickLine={false} axisLine={{ stroke: '#262626' }} fontSize={10} />
                  <Tooltip 
                    cursor={{fill: '#262626'}}
                    contentStyle={{ backgroundColor: '#151515', border: '2px solid #262626', borderRadius: '0' }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '12px' }}
                  />
                  <Bar dataKey="pos_gain" radius={0}>
                    {data.results.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.pos_gain > 0 ? '#ffffff' : entry.pos_gain < 0 ? '#404040' : '#262626'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* TABLE */}
          <section className="space-y-12">
            <h2 className="text-sm text-white pixel-font uppercase border-b-2 border-[#262626] pb-4">
              [ CLASSIFICATION ]
            </h2>
            <div className="clean-card overflow-hidden">
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#262626]/20">
                    <tr>
                      <th className="px-8 py-6 text-[10px] font-bold text-[#e10600] uppercase tracking-widest border-b-2 border-[#262626]">POS</th>
                      <th className="px-8 py-6 text-[10px] font-bold text-[#707070] uppercase tracking-widest border-b-2 border-[#262626]">DRIVER</th>
                      <th className="px-8 py-6 text-[10px] font-bold text-[#707070] uppercase tracking-widest border-b-2 border-[#262626]">TEAM</th>
                      <th className="px-8 py-6 text-center text-[10px] font-bold text-[#707070] uppercase tracking-widest border-b-2 border-[#262626]">GRID</th>
                      <th className="px-8 py-6 text-right text-[10px] font-bold text-[#707070] uppercase tracking-widest border-b-2 border-[#262626]">PTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-[#262626]">
                    {data.results.map((driver) => (
                      <tr key={driver.driver_id} className="hover:bg-[#262626]/40 transition-colors">
                        <td className="px-8 py-6 font-bold text-[#707070]">{driver.finish_position}</td>
                        <td className="px-8 py-6">
                           <Link to={`/driver/${driver.driver_id}`} className="font-bold text-white uppercase tracking-wider hover:text-[#e10600] transition-colors">
                              {driver.driver}
                           </Link>
                        </td>
                        <td className="px-8 py-6 font-bold text-[#707070] text-sm">{driver.team}</td>
                        <td className="px-8 py-6 text-center font-bold text-[#707070]">{driver.grid_position}</td>
                        <td className="px-8 py-6 text-right font-bold text-white text-xl">{driver.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
