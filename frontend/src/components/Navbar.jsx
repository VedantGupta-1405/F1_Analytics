import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { SeasonContext } from '../App';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { season, setSeason } = useContext(SeasonContext);
  
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);

  const links = [
    { name: 'Dashboard', path: '/' },
    { name: 'Standings', path: '/leaderboard' },
    { name: 'Teams', path: '/teams' },
    { name: 'Events', path: '/races' },
    { name: 'Tracks', path: '/tracks' },
    { name: 'News', path: '/news' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 1) {
      axios.get(`https://f1-analytics-rlv0.onrender.com/api/search?q=${searchQuery}&year=${season}`)
        .then(res => setSearchResults(res.data))
        .catch(() => setSearchResults([]));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, season]);

  const handleSearchSelect = (result) => {
    setSearchOpen(false);
    setSearchQuery('');
    if (result.type === 'driver') navigate(`/driver/${result.id}`);
    if (result.type === 'race') navigate(`/race/${result.id}`);
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 border-b-2",
      scrolled ? "bg-[#0d0d0d] border-[#262626] py-4" : "bg-[#0d0d0d]/90 backdrop-blur border-transparent py-4 md:py-6"
    )}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center flex-shrink-0">
              <span className="text-[#e10600] pixel-font text-[10px] tracking-widest leading-none">
                F1<br/><span className="text-white">SYS</span>
              </span>
            </Link>
            
            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-8">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "text-sm font-bold transition-colors uppercase tracking-widest hover:text-[#e10600]",
                      isActive ? "text-white border-b-2 border-[#e10600] pb-1" : "text-[#707070]"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            
            {/* Global Season Selector */}
            <div className="relative group cursor-pointer border-2 border-[#262626] bg-[#151515] px-3 py-1.5 hover:border-[#e10600] transition-colors">
              <div className="flex items-center gap-2 text-[10px] font-bold text-white pixel-font">
                <span>{season}</span>
                <ChevronDown className="w-3 h-3 text-[#e10600]" />
              </div>
              <select 
                value={season} 
                onChange={(e) => setSeason(parseInt(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
              >
                {[2021, 2022, 2023, 2024, 2025].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            {/* Clean Search (Hidden on Mobile) */}
            <div className="relative hidden lg:block" ref={searchRef}>
              <div className="flex items-center bg-[#151515] border-2 border-[#262626] px-3 py-2 w-64 focus-within:border-[#e10600] transition-colors">
                <Search className="w-4 h-4 text-[#707070] mr-2" />
                <input 
                  type="text" 
                  placeholder="SEARCH..." 
                  className="bg-transparent border-none outline-none text-xs text-white placeholder:text-[#707070] w-full font-bold tracking-wider"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                />
              </div>

              {searchOpen && searchQuery.length > 1 && (
                <div className="absolute top-full right-0 mt-2 w-full bg-[#151515] border-2 border-[#262626] shadow-2xl overflow-hidden animate-in fade-in z-50">
                  {searchResults.length > 0 ? (
                    <div className="py-1">
                      {searchResults.map((res, i) => (
                        <div 
                          key={i} 
                          onClick={() => handleSearchSelect(res)}
                          className="px-4 py-3 hover:bg-[#262626] cursor-pointer flex flex-col transition-colors border-b-2 border-[#262626] last:border-0"
                        >
                          <span className="text-sm font-bold text-white">{res.name}</span>
                          <span className="text-[10px] text-[#e10600] uppercase tracking-widest mt-1 font-bold">{res.type}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-center text-xs font-bold text-[#707070] uppercase tracking-widest">
                      No results
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger Icon */}
            <button 
              className="md:hidden text-white p-2 border-2 border-[#262626] bg-[#151515]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="square" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="square" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t-2 border-[#262626] animate-in slide-in-from-top-2">
            <div className="flex flex-col space-y-4 pb-4">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold text-white uppercase tracking-widest hover:text-[#e10600]"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
