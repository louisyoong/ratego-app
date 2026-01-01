import React, { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import Converter from "./components/Converter";
import RateChart from "./components/RateChart";
import MarketInsights from "./components/MarketInsights";
import MarketsView from "./components/MarketsView";
import MoneyChangerView from "./components/MoneyChangerView";
import TermsView from "./components/TermsView";
import PrivacyView from "./components/PrivacyView";
import { ExchangeRates, ChartDataPoint, MarketInsight } from "./types";
import { analyzeMarketTrends } from "./services/geminiService";
import { FALLBACK_RATES } from "./constants";
import { Language, translations } from "./i18n";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [language, setLanguage] = useState<Language>("en");
  const t = translations[language];

  const [amount, setAmount] = useState<number>(100);
  const [base, setBase] = useState<string>("USD");
  const [target, setTarget] = useState<string>("EUR");
  const [rates, setRates] = useState<ExchangeRates>(FALLBACK_RATES);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [timeRange, setTimeRange] = useState<string>("1M");
  const [aiInsight, setAiInsight] = useState<MarketInsight | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [isRatesLoading, setIsRatesLoading] = useState<boolean>(true);

  // Fetch real-time rates
  const fetchRates = useCallback(async () => {
    setIsRatesLoading(true);
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${base}`);
      const data = await res.json();
      if (data && data.rates) {
        setRates(data.rates);
      }
    } catch (err) {
      console.error("Rate fetch failed, using fallback", err);
    } finally {
      setIsRatesLoading(false);
    }
  }, [base]);

  // Generate historical data based on range
  const generateHistory = useCallback(() => {
    const currentRate = rates[target] || 1;
    const history: ChartDataPoint[] = [];
    const now = new Date();

    let days = 30;
    if (timeRange === "7D") days = 7;
    else if (timeRange === "3M") days = 90;
    else if (timeRange === "1Y") days = 365;

    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      const volatility = timeRange === "1Y" ? 0.15 : 0.05;
      const fluctuation = (Math.random() - 0.5) * (currentRate * volatility);

      const dateLabel =
        timeRange === "1Y"
          ? date.toLocaleDateString(language === "en" ? "en-US" : language, {
              month: "short",
              year: "2-digit",
            })
          : date.toLocaleDateString(language === "en" ? "en-US" : language, {
              month: "short",
              day: "numeric",
            });

      history.push({
        date: dateLabel,
        rate: currentRate + fluctuation,
      });
    }
    setChartData(history);
  }, [rates, target, timeRange, language]);

  const handleAiAnalysis = async () => {
    setIsAiLoading(true);
    const trendString = chartData
      .slice(-10)
      .map((d) => d.rate.toFixed(4))
      .join(", ");
    const insight = await analyzeMarketTrends(
      base,
      target,
      rates[target],
      `Last points: [${trendString}]. Current range: ${timeRange}`,
      language
    );
    setAiInsight(insight);
    setIsAiLoading(false);
  };

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  useEffect(() => {
    if (Object.keys(rates).length > 0) {
      generateHistory();
    }
  }, [rates, target, generateHistory, timeRange]);

  const currentPairRate = rates[target] || 1;

  const renderContent = () => {
    switch (activeTab) {
      case "markets":
        return <MarketsView rates={rates} base={base} language={language} />;
      case "money-changer":
        return <MoneyChangerView language={language} />;
      case "terms":
        return (
          <TermsView language={language} onBack={() => setActiveTab("home")} />
        );
      case "privacy":
        return (
          <PrivacyView
            language={language}
            onBack={() => setActiveTab("home")}
          />
        );
      case "home":
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-white tracking-tight">
                    {t.converter}
                  </h2>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full uppercase">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    {t.liveUpdates}
                  </div>
                </div>
                <Converter
                  amount={amount}
                  setAmount={setAmount}
                  base={base}
                  setBase={setBase}
                  target={target}
                  setTarget={setTarget}
                  rate={currentPairRate}
                  language={language}
                />
              </section>

              <section className="space-y-4">
                <RateChart
                  data={chartData}
                  base={base}
                  target={target}
                  currentRange={timeRange}
                  onRangeChange={setTimeRange}
                  language={language}
                />
              </section>
            </div>

            <div className="lg:col-span-5 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <MarketInsights
                insight={aiInsight}
                isLoading={isAiLoading}
                onRefresh={handleAiAnalysis}
                language={language}
              />

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6">
                  {t.popularConversions}
                </h3>
                <div className="space-y-4">
                  {["EUR", "GBP", "JPY", "CNY", "AUD"]
                    .filter((c) => c !== base)
                    .slice(0, 5)
                    .map((code) => (
                      <div
                        key={code}
                        className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold border border-slate-700">
                            {code.substring(0, 2)}
                          </div>
                          <span className="font-semibold text-slate-300">
                            {base} / {code}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-white">
                            {(rates[code] || 0).toFixed(4)}
                          </p>
                          <p className="text-[10px] text-emerald-400 font-bold">
                            +0.12%
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-6">
                <h4 className="font-bold text-white mb-2">{t.needHelp}</h4>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  Our AI-driven analytics provide a broad overview of currency
                  trends. For professional investment decisions, please consult
                  with a certified financial advisor.
                </p>
                <button
                  onClick={() => setActiveTab("money-changer")}
                  className="text-xs font-bold text-blue-400 underline underline-offset-4 uppercase tracking-wider"
                >
                  {t.moneyChanger}
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-200 selection:bg-blue-500/30">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
      />

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {renderContent()}
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-8 border-t border-slate-800 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium uppercase tracking-widest">
          <p>© 2026 RateGo Platform</p>
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("privacy")}
              className="hover:text-white transition-colors"
            >
              {t.privacy}
            </button>
            <button
              onClick={() => setActiveTab("terms")}
              className="hover:text-white transition-colors"
            >
              {t.terms}
            </button>
            <a href="#" className="hover:text-white transition-colors">
              {t.apiStatus}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
