import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Leaf } from 'lucide-react';
import { analyzeImage } from '../services/plantAI';

export function Analyzing() {
  const navigate = useNavigate();

  useEffect(() => {
    const performAnalysis = async () => {
      try {
        const imageUrl = sessionStorage.getItem('current-image');
        if (!imageUrl) {
          navigate('/home');
          return;
        }

        const cropType = sessionStorage.getItem('selected-crop') || 'auto';

        // Call the AI analysis service
        const result = await analyzeImage({ image: imageUrl, cropType });
        
        // Store result
        sessionStorage.setItem('analysis-result', JSON.stringify(result));
        
        // Navigate to result
        setTimeout(() => {
          navigate('/result');
        }, 500);
      } catch (error) {
        console.error('Analysis failed:', error);
        navigate('/home');
      }
    };

    performAnalysis();
  }, [navigate]);

  const steps = [
    'Processing image data',
    'Detecting plant features',
    'Running Grad-CAM analysis',
    'Calculating health score',
    'Generating diagnosis'
  ];

  return (
    <div className="size-full relative overflow-hidden bg-gradient-to-b from-[#E4F3E4] to-[#CDE7C9]">
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-[#2E7D32]/10 rounded-full blur-[120px]" />
      
      {/* Animated glow orbs */}
      <motion.div
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.08, 0.15, 0.08]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-1/4 right-10 size-80 bg-[#2E7D32] rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ 
          scale: [1.15, 1, 1.15],
          opacity: [0.08, 0.15, 0.08]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute bottom-1/4 left-10 size-80 bg-[#388E3C] rounded-full blur-[100px]"
      />
      
      <div className="relative size-full flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Animated Loader */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Rotating gradient ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                className="size-40"
              >
                <svg className="size-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="url(#gradient-analyzing)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="60 200"
                  />
                  <defs>
                    <linearGradient id="gradient-analyzing" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2E7D32" />
                      <stop offset="100%" stopColor="#388E3C" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
              
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.08, 1],
                    rotate: [0, 8, -8, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="backdrop-blur-xl bg-white/70 border-2 border-white/90 p-7 rounded-full shadow-[0_15px_40px_rgba(46,125,50,0.2)]"
                >
                  <Leaf className="size-14 text-[#2E7D32]" strokeWidth={2.5} />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Title Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-center backdrop-blur-xl bg-white/65 border border-white/80 rounded-[1.5rem] p-8 shadow-[0_20px_50px_rgba(46,125,50,0.1)]"
          >
            <h2 className="text-4xl mb-2 text-[#1B5E20] font-bold">
              Analyzing
            </h2>
            <p className="text-[#2E7D32] text-base font-semibold">
              AI is examining your plant...
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-xl bg-white/60 border border-white/80 rounded-2xl p-6 shadow-lg space-y-4"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.12 }}
                className="flex items-center gap-3"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.3,
                    repeat: Infinity,
                    delay: index * 0.25
                  }}
                  className="size-3 rounded-full bg-gradient-to-br from-[#2E7D32] to-[#388E3C] shadow-lg flex-shrink-0"
                />
                <span className="text-[#1B5E20] font-bold">{step}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Progress bar */}
          <div className="backdrop-blur-md bg-white/50 rounded-full h-3 overflow-hidden shadow-inner border border-white/70">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.5, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-[#2E7D32] to-[#388E3C] rounded-full shadow-md"
            />
          </div>

          {/* Helper text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="backdrop-blur-md bg-[#81C784]/15 border border-[#66BB6A]/30 rounded-xl p-4 shadow-sm"
          >
            <p className="text-center text-sm text-[#1B5E20] font-semibold">
              Processing usually takes just a few seconds
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}