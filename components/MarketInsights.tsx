
import React from 'react';
import { MarketInsight } from '../types';
import { Language, translations } from '../i18n';

interface MarketInsightsProps {
  insight: MarketInsight | null;
  isLoading: boolean;
  onRefresh: () => void;
  language: Language;
}

const MarketInsights: React.FC<MarketInsightsProps> = ({ insight, isLoading, onRefresh, language }) => {
  const t = translations[language];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white">{t.aiInsights}</h3>
        </div>
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest flex items-center gap-2"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              {t.analyzing}
            </span>
          ) : t.reAnalyze}
        </button>
      </div>

      {!insight && !isLoading ? (
        <div className="text-center py-8 border-2 border-dashed border-slate-800 rounded-xl">
          <p className="text-slate-500 text-sm">No analysis performed yet.</p>
          <button 
            onClick={onRefresh}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-full transition-all"
          >
            Start Analysis
          </button>
        </div>
      ) : isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-slate-800 rounded w-3/4"></div>
          <div className="h-4 bg-slate-800 rounded w-full"></div>
          <div className="h-4 bg-slate-800 rounded w-5/6"></div>
          <div className="h-20 bg-slate-800 rounded w-full"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{t.sentiment}</p>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${
                  insight?.trend === 'up' ? 'bg-emerald-500' : 
                  insight?.trend === 'down' ? 'bg-rose-500' : 'bg-amber-500'
                }`} />
                <p className="text-lg font-bold capitalize text-white">{insight?.trend}</p>
              </div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{t.volatility}</p>
              <p className="text-lg font-bold text-white">{insight?.volatility}</p>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{t.technicalAnalysis}</p>
            <p className="text-slate-300 text-sm leading-relaxed">{insight?.analysis}</p>
          </div>

          <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">{t.recommendation}</p>
            <p className="text-white text-sm font-medium">{insight?.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketInsights;
