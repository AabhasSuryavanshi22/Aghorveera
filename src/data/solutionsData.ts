export interface GuidedSession {
  id: string;
  title: string;
  category: 'Tactical Breathing' | 'Meditation & Mindfulness' | 'Deep Rest (NSDR)' | 'Somatic Release';
  durationMinutes: number;
  cadencePattern?: { inhale: number; hold1: number; exhale: number; hold2: number };
  targetZone: 'all' | 'high' | 'medium' | 'low';
  clinicalBenefit: string;
  instructions: string[];
  audioNarrativeSteps: { label: string; durationSec: number; guide: string }[];
}

export const GUIDED_SESSIONS: GuidedSession[] = [
  {
    id: 'box-breathing',
    title: 'Tactical Box Breathing (Combat Down-Regulation)',
    category: 'Tactical Breathing',
    durationMinutes: 5,
    cadencePattern: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
    targetZone: 'all',
    clinicalBenefit: 'Immediately reduces acute sympathetic arousal, lowers heart rate, and restores prefrontal executive control under extreme pressure.',
    instructions: [
      'Inhale deeply through your nose for 4 seconds, filling lower diaphragm first.',
      'Hold air comfortably in your lungs for 4 seconds without clenching throat.',
      'Exhale smoothly through your mouth for 4 seconds, feeling physical tension drop.',
      'Hold empty lungs calmly for 4 seconds before beginning next cycle.',
    ],
    audioNarrativeSteps: [
      { label: 'Inhale', durationSec: 4, guide: 'Inhale smooth and steady through the nose... 1, 2, 3, 4' },
      { label: 'Hold', durationSec: 4, guide: 'Hold lungs full, release tension in shoulders... 1, 2, 3, 4' },
      { label: 'Exhale', durationSec: 4, guide: 'Exhale slowly through the mouth... 1, 2, 3, 4' },
      { label: 'Hold Empty', durationSec: 4, guide: 'Hold empty and centered... 1, 2, 3, 4' },
    ],
  },
  {
    id: 'nsdr-recovery',
    title: 'Non-Sleep Deep Rest (NSDR Military Rest Protocol)',
    category: 'Deep Rest (NSDR)',
    durationMinutes: 12,
    targetZone: 'high',
    clinicalBenefit: 'Accelerates dopamine recovery, discharges accumulated neuro-muscular fatigue, and replaces up to 2 hours of lost restorative slow-wave sleep.',
    instructions: [
      'Lie supine or lean back in a comfortable chair with neck supported.',
      'Allow your eyes to gently close, and take two deep physiological sighs.',
      'Mentally scan from the soles of your feet up to your crown, releasing tone.',
      'Maintain wakeful hypo-metabolic stillness while listening to the pacing cues.',
    ],
    audioNarrativeSteps: [
      { label: 'Grounding & Posture', durationSec: 60, guide: 'Settle your posture. Feel gravity grounding your limbs. Release your jaw and eyebrows.' },
      { label: 'Diaphragmatic Breath Shift', durationSec: 120, guide: 'Deep double inhale through the nose, long sighing exhale through the mouth. Reset your autonomic rhythm.' },
      { label: 'Progressive Body Scan', durationSec: 240, guide: 'Shift awareness to feet, calves, spine, shoulders. Let every muscle group power down.' },
      { label: 'Hypometabolic Rest', durationSec: 240, guide: 'Hover in pure effortless awareness between sleep and waking. The brain is clearing metabolic waste.' },
      { label: 'Gradual Return to Readiness', durationSec: 60, guide: 'Slowly wiggle your fingers, deepen the breath, open your eyes with renewed mental clarity.' },
    ],
  },
  {
    id: 'tactical-sleep-478',
    title: '4-7-8 Pre-Sleep Autonomic Switch',
    category: 'Tactical Breathing',
    durationMinutes: 8,
    cadencePattern: { inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
    targetZone: 'high',
    clinicalBenefit: 'Triggers parasympathetic dominance by stimulating the vagus nerve, reducing sleep onset latency in noisy or unpredictable operational barracks.',
    instructions: [
      'Tip of tongue rested gently against tissue behind upper front teeth.',
      'Inhale quietly through nose for 4 seconds.',
      'Hold breath steadily for 7 seconds.',
      'Exhale audibly through mouth making a gentle "whoosh" sound for 8 seconds.',
    ],
    audioNarrativeSteps: [
      { label: 'Inhale', durationSec: 4, guide: 'Inhale deep nasal air for 4 seconds.' },
      { label: 'Hold', durationSec: 7, guide: 'Sustain comfortable hold for 7 seconds.' },
      { label: 'Long Exhale', durationSec: 8, guide: 'Slow, steady 8-second exhale releasing all residual stress.' },
    ],
  },
  {
    id: 'somatic-tension-release',
    title: 'Progressive Muscle Relaxation (PMR Combat Reset)',
    category: 'Somatic Release',
    durationMinutes: 10,
    targetZone: 'medium',
    clinicalBenefit: 'Eliminates subconscious micro-spasms and postural hyper-vigilance developed from body armor and extended tactical alert posture.',
    instructions: [
      'Isolate specific muscle groups (hands, forearms, traps, quadriceps).',
      'Tightly clench muscle group for 5 seconds at 70% maximum effort.',
      'Abruptly release and note the contrast of warm blood flow and relaxation for 15 seconds.',
      'Repeat systematically through 8 primary muscle sectors.',
    ],
    audioNarrativeSteps: [
      { label: 'Fists & Forearms', durationSec: 60, guide: 'Clench fists hard... hold tension... and release completely. Feel the warmth spread.' },
      { label: 'Shoulders & Neck Traps', durationSec: 90, guide: 'Shrug shoulders up to your ears... hold tight against armor fatigue... and drop them down.' },
      { label: 'Core & Diaphragm', durationSec: 90, guide: 'Brace the abdominal wall... hold... relax and let the belly soften.' },
      { label: 'Legs & Calves', durationSec: 90, guide: 'Tense quads and flex calves... hold... release into complete heaviness.' },
    ],
  },
  {
    id: 'mindful-focus-centering',
    title: 'Pre-Mission Centering & Attentional Anchor',
    category: 'Meditation & Mindfulness',
    durationMinutes: 6,
    targetZone: 'low',
    clinicalBenefit: 'Sharpens target discrimination, limits tunnel vision, and buffers cognitive reserves against upcoming situational chaos.',
    instructions: [
      'Maintain an upright, alert, dignified tactical seated posture.',
      'Anchor sensory attention at the tip of the nostrils or chest rise.',
      'When thoughts of future missions intrude, note them neutrally as "data" and return to the breath.',
    ],
    audioNarrativeSteps: [
      { label: 'Alert Stillness', durationSec: 60, guide: 'Sit tall, spine erect, eyes softly resting on a point in front of you.' },
      { label: 'Sensory Anchoring', durationSec: 120, guide: 'Focus all attention on the physical sensation of air crossing the upper lip.' },
      { label: 'Attentional Shield', durationSec: 120, guide: 'Allow external sounds to exist without reacting. You are the calm center of the storm.' },
      { label: 'Intentional Focus', durationSec: 60, guide: 'Lock in your core duty objective for the remainder of your shift. Steady and focused.' },
    ],
  },
];

export interface TacticalStrategy {
  category: string;
  title: string;
  recommendation: string;
  urgency: 'routine' | 'priority' | 'urgent';
  domain: string;
}

export const STRESS_STRATEGIES: Record<string, TacticalStrategy[]> = {
  high: [
    {
      category: 'Immediate Down-Regulation',
      title: 'Active Parasympathetic Override',
      recommendation: 'Perform 3 sets of 4x4 Tactical Box Breathing every 2 hours. Minimize caffeine consumption past 13:00 to prevent compounding adrenergic overload.',
      urgency: 'urgent',
      domain: 'Somatic & Autonomic',
    },
    {
      category: 'Sleep Preservation',
      title: 'Protected 7-Hour Recovery Dark Window',
      recommendation: 'Request squad lead assignment rotation to safeguard an unbroken 7-hour barracks sleep block. Utilize blackout eye covering and 4-7-8 breathing protocol.',
      urgency: 'urgent',
      domain: 'Sleep Architecture',
    },
    {
      category: 'Clinical Escalation',
      title: 'Healthcare Officer Clinical Telehealth',
      recommendation: 'Acknowledge medical orders from your assigned Healthcare Officer and complete scheduled 1-on-1 check-in to assess temporary duty load adjustments.',
      urgency: 'urgent',
      domain: 'Medical Care',
    },
  ],
  medium: [
    {
      category: 'Workload Pacing',
      title: 'Cognitive Task Chunking & Defusion',
      recommendation: 'Delegate tertiary administrative requirements. Break multi-tier tactical operations into 45-minute focused blocks followed by 5-minute physical resets.',
      urgency: 'priority',
      domain: 'Operational Workload',
    },
    {
      category: 'Physical Decompression',
      title: 'Post-Duty Progressive Relaxation',
      recommendation: 'Conduct 10-minute Progressive Muscle Relaxation (PMR) to clear tactical hypervigilance and armor-induced spinal tension before entering quarters.',
      urgency: 'priority',
      domain: 'Somatic Tension',
    },
    {
      category: 'Peer Cohesion',
      title: 'Informal Tactical After-Action Debrief',
      recommendation: 'Engage with peer officers or squad leader to process high-friction operational delays. Shared debriefing mitigates internalized irritability.',
      urgency: 'priority',
      domain: 'Emotional Regulation',
    },
  ],
  low: [
    {
      category: 'Resilience Fortification',
      title: 'Zone Preservation & Autonomic Recovery',
      recommendation: 'Continue structured zone-2 aerobic conditioning (30-40 min) and maintain field hydration standards (3-4L daily).',
      urgency: 'routine',
      domain: 'Physiological Buffer',
    },
    {
      category: 'Mental Sharpness',
      title: 'Pre-Mission Centering & Focus Anchoring',
      recommendation: 'Use 5-minute mindfulness anchoring prior to tactical planning sessions to preserve situational awareness and decision speed.',
      urgency: 'routine',
      domain: 'Cognitive Agility',
    },
    {
      category: 'Squad Leadership',
      title: 'Squad Stress Reconnaissance',
      recommendation: 'Your reserves are optimal; maintain proactive watch on peers and junior enlisted exhibiting fatigue markers or behavioral withdrawal.',
      urgency: 'routine',
      domain: 'Peer Support',
    },
  ],
};
