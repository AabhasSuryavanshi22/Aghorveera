import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ArmyOfficer, StressZone } from '../../types';
import { WeeklyStressChart, MonthlyStressChart, CategoryBarChart, StressDonutChart } from '../common/StressCharts';
import { HeartPulse, Shield, Search, Filter, AlertTriangle, Send, CheckCircle2, MessageSquare, Clock, User, ArrowUpDown, X, ChevronRight, Activity, Moon, Sparkles, Trash2 } from 'lucide-react';

export const HealthcareDashboard: React.FC = () => {
  const { officers, sendMessageToOfficer, selectOfficerAsActive, deleteMessage, clearAllMessages } = useApp();

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<'all' | 'critical' | 'high' | 'medium' | 'low' | 'pending_msg' | 'officer_msgs'>('all');
  const [sortBy, setSortBy] = useState<'stress_desc' | 'stress_asc' | 'name' | 'unit'>('stress_desc');

  // Selected Officer for deep inspection & messaging
  const [selectedOfficer, setSelectedOfficer] = useState<ArmyOfficer | null>(null);

  // Message composer state
  const [msgSubject, setMsgSubject] = useState('');
  const [msgContent, setMsgContent] = useState('');
  const [msgPrescribedAction, setMsgPrescribedAction] = useState('');
  const [msgPriority, setMsgPriority] = useState<'routine' | 'urgent' | 'high-alert'>('urgent');
  const [sendSuccess, setSendSuccess] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Quick preset templates for fast medical messaging
  const messageTemplates = [
    {
      title: 'High Alert: Autonomic Reset & Sleep Preservation',
      subject: 'URGENT: Autonomic Strain Directive - Protocol Alpha',
      priority: 'high-alert' as const,
      action: '2x 10-min Tactical Box Breathing + Protected 7-Hour Sleep Block',
      content: 'Biometrics demonstrate acute sympathetic overdrive and elevated somatic tension. You are directed to perform 10 minutes of Tactical Box Breathing prior to debrief and disconnect from operational monitors 60 minutes before lights-out. Telehealth check-in scheduled for 0800.',
    },
    {
      title: 'Elevated Fatigue: NSDR & Workload Chunking',
      subject: 'Fatigue Advisory: Mandatory Non-Sleep Deep Rest (NSDR)',
      priority: 'urgent' as const,
      action: 'Complete 15-minute NSDR session in Solutions Tab before duty shift',
      content: 'Your continuous logs indicate cumulative sleep debt impacting attentional vigilance. Leverage the audio NSDR session in your Solutions tab this afternoon to restore dopamine reserves.',
    },
    {
      title: 'Routine Clearance: Optimal Homeostasis',
      subject: 'Weekly Health Clearance: Optimal Combat Readiness',
      priority: 'routine' as const,
      action: 'Maintain zone-2 aerobic conditioning & field hydration baseline',
      content: 'Your 7-day and 30-day stress curves remain in the optimal Low Stress Zone (Readiness Green). Sleep recovery and cognitive resilience are robust. Continue standard physical training protocols.',
    },
  ];

  const applyTemplate = (t: typeof messageTemplates[0]) => {
    setMsgSubject(t.subject);
    setMsgContent(t.content);
    setMsgPrescribedAction(t.action);
    setMsgPriority(t.priority);
  };

  // Compute command-wide statistics across all 50 officers
  const totalOfficers = officers.length;
  const criticalOfficers = useMemo(() => officers.filter((o) => o.currentStressScore > 90), [officers]);
  const highAlertCount = officers.filter((o) => o.zone === 'high').length;
  const mediumCount = officers.filter((o) => o.zone === 'medium').length;
  const lowCount = officers.filter((o) => o.zone === 'low').length;
  const avgStress = Math.round(
    officers.reduce((sum, o) => sum + o.currentStressScore, 0) / Math.max(1, totalOfficers)
  );

  // Incoming messages sent from army officers to healthcare
  const incomingOfficerMessages = useMemo(() => {
    return officers.flatMap((o) =>
      o.messages
        .filter((m) => m.senderType === 'officer' || m.senderRole?.includes('Officer'))
        .map((m) => ({ ...m, officer: o }))
    );
  }, [officers]);

  // Filter and sort the 50 officers
  const filteredOfficers = useMemo(() => {
    return officers
      .filter((officer) => {
        // Zone & status filter
        if (selectedZone === 'critical' && officer.currentStressScore <= 90) return false;
        if (selectedZone === 'high' && officer.zone !== 'high') return false;
        if (selectedZone === 'medium' && officer.zone !== 'medium') return false;
        if (selectedZone === 'low' && officer.zone !== 'low') return false;
        if (selectedZone === 'pending_msg' && !officer.messages.some((m) => !m.acknowledged)) return false;
        if (selectedZone === 'officer_msgs' && !officer.messages.some((m) => m.senderType === 'officer' || m.senderRole?.includes('Officer'))) return false;

        // Search query
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          officer.name.toLowerCase().includes(q) ||
          officer.rank.toLowerCase().includes(q) ||
          officer.unit.toLowerCase().includes(q) ||
          officer.serviceNumber.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'stress_desc') return b.currentStressScore - a.currentStressScore;
        if (sortBy === 'stress_asc') return a.currentStressScore - b.currentStressScore;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'unit') return a.unit.localeCompare(b.unit);
        return 0;
      });
  }, [officers, selectedZone, searchQuery, sortBy]);

  const handleOpenOfficer = (officer: ArmyOfficer) => {
    setSelectedOfficer(officer);
    setSendSuccess(false);

    // Prefill default message if high alert
    if (officer.zone === 'high') {
      applyTemplate(messageTemplates[0]);
    } else if (officer.zone === 'medium') {
      applyTemplate(messageTemplates[1]);
    } else {
      applyTemplate(messageTemplates[2]);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOfficer || !msgContent.trim()) return;

    sendMessageToOfficer(selectedOfficer.id, {
      subject: msgSubject || 'Clinical Medical Directive',
      content: msgContent,
      prescribedAction: msgPrescribedAction || undefined,
      priority: msgPriority,
    });

    setSendSuccess(true);
    setTimeout(() => {
      setSendSuccess(false);
    }, 4000);

    // Refresh selected officer reference from updated state
    const refreshed = officers.find((o) => o.id === selectedOfficer.id);
    if (refreshed) {
      setSelectedOfficer(refreshed);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20">
      {/* CRITICAL ALERT BANNER: OFFICERS WITH STRESS > 90 */}
      {criticalOfficers.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/95 border-2 border-rose-500 shadow-2xl shadow-rose-950/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-xl bg-rose-600 text-white shadow-lg shrink-0 mt-0.5">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-rose-900 text-rose-100 border border-rose-400">
                  🚨 CRITICAL ALERT: OFFICER STRESS &gt; 90
                </span>
                <span className="text-xs text-rose-200 font-mono font-semibold">
                  {criticalOfficers.length} Officer(s) Need Immediate Attention
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-1.5 flex flex-wrap items-center gap-2">
                {criticalOfficers.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => handleOpenOfficer(o)}
                    className="underline decoration-rose-400 underline-offset-2 hover:text-rose-700 dark:hover:text-rose-200 cursor-pointer font-military text-left"
                  >
                    {o.rank} {o.name} ({o.currentStressScore}/100 • {o.unit})
                  </button>
                ))}
              </div>
              <p className="text-xs text-rose-900 dark:text-rose-200/90 mt-1 leading-relaxed">
                Emergency clinical sentinel triggered: Stress score has exceeded 90. Immediate medical outreach, 1-on-1 crisis consultation, and temporary duty stand-down are mandated.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleOpenOfficer(criticalOfficers[0])}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-rose-100 text-rose-950 font-military font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg flex items-center space-x-2"
            >
              <HeartPulse className="w-4 h-4 text-rose-600" />
              <span>Intervene ({criticalOfficers[0].name.split(' ')[0]})</span>
            </button>
          </div>
        </div>
      )}

      {/* INCOMING MESSAGES FROM ARMY OFFICERS BANNER */}
      {incomingOfficerMessages.length > 0 && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-sky-950/80 border border-sky-600/70 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-sky-600 text-white shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold uppercase text-sky-200 flex items-center space-x-2">
                <span>Incoming Officer Messages & Consultations ({incomingOfficerMessages.length})</span>
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Latest inquiry from <strong className="text-white">{incomingOfficerMessages[0].officer.rank} {incomingOfficerMessages[0].officer.name}</strong> ({incomingOfficerMessages[0].officer.unit}): "{incomingOfficerMessages[0].subject}"
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0 self-start sm:self-center">
            <button
              type="button"
              onClick={() => handleOpenOfficer(incomingOfficerMessages[0].officer)}
              className="px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition cursor-pointer flex items-center space-x-1.5"
            >
              <span>Open Consultation</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                deleteMessage(incomingOfficerMessages[0].officer.id, incomingOfficerMessages[0].id);
              }}
              className="p-2 rounded-lg bg-slate-900/80 hover:bg-rose-950 border border-slate-700 hover:border-rose-600 text-slate-400 hover:text-rose-300 text-xs transition cursor-pointer"
              title="Delete message from queue"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Healthcare Command Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-sky-400 mb-1">
              <HeartPulse className="w-4 h-4" />
              <span>BATTALION MEDICAL & OPERATIONAL PSYCHOLOGY COMMAND</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-military font-bold text-slate-100">
              Healthcare Officer Stress Monitoring Roster
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Real-time psychological surveillance and biometric telemetry of <strong>all {totalOfficers} Army Officers</strong>.
              Review individual 7-day and 30-day stress trajectories, analyze factor decompositions, and transmit direct clinical guidance to reduce stress.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">
                Active Monitoring
              </span>
              <span className="text-sm font-bold text-sky-300 font-military">
                Dr. Evelyn Reed (CMO)
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-sm">
              <HeartPulse className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Command Metrics Bar across all 50 officers */}
        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
              Total Roster
            </span>
            <div className="text-2xl font-military font-bold text-slate-100">
              {totalOfficers}
            </div>
            <span className="text-[10px] text-slate-400">Army Officers</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-rose-900/40">
            <span className="text-[10px] uppercase font-mono text-rose-400 block mb-0.5 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 animate-pulse" />
              High Alert Zone
            </span>
            <div className="text-2xl font-military font-bold text-rose-400">
              {highAlertCount}
            </div>
            <span className="text-[10px] text-rose-400/80">Score 70-100 (Immediate Action)</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-amber-900/40">
            <span className="text-[10px] uppercase font-mono text-amber-400 block mb-0.5">
              Medium Stress
            </span>
            <div className="text-2xl font-military font-bold text-amber-400">
              {mediumCount}
            </div>
            <span className="text-[10px] text-amber-400/80">Score 36-69 (Decompress)</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-emerald-900/40">
            <span className="text-[10px] uppercase font-mono text-emerald-400 block mb-0.5">
              Low Stress Zone
            </span>
            <div className="text-2xl font-military font-bold text-emerald-400">
              {lowCount}
            </div>
            <span className="text-[10px] text-emerald-400/80">Score 0-35 (Optimal Readiness)</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
              Battalion Mean
            </span>
            <div className="text-2xl font-military font-bold text-sky-400">
              {avgStress} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
            <span className="text-[10px] text-slate-400">Overall Force Stress</span>
          </div>
        </div>
      </div>

      {/* Roster Controls: Search, Zone Filters, and Sorting */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by officer name, rank, unit, or service ID..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
          />
        </div>

        {/* Zone & Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setSelectedZone('all')}
            className={`px-3 py-1.5 rounded-lg border transition ${
              selectedZone === 'all'
                ? 'bg-slate-800 border-sky-500/50 text-sky-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({totalOfficers})
          </button>
          {criticalOfficers.length > 0 && (
            <button
              onClick={() => setSelectedZone('critical')}
              className={`px-3 py-1.5 rounded-lg border transition flex items-center space-x-1.5 ${
                selectedZone === 'critical'
                  ? 'bg-rose-950 border-rose-500 text-rose-200 font-bold ring-2 ring-rose-500/50'
                  : 'bg-rose-950/40 border-rose-800/80 text-rose-300 hover:bg-rose-900/50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>Critical &gt; 90 ({criticalOfficers.length})</span>
            </button>
          )}
          {incomingOfficerMessages.length > 0 && (
            <button
              onClick={() => setSelectedZone('officer_msgs')}
              className={`px-3 py-1.5 rounded-lg border transition flex items-center space-x-1.5 ${
                selectedZone === 'officer_msgs'
                  ? 'bg-sky-950 border-sky-500 text-sky-200 font-bold ring-2 ring-sky-500/50'
                  : 'bg-sky-950/40 border-sky-800/80 text-sky-300 hover:bg-sky-900/50'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
              <span>Officer Inquiries ({incomingOfficerMessages.length})</span>
            </button>
          )}
          <button
            onClick={() => setSelectedZone('high')}
            className={`px-3 py-1.5 rounded-lg border transition flex items-center space-x-1 ${
              selectedZone === 'high'
                ? 'bg-rose-950/80 border-rose-500 text-rose-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-rose-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>High Alert ({highAlertCount})</span>
          </button>
          <button
            onClick={() => setSelectedZone('medium')}
            className={`px-3 py-1.5 rounded-lg border transition flex items-center space-x-1 ${
              selectedZone === 'medium'
                ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-amber-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Medium ({mediumCount})</span>
          </button>
          <button
            onClick={() => setSelectedZone('low')}
            className={`px-3 py-1.5 rounded-lg border transition flex items-center space-x-1 ${
              selectedZone === 'low'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-emerald-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Low ({lowCount})</span>
          </button>
        </div>

        {/* Sort selector */}
        <div className="flex items-center space-x-2 text-xs text-slate-400 shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="stress_desc">Highest Stress First</option>
            <option value="stress_asc">Lowest Stress First</option>
            <option value="name">Officer Name (A-Z)</option>
            <option value="unit">Unit / Division</option>
          </select>
        </div>
      </div>

      {/* 50 OFFICERS ROSTER TABLE */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl backdrop-blur overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400 tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Officer / Rank</th>
                <th className="px-4 py-3.5">Assigned Unit</th>
                <th className="px-4 py-3.5 text-center">Stress Score (0-100)</th>
                <th className="px-4 py-3.5 text-center">Zone Classification</th>
                <th className="px-4 py-3.5 text-center">Weekly Sleep Avg</th>
                <th className="px-4 py-3.5">Clinical Directives</th>
                <th className="px-4 py-3.5 text-right">Clinical Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOfficers.map((officer) => {
                const score = officer.currentStressScore;
                const isCritical = score > 90;
                const isHigh = score >= 70;
                const isMed = score >= 36 && score < 70;
                const unackCount = officer.messages.filter((m) => !m.acknowledged).length;
                const hasOfficerMsg = officer.messages.some((m) => m.senderType === 'officer' || m.senderRole?.includes('Officer'));
                const hasEmergencyAlert = officer.messages.some((m) => m.isEmergencyAlert || m.senderType === 'system_alert');

                return (
                  <tr
                    key={officer.id}
                    className={`hover:bg-slate-800/40 transition cursor-pointer ${
                      isCritical
                        ? 'bg-rose-950/30 border-l-4 border-rose-500'
                        : selectedOfficer?.id === officer.id
                        ? 'bg-sky-950/20'
                        : ''
                    }`}
                    onClick={() => handleOpenOfficer(officer)}
                  >
                    {/* Name & Rank */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs font-military border ${
                            isCritical
                              ? 'bg-rose-900 border-rose-500 text-white shadow-sm'
                              : isHigh
                              ? 'bg-rose-950/60 border-rose-700/60 text-rose-300'
                              : isMed
                              ? 'bg-amber-950/60 border-amber-700/60 text-amber-300'
                              : 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                          }`}
                        >
                          {officer.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-200 text-xs flex items-center space-x-1.5">
                            <span>{officer.rank} {officer.name}</span>
                            {isCritical && (
                              <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-mono text-[9px] font-bold animate-pulse">
                                ! &gt;90
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {officer.serviceNumber}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Unit */}
                    <td className="px-4 py-3.5 text-slate-300 text-xs max-w-[200px] truncate">
                      {officer.unit}
                    </td>

                    {/* Stress Score */}
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`font-military font-bold text-sm ${isCritical ? 'text-rose-400 font-extrabold' : 'text-slate-100'}`}>
                          {score}
                          <span className="text-[10px] font-mono text-slate-400 font-normal"> / 100</span>
                        </span>
                        {isCritical && (
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-600/80 font-bold mt-0.5">
                            CRITICAL &gt; 90
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Zone Badge */}
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-military uppercase tracking-wide border ${
                          isCritical
                            ? 'bg-rose-950 text-rose-200 border-rose-500 shadow-sm'
                            : isHigh
                            ? 'bg-rose-950 text-rose-300 border-rose-700'
                            : isMed
                            ? 'bg-amber-950 text-amber-300 border-amber-700'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isCritical ? 'bg-rose-400 animate-ping' : isHigh ? 'bg-rose-500 animate-pulse' : isMed ? 'bg-amber-400' : 'bg-emerald-400'
                          }`}
                        />
                        <span>{officer.zone} Zone</span>
                      </span>
                    </td>

                    {/* Weekly Sleep Avg */}
                    <td className="px-4 py-3.5 text-center font-mono text-slate-300 text-[11px]">
                      <div className="font-bold text-slate-200">{officer.sleepHoursAvg}h / night</div>
                      <div className={`text-[10px] ${officer.sleepHoursAvg < 6 ? 'text-amber-400 font-semibold' : 'text-emerald-400'}`}>
                        {officer.sleepHoursAvg < 6 ? 'Sleep deficit' : 'Optimal rest'}
                      </div>
                    </td>

                    {/* Directives & Inquiries Status */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col space-y-1">
                        {hasOfficerMsg && (
                          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-sky-950/90 text-sky-300 border border-sky-600 text-[10px] font-semibold w-fit">
                            <MessageSquare className="w-2.5 h-2.5 text-sky-400" />
                            <span>Officer Inquiry</span>
                          </span>
                        )}
                        {hasEmergencyAlert && (
                          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-rose-950/90 text-rose-300 border border-rose-600 text-[10px] font-bold w-fit">
                            <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
                            <span>Emergency &gt;90 Alert</span>
                          </span>
                        )}
                        {officer.messages.length > 0 ? (
                          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                            <span>{officer.messages.length} msg(s)</span>
                            {unackCount > 0 && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500 text-white font-bold">
                                {unackCount} unread
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500">No directives</span>
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenOfficer(officer);
                        }}
                        className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition inline-flex items-center space-x-1 cursor-pointer border ${
                          isCritical
                            ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-950'
                            : 'bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white border-slate-700 hover:border-sky-500'
                        }`}
                      >
                        <span>{isCritical ? 'Intervene Now' : 'Analyze & Direct'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SELECTED OFFICER DETAIL & MESSAGING MODAL / DRAWER */}
      {selectedOfficer && (() => {
        const activeOfficer = officers.find((o) => o.id === selectedOfficer.id) || selectedOfficer;

        return (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-military font-bold text-sm border ${
                      activeOfficer.zone === 'high'
                        ? 'bg-rose-950 border-rose-700 text-rose-300'
                        : activeOfficer.zone === 'medium'
                        ? 'bg-amber-950 border-amber-700 text-amber-300'
                        : 'bg-emerald-950 border-emerald-700 text-emerald-300'
                    }`}
                  >
                    {activeOfficer.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-military font-bold text-slate-100">
                        {activeOfficer.rank} {activeOfficer.name}
                      </h3>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {activeOfficer.serviceNumber}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {activeOfficer.unit} • Status: {activeOfficer.status}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Switch to this officer's dashboard view */}
                  <button
                    type="button"
                    onClick={() => selectOfficerAsActive(activeOfficer.id)}
                    className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 text-xs font-semibold transition cursor-pointer"
                    title="Switch to this officer's personal view"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Preview as this Officer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOfficer(null);
                      setShowClearConfirm(false);
                      setNoticeMessage(null);
                    }}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* Daily & Monthly Real-time Synchronization Banner */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                  <div className="flex items-center space-x-2 text-emerald-400 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Clinical Records Live-Synced to Aghorveera Healthcare Command</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Last Assessment: {activeOfficer.weeklyHistory[activeOfficer.weeklyHistory.length - 1]?.date || 'Today'}
                  </span>
                </div>

                {/* CRITICAL ALERT BANNER IF OFFICER STRESS > 90 */}
                {activeOfficer.currentStressScore > 90 && (
                  <div className="p-4 rounded-xl bg-rose-950/90 border-2 border-rose-500 shadow-xl flex items-start space-x-3 text-rose-200 animate-pulse">
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-rose-950 dark:text-white uppercase tracking-wider text-xs font-mono">
                        🚨 IMMEDIATE CLINICAL ATTENTION REQUIRED: STRESS SCORE {activeOfficer.currentStressScore}/100 &gt; 90
                      </div>
                      <p className="text-xs text-rose-900 dark:text-rose-200/90 mt-1 leading-relaxed">
                        Officer {activeOfficer.rank} {activeOfficer.name}'s acute stress has breached the critical threshold of 90. Automated sentinel protocols have alerted Battalion Medical Command. Immediate 1-on-1 crisis counseling and temporary operational stand-down are strongly advised.
                      </p>
                    </div>
                  </div>
                )}

                {/* Stress Score & Zone Diagnostic Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                    <span className="text-[10px] uppercase font-mono text-slate-400">
                      Live Stress Score
                    </span>
                    <div className="text-3xl font-military font-bold text-slate-100 my-1">
                      {activeOfficer.currentStressScore}
                      <span className="text-xs font-mono text-slate-400 font-normal"> / 100</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase font-military ${
                        activeOfficer.zone === 'high'
                          ? 'text-rose-400'
                          : activeOfficer.zone === 'medium'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {activeOfficer.zone.toUpperCase()} ZONE
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                    <span className="text-[10px] uppercase font-mono text-slate-400">
                      Sleep Monitoring
                    </span>
                    <div className="text-2xl font-military font-bold text-slate-200 my-1">
                      {activeOfficer.sleepHoursAvg} <span className="text-xs font-normal text-slate-400">hrs</span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {activeOfficer.sleepHoursAvg < 6 ? 'Significant sleep deficit' : 'Adequate restoration'}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                    <span className="text-[10px] uppercase font-mono text-slate-400">
                      Combat Duty Readiness
                    </span>
                    <div className="text-2xl font-military font-bold text-slate-200 my-1">
                      {Math.max(15, Math.min(99, Math.round((100 - activeOfficer.currentStressScore) * 0.7 + (activeOfficer.sleepHoursAvg / 8) * 30)))}%
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Composite stress & sleep score
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                    <span className="text-[10px] uppercase font-mono text-slate-400">
                      Primary Driver
                    </span>
                    <div className="text-xs font-bold text-rose-300 font-military my-1 truncate">
                      {activeOfficer.categoryBreakdown[0]?.label}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Highest sub-score: {activeOfficer.categoryBreakdown[0]?.score}/100
                    </span>
                  </div>
                </div>

                {/* Stress Longitudinal Graphs for this Officer (Week & Month) */}
                <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200 font-military flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-sky-400" />
                      <span>Officer's 7-Day & 30-Day Stress Trajectory</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Biometric & PSS-10 Log
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <span className="text-[11px] font-mono text-slate-400 block mb-2">
                        Weekly Trend (Past 7 Days):
                      </span>
                      <WeeklyStressChart data={activeOfficer.weeklyHistory} />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono text-slate-400 block mb-2">
                        Monthly Longitudinal Curve (30 Days):
                      </span>
                      <MonthlyStressChart data={activeOfficer.monthlyHistory} />
                    </div>
                  </div>
                </div>

                {/* Bar Graph Breakdown by Category */}
                <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200 font-military flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Category Factor Breakdown (Bar Graph)</span>
                  </span>
                  <CategoryBarChart categories={activeOfficer.categoryBreakdown} />
                </div>

                {/* CLINICAL MESSAGING SYSTEM: Healthcare Officer Messages the Officer */}
                <div className="p-5 rounded-xl bg-slate-900/95 border-2 border-sky-600/70 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
                        <Send className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-military">
                          Send Clinical Directives & Medical Guidance
                        </h4>
                        <p className="text-[11px] text-slate-300">
                          Message this officer with targeted stress reduction advice and coping protocols.
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                      Recipient: {activeOfficer.rank} {activeOfficer.name}
                    </span>
                  </div>

                  {sendSuccess && (
                    <div className="p-3 rounded-lg bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        Medical directive transmitted successfully! Officer will receive this in their portal immediately.
                      </span>
                    </div>
                  )}

                  {/* Message Templates Shortcuts */}
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1 font-mono uppercase">
                      Load Quick Clinical Template:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {messageTemplates.map((t, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => applyTemplate(t)}
                          className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs transition cursor-pointer"
                        >
                          {t.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSendMessage} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                          Subject Line
                        </label>
                        <input
                          type="text"
                          required
                          value={msgSubject}
                          onChange={(e) => setMsgSubject(e.target.value)}
                          placeholder="e.g. Clinical Directive: Tactical Breathing & Sleep Mandate"
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                          Priority Classification
                        </label>
                        <select
                          value={msgPriority}
                          onChange={(e) => setMsgPriority(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
                        >
                          <option value="high-alert">High Alert (Critical)</option>
                          <option value="urgent">Urgent Priority</option>
                          <option value="routine">Routine Check-in</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                        Prescribed Clinical Action (Required by Officer)
                      </label>
                      <input
                        type="text"
                        value={msgPrescribedAction}
                        onChange={(e) => setMsgPrescribedAction(e.target.value)}
                        placeholder="e.g. Mandatory 10-minute Tactical Box Breathing + 8-hr uninterrupted sleep window"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                        Detailed Medical Advice & Guidance
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={msgContent}
                        onChange={(e) => setMsgContent(e.target.value)}
                        placeholder="Explain to the officer the physiological observations and exact coping exercises they should execute..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-military font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition cursor-pointer shadow-lg shadow-sky-950"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Transmit Clinical Guidance to Officer</span>
                      </button>
                    </div>
                  </form>

                  {/* Directives & Conversation History for this Officer */}
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-mono uppercase text-slate-400 block">
                        Directives & Communications Log ({activeOfficer.rank} {activeOfficer.name}):
                      </span>
                      {activeOfficer.messages.length > 0 && (
                        <div className="flex items-center space-x-2">
                          {showClearConfirm ? (
                            <div className="flex items-center space-x-1.5 animate-in fade-in duration-200">
                              <button
                                type="button"
                                onClick={() => {
                                  clearAllMessages(activeOfficer.id);
                                  setShowClearConfirm(false);
                                  setNoticeMessage('All messages purged for this officer.');
                                  setTimeout(() => setNoticeMessage(null), 3500);
                                }}
                                className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold transition cursor-pointer"
                              >
                                Confirm Clear All
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowClearConfirm(false)}
                                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold transition cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setShowClearConfirm(true)}
                              className="px-2.5 py-1 rounded bg-slate-950 hover:bg-rose-950 border border-slate-700 hover:border-rose-600 text-slate-400 hover:text-rose-300 text-[10px] font-mono uppercase flex items-center space-x-1 transition cursor-pointer"
                              title="Clear all messages for this officer so they do not pile up"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Purge All</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {noticeMessage && (
                      <div className="p-2.5 mb-2 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2 animate-in fade-in duration-200">
                        <Trash2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>{noticeMessage}</span>
                      </div>
                    )}

                    {activeOfficer.messages.length === 0 ? (
                      <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center text-slate-500 text-xs">
                        No messages on file for {activeOfficer.rank} {activeOfficer.name}. Log is clear.
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                        {activeOfficer.messages.map((m) => {
                          const isOfficerMsg = m.senderType === 'officer' || m.senderRole?.includes('Officer');
                          const isEmergency = m.isEmergencyAlert || m.senderType === 'system_alert';

                          return (
                            <div
                              key={m.id}
                              className={`p-3 rounded-xl border text-xs transition ${
                                isEmergency
                                  ? 'bg-rose-950/70 border-rose-500/80 text-rose-200 shadow-md shadow-rose-950/50'
                                  : isOfficerMsg
                                  ? 'bg-sky-950/60 border-sky-600/70 text-sky-100 shadow-sm'
                                  : 'bg-slate-950 border-slate-800 text-slate-300'
                              }`}
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                                <div className="flex items-center space-x-2">
                                  {isEmergency ? (
                                    <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-mono text-[10px] font-bold flex items-center space-x-1">
                                      <AlertTriangle className="w-3 h-3" />
                                      <span>CRITICAL &gt;90 ALERT</span>
                                    </span>
                                  ) : isOfficerMsg ? (
                                    <span className="px-2 py-0.5 rounded bg-sky-600 text-white font-mono text-[10px] font-bold flex items-center space-x-1">
                                      <MessageSquare className="w-3 h-3" />
                                      <span>OFFICER INQUIRY</span>
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] font-semibold">
                                      CLINICAL DIRECTIVE
                                    </span>
                                  )}
                                  <span className="font-bold text-slate-100">{m.subject}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-[10px] font-mono text-slate-400">
                                    {m.timestamp}
                                  </span>
                                  {isOfficerMsg && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setMsgSubject(`Re: ${m.subject}`);
                                        setMsgPriority('urgent');
                                        setMsgContent(`Regarding your inquiry: "${m.content.substring(0, 60)}..."\n\nClinical Recommendation: `);
                                      }}
                                      className="px-2 py-0.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-semibold transition cursor-pointer"
                                    >
                                      Reply to Officer
                                    </button>
                                  )}
                                  {!isOfficerMsg && (
                                    <span
                                      className={`text-[10px] font-mono px-2 py-0.5 rounded shrink-0 ${
                                        m.acknowledged
                                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                                      }`}
                                    >
                                      {m.acknowledged ? '✓ Acknowledged' : 'Pending Review'}
                                    </span>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      deleteMessage(activeOfficer.id, m.id);
                                      setNoticeMessage(`Message "${m.subject}" deleted.`);
                                      setTimeout(() => setNoticeMessage(null), 3000);
                                    }}
                                    className="p-1 rounded bg-slate-900 hover:bg-rose-950 border border-slate-800 hover:border-rose-700 text-slate-400 hover:text-rose-300 transition cursor-pointer"
                                    title="Delete this message"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-[11px] leading-relaxed text-slate-300">
                                {m.content}
                              </p>
                              {m.prescribedAction && (
                                <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] flex items-center space-x-1 text-sky-300">
                                  <span className="font-semibold text-slate-400">Prescribed Action:</span>
                                  <span>{m.prescribedAction}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOfficer(null);
                    setShowClearConfirm(false);
                    setNoticeMessage(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
