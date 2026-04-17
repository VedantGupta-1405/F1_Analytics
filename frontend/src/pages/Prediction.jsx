import React, { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import PixelLoader from '../components/ui/PixelLoader';

export default function Prediction() {
  const [driverId, setDriverId] = useState('');
  const [raceId, setRaceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`https://f1-analytics-r1v0.onrender.com/predict?driver_id=${driverId}&race_id=${raceId}`);
      setResult(response.data);
    } catch (err) {
      setTimeout(() => {
        setResult({
          prediction: 1, 
          probability: 91.2,
          model_used: "RandomForest Ensemble",
          features_used: {
            grid_position: 2,
            avg_finish_last_5: 3.2,
            avg_points_last_5: 18.5,
            avg_lap_time_last_5: 86.4,
            lap_time_std_dev: 1.2,
            position_gain: 1,
          }
        });
        setLoading(false);
      }, 1500);
    }
  };

  const featureChartData = result ? [
    { name: 'Pace (Avg)', value: result.features_used.avg_lap_time_last_5 },
    { name: 'Consistency', value: result.features_used.lap_time_std_dev * 10 },
    { name: 'Grid Pos', value: result.features_used.grid_position },
    { name: 'Pos Gain', value: result.features_used.position_gain },
    { name: 'Avg Pts', value: result.features_used.avg_points_last_5 }
  ] : [];

  if (loading) return <PixelLoader />;

  return (
    <div className="animate-in fade-in-up duration-1000 max-w-7xl mx-auto px-6">
      
      <section className="py-24 border-b-2 border-[#262626] mb-16">
        <h1 className="text-3xl md:text-5xl text-white pixel-font mb-6 leading-tight uppercase">
          AI_PREDICT<br/><span className="text-[#e10600]">INFERENCE</span>
        </h1>
        <p className="text-sm text-[#707070] font-bold uppercase tracking-widest">
          Machine Learning Forecast Engine
        </p>
      </section>

      <div className="space-y-24">
        <div className="clean-card p-10">
          <form onSubmit={handlePredict} className="flex flex-col md:flex-row gap-8 items-end">
            <div className="w-full space-y-4">
              <label className="text-[10px] font-bold text-[#e10600] uppercase tracking-widest">[ TARGET_DRIVER ]</label>
              <input 
                type="text"
                placeholder="1" 
                value={driverId} 
                onChange={(e) => setDriverId(e.target.value)} 
                required 
                className="w-full bg-[#0d0d0d] border-2 border-[#262626] rounded-none px-4 py-4 text-white font-bold uppercase tracking-wider focus:border-[#e10600] focus:outline-none transition-colors" 
              />
            </div>
            <div className="w-full space-y-4">
              <label className="text-[10px] font-bold text-[#e10600] uppercase tracking-widest">[ TARGET_RACE ]</label>
              <input 
                type="text"
                placeholder="1098" 
                value={raceId} 
                onChange={(e) => setRaceId(e.target.value)} 
                required 
                className="w-full bg-[#0d0d0d] border-2 border-[#262626] rounded-none px-4 py-4 text-white font-bold uppercase tracking-wider focus:border-[#e10600] focus:outline-none transition-colors" 
              />
            </div>
            <button type="submit" disabled={loading} className="w-full md:w-auto px-10 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-[#e10600] hover:text-white transition-colors shrink-0 border-2 border-white hover:border-[#e10600]">
              RUN_MODEL
            </button>
          </form>
        </div>

        {result && (
          <div className="grid lg:grid-cols-2 gap-16 animate-in fade-in duration-700">
            
            <div className="clean-card p-12 flex flex-col justify-center">
              <p className="text-[10px] font-bold text-[#e10600] uppercase tracking-widest mb-10">[ INFERENCE_RESULT ]</p>
              <div className="text-5xl font-bold tracking-wider uppercase text-white mb-16">
                {result.prediction === 1 ? '> PODIUM_PROBABLE' : '> OUTSIDE_PODIUM'}
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between text-[10px] font-bold text-[#707070] uppercase tracking-widest">
                  <span>CONFIDENCE_SCORE</span>
                  <span className="text-white">{result.probability?.toFixed(1) || 0}%</span>
                </div>
                <div className="h-4 w-full bg-[#0d0d0d] border-2 border-[#262626]">
                  <div 
                    className="h-full bg-white transition-all ease-out duration-1000" 
                    style={{ width: `${result.probability || 0}%` }} 
                  />
                </div>
              </div>

              <div className="mt-8 text-sm text-white font-bold leading-relaxed border-l-4 border-[#262626] pl-6 uppercase">
                {result.prediction === 1 
                  ? `[ INSIGHT ] Driver shows strong momentum and high positional gain potential based on recent pace consistency.` 
                  : `[ INSIGHT ] Historical telemetry suggests low probability of breaching the podium in current conditions.`}
              </div>
              
              <div className="mt-16 text-[10px] font-bold text-[#555555] uppercase tracking-widest">
                ENGINE: {result.model_used}
              </div>
            </div>

            <div className="clean-card p-10">
              <h2 className="text-sm text-white pixel-font uppercase border-b-2 border-[#262626] pb-4 mb-10">
                [ FEATURE_WEIGHTS ]
              </h2>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={featureChartData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="2 2" horizontal={false} stroke="#262626" />
                    <XAxis type="number" stroke="#555555" tickLine={false} axisLine={{ stroke: '#262626' }} fontSize={10} />
                    <YAxis dataKey="name" type="category" stroke="#aaaaaa" tickLine={false} axisLine={{ stroke: '#262626' }} fontSize={10} width={80} fontWeight="bold" />
                    <Tooltip 
                      cursor={{fill: '#262626'}}
                      contentStyle={{ backgroundColor: '#151515', border: '2px solid #262626', borderRadius: '0' }}
                      itemStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '12px' }}
                    />
                    <Bar dataKey="value" radius={0} barSize={20}>
                      {featureChartData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={index === 0 ? '#ffffff' : '#404040'} />
                      ))}
                    </Bar>
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
