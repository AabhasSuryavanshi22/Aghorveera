import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { GUIDED_SESSIONS, STRESS_STRATEGIES, GuidedSession } from '../../data/solutionsData';
import { HeartPulse, Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle2, Shield, Moon, Clock, ArrowRight, MessageSquare, AlertCircle, Send, Sparkles, AlertTriangle, Trash2 } from 'lucide-react';

export const SolutionsTab: React.FC = () => {
  const { currentOfficer, acknowledgeMessage, sendMessageToHealthcare, deleteMessage, clearAllMessages } = useApp();

  // Officer direct message to Healthcare Officer state
  const [msgSubject, setMsgSubject] = useState('');
  const [msgContent, setMsgContent] = useState('');
  const [msgPriority, setMsgPriority] = useState<'routine' | 'urgent' | 'high-alert'>('urgent');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [deletedMsgNotice, setDeletedMsgNotice] = useState<string | null>(null);

  // Active session selector
  const [selectedSession, setSelectedSession] = useState<GuidedSession>(GUIDED_SESSIONS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Box Breathing cycle state
  // 4 phases: 0: Inhale (4s), 1: Hold (4s), 2: Exhale (4s), 3: Hold Empty (4s)
  const [phase, setPhase] = useState<number>(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState<number>(4);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState<number>(0);

  // Audio Context synthesizer for soft chime
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playChime = (freq = 440) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.3);
    } catch {
      // audio suspended or blocked
    }
  };

  const getPhaseDuration = (phaseIndex: number, session: GuidedSession) => {
    if (!session.cadencePattern) return 4;
    const { inhale, hold1, exhale, hold2 } = session.cadencePattern;
    if (phaseIndex === 0) return inhale;
    if (phaseIndex === 1) return hold1;
    if (phaseIndex === 2) return exhale;
    return hold2 || 1;
  };

  // Timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying) {
      interval = setInterval(() => {
        setTotalSecondsElapsed((prev) => prev + 1);

        setPhaseSecondsLeft((prevSec) => {
          if (prevSec <= 1) {
            // Advance phase
            const nextPhase = (phase + 1) % 4;
            setPhase(nextPhase);
            if (nextPhase === 0) {
              setCyclesCompleted((c) => c + 1);
              playChime(587.33); // D5 high harmonic for new cycle
            } else if (nextPhase === 2) {
              playChime(392.0); // G4 gentle descent for exhale
            } else {
              playChime(440.0); // A4 hold
            }
            return getPhaseDuration(nextPhase, selectedSession);
          }
          return prevSec - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, phase, selectedSession, soundEnabled]);

  const handleTogglePlay = () => {
    if (!isPlaying) {
      playChime(440);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setPhase(0);
    setPhaseSecondsLeft(getPhaseDuration(0, selectedSession));
    setCyclesCompleted(0);
    setTotalSecondsElapsed(0);
  };

  const handleSelectSession = (s: GuidedSession) => {
    setSelectedSession(s);
    setIsPlaying(false);
    setPhase(0);
    setPhaseSecondsLeft(getPhaseDuration(0, s));
    setCyclesCompleted(0);
    setTotalSecondsElapsed(0);
  };

  if (!currentOfficer) return null;

  const currentZone = currentOfficer.zone;
  const strategies = STRESS_STRATEGIES[currentZone] || STRESS_STRATEGIES.medium;

  // Phase details
  const phaseLabels = ['INHALE DEEPLY', 'HOLD LUNGS FULL', 'EXHALE SLOWLY', 'HOLD EMPTY'];
  const phaseDescriptions = [
    'Through the nose, expanding diaphragm fully',
    'Sustain calm stillness without tension',
    'Through the mouth, releasing residual strain',
    'Centered and grounded before next breath',
  ];

  // Circle animation scale
  const isHolding = phase === 1 || phase === 3;
  const isExhaling = phase === 2;

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900/90 border-2 border-slate-300 dark:border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold mb-1">
              <HeartPulse className="w-4 h-4" />
              <span>TAB 4: TACTICAL RECOVERY & PERSONALIZED RESOURCES</span>
            </div>
            <h2 className="text-2xl font-military font-bold text-slate-950 dark:text-slate-100">
              Personalized Stress Decompression & Solutions
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Targeted protocols to down-regulate acute sympathetic arousal, clear cumulative operational fatigue, and review medical guidance from your Healthcare Officer.
            </p>
          </div>

          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-300 shadow-xs">
            <span className="text-slate-500 font-mono font-semibold">Current Zone:</span>
            <span
              className={`font-bold uppercase font-military ${
                currentZone === 'high'
                  ? 'text-rose-700 dark:text-rose-400'
                  : currentZone === 'medium'
                  ? 'text-amber-700 dark:text-amber-400'
                  : 'text-emerald-700 dark:text-emerald-400'
              }`}
            >
              {currentZone} Alert Zone ({currentOfficer.currentStressScore}/100)
            </span>
          </div>
        </div>
      </div>

      {/* DIRECT MESSAGING TO HEALTHCARE OFFICER COMPONENT */}
      <div className="bg-white dark:bg-slate-900/90 border-2 border-slate-300 dark:border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700 border border-sky-300 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold uppercase tracking-wider text-slate-950 dark:text-slate-100 font-military">
                  Direct Line to Healthcare Officer
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-sky-100 text-sky-800 border border-sky-300 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-700/60 uppercase">
                  Dr. Evelyn Reed (Active)
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Whenever you feel high stress, fatigue, or need clinical support, send a direct message to your assigned healthcare officer.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold flex items-center space-x-1.5 self-start sm:self-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Telemetry & Messages Live Synced</span>
          </span>
        </div>

        {/* Quick Reason Prefills */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold">Quick Subject Templates:</span>
          <div className="flex flex-wrap gap-2">
            {[
              'Acute Operational Stress / Panic Surge',
              'Severe Sleep Deficit & Exhaustion (<4h logged)',
              'Request 1-on-1 Confidential Clinical Debrief',
              'Cognitive Fog & Concentration Difficulties',
            ].map((tmpl) => (
              <button
                key={tmpl}
                type="button"
                onClick={() => {
                  setMsgSubject(tmpl);
                  if (!msgContent) {
                    setMsgContent(`Dr. Reed, I am reporting ${tmpl.toLowerCase()} following recent duty operations. Requesting guidance or clinical consultation.`);
                  }
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border-2 border-slate-300 dark:bg-slate-950 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-800 text-xs transition cursor-pointer hover:border-sky-500 font-medium"
              >
                + {tmpl}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!currentOfficer || !msgContent.trim()) return;

            setIsSending(true);
            sendMessageToHealthcare(currentOfficer.id, {
              subject: msgSubject.trim() || 'Officer Inquiry & Clinical Consultation Request',
              content: msgContent.trim(),
              priority: msgPriority,
            });

            setTimeout(() => {
              setIsSending(false);
              setSendSuccess(true);
              setMsgSubject('');
              setMsgContent('');
              setTimeout(() => setSendSuccess(false), 6000);
            }, 300);
          }}
          className="space-y-4 pt-1"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1 font-mono uppercase tracking-wider">
                Subject / Consultation Reason
              </label>
              <input
                type="text"
                value={msgSubject}
                onChange={(e) => setMsgSubject(e.target.value)}
                placeholder="e.g., Acute stress spike during high-tempo field operations"
                className="w-full bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-950 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500 transition shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1 font-mono uppercase tracking-wider">
                Priority Level
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border-2 border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setMsgPriority('routine')}
                  className={`py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    msgPriority === 'routine'
                      ? 'bg-white text-slate-950 shadow-sm border border-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Routine
                </button>
                <button
                  type="button"
                  onClick={() => setMsgPriority('urgent')}
                  className={`py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    msgPriority === 'urgent'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700/80 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-300'
                  }`}
                >
                  Urgent
                </button>
                <button
                  type="button"
                  onClick={() => setMsgPriority('high-alert')}
                  className={`py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    msgPriority === 'high-alert'
                      ? 'bg-rose-100 text-rose-900 border border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-700/80 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-rose-700 dark:hover:text-rose-300'
                  }`}
                >
                  Immediate
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1 font-mono uppercase tracking-wider">
              Message to Healthcare Officer (Dr. Evelyn Reed)
            </label>
            <textarea
              required
              rows={4}
              value={msgContent}
              onChange={(e) => setMsgContent(e.target.value)}
              placeholder="Describe your current symptoms, operational pressures, physical tension, or concerns. This message will immediately update the healthcare officer's command interface..."
              className="w-full bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-800 rounded-xl p-3.5 text-xs text-slate-950 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition leading-relaxed shadow-xs"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Confidential medical communication encrypted under DoD Medical Privacy protocols.</span>
            </div>

            <button
              type="submit"
              disabled={isSending || !msgContent.trim()}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold font-military uppercase tracking-wider flex items-center justify-center space-x-2 transition cursor-pointer shadow-md shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? 'Transmitting...' : 'Send Message to Healthcare Officer'}</span>
            </button>
          </div>

          {sendSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 dark:bg-emerald-950/80 dark:border-emerald-500/50 dark:text-emerald-300 text-xs flex items-center space-x-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <strong>Message Dispatched Successfully!</strong> Transmitted directly to Dr. Evelyn Reed and Battalion Medical Command. Your communication is now queued on the Healthcare Officer console.
              </div>
            </div>
          )}
        </form>
      </div>

      {/* HEALTHCARE OFFICER DIRECTIVES & MESSAGES INBOX */}
      <div className="bg-white dark:bg-slate-900/90 border-2 border-slate-300 dark:border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-950 dark:text-slate-200 font-military">
                Medical Directives & Clinical Communications Log
              </h3>
              <span className="text-[11px] text-slate-600 dark:text-slate-400">
                Directives, inquiries, and automatic clinical alerts on file
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 self-start sm:self-center">
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-400 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {currentOfficer.messages.length} Record(s) on File
            </span>
            {currentOfficer.messages.length > 0 && (
              <>
                {showClearConfirm ? (
                  <div className="flex items-center space-x-1.5 animate-in fade-in duration-200">
                    <button
                      type="button"
                      onClick={() => {
                        clearAllMessages(currentOfficer.id);
                        setShowClearConfirm(false);
                        setDeletedMsgNotice('All messages and directives cleared from your log.');
                        setTimeout(() => setDeletedMsgNotice(null), 4000);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold transition cursor-pointer shadow-xs"
                    >
                      Confirm Purge All
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(false)}
                      className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 hover:border-rose-300 dark:bg-slate-800 dark:hover:bg-rose-950/60 dark:text-slate-300 dark:hover:text-rose-300 dark:border-slate-700 dark:hover:border-rose-700 text-[11px] font-semibold flex items-center space-x-1 transition cursor-pointer"
                    title="Clear all messages from log so they do not pile up"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {deletedMsgNotice && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center space-x-2 animate-in fade-in duration-200">
            <Trash2 className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{deletedMsgNotice}</span>
          </div>
        )}

        {currentOfficer.messages.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-500 text-xs space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">No active medical directives or messages on file.</p>
            <p className="text-[11px] text-slate-500">Your communication log is clean. New directives from medical command will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentOfficer.messages.map((msg) => {
              const isFromOfficer = msg.senderType === 'officer' || msg.senderRole?.includes('Officer');

              return (
                <div
                  key={msg.id}
                  className={`p-4 rounded-xl border-2 transition-all shadow-xs relative group ${
                    msg.isEmergencyAlert
                      ? 'bg-rose-50 border-rose-300 dark:bg-rose-950/40 dark:border-rose-600 shadow-md'
                      : isFromOfficer
                      ? 'bg-sky-50/60 border-sky-200 dark:bg-sky-950/20 dark:border-sky-800/60'
                      : !msg.acknowledged
                      ? 'bg-rose-50/60 border-rose-200 dark:bg-rose-950/20 dark:border-rose-700/60'
                      : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase font-mono tracking-wider ${
                          msg.isEmergencyAlert
                            ? 'bg-rose-600 text-white animate-pulse'
                            : msg.priority === 'high-alert'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-900 dark:text-rose-200 dark:border-rose-700'
                            : msg.priority === 'urgent'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-900 dark:text-amber-200 dark:border-amber-700'
                            : 'bg-slate-200 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {msg.isEmergencyAlert ? '🚨 EMERGENCY' : msg.priority}
                      </span>
                      {isFromOfficer && (
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold font-mono bg-sky-100 text-sky-800 border border-sky-300 dark:bg-sky-900/60 dark:text-sky-200 dark:border-sky-700">
                          Outgoing Message from You
                        </span>
                      )}
                      <span className="text-xs font-bold text-slate-950 dark:text-slate-200 font-military">
                        {msg.subject}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        {msg.senderName} • {msg.timestamp}
                      </span>
                      {/* Delete individual message button */}
                      <button
                        type="button"
                        onClick={() => {
                          deleteMessage(currentOfficer.id, msg.id);
                          setDeletedMsgNotice(`Message "${msg.subject}" deleted.`);
                          setTimeout(() => setDeletedMsgNotice(null), 3500);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 dark:hover:text-rose-400 transition cursor-pointer"
                        title="Delete this message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed pl-1 mb-3">
                    {msg.content}
                  </p>

                  {msg.prescribedAction && (
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-slate-900/90 border border-emerald-300 dark:border-slate-800 text-xs text-emerald-900 dark:text-emerald-300 flex items-start space-x-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-950 dark:text-slate-200">Prescribed Clinical Action:</strong>{' '}
                        {msg.prescribedAction}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/80">
                    <span className="text-[11px] text-slate-600 dark:text-slate-400">
                      {isFromOfficer ? (
                        <span className="text-sky-700 dark:text-sky-400 font-bold font-mono">
                          ✓ Transmitted to Healthcare Officer (Dr. Evelyn Reed)
                        </span>
                      ) : (
                        <>
                          Status:{' '}
                          {msg.acknowledged ? (
                            <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                              ✓ Directive Acknowledged by Officer
                            </span>
                          ) : (
                            <span className="text-rose-700 dark:text-rose-400 font-bold">
                              ⚠ Action Required: Please acknowledge receipt
                            </span>
                          )}
                        </>
                      )}
                    </span>

                    <div className="flex items-center space-x-2">
                      {!isFromOfficer && !msg.acknowledged && (
                        <button
                          onClick={() => acknowledgeMessage(currentOfficer.id, msg.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-md"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Acknowledge Medical Order</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          deleteMessage(currentOfficer.id, msg.id);
                          setDeletedMsgNotice(`Message "${msg.subject}" deleted.`);
                          setTimeout(() => setDeletedMsgNotice(null), 3500);
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-700 text-slate-600 dark:text-slate-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold flex items-center space-x-1 transition cursor-pointer"
                        title="Delete message so it is not piled up"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* INTERACTIVE GUIDED BREATHING & MEDITATION ENGINE */}
      <div className="bg-white dark:bg-slate-900/90 border-2 border-slate-300 dark:border-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl backdrop-blur">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs font-mono uppercase text-emerald-700 dark:text-emerald-400 font-bold tracking-wider">
              Autonomic Parasympathetic Trainer
            </span>
            <h3 className="text-xl font-bold font-military text-slate-950 dark:text-slate-100 mt-0.5">
              {selectedSession.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
              {selectedSession.clinicalBenefit}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-300 text-xs transition flex items-center space-x-1.5 font-medium"
              title="Toggle ambient chime cue"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Audio Chime: ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-500" />
                  <span>Audio Chime: OFF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Breathing Visual Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
          {/* Visual Breathing Circle & Gauge */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border-2 border-slate-200 dark:border-slate-800 relative min-h-[340px] shadow-xs">
            {/* Ambient pulsing background */}
            <div
              className={`w-64 h-64 rounded-full flex items-center justify-center transition-all duration-1000 ease-in-out relative border-2 ${
                phase === 0
                  ? 'scale-110 bg-emerald-500/15 border-emerald-500/50 shadow-2xl shadow-emerald-500/20'
                  : phase === 1
                  ? 'scale-110 bg-sky-500/15 border-sky-500/50 shadow-2xl shadow-sky-500/20'
                  : phase === 2
                  ? 'scale-90 bg-teal-500/10 border-teal-500/30'
                  : 'scale-90 bg-indigo-500/10 border-indigo-500/30'
              }`}
            >
              {/* Inner core circle */}
              <div
                className={`w-44 h-44 rounded-full flex flex-col items-center justify-center text-center p-4 transition-all duration-1000 border-2 ${
                  phase === 0
                    ? 'bg-emerald-100 border-emerald-500 dark:bg-emerald-950/80 dark:border-emerald-400'
                    : phase === 1
                    ? 'bg-sky-100 border-sky-500 dark:bg-sky-950/80 dark:border-sky-400'
                    : phase === 2
                    ? 'bg-teal-100 border-teal-500 dark:bg-teal-950/80 dark:border-teal-400'
                    : 'bg-indigo-100 border-indigo-500 dark:bg-indigo-950/80 dark:border-indigo-400'
                }`}
              >
                <span className="text-3xl sm:text-4xl font-military font-bold text-slate-950 dark:text-slate-100">
                  {isPlaying ? phaseSecondsLeft : '4'}s
                </span>
                <span className="text-xs font-bold font-military uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mt-1">
                  {isPlaying ? phaseLabels[phase] : 'TACTICAL CALM'}
                </span>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 mt-1 max-w-[120px] leading-tight">
                  {isPlaying ? phaseDescriptions[phase] : 'Click Start to begin paced loop'}
                </span>
              </div>
            </div>

            {/* Cycles & Elapsed Counters */}
            <div className="mt-6 flex items-center space-x-6 text-xs text-slate-700 dark:text-slate-400 font-mono">
              <div>
                Rounds Completed:{' '}
                <strong className="text-slate-950 dark:text-slate-200 font-bold">{cyclesCompleted}</strong>
              </div>
              <div>
                Duration:{' '}
                <strong className="text-slate-950 dark:text-slate-200 font-bold">
                  {Math.floor(totalSecondsElapsed / 60)}:
                  {(totalSecondsElapsed % 60).toString().padStart(2, '0')}
                </strong>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-4 flex items-center space-x-3">
              <button
                onClick={handleTogglePlay}
                className={`px-6 py-2.5 rounded-xl font-military font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition cursor-pointer shadow-md ${
                  isPlaying
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause Exercise</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Begin Guided Session</span>
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200 transition cursor-pointer"
                title="Reset session"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Step-by-Step Instructions & Protocol Guide */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border-2 border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-slate-300 font-military flex items-center space-x-2">
                <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Operational Execution Steps</span>
              </span>

              <div className="space-y-2.5">
                {selectedSession.instructions.map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-800 dark:text-slate-300 bg-white dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80 shadow-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-slate-800 dark:text-emerald-400 dark:border-slate-700 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Audio Narrative Simulation Guide */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border-2 border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-700 dark:text-slate-400 font-bold">
                Paced Guidance Sequence
              </span>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {selectedSession.audioNarrativeSteps.map((narr, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 text-[11px] shadow-xs"
                  >
                    <span className="font-bold text-emerald-800 dark:text-emerald-400 block font-military">
                      Step {idx + 1}: {narr.label} ({narr.durationSec}s)
                    </span>
                    <span className="text-slate-700 dark:text-slate-400 leading-relaxed">{narr.guide}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GUIDED SESSIONS SELECTOR CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-military text-slate-950 dark:text-slate-100 flex items-center space-x-2">
            <HeartPulse className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Personalized Meditation & Decompression Library</span>
          </h3>
          <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-400">
            5 Military-Tailored Protocols
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GUIDED_SESSIONS.map((session) => {
            const isSelected = selectedSession.id === session.id;

            return (
              <div
                key={session.id}
                onClick={() => handleSelectSession(session)}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between shadow-xs ${
                  isSelected
                    ? 'bg-emerald-50/70 dark:bg-slate-900 border-emerald-500 shadow-lg ring-1 ring-emerald-500/50'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold">
                      {session.category}
                    </span>
                    <div className="flex items-center space-x-1 text-xs text-slate-600 dark:text-slate-400 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{session.durationMinutes} min</span>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-950 dark:text-slate-100 font-military mb-2">
                    {session.title}
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-400 leading-relaxed mb-4">
                    {session.clinicalBenefit}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                  <span className={`text-[11px] font-mono font-bold ${isSelected ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                    {isSelected ? '● ACTIVE SESSION' : 'Select Protocol'}
                  </span>
                  <button
                    type="button"
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TACTICAL COPING STRATEGIES BASED ON ALERT ZONE */}
      <div className="bg-white dark:bg-slate-900/90 border-2 border-slate-300 dark:border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold font-military text-slate-950 dark:text-slate-100">
              Zone-Specific Decompression Protocols ({currentZone.toUpperCase()} ZONE)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Actionable operational strategies tailored to mitigate current stress drivers (Operational Workload, Somatic Tension, Emotional Regulation).
            </p>
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase font-military border ${
              currentZone === 'high'
                ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-700'
                : currentZone === 'medium'
                ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700'
                : 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700'
            }`}
          >
            {currentZone} Priority
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {strategies.map((strat, idx) => (
            <div key={idx} className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border-2 border-slate-200 dark:border-slate-800 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-slate-800 dark:text-emerald-400 dark:border-slate-700">
                  {strat.domain}
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                  {strat.urgency.toUpperCase()}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-950 dark:text-slate-200 font-military">
                {strat.title}
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-400 leading-relaxed font-normal">
                {strat.recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
