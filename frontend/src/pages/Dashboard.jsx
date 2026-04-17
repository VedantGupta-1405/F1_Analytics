import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { SeasonContext } from '../App';
import PixelLoader from '../components/ui/PixelLoader';

export default function Dashboard() {
  const { season, seasonData, loading } = useContext(SeasonContext);

  const stats = useMemo(() => {
    if (!seasonData || !seasonData.races) return null;
    
    let driversMap = {};
    let constructorsMap = {};
    let racesCompleted = 0;
    let progressionData = [];
    
    // Arrays for last 5 races form
    let driverForm = {};

    seasonData.races.forEach((race, idx) => {
      // Check if race actually happened (results exist)
      if (!race.results || race.results.length === 0) return;
      racesCompleted++;
      
      let raceProgression = { race: race.race_name };

      race.results.forEach(res => {
        // Init driver
        if (!driversMap[res.driver]) {
          driversMap[res.driver] = { points: 0, pos_gains: 0, name: res.driver, id: res.driver_id };
          driverForm[res.driver] = [];
        }
        // Update driver stats
        driversMap[res.driver].points += res.points;
        driversMap[res.driver].pos_gains += (res.grid_position - res.finish_position);
        
        driverForm[res.driver].push({ finish: res.finish_position, points: res.points });
        raceProgression[res.driver] = driversMap[res.driver].points;
      });
      progressionData.push(raceProgression);
    });

    const sortedDrivers = Object.values(driversMap).sort((a,b) => b.points - a.points);
    const top_5 = sortedDrivers.slice(0, 5);
    const most_improved = Object.values(driversMap).sort((a,b) => b.pos_gains - a.pos_gains)[0];
    
    // Form Analysis
    const formAnalysis = sortedDrivers.slice(0, 10).map(d => {
      const recent = driverForm[d.name].slice(-3); // last 3 races
      const pts = recent.reduce((sum, r) => sum + r.points, 0);
      return { ...d, recentPts: pts };
    }).sort((a,b) => b.recentPts - a.recentPts);

    return {
      top_driver: top_5[0] || {name: "N/A", points: 0},
      most_improved: most_improved || {name: "N/A", pos_gains: 0},
      total_races: racesCompleted,
      progression: progressionData,
      top_5,
      formAnalysis: formAnalysis.slice(0, 5),
      all_races: seasonData.races
    };
  }, [seasonData]);

  if (loading) return <PixelLoader />;

  return (
    <div className="animate-in fade-in-up duration-1000">
      <section className="relative min-h-[50vh] flex flex-col justify-center items-center text-center px-6 border-b-2 border-[#262626]">
        <div className="max-w-4xl mx-auto space-y-10 mt-6">
          <h1 className="text-3xl md:text-5xl lg:text-[4rem] text-white pixel-font leading-tight">
            F1 DATA<br/><span className="text-[#e10600]">SYSTEM</span>
          </h1>
          <p className="text-lg md:text-xl text-[#707070] font-medium max-w-2xl mx-auto tracking-wide">
            Dynamic telemetry extraction matrix. Season {season}.
          </p>
        </div>
      </section>

      {!stats ? (
        <div className="py-32 text-center text-[#707070] font-bold uppercase tracking-widest text-sm">
          No records found for DB_{season}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-24 space-y-32">
          
          <section className="space-y-12">
            <h2 className="text-sm text-white pixel-font uppercase border-b-2 border-[#262626] pb-4">
              [ SEASON_OVERVIEW ]
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="clean-card p-8 flex flex-col justify-between min-h-[160px]">
                <span className="text-[10px] font-bold text-[#e10600] uppercase tracking-widest">TOP_DRIVER</span>
                <div className="mt-4">
                  <div className="text-xl font-bold text-white tracking-wider uppercase">{stats.top_driver.name}</div>
                  <div className="text-xs font-bold text-[#707070] mt-2 uppercase tracking-widest">{stats.top_driver.points} PTS</div>
                </div>
              </div>
              <div className="clean-card p-8 flex flex-col justify-between min-h-[160px]">
                <span className="text-[10px] font-bold text-[#e10600] uppercase tracking-widest">MOST_IMPROVED</span>
                <div className="mt-4">
                  <div className="text-xl font-bold text-white tracking-wider uppercase">{stats.most_improved.name}</div>
                  <div className="text-xs font-bold text-[#707070] mt-2 uppercase tracking-widest">+{stats.most_improved.pos_gains} PLACES</div>
                </div>
              </div>
              <div className="clean-card p-8 flex flex-col justify-between min-h-[160px]">
                <span className="text-[10px] font-bold text-[#e10600] uppercase tracking-widest">RACES_LOGGED</span>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-white tracking-wider uppercase">{stats.total_races}</div>
                  <div className="text-xs font-bold text-[#707070] mt-2 uppercase tracking-widest">COMPLETED</div>
                </div>
              </div>
              <div className="clean-card p-8 flex flex-col justify-between min-h-[160px]">
                <span className="text-[10px] font-bold text-[#e10600] uppercase tracking-widest">FORM_LEADER</span>
                <div className="mt-4">
                  <div className="text-xl font-bold text-white tracking-wider uppercase">{stats.formAnalysis[0]?.name || "N/A"}</div>
                  <div className="text-xs font-bold text-[#707070] mt-2 uppercase tracking-widest">{stats.formAnalysis[0]?.recentPts || 0} PTS (L3)</div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-12">
            <h2 className="text-sm text-white pixel-font uppercase border-b-2 border-[#262626] pb-4">
              [ SEASON_TIMELINE ]
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {stats.all_races.map((r, idx) => {
                const isCompleted = r.results && r.results.length > 0;
                const winner = isCompleted ? r.results.find(res => res.finish_position === 1) : null;
                return (
                  <Link key={idx} to={`/race/${r.round}`} className={`clean-card p-4 flex flex-col justify-between transition-colors ${!isCompleted ? 'opacity-50 pointer-events-none' : 'hover:border-[#e10600]'}`}>
                    <div>
                      <div className="text-[10px] text-[#707070] font-bold mb-2">RND {r.round}</div>
                      <div className="text-[10px] sm:text-xs text-white font-bold leading-tight uppercase line-clamp-3 mb-4">{r.race_name}</div>
                    </div>
                    {isCompleted && winner && (
                      <div className="mt-auto text-[10px] text-[#e10600] font-bold uppercase truncate">
                        1. {winner.driver}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-12">
              <h2 className="text-sm text-white pixel-font uppercase border-b-2 border-[#262626] pb-4">
                [ PROGRESSION_MATRIX ]
              </h2>
              <div className="clean-card p-8 h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.progression} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#262626" />
                    <XAxis dataKey="race" stroke="#707070" fontSize={10} tickLine={false} axisLine={{ stroke: '#262626' }} />
                    <YAxis stroke="#707070" fontSize={10} tickLine={false} axisLine={{ stroke: '#262626' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#151515', border: '2px solid #262626', borderRadius: '0', padding: '10px' }}
                      itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase' }}
                      labelStyle={{ fontSize: '10px', color: '#707070', marginBottom: '8px' }}
                    />
                    {stats.top_5.map((driver, index) => (
                      <Line 
                        key={driver.name}
                        type="stepAfter" 
                        dataKey={driver.name} 
                        stroke={index === 0 ? "#e10600" : index === 1 ? "#ffffff" : "#404040"} 
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: '#fff', strokeWidth: 0 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-12">
              <h2 className="text-sm text-white pixel-font uppercase border-b-2 border-[#262626] pb-4">
                [ DRIVER_POWER ]
              </h2>
              <div className="clean-card p-8 h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.top_5} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="2 2" horizontal={false} stroke="#262626" />
                    <XAxis type="number" stroke="#707070" fontSize={10} tickLine={false} axisLine={{ stroke: '#262626' }} />
                    <YAxis type="category" dataKey="name" stroke="#aaaaaa" fontSize={10} tickLine={false} axisLine={{ stroke: '#262626' }} width={120} fontWeight="bold" textAnchor="end" />
                    <Tooltip 
                      cursor={{fill: '#262626'}}
                      contentStyle={{ backgroundColor: '#151515', border: '2px solid #262626', borderRadius: '0' }}
                      itemStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '12px' }}
                    />
                    <Bar dataKey="points" radius={0} barSize={20}>
                      {stats.top_5.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#e10600' : '#404040'} />
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
