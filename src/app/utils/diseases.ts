export interface TreatmentPlan {
  immediate: string[];
  organic: string[];
  chemical: string[];
  prevention: string[];
  recoveryTimeline: string;
}

export interface Disease {
  id: string;
  name: string;
  scientificName?: string;
  pathogenType?: string;
  spreadMechanism?: string;
  cropFamily: string;
  recommendations: string[];
  severity: 'low' | 'medium' | 'high';
  treatment: TreatmentPlan;
  beginnerDescription: string;
  advancedDescription: string;
  commonRegions: string[];
  seasonalRisk: string[];
  healthScoreImpact: number; // 0-100, how much this disease reduces plant health
}

export interface AlternativePrediction {
  disease: Disease;
  confidence: number;
}

export const cropFamilies = [
  { id: 'tomato', name: 'Tomato', icon: '🍅' },
  { id: 'potato', name: 'Potato', icon: '🥔' },
  { id: 'corn', name: 'Corn', icon: '🌽' },
  { id: 'wheat', name: 'Wheat', icon: '🌾' },
  { id: 'grape', name: 'Grape', icon: '🍇' },
  { id: 'apple', name: 'Apple', icon: '🍎' },
  { id: 'rice', name: 'Rice', icon: '🌾' },
  { id: 'pepper', name: 'Pepper', icon: '🌶️' },
  { id: 'citrus', name: 'Citrus', icon: '🍊' },
  { id: 'auto', name: 'Auto Detect', icon: '🔍' },
];

export const diseases: Disease[] = [
  {
    id: 'tomato-early-blight',
    name: 'Tomato Early Blight',
    scientificName: 'Alternaria solani',
    pathogenType: 'Fungal pathogen (Ascomycete)',
    spreadMechanism: 'Wind-borne spores, rain splash, contaminated soil debris. Survives in plant residue over winter.',
    cropFamily: 'tomato',
    recommendations: [
      'Remove infected leaves immediately',
      'Apply copper-based fungicide spray',
      'Increase airflow around plants',
      'Water at soil level, avoid wetting leaves',
      'Mulch to prevent soil splash'
    ],
    severity: 'medium',
    treatment: {
      immediate: [
        'Remove all affected leaves and stems — bag and dispose, do not compost',
        'Isolate infected plants from healthy ones if possible',
        'Reduce overhead watering immediately'
      ],
      organic: [
        'Neem oil spray (2 tbsp per gallon water) every 7 days',
        'Copper fungicide (Bordeaux mixture) application',
        'Baking soda spray (1 tbsp per gallon + liquid soap)',
        'Compost tea foliar spray to boost beneficial microbes'
      ],
      chemical: [
        'Chlorothalonil-based fungicide (e.g., Daconil)',
        'Mancozeb 75% WP — apply at 2g/L every 10 days',
        'Azoxystrobin (Quadris) for systemic protection'
      ],
      prevention: [
        'Rotate crops — avoid planting tomatoes in same spot for 3 years',
        'Plant resistant varieties (e.g., Mountain Magic, Defiant)',
        'Mulch heavily to prevent soil splash onto lower leaves',
        'Ensure 24" spacing between plants for air circulation',
        'Water early morning at soil level only'
      ],
      recoveryTimeline: '2-4 weeks with proper treatment. New growth should appear healthy within 10 days of fungicide application.'
    },
    beginnerDescription: 'Your tomato plant has dark spots on its lower leaves that spread outward in rings. This is a common fungal issue that can be treated with simple sprays.',
    advancedDescription: 'Alternaria solani infection detected. Characteristic concentric ring lesions (target spots) on older foliage indicate early blight. The fungus overwinters in plant debris and produces conidia that spread via wind and rain splash. Optimal conditions: 75-85°F with alternating wet/dry periods.',
    commonRegions: ['Southeast US', 'Midwest US', 'Mediterranean', 'South Asia', 'East Africa'],
    seasonalRisk: ['Late Spring', 'Summer', 'Early Fall'],
    healthScoreImpact: 35
  },
  {
    id: 'tomato-late-blight',
    name: 'Tomato Late Blight',
    scientificName: 'Phytophthora infestans',
    pathogenType: 'Oomycete (water mold)',
    spreadMechanism: 'Airborne sporangia can travel 30+ miles. Thrives in cool, wet conditions. Devastated Irish potato crops in 1845.',
    cropFamily: 'tomato',
    recommendations: [
      'Remove and destroy infected plants',
      'Apply fungicide immediately',
      'Improve air circulation',
      'Avoid overhead watering',
      'Plant resistant varieties next season'
    ],
    severity: 'high',
    treatment: {
      immediate: [
        'URGENT: Remove and destroy all infected plant material immediately',
        'Do NOT compost infected tissue — burn or bag for landfill',
        'Alert nearby gardeners — this spreads rapidly',
        'Apply fungicide to remaining healthy plants within 24 hours'
      ],
      organic: [
        'Copper hydroxide spray — apply immediately and repeat every 5-7 days',
        'Bacillus subtilis (Serenade) biological fungicide',
        'Remove lower 12" of foliage to reduce humidity around stems'
      ],
      chemical: [
        'Mefenoxam/Metalaxyl (Ridomil Gold) — systemic protection',
        'Cymoxanil + Mancozeb combination spray',
        'Phosphorous acid (Phostrol) as preventive drench'
      ],
      prevention: [
        'Plant only certified disease-free transplants',
        'Choose resistant varieties (e.g., Mountain Merit, Plum Regal)',
        'Avoid planting near potatoes — shared pathogen',
        'Install drip irrigation to keep foliage dry',
        'Monitor weather forecasts — apply preventive spray before cool/wet periods'
      ],
      recoveryTimeline: 'Severe cases: affected plants rarely recover fully. With early detection and aggressive treatment, spread can be contained in 1-2 weeks. Healthy new growth in 2-3 weeks.'
    },
    beginnerDescription: 'This is a serious infection causing large dark blotches on leaves and stems. The plant needs immediate attention — remove sick parts right away and treat with fungicide.',
    advancedDescription: 'Phytophthora infestans detected — the same oomycete responsible for the Irish Potato Famine. Water-soaked lesions with white sporulation on leaf undersides indicate active infection. Sporangia are wind-dispersed and can initiate new infections in 8-12 hours under favorable conditions (50-60°F, >90% humidity).',
    commonRegions: ['Northern US', 'UK', 'Ireland', 'Northern Europe', 'Andes Region'],
    seasonalRisk: ['Late Summer', 'Fall', 'Cool Wet Periods'],
    healthScoreImpact: 65
  },
  {
    id: 'potato-late-blight',
    name: 'Potato Late Blight',
    scientificName: 'Phytophthora infestans',
    pathogenType: 'Oomycete (water mold)',
    spreadMechanism: 'Soilborne via infected tubers, airborne sporangia. Can survive in volunteer potatoes and cull piles.',
    cropFamily: 'potato',
    recommendations: [
      'Remove infected foliage',
      'Apply copper fungicide',
      'Harvest tubers quickly if disease spreads',
      'Ensure good drainage',
      'Use certified disease-free seed potatoes'
    ],
    severity: 'high',
    treatment: {
      immediate: [
        'Kill all above-ground foliage (vine kill) to prevent tuber infection',
        'Wait 2-3 weeks before harvesting to let skin set',
        'Remove all volunteer potato plants in the area'
      ],
      organic: [
        'Copper-based fungicide (Bordeaux mixture) every 5-7 days during wet weather',
        'Bacillus amyloliquefaciens biological control agent',
        'Hilling potatoes deeply to protect tubers from sporangia wash-down'
      ],
      chemical: [
        'Mancozeb + Cymoxanil preventive/curative spray',
        'Metalaxyl-M (Ridomil Gold) soil drench for tuber protection',
        'Fluazinam (Shirlan) protective spray every 7-10 days'
      ],
      prevention: [
        'Use ONLY certified disease-free seed potatoes',
        'Destroy cull piles and volunteer plants every spring',
        'Plant resistant varieties (e.g., Sarpo Mira, Defender)',
        'Maintain 3-year crop rotation away from solanaceous crops',
        'Monitor blight forecasting services (e.g., BlightWatch)'
      ],
      recoveryTimeline: 'Tubers may still be salvageable if harvested carefully after vine kill. Sort stored potatoes frequently — infected tubers rot within 2-4 weeks.'
    },
    beginnerDescription: 'Your potato plant has brown, water-soaked patches that are spreading fast. This is serious — you need to act quickly to save the tubers underground.',
    advancedDescription: 'P. infestans zoospores have infected the foliage. Characteristic brown lesions with light green halos and white mycelial growth on abaxial leaf surfaces. Risk of tuber infection via sporangia washing through soil profile during rain events.',
    commonRegions: ['Northern Europe', 'Pacific Northwest US', 'Andes', 'Central Asia', 'East Africa'],
    seasonalRisk: ['Summer', 'Early Fall'],
    healthScoreImpact: 60
  },
  {
    id: 'potato-early-blight',
    name: 'Potato Early Blight',
    scientificName: 'Alternaria solani',
    pathogenType: 'Fungal pathogen (Ascomycete)',
    spreadMechanism: 'Soil-borne and airborne conidia. Overwinters in crop debris. Favors stressed plants.',
    cropFamily: 'potato',
    recommendations: [
      'Remove lower infected leaves',
      'Apply fungicide every 7-10 days',
      'Maintain plant vigor with proper fertilization',
      'Rotate crops annually',
      'Mulch to reduce soil splash'
    ],
    severity: 'medium',
    treatment: {
      immediate: [
        'Remove the lowest 8-10 leaves showing symptoms',
        'Apply nitrogen fertilizer to boost plant vigor',
        'Begin fungicide program immediately'
      ],
      organic: [
        'Neem oil weekly spray during active growth',
        'Copper fungicide every 7-10 days',
        'Trichoderma-based biofungicide soil application'
      ],
      chemical: [
        'Chlorothalonil (Bravo) preventive spray',
        'Azoxystrobin (Amistar) systemic fungicide',
        'Difenoconazole + Azoxystrobin combination'
      ],
      prevention: [
        'Maintain adequate nitrogen fertility — stressed plants are most susceptible',
        'Irrigate consistently to avoid plant stress',
        '3-year rotation away from Solanaceae family',
        'Remove all crop debris after harvest',
        'Hill potatoes to protect tubers'
      ],
      recoveryTimeline: '10-14 days with consistent fungicide application. Maintain treatment through harvest for best tuber quality.'
    },
    beginnerDescription: 'The dark target-shaped spots on lower leaves are a common fungal problem. Keep your plant well-fed and apply a simple copper spray to manage it.',
    advancedDescription: 'Alternaria solani infection characterized by bullseye-pattern necrotic lesions on senescent foliage. Pathogen preferentially attacks nutrient-deficient or stressed tissue. Conidia production peaks at 77-86°F with alternating wet/dry cycles.',
    commonRegions: ['Global temperate zones', 'Midwest US', 'Northern India', 'Central Europe'],
    seasonalRisk: ['Mid-Summer', 'Late Summer'],
    healthScoreImpact: 30
  },
  {
    id: 'corn-rust',
    name: 'Corn Common Rust',
    scientificName: 'Puccinia sorghi',
    pathogenType: 'Obligate biotrophic fungus (Basidiomycete)',
    spreadMechanism: 'Wind-dispersed urediniospores — can travel hundreds of miles. Cannot survive without living host tissue.',
    cropFamily: 'corn',
    recommendations: [
      'Plant resistant hybrids',
      'Apply fungicide if severe',
      'Ensure adequate plant spacing',
      'Remove heavily infected leaves',
      'Monitor regularly during humid weather'
    ],
    severity: 'low',
    treatment: {
      immediate: [
        'Monitor pustule density — treatment usually only needed above 1 pustule per leaf',
        'Scout fields regularly during tasseling stage',
        'Remove heavily infected lower leaves if practical'
      ],
      organic: [
        'Sulfur-based fungicide spray as preventive',
        'Potassium bicarbonate foliar spray',
        'Maintain plant health through balanced fertilization'
      ],
      chemical: [
        'Azoxystrobin + Propiconazole (Quilt) at tasseling',
        'Pyraclostrobin (Headline) single application',
        'Trifloxystrobin (Flint) preventive spray'
      ],
      prevention: [
        'Plant Rp gene-resistant hybrids (consult local extension)',
        'Early planting to escape peak rust pressure',
        'Balanced fertility — excess nitrogen increases susceptibility',
        'Ensure adequate stand density for good air circulation'
      ],
      recoveryTimeline: 'Minor infections: plants outgrow damage within 2-3 weeks. Yield impact typically <5% in resistant hybrids.'
    },
    beginnerDescription: 'Those small reddish-brown bumps on the corn leaves are rust — a common fungal issue. Most modern corn varieties can handle this, but keep an eye on it.',
    advancedDescription: 'Puccinia sorghi uredinia observed. Cinnamon-brown oval pustules on both leaf surfaces indicate active uredinial stage. The pathogen requires an alternate host (Oxalis spp.) for sexual reproduction. Most significant yield impact occurs when infection begins before tasseling.',
    commonRegions: ['Corn Belt US', 'Brazil', 'Sub-Saharan Africa', 'Southeast Asia'],
    seasonalRisk: ['Mid-Summer', 'Late Summer'],
    healthScoreImpact: 15
  },
  {
    id: 'wheat-rust',
    name: 'Wheat Leaf Rust',
    scientificName: 'Puccinia triticina',
    pathogenType: 'Obligate biotrophic fungus (Basidiomycete)',
    spreadMechanism: 'Long-distance wind dispersal of urediniospores. Major pathotype shifts driven by sexual recombination on alternate hosts.',
    cropFamily: 'wheat',
    recommendations: [
      'Use resistant wheat varieties',
      'Apply fungicide at first sign',
      'Plant early to avoid disease peak',
      'Remove volunteer wheat plants',
      'Monitor weather conditions'
    ],
    severity: 'medium',
    treatment: {
      immediate: [
        'Apply fungicide immediately if flag leaf is threatened',
        'Scout for rust severity — economic threshold is 1-5% on flag leaf',
        'Prioritize protecting the top two leaves'
      ],
      organic: [
        'Limited organic options — focus on resistant varieties',
        'Sulfur dust application may provide partial control',
        'Silica-based foliar sprays to strengthen leaf cuticle'
      ],
      chemical: [
        'Tebuconazole (Folicur) — single application at flag leaf emergence',
        'Propiconazole + Azoxystrobin (Quilt Xcel) dual-mode',
        'Metconazole (Caramba) for resistant populations'
      ],
      prevention: [
        'Plant varieties with Lr gene resistance (consult regional breeding programs)',
        'Destroy volunteer wheat and alternate hosts (Thalictrum spp.)',
        'Adjust planting date based on regional rust forecasts',
        'Balanced nitrogen — avoid excess N application'
      ],
      recoveryTimeline: 'Single fungicide application protects for 21-28 days. If flag leaf is protected, yield impact is minimal.'
    },
    beginnerDescription: 'Orange-brown dusty spots on wheat leaves mean rust fungus is present. One spray at the right time can protect your crop effectively.',
    advancedDescription: 'Puccinia triticina uredinia detected. Orange-brown circular pustules primarily on adaxial leaf surface. Race analysis recommended to guide Lr gene deployment. Aecial stage occurs on Thalictrum spp. in regions where sexual cycle completes.',
    commonRegions: ['Great Plains US', 'South America', 'South Asia', 'Australia', 'East Africa'],
    seasonalRisk: ['Spring', 'Early Summer'],
    healthScoreImpact: 35
  },
  {
    id: 'grape-black-rot',
    name: 'Grape Black Rot',
    scientificName: 'Guignardia bidwellii',
    pathogenType: 'Fungal pathogen (Ascomycete)',
    spreadMechanism: 'Rain-splash of ascospores from overwintering mummies. Infection requires 6+ hours of leaf wetness.',
    cropFamily: 'grape',
    recommendations: [
      'Remove mummified berries',
      'Prune for better air circulation',
      'Apply fungicide from bloom through harvest',
      'Remove infected leaves',
      'Practice good sanitation'
    ],
    severity: 'high',
    treatment: {
      immediate: [
        'Remove ALL mummified berries from vines and ground — this is the primary inoculum',
        'Prune out infected canes during dormant season',
        'Begin fungicide program before bloom'
      ],
      organic: [
        'Sulfur spray every 7-10 days from bud break through veraison',
        'Copper hydroxide (Kocide) at bud swell',
        'Thorough canopy management to reduce leaf wetness duration'
      ],
      chemical: [
        'Myclobutanil (Rally) — excellent systemic activity, apply at bloom',
        'Mancozeb (Dithane) protective spray pre-bloom',
        'Azoxystrobin (Abound) + Tebuconazole tank mix for resistance management'
      ],
      prevention: [
        'Remove ALL mummies — a single mummified berry can produce 1M+ spores',
        'Open canopy architecture for maximum air flow',
        'Orient rows for morning sun exposure to dry dew quickly',
        'Maintain spray program from 10" shoot growth through 4 weeks post-bloom',
        'Consider resistant varieties (e.g., Chambourcin, Norton)'
      ],
      recoveryTimeline: 'Infected berries cannot recover. Focus shifts to protecting remaining healthy fruit. Full season management needed — expect 2-3 years to achieve clean vineyard from heavy infection.'
    },
    beginnerDescription: 'The berries are turning hard, black, and shriveled — this is black rot fungus. Remove all the dried-up berries and start spraying before flowers open next year.',
    advancedDescription: 'Guignardia bidwellii infection confirmed. Tan leaf lesions with dark borders precede berry infection. Ascospore discharge from pseudothecia in overwintering mummies is primary inoculum. Berry susceptibility peaks from bloom through 4 weeks post-bloom, then declines sharply as sugar content rises.',
    commonRegions: ['Eastern US', 'Southeast US', 'Southern Europe', 'Humid wine regions'],
    seasonalRisk: ['Late Spring', 'Summer'],
    healthScoreImpact: 55
  },
  {
    id: 'apple-scab',
    name: 'Apple Scab',
    scientificName: 'Venturia inaequalis',
    pathogenType: 'Fungal pathogen (Ascomycete)',
    spreadMechanism: 'Ascospores from leaf litter in spring, then conidia for secondary spread. Requires 9+ hours leaf wetness for infection.',
    cropFamily: 'apple',
    recommendations: [
      'Rake and remove fallen leaves',
      'Apply fungicide at bud break',
      'Prune to improve air circulation',
      'Plant resistant varieties',
      'Continue spraying through wet weather'
    ],
    severity: 'medium',
    treatment: {
      immediate: [
        'Apply curative fungicide within 72 hours of infection period',
        'Remove heavily scabbed fruit to reduce secondary inoculum',
        'Maintain spray schedule through primary scab season (green tip to 2nd cover)'
      ],
      organic: [
        'Sulfur spray — apply before rain events during primary season',
        'Lime-sulfur at green tip for early protection',
        'Urea spray (5%) on fallen leaves in autumn to accelerate decomposition'
      ],
      chemical: [
        'Captan + Myclobutanil combination for preventive/curative activity',
        'Dodine (Syllit) for early-season protective sprays',
        'Difenoconazole (Inspire) post-infection kickback treatment'
      ],
      prevention: [
        'Shred or remove fallen leaves in autumn (reduces spring inoculum 80%+)',
        'Plant scab-resistant cultivars (e.g., Liberty, Enterprise, GoldRush)',
        'Prune for open center canopy to speed leaf drying',
        'Use Mills Table infection periods to time sprays precisely',
        'Maintain spray coverage on new growth through June'
      ],
      recoveryTimeline: 'Existing scab lesions are permanent but sporulation can be stopped. Clean new growth within 7-14 days of effective treatment. Long-term: 1-2 years of good sanitation dramatically reduces pressure.'
    },
    beginnerDescription: 'Dark, scaly patches on leaves and fruit are apple scab. Clean up fallen leaves in autumn and spray at bud break — that alone makes a big difference.',
    advancedDescription: 'Venturia inaequalis ascospore-driven primary infection confirmed. Olive-green velvety lesions on adaxial leaf surface with conidiophore production indicate active sporulation. Use Mills Table (temperature × wetness duration) to predict infection periods and optimize spray timing.',
    commonRegions: ['Northeast US', 'Pacific Northwest', 'Northern Europe', 'UK', 'New Zealand'],
    seasonalRisk: ['Spring', 'Early Summer'],
    healthScoreImpact: 30
  },
  {
    id: 'healthy',
    name: 'Healthy Plant',
    scientificName: undefined,
    pathogenType: undefined,
    spreadMechanism: undefined,
    cropFamily: 'auto',
    recommendations: [
      'Continue regular watering schedule',
      'Maintain proper fertilization',
      'Monitor for early signs of stress',
      'Ensure good air circulation',
      'Keep area free of plant debris'
    ],
    severity: 'low',
    treatment: {
      immediate: [
        'No treatment needed — your plant looks great!',
        'Continue current care routine'
      ],
      organic: [
        'Compost tea foliar spray monthly for micronutrient boost',
        'Mulch 2-3 inches around base for moisture retention',
        'Introduce beneficial insects (ladybugs, lacewings)'
      ],
      chemical: [
        'No chemical treatment required',
        'Consider slow-release balanced fertilizer if growth is slow'
      ],
      prevention: [
        'Regular monitoring — catch problems early',
        'Maintain consistent watering schedule',
        'Practice crop rotation annually',
        'Keep tools clean to prevent pathogen spread',
        'Test soil pH annually'
      ],
      recoveryTimeline: 'No recovery needed. Maintain current practices for continued plant health.'
    },
    beginnerDescription: 'Great news! Your plant looks healthy with no signs of disease. Keep doing what you\'re doing!',
    advancedDescription: 'No pathogenic signatures detected. Leaf coloration, turgor, and morphology within normal parameters. Chlorophyll distribution appears uniform. No evidence of biotic or abiotic stress markers.',
    commonRegions: [],
    seasonalRisk: [],
    healthScoreImpact: 0
  }
];

export function getRandomDisease(): { disease: Disease; confidence: number } {
  const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
  const confidence = 0.85 + Math.random() * 0.14; // 85-99% confidence
  
  return {
    disease: randomDisease,
    confidence: Math.round(confidence * 100) / 100
  };
}

export function getAlternativePredictions(primary: Disease, primaryConfidence: number): AlternativePrediction[] {
  const remaining = diseases.filter(d => d.id !== primary.id && d.id !== 'healthy');
  const shuffled = remaining.sort(() => Math.random() - 0.5);
  const alternatives = shuffled.slice(0, 2);
  
  const remainingConf = (1 - primaryConfidence);
  const second = remainingConf * (0.5 + Math.random() * 0.3);
  const third = remainingConf - second;
  
  return alternatives.map((d, i) => ({
    disease: d,
    confidence: Math.round((i === 0 ? second : third) * 100) / 100
  }));
}

export function calculateHealthScore(disease: Disease, confidence: number): {
  score: number;
  leafCondition: number;
  infectionSeverity: number;
  colorAnalysis: number;
} {
  const base = 100 - disease.healthScoreImpact;
  const severityMultiplier = disease.severity === 'high' ? 0.85 : disease.severity === 'medium' ? 0.92 : 1;
  const confAdjust = confidence > 0.9 ? 1 : 1.05;
  
  const score = Math.max(5, Math.min(100, Math.round(base * severityMultiplier * confAdjust)));
  
  const leafCondition = disease.id === 'healthy' ? 95 + Math.round(Math.random() * 5) : Math.max(10, score + Math.round((Math.random() - 0.5) * 20));
  const infectionSeverity = disease.id === 'healthy' ? 0 : Math.min(100, 100 - score + Math.round(Math.random() * 15));
  const colorAnalysis = disease.id === 'healthy' ? 90 + Math.round(Math.random() * 10) : Math.max(15, score + Math.round((Math.random() - 0.5) * 15));
  
  return {
    score: Math.min(100, Math.max(0, score)),
    leafCondition: Math.min(100, Math.max(0, leafCondition)),
    infectionSeverity: Math.min(100, Math.max(0, infectionSeverity)),
    colorAnalysis: Math.min(100, Math.max(0, colorAnalysis))
  };
}

export function generateHeatmapRegions(): { x: number; y: number; radius: number; intensity: number }[] {
  const count = 2 + Math.floor(Math.random() * 3);
  const regions: { x: number; y: number; radius: number; intensity: number }[] = [];
  
  for (let i = 0; i < count; i++) {
    regions.push({
      x: 0.2 + Math.random() * 0.6,
      y: 0.2 + Math.random() * 0.6,
      radius: 0.08 + Math.random() * 0.15,
      intensity: 0.5 + Math.random() * 0.5
    });
  }
  
  return regions;
}

export interface DiagnosisResult {
  id: string;
  timestamp: number;
  imageUrl: string;
  disease: Disease;
  confidence: number;
  healthScore?: number;
  cropType?: string;
}

export function saveDiagnosis(result: Omit<DiagnosisResult, 'id' | 'timestamp'>): DiagnosisResult {
  const diagnosis: DiagnosisResult = {
    ...result,
    id: Date.now().toString(),
    timestamp: Date.now()
  };
  
  const saved = getSavedDiagnoses();
  saved.unshift(diagnosis);
  localStorage.setItem('plantcare-diagnoses', JSON.stringify(saved));
  
  return diagnosis;
}

export function getSavedDiagnoses(): DiagnosisResult[] {
  const saved = localStorage.getItem('plantcare-diagnoses');
  return saved ? JSON.parse(saved) : [];
}

export function deleteDiagnosis(id: string): void {
  const saved = getSavedDiagnoses();
  const filtered = saved.filter(d => d.id !== id);
  localStorage.setItem('plantcare-diagnoses', JSON.stringify(filtered));
}

// User preferences stored in localStorage
export interface UserPreferences {
  mode: 'beginner' | 'advanced';
  selectedCrop: string;
  fieldMode: boolean;
  dataContribution: boolean;
  region: string;
}

export function getUserPreferences(): UserPreferences {
  const saved = localStorage.getItem('plantcare-preferences');
  if (saved) return JSON.parse(saved);
  return {
    mode: 'beginner',
    selectedCrop: 'auto',
    fieldMode: false,
    dataContribution: false,
    region: 'Auto Detect'
  };
}

export function saveUserPreferences(prefs: Partial<UserPreferences>): void {
  const current = getUserPreferences();
  const updated = { ...current, ...prefs };
  localStorage.setItem('plantcare-preferences', JSON.stringify(updated));
}
