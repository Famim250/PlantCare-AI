import { motion } from 'motion/react';
import { GraduationCap, Sprout } from 'lucide-react';

interface ModeToggleProps {
  mode: 'beginner' | 'advanced';
  onChange: (mode: 'beginner' | 'advanced') => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-white border border-[#81C784] rounded-full p-1 shadow-sm">
      <button
        onClick={() => onChange('beginner')}
        className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
          mode === 'beginner' ? 'text-white' : 'text-[#1B5E20] hover:bg-[#E8F5E9]'
        }`}
      >
        {mode === 'beginner' && (
          <motion.div
            layoutId="mode-toggle-bg"
            className="absolute inset-0 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-full shadow-[0_12px_30px_rgba(27,94,32,0.35)]"
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1">
          <Sprout className="size-3.5" />
          Beginner
        </span>
      </button>
      <button
        onClick={() => onChange('advanced')}
        className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
          mode === 'advanced' ? 'text-white' : 'text-[#1B5E20] hover:bg-[#E8F5E9]'
        }`}
      >
        {mode === 'advanced' && (
          <motion.div
            layoutId="mode-toggle-bg"
            className="absolute inset-0 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-full shadow-[0_12px_30px_rgba(27,94,32,0.35)]"
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1">
          <GraduationCap className="size-3.5" />
          Expert
        </span>
      </button>
    </div>
  );
}
