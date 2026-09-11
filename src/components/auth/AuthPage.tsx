import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Shield, HeartPulse, Lock, Mail, User as UserIcon, ArrowRight, CheckCircle2, Award, Activity, Sparkles, Sun, Moon } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, loginWithGoogle, register, selectOfficerAsActive, officers, theme, toggleTheme } = useApp();
  const [isRegistering, setIsRegistering] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('army_officer');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle(role);
    } catch (err: any) {
      console.error('Google sign in error:', err);
      if (err.code === 'auth/popup-blocked') {
        setErrorMsg('Sign-in popup was blocked by browser. Please allow popups or open the app in a new tab.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Google sign-in window was closed before completing authentication.');
      } else {
        setErrorMsg(err.message || 'Firebase Google authentication encountered an error. Please try again or use email login.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isRegistering) {
      if (!name.trim()) {
        setErrorMsg('Please enter your full operational name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Please enter a valid official email address.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Security protocol requires a password of at least 6 characters.');
        return;
      }
      register(name, email, password, role);
    } else {
      if (!email.trim()) {
        setErrorMsg('Please provide your registered military or clinical email.');
        return;
      }
      login(email, role);
    }
  };

  const handleDemoArmyLogin = () => {
    // Select first officer (Captain Marcus Vance, High Alert)
    selectOfficerAsActive(officers[0]?.id || 'officer-1');
  };

  const handleDemoHealthcareLogin = () => {
    login('dr.evelyn.reed@aghorveera.med.mil', 'healthcare_officer');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      {/* Theme Toggle in Auth Page */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <button
          onClick={toggleTheme}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition border border-slate-700 font-medium cursor-pointer shadow-md"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme mode"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono text-[11px] font-semibold text-amber-300">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-sky-600" />
              <span className="font-mono text-[11px] font-semibold text-slate-800">Dark Mode</span>
            </>
          )}
        </button>
      </div>

      <div className="w-full max-w-xl">
        {/* Portal Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 border border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/10 mb-4">
            <Shield className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-military font-bold tracking-wider text-slate-100 uppercase">
            Aghorveera Stress Monitoring System
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
            Operational stress assessment, autonomic readiness biometrics, and healthcare medical intervention platform.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
          {/* View Toggle Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-xl mb-6 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(false);
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition ${
                !isRegistering
                  ? 'bg-slate-800 text-slate-100 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In to Account
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegistering(true);
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition ${
                isRegistering
                  ? 'bg-slate-800 text-slate-100 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create New Account
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Captain Marcus Vance"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    isRegistering
                      ? 'officer.name@aghorveera.mil'
                      : 'Enter registered email (or use demo below)'
                  }
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>
            </div>

            {/* Dropdown with two options: Army Officer and Healthcare Officer */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">
                Role Assignment (Select One)
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition cursor-pointer appearance-none"
                >
                  <option value="army_officer">Army Officer</option>
                  <option value="healthcare_officer">Healthcare Officer</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                {role === 'army_officer'
                  ? 'Access personal stress gauges, 10-question daily assessments, trend graphs, and personalized recovery modules.'
                  : 'Access high-level command oversight of all 50 army officers, clinical analysis, and direct messaging.'}
              </p>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-2.5 px-4 rounded-lg shadow-lg shadow-emerald-950 text-sm flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <span>{isRegistering ? 'Complete Registration & Access' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Google Sign-In with Firebase */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-slate-900 px-3 text-slate-500 uppercase tracking-wider font-mono text-[10px]">
                  Or authenticate with
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={isGoogleLoading}
              onClick={handleGoogleSignIn}
              className="w-full bg-slate-950 hover:bg-slate-800/90 text-slate-200 border border-slate-700/80 hover:border-slate-500 font-medium py-2.5 px-4 rounded-lg shadow-sm text-sm flex items-center justify-center space-x-3 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isGoogleLoading ? (
                <span className="flex items-center space-x-2 text-slate-400">
                  <span className="w-4 h-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                  <span>Connecting to Firebase Auth...</span>
                </span>
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span className="font-semibold text-xs tracking-wide">
                    Sign in with Google ({role === 'army_officer' ? 'Army Officer' : 'Healthcare Officer'})
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Section */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Fast Interactive Testing (One-Click)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                Pre-Loaded Data Ready
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleDemoArmyLogin}
                className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-emerald-800/40 hover:border-emerald-500 text-left transition group"
              >
                <div className="flex items-center space-x-2 mb-1">
                  <Shield className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200">Army Officer</span>
                </div>
                <div className="text-[11px] font-medium text-slate-300">
                  Capt. Marcus Vance
                </div>
                <div className="text-[10px] text-rose-400 mt-0.5 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  <span>Stress: 84/100 (High Alert Zone)</span>
                </div>
              </button>

              <button
                type="button"
                onClick={handleDemoHealthcareLogin}
                className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-sky-800/40 hover:border-sky-500 text-left transition group"
              >
                <div className="flex items-center space-x-2 mb-1">
                  <HeartPulse className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200">Healthcare Officer</span>
                </div>
                <div className="text-[11px] font-medium text-slate-300">
                  Dr. Evelyn Reed (CMO)
                </div>
                <div className="text-[10px] text-sky-400 mt-0.5 flex items-center space-x-1">
                  <Activity className="w-3 h-3 text-sky-400" />
                  <span>Command Roster: 50 Officers</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Security & System Protocols Footer */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Firebase Auth & Firestore Connected</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Gemini Clinical AI Advisor</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>PSS-10 & COSC Validated</span>
          </div>
        </div>
      </div>
    </div>
  );
};
