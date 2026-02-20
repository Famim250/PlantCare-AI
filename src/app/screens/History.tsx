import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Trash2, 
  Calendar,
  AlertCircle,
  Info,
  AlertTriangle,
  Leaf,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  List
} from 'lucide-react';
import { getSavedDiagnoses, deleteDiagnosis, type DiagnosisResult } from '../utils/diseases';
import { toast } from 'sonner';

export function History() {
  const navigate = useNavigate();
  const [diagnoses, setDiagnoses] = useState<DiagnosisResult[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');

  useEffect(() => {
    loadDiagnoses();
  }, []);

  const loadDiagnoses = () => {
    const saved = getSavedDiagnoses();
    setDiagnoses(saved);
  };

  const handleDelete = (id: string) => {
    deleteDiagnosis(id);
    loadDiagnoses();
    toast.success('Diagnosis deleted', { duration: 2000 });
  };

  const filteredDiagnoses = diagnoses.filter(d => 
    selectedFilter === 'all' || d.disease.severity === selectedFilter
  );

  // Progression data for chart
  const progressionData = useMemo(() => {
    return [...diagnoses]
      .reverse()
      .map((d, i) => ({
        index: i + 1,
        date: new Date(d.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        healthScore: d.healthScore ?? (d.disease.id === 'healthy' ? 95 : Math.max(15, 100 - (d.disease.healthScoreImpact ?? 30))),
        confidence: Math.round(d.confidence * 100),
        name: d.disease.name
      }));
  }, [diagnoses]);

  const getHealthTrend = () => {
    if (progressionData.length < 2) return 'neutral';
    const recent = progressionData.slice(-3);
    const avgRecent = recent.reduce((sum, d) => sum + d.healthScore, 0) / recent.length;
    const older = progressionData.slice(0, Math.max(1, progressionData.length - 3));
    const avgOlder = older.reduce((sum, d) => sum + d.healthScore, 0) / older.length;
    if (avgRecent > avgOlder + 5) return 'improving';
    if (avgRecent < avgOlder - 5) return 'declining';
    return 'stable';
  };

  const trend = getHealthTrend();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const severityConfig = {
    low: {
      icon: Info,
      color: 'text-[#2E7D32]',
      bg: 'bg-[#2E7D32]/15',
      border: 'border-[#2E7D32]/40'
    },
    medium: {
      icon: AlertCircle,
      color: 'text-[#F57C00]',
      bg: 'bg-[#F57C00]/15',
      border: 'border-[#F57C00]/40'
    },
    high: {
      icon: AlertTriangle,
      color: 'text-[#D32F2F]',
      bg: 'bg-[#D32F2F]/15',
      border: 'border-[#D32F2F]/40'
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="backdrop-blur-xl bg-white/90 border border-white/80 rounded-xl p-3 shadow-lg">
          <p className="text-xs font-bold text-[#1B5E20]">{data.date}</p>
          <p className="text-xs font-semibold text-[#2E7D32]">{data.name}</p>
          <p className="text-sm font-bold text-[#1B5E20] mt-1">
            Health: {data.healthScore}/100
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="size-full relative overflow-hidden bg-gradient-to-b from-[#E4F3E4] to-[#CDE7C9]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 size-[500px] bg-[#2E7D32]/8 rounded-full blur-[120px]" />
      
      <div className="relative size-full flex flex-col">
        {/* Header */}
        <header className="backdrop-blur-xl bg-white/60 border-b border-white/80 shadow-sm">
          <div className="flex items-center justify-between p-4 sm:p-5">
            <button
              onClick={() => navigate('/home')}
              className="p-2.5 hover:bg-white/70 rounded-xl transition-all"
              aria-label="Go back"
            >
              <ArrowLeft className="size-6 text-[#1B5E20]" />
            </button>
            <h1 className="text-xl text-[#1B5E20] font-bold">History</h1>
            
            {/* View Toggle */}
            {diagnoses.length > 1 && (
              <div className="flex bg-white border border-[#81C784] rounded-xl p-0.5 shadow-sm">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white shadow-[0_12px_30px_rgba(27,94,32,0.35)]' : 'text-[#1B5E20] hover:bg-[#E8F5E9]'}`}
                >
                  <List className="size-4" />
                </button>
                <button
                  onClick={() => setViewMode('chart')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'chart' ? 'bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white shadow-[0_12px_30px_rgba(27,94,32,0.35)]' : 'text-[#1B5E20] hover:bg-[#E8F5E9]'}`}
                >
                  <BarChart3 className="size-4" />
                </button>
              </div>
            )}
            {diagnoses.length <= 1 && <div className="w-10" />}
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 px-4 sm:px-5 pb-4 overflow-x-auto">
            {(['all', 'low', 'medium', 'high'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedFilter === filter
                    ? 'bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white shadow-[0_12px_30px_rgba(27,94,32,0.35)]'
                    : 'bg-white text-[#1B5E20] border border-[#81C784] hover:bg-[#E8F5E9] shadow-sm'
                }`}
              >
                {filter === 'all' ? 'All' : `${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
              </button>
            ))}
          </div>
        </header>

        {/* Main Content */}
        <main className="relative flex-1 p-4 sm:p-6 overflow-auto">
          {filteredDiagnoses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center"
            >
              <div className="backdrop-blur-xl bg-white/70 border-2 border-white/90 p-10 rounded-full mb-6 shadow-2xl">
                <Leaf className="size-20 text-[#2E7D32]" strokeWidth={2} />
              </div>
              <h2 className="text-3xl mb-3 text-[#1B5E20] font-bold">No Diagnoses</h2>
              <p className="text-[#2E7D32] mb-8 max-w-sm font-semibold">
                {selectedFilter === 'all'
                  ? 'Start scanning plants to build your history'
                  : `No ${selectedFilter} severity diagnoses found`}
              </p>
              <button
                onClick={() => navigate('/home')}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-[0.875rem] blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="relative bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white px-8 py-4 rounded-[0.875rem] shadow-[0_12px_30px_rgba(27,94,32,0.35)] group-hover:brightness-110 transition-all font-bold">
                  Start Scanning
                </div>
              </button>
            </motion.div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-5">
              
              {/* Progression Chart View */}
              {viewMode === 'chart' && progressionData.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Trend Card */}
                  <div className="backdrop-blur-xl bg-white/65 border border-white/80 rounded-[1.5rem] p-5 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base text-[#1B5E20] font-bold flex items-center gap-2">
                        <BarChart3 className="size-5 text-[#2E7D32]" />
                        Health Score Over Time
                      </h3>
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                        trend === 'improving' ? 'bg-[#2E7D32]/10 text-[#2E7D32]' :
                        trend === 'declining' ? 'bg-[#D32F2F]/10 text-[#D32F2F]' :
                        'bg-[#F57C00]/10 text-[#F57C00]'
                      }`}>
                        {trend === 'improving' ? <TrendingUp className="size-3.5" /> :
                         trend === 'declining' ? <TrendingDown className="size-3.5" /> :
                         <Minus className="size-3.5" />}
                        {trend === 'improving' ? 'Improving' : trend === 'declining' ? 'Declining' : 'Stable'}
                      </div>
                    </div>

                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={progressionData}>
                          <defs>
                            <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#A5D6A7" strokeOpacity={0.4} />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 10, fill: '#2E7D32', fontWeight: 600 }}
                            axisLine={{ stroke: '#A5D6A7' }}
                            tickLine={false}
                          />
                          <YAxis 
                            domain={[0, 100]} 
                            tick={{ fontSize: 10, fill: '#2E7D32', fontWeight: 600 }}
                            axisLine={{ stroke: '#A5D6A7' }}
                            tickLine={false}
                            width={30}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Area 
                            type="monotone" 
                            dataKey="healthScore" 
                            stroke="#2E7D32" 
                            strokeWidth={2.5}
                            fill="url(#healthGradient)"
                            dot={{ fill: '#2E7D32', strokeWidth: 2, stroke: '#fff', r: 4 }}
                            activeDot={{ r: 6, stroke: '#2E7D32', strokeWidth: 2 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <p className="text-xs font-semibold text-[#2E7D32] text-center mt-3">
                      {trend === 'improving' 
                        ? 'Your plants are showing signs of recovery.' 
                        : trend === 'declining'
                          ? 'Consider adjusting your treatment approach.'
                          : 'Health scores are holding steady.'}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-3">
                  {filteredDiagnoses.map((diagnosis, index) => {
                    const config = severityConfig[diagnosis.disease.severity || 'low'];
                    const SeverityIcon = config.icon;
                    const score = diagnosis.healthScore ?? (diagnosis.disease.id === 'healthy' ? 95 : Math.max(15, 100 - (diagnosis.disease.healthScoreImpact || 30)));

                    return (
                      <motion.div
                        key={diagnosis.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        className="backdrop-blur-xl bg-white/65 border border-white/80 rounded-[1.5rem] overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                      >
                        <div className="flex gap-3 p-4">
                          {/* Thumbnail */}
                          <div className="relative size-20 sm:size-28 rounded-2xl overflow-hidden flex-shrink-0 backdrop-blur-md bg-white/50 border border-white/70 shadow-md">
                            <img
                              src={diagnosis.imageUrl}
                              alt={diagnosis.disease.name}
                              className="size-full object-cover"
                            />
                            {/* Health Score badge on thumbnail */}
                            <div className={`absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white shadow-md ${
                              score >= 70 ? 'bg-[#2E7D32]' : score >= 40 ? 'bg-[#F57C00]' : 'bg-[#D32F2F]'
                            }`}>
                              {score}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <h3 className="font-bold text-[#1B5E20] text-base line-clamp-1">
                                {diagnosis.disease.name}
                              </h3>
                              <button
                                onClick={() => handleDelete(diagnosis.id)}
                                className="p-1.5 hover:bg-[#D32F2F]/10 rounded-full transition-all flex-shrink-0"
                                aria-label="Delete diagnosis"
                              >
                                <Trash2 className="size-4 text-[#D32F2F]" />
                              </button>
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5 mb-2">
                              <div className={`flex items-center gap-1 ${config.bg} border ${config.border} backdrop-blur-sm px-2 py-1 rounded-full`}>
                                <SeverityIcon className={`size-3 ${config.color}`} />
                                <span className={`text-[10px] font-bold ${config.color} capitalize`}>
                                  {diagnosis.disease.severity}
                                </span>
                              </div>

                              <div className="backdrop-blur-sm bg-[#2E7D32]/8 border border-[#2E7D32]/20 px-2 py-1 rounded-full">
                                <span className="text-[10px] font-bold text-[#1B5E20]">
                                  {Math.round(diagnosis.confidence * 100)}%
                                </span>
                              </div>

                              <div className="flex items-center gap-1 text-[#2E7D32] text-[10px] font-semibold">
                                <Calendar className="size-3" />
                                <span>{formatDate(diagnosis.timestamp)}</span>
                              </div>
                            </div>

                            <p className="text-xs text-[#1B5E20] line-clamp-2 font-semibold">
                              {diagnosis.disease.recommendations[0]}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Chart view items */}
              {viewMode === 'chart' && (
                <div className="space-y-3">
                  {filteredDiagnoses.map((diagnosis, index) => {
                    const score = diagnosis.healthScore ?? (diagnosis.disease.id === 'healthy' ? 95 : Math.max(15, 100 - (diagnosis.disease.healthScoreImpact || 30)));
                    return (
                      <motion.div
                        key={diagnosis.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.04 }}
                        className="backdrop-blur-xl bg-white/55 border border-white/70 rounded-2xl p-4 shadow-md flex items-center gap-3"
                      >
                        <div className={`size-10 rounded-xl flex items-center justify-center text-sm text-white font-bold shadow-md ${
                          score >= 70 ? 'bg-gradient-to-br from-[#2E7D32] to-[#388E3C]' : score >= 40 ? 'bg-gradient-to-br from-[#F57C00] to-[#FB8C00]' : 'bg-gradient-to-br from-[#D32F2F] to-[#E53935]'
                        }`}>
                          {score}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#1B5E20] truncate">{diagnosis.disease.name}</p>
                          <p className="text-xs font-semibold text-[#2E7D32]">{formatDate(diagnosis.timestamp)}</p>
                        </div>
                        <span className="text-xs font-bold text-[#2E7D32]">{Math.round(diagnosis.confidence * 100)}%</span>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}