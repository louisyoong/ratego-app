
export interface ExchangeRates {
  [key: string]: number;
}

export interface CurrencyData {
  base: string;
  rates: ExchangeRates;
  lastUpdated: string;
}

export interface ChartDataPoint {
  date: string;
  rate: number;
}

export interface MarketInsight {
  trend: 'up' | 'down' | 'neutral';
  analysis: string;
  recommendation: string;
  volatility: string;
}

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}
