import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ASSESSMENT_QUESTIONS, LIKERT_OPTIONS } from '../../data/assessmentQuestions';
import { AssessmentSubmission } from '../../types';
import { Shield, CheckCircle2, ArrowRight, RotateCcw, AlertTriangle, Sparkles, BookOpen, Activity, Languages } from 'lucide-react';

export const DailyAssessmentTab: React.FC = () => {
  const { currentOfficer, submitAssessment, setActiveTab } = useApp();

  // Language state: 'en' for English, 'hi' for Hindi
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // Answer state: key is question id (1..15), value is 0..4
  const [answers, setAnswers] = useState<Record<number, number>>({
    1: 2,
    2: 2,
    3: 2,
    4: 2,
    5: 2,
    6: 2,
    7: 2,
    8: 2,
    9: 2,
    10: 2,
    11: 1,
    12: 1,
    13: 3,
    14: 2,
    15: 2,
  });

  const [submittedResult, setSubmittedResult] = useState<AssessmentSubmission | null>(null);

  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === 15;

  const handleOptionSelect = (questionId: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handlePreFill = (mode: 'high' | 'medium' | 'low') => {
    if (mode === 'high') {
      // High stress: high scores on stress items, low scores on coping items, short sleep (<4h)
      setAnswers({
        1: 4, 2: 3, 3: 4, 4: 1, 5: 0, 6: 4, 7: 1, 8: 1, 9: 4, 10: 4,
        11: 4, 12: 4, 13: 0, 14: 4, 15: 4
      });
    } else if (mode === 'medium') {
      // Medium stress: balanced moderate scores, ~6.2h sleep
      setAnswers({
        1: 2, 2: 2, 3: 2, 4: 2, 5: 2, 6: 2, 7: 2, 8: 2, 9: 2, 10: 2,
        11: 2, 12: 2, 13: 2, 14: 2, 15: 2
      });
    } else {
      // Low stress: low scores on stress items, high scores on coping items, 8+h sleep
      setAnswers({
        1: 0, 2: 1, 3: 0, 4: 4, 5: 4, 6: 1, 7: 4, 8: 4, 9: 0, 10: 0,
        11: 0, 12: 0, 13: 4, 14: 0, 15: 0
      });
    }
  };

  const handleSubmit = (e?: React.FormEvent, targetTab: 'hero' | 'analysis' = 'hero') => {
    if (e) e.preventDefault();
    if (!isComplete) return;

    const result = submitAssessment(answers);
    setSubmittedResult(result);
    // Directly navigate officer to the chosen destination (Home Page or Analysis / Result Page)
    setActiveTab(targetTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Assessment Header & Clinical Source info */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-700 dark:text-emerald-400 mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>CLINICAL REFERENCE: PSS-10, DOD FM 4-02.51 COSC & WRAIR SLEEP BATTERY</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-military font-bold text-slate-900 dark:text-slate-100">
              {language === 'hi' ? 'दैनिक सैन्य तनाव एवं तत्परता मूल्यांकन' : 'Daily Operational Stress Assessment'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              {language === 'hi'
                ? 'मानक परसीव्ड स्ट्रेस स्केल (PSS-10) और सैन्य नींद प्रोटोकॉल पर आधारित दैनिक मनोवैज्ञानिक व शारीरिक तनाव मूल्यांकन।'
                : 'Validated military adaptation of the Perceived Stress Scale (PSS-10), Combat Operational Stress Control doctrine, and DoD Sleep protocols to calibrate acute psychological load and calculate weekly sleep average.'}
            </p>
          </div>

          {/* Language Selector and Preset Test Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            {/* Language Options Switch */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-300 dark:border-slate-800 shadow-inner">
              <div className="flex items-center px-2 text-slate-500 dark:text-slate-400">
                <Languages className="w-3.5 h-3.5 mr-1" />
                <span className="text-[10px] font-mono uppercase font-bold">Lang:</span>
              </div>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  language === 'en'
                    ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  language === 'hi'
                    ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Quick preset test buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-300 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono px-1.5">Presets:</span>
              <button
                type="button"
                onClick={() => handlePreFill('high')}
                className="px-2 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/80 hover:bg-rose-200 dark:hover:bg-rose-900 text-rose-900 dark:text-rose-300 border border-rose-300 dark:border-rose-800/60 text-xs font-semibold transition cursor-pointer"
              >
                High
              </button>
              <button
                type="button"
                onClick={() => handlePreFill('medium')}
                className="px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/80 hover:bg-amber-200 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60 text-xs font-semibold transition cursor-pointer"
              >
                Med
              </button>
              <button
                type="button"
                onClick={() => handlePreFill('low')}
                className="px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 dark:hover:bg-emerald-900 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60 text-xs font-semibold transition cursor-pointer"
              >
                Low
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <span>
            {language === 'hi' ? 'प्रगति: ' : 'Completion: '}
            <strong className="text-slate-900 dark:text-slate-200">
              {answeredCount} / 15 {language === 'hi' ? 'प्रश्नों के उत्तर दर्ज' : 'Questions Answered'}
            </strong>
          </span>
          <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">
            {Math.round((answeredCount / 15) * 100)}%
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-950 rounded-full mt-2 overflow-hidden border border-slate-300 dark:border-slate-800">
          <div
            className="h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-300"
            style={{ width: `${Math.round((answeredCount / 15) * 100)}%` }}
          />
        </div>
      </div>

      {/* Submission Success Modal / Alert Card */}
      {submittedResult && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/95 border-2 border-emerald-500 dark:border-emerald-500/80 shadow-2xl shadow-emerald-500/10 space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/40 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs uppercase font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                  {language === 'hi' ? 'मूल्यांकन सफलतापूर्वक दर्ज और विश्लेषित' : 'Assessment Analyzed & Logged Successfully'}
                </span>
                <h3 className="text-xl font-military font-bold text-slate-900 dark:text-slate-100">
                  {language === 'hi' ? 'नया तनाव स्तर: ' : 'New Stress Level: '} {submittedResult.score}/100
                </h3>
              </div>
            </div>

            <div
              className={`px-3 py-1.5 rounded-full text-xs font-bold font-military uppercase tracking-wide border ${
                submittedResult.zone === 'high'
                  ? 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-700 animate-pulse'
                  : submittedResult.zone === 'medium'
                  ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700'
                  : 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700'
              }`}
            >
              {submittedResult.zone.toUpperCase()} ZONE
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-300 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-slate-900 dark:text-slate-200 font-semibold">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>
                  {language === 'hi' ? 'प्रमुख तनाव कारक: ' : 'Primary Stress Driver: '}
                  <strong className="text-amber-700 dark:text-amber-400">{submittedResult.primaryStressDriver}</strong>
                </span>
              </div>
              {submittedResult.sleepHoursReported !== undefined && (
                <span className="px-2.5 py-1 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700/60 font-mono text-xs">
                  🌙 {language === 'hi' ? 'नींद दर्ज: ' : 'Sleep Logged: '} {submittedResult.sleepHoursReported}h ({language === 'hi' ? 'साप्ताहिक औसत अद्यतित' : 'Weekly Average Recalculated'})
                </span>
              )}
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {submittedResult.clinicalSummary}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setActiveTab('hero')}
              className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition cursor-pointer shadow-lg"
            >
              <span>{language === 'hi' ? 'होम पेज और 7-दिवसीय नींद औसत देखें' : 'View Hero Page & Calculated Weekly Sleep Average'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-300 dark:border-slate-700 transition flex items-center space-x-2 cursor-pointer"
            >
              <span>{language === 'hi' ? 'विश्लेषण टैब में पाई चार्ट व ग्राफ देखें' : 'View Bar Graph & Pie Chart in Analysis Tab'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 15 Assessment Questions Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {ASSESSMENT_QUESTIONS.map((q) => {
          const currentAnswer = answers[q.id];
          const options = q.customOptions || LIKERT_OPTIONS;
          const displayPrompt = language === 'hi' ? (q.promptHi || q.prompt) : q.prompt;
          const displayDomain = language === 'hi' ? (q.clinicalDomainHi || q.clinicalDomain) : q.clinicalDomain;

          return (
            <div
              key={q.id}
              className={`p-5 rounded-2xl border transition-all ${
                q.isSleepQuestion
                  ? 'bg-indigo-50/70 dark:bg-indigo-950/20 border-2 border-indigo-300 dark:border-indigo-500/50 shadow-md'
                  : currentAnswer !== undefined
                  ? 'bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/90 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`w-6 h-6 rounded-full text-xs font-mono font-bold flex items-center justify-center border shrink-0 ${
                    q.isSleepQuestion
                      ? 'bg-indigo-600 text-white dark:bg-indigo-900 dark:text-indigo-200 border-indigo-400 dark:border-indigo-500'
                      : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                  }`}>
                    {q.id}
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 font-semibold">
                    {language === 'hi' ? 'क्षेत्र: ' : 'Domain: '} {displayDomain}
                  </span>
                </div>
                <div className="flex items-center space-x-1.5">
                  {q.isSleepQuestion && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-300 dark:bg-indigo-900/80 dark:text-indigo-200 dark:border-indigo-500/70 font-mono font-semibold">
                      🌙 {language === 'hi' ? 'नींद अवधि • 7-दिवसीय औसत अपडेट' : 'Sleep Hours Item • Updates Hero 7-Day Average'}
                    </span>
                  )}
                  {q.isReverseScored && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-sky-100 text-sky-900 border border-sky-300 dark:bg-sky-950/70 dark:text-sky-300 dark:border-sky-800/50 font-mono font-medium">
                      {language === 'hi' ? 'सकारात्मक क्षमता' : 'Positive Coping Factor'}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 mt-1 mb-4 leading-relaxed">
                {displayPrompt}
              </p>

              {/* Likert Scale Radio Options */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {options.map((opt) => {
                  const isSelected = currentAnswer === opt.value;
                  const displayOptLabel = language === 'hi' ? (opt.labelHi || opt.label) : opt.label;
                  const displayOptDesc = language === 'hi' ? (opt.descriptionHi || opt.description) : opt.description;

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleOptionSelect(q.id, opt.value)}
                      className={`p-2.5 rounded-xl text-left border-2 transition-all cursor-pointer ${
                        isSelected
                          ? q.isSleepQuestion
                            ? 'bg-indigo-600 text-white border-indigo-700 dark:bg-indigo-900/90 dark:border-indigo-400 dark:text-indigo-100 shadow-md'
                            : 'bg-emerald-600 text-white border-emerald-700 dark:bg-emerald-950/90 dark:border-emerald-500 dark:text-emerald-200 shadow-md'
                          : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-mono text-xs font-bold ${isSelected ? 'text-white dark:text-emerald-300' : 'text-slate-500 dark:text-slate-400'}`}>
                          [{opt.value}]
                        </span>
                        <div
                          className={`w-3.5 h-3.5 rounded-full border-2 ${
                            isSelected
                              ? 'bg-white border-white dark:bg-emerald-400 dark:border-emerald-300'
                              : 'border-slate-400 dark:border-slate-600'
                          }`}
                        />
                      </div>
                      <div className={`text-xs font-bold leading-snug ${isSelected ? 'text-white' : 'text-slate-900 dark:text-slate-200'}`}>
                        {displayOptLabel}
                      </div>
                      <div className={`text-[10px] mt-0.5 hidden sm:block ${isSelected ? 'text-emerald-100 dark:text-emerald-200/80' : 'text-slate-500 dark:text-slate-400'}`}>
                        {displayOptDesc}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 text-[10px] font-mono text-slate-500 dark:text-slate-500 flex items-center space-x-1">
                <span>Ref: {q.scientificReference}</span>
              </div>
            </div>
          );
        })}

        {/* Submit Bar */}
        <div className="sticky bottom-4 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xl backdrop-blur flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-900 dark:text-slate-200 flex items-center space-x-2">
              <span>{language === 'hi' ? 'मूल्यांकन सत्यापन पूर्ण करें' : 'Complete Assessment Validation'}</span>
              {isComplete && (
                <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 text-[10px] font-mono font-bold">
                  ✓ {language === 'hi' ? 'सबमिट हेतु तैयार' : 'READY TO SUBMIT'}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
              {isComplete
                ? (language === 'hi'
                  ? 'सभी 15 प्रश्न पूर्ण हैं। सबमिट करने पर तनाव स्तर व 7-दिवसीय नींद तुरंत अद्यतित हो जाएगी।'
                  : 'All 15 clinical items recorded. Submitting will immediately calibrate your stress score and direct you to the results.')
                : (language === 'hi'
                  ? `कृपया शेष ${15 - answeredCount} प्रश्नों के उत्तर दें।`
                  : `Please complete remaining ${15 - answeredCount} items.`)}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              disabled={!isComplete}
              onClick={(e) => handleSubmit(e, 'analysis')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold border flex items-center space-x-1.5 transition cursor-pointer ${
                isComplete
                  ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800 cursor-not-allowed'
              }`}
              title="Submit and direct to Result / Analysis page"
            >
              <span>{language === 'hi' ? 'सबमिट और विश्लेषण देखें' : 'Submit & View Analysis'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="submit"
              disabled={!isComplete}
              onClick={(e) => handleSubmit(e, 'hero')}
              className={`px-5 py-2.5 rounded-xl font-military font-bold text-xs tracking-wide uppercase flex items-center space-x-2 transition cursor-pointer shadow-lg ${
                isComplete
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/20'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-300 dark:border-slate-700 cursor-not-allowed'
              }`}
              title="Submit and direct to Home / Hero page"
            >
              <Activity className="w-4 h-4" />
              <span>{language === 'hi' ? 'सबमिट व होम पेज पर जाएं' : 'Submit & Return Home'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

