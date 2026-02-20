import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { RotateCcw, Play, ArrowLeft } from 'lucide-react';

export function ImageConfirmation() {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('current-image');
    if (!stored) {
      navigate('/home');
      return;
    }
    setImageUrl(stored);
  }, [navigate]);

  const handleRetake = () => {
    sessionStorage.removeItem('current-image');
    navigate('/home');
  };

  const handleAnalyze = () => {
    navigate('/analyzing');
  };

  if (!imageUrl) {
    return null;
  }

  return (
    <div className="size-full relative overflow-hidden">
      {/* Blurred background with image */}
      <div 
        className="absolute inset-0 bg-cover bg-center scale-110 blur-3xl opacity-20"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#E4F3E4]/95 to-[#CDE7C9]/95" />
      
      {/* Radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 size-[500px] bg-[#2E7D32]/8 rounded-full blur-[120px]" />
      
      <div className="relative size-full flex flex-col">
        {/* Header */}
        <header className="backdrop-blur-xl bg-white/60 border-b border-white/80 shadow-sm">
          <div className="flex items-center justify-between p-5 sm:p-6">
            <button
              onClick={() => navigate('/home')}
              className="p-2.5 hover:bg-white/70 rounded-xl transition-all"
              aria-label="Go back"
            >
              <ArrowLeft className="size-6 text-[#1B5E20]" />
            </button>
            <h1 className="text-xl text-[#1B5E20] font-bold">Confirm Image</h1>
            <div className="w-10" />
          </div>
        </header>

        {/* Main Content */}
        <main className="relative flex-1 flex flex-col items-center p-6 overflow-auto">
          <div className="w-full max-w-lg my-auto space-y-6">
            {/* Image Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {/* Glow behind image */}
              <div className="absolute -inset-3 bg-gradient-to-br from-[#2E7D32]/15 to-[#388E3C]/15 rounded-[2rem] blur-2xl" />
              
              {/* Image container */}
              <div className="relative backdrop-blur-xl bg-white/70 border-2 border-white/90 rounded-[1.75rem] p-3 shadow-[0_20px_50px_rgba(46,125,50,0.15)]">
                <div className="relative aspect-square rounded-[1.25rem] overflow-hidden">
                  <img
                    src={imageUrl}
                    alt="Selected plant"
                    className="size-full object-cover"
                  />
                  
                  {/* Scan corners */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-4 left-4 w-16 h-16 border-t-[3px] border-l-[3px] border-white rounded-tl-2xl shadow-lg" />
                    <div className="absolute top-4 right-4 w-16 h-16 border-t-[3px] border-r-[3px] border-white rounded-tr-2xl shadow-lg" />
                    <div className="absolute bottom-4 left-4 w-16 h-16 border-b-[3px] border-l-[3px] border-white rounded-bl-2xl shadow-lg" />
                    <div className="absolute bottom-4 right-4 w-16 h-16 border-b-[3px] border-r-[3px] border-white rounded-br-2xl shadow-lg" />
                  </div>
                  
                  {/* Scanning line */}
                  <motion.div
                    animate={{ top: ['0%', '100%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#2E7D32]/80 to-transparent shadow-[0_0_15px_rgba(46,125,50,0.6)]"
                  />
                </div>
              </div>
            </motion.div>

            {/* Info card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="backdrop-blur-xl bg-white/70 border border-white/90 rounded-2xl p-6 shadow-md"
            >
              <h3 className="text-xl mb-2 text-[#1B5E20] font-bold text-center">
                Review Your Image
              </h3>
              <p className="text-center text-[#2E7D32] font-semibold">
                Make sure the affected area is clearly visible
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {/* Primary Action - Confirm & Analyze */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAnalyze}
                className="relative w-full group"
              >
                {/* Animated glow */}
                <motion.div
                  animate={{ 
                    opacity: [0.4, 0.7, 0.4]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-[0.875rem] blur-lg"
                />
                
                {/* Button */}
                <div className="relative bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white h-[60px] px-8 rounded-[0.875rem] shadow-[0_12px_30px_rgba(27,94,32,0.4)] group-hover:brightness-110 group-hover:shadow-[0_20px_40px_rgba(27,94,32,0.5)] transition-all flex items-center justify-center gap-3 text-xl font-bold">
                  <Play className="size-7" strokeWidth={2.5} fill="white" />
                  <span>Confirm & Analyze</span>
                </div>
              </motion.button>

              {/* Secondary Action - Retake */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleRetake}
                className="w-full bg-white hover:bg-[#F1F8F1] text-[#1B5E20] border-2 border-[#81C784] h-[54px] px-6 rounded-[0.875rem] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 text-lg font-bold"
              >
                <RotateCcw className="size-5" strokeWidth={2.5} />
                <span>Retake Photo</span>
              </motion.button>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}