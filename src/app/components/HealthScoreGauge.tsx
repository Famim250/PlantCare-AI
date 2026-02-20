import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Leaf, Droplets, Palette } from 'lucide-react';

interface HealthScoreGaugeProps {
  score: number;
  leafCondition: number;
  infectionSeverity: number;
  colorAnalysis: number;
}

export function HealthScoreGauge({ score, leafCondition, infectionSeverity, colorAnalysis }: HealthScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const getScoreColor = (s: number) => {
    if (s >= 80) return '#2E7D32';
    if (s >= 60) return '#43A047';
    if (s >= 40) return '#F57C00';
    if (s >= 20) return '#E65100';
    return '#D32F2F';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 80) return 'Excellent';
    if (s >= 60) return 'Good';
    if (s >= 40) return 'Fair';
    if (s >= 20) return 'Poor';
    return 'Critical';
  };

  const color = getScoreColor(score);
  const circumference = 2 * Math.PI * 54;
  const progress = (animatedScore / 100) * circumference;

  const metrics = [
    { icon: Leaf, label: 'Leaf Condition', value: leafCondition, suffix: '%' },
    { icon: Heart, label: 'Infection', value: infectionSeverity, suffix: '%', invert: true },
    { icon: Palette, label: 'Color Health', value: colorAnalysis, suffix: '%' },
  ];

  return (
    <div className="backdrop-blur-xl bg-white/65 border border-white/80 rounded-[1.75rem] p-6 shadow-[0_20px_50px_rgba(46,125,50,0.12)]">
      <h3 className="text-lg mb-5 text-[#1B5E20] font-bold flex items-center gap-2">
        <Droplets className="size-5 text-[#2E7D32]" />
        AI Health Score
      </h3>

      <div className="flex items-center gap-6">
        {/* Circular gauge */}
        <div className="relative flex-shrink-0">
          <svg width="130" height="130" viewBox="0 0 120 120" className="-rotate-90">
            {/* Background track */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#E8F5E9"
              strokeWidth="8"
            />
            {/* Progress arc */}
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - progress }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-3xl font-bold"
              style={{ color }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              {animatedScore}
            </motion.span>
            <span className="text-xs font-bold text-[#2E7D32] mt-0.5">/100</span>
          </div>
        </div>

        {/* Score label + breakdown */}
        <div className="flex-1 min-w-0">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="px-3 py-1.5 rounded-full text-sm font-bold inline-block mb-3"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {getScoreLabel(score)}
          </motion.div>

          <div className="space-y-2.5">
            {metrics.map((metric, i) => {
              const MetricIcon = metric.icon;
              const val = metric.invert ? Math.max(0, 100 - metric.value) : metric.value;
              const metricColor = getScoreColor(val);
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <MetricIcon className="size-3.5 flex-shrink-0" style={{ color: metricColor }} />
                  <span className="text-xs font-bold text-[#1B5E20] flex-shrink-0 w-20 truncate">{metric.label}</span>
                  <div className="flex-1 bg-[#E8F5E9] rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: metricColor }}
                      initial={{ width: '0%' }}
                      animate={{ width: `${val}%` }}
                      transition={{ duration: 0.8, delay: 0.6 + i * 0.1, ease: 'easeOut' }}
                    />
                  </div>
                  <span className="text-xs font-bold min-w-[32px] text-right" style={{ color: metricColor }}>
                    {val}{metric.suffix}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
