/**
 * Developer Badge Component
 * 
 * Shows when the app is running in mock mode.
 * Remove this component in production or when USE_MOCK_DATA = false
 */

import { Wrench } from 'lucide-react';

export function DevBadge() {
  // Don't show in production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="backdrop-blur-xl bg-gradient-to-r from-[#F57C00] to-[#FB8C00] border-2 border-white/50 text-white px-4 py-2.5 rounded-2xl shadow-[0_8px_20px_rgba(245,124,0,0.3)] flex items-center gap-2 text-sm font-bold">
        <Wrench className="size-4" />
        <span>Mock Mode</span>
      </div>
    </div>
  );
}