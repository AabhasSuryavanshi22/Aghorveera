import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WeeklyStressChart, MonthlyStressChart } from '../common/StressCharts';
import { Shield, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Moon, Activity, Calendar, ArrowRight, Zap, Bell, Sparkles, X } from 'lucide-react';

export const HeroTab: React.FC = () => {
  const { currentOfficer, setActiveTab, latestSubmission, clearLatestSubmission } = useApp();
  const [graphMode, setGraphMode] = useState<'both' | 'week' | 'month'>('both');
  const [showSleepBreakdown, setShowSleepBreakdown] = useState(false);

  if (!currentOfficer) return null;

  const score = currentOfficer.currentStressScore;
  const isHigh = score >= 70;
  const isMedium = score >= 36 && score < 70;
  const isLow = score < 36;

  // Zone classifications
  const zoneConfig = isHigh
    ? {
        label: 'HIGH ALERT ZONE',
        subLabel: 'Critical Autonomic Stress & Overload Risk',
        color: 'text-rose-400',
        badgeBg: 'bg-rose-950/80 border-rose-700/80 text-rose-300',
        meterColor: '#ef4444',
        shadow: 'shadow-rose-500/20',
        description:
          'Autonomic strain is exceeding operational safety thresholds. High risk of cognitive tunnel vision, slow reaction time, and somatic exhaustion. Medical consultation and immediate parasympathetic decompression are required.',
      }
    : isMedium
    ? {
        label: 'MEDIUM STRESS ZONE',
        subLabel: 'Elevated Operational Fatigue & Strain',
        color: 'text-amber-400',
        badgeBg: 'bg-amber-950/80 border-amber-700/80 text-amber-300',
        meterColor: '#f59e0b',
        shadow: 'shadow-amber-500/20',
        description:
          'Physiological tension and cognitive workload are elevated. The nervous system is mounting compensatory effort. Tactical breathing, sleep protection, and task pacing recommended before escalation.',
      }
    : {
        label: 'LOW STRESS ZONE',
        subLabel: 'Optimal Operational Readiness',
        color: 'text-emerald-400',
        badgeBg: 'bg-emerald-950/80 border-emerald-700/80 text-emerald-300',
        meterColor: '#10b981',
        shadow: 'shadow-emerald-500/20',
        description:
          'Circadian recovery and cognitive clarity are within peak combat readiness parameters. Good emotional stability, alert response times, and high capacity for tactical decision-making.',
      };

  // 7-day trend delta
  const weekly = currentOfficer.weeklyHistory || [];
  const prevScore = weekly.length >= 2 ? weekly[weekly.length - 2].score : score;
  const delta = score - prevScore;

  // Calculate 7-day average sleep hours from weekly history
  const weeklySleepPoints = weekly.filter((d) => typeof d.sleepHours === 'number');
  const weeklySleepSum = weeklySleepPoints.reduce((acc, d) => acc + (d.sleepHours || 0), 0);
  const calculatedWeeklySleepAvg =
    weeklySleepPoints.length > 0
      ? Number((weeklySleepSum / weeklySleepPoints.length).toFixed(1))
      : currentOfficer.sleepHoursAvg;

  // Healthcare messages
  const unreadMessages = currentOfficer.messages.filter((m) => !m.acknowledged);

  return (
    <div className="space-y-6 pb-12">
      {/* Real-time Assessment Submission & Calibration Result Banner */}
      {latestSubmission && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/95 dark:bg-gradient-to-r dark:from-emerald-950/90 dark:via-slate-900 dark:to-slate-950 border-2 border-emerald-500/80 shadow-2xl shadow-emerald-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start sm:items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] uppercase font-mono text-emerald-400 font-bold tracking-wider">
                  Daily Assessment Calibrated & Logged Successfully
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-military uppercase bg-emerald-950 text-emerald-300 border border-emerald-700">
                  Live Update
                </span>
              </div>
              <div className="text-base sm:text-lg font-military font-bold text-slate-100 mt-0.5">
                New Calibrated Stress Level: <span className="text-emerald-400 font-extrabold">{latestSubmission.score}/100</span> ({latestSubmission.zone.toUpperCase()} ZONE)
              </div>
              <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>Primary Stress Driver: <strong className="text-amber-300">{latestSubmission.primaryStressDriver}</strong></span>
                {latestSubmission.sleepHoursReported !== undefined && (
                  <span>🌙 Sleep Logged: <strong className="text-indigo-300">{latestSubmission.sleepHoursReported}h</strong> (7-Day Avg Updated)</span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-3xl">
                {latestSubmission.clinicalSummary}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
            <button
              type="button"
              onClick={() => {
                setActiveTab('analysis');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-md shadow-emerald-950"
            >
              <span>View Analysis Charts</span>
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

      {/* Critical Medical Directive Banner if unread message from Healthcare Officer */}
      {unreadMessages.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 dark:bg-slate-900/95 dark:bg-gradient-to-r dark:from-rose-950/90 dark:via-slate-900 dark:to-amber-950/90 border-2 border-rose-400 dark:border-rose-600/60 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-rose-200 text-rose-800 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30 shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-900 dark:text-rose-300 font-military">
                  Medical Directive Received from Healthcare Officer
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-600 text-white font-bold shadow-xs">
                  {unreadMessages[0].priority.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-300 mt-1">
                <strong className="text-slate-950 dark:text-white">{unreadMessages[0].senderName}:</strong> "{unreadMessages[0].subject}"
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('solutions')}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 dark:hover:bg-rose-500 text-white text-xs font-bold flex items-center space-x-1.5 transition whitespace-nowrap cursor-pointer shadow-md shadow-rose-900/20 shrink-0"
          >
            <span>Review Medical Directive</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* HERO SECTION: Current Stress Level & Zone Classification */}
      <div className="bg-white dark:bg-slate-900/90 border-2 border-slate-300 dark:border-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl backdrop-blur relative overflow-hidden">
        {/* Background ambient glow according to stress zone */}
        <div
          className={`absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none ${
            isHigh ? 'bg-rose-500' : isMedium ? 'bg-amber-500' : 'bg-emerald-500'
          }`}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Interactive Score Dial & Zone Meter */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border-2 border-slate-200 dark:border-slate-800/80 relative shadow-sm">
            <div className="text-[11px] font-mono uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-2 font-bold">
              Continuous Biometric Stress Index
            </div>

            {/* Circular SVG Gauge (0 - 100) */}
            <div className="relative w-52 h-52 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Background track */}
                <circle
                  cx="80"
                  cy="80"
                  r="64"
                  stroke="#cbd5e1"
                  className="dark:stroke-slate-800"
                  strokeWidth="12"
                  fill="transparent"
                />

                {/* Meter Zones Underlay (Color ring) */}
                {/* Green zone (0 - 35%) */}
                <circle
                  cx="80"
                  cy="80"
                  r="64"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeDasharray="402"
                  strokeDashoffset={402 * (1 - 0.35)}
                  strokeOpacity="0.3"
                  fill="transparent"
                />

                {/* Progress Value Stroke */}
                <circle
                  cx="80"
                  cy="80"
                  r="64"
                  stroke={zoneConfig.meterColor}
                  strokeWidth="12"
                  strokeDasharray="402"
                  strokeDashoffset={402 * (1 - score / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Center Value */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl sm:text-5xl font-military font-bold tracking-tight text-slate-950 dark:text-slate-100">
                  {score}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                  / 100 SCALE
                </span>
                <div className="mt-1 flex items-center space-x-1 text-xs">
                  {delta > 0 ? (
                    <span className="text-rose-600 dark:text-rose-400 flex items-center font-mono font-bold">
                      <TrendingUp className="w-3 h-3 mr-0.5" />+{delta} pts
                    </span>
                  ) : delta < 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center font-mono font-bold">
                      <TrendingDown className="w-3 h-3 mr-0.5" />{delta} pts
                    </span>
                  ) : (
                    <span className="text-slate-600 dark:text-slate-400 font-mono font-semibold">Stable</span>
                  )}
                  <span className="text-[10px] text-slate-500 dark:text-slate-500">vs yesterday</span>
                </div>
              </div>
            </div>

            {/* Zone Pill Indicator */}
            <div className={`mt-3 px-3.5 py-1.5 rounded-full border-2 text-xs font-bold tracking-wide flex items-center space-x-2 shadow-xs ${zoneConfig.badgeBg}`}>
              <span
                className="w-2.5 h-2.5 rounded-full animate-ping"
                style={{ backgroundColor: zoneConfig.meterColor }}
              />
              <span>{zoneConfig.label}</span>
            </div>

            {/* Scale Ranges Guide */}
            <div className="mt-4 w-full grid grid-cols-3 gap-1.5 text-[10px] font-mono text-center pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-slate-900/60 border border-emerald-300 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400 font-bold">
                LOW: 0-35
              </div>
              <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-slate-900/60 border border-amber-300 dark:border-amber-900/30 text-amber-800 dark:text-amber-400 font-bold">
                MED: 36-69
              </div>
              <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-slate-900/60 border border-rose-300 dark:border-rose-900/30 text-rose-800 dark:text-rose-400 font-bold">
                ALERT: 70-100
              </div>
            </div>
          </div>

          {/* Right: Officer Profile, Zone Details & Operational Vitals */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                  {currentOfficer.serviceNumber}
                </span>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                  {currentOfficer.unit}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/40">
                  Status: {currentOfficer.status}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-slate-100 font-military">
                {currentOfficer.rank} {currentOfficer.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                {zoneConfig.description}
              </p>
            </div>

            {/* Physiological & Operational Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-2">
              {/* Card 1: 7-Day Sleep Average (Dynamically Calculated) */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border-2 border-slate-200 dark:border-slate-800 relative group shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-bold text-slate-900 dark:text-slate-300">7-Day Sleep Avg</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSleepBreakdown(!showSleepBreakdown)}
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline font-mono font-semibold cursor-pointer"
                  >
                    {showSleepBreakdown ? 'Hide 7-Day' : 'View 7-Day'}
                  </button>
                </div>
                <div className="text-2xl font-bold font-mono text-slate-950 dark:text-slate-100 flex items-baseline space-x-1">
                  <span>{calculatedWeeklySleepAvg}</span>
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400">hrs / night</span>
                </div>
                <div className="text-[11px] mt-1.5 flex items-center justify-between">
                  <span className={calculatedWeeklySleepAvg < 6 ? 'text-amber-700 dark:text-amber-400 font-bold' : 'text-emerald-700 dark:text-emerald-400 font-bold'}>
                    {calculatedWeeklySleepAvg < 6 ? '⚠️ Sleep debt detected' : '✓ Restorative recovery'}
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">
                    7d Total: {weeklySleepSum.toFixed(1)}h
                  </span>
                </div>
              </div>

              {/* Card 2: Cognitive Alert Status */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border-2 border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center space-x-1.5 text-xs text-slate-600 dark:text-slate-400 mb-1.5">
                  <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="font-bold text-slate-900 dark:text-slate-300">Cognitive Alert</span>
                </div>
                <div className="text-2xl font-bold font-mono text-slate-950 dark:text-slate-100">
                  {score >= 70 ? (
                    <span className="text-rose-600 dark:text-rose-400 font-extrabold">Fatigued</span>
                  ) : calculatedWeeklySleepAvg < 6 ? (
                    <span className="text-amber-600 dark:text-amber-400 font-extrabold">Sleep-Debted</span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">High Alert</span>
                  )}
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 font-medium">
                  {score >= 70 ? 'Reaction latency elevated' : calculatedWeeklySleepAvg >= 7 ? 'Peak tactical readiness' : 'Standard focus buffer'}
                </div>
              </div>

              {/* Card 3: Combat Readiness Index */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border-2 border-slate-200 dark:border-slate-800 col-span-2 sm:col-span-1 shadow-sm">
                <div className="flex items-center space-x-1.5 text-xs text-slate-600 dark:text-slate-400 mb-1.5">
                  <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-slate-900 dark:text-slate-300">Readiness Index</span>
                </div>
                <div className="text-2xl font-bold font-mono text-slate-950 dark:text-slate-100">
                  {Math.max(15, Math.min(99, Math.round((100 - score) * 0.7 + (calculatedWeeklySleepAvg / 8) * 30)))}%
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 font-medium">
                  Composite stress & sleep factor
                </div>
              </div>
            </div>

            {/* Weekly Sleep Calculation Breakdown Banner (Expandable or Persistent) */}
            {showSleepBreakdown && (
              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border-2 border-indigo-200 dark:border-indigo-500/30 text-xs space-y-2.5 animate-in fade-in duration-200 shadow-sm">
                <div className="flex items-center justify-between text-indigo-950 dark:text-indigo-200 font-bold">
                  <span className="flex items-center space-x-2">
                    <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Weekly Sleep Log & 7-Day Calculated Average Formula</span>
                  </span>
                  <span className="font-mono text-xs text-indigo-700 dark:text-indigo-300 font-bold">
                    Mean: {calculatedWeeklySleepAvg} hrs/night
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-1.5 text-center pt-1">
                  {weekly.map((d, i) => (
                    <div
                      key={d.date || i}
                      className="p-2 rounded-lg bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 flex flex-col items-center shadow-xs"
                    >
                      <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 font-semibold uppercase">{d.dayLabel}</span>
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-200 mt-0.5">
                        {d.sleepHours ?? 6.5}h
                      </span>
                    </div>
                  ))}
                </div>

                <div className="text-[11px] text-indigo-900 dark:text-indigo-300/80 font-mono pt-1 flex items-center justify-between">
                  <span>
                    Formula: ({weekly.map((d) => `${d.sleepHours ?? 6.5}`).join(' + ')}) ÷ {weekly.length} = <strong className="text-slate-950 dark:text-white font-extrabold">{calculatedWeeklySleepAvg} hrs</strong>
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden md:inline">
                    Updated each time assessment Question 11 is answered
                  </span>
                </div>
              </div>
            )}

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setActiveTab('assessment')}
                className="flex-1 min-w-[200px] px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/20 cursor-pointer"
              >
                <Shield className="w-4 h-4" />
                <span>Take Daily Stress Assessment</span>
              </button>
              <button
                onClick={() => setActiveTab('solutions')}
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-200 text-xs font-bold border-2 border-slate-300 dark:border-slate-700 transition flex items-center space-x-2 cursor-pointer shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Open Solutions & Interventions</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* GRAPHS SECTION: Stress of Whole Week and Whole Month */}
      <div className="bg-white dark:bg-slate-900/90 border-2 border-slate-300 dark:border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-950 dark:text-slate-100 font-military flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Stress Longitudinal Trajectory Analysis</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Continuous monitoring showing stress progression across the whole week (7 days) and whole month (30 days).
            </p>
          </div>

          {/* Graph View Selector */}
          <div className="flex items-center space-x-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-300 dark:border-slate-800 text-xs">
            <button
              onClick={() => setGraphMode('both')}
              className={`px-3 py-1.5 rounded-lg transition font-medium cursor-pointer ${
                graphMode === 'both'
                  ? 'bg-emerald-600 text-white dark:bg-slate-800 dark:text-emerald-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200'
              }`}
            >
              Side-by-Side (Both)
            </button>
            <button
              onClick={() => setGraphMode('week')}
              className={`px-3 py-1.5 rounded-lg transition font-medium cursor-pointer ${
                graphMode === 'week'
                  ? 'bg-emerald-600 text-white dark:bg-slate-800 dark:text-emerald-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200'
              }`}
            >
              Whole Week (7 Days)
            </button>
            <button
              onClick={() => setGraphMode('month')}
              className={`px-3 py-1.5 rounded-lg transition font-medium cursor-pointer ${
                graphMode === 'month'
                  ? 'bg-emerald-600 text-white dark:bg-slate-800 dark:text-emerald-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200'
              }`}
            >
              Whole Month (30 Days)
            </button>
          </div>
        </div>

        {/* Display Graphs according to selected mode */}
        {graphMode === 'both' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Week Graph */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border-2 border-slate-200 dark:border-slate-800/80 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-300 flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  <span>Whole Week Trend (Past 7 Days)</span>
                </span>
                <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400">
                  Daily PSS / Biometric Readings
                </span>
              </div>
              <WeeklyStressChart data={currentOfficer.weeklyHistory} />
            </div>

            {/* Month Graph */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border-2 border-slate-200 dark:border-slate-800/80 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-300 flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span>Whole Month Trend (Past 30 Days)</span>
                </span>
                <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400">
                  Long-Term Operational Stress Curve
                </span>
              </div>
              <MonthlyStressChart data={currentOfficer.monthlyHistory} />
            </div>
          </div>
        )}

        {graphMode === 'week' && (
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border-2 border-slate-200 dark:border-slate-800/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-300 flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span>Whole Week Detailed Stress Readings (7-Day Span)</span>
              </span>
              <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                Hover over data nodes to inspect daily operational events
              </span>
            </div>
            <WeeklyStressChart data={currentOfficer.weeklyHistory} />
          </div>
        )}

        {graphMode === 'month' && (
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border-2 border-slate-200 dark:border-slate-800/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-300 flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span>Whole Month Longitudinal Curve (30-Day Operational Log)</span>
              </span>
              <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                Track cumulative allostatic load and high-stress duty peaks
              </span>
            </div>
            <MonthlyStressChart data={currentOfficer.monthlyHistory} />
          </div>
        )}
      </div>
    </div>
  );
};
