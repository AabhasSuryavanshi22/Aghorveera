export type UserRole = 'army_officer' | 'healthcare_officer';

export type AppTheme = 'dark' | 'light';

export type StressZone = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  rank?: string;
  unit?: string;
  officerId?: string;
}

export interface StressDataPoint {
  date: string;
  dayLabel: string;
  score: number;
  zone: StressZone;
  notes?: string;
  sleepHours?: number; // hours of sleep logged for this day
}

export interface StressCategoryBreakdown {
  category: string;
  score: number; // 0 - 100
  max: number;
  label: string;
  description: string;
  color: string;
}

export interface HealthcareMessage {
  id: string;
  officerId: string;
  senderName: string;
  senderRole: string;
  senderType?: 'officer' | 'healthcare_officer' | 'system_alert';
  timestamp: string;
  subject: string;
  content: string;
  prescribedAction?: string;
  priority: 'routine' | 'urgent' | 'high-alert';
  read: boolean;
  acknowledged: boolean;
  isEmergencyAlert?: boolean;
}

export interface AssessmentOption {
  value: number;
  label: string;
  labelHi?: string;
  description: string;
  descriptionHi?: string;
  hours?: number;
}

export interface AssessmentQuestion {
  id: number;
  prompt: string;
  promptHi?: string;
  clinicalDomain: string;
  clinicalDomainHi?: string;
  scientificReference: string;
  isReverseScored: boolean; // e.g. "Felt confident in your ability to handle tasks"
  category: 'cognitive' | 'fatigue' | 'emotional' | 'hypervigilance' | 'control';
  isSleepQuestion?: boolean; // Dedicated question to log sleep hours
  customOptions?: AssessmentOption[];
}

export interface AssessmentSubmission {
  id: string;
  officerId: string;
  timestamp: string;
  score: number; // 0 - 100
  zone: StressZone;
  answers: Record<number, number>;
  primaryStressDriver: string;
  clinicalSummary: string;
  sleepHoursReported?: number;
}

export interface ArmyOfficer {
  id: string;
  name: string;
  email: string;
  rank: string;
  unit: string;
  serviceNumber: string;
  status: 'Active Duty' | 'Field Deployed' | 'Standby' | 'Medical Hold';
  currentStressScore: number; // 0 - 100
  zone: StressZone;
  lastAssessmentDate: string;
  sleepHoursAvg: number; // Calculated 7-day average sleep hours
  weeklyHistory: StressDataPoint[]; // 7 days
  monthlyHistory: StressDataPoint[]; // 30 days
  categoryBreakdown: StressCategoryBreakdown[];
  messages: HealthcareMessage[];
  submissionsHistory?: AssessmentSubmission[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
