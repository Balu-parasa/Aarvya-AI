import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChevronDown } from 'lucide-react';
import { ChartPoint } from '../types';

interface HealthImprovementChartProps {
  title: string;
  subtitle: string;
  data: ChartPoint[];
}

export const HealthImprovementChart: React.FC<HealthImprovementChartProps> = ({
  title,
  subtitle,
  data,
}) => {
  const [timeframe, setTimeframe] = useState<'Week' | 'Month' | 'Year'>('Week');
  const [showDropdown, setShowDropdown] = useState(false);

  // Custom Peak Milestone Dot at Friday
  const renderCustomizedDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (payload.day === 'FRI' || payload.isPeak) {
      return (
        <g key={`peak-${payload.day}`}>
          {/* Vertical subtle indicator line */}
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy + 80}
            stroke="#7546F5"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            strokeOpacity="0.6"
          />

          {/* Glowing pulse dot at apex */}
          <circle cx={cx} cy={cy} r="6" fill="#7546F5" stroke="#FFFFFF" strokeWidth="2.5" />

          {/* Floating Pill Banner "80%+ Imp / 6 Aug 2025" */}
          <foreignObject x={cx - 45} y={cy - 48} width="90" height="42">
            <div className="bg-[#7546F5] text-white text-[10px] font-semibold rounded-xl px-2 py-1 shadow-lg shadow-[#7546F5]/30 text-center leading-tight select-none">
              <span className="block font-bold">80%+ Imp</span>
              <span className="text-[8px] text-white/80 font-normal">6 Aug 2025</span>
            </div>
          </foreignObject>
        </g>
      );
    }
    return <circle key={`dot-${payload.day}`} cx={cx} cy={cy} r="0" fill="transparent" />;
  };

  return (
    <div className="w-full lg:w-[45%] bg-white/70 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-white/90 shadow-[0_12px_28px_rgba(117,70,245,0.06)] flex flex-col justify-between">
      {/* Header with Timeframe Dropdown */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-heading font-medium text-xl text-[#242033] tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-[#858098]">
            {subtitle}
          </p>
        </div>

        {/* Timeframe Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white text-xs font-semibold text-[#242033] border border-[#DCD2FF] shadow-xs hover:border-[#7546F5] transition-all"
          >
            <span>{timeframe}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#858098]" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-1 w-28 bg-white rounded-xl shadow-lg border border-[#DCD2FF] py-1 z-30">
              {(['Week', 'Month', 'Year'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTimeframe(t);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium ${
                    timeframe === t ? 'text-[#7546F5] bg-[#F1ECFF]' : 'text-[#242033] hover:bg-[#F8F5FF]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-[230px] sm:h-[260px] pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 35, right: 12, left: 12, bottom: 0 }}>
            <defs>
              <linearGradient id="lavenderWaveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.45} />
                <stop offset="80%" stopColor="#E9E2FF" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#858098', fontSize: 11, fontWeight: 500 }}
              dy={10}
            />
            <YAxis hide domain={[20, 100]} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#242033] text-white px-3 py-1.5 rounded-xl text-xs font-medium shadow-md">
                      <span className="font-bold">{payload[0].payload.day}: </span>
                      {payload[0].value}% Well-being
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="natural"
              dataKey="value"
              stroke="#A78BFA"
              strokeWidth={3}
              fill="url(#lavenderWaveGradient)"
              dot={renderCustomizedDot}
              activeDot={{ r: 5, fill: '#7546F5', stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
