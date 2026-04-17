import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PixelLoader from '../components/ui/PixelLoader';

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get('https://f1-analytics-rlv0.onrender.com/api/news')
      .then(res => {
        setNews(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <PixelLoader />;

  return (
    <div className="animate-in fade-in-up duration-1000 max-w-7xl mx-auto px-6">
      <div className="py-20 border-b-2 border-[#262626] mb-16">
        <h1 className="text-3xl md:text-5xl text-white pixel-font mb-6 leading-tight uppercase">
          PADDOCK<br/><span className="text-[#e10600]">INTEL</span>
        </h1>
        <p className="text-sm text-[#707070] font-bold uppercase tracking-widest">
          Latest telemetry & headlines
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((item, idx) => (
          <a 
            key={idx} 
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="clean-card overflow-hidden group block transition-all hover:scale-[1.02] hover:-translate-y-2 hover:border-[#e10600] flex flex-col h-full"
          >
            <div className="relative h-48 w-full border-b-2 border-[#262626] overflow-hidden">
              <img src={item.image} alt="News" className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-bold text-[#e10600] bg-[#151515] px-2 py-1 uppercase tracking-widest border-2 border-[#262626]">
                  {item.source}
                </span>
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              <div className="text-[10px] text-[#707070] font-bold mb-3 uppercase tracking-widest border-b-2 border-[#262626] pb-2 inline-block">
                {new Date(item.date).toLocaleDateString()}
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider leading-snug group-hover:text-[#e10600] transition-colors">
                {item.title}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
