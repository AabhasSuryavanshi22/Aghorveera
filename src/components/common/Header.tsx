import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, HeartPulse, Bell, LogOut, User, Activity, AlertTriangle, ArrowLeftRight, Sun, Moon } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentUser, currentOfficer, logout, activeTab, setActiveTab, login, theme, toggleTheme } = useApp();

  if (!currentUser) return null;

  const isArmy = currentUser.role === 'army_officer';
  const unreadMessagesCount = currentOfficer?.messages.filter((m) => !m.read).length || 0;

  return (
    <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/20">
              {isArmy ? <Shield className="w-5 h-5 text-emerald-400" /> : <HeartPulse className="w-5 h-5 text-sky-400" />}
            </div>
            <div>
              <span className="font-military font-bold text-lg tracking-wider text-slate-100">
                AGHORVEERA
              </span>
              <p className="text-xs text-slate-400">
                {isArmy ? 'Tactical Stress & Readiness Portal' : 'Battalion Stress & Clinical Oversight System'}
              </p>
            </div>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition border border-slate-700 font-medium cursor-pointer shadow-sm"
              title={theme === 'dark' ? 'Switch to Light Mode (Day Operations)' : 'Switch to Dark Mode (Night Operations)'}
              aria-label="Toggle dark and light mode"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-mono text-[11px] font-semibold text-amber-300">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-sky-600" />
                  <span className="font-mono text-[11px] font-semibold text-slate-800">Dark</span>
                </>
              )}
            </button>

            {/* Quick Role Toggle to inspect both sides of the website interface */}
            <button
              onClick={() => {
                if (isArmy) {
                  login('dr.reed@aghorveera.med.mil', 'healthcare_officer');
                } else {
                  login('marcus.vance@military.mil', 'army_officer');
                }
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs transition border border-emerald-500/30 shadow-sm font-medium"
              title={isArmy ? 'Switch to Medical Officer Console' : 'Switch to Army Officer Dashboard'}
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono">
                {isArmy ? 'Medical Console' : 'Officer Dashboard'}
              </span>
            </button>

            {isArmy && currentOfficer && (
              <div className="hidden md:flex items-center space-x-3 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-200">
                    {currentOfficer.rank} {currentOfficer.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {currentOfficer.serviceNumber}
                  </div>
                </div>
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    currentOfficer.zone === 'high'
                      ? 'bg-rose-500 animate-pulse'
                      : currentOfficer.zone === 'medium'
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                  }`}
                  title={`Current Status: ${currentOfficer.zone.toUpperCase()} ZONE`}
                />
              </div>
            )}

            {!isArmy && (
              <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-sky-950/40 border border-sky-800/50 text-sky-300 text-xs">
                <HeartPulse className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-medium">{currentUser.name}</span>
                <span className="text-sky-500 text-[11px]">(Medical Staff)</span>
              </div>
            )}

            {/* Unread alerts button for army officer */}
            {isArmy && currentOfficer && (
              <button
                onClick={() => setActiveTab('solutions')}
                className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
                title="Medical Advice & Directives"
              >
                <Bell className="w-4 h-4" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>
            )}

            {/* Sign Out / Switch Accounts */}
            <button
              onClick={logout}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950/40 hover:text-rose-300 text-slate-400 text-xs transition border border-slate-700 hover:border-rose-800/50"
              title="Sign In / Switch Accounts"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign In / Switch</span>
            </button>
          </div>
        </div>

        {/* Army Officer Tab Navigation Bar */}
        {isArmy && (
          <div className="flex border-t border-slate-800 overflow-x-auto scrollbar-none py-1 gap-1">
            <button
              onClick={() => setActiveTab('hero')}
              className={`px-4 py-2.5 text-xs font-semibold rounded-md transition flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'hero'
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>1. Home / Readiness Score & Trends</span>
            </button>

            <button
              onClick={() => setActiveTab('assessment')}
              className={`px-4 py-2.5 text-xs font-semibold rounded-md transition flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'assessment'
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>2. Daily Stress Assessment</span>
            </button>

            <button
              onClick={() => setActiveTab('analysis')}
              className={`px-4 py-2.5 text-xs font-semibold rounded-md transition flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'analysis'
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>3. Analysis (Bar & Pie Charts)</span>
            </button>

            <button
              onClick={() => setActiveTab('solutions')}
              className={`px-4 py-2.5 text-xs font-semibold rounded-md transition flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'solutions'
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <HeartPulse className="w-4 h-4" />
              <span>4. Solutions & Personalized Resources</span>
              {unreadMessagesCount > 0 && (
                <span className="ml-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
