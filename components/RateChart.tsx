
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { ChartDataPoint } from '../types';
import { Language, translations } from '../i18n';

interface RateChartProps {
  data: ChartDataPoint[];
  base: string;
  target: string;
  currentRange: string;
  onRangeChange: (range: string) => void;
  language: Language;
}

const RateChart: React.FC<RateChartProps> = ({ data, base, target, currentRange, onRangeChange, language }) => {
  const t = translations[language];
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-2xl">
          <p className="text-xs text-slate-400 font-medium mb-1">{label}</p>
          <p className="text-sm font-bold text-blue-400">
            {payload[0].value.toFixed(4)} {target}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full flex flex-col min-h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">{t.priceHistory}</h3>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">{base} / {target} Performance</p>
        </div>
        <div className="flex gap-2">
          {['7D', '1M', '3M', '1Y'].map((range) => (
            <button
              key={range}
              onClick={() => onRangeChange(range)}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                range === currentRange ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[300px] chart-container overflow-hidden">
        <ResponsiveContainer width="99%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 10 }}
              dy={10}
              minTickGap={30}
            />
            <YAxis 
              domain={['auto', 'auto']}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="rate" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRate)" 
              animationDuration={1500}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RateChart;
