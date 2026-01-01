import React, { useState } from "react";
import { Language, translations } from "../i18n";
import logo from "../images/logo.png";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
}) => {
  const t = translations[language];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const langs: { code: Language; label: string; flag: string }[] = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "zh", label: "中文", flag: "🇨🇳" },
    { code: "ja", label: "日本語", flag: "🇯🇵" },
    { code: "id", label: "Indonesia", flag: "🇮🇩" },
    { code: "ms", label: "Malaysia", flag: "🇲🇾" },
    { code: "th", label: "ไทย", flag: "🇹🇭" },
    { code: "ko", label: "한국어", flag: "🇰🇷" },
    { code: "ar", label: "العربية", flag: "🇸🇦" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
    { code: "es", label: "Español", flag: "🇪🇸" },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => {
            setActiveTab("home");
            setIsMobileMenuOpen(false);
          }}
        >
          <img src={logo} alt="RateGo logo" className="w-auto h-8 rounded-lg" />
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveTab("markets")}
            className={`transition-colors hover:text-white ${
              activeTab === "markets"
                ? "text-white underline underline-offset-8 decoration-blue-500 decoration-2"
                : ""
            }`}
          >
            {t.markets}
          </button>
          <button
            onClick={() => setActiveTab("money-changer")}
            className={`transition-colors hover:text-white ${
              activeTab === "money-changer"
                ? "text-white underline underline-offset-8 decoration-blue-500 decoration-2"
                : ""
            }`}
          >
            {t.moneyChanger}
          </button>
          <div className="h-4 w-px bg-slate-800" />

          <div className="relative group">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-slate-800 border border-slate-700 rounded-full px-4 py-1.5 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8 cursor-pointer"
            >
              {langs.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("home")}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-all border border-slate-700"
          >
            {t.converter}
          </button>
        </nav>

        {/* Mobile Mini Nav */}
        <div className="md:hidden flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-transparent text-xs font-bold text-slate-400 focus:outline-none max-w-[140px] ml-auto"
            aria-label="Language"
          >
            {langs.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.code.toUpperCase()}
              </option>
            ))}
          </select>
          <button
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="p-2 rounded-lg border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 7h16M4 12h16M4 17h16"
              />
            </svg>
          </button>
        </div>
      </div>
      <div
        className={`md:hidden border-t border-slate-800 bg-slate-900/80 ${
          isMobileMenuOpen ? "block" : "hidden"
        }`}
      >
        <div className="px-4 py-3 flex flex-col gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
          <button
            onClick={() => {
              setActiveTab("markets");
              setIsMobileMenuOpen(false);
            }}
            className={`text-left py-2 ${
              activeTab === "markets" ? "text-white" : "text-slate-400"
            }`}
          >
            {t.markets}
          </button>
          <button
            onClick={() => {
              setActiveTab("money-changer");
              setIsMobileMenuOpen(false);
            }}
            className={`text-left py-2 ${
              activeTab === "money-changer" ? "text-white" : "text-slate-400"
            }`}
          >
            {t.findNearby}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
