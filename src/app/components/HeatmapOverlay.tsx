import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Crosshair } from 'lucide-react';

interface HeatmapOverlayProps {
  imageUrl: string;
  regions: { x: number; y: number; radius: number; intensity: number }[];
  isHealthy: boolean;
}

export function HeatmapOverlay({ imageUrl, regions, isHealthy }: HeatmapOverlayProps) {
  const [showHeatmap, setShowHeatmap] = useState(!isHealthy);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showHeatmap || !canvasRef.current || !containerRef.current || regions.length === 0) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw heatmap regions
    regions.forEach(region => {
      const x = region.x * canvas.width;
      const y = region.y * canvas.height;
      const r = region.radius * Math.min(canvas.width, canvas.height);

      // Create radial gradient for each region
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
      
      const alpha = region.intensity * 0.55;
      gradient.addColorStop(0, `rgba(255, 0, 0, ${alpha})`);
      gradient.addColorStop(0.3, `rgba(255, 80, 0, ${alpha * 0.7})`);
      gradient.addColorStop(0.6, `rgba(255, 165, 0, ${alpha * 0.4})`);
      gradient.addColorStop(0.85, `rgba(255, 255, 0, ${alpha * 0.15})`);
      gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
      
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fillStyle = gradient;
      ctx.fill();
    });
  }, [showHeatmap, regions]);

  return (
    <div className="relative">
      {/* Glow behind image */}
      <div className="absolute -inset-3 bg-gradient-to-br from-[#2E7D32]/15 to-[#388E3C]/15 rounded-[2rem] blur-2xl" />
      
      {/* Glass container */}
      <div className="relative backdrop-blur-xl bg-white/70 border-2 border-white/90 rounded-[1.75rem] p-3 shadow-[0_20px_50px_rgba(46,125,50,0.15)]">
        <div ref={containerRef} className="relative aspect-video rounded-[1.25rem] overflow-hidden">
          <img
            src={imageUrl}
            alt="Analyzed plant"
            className="size-full object-cover"
          />
          
          {/* Heatmap canvas overlay */}
          {showHeatmap && regions.length > 0 && (
            <motion.canvas
              ref={canvasRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 size-full pointer-events-none mix-blend-multiply"
            />
          )}

          {/* Grad-CAM label */}
          {showHeatmap && regions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-3 left-3 backdrop-blur-xl bg-black/50 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5"
            >
              <Crosshair className="size-3.5" />
              <span className="text-xs font-bold">Grad-CAM Heatmap</span>
            </motion.div>
          )}

          {/* Healthy badge */}
          {isHealthy && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-3 left-3 backdrop-blur-xl bg-[#2E7D32]/80 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5"
            >
              <span className="text-xs font-bold">No infection areas detected</span>
            </motion.div>
          )}
        </div>
        
        {/* Toggle button */}
        {!isHealthy && regions.length > 0 && (
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className="absolute bottom-5 right-5 backdrop-blur-xl bg-black/50 hover:bg-black/60 text-white p-2.5 rounded-xl transition-all shadow-lg"
          >
            {showHeatmap ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        )}
      </div>

      {/* Heatmap legend */}
      {showHeatmap && !isHealthy && regions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-3 flex items-center justify-center gap-2"
        >
          <span className="text-xs font-bold text-[#1B5E20]">Low</span>
          <div className="flex h-2.5 rounded-full overflow-hidden w-32 shadow-inner">
            <div className="flex-1 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500" />
          </div>
          <span className="text-xs font-bold text-[#1B5E20]">High</span>
          <span className="text-xs font-semibold text-[#2E7D32] ml-1">infection probability</span>
        </motion.div>
      )}
    </div>
  );
}
