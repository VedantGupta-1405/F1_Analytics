import React, { useContext, useMemo } from 'react';
import { SeasonContext } from '../App';
import PixelLoader from '../components/ui/PixelLoader';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

export default function TeamPerformance() {
  const { season, seasonData, loading } = useContext(SeasonContext);

  const stats = useMemo(() => {
    if (!seasonData || !seasonData.races) return null;
    
    let teamsMap = {};
    
    seasonData.races.forEach(race => {
      if (!race.results) return;
      race.results.forEach(res => {
        if (!teamsMap[res.team]) {
          teamsMap[res.team] = { 
            name: res.team, 
            id: res.team_id, 
            points: 0, 
            wins: 0,
            podiums: 0
          };
        }
        teamsMap[res.team].points += res.points;
        if (res.finish_position === 1) teamsMap[res.team].wins += 1;
        if (res.finish_position <= 3) teamsMap[res.team].podiums += 1;
      });
    });

    const leaderboard = Object.values(teamsMap)
      .sort((a,b) => b.points - a.points)
      .map((d, i) => ({ ...d, rank: i + 1 }));

    return { leaderboard };
  }, [seasonData]);

  if (loading) return <PixelLoader />;

  return (
    <div className="animate-in fade-in-up duration-1000 max-w-5xl mx-auto px-6">
      <div className="py-20 border-b-2 border-[#262626] mb-16">
        <h1 className="text-3xl md:text-5xl text-white pixel-font mb-6 leading-tight uppercase">
          CONSTRUCTOR<br/><span className="text-[#e10600]">STANDINGS</span>
        </h1>
        <p className="text-sm text-[#707070] font-bold uppercase tracking-widest">
          Team Power Matrix // {season}
        </p>
      </div>

      {!stats || stats.leaderboard.length === 0 ? (
        <div className="py-20 text-center text-[#707070] font-bold uppercase tracking-widest text-sm">
          No records found for DB_{season}
        </div>
      ) : (
        <div className="space-y-16">
          <div className="clean-card overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#262626]/20">
                  <tr>
                    <th className="px-8 py-6 w-24 text-[10px] font-bold text-[#e10600] uppercase tracking-widest border-b-2 border-[#262626]">POS</th>
                    <th className="px-8 py-6 text-[10px] font-bold text-[#707070] uppercase tracking-widest border-b-2 border-[#262626]">TEAM</th>
                    <th className="px-8 py-6 text-right text-[10px] font-bold text-[#707070] uppercase tracking-widest border-b-2 border-[#262626]">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#262626]">
                  {stats.leaderboard.map((team) => (
                    <tr key={team.id} className="hover:bg-[#262626]/40 transition-colors">
                      <td className="px-8 py-6">
                        <span className={`text-xl font-bold ${team.rank === 1 ? 'text-[#e10600]' : 'text-[#707070]'}`}>
                          {team.rank < 10 ? `0${team.rank}` : team.rank}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="font-bold text-lg uppercase tracking-wider text-white">
                          {team.name}
                        </span>
                        <div className="text-[10px] text-[#707070] font-bold mt-1 uppercase">
                          {team.wins} WINS | {team.podiums} PODIUMS
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right font-bold text-xl text-white">
                        {team.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="clean-card p-10 h-[400px]">
             <h2 className="text-[10px] text-white pixel-font uppercase border-b-2 border-[#262626] pb-4 mb-8">
               [ CONSTRUCTOR_PTS_DISTRIBUTION ]
             </h2>
             <ResponsiveContainer width="100%" height="85%">
               <BarChart data={stats.leaderboard} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="2 2" horizontal={false} stroke="#262626" />
                 <XAxis type="number" stroke="#707070" fontSize={10} tickLine={false} axisLine={{ stroke: '#262626' }} />
                 <YAxis type="category" dataKey="name" stroke="#aaaaaa" fontSize={10} tickLine={false} axisLine={{ stroke: '#262626' }} width={140} fontWeight="bold" textAnchor="end" />
                 <Tooltip 
                   cursor={{fill: '#262626'}}
                   contentStyle={{ backgroundColor: '#151515', border: '2px solid #262626', borderRadius: '0' }}
                   itemStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '12px' }}
                 />
                 <Bar dataKey="points" radius={0} barSize={20}>
                   {stats.leaderboard.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={index === 0 ? '#e10600' : '#404040'} />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
