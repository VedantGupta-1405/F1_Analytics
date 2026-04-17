import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { SeasonContext } from '../App';
import PixelLoader from '../components/ui/PixelLoader';

export default function Compare() {
  const { season } = useContext(SeasonContext);
  const [driver1, setDriver1] = useState('');
  const [driver2, setDriver2] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCompare = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setResult({
        winner: driver1 || "Verstappen",
        driver1_stats: { name: driver1 || "Verstappen", score: 92, consistency: 88, pace: 95 },
        driver2_stats: { name: driver2 || "Hamilton", score: 85, consistency: 82, pace: 89 }
      });
      setLoading(false);
    }, 1000);
  };

  const chartData = result ? [
    {
      metric: 'SCORE',
      [result.driver1_stats.name]: result.driver1_stats.score,
      [result.driver2_stats.name]: result.driver2_stats.score,
    },
    {
      metric: 'CONSISTENCY',
      [result.driver1_stats.name]: result.driver1_stats.consistency,
      [result.driver2_stats.name]: result.driver2_stats.consistency,
    },
    {
      metric: 'PACE',
      [result.driver1_stats.name]: result.driver1_stats.pace,
      [result.driver2_stats.name]: result.driver2_stats.pace,
    }
  ] : [];

  if (loading) return <PixelLoader />;

  return (
    <div className="animate-in fade-in-up duration-1000 max-w-7xl mx-auto px-6">
      
      <section className="py-24 border-b-2 border-[#262626] mb-16">
        <h1 className="text-3xl md:text-5xl text-white pixel-font mb-6 leading-tight uppercase">
          COMPARE<br/><span className="text-[#e10600]">MATRIX</span>
        </h1>
        <p className="text-sm text-[#707070] font-bold uppercase tracking-widest">
          Head-to-head telemetry // {season}
        </p>
      </section>

      <div className="space-y-24">
        <div className="clean-card p-10">
          <form onSubmit={handleCompare} className="flex flex-col md:flex-row gap-8 items-end">
            <div className="w-full space-y-4">
              <label className="text-[10px] font-bold text-[#e10600] uppercase tracking-widest">[ DRIVER_1_ID ]</label>
              <input 
                type="text"
                placeholder="max_verstappen" 
                value={driver1} 
                onChange={(e) => setDriver1(e.target.value)} 
                required 
                className="w-full bg-[#0d0d0d] border-2 border-[#262626] rounded-none px-4 py-4 text-white font-bold uppercase tracking-wider focus:border-[#e10600] focus:outline-none transition-colors" 
              />
            </div>
            <div className="w-full space-y-4">
              <label className="text-[10px] font-bold text-[#e10600] uppercase tracking-widest">[ DRIVER_2_ID ]</label>
              <input 
                type="text"
                placeholder="lewis_hamilton" 
                value={driver2} 
                onChange={(e) => setDriver2(e.target.value)} 
                required 
                className="w-full bg-[#0d0d0d] border-2 border-[#262626] rounded-none px-4 py-4 text-white font-bold uppercase tracking-wider focus:border-[#e10600] focus:outline-none transition-colors" 
              />
            </div>
            <button type="submit" disabled={loading} className="w-full md:w-auto px-10 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-[#e10600] hover:text-white transition-colors shrink-0 border-2 border-white hover:border-[#e10600]">
              EXECUTE
            </button>
          </form>
        </div>

        {result && (
          <div className="space-y-16 animate-in fade-in duration-700">
            
            <div className="grid md:grid-cols-2 gap-12">
              {[result.driver1_stats, result.driver2_stats].map((driver, idx) => {
                const isWinner = result.winner === driver.name;
                
                return (
                  <div key={idx} className={`clean-card p-12 flex flex-col items-center justify-center text-center transition-all duration-500 ${isWinner ? 'border-[#e10600] bg-[#151515]' : 'opacity-70'}`}>
                    {isWinner && <div className="text-[10px] font-bold text-[#e10600] uppercase tracking-widest mb-6"># WINNER</div>}
                    <div className="mb-10">
                      <Link to={`/driver/${driver.name.toLowerCase().replace(/ /g, '_')}`} className="text-3xl font-bold uppercase tracking-wider text-white hover:text-[#e10600] transition-colors">
                        {driver.name}
                      </Link>
                    </div>
                    <div className="w-full space-y-6">
                      <div className="flex justify-between items-center border-b-2 border-[#262626] pb-4">
                        <span className="text-[10px] font-bold text-[#707070] uppercase tracking-widest">NET_SCORE</span>
                        <span className="font-bold text-2xl text-white">{driver.score}</span>
                      </div>
                      <div className="flex justify-between items-center border-b-2 border-[#262626] pb-4">
                        <span className="text-[10px] font-bold text-[#707070] uppercase tracking-widest">CONSISTENCY</span>
                        <span className="font-bold text-2xl text-white">{driver.consistency}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-[#707070] uppercase tracking-widest">PACE_AVG</span>
                        <span className="font-bold text-2xl text-white">{driver.pace}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="clean-card p-10">
              <h2 className="text-sm text-white pixel-font uppercase border-b-2 border-[#262626] pb-4 mb-12">
                [ VISUAL_COMPARISON ]
              </h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#262626" />
                    <XAxis dataKey="metric" stroke="#555555" tickLine={false} axisLine={{ stroke: '#262626' }} fontSize={10} />
                    <YAxis stroke="#555555" tickLine={false} axisLine={{ stroke: '#262626' }} fontSize={10} />
                    <Tooltip 
                      cursor={{fill: '#262626'}}
                      contentStyle={{ backgroundColor: '#151515', border: '2px solid #262626', borderRadius: '0' }}
                      itemStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '12px' }}
                    />
                    <Legend iconType="square" wrapperStyle={{ paddingTop: '30px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                    <Bar dataKey={result.driver1_stats.name} fill="#ffffff" radius={0} barSize={40} />
                    <Bar dataKey={result.driver2_stats.name} fill="#404040" radius={0} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
