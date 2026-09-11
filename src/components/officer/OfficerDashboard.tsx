import React from 'react';
import { useApp } from '../../context/AppContext';
import { HeroTab } from './HeroTab';
import { DailyAssessmentTab } from './DailyAssessmentTab';
import { AnalysisTab } from './AnalysisTab';
import { SolutionsTab } from './SolutionsTab';

export const OfficerDashboard: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
      {activeTab === 'hero' && <HeroTab />}
      {activeTab === 'assessment' && <DailyAssessmentTab />}
      {activeTab === 'analysis' && <AnalysisTab />}
      {activeTab === 'solutions' && <SolutionsTab />}
    </main>
  );
};
