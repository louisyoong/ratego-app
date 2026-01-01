
import React from 'react';
import { CURRENCIES } from '../constants';
import { ExchangeRates } from '../types';
import { Language, translations } from '../i18n';

interface MarketsViewProps {
  rates: ExchangeRates;
  base: string;
  language: Language;
}

const FAMOUS_CODES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'SGD', 'INR', 'BTC'];

const MarketsView: React.FC<MarketsViewProps> = ({ rates, base, language }) => {
  const t = translations[language];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">{t.globalMarkets}</h2>
          <p className="text-slate-400 text-sm mt-1">Real-time performance of major currencies against {base}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-full px-4 py-2 flex items-center gap-2 text-xs font-bold text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          {t.liveExchangeData}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {FAMOUS_CODES.map(code => {
          const currency = CURRENCIES.find(c => c.code === code);
          const rate = rates[code];
          if (!currency || !rate) return null;

          const mockChange = (Math.random() * 0.8 - 0.4).toFixed(2);
          const isUp = parseFloat(mockChange) >= 0;

          return (
            <div key={code} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-600 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{currency.flag}</span>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{code}</h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{currency.name}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-black uppercase ${isUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                  {isUp ? '↑' : '↓'} {Math.abs(parseFloat(mockChange))}%
                </div>
              </div>
              
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-mono font-bold text-white">
                    {rate.toFixed(4)}
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">1 {base} = {rate.toFixed(4)} {code}</p>
                </div>
                <div className="h-8 w-24 opacity-30">
                  <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                    <path 
                      d={`M0,${20+Math.random()*10} L20,${15+Math.random()*10} L40,${25+Math.random()*10} L60,${10+Math.random()*10} L80,${20+Math.random()*10} L100,${isUp ? 5 : 25}`} 
                      fill="none" 
                      stroke={isUp ? '#10b981' : '#f43f5e'} 
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketsView;
