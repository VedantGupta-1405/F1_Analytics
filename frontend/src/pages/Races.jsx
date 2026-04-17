import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
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

export default function RacesList() {
  const { season, seasonData, loading } = useContext(SeasonContext);

  if (loading) return <PixelLoader />;

  return (
    <div className="animate-in fade-in-up duration-1000 max-w-7xl mx-auto px-6">
      <div className="py-20 border-b-2 border-[#262626] mb-16">
        <h1 className="text-3xl md:text-5xl text-white pixel-font mb-6 leading-tight uppercase">
          CHAMPIONSHIP<br/><span className="text-[#e10600]">CALENDAR</span>
        </h1>
        <p className="text-sm text-[#707070] font-bold uppercase tracking-widest">
          Event Matrix // {season}
        </p>
      </div>

      {!seasonData || !seasonData.races ? (
        <div className="py-20 text-center text-[#707070] font-bold uppercase tracking-widest text-sm">
          No events found for DB_{season}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {seasonData.races.map((race) => {
            const hasOccurred = race.results && race.results.length > 0;
            const imgUrl = getRaceImage(race.race_name);
            
            return (
              <Link 
                key={race.round} 
                to={`/race/${race.round}`}
                className={`clean-card overflow-hidden group block transition-all hover:scale-[1.02] hover:-translate-y-2 hover:border-[#e10600] ${!hasOccurred ? 'opacity-70' : ''}`}
              >
                <div className="relative h-48 w-full border-b-2 border-[#262626] overflow-hidden">
                  <img src={imgUrl} alt={race.race_name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="text-[10px] font-bold text-white bg-[#e10600] px-2 py-1 uppercase tracking-widest border-2 border-white">
                      RND_{race.round < 10 ? `0${race.round}` : race.round}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2 group-hover:text-[#e10600] transition-colors">
                    {race.race_name}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-[#707070] uppercase tracking-widest">
                      <span>CIRCUIT</span>
                      <span className="text-right truncate ml-4 text-white">{race.circuit_name}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-[#707070] uppercase tracking-widest">
                      <span>COUNTRY</span>
                      <span className="text-white">{race.country}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-[#707070] uppercase tracking-widest pt-2 border-t-2 border-[#262626]">
                      <span>DATE</span>
                      <span className="text-[#e10600]">{new Date(race.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
