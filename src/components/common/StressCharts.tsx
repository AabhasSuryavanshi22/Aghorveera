import React, { useState } from 'react';
import { StressDataPoint, StressCategoryBreakdown } from '../../types';
import { useApp } from '../../context/AppContext';

// ==========================================
// 1. WEEKLY STRESS CHART (7 DAYS)
// ==========================================
export const WeeklyStressChart: React.FC<{ data: StressDataPoint[] }> = ({ data }) => {
  const { theme } = useApp();
  const isLight = theme === 'light';
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const width = 650;
  const height = 240;
  const padding = { top: 30, right: 30, bottom: 40, left: 45 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // X & Y scalers
  const getX = (idx: number) => padding.left + (idx / Math.max(1, data.length - 1)) * chartW;
  const getY = (val: number) => padding.top + chartH - (val / 100) * chartH;

  // Build SVG path
  const pathD = data
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(pt.score)}`)
    .join(' ');

  const areaD = `${pathD} L ${getX(data.length - 1)} ${padding.top + chartH} L ${getX(0)} ${padding.top + chartH} Z`;

  // Thresholds
  const yHigh = getY(70);
  const yMed = getY(35);

  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto min-w-[500px] select-none"
      >
        <defs>
          {/* Gradient for area fill */}
          <linearGradient id="weekGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
            <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
          </linearGradient>

          {/* Stroke gradient */}
          <linearGradient id="weekStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>

        {/* Zone Background Bands */}
        {/* High Alert Zone (70 - 100) */}
        <rect
          x={padding.left}
          y={padding.top}
          width={chartW}
          height={yHigh - padding.top}
          fill="#ef4444"
          fillOpacity="0.06"
        />
        {/* Medium Zone (35 - 70) */}
        <rect
          x={padding.left}
          y={yHigh}
          width={chartW}
          height={yMed - yHigh}
          fill="#f59e0b"
          fillOpacity="0.04"
        />
        {/* Low Zone (0 - 35) */}
        <rect
          x={padding.left}
          y={yMed}
          width={chartW}
          height={chartH - (yMed - padding.top)}
          fill="#10b981"
          fillOpacity="0.05"
        />

        {/* Grid lines and labels */}
        {[0, 25, 35, 50, 70, 100].map((val) => {
          const y = getY(val);
          const isThreshold = val === 35 || val === 70;
          return (
            <g key={val}>
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + chartW}
                y2={y}
                stroke={isThreshold ? (val === 70 ? '#ef4444' : '#10b981') : (isLight ? '#cbd5e1' : '#334155')}
                strokeDasharray={isThreshold ? '4 3' : '2 4'}
                strokeWidth={isThreshold ? 1.5 : 1}
                strokeOpacity={isThreshold ? 0.7 : 0.4}
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                fill={val === 70 ? '#f87171' : val === 35 ? '#34d399' : (isLight ? '#64748b' : '#94a3b8')}
                fontSize="10"
                fontFamily="monospace"
                textAnchor="end"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Zone annotations on the right */}
        <text
          x={padding.left + chartW - 6}
          y={padding.top + 14}
          fill="#f87171"
          fontSize="9"
          fontWeight="600"
          textAnchor="end"
          className="uppercase tracking-widest font-mono"
        >
          High Alert Zone (70+)
        </text>
        <text
          x={padding.left + chartW - 6}
          y={yHigh + 16}
          fill="#fbbf24"
          fontSize="9"
          fontWeight="600"
          textAnchor="end"
          className="uppercase tracking-widest font-mono"
        >
          Medium Stress (36-69)
        </text>
        <text
          x={padding.left + chartW - 6}
          y={yMed + 16}
          fill="#34d399"
          fontSize="9"
          fontWeight="600"
          textAnchor="end"
          className="uppercase tracking-widest font-mono"
        >
          Low Stress Zone (0-35)
        </text>

        {/* Area fill */}
        <path d={areaD} fill="url(#weekGradient)" />

        {/* Line Path */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#weekStroke)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {data.map((pt, i) => {
          const cx = getX(i);
          const cy = getY(pt.score);
          const isHigh = pt.score >= 70;
          const isMed = pt.score >= 36 && pt.score < 70;
          const isHovered = hoveredIdx === i;

          return (
            <g
              key={i}
              className="cursor-pointer transition-transform"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Vertical guideline on hover */}
              {isHovered && (
                <line
                  x1={cx}
                  y1={padding.top}
                  x2={cx}
                  y2={padding.top + chartH}
                  stroke="#94a3b8"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
              )}

              {/* Point outer glow */}
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 8 : 5}
                fill={isHigh ? '#ef4444' : isMed ? '#f59e0b' : '#10b981'}
                fillOpacity={isHovered ? 0.4 : 0.2}
              />

              {/* Point circle */}
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 5 : 3.5}
                fill={isHigh ? '#f87171' : isMed ? '#fbbf24' : '#34d399'}
                stroke="#0f172a"
                strokeWidth="2"
              />

              {/* X Axis Label */}
              <text
                x={cx}
                y={padding.top + chartH + 20}
                fill={i === data.length - 1 ? '#38bdf8' : '#94a3b8'}
                fontSize={i === data.length - 1 ? '11' : '10'}
                fontWeight={i === data.length - 1 ? '700' : '500'}
                textAnchor="middle"
              >
                {pt.dayLabel}
              </text>

              {/* Score label above point */}
              <text
                x={cx}
                y={cy - 10}
                fill={isHigh ? '#f87171' : isMed ? '#fbbf24' : '#34d399'}
                fontSize="10"
                fontWeight="700"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {pt.score}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hover Info Tooltip */}
      {hoveredIdx !== null && data[hoveredIdx] && (
        <div className="absolute top-2 left-12 bg-slate-900/95 border border-slate-700 px-3 py-1.5 rounded-md shadow-xl text-xs flex items-center space-x-3 pointer-events-none">
          <span className="font-semibold text-slate-200">
            {data[hoveredIdx].dayLabel} ({data[hoveredIdx].date}):
          </span>
          <span
            className={`font-mono font-bold ${
              data[hoveredIdx].score >= 70
                ? 'text-rose-400'
                : data[hoveredIdx].score >= 36
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            {data[hoveredIdx].score}/100 - {data[hoveredIdx].zone.toUpperCase()} ZONE
          </span>
          {data[hoveredIdx].notes && (
            <span className="text-[11px] text-slate-400 italic">
              {data[hoveredIdx].notes}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. MONTHLY STRESS CHART (30 DAYS)
// ==========================================
export const MonthlyStressChart: React.FC<{ data: StressDataPoint[] }> = ({ data }) => {
  const { theme } = useApp();
  const isLight = theme === 'light';
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const width = 760;
  const height = 240;
  const padding = { top: 30, right: 30, bottom: 40, left: 45 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const getX = (idx: number) => padding.left + (idx / Math.max(1, data.length - 1)) * chartW;
  const getY = (val: number) => padding.top + chartH - (val / 100) * chartH;

  const pathD = data
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(pt.score)}`)
    .join(' ');

  const areaD = `${pathD} L ${getX(data.length - 1)} ${padding.top + chartH} L ${getX(0)} ${padding.top + chartH} Z`;

  // Monthly stats
  const scores = data.map((d) => d.score);
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / Math.max(1, scores.length));
  const peak = Math.max(...scores);
  const lowest = Math.min(...scores);

  const yHigh = getY(70);
  const yMed = getY(35);

  return (
    <div className="relative w-full overflow-x-auto">
      {/* Summary metric bar */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 mb-2 px-1 gap-2">
        <div className="flex items-center space-x-4">
          <span>
            30-Day Mean: <strong className="text-slate-200 font-mono">{avg}/100</strong>
          </span>
          <span>
            Peak Spike: <strong className="text-rose-400 font-mono">{peak}/100</strong>
          </span>
          <span>
            Lowest Reading: <strong className="text-emerald-400 font-mono">{lowest}/100</strong>
          </span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          Continuous 30-Day Operational Log
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto min-w-[600px] select-none"
      >
        <defs>
          <linearGradient id="monthGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {/* Zones */}
        <rect
          x={padding.left}
          y={padding.top}
          width={chartW}
          height={yHigh - padding.top}
          fill="#ef4444"
          fillOpacity="0.05"
        />
        <rect
          x={padding.left}
          y={yHigh}
          width={chartW}
          height={yMed - yHigh}
          fill="#f59e0b"
          fillOpacity="0.04"
        />
        <rect
          x={padding.left}
          y={yMed}
          width={chartW}
          height={chartH - (yMed - padding.top)}
          fill="#10b981"
          fillOpacity="0.05"
        />

        {/* Grid lines */}
        {[0, 35, 70, 100].map((val) => {
          const y = getY(val);
          const isThreshold = val === 35 || val === 70;
          return (
            <g key={val}>
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + chartW}
                y2={y}
                stroke={isThreshold ? (val === 70 ? '#ef4444' : '#10b981') : (isLight ? '#cbd5e1' : '#334155')}
                strokeDasharray={isThreshold ? '4 3' : '2 4'}
                strokeWidth={isThreshold ? 1.5 : 1}
                strokeOpacity={isThreshold ? 0.7 : 0.35}
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                fill={val === 70 ? '#f87171' : val === 35 ? '#34d399' : (isLight ? '#64748b' : '#94a3b8')}
                fontSize="10"
                fontFamily="monospace"
                textAnchor="end"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Monthly Average Guideline */}
        <line
          x1={padding.left}
          y1={getY(avg)}
          x2={padding.left + chartW}
          y2={getY(avg)}
          stroke="#38bdf8"
          strokeDasharray="5 5"
          strokeWidth="1.5"
          strokeOpacity="0.7"
        />
        <text
          x={padding.left + 8}
          y={getY(avg) - 5}
          fill="#38bdf8"
          fontSize="9"
          fontFamily="monospace"
          fontWeight="600"
        >
          Avg: {avg}
        </text>

        {/* Area fill */}
        <path d={areaD} fill="url(#monthGradient)" />

        {/* Line Path */}
        <path
          d={pathD}
          fill="none"
          stroke="#60a5fa"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 30 Data points */}
        {data.map((pt, i) => {
          const cx = getX(i);
          const cy = getY(pt.score);
          const isHigh = pt.score >= 70;
          const isHovered = hoveredIdx === i;
          const showLabel = i % 5 === 0 || i === data.length - 1;

          return (
            <g
              key={i}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {isHovered && (
                <line
                  x1={cx}
                  y1={padding.top}
                  x2={cx}
                  y2={padding.top + chartH}
                  stroke="#94a3b8"
                  strokeDasharray="2 2"
                  strokeWidth="1"
                />
              )}

              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 6 : isHigh ? 3.5 : 2.5}
                fill={isHigh ? '#ef4444' : pt.score >= 36 ? '#f59e0b' : '#10b981'}
                stroke="#0f172a"
                strokeWidth={isHovered ? 2 : 1}
              />

              {showLabel && (
                <text
                  x={cx}
                  y={padding.top + chartH + 18}
                  fill={i === data.length - 1 ? '#38bdf8' : '#94a3b8'}
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {pt.dayLabel}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {hoveredIdx !== null && data[hoveredIdx] && (
        <div className="absolute top-8 left-14 bg-slate-900/95 border border-slate-700 px-3 py-1.5 rounded-md shadow-xl text-xs flex items-center space-x-3 pointer-events-none">
          <span className="font-semibold text-slate-200">
            Day {hoveredIdx + 1} ({data[hoveredIdx].date}):
          </span>
          <span
            className={`font-mono font-bold ${
              data[hoveredIdx].score >= 70
                ? 'text-rose-400'
                : data[hoveredIdx].score >= 36
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            {data[hoveredIdx].score}/100 - {data[hoveredIdx].zone.toUpperCase()} ZONE
          </span>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. CATEGORY BAR GRAPH (5 STRESS DOMAINS)
// ==========================================
export const CategoryBarChart: React.FC<{ categories: StressCategoryBreakdown[] }> = ({ categories }) => {
  return (
    <div className="space-y-4">
      {categories.map((cat) => {
        const isCritical = cat.score >= 70;
        const isElevated = cat.score >= 40 && cat.score < 70;
        const barColor = isCritical ? 'bg-rose-500' : isElevated ? 'bg-amber-500' : 'bg-emerald-500';

        return (
          <div key={cat.category} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-200">{cat.label}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-2 hidden sm:inline">
                  {cat.description}
                </span>
              </div>
              <div className="font-mono font-bold text-xs flex items-center space-x-1.5">
                <span
                  className={
                    isCritical ? 'text-rose-600 dark:text-rose-400' : isElevated ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                  }
                >
                  {cat.score}/100
                </span>
                <span className="text-[10px] uppercase font-sans text-slate-500 dark:text-slate-400 font-normal">
                  ({isCritical ? 'High Alert' : isElevated ? 'Moderate' : 'Normal'})
                </span>
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-300 dark:border-slate-800 flex relative">
              {/* Threshold indicator lines */}
              <div className="absolute top-0 bottom-0 left-[35%] w-[1px] bg-slate-400 dark:bg-slate-700 z-10" title="Low threshold (35)" />
              <div className="absolute top-0 bottom-0 left-[70%] w-[1px] bg-slate-400 dark:bg-slate-700 z-10" title="High threshold (70)" />

              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
                style={{ width: `${Math.min(100, Math.max(5, cat.score))}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ==========================================
// 4. PIE / DONUT CHART OF STRESS
// ==========================================
export const StressDonutChart: React.FC<{
  categories: StressCategoryBreakdown[];
  monthlyData?: StressDataPoint[];
}> = ({ categories, monthlyData }) => {
  const { theme } = useApp();
  const isLight = theme === 'light';
  const [viewMode, setViewMode] = useState<'categories' | 'zones'>('categories');
  const [activeSegment, setActiveSegment] = useState<number | null>(null);

  // Mode 1: Stress Factor Breakdown
  const totalCatScore = categories.reduce((sum, c) => sum + c.score, 0);
  const categorySegments = categories.map((cat, idx) => {
    const percentage = totalCatScore > 0 ? (cat.score / totalCatScore) * 100 : 20;
    return {
      id: idx,
      label: cat.label,
      value: cat.score,
      percentage: Number(percentage.toFixed(1)),
      color: cat.color,
    };
  });

  // Mode 2: Time in Alert Zones over 30 days
  const zoneCounts = { low: 0, medium: 0, high: 0 };
  (monthlyData || []).forEach((d) => {
    if (d.score >= 70) zoneCounts.high++;
    else if (d.score >= 36) zoneCounts.medium++;
    else zoneCounts.low++;
  });
  const totalDays = Math.max(1, (monthlyData || []).length);
  const zoneSegments = [
    {
      id: 0,
      label: 'Low Stress Zone (0-35)',
      value: zoneCounts.low,
      percentage: Number(((zoneCounts.low / totalDays) * 100).toFixed(1)),
      color: '#10b981',
    },
    {
      id: 1,
      label: 'Medium Stress Zone (36-69)',
      value: zoneCounts.medium,
      percentage: Number(((zoneCounts.medium / totalDays) * 100).toFixed(1)),
      color: '#f59e0b',
    },
    {
      id: 2,
      label: 'High Alert Zone (70-100)',
      value: zoneCounts.high,
      percentage: Number(((zoneCounts.high / totalDays) * 100).toFixed(1)),
      color: '#ef4444',
    },
  ];

  const segments = viewMode === 'categories' ? categorySegments : zoneSegments;

  // Compute SVG Donut paths with centered 240x240 coordinates
  let cumulativeAngle = 0;
  const radius = 88;
  const innerRadius = 54;
  const cx = 120;
  const cy = 120;

  const paths = segments.map((seg) => {
    const startAngle = cumulativeAngle;
    const sliceAngle = (seg.percentage / 100) * 360;
    const endAngle = startAngle + sliceAngle;
    cumulativeAngle = endAngle;

    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    const x3 = cx + innerRadius * Math.cos(endRad);
    const y3 = cy + innerRadius * Math.sin(endRad);
    const x4 = cx + innerRadius * Math.cos(startRad);
    const y4 = cy + innerRadius * Math.sin(startRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;

    const d = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
      'Z',
    ].join(' ');

    return { ...seg, d };
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wide">
          Stress Proportion Distribution
        </span>
        <div className="flex items-center space-x-1 p-0.5 bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-300 dark:border-slate-800 text-[11px]">
          <button
            onClick={() => setViewMode('categories')}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer font-medium ${
              viewMode === 'categories'
                ? 'bg-emerald-600 text-white dark:bg-slate-800 dark:text-emerald-400 font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            By Stress Factors
          </button>
          <button
            onClick={() => setViewMode('zones')}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer font-medium ${
              viewMode === 'zones'
                ? 'bg-emerald-600 text-white dark:bg-slate-800 dark:text-emerald-400 font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            By Alert Zones (30d)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* SVG Donut - Centered and fully visible with responsive viewBox */}
        <div className="md:col-span-6 flex items-center justify-center relative w-full py-2">
          <svg
            viewBox="0 0 240 240"
            className="w-48 h-48 sm:w-56 sm:h-56 max-w-full aspect-square select-none mx-auto drop-shadow-sm"
          >
            {paths.map((p, idx) => {
              const isHovered = activeSegment === idx;
              return (
                <path
                  key={idx}
                  d={p.d}
                  fill={p.color}
                  opacity={isHovered ? 1 : 0.9}
                  stroke={isLight ? '#ffffff' : '#0f172a'}
                  strokeWidth="2.5"
                  className="cursor-pointer transition-all duration-200 hover:opacity-100"
                  onMouseEnter={() => setActiveSegment(idx)}
                  onMouseLeave={() => setActiveSegment(null)}
                />
              );
            })}
          </svg>

          {/* Center Info */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono font-semibold">
              {activeSegment !== null ? segments[activeSegment].percentage + '%' : 'Breakdown'}
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 font-military">
              {activeSegment !== null
                ? segments[activeSegment].label.split(' ')[0]
                : viewMode === 'categories'
                ? '5 Factors'
                : '30 Days'}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="md:col-span-6 space-y-2">
          {segments.map((seg, idx) => {
            const isHovered = activeSegment === idx;
            return (
              <div
                key={seg.id}
                onMouseEnter={() => setActiveSegment(idx)}
                onMouseLeave={() => setActiveSegment(null)}
                className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between text-xs ${
                  isHovered
                    ? 'bg-slate-100 border-slate-300 dark:bg-slate-800/80 dark:border-slate-600 shadow-sm'
                    : 'bg-white border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="text-slate-800 dark:text-slate-300 font-semibold">{seg.label}</span>
                </div>
                <div className="font-mono font-bold text-slate-900 dark:text-slate-200 ml-2">
                  {seg.percentage}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
