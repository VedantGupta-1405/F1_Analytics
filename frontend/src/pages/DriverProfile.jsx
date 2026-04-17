import React, { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell } from 'recharts';
import { SeasonContext } from '../App';
import PixelLoader from '../components/ui/PixelLoader';

export default function DriverProfile() {
  const { driverId } = useParams();
  const { season, seasonData, loading } = useContext(SeasonContext);

  const data = useMemo(() => {
    if (!seasonData || !seasonData.races) return null;
    
    let history = [];
    let summary = { total_points: 0, wins: 0, podiums: 0, finishes: 0, pos_gains: 0 };
    let driverName = driverId.replace(/_/g, ' ').toUpperCase();

    seasonData.races.forEach(race => {
      if (!race.results) return;
      const res = race.results.find(r => r.driver_id === driverId);
      if (res) {
        driverName = res.driver.toUpperCase();
        history.push({
          race_name: race.race_name,
          points: res.points,
          finish: res.finish_position,
          grid: res.grid_position,
          pos_gain: res.grid_position > 0 ? (res.grid_position - res.finish_position) : 0
        });
        
        summary.total_points += res.points;
        if (res.finish_position === 1) summary.wins++;
        if (res.finish_position <= 3) summary.podiums++;
        summary.finishes += res.finish_position;
        summary.pos_gains += (res.grid_position > 0 ? (res.grid_position - res.finish_position) : 0);
      }
    });

    if (history.length === 0) return null;

    summary.avg_finish = (summary.finishes / history.length).toFixed(1);
    summary.avg_pos_gain = (summary.pos_gains / history.length).toFixed(1);

    // Form Insights
    const insights = [];
    const recent = history.slice(-3);
    const recentPts = recent.reduce((acc, curr) => acc + curr.points, 0);
    
    if (recentPts > 40) insights.push("Surging momentum. Strong point hauls in recent races.");
    else if (recentPts < 10) insights.push("Declining form. Struggling for pace in the last 3 rounds.");
    
    if (summary.wins === 0 && summary.avg_finish < 8) insights.push("Consistent points scorer but lacks race wins.");
    if (summary.avg_pos_gain > 2) insights.push("Aggressive overtaker. Frequently makes up positions on Sundays.");
    
    if (insights.length === 0) insights.push("Steady midfield performance profile.");

    return { driverName, summary, history, insights };
  }, [seasonData, driverId]);

  if (loading) return <PixelLoader />;

  return (
    <div className="animate-in fade-in-up duration-1000 max-w-7xl mx-auto px-6">
      
      {/* DRIVER HERO */}
      <section className="py-24 border-b-2 border-[#262626] mb-16">
        <h1 className="text-3xl md:text-5xl text-white pixel-font mb-6 leading-tight uppercase">
          {data ? data.driverName : driverId}
        </h1>
        <p className="text-sm text-[#707070] font-bold uppercase tracking-widest">
          Driver Matrix // Season {season}
        </p>
      </section>

      {!data ? (
        <div className="py-20 text-center text-[#707070] font-bold uppercase tracking-widest text-sm">
          No records found for DB_{driverId}_{season}
        </div>
      ) : (
        <div className="space-y-24">
          
          {/* INSIGHTS */}
          <section className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-1 space-y-4">
              <h3 className="text-[10px] font-bold text-[#e10600] uppercase tracking-widest">
                [ AI_FORM_ANALYSIS ]
              </h3>
            </div>
            <div className="md:col-span-2 space-y-6">
              {data.insights.map((insight, idx) => (
                <p key={idx} className="text-sm text-white font-bold tracking-wider leading-relaxed border-l-4 border-[#262626] pl-6 uppercase">
                  {insight}
                </p>
              ))}
            </div>
          </section>

          {/* STATS */}
          <section className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { label: "POINTS_NET", value: data.summary.total_points },
              { label: "WINS_TOTAL", value: data.summary.wins },
              { label: "PODIUMS", value: data.summary.podiums },
              { label: "AVG_FINISH", value: data.summary.avg_finish },
              { label: "GAIN_INDEX", value: `+${data.summary.avg_pos_gain}` },
            ].map((stat, i) => (
              <div key={i} className="clean-card p-6 flex flex-col justify-between min-h-[140px]">
                <span className="text-[10px] font-bold text-[#707070] uppercase tracking-widest">{stat.label}</span>
                <div className="text-2xl font-bold text-white tracking-wider mt-4">{stat.value}</div>
              </div>
            ))}
          </section>

          {/* CHARTS */}
          <section className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-12">
              <h2 className="text-sm text-white pixel-font uppercase border-b-2 border-[#262626] pb-4">
                [ FINISH_TREND ]
              </h2>
              <div className="clean-card p-8 h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.history} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#262626" />
                    <XAxis dataKey="race_name" stroke="#707070" tickLine={false} axisLine={{ stroke: '#262626' }} fontSize={10} />
                    {/* Reverse Y axis for finish positions (1 is best) */}
                    <YAxis reversed stroke="#707070" tickLine={false} axisLine={{ stroke: '#262626' }} fontSize={10} domain={[1, 20]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#151515', border: '2px solid #262626', borderRadius: '0' }}
                      itemStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '12px' }}
                      labelStyle={{ fontSize: '10px', color: '#707070', marginBottom: '8px' }}
                    />
                    <Line type="step" dataKey="finish" stroke="#ffffff" strokeWidth={2} dot={{ r: 3, fill: '#0d0d0d', strokeWidth: 2, stroke: '#ffffff' }} activeDot={{ r: 5, fill: '#e10600', strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-12">
              <h2 className="text-sm text-white pixel-font uppercase border-b-2 border-[#262626] pb-4">
                [ POSITION_SHIFTS ]
              </h2>
              <div className="clean-card p-8 h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.history} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#262626" />
                    <XAxis dataKey="race_name" stroke="#707070" tickLine={false} axisLine={{ stroke: '#262626' }} fontSize={10} />
                    <YAxis stroke="#707070" tickLine={false} axisLine={{ stroke: '#262626' }} fontSize={10} />
                    <Tooltip 
                      cursor={{fill: '#262626'}}
                      contentStyle={{ backgroundColor: '#151515', border: '2px solid #262626', borderRadius: '0' }}
                      itemStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '12px' }}
                      labelStyle={{ fontSize: '10px', color: '#707070', marginBottom: '8px' }}
                    />
                    <Bar dataKey="pos_gain" radius={0} barSize={20}>
                      {data.history.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.pos_gain > 0 ? '#ffffff' : entry.pos_gain < 0 ? '#404040' : '#262626'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

        </div>
      )}
    </div>
  );
}
