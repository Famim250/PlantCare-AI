/**
 * PlantCare AI Service
 * 
 * This service handles all communication with the AI model.
 * 
 * TO INTEGRATE YOUR TRAINED MODEL:
 * 1. Replace the analyzeImage function with your actual API endpoint
 * 2. Update the API_ENDPOINT constant with your backend URL
 * 3. Adjust the response mapping if your model returns different format
 * 
 * Expected model output format:
 * {
 *   class: string,           // e.g., "Tomato Early Blight"
 *   confidence: number,      // e.g., 0.95 (0-1 range)
 *   top_predictions?: { class: string; confidence: number }[]
 *   health_score?: number
 *   heatmap_regions?: { x: number; y: number; radius: number; intensity: number }[]
 * }
 */

import {
  getRandomDisease,
  getAlternativePredictions,
  calculateHealthScore,
  generateHeatmapRegions,
  type Disease,
  type AlternativePrediction,
  diseases
} from '../utils/diseases';

// ============================================
// CONFIGURATION - Update these for your model
// ============================================

const API_ENDPOINT = 'http://localhost:8000/analyze'; // Pointed to our new FastAPI backend
const USE_MOCK_DATA = false; // Disabled mock data to use real inference
const ANALYSIS_DELAY = 2500; // Simulated processing time in ms

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface AnalysisRequest {
  image: string; // Base64 encoded image or file
  imageFile?: File; // Original file if needed
  cropType?: string; // Crop-specific analysis
}

export interface AnalysisResponse {
  disease: Disease;
  confidence: number;
  processingTime?: number;
  alternatives: AlternativePrediction[];
  healthScore: {
    score: number;
    breakdown: {
      leafCondition: number;
      infectionSeverity: number;
      colorAnalysis: number;
    };
  };
  heatmapRegions: { x: number; y: number; radius: number; intensity: number }[];
  confidenceLevel: 'high' | 'medium' | 'low';
  multiDiseaseWarning: boolean;
}

export interface ModelAPIResponse {
  class: string;
  confidence: number;
  recommendations?: string[];
  top_predictions?: { class: string; confidence: number }[];
  health_score?: number;
  heatmap_regions?: { x: number; y: number; radius: number; intensity: number }[];
}

// ============================================
// MOCK IMPLEMENTATION (for MVP)
// ============================================

/**
 * Mock analysis function - simulates AI model processing
 * Remove this when integrating real model
 */
async function mockAnalyzeImage(request: AnalysisRequest): Promise<AnalysisResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, ANALYSIS_DELAY));

  // Get primary result
  let result = getRandomDisease();

  // If crop-specific, try to filter
  if (request.cropType && request.cropType !== 'auto') {
    const cropDiseases = diseases.filter(d => d.cropFamily === request.cropType);
    if (cropDiseases.length > 0) {
      const chosen = cropDiseases[Math.floor(Math.random() * cropDiseases.length)];
      result = {
        disease: chosen,
        confidence: 0.88 + Math.random() * 0.11
      };
      result.confidence = Math.round(result.confidence * 100) / 100;
    }
  }

  // Generate enriched response
  const alternatives = getAlternativePredictions(result.disease, result.confidence);
  const rawHealthScore = calculateHealthScore(result.disease, result.confidence);
  const healthScore = {
    score: rawHealthScore.score,
    breakdown: {
      leafCondition: rawHealthScore.leafCondition,
      infectionSeverity: rawHealthScore.infectionSeverity,
      colorAnalysis: rawHealthScore.colorAnalysis,
    },
  };
  const heatmapRegions = result.disease.id === 'healthy' ? [] : generateHeatmapRegions();

  const confidenceLevel: 'high' | 'medium' | 'low' =
    result.confidence >= 0.9 ? 'high' :
      result.confidence >= 0.7 ? 'medium' : 'low';

  const multiDiseaseWarning = result.confidence < 0.7 ||
    (alternatives.length > 0 && alternatives[0].confidence > 0.15);

  return {
    disease: result.disease,
    confidence: result.confidence,
    processingTime: ANALYSIS_DELAY,
    alternatives,
    healthScore,
    heatmapRegions,
    confidenceLevel,
    multiDiseaseWarning
  };
}

// ============================================
// REAL MODEL INTEGRATION (implement when ready)
// ============================================

function dataURItoBlob(dataURI: string): Blob {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

/**
 * Real AI model analysis function
 */
async function realAnalyzeImage(request: AnalysisRequest): Promise<AnalysisResponse> {
  try {
    const formData = new FormData();

    if (request.imageFile) {
      formData.append('image', request.imageFile);
    } else if (request.image && request.image.startsWith('data:')) {
      // Robustly convert data URI to exact binary blob without network fetching
      const blob = dataURItoBlob(request.image);
      formData.append('image', blob, 'image.jpg');
    } else if (request.image && typeof request.image === 'string') {
      // Fallback for mock URLs like /assets/leaf.jpg
      const response = await fetch(request.image);
      if (!response.ok) throw new Error("Could not fetch fallback image url");
      const blob = await response.blob();
      formData.append('image', blob, 'image.jpg');
    }
    // The FastAPI backend expects 'cropType'
    if (request.cropType) {
      formData.append('cropType', request.cropType);
    }

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    // Our FastAPI backend already perfectly formats the response 
    // to match the AnalysisResponse interface!
    const data = await response.json();
    return data as AnalysisResponse;

  } catch (error) {
    console.error('Error calling AI model:', error);
    throw new Error('Failed to analyze image. Please try again.');
  }
}

// ============================================
// PUBLIC API
// ============================================

/**
 * Main function to analyze a plant image
 */
export async function analyzeImage(request: AnalysisRequest): Promise<AnalysisResponse> {
  if (USE_MOCK_DATA) {
    return mockAnalyzeImage(request);
  }

  return realAnalyzeImage(request);
}

/**
 * Preprocesses image for model input
 */
export async function preprocessImage(imageData: string): Promise<string> {
  return imageData;
}

/**
 * Validates if an image is suitable for analysis
 */
export function validateImage(file: File): { valid: boolean; error?: string } {
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Please select an image file' };
  }

  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 10MB' };
  }

  return { valid: true };
}
