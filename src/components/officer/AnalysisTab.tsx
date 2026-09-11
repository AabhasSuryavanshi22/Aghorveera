import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CategoryBarChart, StressDonutChart } from '../common/StressCharts';
import { Activity, BarChart3, PieChart as PieIcon, Shield, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight, X } from 'lucide-react';

export const AnalysisTab: React.FC = () => {
  const { currentOfficer, setActiveTab, latestSubmission, clearLatestSubmission } = useApp();

  if (!currentOfficer) return null;

  const score = currentOfficer.currentStressScore;
  const isHigh = score >= 70;
  const isMed = score >= 36 && score < 70;

  // Find dominant stress factor
  const sortedCategories = [...currentOfficer.categoryBreakdown].sort((a, b) => b.score - a.score);
  const primaryFactor = sortedCategories[0];
  const secondaryFactor = sortedCategories[1];

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Real-time Assessment Submission & Results Banner */}
      {latestSubmission && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/95 dark:bg-gradient-to-r dark:from-emerald-950/90 dark:via-slate-900 dark:to-slate-950 border-2 border-emerald-500/80 shadow-2xl shadow-emerald-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start sm:items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] uppercase font-mono text-emerald-400 font-bold tracking-wider">
                  Assessment Results Logged & Calibrated
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-military uppercase bg-emerald-950 text-emerald-300 border border-emerald-700">
                  Live
                </span>
              </div>
              <div className="text-base sm:text-lg font-military font-bold text-slate-100 mt-0.5">
                New Calibrated Score: <span className="text-emerald-400 font-extrabold">{latestSubmission.score}/100</span> ({latestSubmission.zone.toUpperCase()} ZONE)
              </div>
              <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>Primary Stress Driver: <strong className="text-amber-300">{latestSubmission.primaryStressDriver}</strong></span>
                {latestSubmission.sleepHoursReported !== undefined && (
                  <span>🌙 Sleep Logged: <strong className="text-indigo-300">{latestSubmission.sleepHoursReported}h</strong></span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
            <button
              type="button"
              onClick={() => {
                setActiveTab('hero');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer border border-slate-700"
            >
              <span>Back to Home Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={clearLatestSubmission}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs transition cursor-pointer"
              title="Dismiss notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab Header & Score Summary */}
      <div className="bg-white dark:bg-slate-900/90 border-2 border-slate-300 dark:border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold mb-1">
              <BarChart3 className="w-4 h-4" />
              <span>TAB 3: MULTI-DIMENSIONAL STRESS ANALYSIS</span>
            </div>
            <h2 className="text-2xl font-military font-bold text-slate-950 dark:text-slate-100">
              Psychological & Biometric Stress Diagnostics
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Deconstructed breakdown of current stress score across operational workload, autonomic tension, cognitive fatigue, and environmental variables.
            </p>
          </div>

          {/* Quick Score Highlight Card */}
          <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border-2 border-slate-200 dark:border-slate-800 shrink-0 shadow-sm">
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 block font-semibold">
                Overall Index
              </span>
              <span className="text-3xl font-military font-bold text-slate-950 dark:text-slate-100">
                {score}
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-normal"> / 100</span>
              </span>
              <span
                className={`text-[10px] block font-bold uppercase tracking-wider ${
                  isHigh ? 'text-rose-600 dark:text-rose-400' : isMed ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {currentOfficer.zone.toUpperCase()} ALERT ZONE
              </span>
            </div>
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 font-military font-bold text-lg ${
                isHigh
                  ? 'bg-rose-100 border-rose-300 text-rose-700 dark:bg-rose-950/60 dark:border-rose-700/60 dark:text-rose-400 shadow-md'
                  : isMed
                  ? 'bg-amber-100 border-amber-300 text-amber-700 dark:bg-amber-950/60 dark:border-amber-700/60 dark:text-amber-400 shadow-md'
                  : 'bg-emerald-100 border-emerald-300 text-emerald-700 dark:bg-emerald-950/60 dark:border-emerald-700/60 dark:text-emerald-400 shadow-md'
              }`}
            >
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Primary Driver Banner */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border-2 border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 block mb-1 font-semibold">
              Primary Stress Driver
            </span>
            <span className="text-rose-700 dark:text-rose-300 font-bold font-military text-sm block">
              {primaryFactor.label} ({primaryFactor.score}/100)
            </span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
              {primaryFactor.description}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border-2 border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 block mb-1 font-semibold">
              Secondary Contributing Factor
            </span>
            <span className="text-amber-700 dark:text-amber-300 font-bold font-military text-sm block">
              {secondaryFactor.label} ({secondaryFactor.score}/100)
            </span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
              {secondaryFactor.description}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border-2 border-slate-200 dark:border-slate-800 sm:col-span-2 lg:col-span-1 flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 block mb-1 font-semibold">
                Clinical Intervention Status
              </span>
              <span className="text-slate-900 dark:text-slate-200 font-bold text-xs block">
                {isHigh ? 'Active Clinical Intervention Required' : isMed ? 'Tactical Decompression Prescribed' : 'Homeostasis Maintained'}
              </span>
            </div>
            <button
              onClick={() => setActiveTab('solutions')}
              className="mt-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center space-x-1 cursor-pointer"
            >
              <span>View Targeted Solutions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* CHARTS CONTAINER: Bar Graph & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* BAR GRAPH: Categories of Stress */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 border-2 border-slate-300 dark:border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 font-military">
                  Stress Breakdown by Domain (Bar Graph)
                </h3>
                <span className="text-[11px] text-slate-600 dark:text-slate-400">
                  Individual scoring for each operational and physiological pillar
                </span>
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-mono font-bold border border-slate-200 dark:border-slate-700">
              0-100 Metric
            </span>
          </div>

          <CategoryBarChart categories={currentOfficer.categoryBreakdown} />

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-500 font-mono">
            <span>Dashed mark: 35 (Low threshold)</span>
            <span>Dashed mark: 70 (High Alert threshold)</span>
          </div>
        </div>

        {/* PIE / DONUT CHART: Proportional Distribution */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/90 border-2 border-slate-300 dark:border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <PieIcon className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 font-military">
                  Stress Distribution (Pie Chart)
                </h3>
                <span className="text-[11px] text-slate-600 dark:text-slate-400">
                  Proportionate share of stressors & alert zones
                </span>
              </div>
            </div>
          </div>

          <StressDonutChart
            categories={currentOfficer.categoryBreakdown}
            monthlyData={currentOfficer.monthlyHistory}
          />
        </div>
      </div>

      {/* Clinical Factor Insight Matrix */}
      <div className="bg-white dark:bg-slate-900/90 border-2 border-slate-300 dark:border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur">
        <h3 className="text-base font-bold font-military text-slate-950 dark:text-slate-100 mb-4 flex items-center space-x-2">
          <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Combat Operational Stress Risk Matrix</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border-2 border-slate-200 dark:border-slate-800/90 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-950 dark:text-slate-200 text-sm">Operational Reserve</span>
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
                score < 60 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800' : 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800'
              }`}>
                {score < 60 ? 'BALANCED' : 'ELEVATED STRAIN'}
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-400 leading-relaxed text-xs">
              Current stress score sits at {score}/100. {score >= 60 ? 'Compensatory neuroendocrine effort detected. Targeted tactical decompression session recommended.' : 'Adequate physiological buffer preserved under present operational tempo.'}
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border-2 border-slate-200 dark:border-slate-800/90 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-950 dark:text-slate-200 text-sm">Weekly Sleep Average</span>
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
                currentOfficer.sleepHoursAvg >= 7 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800' : 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800'
              }`}>
                {currentOfficer.sleepHoursAvg >= 7 ? 'OPTIMAL (7+ hrs)' : 'DEFICIT (< 7 hrs)'}
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-400 leading-relaxed text-xs">
              Calculated 7-day average of {currentOfficer.sleepHoursAvg} hrs/night. Tracked continuously from the daily operational stress assessment sleep hours item.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border-2 border-slate-200 dark:border-slate-800/90 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-950 dark:text-slate-200 text-sm">Operational Readiness</span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-300 dark:bg-sky-950 dark:text-sky-400 dark:border-sky-800">
                CLASS {isHigh ? 'III (RESTRICTED)' : isMed ? 'II (MONITORED)' : 'I (DEPLOYABLE)'}
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-400 leading-relaxed text-xs">
              Medical classification indicates duty clearance status. All high alert personnel receive real-time observation by the Battalion Healthcare Officer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
