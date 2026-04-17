import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SeasonContext } from '../App';
import PixelLoader from '../components/ui/PixelLoader';

export default function Leaderboard() {
  const { season, seasonData, loading } = useContext(SeasonContext);

  const leaderboard = useMemo(() => {
    if (!seasonData || !seasonData.races) return [];
    
    let driversMap = {};
    
    seasonData.races.forEach(race => {
      if (!race.results) return;
      race.results.forEach(res => {
        if (!driversMap[res.driver]) {
          driversMap[res.driver] = { 
            name: res.driver, 
            id: res.driver_id, 
            points: 0, 
            team: res.team,
            wins: 0,
            podiums: 0
          };
        }
        driversMap[res.driver].points += res.points;
        if (res.finish_position === 1) driversMap[res.driver].wins += 1;
        if (res.finish_position <= 3) driversMap[res.driver].podiums += 1;
      });
    });

    return Object.values(driversMap)
      .sort((a,b) => b.points - a.points)
      .map((d, i) => ({ ...d, rank: i + 1 }));
  }, [seasonData]);

  if (loading) return <PixelLoader />;

  return (
    <div className="animate-in fade-in-up duration-1000 max-w-5xl mx-auto px-6">
      <div className="py-20 border-b-2 border-[#262626] mb-16">
        <h1 className="text-3xl md:text-5xl text-white pixel-font mb-6 leading-tight uppercase">
          DRIVER<br/><span className="text-[#e10600]">STANDINGS</span>
        </h1>
        <p className="text-sm text-[#707070] font-bold uppercase tracking-widest">
          Championship Matrix // {season}
        </p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="py-20 text-center text-[#707070] font-bold uppercase tracking-widest text-sm">
          No records found for DB_{season}
        </div>
      ) : (
        <div className="clean-card overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#262626]/20">
                <tr>
                  <th className="px-8 py-6 w-24 text-[10px] font-bold text-[#e10600] uppercase tracking-widest border-b-2 border-[#262626]">POS</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-[#707070] uppercase tracking-widest border-b-2 border-[#262626]">DRIVER</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-[#707070] uppercase tracking-widest border-b-2 border-[#262626]">TEAM</th>
                  <th className="px-8 py-6 text-right text-[10px] font-bold text-[#707070] uppercase tracking-widest border-b-2 border-[#262626]">PTS</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-[#262626]">
                {leaderboard.map((driver) => (
                  <tr key={driver.id} className="hover:bg-[#262626]/40 transition-colors group">
                    <td className="px-8 py-6">
                      <span className={`text-xl font-bold ${driver.rank === 1 ? 'text-[#e10600]' : 'text-[#707070]'}`}>
                        {driver.rank < 10 ? `0${driver.rank}` : driver.rank}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <Link to={`/driver/${driver.id}`} className="font-bold text-lg uppercase tracking-wider text-white group-hover:text-[#e10600] transition-colors block">
                        {driver.name}
                      </Link>
                      <div className="text-[10px] text-[#707070] font-bold mt-1 uppercase">
                        {driver.wins} WINS | {driver.podiums} PODIUMS
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-[#707070] uppercase tracking-wider">
                      {driver.team}
                    </td>
                    <td className="px-8 py-6 text-right font-bold text-xl text-white">
                      {driver.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
