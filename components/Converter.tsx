
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CURRENCIES } from '../constants';
import { Language, translations } from '../i18n';
import { CurrencyInfo } from '../types';

interface ConverterProps {
  amount: number;
  setAmount: (val: number) => void;
  base: string;
  setBase: (val: string) => void;
  target: string;
  setTarget: (val: string) => void;
  rate: number;
  language: Language;
}

const CurrencyDropdown: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  language: Language;
}> = ({ label, value, onChange, language }) => {
  const t = translations[language];
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedCurrency = useMemo(() => 
    CURRENCIES.find(c => c.code === value), [value]
  );

  const filteredCurrencies = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return CURRENCIES;
    return CURRENCIES.filter(c => 
      c.code.toLowerCase().includes(query) || 
      c.name.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="space-y-2 relative" ref={dropdownRef}>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white flex items-center justify-between hover:border-blue-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="text-xl flex-shrink-0">{selectedCurrency?.flag}</span>
          <span className="font-bold whitespace-nowrap">{selectedCurrency?.code}</span>
          <span className="text-slate-400 text-sm truncate">{selectedCurrency?.name}</span>
        </div>
        <svg 
          className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-[100] top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-slate-800 border-none rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {filteredCurrencies.length > 0 ? (
              filteredCurrencies.map(c => (
                <button
                  key={c.code}
                  onClick={() => {
                    onChange(c.code);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  className={`w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-800 transition-colors text-left ${value === c.code ? 'bg-blue-600/10' : ''}`}
                >
                  <span className="text-xl flex-shrink-0">{c.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{c.code}</span>
                      {value === c.code && (
                        <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 truncate">{c.name}</div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-slate-500 text-sm italic">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Converter: React.FC<ConverterProps> = ({
  amount, setAmount, base, setBase, target, setTarget, rate, language
}) => {
  const t = translations[language];

  const result = (amount * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const swapCurrencies = () => {
    const temp = base;
    setBase(target);
    setTarget(temp);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t.amount}</label>
          <div className="relative">
            <input
              type="number"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="0.00"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
          <CurrencyDropdown 
            label={t.from}
            value={base}
            onChange={setBase}
            language={language}
          />

          <button
            onClick={swapCurrencies}
            className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 hover:border-blue-500 transition-all mt-4 md:mt-6 shadow-lg flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>

          <CurrencyDropdown 
            label={t.to}
            value={target}
            onChange={setTarget}
            language={language}
          />
        </div>

        <div className="pt-4 border-t border-slate-800">
          <div className="flex justify-between items-end flex-wrap gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-500 mb-1">{amount.toLocaleString()} {base} =</p>
              <h2 className="text-4xl font-bold text-white break-all">
                {result} <span className="text-blue-500 text-2xl">{target}</span>
              </h2>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-medium text-slate-500 uppercase">{t.currentRate}</p>
              <p className="text-lg font-mono text-emerald-400">1 {base} = {rate.toFixed(6)} {target}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Converter;
