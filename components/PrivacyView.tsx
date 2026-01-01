
import React from 'react';
import { Language, translations } from '../i18n';

interface PrivacyViewProps {
  language: Language;
  onBack: () => void;
}

const PrivacyView: React.FC<PrivacyViewProps> = ({ language, onBack }) => {
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
        <h1 className="text-3xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Privacy Policy</h1>
        
        <p className="text-slate-300 leading-relaxed mb-8">
          RateGo respects your privacy. This is a personal freelance project, not a commercial platform.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">1. Information We Do NOT Collect</h2>
          <p className="text-slate-400 mb-4">RateGo does not collect:</p>
          <ul className="list-disc pl-5 text-slate-400 space-y-2">
            <li>Names</li>
            <li>Email addresses</li>
            <li>Phone numbers</li>
            <li>Login credentials</li>
            <li>Payment information</li>
          </ul>
          <p className="mt-4 text-slate-300 font-medium italic">No account or registration is required.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">2. Automatically Collected Data</h2>
          <p className="text-slate-400 mb-4">Like most websites, basic technical data may be collected automatically, such as:</p>
          <ul className="list-disc pl-5 text-slate-400 space-y-2">
            <li>Browser type</li>
            <li>Device type</li>
            <li>IP address (used only for basic analytics or security)</li>
            <li>Page visit statistics</li>
          </ul>
          <p className="mt-4 text-slate-300">This data is anonymous and used only to understand general usage.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">3. Cookies</h2>
          <ul className="list-disc pl-5 text-slate-400 space-y-2">
            <li>RateGo does not use cookies for tracking, advertising, or profiling users.</li>
            <li>If analytics tools are used in the future, they will be limited to basic traffic analysis only.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">4. Third-Party Services</h2>
          <ul className="list-disc pl-5 text-slate-400 space-y-2">
            <li>RateGo may use third-party APIs to fetch currency rates.</li>
            <li>These services may collect data according to their own privacy policies.</li>
            <li>RateGo is not responsible for how third-party services handle data.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">5. Data Security</h2>
          <p className="text-slate-400">No personal data is stored or processed by RateGo.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">6. Changes to This Policy</h2>
          <p className="text-slate-400">This privacy policy may be updated occasionally. Any changes will be reflected on this page.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">7. Contact</h2>
          <p className="text-slate-400">
            For privacy-related questions, please contact the developer via GitHub.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyView;
