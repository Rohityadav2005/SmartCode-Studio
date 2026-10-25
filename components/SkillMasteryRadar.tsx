import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Compass } from 'lucide-react';

export interface SkillData {
  skill: string;
  score: number;
  fullMark?: number;
}

export interface SkillMasteryRadarProps {
  data?: SkillData[];
  title?: string;
  className?: string;
}

// Default 5-axis skill proficiency dataset matching exact specifications
export const DEFAULT_SKILL_DATA: SkillData[] = [
  { skill: 'Python Core', score: 90, fullMark: 100 },
  { skill: 'Data Wrangling', score: 75, fullMark: 100 },
  { skill: 'Algorithms', score: 55, fullMark: 100 },
  { skill: 'SQL & DBs', score: 80, fullMark: 100 },
  { skill: 'Debugging', score: 85, fullMark: 100 },
];

// Custom accessible tooltip matching developer dashboard dark theme
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: SkillData }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0D1117] border border-[#2B313B] px-3 py-2 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-[12px] font-semibold text-[#8C99AD]">{data.skill}</p>
        <p className="text-[14px] font-bold text-[#00C8E8]">
          {data.score} <span className="text-[11px] font-normal text-gray-500">/ 100</span>
        </p>
      </div>
    );
  }
  return null;
};

// Custom rendered cyan circular point markers (#00C8E8)
const renderCustomPoint = (props: any) => {
  const { cx, cy } = props;
  return (
    <circle
      key={`dot-${cx}-${cy}`}
      cx={cx}
      cy={cy}
      r={4.5}
      fill="#00C8E8"
      stroke="#151A21"
      strokeWidth={2}
      className="drop-shadow-[0_0_6px_rgba(0,200,232,0.8)] transition-transform duration-200 hover:scale-125"
    />
  );
};

export const SkillMasteryRadar: React.FC<SkillMasteryRadarProps> = ({
  data = DEFAULT_SKILL_DATA,
  title = 'SKILL MASTERY RADAR',
  className = '',
}) => {
  return (
    <div
      className={`
        w-full max-w-[515px] h-[380px]
        bg-[#151A21] border border-[#2B313B] rounded-[20px]
        p-6 flex flex-col justify-between
        shadow-2xl transition-all duration-300
        hover:border-[#3A4352] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]
        ${className}
      `}
      role="region"
      aria-label="Skill Mastery Radar Chart"
    >
      {/* Top Header: Compass Icon & Uppercase Title */}
      <div className="flex items-center gap-2 select-none">
        <Compass
          size={16}
          className="text-[#8BAEDB] stroke-[2.2]"
          aria-hidden="true"
        />
        <h2 className="text-[#8BAEDB] text-[12px] font-bold tracking-[0.08em] uppercase font-sans">
          {title}
        </h2>
      </div>

      {/* Recharts Responsive Pentagonal Radar Chart */}
      <div className="w-full h-[290px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            data={data}
            cx="50%"
            cy="50%"
            outerRadius="68%"
            margin={{ top: 15, right: 28, bottom: 15, left: 28 }}
          >
            {/* Five concentric pentagonal grid levels (#292F38) */}
            <PolarGrid
              gridType="polygon"
              stroke="#292F38"
              strokeWidth={1}
              radialLines={true}
            />

            {/* Category labels positioned outside aligned with axes */}
            <PolarAngleAxis
              dataKey="skill"
              tick={({ payload, x, y, textAnchor }) => (
                <text
                  x={x}
                  y={y}
                  textAnchor={textAnchor}
                  fill="#8C99AD"
                  fontSize={12.5}
                  fontWeight={500}
                  className="font-sans select-none tracking-tight"
                >
                  {payload.value}
                </text>
              )}
            />

            {/* Normalized Scale 0-100 without tick clutter */}
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tickCount={6}
              axisLine={false}
              tick={false}
            />

            {/* Interactive tooltip */}
            <Tooltip content={<CustomTooltip />} isAnimationActive={true} />

            {/* Periwinkle-blue stroke (#8585FF), translucent indigo fill (#6258E8 @ 38%), cyan dots */}
            <Radar
              name="Mastery Score"
              dataKey="score"
              stroke="#8585FF"
              strokeWidth={2}
              fill="#6258E8"
              fillOpacity={0.38}
              dot={renderCustomPoint}
              activeDot={{
                r: 6,
                fill: '#00C8E8',
                stroke: '#FFFFFF',
                strokeWidth: 2,
              }}
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SkillMasteryRadar;
