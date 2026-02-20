import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { cropFamilies } from '../utils/diseases';

interface CropSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCrop: string;
  onSelect: (cropId: string) => void;
}

export function CropSelector({ isOpen, onClose, selectedCrop, onSelect }: CropSelectorProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1B5E20]/60 backdrop-blur-sm z-50"
          />

          {/* Sheet */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-auto"
          >
            <div className="backdrop-blur-xl bg-white/95 border-t-2 border-white/90 rounded-t-[2rem] shadow-[0_-20px_60px_rgba(46,125,50,0.2)]">
              {/* Handle */}
              <div className="flex justify-center py-3">
                <div className="w-10 h-1.5 bg-[#A5D6A7] rounded-full" />
              </div>

              <div className="px-6 pb-8">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl text-[#1B5E20] font-bold">Select Your Crop</h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-[#E8F5E9] rounded-full transition-all"
                  >
                    <X className="size-5 text-[#1B5E20]" />
                  </button>
                </div>

                <p className="text-sm font-semibold text-[#2E7D32] mb-5">
                  Selecting your crop type improves detection accuracy by filtering the AI model.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {cropFamilies.map((crop, i) => {
                    const isSelected = selectedCrop === crop.id;
                    return (
                      <motion.button
                        key={crop.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => {
                          onSelect(crop.id);
                          onClose();
                        }}
                        className={`relative flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] border-[#1B5E20] text-white shadow-[0_12px_30px_rgba(27,94,32,0.35)]'
                            : 'bg-white border-[#81C784] text-[#1B5E20] hover:bg-[#E8F5E9] hover:border-[#66BB6A] shadow-sm'
                        }`}
                      >
                        <span className="text-2xl">{crop.icon}</span>
                        <span className="font-bold text-sm">{crop.name}</span>
                        {isSelected && (
                          <Check className="size-4 ml-auto" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}