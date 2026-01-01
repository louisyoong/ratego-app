
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Language, translations } from '../i18n';

interface MoneyChangerViewProps {
  language: Language;
}

const MoneyChangerView: React.FC<MoneyChangerViewProps> = ({ language }) => {
  const t = translations[language];
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const performSearch = async (latitude?: number, longitude?: number, manualLocation?: string) => {
    setLoading(true);
    setError('');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      let prompt = "";
      let config: any = {
        tools: [{ googleMaps: {} }]
      };

      if (latitude && longitude) {
        prompt = `Find reliable money changer centers near my current location. List their names and provide clear links to their locations. PLEASE RESPOND IN THIS LANGUAGE: ${language}`;
        config.toolConfig = {
          retrievalConfig: {
            latLng: { latitude, longitude }
          }
        };
      } else {
        prompt = `Find reliable money changer centers in or near ${manualLocation}. List their names, exact locations, and provide links to their Google Maps pages. PLEASE RESPOND IN THIS LANGUAGE: ${language}`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: config,
      });

      setSummary(response.text || '');
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const filteredChunks = chunks.filter((c: any) => c.maps);
      setResults(filteredChunks);
      
      if (filteredChunks.length === 0 && !response.text) {
        setError("No specific centers found. Try a different search term.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch locations. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNearbySearch = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => performSearch(position.coords.latitude, position.coords.longitude),
      (err) => {
        setError("Location access denied. Please type a city manually.");
        setLoading(false);
      }
    );
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    performSearch(undefined, undefined, searchQuery);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight">{t.moneyChanger}</h2>
        <p className="text-slate-400 max-w-lg mx-auto">{t.nearbySummary}</p>

        <div className="max-w-md mx-auto pt-4">
          <form onSubmit={handleManualSearch} className="flex gap-2">
            <input 
              type="text" 
              placeholder={t.enterCity}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all disabled:opacity-50"
            >
              {t.search}
            </button>
          </form>
          
          <div className="flex items-center gap-4 my-4">
            <div className="h-px bg-slate-800 flex-1"></div>
            <span className="text-xs text-slate-600 font-bold uppercase">{t.or}</span>
            <div className="h-px bg-slate-800 flex-1"></div>
          </div>

          <button 
            onClick={handleNearbySearch}
            disabled={loading}
            className="w-full px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t.analyzing}
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {t.findNearby}
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-rose-500 text-sm text-center">
          {error}
        </div>
      )}

      {(summary || results.length > 0) && (
        <div className="space-y-6">
          {summary && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 prose prose-invert max-w-none">
              <p className="text-slate-300 whitespace-pre-wrap leading-relaxed italic text-sm">
                "{summary.split('\n')[0]}..."
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((chunk, idx) => chunk.maps && (
              <div 
                key={idx} 
                className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-blue-500/50 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{t.verifiedSpot}</span>
                  </div>
                  <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                    {chunk.maps.title}
                  </h4>
                  <div className="flex items-start gap-2 text-slate-400 text-sm mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 shrink-0 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <p className="line-clamp-2">{chunk.maps.address || "Location detail available on map"}</p>
                  </div>
                </div>
                
                <a 
                  href={chunk.maps.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-slate-800 hover:bg-blue-600 text-white text-xs font-bold rounded-xl text-center transition-all flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  {t.getDirections}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoneyChangerView;
