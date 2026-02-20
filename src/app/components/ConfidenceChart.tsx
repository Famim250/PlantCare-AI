import { motion } from 'motion/react';
import { BarChart3, AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';
import type { Disease, AlternativePrediction } from '../utils/diseases';

interface ConfidenceChartProps {
  primary: { disease: Disease; confidence: number };
  alternatives: AlternativePrediction[];
  confidenceLevel: 'high' | 'medium' | 'low';
  multiDiseaseWarning: boolean;
}

export function ConfidenceChart({ primary, alternatives = [], confidenceLevel = 'medium', multiDiseaseWarning }: ConfidenceChartProps) {
  const all = [
    { name: primary?.disease?.name || 'Unknown', confidence: primary?.confidence || 0, isPrimary: true },
    ...(alternatives || []).map(a => ({ name: a?.disease?.name || 'Unknown', confidence: a?.confidence || 0, isPrimary: false }))
  ];

  const confidenceConfig = {
    high: {
      icon: ShieldCheck,
      label: 'High Confidence',
      color: '#2E7D32',
      bg: 'bg-[#2E7D32]/10',
      border: 'border-[#2E7D32]/30',
      description: 'The model is very confident in this diagnosis.'
    },
    medium: {
      icon: ShieldAlert,
      label: 'Medium Confidence',
      color: '#F57C00',
      bg: 'bg-[#F57C00]/10',
      border: 'border-[#F57C00]/30',
      description: 'The model is moderately confident. Consider additional analysis.'
    },
    low: {
      icon: AlertTriangle,
      label: 'Low Confidence',
      color: '#D32F2F',
      bg: 'bg-[#D32F2F]/10',
      border: 'border-[#D32F2F]/30',
      description: 'Confidence is low — multiple diseases possible. Expert consultation recommended.'
    }
  };

  const safeLevel = (confidenceLevel || 'medium').toLowerCase() as 'high' | 'medium' | 'low';
  const config = confidenceConfig[safeLevel] || confidenceConfig['medium'];
  const ConfIcon = config.icon || ShieldAlert;

  return (
    <div className="backdrop-blur-xl bg-white/65 border border-white/80 rounded-[1.75rem] p-6 shadow-[0_20px_50px_rgba(46,125,50,0.12)]">
      <h3 className="text-lg mb-4 text-[#1B5E20] font-bold flex items-center gap-2">
        <BarChart3 className="size-5 text-[#2E7D32]" />
        Prediction Confidence
      </h3>

      {/* Confidence Level Badge */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`${config.bg} border ${config.border} rounded-2xl p-4 mb-5`}
      >
        <div className="flex items-center gap-2 mb-1">
          <ConfIcon className="size-4" style={{ color: config.color }} />
          <span className="text-sm font-bold" style={{ color: config.color }}>{config.label}</span>
        </div>
        <p className="text-xs font-semibold text-[#1B5E20]/80">{config.description}</p>
      </motion.div>

      {/* Probability Bars */}
      <div className="space-y-4">
        {all.map((pred, i) => {
          const percentage = Math.round(pred.confidence * 100);
          const barColor = pred.isPrimary ? '#2E7D32' : i === 1 ? '#66BB6A' : '#A5D6A7';

          return (
            <motion.div
              key={`${pred.name}-${i}`}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-sm font-bold truncate pr-2 ${pred.isPrimary ? 'text-[#1B5E20]' : 'text-[#2E7D32]/70'}`}>
                  {pred.isPrimary && '● '}{pred.name}
                </span>
                <span className="text-sm font-bold flex-shrink-0" style={{ color: barColor }}>
                  {percentage}%
                </span>
              </div>
              <div className="bg-[#E8F5E9] rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: barColor }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.4 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Multi-Disease Warning */}
      {multiDiseaseWarning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-5 bg-[#FFF3E0] border border-[#FFB74D]/40 rounded-2xl p-4"
        >
          <div className="flex items-start gap-2">
            <AlertTriangle className="size-4 text-[#F57C00] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-[#E65100]">Multiple Diseases Possible</p>
              <p className="text-xs font-semibold text-[#F57C00] mt-1">
                Consider expert consultation for definitive diagnosis. Take additional photos from different angles.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
