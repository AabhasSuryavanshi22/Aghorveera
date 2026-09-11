import { AssessmentQuestion, StressZone } from '../types';

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 1,
    prompt: 'How often have you been distressed or unsettled by unexpected events or rapid operational shifts?',
    promptHi: 'अप्रत्याशित घटनाओं या तेजी से बदलते सैन्य अभियानों के कारण आप कितनी बार तनावग्रस्त या विचलित महसूस करते हैं?',
    clinicalDomain: 'Unpredictability & Tactical Volatility',
    clinicalDomainHi: 'अनिश्चितता और सामरिक अस्थिरता',
    scientificReference: 'PSS-10 Item 1 / COSC Field Metric (Cohen et al.)',
    isReverseScored: false,
    category: 'cognitive',
  },
  {
    id: 2,
    prompt: 'How often have you felt that you lacked control over key outcomes or circumstances in your operational theater?',
    promptHi: 'अपने कार्यक्षेत्र में महत्वपूर्ण परिणामों या परिस्थितियों पर नियंत्रण की कमी आपने कितनी बार महसूस की है?',
    clinicalDomain: 'Perceived Control Deficit',
    clinicalDomainHi: 'नियंत्रण की कमी का अहसास',
    scientificReference: 'PSS-10 Item 2 / Locus of Control in High-Stress Environments',
    isReverseScored: false,
    category: 'control',
  },
  {
    id: 3,
    prompt: 'How often have you experienced bodily tension, restless hypervigilance, or difficulty down-regulating your autonomic arousal?',
    promptHi: 'शारीरिक तनाव, अत्यधिक सतर्कता (हाइपरविजिलेंस) या अपने तनाव को शांत करने में कठिनाई का अनुभव कितनी बार हुआ?',
    clinicalDomain: 'Physiological Hyperarousal & Sympathetic Tone',
    clinicalDomainHi: 'शारीरिक उत्तेजना और तनाव संवेदनशीलता',
    scientificReference: 'Combat Operational Stress Reaction (COSR) Somatic Battery',
    isReverseScored: false,
    category: 'hypervigilance',
  },
  {
    id: 4,
    prompt: 'How often have you felt confident in your tactical decision-making, judgment, and ability to handle assigned responsibilities?',
    promptHi: 'सामरिक निर्णय लेने, विवेक और सौंपे गए दायित्वों को संभालने की अपनी क्षमता पर आप कितना आश्वस्त महसूस करते हैं?',
    clinicalDomain: 'Operational Self-Efficacy & Resilience',
    clinicalDomainHi: 'कार्यकुशलता और मानसिक दृढ़ता',
    scientificReference: 'PSS-10 Item 4 (Reverse Scored) / Bandura Efficacy Scale',
    isReverseScored: true,
    category: 'cognitive',
  },
  {
    id: 5,
    prompt: 'How often have you felt that your mission tasks, communication, and schedule were progressing smoothly?',
    promptHi: 'आपके मिशन कार्य, संचार और दैनिक समय-सारणी कितनी सुचारू रूप से आगे बढ़ रहे हैं?',
    clinicalDomain: 'Environmental Alignment & Coherence',
    clinicalDomainHi: 'कार्य सामंजस्य और स्थिरता',
    scientificReference: 'PSS-10 Item 5 (Reverse Scored) / Antonovsky Salutogenesis',
    isReverseScored: true,
    category: 'control',
  },
  {
    id: 6,
    prompt: 'How often have you felt that duty requirements, administrative tasks, and cognitive demands were overwhelming your capacity?',
    promptHi: 'कर्तव्य की मांग, प्रशासनिक जिम्मेदारियां और मानसिक दबाव आपकी क्षमता से अधिक या भारी महसूस हुए हैं?',
    clinicalDomain: 'Cognitive Task Saturation & Mental Fatigue',
    clinicalDomainHi: 'मानसिक भार और थकान',
    scientificReference: 'PSS-10 Item 6 / NASA-TLX Operational Workload Scale',
    isReverseScored: false,
    category: 'fatigue',
  },
  {
    id: 7,
    prompt: 'How often have you been able to maintain emotional composure and control interpersonal irritability with squad members or command?',
    promptHi: 'साथी सैनिकों या उच्च अधिकारियों के साथ बातचीत में आपने कितनी बार भावनात्मक संयम और शांति बनाए रखी है?',
    clinicalDomain: 'Affective Self-Regulation & Frustration Tolerance',
    clinicalDomainHi: 'भावनात्मक आत्म-नियंत्रण और सहनशीलता',
    scientificReference: 'PSS-10 Item 7 (Reverse Scored) / Military Leadership Coping Index',
    isReverseScored: true,
    category: 'emotional',
  },
  {
    id: 8,
    prompt: 'How often have you felt on top of priorities, maintaining clear executive function and mental alertness without brain fog?',
    promptHi: 'बिना किसी मानसिक उलझन के प्राथमिकताओं को स्पष्ट रूप से संभालने और मानसिक सतर्कता बनाए रखने में सक्षम रहे हैं?',
    clinicalDomain: 'Executive Function & Attentional Vigilance',
    clinicalDomainHi: 'मानसिक स्पष्टता और निर्णय क्षमता',
    scientificReference: 'PSS-10 Item 8 (Reverse Scored) / Tactical Cognition Battery',
    isReverseScored: true,
    category: 'cognitive',
  },
  {
    id: 9,
    prompt: 'How often have you felt anger, acute frustration, or impatience over friction and delays outside of your direct authority?',
    promptHi: 'अपने अधिकार क्षेत्र से बाहर के विलंब या बाधाओं पर आपको कितनी बार तीव्र गुस्सा, निराशा या अधीरता महसूस हुई है?',
    clinicalDomain: 'Reactive Anger & Autonomic Friction',
    clinicalDomainHi: 'प्रतिक्रियात्मक क्रोध और चिड़चिड़ापन',
    scientificReference: 'PSS-10 Item 9 / State-Trait Anger Expression in Military Squads',
    isReverseScored: false,
    category: 'emotional',
  },
  {
    id: 10,
    prompt: 'How often have you felt operational and personal pressures piling up to the point where you could not effectively decompress or recover?',
    promptHi: 'सैन्य व व्यक्तिगत दबाव इस हद तक बढ़ गए हों कि आप ठीक से आराम या मानसिक तनाव मुक्त नहीं हो पा रहे हों?',
    clinicalDomain: 'Cumulative Allostatic Load & Burnout Risk',
    clinicalDomainHi: 'संचयी तनाव और बर्नआउट जोखिम',
    scientificReference: 'PSS-10 Item 10 / McEwen Allostatic Strain Index',
    isReverseScored: false,
    category: 'fatigue',
  },
  {
    id: 11,
    prompt: 'How many hours of restorative sleep did you achieve in the past 24 hours / during your last operational rest cycle?',
    promptHi: 'पिछले 24 घंटों में या अपने अंतिम विश्राम चक्र के दौरान आपने कितने घंटे की आरामदायक नींद ली?',
    clinicalDomain: 'Sleep Duration & Circadian Recovery',
    clinicalDomainHi: 'नींद की अवधि और शारीरिक रिकवरी',
    scientificReference: 'DoD Sleep Readiness Metric & Walter Reed Army Institute of Research (WRAIR)',
    isReverseScored: false,
    category: 'fatigue',
    isSleepQuestion: true,
    customOptions: [
      { value: 0, label: '8+ Hours', labelHi: '8+ घंटे', description: 'Optimal combat restorative rest', descriptionHi: 'सर्वोत्तम आरामदायक नींद (8+ घंटे)', hours: 8.5 },
      { value: 1, label: '7 - 7.9 Hours', labelHi: '7 - 7.9 घंटे', description: 'Target military operational sleep', descriptionHi: 'मानक सैन्य संचालन नींद', hours: 7.5 },
      { value: 2, label: '5.5 - 6.9 Hours', labelHi: '5.5 - 6.9 घंटे', description: 'Mild sleep debt (alertness decline)', descriptionHi: 'हल्की नींद की कमी (सतर्कता में कमी)', hours: 6.2 },
      { value: 3, label: '4 - 5.4 Hours', labelHi: '4 - 5.4 घंटे', description: 'Moderate sleep deprivation', descriptionHi: 'मध्यम नींद की कमी / थकान', hours: 4.8 },
      { value: 4, label: '< 4 Hours', labelHi: '< 4 घंटे', description: 'Severe acute sleep debt / exhaustion', descriptionHi: 'गंभीर नींद की कमी / अत्यधिक थकान', hours: 3.5 },
    ],
  },
  {
    id: 12,
    prompt: 'How often have you experienced physical tremors, racing heartbeat, or sudden cold sweats during routine, non-combat operational moments?',
    promptHi: 'सामान्य गैर-युद्ध ड्यूटी के दौरान शारीरिक कंपन, दिल की तेज धड़कन या अचानक ठंडा पसीना आने का अनुभव हुआ है?',
    clinicalDomain: 'Somatic Panic & Sympathetic Reactivity',
    clinicalDomainHi: 'शारीरिक घबराहट और अनैच्छिक तनाव',
    scientificReference: 'BSI-18 Somatization Subscale / Armed Forces Health Surveillance',
    isReverseScored: false,
    category: 'hypervigilance',
  },
  {
    id: 13,
    prompt: 'How often have you felt strong mission camaraderie, mutual trust, and psychological safety with your squad members or detachment?',
    promptHi: 'अपने दल (स्क्वाड) के सदस्यों के साथ मजबूत एकजुटता, आपसी विश्वास और मनोवैज्ञानिक सुरक्षा महसूस की है?',
    clinicalDomain: 'Squad Cohesion & Buffering Protective Factors',
    clinicalDomainHi: 'दस्ता एकजुटता और आपसी भरोसा',
    scientificReference: 'DOD COSC Unit Cohesion & Psychological Safety Scale',
    isReverseScored: true,
    category: 'control',
  },
  {
    id: 14,
    prompt: 'How often have you found yourself ruminating, replaying operational friction, or unable to silence recurring tactical memories when attempting to rest?',
    promptHi: 'विश्राम के समय सैन्य घटनाओं को बार-बार याद करने या मन में चल रहे विचारों को शांत न कर पाने की स्थिति बनी?',
    clinicalDomain: 'Intrusive Rumination & Cognitive Replay',
    clinicalDomainHi: 'अवांछित विचार और मानसिक उलझन',
    scientificReference: 'PCL-5 Military Screening Battery (Weathers et al.)',
    isReverseScored: false,
    category: 'emotional',
  },
  {
    id: 15,
    prompt: 'How often have you felt physically and mentally drained to the point where executing standard operational procedures (SOPs) felt burdensome?',
    promptHi: 'शारीरिक और मानसिक रूप से इतना थक गए हों कि मानक संचालन प्रक्रियाओं (SOPs) का पालन करना भी भारी लगा हो?',
    clinicalDomain: 'Operational Exhaustion & Tactical Burnout',
    clinicalDomainHi: 'शारीरिक व मानसिक अत्यधिक थकान',
    scientificReference: 'Maslach Burnout Inventory - General / Defense Workload Survey',
    isReverseScored: false,
    category: 'fatigue',
  },
];

export const SLEEP_HOURS_MAP: Record<number, number> = {
  0: 8.5,
  1: 7.5,
  2: 6.2,
  3: 4.8,
  4: 3.5,
};

export const LIKERT_OPTIONS = [
  { value: 0, label: 'Never', labelHi: 'कभी नहीं', description: '0% of the day', descriptionHi: 'दिन में 0%' },
  { value: 1, label: 'Almost Never', labelHi: 'शायद ही कभी', description: 'Rare / isolated incident', descriptionHi: 'दुर्लभ / कभी-कभार' },
  { value: 2, label: 'Sometimes', labelHi: 'कभी-कभी', description: 'Occasional / 2-3 instances', descriptionHi: 'सामयिक / 2-3 बार' },
  { value: 3, label: 'Fairly Often', labelHi: 'अक्सर', description: 'Frequent / noticeable strain', descriptionHi: 'बार-बार / ध्यान देने योग्य' },
  { value: 4, label: 'Very Often', labelHi: 'हमेशा / बहुत बार', description: 'Persistent / predominant state', descriptionHi: 'लगातार / अत्यधिक' },
];

export function calculateAssessmentScore(
  answers: Record<number, number>,
  exactSleepHours?: number
): {
  score: number;
  zone: StressZone;
  zoneLabel: string;
  categoryScores: Record<string, number>;
  primaryStressDriver: string;
  clinicalSummary: string;
  sleepHours: number;
} {
  let totalRawScore = 0;
  const categoryRaw: Record<string, { sum: number; count: number }> = {
    cognitive: { sum: 0, count: 0 },
    control: { sum: 0, count: 0 },
    hypervigilance: { sum: 0, count: 0 },
    fatigue: { sum: 0, count: 0 },
    emotional: { sum: 0, count: 0 },
  };

  ASSESSMENT_QUESTIONS.forEach((q) => {
    const rawVal = answers[q.id] ?? 0;
    const adjustedVal = q.isReverseScored ? 4 - rawVal : rawVal;
    totalRawScore += adjustedVal;

    if (categoryRaw[q.category]) {
      categoryRaw[q.category].sum += adjustedVal;
      categoryRaw[q.category].count += 1;
    }
  });

  // Raw score is 0 to 60 (15 questions * 4 max) -> normalize to 0 to 100
  const normalizedScore = Math.min(100, Math.max(0, Math.round((totalRawScore / 60) * 100)));

  // Determine sleep hours logged from question 11
  let sleepHours = 6.5;
  if (exactSleepHours !== undefined) {
    sleepHours = exactSleepHours;
  } else if (answers[11] !== undefined && SLEEP_HOURS_MAP[answers[11]] !== undefined) {
    sleepHours = SLEEP_HOURS_MAP[answers[11]];
  }

  let zone: StressZone = 'low';
  let zoneLabel = 'Low Stress (Readiness Green)';
  if (normalizedScore >= 70) {
    zone = 'high';
    zoneLabel = 'High Alert Zone (Critical Amber/Red)';
  } else if (normalizedScore >= 36) {
    zone = 'medium';
    zoneLabel = 'Medium Stress Zone (Elevated Fatigue)';
  }

  // Calculate normalized category scores (0-100)
  const categoryScores: Record<string, number> = {};
  let highestCategory = 'fatigue';
  let highestRatio = -1;

  Object.keys(categoryRaw).forEach((cat) => {
    const { sum, count } = categoryRaw[cat];
    const maxPossible = count * 4;
    const catScore = maxPossible > 0 ? Math.round((sum / maxPossible) * 100) : 0;
    categoryScores[cat] = catScore;

    if (catScore > highestRatio) {
      highestRatio = catScore;
      highestCategory = cat;
    }
  });

  const categoryLabels: Record<string, string> = {
    cognitive: 'Cognitive Task Saturation',
    control: 'Loss of Operational Autonomy',
    hypervigilance: 'Somatic Hyperarousal & Tension',
    fatigue: 'Cumulative Sleep & Energy Depletion',
    emotional: 'Affective Strain & Irritability',
  };

  const primaryStressDriver = categoryLabels[highestCategory] || 'Operational Strain';

  let clinicalSummary = '';
  if (zone === 'high') {
    clinicalSummary = `Officer is exhibiting acute autonomic stress (${normalizedScore}/100) categorized in the High Alert Zone with ${sleepHours} hrs logged sleep. Key pressure point identified as ${primaryStressDriver}. Active parasympathetic down-regulation and medical staff review strongly indicated.`;
  } else if (zone === 'medium') {
    clinicalSummary = `Officer exhibits moderate compensatory strain (${normalizedScore}/100) with ${sleepHours} hrs logged sleep. Physiological resilience intact, but elevated ${primaryStressDriver} suggests fatigue accumulation. Tactical decompression recommended.`;
  } else {
    clinicalSummary = `Optimal operational readiness maintained (${normalizedScore}/100) with healthy restorative sleep (${sleepHours} hrs). Good emotional stability and robust adaptive coping reserves.`;
  }

  return {
    score: normalizedScore,
    zone,
    zoneLabel,
    categoryScores,
    primaryStressDriver,
    clinicalSummary,
    sleepHours,
  };
}
