
import React from 'react';
import { Language, translations } from '../i18n';

interface TermsViewProps {
  language: Language;
  onBack: () => void;
}

const TermsView: React.FC<TermsViewProps> = ({ language, onBack }) => {
  const t = translations[language];

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {t.converter}
      </button>

      <div className="prose prose-invert max-w-none">
        <h1 className="text-3xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Terms of Service</h1>
        
        <p className="text-slate-300 leading-relaxed mb-6">
          Welcome to <span className="text-blue-400 font-bold">RateGo</span>.
        </p>
        
        <p className="text-slate-300 leading-relaxed mb-8">
          RateGo is a personal freelance project created to display real-time currency exchange rates for informational purposes only. By using this website, you agree to the following terms.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">1. Informational Use Only</h2>
          <ul className="list-disc pl-5 text-slate-400 space-y-2">
            <li>All currency rates shown on RateGo are for reference purposes only.</li>
            <li>They should not be considered financial, investment, or trading advice.</li>
            <li>Exchange rates may be delayed, inaccurate, or change at any time.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">2. No Financial Responsibility</h2>
          <p className="text-slate-400 mb-4">RateGo is not responsible for:</p>
          <ul className="list-disc pl-5 text-slate-400 space-y-2">
            <li>Financial losses</li>
            <li>Trading decisions</li>
            <li>Currency exchange outcomes</li>
            <li>Any actions taken based on the displayed rates</li>
          </ul>
          <p className="mt-4 text-slate-300 italic font-medium">You use the information at your own risk.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">3. Third-Party Data Sources</h2>
          <ul className="list-disc pl-5 text-slate-400 space-y-2">
            <li>Currency data may come from third-party APIs.</li>
            <li>RateGo does not control or guarantee the accuracy or availability of these services.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">4. Availability</h2>
          <ul className="list-disc pl-5 text-slate-400 space-y-2">
            <li>This website is provided “as is” and “as available”.</li>
            <li>There is no guarantee of uptime, accuracy, or uninterrupted access.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">5. Changes to This Service</h2>
          <p className="text-slate-400">The features, data sources, or availability of RateGo may change at any time without notice.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">6. Contact</h2>
          <p className="text-slate-400">
            If you have questions about these terms, you may contact the developer via GitHub.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsView;
