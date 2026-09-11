import React, { createContext, useContext, useState, useEffect } from 'react';
import { ArmyOfficer, User, UserRole, HealthcareMessage, AssessmentSubmission, StressZone, AppTheme } from '../types';
import { INITIAL_OFFICERS } from '../data/mockOfficers';
import { calculateAssessmentScore } from '../data/assessmentQuestions';
import { signInWithGoogle, signOutUser, persistOfficerToFirestore } from '../lib/firebase';

interface AppContextType {
  currentUser: User | null;
  officers: ArmyOfficer[];
  currentOfficer: ArmyOfficer | null;
  activeTab: 'hero' | 'assessment' | 'analysis' | 'solutions';
  setActiveTab: (tab: 'hero' | 'assessment' | 'analysis' | 'solutions') => void;
  theme: AppTheme;
  toggleTheme: () => void;
  setTheme: (theme: AppTheme) => void;
  login: (email: string, role?: UserRole) => boolean;
  loginWithGoogle: (intendedRole?: UserRole) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  selectOfficerAsActive: (officerId: string) => void;
  submitAssessment: (answers: Record<number, number>) => AssessmentSubmission;
  latestSubmission: AssessmentSubmission | null;
  clearLatestSubmission: () => void;
  sendMessageToOfficer: (
    officerId: string,
    message: { subject: string; content: string; prescribedAction?: string; priority: 'routine' | 'urgent' | 'high-alert' }
  ) => void;
  sendMessageToHealthcare: (
    officerId: string,
    message: { subject: string; content: string; priority?: 'routine' | 'urgent' | 'high-alert' }
  ) => void;
  acknowledgeMessage: (officerId: string, messageId: string) => void;
  markMessageRead: (officerId: string, messageId: string) => void;
  deleteMessage: (officerId: string, messageId: string) => void;
  clearAllMessages: (officerId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_OFFICERS = 'aghorveera_military_officers_v2';
const STORAGE_KEY_USER = 'aghorveera_military_current_user_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [officers, setOfficers] = useState<ArmyOfficer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_OFFICERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 50) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_OFFICERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    const defOfficer = INITIAL_OFFICERS[0];
    return {
      id: defOfficer.id,
      name: `${defOfficer.rank} ${defOfficer.name}`,
      email: defOfficer.email,
      role: 'army_officer',
      rank: defOfficer.rank,
      unit: defOfficer.unit,
      officerId: defOfficer.id,
    };
  });

  const [activeTab, setActiveTab] = useState<'hero' | 'assessment' | 'analysis' | 'solutions'>('hero');
  const [latestSubmission, setLatestSubmission] = useState<AssessmentSubmission | null>(null);
  const clearLatestSubmission = () => setLatestSubmission(null);

  // Theme State: 'dark' (Night Operations) or 'light' (Day Operations)
  const [theme, setTheme] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem('aghorveera_theme');
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'dark';
  });

  // Sync theme to localStorage and document.documentElement class
  useEffect(() => {
    try {
      localStorage.setItem('aghorveera_theme', theme);
    } catch {
      // ignore
    }
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sync officers to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_OFFICERS, JSON.stringify(officers));
    } catch {
      // local storage quota or disabled
    }
  }, [officers]);

  // Sync currentUser to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch {
      // fallback
    }
  }, [currentUser]);

  // Resolve current active officer data if currentUser is army officer
  const currentOfficer = currentUser?.role === 'army_officer'
    ? officers.find((o) => o.id === (currentUser.officerId || 'officer-1')) || officers[0]
    : null;

  const login = (email: string, requestedRole?: UserRole): boolean => {
    // Check if user matches any known officer
    const matchedOfficer = officers.find((o) => o.email.toLowerCase() === email.toLowerCase());
    
    if (matchedOfficer) {
      setCurrentUser({
        id: matchedOfficer.id,
        name: `${matchedOfficer.rank} ${matchedOfficer.name}`,
        email: matchedOfficer.email,
        role: 'army_officer',
        rank: matchedOfficer.rank,
        unit: matchedOfficer.unit,
        officerId: matchedOfficer.id,
      });
      setActiveTab('hero');
      return true;
    }

    // Check if healthcare officer email or default role
    const isHealthcare = requestedRole === 'healthcare_officer' || email.toLowerCase().includes('health') || email.toLowerCase().includes('doctor') || email.toLowerCase().includes('medic');
    
    if (isHealthcare) {
      setCurrentUser({
        id: 'healthcare-cm0-1',
        name: 'Dr. Evelyn Reed, MD',
        email: email || 'dr.reed@aghorveera.med.mil',
        role: 'healthcare_officer',
        rank: 'Chief Medical Officer / Operational Psychologist',
        unit: 'Medical Command & Human Performance Center',
      });
      return true;
    }

    // Default to first army officer if generic
    const defOfficer = officers[0];
    setCurrentUser({
      id: defOfficer.id,
      name: `${defOfficer.rank} ${defOfficer.name}`,
      email: email || defOfficer.email,
      role: 'army_officer',
      rank: defOfficer.rank,
      unit: defOfficer.unit,
      officerId: defOfficer.id,
    });
    setActiveTab('hero');
    return true;
  };

  const register = (name: string, email: string, _pass: string, role: UserRole): boolean => {
    if (role === 'healthcare_officer') {
      setCurrentUser({
        id: `healthcare-${Date.now()}`,
        name: name.startsWith('Dr.') ? name : `Dr. ${name}`,
        email,
        role: 'healthcare_officer',
        rank: 'Senior Medical Officer',
        unit: 'Operational Health & Resilience Division',
      });
      return true;
    }

    // Army officer registration:
    // Create new army officer or attach to roster
    const newOfficerId = `officer-${Date.now()}`;
    const initialWeekly: { date: string; dayLabel: string; score: number; zone: StressZone; sleepHours: number }[] = [
      { date: '2026-09-04', dayLabel: 'Fri', score: 42, zone: 'medium', sleepHours: 6.5 },
      { date: '2026-09-05', dayLabel: 'Sat', score: 45, zone: 'medium', sleepHours: 7.0 },
      { date: '2026-09-06', dayLabel: 'Sun', score: 40, zone: 'medium', sleepHours: 6.8 },
      { date: '2026-09-07', dayLabel: 'Mon', score: 50, zone: 'medium', sleepHours: 6.2 },
      { date: '2026-09-08', dayLabel: 'Tue', score: 52, zone: 'medium', sleepHours: 5.8 },
      { date: '2026-09-09', dayLabel: 'Wed', score: 46, zone: 'medium', sleepHours: 6.5 },
      { date: '2026-09-10', dayLabel: 'Today', score: 48, zone: 'medium', sleepHours: 6.4 },
    ];
    const initialWeeklySleepAvg = Number(
      (initialWeekly.reduce((sum, d) => sum + d.sleepHours, 0) / initialWeekly.length).toFixed(1)
    );

    const newOfficer: ArmyOfficer = {
      id: newOfficerId,
      name,
      email,
      rank: 'Captain',
      unit: 'Operational Command Group',
      serviceNumber: `USA-${Math.floor(1000 + Math.random() * 9000)}-${name.substring(0, 2).toUpperCase()}`,
      status: 'Active Duty',
      currentStressScore: 48,
      zone: 'medium',
      lastAssessmentDate: 'Not yet assessed',
      sleepHoursAvg: initialWeeklySleepAvg,
      weeklyHistory: initialWeekly,
      monthlyHistory: Array.from({ length: 30 }, (_, i) => {
        const d = new Date('2026-09-10');
        d.setDate(d.getDate() - (29 - i));
        const s = 40 + Math.round(Math.sin(i / 2) * 12);
        const z: StressZone = s >= 70 ? 'high' : s >= 36 ? 'medium' : 'low';
        return {
          date: d.toISOString().split('T')[0],
          dayLabel: i === 29 ? 'Today' : `${d.getDate()}`,
          score: s,
          zone: z,
        };
      }),
      categoryBreakdown: [
        { category: 'cognitive', score: 52, max: 100, label: 'Cognitive Task Saturation', description: 'Mental workload and multi-objective pressure', color: '#38bdf8' },
        { category: 'control', score: 46, max: 100, label: 'Loss of Operational Autonomy', description: 'Environmental friction and schedule shifts', color: '#fbbf24' },
        { category: 'hypervigilance', score: 48, max: 100, label: 'Somatic Hyperarousal & Tension', description: 'Sympathetic arousal and muscle rigidity', color: '#f87171' },
        { category: 'fatigue', score: 54, max: 100, label: 'Sleep & Physical Exhaustion', description: 'Sleep debt and physical depletion', color: '#c084fc' },
        { category: 'emotional', score: 40, max: 100, label: 'Affective Strain & Irritability', description: 'Frustration tolerance and interpersonal friction', color: '#fb923c' },
      ],
      messages: [
        {
          id: `msg-welcome-${Date.now()}`,
          officerId: newOfficerId,
          senderName: 'Dr. Evelyn Reed',
          senderRole: 'Chief Medical Officer',
          timestamp: '2026-09-10 09:00',
          subject: 'Welcome to Aghorveera Stress Monitoring System',
          content: `Welcome to active monitoring. Please complete your baseline 15-question Daily Stress Assessment tab today to calibrate your biometric readiness and sleep calculation.`,
          prescribedAction: 'Complete initial 15-question Daily Assessment',
          priority: 'routine',
          read: false,
          acknowledged: false,
        },
      ],
    };

    setOfficers((prev) => [newOfficer, ...prev]);

    setCurrentUser({
      id: newOfficerId,
      name,
      email,
      role: 'army_officer',
      rank: 'Captain',
      unit: 'Operational Command Group',
      officerId: newOfficerId,
    });
    setActiveTab('hero');
    return true;
  };

  const loginWithGoogle = async (intendedRole: UserRole = 'army_officer'): Promise<boolean> => {
    try {
      const { profile } = await signInWithGoogle(intendedRole);

      if (profile.role === 'healthcare_officer') {
        setCurrentUser({
          id: profile.uid,
          name: profile.displayName || 'Dr. Evelyn Reed (CMO)',
          email: profile.email,
          role: 'healthcare_officer',
          rank: profile.rank || 'Major (Medical)',
          unit: profile.unit || 'Battalion Medical Corps',
        });
        setActiveTab('hero');
        return true;
      }

      // Army Officer flow
      let matched = officers.find(
        (o) => o.email.toLowerCase() === profile.email.toLowerCase() || o.id === profile.uid
      );

      if (!matched) {
        matched = {
          id: profile.uid,
          name: profile.displayName || 'Officer Vance',
          email: profile.email,
          rank: profile.rank || 'Captain',
          unit: profile.unit || '1st Rapid Reaction Battalion',
          serviceNumber: profile.serviceNumber || `MIL-${Math.floor(100000 + Math.random() * 900000)}`,
          status: 'Active Duty',
          currentStressScore: 78,
          zone: 'high',
          lastAssessmentDate: new Date().toISOString().split('T')[0],
          sleepHoursAvg: 6.2,
          weeklyHistory: [
            { date: '2026-09-05', dayLabel: 'Mon', score: 62, zone: 'medium', sleepHours: 6.5 },
            { date: '2026-09-06', dayLabel: 'Tue', score: 68, zone: 'medium', sleepHours: 6.0 },
            { date: '2026-09-07', dayLabel: 'Wed', score: 74, zone: 'high', sleepHours: 5.5 },
            { date: '2026-09-08', dayLabel: 'Thu', score: 81, zone: 'high', sleepHours: 5.0 },
            { date: '2026-09-09', dayLabel: 'Fri', score: 79, zone: 'high', sleepHours: 6.0 },
            { date: '2026-09-10', dayLabel: 'Sat', score: 83, zone: 'high', sleepHours: 5.5 },
            { date: '2026-09-11', dayLabel: 'Sun', score: 78, zone: 'high', sleepHours: 6.0 },
          ],
          monthlyHistory: [...officers[0].monthlyHistory],
          categoryBreakdown: [
            { category: 'control', score: 76, max: 100, label: 'Unpredictability & Perceived Control', description: 'Decision load under volatile operational conditions', color: '#38bdf8' },
            { category: 'cognitive', score: 72, max: 100, label: 'Cognitive Overload & Multitasking', description: 'Mental fatigue and situational tracking density', color: '#818cf8' },
            { category: 'hypervigilance', score: 84, max: 100, label: 'Somatic Hyperarousal & Tension', description: 'Sympathetic arousal and muscle rigidity', color: '#f87171' },
            { category: 'fatigue', score: 80, max: 100, label: 'Sleep & Physical Exhaustion', description: 'Sleep debt and physical depletion', color: '#c084fc' },
            { category: 'emotional', score: 68, max: 100, label: 'Affective Strain & Irritability', description: 'Frustration tolerance and interpersonal friction', color: '#fb923c' },
          ],
          messages: [
            {
              id: `msg-google-${Date.now()}`,
              officerId: profile.uid,
              senderName: 'Dr. Evelyn Reed',
              senderRole: 'Chief Medical Officer',
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
              subject: 'Google Account & Firebase Persistence Authenticated',
              content: `Officer ${profile.displayName}, your identity has been securely verified via Firebase Google Sign-In. Real-time stress biometric tracking and healthcare consultation channels are active.`,
              prescribedAction: 'Complete the daily 15-question assessment to update your operational telemetry.',
              priority: 'routine',
              read: false,
              acknowledged: false,
            },
          ],
        };

        setOfficers((prev) => [matched!, ...prev]);
        persistOfficerToFirestore(matched);
      }

      setCurrentUser({
        id: matched.id,
        name: `${matched.rank} ${matched.name}`,
        email: matched.email,
        role: 'army_officer',
        rank: matched.rank,
        unit: matched.unit,
        officerId: matched.id,
      });
      setActiveTab('hero');
      return true;
    } catch (err: any) {
      console.error('Firebase Google Login failed:', err);
      throw err;
    }
  };

  const logout = () => {
    signOutUser();
    setCurrentUser(null);
    setActiveTab('hero');
  };

  const selectOfficerAsActive = (officerId: string) => {
    const o = officers.find((item) => item.id === officerId);
    if (o) {
      setCurrentUser({
        id: o.id,
        name: `${o.rank} ${o.name}`,
        email: o.email,
        role: 'army_officer',
        rank: o.rank,
        unit: o.unit,
        officerId: o.id,
      });
      setActiveTab('hero');
    }
  };

  const submitAssessment = (answers: Record<number, number>): AssessmentSubmission => {
    const targetOfficerId = currentOfficer ? currentOfficer.id : officers[0].id;
    const { score, zone, categoryScores, primaryStressDriver, clinicalSummary, sleepHours } = calculateAssessmentScore(answers);

    const submission: AssessmentSubmission = {
      id: `sub-${Date.now()}`,
      officerId: targetOfficerId,
      timestamp: new Date().toISOString(),
      score,
      zone,
      answers,
      primaryStressDriver,
      clinicalSummary,
      sleepHoursReported: sleepHours,
    };

    const todayIso = new Date().toISOString().split('T')[0];

    setOfficers((prev) =>
      prev.map((off) => {
        if (off.id !== targetOfficerId) return off;

        // Update weekly history with today's score and sleep hours
        const updatedWeekly = [...off.weeklyHistory];
        const lastWeeklyIdx = updatedWeekly.length - 1;
        if (lastWeeklyIdx >= 0) {
          updatedWeekly[lastWeeklyIdx] = {
            date: todayIso,
            dayLabel: 'Today',
            score,
            zone,
            sleepHours,
            notes: `Assessed at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • ${sleepHours}h sleep logged`,
          };
        }

        // Dynamically recalculate the 7-day weekly sleep average
        const updatedWeeklySleepAvg = Number(
          (updatedWeekly.reduce((sum, d) => sum + (d.sleepHours ?? sleepHours), 0) / Math.max(1, updatedWeekly.length)).toFixed(1)
        );

        // Update monthly history
        const updatedMonthly = [...off.monthlyHistory];
        const lastMonthlyIdx = updatedMonthly.length - 1;
        if (lastMonthlyIdx >= 0) {
          updatedMonthly[lastMonthlyIdx] = {
            date: todayIso,
            dayLabel: 'Today',
            score,
            zone,
            sleepHours,
            notes: `Assessed at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          };
        }

        // Update category breakdown
        const updatedCategories = off.categoryBreakdown.map((cat) => {
          if (categoryScores[cat.category] !== undefined) {
            return {
              ...cat,
              score: categoryScores[cat.category],
            };
          }
          return cat;
        });

        // Add automated clinical alert message if score breaches 90 or transitions to High Alert
        const newMessages = [...off.messages];
        if (score > 90) {
          newMessages.unshift({
            id: `alert-critical-90-${Date.now()}`,
            officerId: off.id,
            senderName: 'AGHORVEERA EMERGENCY SENTINEL',
            senderRole: 'Automated Clinical Stress Surveillance',
            senderType: 'system_alert',
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            subject: `🚨 CRITICAL ALERT: Officer ${off.rank} ${off.name} Stress Above 90 (${score}/100)`,
            content: `CRITICAL ATTENTION REQUIRED: Officer ${off.rank} ${off.name} (${off.unit}, Service #${off.serviceNumber}) has reached an acute stress score of ${score}/100, breaching the 90-point safety ceiling. Sleep logged: ${sleepHours} hrs. Primary factor driver: ${primaryStressDriver}. This officer requires immediate clinical healthcare attention and operational intervention.`,
            prescribedAction: 'Immediate medical outreach, direct clinical decompression, and emergency consultation.',
            priority: 'high-alert',
            read: false,
            acknowledged: false,
            isEmergencyAlert: true,
          });
        } else if (zone === 'high' && off.zone !== 'high') {
          newMessages.unshift({
            id: `alert-${Date.now()}`,
            officerId: off.id,
            senderName: 'Aghorveera Medical Automation',
            senderRole: 'Clinical Alert Dispatcher',
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            subject: 'HIGH ALERT ZONE: Automated Assessment Warning',
            content: `Your daily stress assessment generated a score of ${score}/100 with ${sleepHours} hrs sleep logged. Primary stress driver: ${primaryStressDriver}. Medical staff have been alerted. Please execute Tactical Box Breathing immediately in the Solutions tab.`,
            prescribedAction: 'Perform 10-minute Box Breathing session and report to medical staff if dizziness or severe insomnia occurs.',
            priority: 'high-alert',
            read: false,
            acknowledged: false,
          });
        }

        return {
          ...off,
          currentStressScore: score,
          zone,
          lastAssessmentDate: todayIso,
          sleepHoursAvg: updatedWeeklySleepAvg,
          weeklyHistory: updatedWeekly,
          monthlyHistory: updatedMonthly,
          categoryBreakdown: updatedCategories,
          messages: newMessages,
          submissionsHistory: [submission, ...(off.submissionsHistory || [])],
        };
      })
    );

    setLatestSubmission(submission);
    return submission;
  };

  const sendMessageToOfficer = (
    officerId: string,
    messageData: { subject: string; content: string; prescribedAction?: string; priority: 'routine' | 'urgent' | 'high-alert' }
  ) => {
    const newMsg: HealthcareMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      officerId,
      senderName: currentUser?.name || 'Dr. Evelyn Reed',
      senderRole: 'Healthcare Officer / Operational Physician',
      senderType: 'healthcare_officer',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      subject: messageData.subject,
      content: messageData.content,
      prescribedAction: messageData.prescribedAction,
      priority: messageData.priority,
      read: false,
      acknowledged: false,
    };

    setOfficers((prev) =>
      prev.map((off) => {
        if (off.id === officerId) {
          return {
            ...off,
            messages: [newMsg, ...off.messages],
          };
        }
        return off;
      })
    );
  };

  const sendMessageToHealthcare = (
    officerId: string,
    messageData: { subject: string; content: string; priority?: 'routine' | 'urgent' | 'high-alert' }
  ) => {
    const off = officers.find((o) => o.id === officerId) || currentOfficer;
    const senderRankAndName = off ? `${off.rank} ${off.name}` : (currentUser?.name || 'Army Officer');
    const senderUnit = off?.unit || 'Operational Command';

    const newMsg: HealthcareMessage = {
      id: `officer-msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      officerId,
      senderName: senderRankAndName,
      senderRole: `Officer (${senderUnit})`,
      senderType: 'officer',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      subject: messageData.subject || 'Direct Request to Healthcare Officer',
      content: messageData.content,
      priority: messageData.priority || 'urgent',
      read: false,
      acknowledged: false,
    };

    setOfficers((prev) =>
      prev.map((item) => {
        if (item.id === officerId) {
          return {
            ...item,
            messages: [newMsg, ...item.messages],
          };
        }
        return item;
      })
    );
  };

  const acknowledgeMessage = (officerId: string, messageId: string) => {
    setOfficers((prev) =>
      prev.map((off) => {
        if (off.id === officerId) {
          return {
            ...off,
            messages: off.messages.map((m) =>
              m.id === messageId ? { ...m, read: true, acknowledged: true } : m
            ),
          };
        }
        return off;
      })
    );
  };

  const markMessageRead = (officerId: string, messageId: string) => {
    setOfficers((prev) =>
      prev.map((off) => {
        if (off.id === officerId) {
          return {
            ...off,
            messages: off.messages.map((m) =>
              m.id === messageId ? { ...m, read: true } : m
            ),
          };
        }
        return off;
      })
    );
  };

  const deleteMessage = (officerId: string, messageId: string) => {
    setOfficers((prev) =>
      prev.map((off) => {
        if (off.id === officerId) {
          return {
            ...off,
            messages: off.messages.filter((m) => m.id !== messageId),
          };
        }
        return off;
      })
    );
  };

  const clearAllMessages = (officerId: string) => {
    setOfficers((prev) =>
      prev.map((off) => {
        if (off.id === officerId) {
          return {
            ...off,
            messages: [],
          };
        }
        return off;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        officers,
        currentOfficer,
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        setTheme,
        login,
        loginWithGoogle,
        register,
        logout,
        selectOfficerAsActive,
        submitAssessment,
        latestSubmission,
        clearLatestSubmission,
        sendMessageToOfficer,
        sendMessageToHealthcare,
        acknowledgeMessage,
        markMessageRead,
        deleteMessage,
        clearAllMessages,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
