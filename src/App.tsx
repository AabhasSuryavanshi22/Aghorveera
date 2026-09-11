import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { AuthPage } from './components/auth/AuthPage';
import { OfficerDashboard } from './components/officer/OfficerDashboard';
import { HealthcareDashboard } from './components/healthcare/HealthcareDashboard';

const MainContent: React.FC = () => {
  const { currentUser, theme } = useApp();

  if (!currentUser) {
    return <AuthPage />;
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-[#0c121e] text-slate-100'
    }`}>
      <Header />
      <div className="flex-1">
        {currentUser.role === 'army_officer' ? (
          <OfficerDashboard />
        ) : (
          <HealthcareDashboard />
        )}
      </div>
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500 font-mono transition-colors">
        Aghorveera Military Stress Monitoring & Clinical Healthcare System • PSS-10 & DOD FM 4-02.51 Compliant
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
