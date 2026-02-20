import { useNavigate } from 'react-router';
import { Camera, Upload, HelpCircle, History as HistoryIcon, Wheat, Zap, Sun, Lightbulb, ChevronRight, Sparkles, ScanLine, ClipboardList, X, Shield, Target, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { CropSelector } from '../components/CropSelector';
import { ModeToggle } from '../components/ModeToggle';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { cropFamilies, getUserPreferences, saveUserPreferences } from '../utils/diseases';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1600659911670-7831fad053ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHBsYW50JTIwbGVhdmVzJTIwd2F0ZXIlMjBkcm9wbGV0cyUyMGNsb3NlLXVwfGVufDF8fHx8MTc3MTU4NDI2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

const howItWorksSteps = [
  {
    icon: Camera,
    title: 'Capture',
    description: 'Take a close-up photo of the affected leaf or plant area.',
  },
  {
    icon: ScanLine,
    title: 'AI Analysis',
    description: 'Our AI model scans for diseases, pests, and nutrient deficiencies.',
  },
  {
    icon: ClipboardList,
    title: 'Get Results',
    description: 'Receive diagnosis with confidence score, treatment plan, and health rating.',
  },
];

const features = [
  {
    icon: Target,
    title: 'Instant Detection',
    description: 'Get results in seconds with our advanced AI model trained on thousands of plant disease images.',
  },
  {
    icon: Shield,
    title: 'High Accuracy',
    description: 'Powered by MobileNetV2 architecture for precise disease identification across multiple plant species.',
  },
  {
    icon: Smartphone,
    title: 'Easy to Use',
    description: 'Simple interface — just upload a photo and get instant diagnostics. No technical knowledge required.',
  },
];

const stats = [
  { value: '38+', label: 'Plant Diseases' },
  { value: '95%', label: 'Accuracy Rate' },
  { value: '10+', label: 'Plant Species' },
  { value: '24/7', label: 'Available' },
];

export function Home() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropSelectorOpen, setCropSelectorOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('auto');
  const [fieldMode, setFieldMode] = useState(false);
  const [mode, setMode] = useState<'beginner' | 'advanced'>('beginner');
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  useEffect(() => {
    const prefs = getUserPreferences();
    setSelectedCrop(prefs.selectedCrop);
    setFieldMode(prefs.fieldMode);
    setMode(prefs.mode);
  }, []);

  const handleCropSelect = (cropId: string) => {
    setSelectedCrop(cropId);
    saveUserPreferences({ selectedCrop: cropId });
  };

  const handleFieldModeToggle = () => {
    const newVal = !fieldMode;
    setFieldMode(newVal);
    saveUserPreferences({ fieldMode: newVal });
  };

  const handleModeChange = (newMode: 'beginner' | 'advanced') => {
    setMode(newMode);
    saveUserPreferences({ mode: newMode });
  };

  const storeImageAndNavigate = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      sessionStorage.setItem('current-image', imageUrl);
      sessionStorage.setItem('selected-crop', selectedCrop);
      navigate('/confirm');
    };
    reader.readAsDataURL(file);
  };

  const handleCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) storeImageAndNavigate(file);
    };
    input.click();
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) storeImageAndNavigate(file);
  };

  const selectedCropInfo = cropFamilies.find(c => c.id === selectedCrop);

  return (
    <div className="size-full relative overflow-hidden bg-white">
      <div className="relative size-full flex flex-col">

        {/* ═══════ 1. TOP NAVIGATION BAR ═══════ */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 sm:px-6">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] p-2 rounded-xl shadow-md">
                <svg className="size-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C10 2 8 3 8 5c0 1.5.5 3 2 4 0 0-3 1-3 5s3 6 5 6 5-2 5-6-3-5-3-5c1.5-1 2-2.5 2-4 0-2-2-3-4-3z" />
                </svg>
              </div>
              <span className="text-lg text-[#1B5E20] font-bold">PlantCare AI</span>
            </div>

            {/* Nav links */}
            <nav className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => navigate('/history')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-[#1B5E20] hover:bg-[#E8F5E9] transition-all font-medium"
              >
                <HistoryIcon className="size-4" />
                <span className="hidden sm:inline">History</span>
              </button>
              <button
                onClick={() => setHowItWorksOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-[#1B5E20] hover:bg-[#E8F5E9] transition-all font-medium"
              >
                <HelpCircle className="size-4" />
                <span className="hidden sm:inline">About</span>
              </button>
              <button
                onClick={handleUpload}
                className="ml-1 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:shadow-lg hover:brightness-110 transition-all"
              >
                Get Started
              </button>
            </nav>
          </div>
        </header>

        {/* ═══════ SCROLLABLE CONTENT ═══════ */}
        <main className="relative flex-1 overflow-auto">

          {/* ═══════ 2. HERO SECTION ═══════ */}
          <section className="bg-gradient-to-br from-[#F6FBF6] via-white to-[#E8F5E9]/40">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 lg:py-20">
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                {/* Left: Text content */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex-1 text-center lg:text-left"
                >
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                    AI-Powered{' '}
                    <span className="text-[#2E7D32]">Plant Disease</span>{' '}
                    <span className="text-[#2E7D32]">Detection</span>
                  </h1>
                  <p className="text-gray-600 text-base sm:text-lg mb-6 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                    Protect your crops with cutting-edge artificial intelligence. Instant disease identification for healthier plants and better yields.
                  </p>

                  {/* Mode & Field controls */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
                    <ModeToggle mode={mode} onChange={handleModeChange} />
                    <button
                      onClick={handleFieldModeToggle}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all border ${
                        fieldMode
                          ? 'bg-gradient-to-r from-[#E65100] to-[#F57C00] text-white border-[#E65100] shadow-[0_8px_24px_rgba(230,81,0,0.3)]'
                          : 'bg-white border-[#81C784] text-[#1B5E20] hover:bg-[#E8F5E9] shadow-sm'
                      }`}
                    >
                      {fieldMode ? <Zap className="size-3.5" /> : <Sun className="size-3.5" />}
                      Field
                    </button>
                  </div>

                  {/* Crop Selector */}
                  <button
                    onClick={() => setCropSelectorOpen(true)}
                    className="mb-6 inline-flex items-center gap-3 bg-white hover:bg-[#F6FBF6] border border-gray-200 rounded-xl px-4 py-3 transition-all group/crop shadow-sm hover:shadow-md"
                  >
                    <div className="bg-[#E8F5E9] p-2 rounded-lg group-hover/crop:bg-[#C8E6C9] transition-colors">
                      <Wheat className="size-4 text-[#2E7D32]" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Crop Type</p>
                      <p className="text-sm font-bold text-[#1B5E20] flex items-center gap-1">
                        <span>{selectedCropInfo?.icon}</span>
                        {selectedCropInfo?.name || 'Auto Detect'}
                      </p>
                    </div>
                    <ChevronRight className="size-4 text-gray-400 group-hover/crop:text-[#2E7D32] group-hover/crop:translate-x-0.5 transition-all" />
                  </button>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleUpload}
                      className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white h-12 px-7 rounded-lg shadow-[0_8px_24px_rgba(27,94,32,0.35)] hover:shadow-[0_12px_30px_rgba(27,94,32,0.45)] hover:brightness-110 transition-all flex items-center gap-2.5 font-bold"
                    >
                      <Upload className="size-5" strokeWidth={2.5} />
                      Upload Image
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleCapture}
                      className="bg-white hover:bg-gray-50 text-[#1B5E20] h-12 px-7 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all flex items-center gap-2.5 font-bold"
                    >
                      <Camera className="size-5" strokeWidth={2.5} />
                      Take Photo
                    </motion.button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </motion.div>

                {/* Right: Hero Image */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="flex-1 max-w-md lg:max-w-lg w-full"
                >
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-br from-[#2E7D32]/10 to-[#66BB6A]/10 rounded-3xl blur-2xl" />
                    <ImageWithFallback
                      src={HERO_IMAGE}
                      alt="Green plant leaves with water droplets"
                      className="relative w-full aspect-[4/3] object-cover rounded-2xl shadow-xl"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ═══════ Field Mode Banner (conditional) ═══════ */}
          <AnimatePresence>
            {fieldMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
                  <div className="bg-gradient-to-r from-[#FFF3E0] to-[#FFF8E1] border border-[#FFB74D]/40 rounded-xl p-4 flex items-start gap-3">
                    <div className="bg-[#F57C00]/10 p-2 rounded-lg flex-shrink-0">
                      <Zap className="size-4 text-[#F57C00]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#E65100] mb-0.5">Field Mode Active</p>
                      <p className="text-xs text-[#F57C00] font-medium">
                        Optimized for outdoor use: low-light enhancement, blur correction, and faster processing.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══════ 3. WHY CHOOSE PLANTCARE AI ═══════ */}
          <section className="py-14 sm:py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12"
              >
                Why Choose PlantCare AI?
              </motion.h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                {features.map((feature, index) => {
                  const FeatureIcon = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 text-center shadow-sm hover:shadow-lg hover:border-[#C8E6C9] transition-all group"
                    >
                      <div className="inline-flex items-center justify-center size-14 bg-[#E8F5E9] rounded-2xl mb-5 group-hover:bg-[#C8E6C9] transition-colors">
                        <FeatureIcon className="size-7 text-[#2E7D32]" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ═══════ 4. STATS SECTION ═══════ */}
          <section className="py-12 sm:py-16 bg-[#F9FBF9] border-y border-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="text-center"
                  >
                    <p className="text-3xl sm:text-4xl font-bold text-[#2E7D32] mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ═══════ 5. CTA BANNER ═══════ */}
          <section className="py-14 sm:py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#388E3C] rounded-2xl sm:rounded-3xl px-6 sm:px-12 py-10 sm:py-14 text-center shadow-[0_20px_50px_rgba(27,94,32,0.25)]"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Ready to Protect Your Plants?
                </h2>
                <p className="text-white/80 text-sm sm:text-base mb-8 max-w-md mx-auto">
                  Start detecting plant diseases now with our AI-powered system
                </p>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleUpload}
                  className="bg-white text-[#1B5E20] h-12 px-8 rounded-lg font-bold shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all"
                >
                  Get Started Now
                </motion.button>
              </motion.div>
            </div>
          </section>

          {/* ═══════ 6. QUICK TIP + HOW IT WORKS ═══════ */}
          <section className="py-12 sm:py-16 bg-[#F9FBF9] border-t border-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">
                About Plant Disease Detection System
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {/* Quick Tip Card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
                  <div className="bg-[#E8F5E9] p-2.5 rounded-xl flex-shrink-0">
                    <Lightbulb className="size-5 text-[#2E7D32]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-gray-900 mb-1">Quick Tip</p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      For best results, take clear close-up photos of affected leaves in natural light. Avoid shadows and blurry images.
                    </p>
                  </div>
                </div>

                {/* How It Works Card */}
                <button
                  onClick={() => setHowItWorksOpen(true)}
                  className="bg-white border border-gray-100 rounded-2xl p-6 flex items-start gap-4 shadow-sm hover:shadow-md hover:border-[#C8E6C9] transition-all text-left group/how"
                >
                  <div className="bg-[#E8F5E9] p-2.5 rounded-xl flex-shrink-0 group-hover/how:bg-[#C8E6C9] transition-colors">
                    <HelpCircle className="size-5 text-[#2E7D32]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
                      How It Works
                      <ChevronRight className="size-4 text-gray-400 group-hover/how:text-[#2E7D32] group-hover/how:translate-x-0.5 transition-all" />
                    </p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Learn the 3 simple steps to diagnose your plants using our AI-powered system.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </section>

          {/* ═══════ FOOTER ═══════ */}
          <footer className="bg-white border-t border-gray-100 py-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
              <p className="text-sm text-gray-400">
                PlantCare AI &mdash; Smart Plant Diagnostics
              </p>
            </div>
          </footer>

        </main>
      </div>

      {/* ═══════ CROP SELECTOR SHEET ═══════ */}
      <CropSelector
        isOpen={cropSelectorOpen}
        onClose={() => setCropSelectorOpen(false)}
        selectedCrop={selectedCrop}
        onSelect={handleCropSelect}
      />

      {/* ═══════ HOW IT WORKS MODAL ═══════ */}
      <AnimatePresence>
        {howItWorksOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHowItWorksOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="fixed inset-x-4 top-[15%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[420px] z-50"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                {/* Modal header */}
                <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] px-6 py-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-white text-lg font-bold">How It Works</h3>
                    <p className="text-white/70 text-xs font-medium">3 simple steps to diagnose</p>
                  </div>
                  <button
                    onClick={() => setHowItWorksOpen(false)}
                    className="p-2 hover:bg-white/15 rounded-xl transition-all"
                  >
                    <X className="size-5 text-white" />
                  </button>
                </div>

                {/* Steps */}
                <div className="p-6 space-y-1">
                  {howItWorksSteps.map((step, index) => {
                    const StepIcon = step.icon;
                    return (
                      <div key={step.title} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] size-10 rounded-xl flex items-center justify-center shadow-md">
                            <StepIcon className="size-5 text-white" />
                          </div>
                          {index < howItWorksSteps.length - 1 && (
                            <div className="w-0.5 h-8 bg-gradient-to-b from-[#2E7D32]/40 to-[#2E7D32]/10 my-1.5" />
                          )}
                        </div>
                        <div className="flex-1 pt-0.5 pb-2">
                          <h4 className="text-sm font-bold text-gray-900 mb-0.5">{step.title}</h4>
                          <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Got it button */}
                <div className="px-6 pb-6">
                  <button
                    onClick={() => setHowItWorksOpen(false)}
                    className="w-full bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white h-12 rounded-xl shadow-[0_8px_24px_rgba(27,94,32,0.3)] hover:brightness-110 transition-all font-bold text-base"
                  >
                    Got It!
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
