import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Leaf, 
  FlaskConical, 
  ShieldCheck, 
  Clock,
  ChevronRight
} from 'lucide-react';
import type { TreatmentPlan } from '../utils/diseases';

interface TreatmentTabsProps {
  treatment: TreatmentPlan;
  isHealthy: boolean;
}

const tabs = [
  { id: 'immediate', label: 'Immediate', icon: Zap, color: '#D32F2F' },
  { id: 'organic', label: 'Organic', icon: Leaf, color: '#2E7D32' },
  { id: 'chemical', label: 'Chemical', icon: FlaskConical, color: '#1565C0' },
  { id: 'prevention', label: 'Prevention', icon: ShieldCheck, color: '#F57C00' },
] as const;

type TabId = typeof tabs[number]['id'];

export function TreatmentTabs({ treatment, isHealthy }: TreatmentTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>(isHealthy ? 'prevention' : 'immediate');

  const getTabContent = (tabId: TabId): string[] => {
    switch (tabId) {
      case 'immediate': return treatment.immediate;
      case 'organic': return treatment.organic;
      case 'chemical': return treatment.chemical;
      case 'prevention': return treatment.prevention;
    }
  };

  const activeTabConfig = tabs.find(t => t.id === activeTab)!;
  const content = getTabContent(activeTab);

  return (
    <div className="backdrop-blur-xl bg-white/65 border border-white/80 rounded-[1.75rem] p-6 shadow-[0_20px_50px_rgba(46,125,50,0.12)]">
      <h3 className="text-lg mb-4 text-[#1B5E20] font-bold flex items-center gap-2">
        <ShieldCheck className="size-5 text-[#2E7D32]" />
        Treatment Plan
      </h3>

      {/* Tab bar */}
      <div className="flex gap-1.5 mb-5 bg-white border border-[#81C784] rounded-2xl p-1.5 shadow-sm">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl transition-all text-xs font-bold ${
                isActive 
                  ? 'text-white shadow-[0_12px_30px_rgba(27,94,32,0.35)]' 
                  : 'text-[#1B5E20] hover:bg-[#E8F5E9]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-treatment-tab"
                  className="absolute inset-0 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-xl"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1">
                <TabIcon className="size-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-3"
        >
          {content.map((item, index) => (
            <motion.div
              key={`${activeTab}-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
              className="flex gap-3 items-start backdrop-blur-md bg-white/55 border border-white/70 p-3.5 rounded-2xl shadow-sm"
            >
              <div 
                className="size-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs text-white font-bold shadow-md"
                style={{ backgroundColor: activeTabConfig.color }}
              >
                {index + 1}
              </div>
              <span className="text-sm text-[#1B5E20] flex-1 leading-relaxed font-semibold">
                {item}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Recovery Timeline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-5 bg-[#E8F5E9]/60 border border-[#A5D6A7]/40 rounded-2xl p-4"
      >
        <div className="flex items-start gap-2">
          <Clock className="size-4 text-[#2E7D32] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-[#1B5E20] mb-1">Recovery Timeline</p>
            <p className="text-xs font-semibold text-[#2E7D32]">{treatment.recoveryTimeline}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}