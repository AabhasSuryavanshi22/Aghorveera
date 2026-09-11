import { ArmyOfficer, StressDataPoint, StressCategoryBreakdown, HealthcareMessage } from '../types';

const OFFICER_NAMES_RANKS = [
  { name: 'Marcus Vance', rank: 'Captain', unit: '101st Airborne Div, Charlie Co', service: 'USA-8921-MV' },
  { name: 'Elena Rostova', rank: 'Major', unit: '3rd Armored Brigade Combat Team', service: 'USA-7741-ER' },
  { name: 'David Brody', rank: '1st Lieutenant', unit: '82nd Airborne Div, Bravo Co', service: 'USA-6623-DB' },
  { name: 'Sarah Chen', rank: 'Captain', unit: '10th Mountain Div, 2nd BCT', service: 'USA-9102-SC' },
  { name: 'James Miller', rank: 'Major', unit: '1st Cavalry Div, Ironhorse', service: 'USA-5412-JM' },
  { name: 'Aaliyah Morales', rank: '2nd Lieutenant', unit: '4th Infantry Div, Ivy Strike', service: 'USA-8320-AM' },
  { name: 'Robert Callahan', rank: 'Master Sergeant', unit: '75th Ranger Regt, 3rd Bn', service: 'USA-4309-RC' },
  { name: 'Chloe Dubois', rank: 'Captain', unit: '1st Armored Div, Old Ironsides', service: 'USA-7611-CD' },
  { name: 'Nathaniel Drake', rank: 'Staff Sergeant', unit: '25th Infantry Div, Tropic Lightning', service: 'USA-6701-ND' },
  { name: 'Maya Patel', rank: 'Chief Warrant Officer 3', unit: '160th SOAR (Night Stalkers)', service: 'USA-9932-MP' },
  { name: 'Victor Henderson', rank: 'Major', unit: '1st Infantry Div (Big Red One)', service: 'USA-3211-VH' },
  { name: 'Liam O\'Connor', rank: 'Captain', unit: '3rd Infantry Div, Marne Pride', service: 'USA-5519-LO' },
  { name: 'Sophia Reyes', rank: '1st Lieutenant', unit: '10th Mountain Div, Aviation Bde', service: 'USA-8190-SR' },
  { name: 'Derrick Washington', rank: 'First Sergeant', unit: '1st Marine Expeditionary Force', service: 'USA-4432-DW' },
  { name: 'Grace Kim', rank: 'Captain', unit: '7th Special Forces Group Support', service: 'USA-7822-GK' },
  { name: 'Ethan Huntley', rank: '2nd Lieutenant', unit: '2nd Cavalry Regiment, Dragoon', service: 'USA-6124-EH' },
  { name: 'Isabella Rossi', rank: 'Major', unit: '82nd Airborne, 505th PIR', service: 'USA-9021-IR' },
  { name: 'Noah Jenkins', rank: 'Staff Sergeant', unit: '173rd Airborne Brigade', service: 'USA-3341-NJ' },
  { name: 'Ava Montgomery', rank: 'Captain', unit: '3rd Security Force Assistance Bde', service: 'USA-5823-AM' },
  { name: 'Lucas Sterling', rank: '1st Lieutenant', unit: '11th Airborne Div, Arctic Angels', service: 'USA-7219-LS' },
  { name: 'Amara Okafor', rank: 'Major', unit: '1st Stryker Brigade, Ghost', service: 'USA-8812-AO' },
  { name: 'Gabriel Torres', rank: 'Master Sergeant', unit: '5th Security Force Assistance Bde', service: 'USA-4911-GT' },
  { name: 'Olivia Bennett', rank: 'Captain', unit: '2nd Infantry Div (Warrior Div)', service: 'USA-6430-OB' },
  { name: 'Mason Brooks', rank: '2nd Lieutenant', unit: '1st Marine Raider Support Bn', service: 'USA-7391-MB' },
  { name: 'Harper Castillo', rank: 'Chief Warrant Officer 2', unit: '1st Special Forces Operational Det', service: 'USA-9510-HC' },
  { name: 'Alexander Wright', rank: 'Major', unit: '36th Infantry Div, Lone Star', service: 'USA-3814-AW' },
  { name: 'Emily Larson', rank: '1st Lieutenant', unit: '28th Infantry Div, Keystone', service: 'USA-6277-EL' },
  { name: 'Julian Foster', rank: 'Captain', unit: '34th Infantry Div, Red Bull', service: 'USA-7489-JF' },
  { name: 'Zoe Nakamura', rank: 'Staff Sergeant', unit: '40th Infantry Div, Sunburst', service: 'USA-5190-ZN' },
  { name: 'Benjamin Hayes', rank: 'First Sergeant', unit: '29th Infantry Div, Blue and Gray', service: 'USA-4621-BH' },
  { name: 'Charlotte Bailey', rank: 'Captain', unit: '1st Cavalry Div, 1st BCT', service: 'USA-8032-CB' },
  { name: 'Jackson Ramirez', rank: '2nd Lieutenant', unit: '10th Mountain Div, 1st BCT', service: 'USA-6912-JR' },
  { name: 'Scarlett Novak', rank: 'Major', unit: '4th Infantry Div, 2nd Stryker', service: 'USA-9451-SN' },
  { name: 'Levi Kowalski', rank: 'Staff Sergeant', unit: '1st Armored Div, Strike BCT', service: 'USA-5712-LK' },
  { name: 'Victoria Santos', rank: 'Captain', unit: '82nd Airborne, 325th AIR', service: 'USA-7182-VS' },
  { name: 'Owen Fletcher', rank: '1st Lieutenant', unit: '3rd Armored Cavalry, Sabre', service: 'USA-6831-OF' },
  { name: 'Penelope Diaz', rank: 'Chief Warrant Officer 4', unit: 'Aviation Center of Excellence', service: 'USA-9830-PD' },
  { name: 'Wyatt Zimmerman', rank: 'Master Sergeant', unit: '101st Airborne, 502nd PIR', service: 'USA-4209-WZ' },
  { name: 'Riley Faulkner', rank: 'Captain', unit: '2nd Stryker BCT, Lancer', service: 'USA-7721-RF' },
  { name: 'Sebastian Cruz', rank: '2nd Lieutenant', unit: '25th Infantry Div, 1st BCT', service: 'USA-6399-SC' },
  { name: 'Aria Sinclair', rank: 'Major', unit: 'Special Warfare Center & School', service: 'USA-9128-AS' },
  { name: 'Daniel Hoffman', rank: 'Staff Sergeant', unit: '173rd Airborne, 503rd Infantry', service: 'USA-5310-DH' },
  { name: 'Layla Al-Mansoor', rank: 'Captain', unit: 'Defense Intelligence Task Unit', service: 'USA-8433-LA' },
  { name: 'Henry Strickland', rank: 'First Sergeant', unit: '3rd Infantry Div, 1st Armor', service: 'USA-4518-HS' },
  { name: 'Nora Higgins', rank: '1st Lieutenant', unit: '11th Airborne Div, Arctic Falcon', service: 'USA-6944-NH' },
  { name: 'Caleb Rhodes', rank: 'Major', unit: 'Joint Special Operations Command', service: 'USA-9721-CR' },
  { name: 'Audrey Mercer', rank: '2nd Lieutenant', unit: '4th Security Force Assistance Bde', service: 'USA-6580-AM' },
  { name: 'Samuel Jensen', rank: 'Staff Sergeant', unit: '1st Marine Div, 5th Marines', service: 'USA-5619-SJ' },
  { name: 'Hannah Gutierrez', rank: 'Captain', unit: '82nd Combat Aviation Brigade', service: 'USA-8291-HG' },
  { name: 'Leo Valentine', rank: 'Major', unit: 'Cyber Warfare Support Brigade', service: 'USA-9015-LV' }
];

// Helper to generate realistic weekly and monthly curve around a baseline score
function generateHistory(baseline: number, variance: number): { weekly: StressDataPoint[]; monthly: StressDataPoint[] } {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
  const today = new Date('2026-09-10');

  const monthly: StressDataPoint[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    // Add realistic cyclical wave + pseudo-random noise
    const wave = Math.sin(i / 3) * (variance * 0.7);
    const noise = ((i * 17 + baseline * 7) % (variance * 2)) - variance;
    const score = Math.min(98, Math.max(12, Math.round(baseline + wave + noise * 0.5)));
    
    let zone: 'low' | 'medium' | 'high' = 'low';
    if (score >= 70) zone = 'high';
    else if (score >= 36) zone = 'medium';

    const dayStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    monthly.push({
      date: d.toISOString().split('T')[0],
      dayLabel: i === 0 ? 'Today' : (i % 5 === 0 ? dayStr : `${d.getDate()}`),
      score,
      zone,
      notes: score >= 70 ? 'High operational tempo / simulated night exercise' : undefined,
    });
  }

  // Weekly is last 7 days of monthly with calculated sleep hours
  const baseSleep = baseline >= 70 ? 4.8 : baseline >= 36 ? 6.2 : 7.6;
  const weekly = monthly.slice(23).map((item, idx) => {
    // Realistic sleep variance per day
    const dayNoise = (((idx * 13 + baseline * 3) % 15) - 7) * 0.1;
    const daySleep = Number(Math.max(3.2, Math.min(9.5, baseSleep + dayNoise)).toFixed(1));
    return {
      ...item,
      dayLabel: daysOfWeek[idx] || item.dayLabel,
      sleepHours: daySleep,
    };
  });

  return { weekly, monthly };
}

function generateCategories(stressScore: number): StressCategoryBreakdown[] {
  const mult = stressScore / 50;
  return [
    {
      category: 'cognitive',
      score: Math.min(100, Math.max(15, Math.round(48 * mult + ((stressScore % 7) - 3) * 3))),
      max: 100,
      label: 'Cognitive Task Saturation',
      description: 'Mental workload, multi-objective decision pressure, and working memory demand.',
      color: '#38bdf8',
    },
    {
      category: 'control',
      score: Math.min(100, Math.max(10, Math.round(42 * mult + ((stressScore % 5) - 2) * 4))),
      max: 100,
      label: 'Loss of Operational Autonomy',
      description: 'Frustration over sudden orders, uncontrollable logistical friction, and schedule shifts.',
      color: '#fbbf24',
    },
    {
      category: 'hypervigilance',
      score: Math.min(100, Math.max(15, Math.round(52 * mult + ((stressScore % 9) - 4) * 2))),
      max: 100,
      label: 'Somatic Hyperarousal & Tension',
      description: 'Sympathetic nervous state, muscle rigidity, elevated baseline startle response.',
      color: '#f87171',
    },
    {
      category: 'fatigue',
      score: Math.min(100, Math.max(20, Math.round(56 * mult + ((stressScore % 4) - 2) * 5))),
      max: 100,
      label: 'Sleep & Physical Exhaustion',
      description: 'Cumulative sleep debt, physical energy depletion, and compromised recovery.',
      color: '#c084fc',
    },
    {
      category: 'emotional',
      score: Math.min(100, Math.max(10, Math.round(38 * mult + ((stressScore % 6) - 3) * 3))),
      max: 100,
      label: 'Affective Strain & Irritability',
      description: 'Irritability, reduced frustration tolerance in team interactions, emotional burnout.',
      color: '#fb923c',
    },
  ];
}

// Generate the 50 officers
export const INITIAL_OFFICERS: ArmyOfficer[] = OFFICER_NAMES_RANKS.map((item, index) => {
  const id = `officer-${index + 1}`;
  
  // Distribute scores:
  // First 8 officers: High Alert (72 - 94)
  // Next 18 officers: Medium Stress (38 - 68)
  // Remaining 24 officers: Low Stress (16 - 34)
  let currentStressScore = 25;
  if (index < 9) {
    // High alert officers
    currentStressScore = 72 + ((index * 3) % 22);
  } else if (index < 27) {
    // Medium alert officers
    currentStressScore = 38 + ((index * 4) % 30);
  } else {
    // Low stress officers
    currentStressScore = 18 + ((index * 2) % 17);
  }

  let zone: 'low' | 'medium' | 'high' = 'low';
  if (currentStressScore >= 70) zone = 'high';
  else if (currentStressScore >= 36) zone = 'medium';

  const { weekly, monthly } = generateHistory(currentStressScore, 14);
  // Ensure the last reading matches currentStressScore
  weekly[weekly.length - 1].score = currentStressScore;
  weekly[weekly.length - 1].zone = zone;
  monthly[monthly.length - 1].score = currentStressScore;
  monthly[monthly.length - 1].zone = zone;

  const categories = generateCategories(currentStressScore);

  const initialMessages: HealthcareMessage[] = [];
  if (zone === 'high') {
    initialMessages.push({
      id: `msg-${id}-1`,
      officerId: id,
      senderName: 'Dr. Evelyn Reed',
      senderRole: 'Chief Medical Officer / Operational Psychologist',
      timestamp: '2026-09-09 16:45',
      subject: 'URGENT: High Autonomic Stress Detected - Protocol Alpha',
      content: `Captain, your continuous biometrics and recent PSS-10 index indicate critical autonomic hyperarousal (${currentStressScore}/100) and cumulative sleep debt. You are ordered to execute two 10-minute Box Breathing cycles prior to mission debrief and limit caffeine intake past 1400 hrs. Please acknowledge and schedule a 15-minute clinical telehealth check-in.`,
      prescribedAction: 'Mandatory 10-minute Tactical Box Breathing + Telehealth consult at 0800',
      priority: 'high-alert',
      read: false,
      acknowledged: false,
    });
  } else if (zone === 'medium') {
    initialMessages.push({
      id: `msg-${id}-1`,
      officerId: id,
      senderName: 'Dr. Evelyn Reed',
      senderRole: 'Chief Medical Officer',
      timestamp: '2026-09-08 10:20',
      subject: 'Stress Trend Advisory: Elevated Fatigue Factor',
      content: `Your stress metrics have drifted up to ${currentStressScore}/100 over the past 72 hours, predominantly in physical exhaustion and cognitive workload. Ensure you take advantage of the Non-Sleep Deep Rest (NSDR) audio modules in your Solutions tab tonight.`,
      prescribedAction: 'Complete 15-minute NSDR session before sleep',
      priority: 'urgent',
      read: true,
      acknowledged: false,
    });
  } else if (index % 4 === 0) {
    initialMessages.push({
      id: `msg-${id}-1`,
      officerId: id,
      senderName: 'Dr. Evelyn Reed',
      senderRole: 'Chief Medical Officer',
      timestamp: '2026-09-07 09:15',
      subject: 'Weekly Health Clearance: Optimal Readiness',
      content: `Your biometrics indicate stable autonomic homeostasis (${currentStressScore}/100). Keep maintaining regular sleep cycles and field hydration. Outstanding discipline.`,
      prescribedAction: 'Maintain current physical training regimen and hydration schedule',
      priority: 'routine',
      read: true,
      acknowledged: true,
    });
  }

  // Calculate exact weekly sleep average from the 7 weekly data points
  const calculatedWeeklySleepAvg = Number(
    (weekly.reduce((sum, d) => sum + (d.sleepHours ?? 7), 0) / Math.max(1, weekly.length)).toFixed(1)
  );

  const statuses: ('Active Duty' | 'Field Deployed' | 'Standby' | 'Medical Hold')[] = [
    'Active Duty',
    'Field Deployed',
    'Active Duty',
    'Active Duty',
    'Field Deployed',
    'Standby',
  ];

  return {
    id,
    name: item.name,
    email: `${item.name.toLowerCase().replace(/[^a-z]/g, '')}@aghorveera.mil`,
    rank: item.rank,
    unit: item.unit,
    serviceNumber: item.service,
    status: zone === 'high' && index === 0 ? 'Active Duty' : statuses[index % statuses.length],
    currentStressScore,
    zone,
    lastAssessmentDate: '2026-09-09',
    sleepHoursAvg: calculatedWeeklySleepAvg,
    weeklyHistory: weekly,
    monthlyHistory: monthly,
    categoryBreakdown: categories,
    messages: initialMessages,
  };
});
