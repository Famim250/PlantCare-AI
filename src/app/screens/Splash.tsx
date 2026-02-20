import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Leaf } from 'lucide-react';

export function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="size-full relative overflow-hidden bg-gradient-to-b from-[#E4F3E4] to-[#CDE7C9]">
      {/* Radial glow behind content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-[#2E7D32]/10 rounded-full blur-[100px]" />
      
      {/* Content */}
      <div className="relative size-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-6"
        >
          {/* Icon with strong gradient */}
          <motion.div
            animate={{ 
              y: [0, -12, 0],
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="relative"
          >
            {/* Outer glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#2E7D32] to-[#388E3C] rounded-3xl blur-2xl opacity-40" />
            
            {/* Icon container */}
            <div className="relative bg-gradient-to-br from-[#2E7D32] to-[#388E3C] p-12 rounded-3xl shadow-[0_20px_60px_rgba(46,125,50,0.35)]">
              <Leaf className="size-28 text-white" strokeWidth={2} />
            </div>
          </motion.div>

          {/* Text */}
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-5xl mb-2 text-[#1B5E20] font-bold tracking-tight"
            >
              PlantCare AI
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-[#2E7D32] text-lg font-semibold"
            >
              Premium Plant Health Diagnosis
            </motion.p>
          </div>

          {/* Loading indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="flex gap-2 mt-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [0.5, 1, 0.5] 
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="size-2.5 rounded-full bg-[#2E7D32]"
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}