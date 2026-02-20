/**
 * Developer Settings Panel
 * 
 * Quick toggle between mock and real API modes.
 * Remove this component in production.
 */

import { useState } from 'react';
import { Settings, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function DevSettings() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Don't show in production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white p-4 rounded-full shadow-[0_12px_30px_rgba(46,125,50,0.35)] hover:shadow-[0_16px_40px_rgba(46,125,50,0.5)] hover:brightness-110 transition-all"
        aria-label="Developer Settings"
      >
        <Settings className="size-6" />
      </button>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#1B5E20]/60 backdrop-blur-sm z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 backdrop-blur-xl bg-white/90 border-2 border-white/90 rounded-[2rem] shadow-[0_25px_60px_rgba(46,125,50,0.25)] p-8 w-[90%] max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#1B5E20]">Developer Settings</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 hover:bg-white/80 rounded-full transition-all"
                >
                  <X className="size-5 text-[#1B5E20]" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Mode Indicator */}
                <div className="backdrop-blur-md bg-gradient-to-r from-[#F57C00]/15 to-[#FB8C00]/15 border-2 border-[#F57C00]/40 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="size-3 rounded-full bg-[#F57C00] animate-pulse shadow-lg" />
                    <span className="text-sm text-[#1B5E20] font-bold">Currently using Mock Data</span>
                  </div>
                  <p className="text-xs text-[#2E7D32] font-semibold">
                    To use your real model, update API_ENDPOINT in /src/app/services/plantAI.ts
                  </p>
                </div>

                {/* Instructions */}
                <div className="backdrop-blur-md bg-white/70 border border-white/80 rounded-2xl p-5 space-y-3 shadow-md">
                  <h3 className="text-sm font-bold text-[#1B5E20]">Quick Integration:</h3>
                  <ol className="text-xs text-[#1B5E20] space-y-2 list-decimal list-inside font-semibold">
                    <li>Open <code className="backdrop-blur-sm bg-[#2E7D32]/10 px-2 py-1 rounded-lg font-mono">plantAI.ts</code></li>
                    <li>Update <code className="backdrop-blur-sm bg-[#2E7D32]/10 px-2 py-1 rounded-lg font-mono">API_ENDPOINT</code></li>
                    <li>Set <code className="backdrop-blur-sm bg-[#2E7D32]/10 px-2 py-1 rounded-lg font-mono">USE_MOCK_DATA = false</code></li>
                    <li>Test with real images!</li>
                  </ol>
                </div>

                {/* Clear Storage */}
                <div className="pt-4 border-t-2 border-white/60">
                  <button
                    onClick={() => {
                      localStorage.clear();
                      sessionStorage.clear();
                      alert('Storage cleared! Refresh the page.');
                    }}
                    className="text-sm text-[#D32F2F] hover:text-[#D32F2F]/80 underline font-bold transition-colors"
                  >
                    Clear All Saved Data
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}