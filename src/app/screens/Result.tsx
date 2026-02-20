import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { 
  Share2, 
  Save, 
  RotateCcw, 
  AlertTriangle,
  AlertCircle,
  Info,
  ArrowLeft,
  MapPin,
  Calendar,
  Microscope,
  Bug,
  Wind,
  Globe,
  ChevronDown,
  ChevronUp,
  Users
} from 'lucide-react';
import { saveDiagnosis, getUserPreferences, saveUserPreferences } from '../utils/diseases';
import type { AnalysisResponse } from '../services/plantAI';
import { toast } from 'sonner';
import { HealthScoreGauge } from '../components/HealthScoreGauge';
import { ConfidenceChart } from '../components/ConfidenceChart';
import { HeatmapOverlay } from '../components/HeatmapOverlay';
import { TreatmentTabs } from '../components/TreatmentTabs';
import { ModeToggle } from '../components/ModeToggle';

export function Result() {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [saved, setSaved] = useState(false);
  const [mode, setMode] = useState<'beginner' | 'advanced'>('beginner');
  const [showScience, setShowScience] = useState(false);
  const [showRegion, setShowRegion] = useState(false);
  const [dataContribution, setDataContribution] = useState(false);

  useEffect(() => {
    const prefs = getUserPreferences();
    setMode(prefs.mode);
    setDataContribution(prefs.dataContribution);

    const stored = sessionStorage.getItem('current-image');
    const analysisData = sessionStorage.getItem('analysis-result');
    
    if (!stored || !analysisData) {
      navigate('/home');
      return;
    }
    
    setImageUrl(stored);
    setResult(JSON.parse(analysisData));
  }, [navigate]);

  const handleModeChange = (newMode: 'beginner' | 'advanced') => {
    setMode(newMode);
    saveUserPreferences({ mode: newMode });
  };

  const handleSave = () => {
    if (!imageUrl || !result) return;
    
    saveDiagnosis({
      imageUrl,
      disease: result.disease,
      confidence: result.confidence,
      healthScore: result.healthScore.score,
      cropType: getUserPreferences().selectedCrop
    });
    
    setSaved(true);
    toast.success('Diagnosis saved to history!', { duration: 2000 });
  };

  const handleContribute = () => {
    setDataContribution(!dataContribution);
    saveUserPreferences({ dataContribution: !dataContribution });
    toast.success(
      !dataContribution 
        ? 'Thank you! Image will help improve PlantCare AI.' 
        : 'Contribution withdrawn.', 
      { duration: 2000 }
    );
  };

  const handleShare = async () => {
    if (!result) return;
    const d = result.disease;
    const text = `PlantCare AI Diagnosis\n\nCondition: ${d.name}\nConfidence: ${Math.round(result.confidence * 100)}%\nHealth Score: ${result.healthScore.score}/100\n\nTreatment:\n${d.treatment.immediate.map((r, i) => `${i + 1}. ${r}`).join('\n')}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'PlantCare AI Diagnosis', text });
      } catch { /* cancelled */ }
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Diagnosis copied to clipboard!', { duration: 2000 });
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="size-4 text-[#D32F2F]" />;
      case 'medium': return <AlertCircle className="size-4 text-[#F57C00]" />;
      default: return <Info className="size-4 text-[#2E7D32]" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return { bg: 'bg-[#D32F2F]/10', text: 'text-[#D32F2F]', border: 'border-[#D32F2F]/30' };
      case 'medium': return { bg: 'bg-[#F57C00]/10', text: 'text-[#F57C00]', border: 'border-[#F57C00]/30' };
      default: return { bg: 'bg-[#2E7D32]/10', text: 'text-[#2E7D32]', border: 'border-[#2E7D32]/30' };
    }
  };

  if (!imageUrl || !result) return null;

  const disease = result.disease;
  const isHealthy = disease.id === 'healthy';
  const sevColors = getSeverityColor(disease.severity);

  return (
    <div className="size-full relative overflow-hidden bg-gradient-to-b from-[#E4F3E4] to-[#CDE7C9]">
      {/* Radial glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 size-[500px] bg-[#2E7D32]/8 rounded-full blur-[120px]" />
      
      <div className="relative size-full flex flex-col overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/60 border-b border-white/80 shadow-sm">
          <div className="flex items-center justify-between p-4 sm:p-5">
            <button
              onClick={() => navigate('/home')}
              className="p-2.5 hover:bg-white/70 rounded-xl transition-all"
              aria-label="Go back"
            >
              <ArrowLeft className="size-6 text-[#1B5E20]" />
            </button>
            
            <ModeToggle mode={mode} onChange={handleModeChange} />
            
            <div className="w-10" />
          </div>
        </header>

        <main className="relative flex-1 p-4 sm:p-6 pb-8">
          <div className="max-w-2xl mx-auto space-y-5">
            
            {/* ===== HEATMAP IMAGE ===== */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <HeatmapOverlay 
                imageUrl={imageUrl} 
                regions={result.heatmapRegions}
                isHealthy={isHealthy}
              />
            </motion.div>

            {/* ===== DISEASE NAME + SEVERITY ===== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="backdrop-blur-xl bg-white/65 border border-white/80 rounded-[1.75rem] p-6 shadow-[0_20px_50px_rgba(46,125,50,0.12)]"
            >
              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className={`flex items-center gap-1.5 ${sevColors.bg} border ${sevColors.border} px-3 py-1.5 rounded-full`}>
                  {getSeverityIcon(disease.severity)}
                  <span className={`text-xs font-bold ${sevColors.text} capitalize`}>
                    {disease.severity} severity
                  </span>
                </div>
                
                <div className={`px-3 py-1.5 rounded-full font-bold text-xs text-white shadow-md ${
                  result.confidence >= 0.9 
                    ? 'bg-gradient-to-r from-[#2E7D32] to-[#388E3C]' 
                    : result.confidence >= 0.7 
                      ? 'bg-gradient-to-r from-[#F57C00] to-[#FB8C00]'
                      : 'bg-gradient-to-r from-[#D32F2F] to-[#E53935]'
                }`}>
                  {Math.round(result.confidence * 100)}% match
                </div>
              </div>

              {/* Disease Name */}
              <h2 className="text-3xl sm:text-4xl mb-2 text-[#1B5E20] font-bold leading-tight">
                {disease.name}
              </h2>

              {/* Scientific name for expert mode */}
              {mode === 'advanced' && disease.scientificName && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm italic text-[#2E7D32]/70 font-semibold mb-3"
                >
                  {disease.scientificName}
                </motion.p>
              )}

              {/* Description based on mode */}
              <p className="text-[#2E7D32] font-semibold leading-relaxed">
                {mode === 'beginner' ? disease.beginnerDescription : disease.advancedDescription}
              </p>

              {/* Expert-only: Scientific Details Expandable */}
              {mode === 'advanced' && disease.pathogenType && (
                <div className="mt-4">
                  <button 
                    onClick={() => setShowScience(!showScience)}
                    className="flex items-center gap-2 text-sm font-bold text-[#2E7D32] hover:text-[#1B5E20] transition-colors"
                  >
                    <Microscope className="size-4" />
                    Scientific Details
                    {showScience ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  </button>
                  
                  {showScience && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 space-y-2.5 bg-[#E8F5E9]/50 border border-[#A5D6A7]/30 rounded-2xl p-4"
                    >
                      <div className="flex items-start gap-2">
                        <Bug className="size-4 text-[#2E7D32] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-[#1B5E20]">Pathogen Type</p>
                          <p className="text-xs font-semibold text-[#2E7D32]">{disease.pathogenType}</p>
                        </div>
                      </div>
                      {disease.spreadMechanism && (
                        <div className="flex items-start gap-2">
                          <Wind className="size-4 text-[#2E7D32] flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-[#1B5E20]">Spread Mechanism</p>
                            <p className="text-xs font-semibold text-[#2E7D32]">{disease.spreadMechanism}</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>

            {/* ===== AI HEALTH SCORE ===== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <HealthScoreGauge 
                score={result.healthScore.score}
                leafCondition={result.healthScore.leafCondition}
                infectionSeverity={result.healthScore.infectionSeverity}
                colorAnalysis={result.healthScore.colorAnalysis}
              />
            </motion.div>

            {/* ===== CONFIDENCE CHART (Top 3) ===== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ConfidenceChart 
                primary={{ disease: result.disease, confidence: result.confidence }}
                alternatives={result.alternatives}
                confidenceLevel={result.confidenceLevel}
                multiDiseaseWarning={result.multiDiseaseWarning}
              />
            </motion.div>

            {/* ===== TREATMENT TABS ===== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <TreatmentTabs 
                treatment={disease.treatment}
                isHealthy={isHealthy}
              />
            </motion.div>

            {/* ===== LOCATION INTELLIGENCE ===== */}
            {disease.commonRegions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="backdrop-blur-xl bg-white/65 border border-white/80 rounded-[1.75rem] p-6 shadow-[0_20px_50px_rgba(46,125,50,0.12)]"
              >
                <button 
                  onClick={() => setShowRegion(!showRegion)}
                  className="flex items-center justify-between w-full"
                >
                  <h3 className="text-lg text-[#1B5E20] font-bold flex items-center gap-2">
                    <Globe className="size-5 text-[#2E7D32]" />
                    Regional Intelligence
                  </h3>
                  {showRegion ? <ChevronUp className="size-5 text-[#2E7D32]" /> : <ChevronDown className="size-5 text-[#2E7D32]" />}
                </button>

                {showRegion && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 space-y-4"
                  >
                    {/* Common Regions */}
                    <div>
                      <p className="text-sm font-bold text-[#1B5E20] mb-2 flex items-center gap-1.5">
                        <MapPin className="size-4 text-[#2E7D32]" />
                        Commonly Reported In
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {disease.commonRegions.map(region => (
                          <span key={region} className="bg-[#E8F5E9] border border-[#A5D6A7]/40 px-3 py-1.5 rounded-full text-xs font-bold text-[#1B5E20]">
                            {region}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Seasonal Risk */}
                    {disease.seasonalRisk.length > 0 && (
                      <div>
                        <p className="text-sm font-bold text-[#1B5E20] mb-2 flex items-center gap-1.5">
                          <Calendar className="size-4 text-[#2E7D32]" />
                          Peak Season Risk
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {disease.seasonalRisk.map(season => (
                            <span key={season} className="bg-[#FFF3E0] border border-[#FFB74D]/30 px-3 py-1.5 rounded-full text-xs font-bold text-[#E65100]">
                              {season}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ===== DATA CONTRIBUTION ===== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="backdrop-blur-xl bg-white/55 border border-white/70 rounded-[1.75rem] p-5 shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="bg-[#E8F5E9] p-2.5 rounded-xl flex-shrink-0">
                  <Users className="size-5 text-[#2E7D32]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1B5E20] mb-1">Help Improve PlantCare AI</p>
                  <p className="text-xs font-semibold text-[#2E7D32] mb-3">
                    Anonymously contribute this scan to improve detection accuracy for everyone.
                  </p>
                  <button
                    onClick={handleContribute}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      dataContribution 
                        ? 'bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white shadow-[0_12px_30px_rgba(27,94,32,0.35)]' 
                        : 'bg-white border-2 border-[#81C784] text-[#1B5E20] hover:bg-[#E8F5E9] shadow-sm'
                    }`}
                  >
                    {dataContribution ? '✓ Contributing' : 'Opt In'}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* ===== ACTION BUTTONS ===== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-3"
            >
              <button
                onClick={handleSave}
                disabled={saved}
                className={`border-2 ${ 
                  saved
                    ? 'bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] border-[#1B5E20] text-white shadow-[0_12px_30px_rgba(27,94,32,0.35)]'
                    : 'bg-white border-[#81C784] hover:bg-[#E8F5E9] text-[#1B5E20] shadow-sm'
                } py-3.5 px-5 rounded-[0.875rem] hover:shadow-md transition-all flex items-center justify-center gap-2 font-bold disabled:cursor-not-allowed`}
              >
                <Save className="size-5" />
                <span>{saved ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={handleShare}
                className="bg-white hover:bg-[#F1F8F1] border-2 border-[#81C784] text-[#1B5E20] py-3.5 px-5 rounded-[0.875rem] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 font-bold"
              >
                <Share2 className="size-5" />
                <span>Share</span>
              </button>
            </motion.div>

            {/* New Scan Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                sessionStorage.removeItem('current-image');
                sessionStorage.removeItem('analysis-result');
                navigate('/home');
              }}
              className="relative w-full group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-[0.875rem] blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white h-[54px] px-8 rounded-[0.875rem] shadow-[0_12px_30px_rgba(27,94,32,0.35)] group-hover:brightness-110 transition-all flex items-center justify-center gap-3 text-lg font-bold">
                <RotateCcw className="size-6" />
                <span>Scan Another Plant</span>
              </div>
            </motion.button>

          </div>
        </main>
      </div>
    </div>
  );
}